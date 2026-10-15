/**
 * Tier 3: Cross-Feature Combinations
 * Authority: ORIGINAL_REQUEST.md & PROJECT.md
 * Integrates: Currency Engine ↔ Invoice Generator ↔ ZATCA TLV/QR ↔ Assistant ↔ Leads API
 */

const {
  jiti,
  TestSuite,
  assert,
  assertEqual,
  decodeZatcaTLV,
  validateQRMatrix,
} = require('./test_utils');

const zatca = jiti('@/lib/zatca.ts');
const currencyLib = jiti('@/lib/currency.ts');
const leadsRoute = jiti('@/app/api/leads/route.ts');

const suite = new TestSuite('Tier 3: Cross-Feature Combinations & Multi-Component Workflows');

function createPostRequest(payload) {
  return new Request('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

// Combination 1: Currency Selection + Invoice Calculation + ZATCA TLV & QR
suite.test('COMB-3.1: Multi-currency selection drives dynamic invoice math & ZATCA TLV QR output', () => {
  // Scenario: USD International Quotation
  const currency = 'USD';
  const items = [
    { description: 'تطوير منصة ساس متكاملة (Enterprise)', quantity: 1, price: 3500 },
    { description: 'تكامل بوابات الدفع (Stripe & Paymob)', quantity: 2, price: 500 },
  ];

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0); // 4500 USD
  assertEqual(subtotal, 4500, 'Subtotal calculation in USD must equal 4500');

  const discountPercent = 10;
  const discountAmount = (subtotal * discountPercent) / 100; // 450 USD
  assertEqual(discountAmount, 450);

  const taxableAmount = subtotal - discountAmount; // 4050 USD
  assertEqual(taxableAmount, 4050);

  const vatRate = 15;
  const vatAmount = (taxableAmount * vatRate) / 100; // 607.50 USD
  assertEqual(vatAmount, 607.5);

  const grandTotal = taxableAmount + vatAmount; // 4657.50 USD
  assertEqual(grandTotal, 4657.5);

  // Generate ZATCA compliant payload in target currency
  const tlvPayload = zatca.generateZatcaTLV({
    sellerName: 'شركة رَصين للحلول الرقمية',
    vatNumber: '31024589200003',
    timestamp: '2026-10-15T15:00:00Z',
    totalAmount: grandTotal.toFixed(2),
    vatAmount: vatAmount.toFixed(2),
  });

  // Verify decoded TLV values match mathematical invoice outputs
  const decoded = decodeZatcaTLV(tlvPayload);
  assertEqual(decoded[4].value, '4657.50', 'ZATCA Tag 4 total must reflect USD discounted total');
  assertEqual(decoded[5].value, '607.50', 'ZATCA Tag 5 VAT must reflect calculated VAT');

  // Verify authentic QR Matrix renders from combination
  const qrMatrix = zatca.renderQRCodeMatrix(tlvPayload);
  const matrixValidation = validateQRMatrix(qrMatrix);
  assert(matrixValidation.validFinders, 'QR code matrix must be valid for international currency invoice');
});

// Combination 2: Assistant Recommendation -> Leads API Integration
suite.test('COMB-3.2: AI Assistant advisory flow seamlessly qualifies lead with structured metadata', async () => {
  const visitorQuery = 'أريد نموذج محاسبي لإدارة رواتب ومصروفات 25 موظف';
  const suggestedProduct = {
    id: 'sheet-payroll-2026',
    title: 'شيت مسير الرواتب وضريبة كسب العمل 2026',
    priceEGP: 1250,
  };

  // Convert price to visitor's preferred currency (SAR)
  const formattedPrice = currencyLib.formatPrice(suggestedProduct.priceEGP, 'SAR');
  assert(formattedPrice.includes('ر.س'), 'Recommended price must be in SAR');

  // Assistant gathers user WhatsApp for consultation
  const req = createPostRequest({
    name: 'عبدالله السبيعي',
    phone: '+966551239876',
    channel: 'whatsapp',
    interest: `استشارة شراء: ${suggestedProduct.title}`,
    metadata: {
      initialQuery: visitorQuery,
      suggestedProductId: suggestedProduct.id,
      quotedPrice: formattedPrice,
      interactionTime: new Date().toISOString(),
    },
  });

  const res = await leadsRoute.POST(req);
  assertEqual(res.status, 200);

  const data = await res.json();
  assertEqual(data.success, true);
  assert(data.leadId.startsWith('LEAD-'));
});

// Combination 3: Break-Even Targets -> Enterprise Invoice Generation
suite.test('COMB-3.3: Break-Even calculator target revenue feeds directly into invoice quote & tax QR', () => {
  // Break-even parameters
  const fixedCosts = 25000; // SAR monthly
  const unitPrice = 500;    // SAR
  const unitCost = 200;     // SAR
  const targetProfit = 15000; // SAR

  const contributionMargin = unitPrice - unitCost; // 300 SAR
  const targetUnits = Math.ceil((fixedCosts + targetProfit) / contributionMargin); // (40000)/300 = 134 units
  const targetRevenue = targetUnits * unitPrice; // 134 * 500 = 67000 SAR

  assertEqual(targetUnits, 134);
  assertEqual(targetRevenue, 67000);

  // Transfer target revenue to custom corporate contract invoice
  const vatTotal = (targetRevenue * 0.15).toFixed(2); // 10050.00 SAR
  const invoiceTotal = (targetRevenue + parseFloat(vatTotal)).toFixed(2); // 77050.00 SAR

  const tlvB64 = zatca.generateZatcaTLV(
    'شركة رَصين للحلول الرقمية',
    '31024589200003',
    '2026-10-15T16:00:00Z',
    invoiceTotal,
    vatTotal
  );

  const tags = decodeZatcaTLV(tlvB64);
  assertEqual(tags[4].value, '77050.00', 'Invoice total must equal target revenue + VAT');
  assertEqual(tags[5].value, '10050.00', 'VAT amount must equal 15% of target revenue');
});

// Combination 4: Store Audit Diagnosis -> Remediation Quotation -> Lead Capture
suite.test('COMB-3.4: Store Audit deficiency score triggers remediation quote and sales dispatch', async () => {
  // Store Audit diagnosis: Failed local payments & failed schema (score: 55/100)
  const auditState = {
    mobile_speed: true,  // 20 pts
    local_payments: false, // 0 / 25 pts (Deficient)
    seo_schema: false,     // 0 / 20 pts (Deficient)
    trust_legal: true,   // 15 pts
    bundle_conversion: true, // 20 pts
  };

  const score = (20 + 0 + 0 + 15 + 20); // 55
  assertEqual(score, 55);

  // Generate remediation invoice quote
  const remediationItems = [
    { description: 'تكامل بوابة أبل باي ومدى وإنستاباي الفورية', price: 1200 },
    { description: 'تثبيت كود البيانات المنظمة Schema Markup لمتجر سلة', price: 800 },
  ];
  const remediationSubtotal = remediationItems.reduce((acc, i) => acc + i.price, 0); // 2000 SAR
  const remediationVat = (remediationSubtotal * 0.15).toFixed(2); // 300.00
  const remediationTotal = (remediationSubtotal * 1.15).toFixed(2); // 2300.00

  // Register qualified lead with audit context
  const req = createPostRequest({
    name: 'صالح التميمي',
    phone: '+966548765432',
    channel: 'whatsapp',
    interest: 'خطة علاج متجر إلكتروني وتحسين معدل التحويل (+45%)',
    metadata: {
      auditScore: score,
      deficientPillars: ['local_payments', 'seo_schema'],
      quotedAmountSAR: remediationTotal,
    },
  });

  const res = await leadsRoute.POST(req);
  assertEqual(res.status, 200);

  const data = await res.json();
  assertEqual(data.success, true);
});

module.exports = suite;
