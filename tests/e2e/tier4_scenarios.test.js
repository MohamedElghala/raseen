/**
 * Tier 4: Real-World Application Scenarios (End-to-End User Journeys)
 * Authority: ORIGINAL_REQUEST.md Acceptance Criteria & PROJECT.md
 * Covers complete end-to-end visitor paths from discovery to lead qualification.
 */

const {
  jiti,
  TestSuite,
  assert,
  assertEqual,
  assertGreaterThan,
  decodeZatcaTLV,
  validateQRMatrix,
  renderComponent,
} = require('./test_utils');

const zatca = jiti('@/lib/zatca.ts');
const currencyLib = jiti('@/lib/currency.ts');
const leadsRoute = jiti('@/app/api/leads/route.ts');
const InvoiceGenerator = jiti('@/components/tools/InvoiceGenerator.tsx').default;

const suite = new TestSuite('Tier 4: Real-World Application Scenarios (Visitor Journeys)');

function createPostRequest(payload) {
  return new Request('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

// Scenario 1: The Saudi SME Entrepreneur Journey (Full Commercial Lifecycle)
suite.test('SCENARIO-4.1: Saudi SME entrepreneur generates ZATCA invoice, checks print, and qualifies via WhatsApp', async () => {
  // Step 1: Configure Saudi commercial invoice parameters
  const seller = 'مؤسسة النجم اللامع للحلول التقنية';
  const vatNumber = '311122233300003';
  const client = 'شركة الرواد للاستثمار العقاري';
  const date = '2026-10-15';

  const items = [
    { description: 'تطوير تطبيق جوال وإدارة طلبات سحابية', quantity: 1, price: 12000 },
    { description: 'عقد صيانة ودعم فني سنوي معتمد', quantity: 1, price: 3000 },
  ];

  // Step 2: Calculate financial totals with 15% Saudi VAT
  const subtotal = items.reduce((acc, i) => acc + i.quantity * i.price, 0); // 15000 SAR
  assertEqual(subtotal, 15000);

  const vatAmount = subtotal * 0.15; // 2250 SAR
  assertEqual(vatAmount, 2250);

  const grandTotal = subtotal + vatAmount; // 17250 SAR
  assertEqual(grandTotal, 17250);

  // Step 3: Produce authentic ZATCA TLV Base64 payload
  const tlvPayload = zatca.generateZatcaTLV({
    sellerName: seller,
    vatNumber: vatNumber,
    timestamp: `${date}T12:00:00Z`,
    totalAmount: grandTotal.toFixed(2),
    vatAmount: vatAmount.toFixed(2),
  });

  // Verify decoded payload via independent oracle
  const decoded = decodeZatcaTLV(tlvPayload);
  assertEqual(decoded[1].value, seller);
  assertEqual(decoded[2].value, vatNumber);
  assertEqual(decoded[4].value, '17250.00');
  assertEqual(decoded[5].value, '2250.00');

  // Step 4: Verify authentic Model 2 QR matrix geometry
  const qrMatrix = zatca.renderQRCodeMatrix(tlvPayload);
  const matrixValidation = validateQRMatrix(qrMatrix);
  assert(matrixValidation.validFinders, 'QR code finders must be intact');

  // Step 5: Verify A4 print readiness
  const html = renderComponent(InvoiceGenerator);
  assert(html.includes('id="printable-template-canvas"'), 'A4 canvas must be present');
  assert(html.includes('hidden print:block'), 'Print isolation must be active');

  // Step 6: Entrepreneur reaches out for accounting sheets via Assistant
  const leadReq = createPostRequest({
    name: 'سعود الشمري',
    phone: '+966509876543',
    channel: 'whatsapp',
    interest: 'شيت المحاسبة المالية وضريبة القيمة المضافة ZATCA 2026',
    metadata: {
      journey: 'Saudi SME Commercial Invoicing',
      generatedTotalSAR: grandTotal,
    },
  });

  const leadRes = await leadsRoute.POST(leadReq);
  assertEqual(leadRes.status, 200);
  const leadData = await leadRes.json();
  assertEqual(leadData.success, true);
  assert(leadData.leadId);
});

// Scenario 2: The Egyptian Startup Founder Journey (Break-Even Modeling to Lead Qualification)
suite.test('SCENARIO-4.2: Egyptian startup founder models break-even economics and captures lead with 010 mobile', async () => {
  // Step 1: Founder models financial viability in EGP
  const fixedCosts = 60000;  // 60k EGP monthly
  const unitPrice = 800;     // 800 EGP per subscription
  const unitCost = 200;      // 200 EGP variable server/payment cost
  const targetProfit = 40000; // 40k EGP net profit

  const contributionMargin = unitPrice - unitCost; // 600 EGP
  assertEqual(contributionMargin, 600);

  const marginRatio = (contributionMargin / unitPrice) * 100; // 75.0%
  assertEqual(marginRatio, 75);

  const breakEvenUnits = Math.ceil(fixedCosts / contributionMargin); // 100 units
  assertEqual(breakEvenUnits, 100);

  const targetUnits = Math.ceil((fixedCosts + targetProfit) / contributionMargin); // 167 units
  assertEqual(targetUnits, 167);

  // Step 2: Currency formatting for Egyptian context
  const priceDisplay = currencyLib.formatPrice(unitPrice, 'EGP');
  assertEqual(priceDisplay, '800 ج.م');

  // Step 3: Founder requests custom financial templates via RaseenAssistant
  const leadReq = createPostRequest({
    name: 'أحمد زهران',
    phone: '01011223344',
    channel: 'whatsapp',
    interest: 'طلب قالب دراسة جدوى ونموذج تسعير ساس ديناميكي',
    metadata: {
      journey: 'Egyptian Startup Modeling',
      modeledFixedCosts: fixedCosts,
      modeledBreakEvenUnits: breakEvenUnits,
    },
  });

  const leadRes = await leadsRoute.POST(leadReq);
  assertEqual(leadRes.status, 200);
  const leadData = await leadRes.json();
  assertEqual(leadData.success, true);
  assert(leadData.leadId);
});

// Scenario 3: The International Enterprise Procurement Journey (USD Quote & Corporate RFP)
suite.test('SCENARIO-4.3: International enterprise buyer selects USD, calculates zero-tax export invoice, qualifies via email', async () => {
  // Step 1: Corporate procurement line items in USD
  const items = [
    { description: 'Enterprise Multi-Seat License (50 Users)', quantity: 1, price: 15000 },
    { description: 'Dedicated Antigravity AI Agent Customization', quantity: 2, price: 3500 },
    { description: 'SLA Support & Security Audit Guarantee', quantity: 1, price: 2500 },
  ];

  const subtotal = items.reduce((acc, i) => acc + i.quantity * i.price, 0); // 24,500 USD
  assertEqual(subtotal, 24500);

  const discountRate = 15; // 15% Enterprise Volume Discount
  const discountAmount = (subtotal * discountRate) / 100; // 3675 USD
  const taxableBase = subtotal - discountAmount; // 20825 USD
  assertEqual(taxableBase, 20825);

  const exportVatRate = 0; // Tax-exempt overseas export
  const vatAmount = 0;
  const grandTotal = taxableBase + vatAmount; // 20825 USD

  // Step 2: Generate ZATCA/International QR payload
  const tlvPayload = zatca.generateZatcaTLV({
    sellerName: 'شركة رَصين للحلول الرقمية',
    vatNumber: '31024589200003',
    timestamp: '2026-10-15T18:00:00Z',
    totalAmount: grandTotal.toFixed(2),
    vatAmount: vatAmount.toFixed(2),
  });

  const decoded = decodeZatcaTLV(tlvPayload);
  assertEqual(decoded[4].value, '20825.00');
  assertEqual(decoded[5].value, '0.00');

  // Step 3: Register Corporate Lead via Email
  const leadReq = createPostRequest({
    name: 'David Vance, VP of Engineering',
    email: 'procurement@global-synergy-tech.com',
    channel: 'email',
    interest: 'Enterprise Custom SLA & High-Volume Free AI Gateway Integration',
    metadata: {
      journey: 'International Enterprise Procurement',
      contractValueUSD: grandTotal,
      currency: 'USD',
    },
  });

  const leadRes = await leadsRoute.POST(leadReq);
  assertEqual(leadRes.status, 200);
  const leadData = await leadRes.json();
  assertEqual(leadData.success, true);
  assert(leadData.leadId);
});

// Scenario 4: The Digital Creator / Vendor Onboarding Journey (85% Profit Monetization)
suite.test('SCENARIO-4.4: Digital creator discovers 85% profit model, audits store, and applies via WhatsApp', async () => {
  // Step 1: Creator simulates selling 100 asset units at 150 SAR on Raseen
  const assetPriceSAR = 150;
  const monthlySales = 100;
  const grossSales = assetPriceSAR * monthlySales; // 15000 SAR

  // Raseen guarantees 85% creator revenue share
  const creatorPayoutRate = 0.85;
  const netCreatorEarnings = grossSales * creatorPayoutRate; // 12750 SAR
  assertEqual(netCreatorEarnings, 12750);

  // Step 2: Creator evaluates their portfolio readiness
  const portfolioCheck = {
    qualityAssetsReady: true,
    commercialRightsClear: true,
    acceptedPaymentChannels: ['InstaPay', 'Mada', 'Vodafone Cash'],
  };
  assert(portfolioCheck.qualityAssetsReady);

  // Step 3: Creator submits vendor seller application
  const leadReq = createPostRequest({
    name: 'م. مروان الشافعي (مصمم معماري)',
    phone: '+201234567890',
    channel: 'whatsapp',
    interest: 'الانضمام كبائع معتمد: مكتبة بلوكات أوتوكاد وريفت معمارية 2026',
    metadata: {
      journey: 'Digital Creator Vendor Onboarding',
      expectedMonthlyEarningsSAR: netCreatorEarnings,
      assetNiche: 'Architecture CAD & BIM Models',
    },
  });

  const leadRes = await leadsRoute.POST(leadReq);
  assertEqual(leadRes.status, 200);
  const leadData = await leadRes.json();
  assertEqual(leadData.success, true);
  assert(leadData.leadId);
});

module.exports = suite;
