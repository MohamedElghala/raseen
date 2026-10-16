/**
 * Tier 1: Freemium BIM & Lead Magnets Suite Tests
 * Authority: Requirement R2, DISPATCH.md, PROJECT.md § Milestone M2
 * Interface: src/lib/mockData.ts, src/components/storefront/ProductCard.tsx,
 *            src/components/storefront/FilterBar.tsx, src/components/storefront/FreeDownloadModal.tsx
 */

const {
  jiti,
  TestSuite,
  assert,
  assertEqual,
  renderComponent,
} = require('./test_utils');

const { mockProducts } = jiti('@/lib/mockData.ts');
const ProductCard = jiti('@/components/storefront/ProductCard.tsx').default;
const FilterBar = jiti('@/components/storefront/FilterBar.tsx').default;
const FreeDownloadModal = jiti('@/components/storefront/FreeDownloadModal.tsx').default;
const leadsRoute = jiti('@/app/api/leads/route.ts');

const suite = new TestSuite('Tier 1: Freemium BIM & Lead Magnets Suite');

// Test 1: Verify 4 Free Lead Magnets exist with price 0 and rich technicalSpecs
suite.test('FREE-1.1: 4 Free Lead Magnets exist with price 0 and complete technicalSpecs', () => {
  const freeProducts = mockProducts.filter((p) => p.price === 0);
  assertEqual(freeProducts.length, 4, 'Must have exactly 4 free lead magnet products');

  const p1 = mockProducts.find((p) => p.id === 'free-p1');
  const p2 = mockProducts.find((p) => p.id === 'free-p2');
  const p3 = mockProducts.find((p) => p.id === 'free-p3');
  const p4 = mockProducts.find((p) => p.id === 'free-p4');

  assert(p1, 'free-p1 must exist in catalog');
  assert(p2, 'free-p2 must exist in catalog');
  assert(p3, 'free-p3 must exist in catalog');
  assert(p4, 'free-p4 must exist in catalog');

  // free-p1: Revit Starter LOD 300
  assertEqual(p1.category, 'engineering');
  assertEqual(p1.fileType, 'cad-revit');
  assertEqual(p1.price, 0);
  assert(p1.title.includes('أصل مجاني للتحميل الفوري'), 'p1 title must indicate free instant download');
  assertEqual(p1.technicalSpecs?.blocksCount, 35, 'p1 must include 35 parametric families');
  assertEqual(p1.technicalSpecs?.lodStandard, 'LOD 300 (Starter Pack)', 'p1 must specify LOD 300');
  assertEqual(p1.fileSize, '48.5 MB', 'p1 fileSize must be 48.5 MB');
  assert(p1.tags.includes('BIM') && p1.tags.includes('LOD 300'), 'p1 must have BIM and LOD 300 tags');

  // free-p2: Mini BOQ Starter
  assertEqual(p2.category, 'engineering');
  assertEqual(p2.fileType, 'excel');
  assertEqual(p2.price, 0);
  assertEqual(p2.technicalSpecs?.sheetsCount, 4, 'p2 must have 4 worksheets');
  assertEqual(p2.technicalSpecs?.formulasCount, 145, 'p2 must have 145 formulas');
  assertEqual(p2.fileSize, '2.8 MB', 'p2 fileSize must be 2.8 MB');

  // free-p3: Mini NDA & Freelance
  assertEqual(p3.category, 'business');
  assertEqual(p3.fileType, 'word-pdf');
  assertEqual(p3.price, 0);
  assertEqual(p3.technicalSpecs?.pagesCount, 6, 'p3 must have 6 pages');
  assert(p3.technicalSpecs?.jurisdiction?.includes('السعودية'), 'p3 jurisdiction must cover Saudi Arabia');
  assertEqual(p3.fileSize, '1.2 MB', 'p3 fileSize must be 1.2 MB');

  // free-p4: Mini Cash Flow & Budget
  assertEqual(p4.category, 'accounting');
  assertEqual(p4.fileType, 'excel');
  assertEqual(p4.price, 0);
  assertEqual(p4.technicalSpecs?.sheetsCount, 5, 'p4 must have 5 worksheets');
  assertEqual(p4.technicalSpecs?.formulasCount, 180, 'p4 must have 180 formulas');
  assertEqual(p4.fileSize, '3.4 MB', 'p4 fileSize must be 3.4 MB');
});

// Test 2: Prominent Emerald/Teal Badge with pulse dot in ProductCard
suite.test('FREE-1.2: Prominent emerald/teal badge with pulse dot in ProductCard for free assets', () => {
  const p1 = mockProducts.find((p) => p.id === 'free-p1');
  const html = renderComponent(ProductCard, { product: p1 });

  assert(html.includes('أصل مجاني للتحميل الفوري'), 'ProductCard must display "أصل مجاني للتحميل الفوري" badge');
  assert(html.includes('from-emerald-500'), 'Badge must have emerald gradient styling');
  assert(html.includes('animate-pulse'), 'Badge container must have animate-pulse');
  assert(html.includes('animate-ping'), 'Pulse indicator dot must have animate-ping');
  assert(html.includes('مجاناً 100%'), 'Price section must display "مجاناً 100%"');
  assert(html.includes('تحميل مجاني'), 'CTA button must show "تحميل مجاني"');
  assert(html.includes('📥'), 'CTA button must show download icon');
});

// Test 3: 1-Click Free Assets Filter in FilterBar
suite.test('FREE-1.3: 1-Click Free Assets filter button exists in FilterBar', () => {
  const html = renderComponent(FilterBar, {
    selectedCategory: 'all',
    selectedFileType: 'all',
    onCategoryChange: () => {},
    onFileTypeChange: () => {},
    totalProducts: 54,
  });

  assert(
    html.includes('🎁 أصول مجانية للتحميل الفوري (4 نماذج)'),
    'FilterBar must contain 1-click free filter button with label'
  );
  assert(
    html.includes('aria-label="🎁 أصول مجانية للتحميل الفوري (4 نماذج)"'),
    'Filter button must have accessible aria-label'
  );
  assert(
    html.includes('animate-ping'),
    'Filter button must have pulsating indicator'
  );
});

// Test 4: FreeDownloadModal Component Structure & Accessibility
suite.test('FREE-1.4: FreeDownloadModal renders rich specs, lead capture inputs, and no payment gateways', () => {
  const p1 = mockProducts.find((p) => p.id === 'free-p1');
  const html = renderComponent(FreeDownloadModal, {
    isOpen: true,
    product: p1,
    onClose: () => {},
  });

  assert(html.includes('role="dialog"'), 'Modal must have role="dialog"');
  assert(html.includes('aria-modal="true"'), 'Modal must declare aria-modal="true"');
  assert(html.includes('حزمة عائلات Revit المعمارية التمهيدية'), 'Modal must render product title');
  assert(html.includes('48.5 MB'), 'Modal must render file size 48.5 MB');
  assert(html.includes('أصل مجاني 100% للتحميل الفوري'), 'Modal must declare 100% free badge');
  assert(html.includes('عبر واتساب'), 'Modal must support WhatsApp lead channel');
  assert(html.includes('عبر الإيميل'), 'Modal must support Email lead channel');
  assert(html.includes('تحميل فوري الآن (0 ر.س)'), 'Submit button must provide instant 0-cost download');

  // Verify that payment gateways (Visa, Mastercard, Fawry, InstaPay) are NOT requested
  assert(!html.includes('رقم البطاقة'), 'Free modal must not ask for card number');
  assert(!html.includes('CVV'), 'Free modal must not ask for CVV');
});

// Test 5: Lead Capture API integration for free asset downloads
suite.test('FREE-1.5: /api/leads records and validates free asset lead captures', async () => {
  const payload = {
    name: 'م. حسام كمال',
    phone: '+966509988776',
    channel: 'whatsapp',
    interest: 'تحميل أصل مجاني: حزمة عائلات Revit المعمارية التمهيدية (LOD 300)',
    metadata: {
      productId: 'free-p1',
      source: 'free_lead_magnet_modal',
      category: 'engineering',
    },
  };

  const req = new Request('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const res = await leadsRoute.POST(req);
  const data = await res.json();

  assertEqual(res.status, 200, 'POST /api/leads must return HTTP 200');
  assertEqual(data.success, true, 'Lead capture response must be successful');
  assert(data.leadId && data.leadId.startsWith('LEAD-'), 'leadId must follow standard LEAD- prefix');

  // Verify lead was genuinely stored in state
  const getRes = await leadsRoute.GET();
  const getData = await getRes.json();
  const stored = getData.leads.find((l) => l.id === data.leadId);
  assert(stored, 'Lead must be found in stored leads registry');
  assertEqual(stored.phone, '+966509988776', 'Phone number must match payload');
  assertEqual(stored.channel, 'whatsapp', 'Channel must be whatsapp');
  assertEqual(stored.metadata.productId, 'free-p1', 'Product ID must be preserved in metadata');
});

// Test 6: FreeDownloadModal returns null when closed or without product
suite.test('FREE-1.6: FreeDownloadModal is safely dormant when closed', () => {
  const p1 = mockProducts.find((p) => p.id === 'free-p1');
  const htmlClosed = renderComponent(FreeDownloadModal, {
    isOpen: false,
    product: p1,
    onClose: () => {},
  });
  assertEqual(htmlClosed, '', 'Modal must render nothing when isOpen is false');

  const htmlNoProduct = renderComponent(FreeDownloadModal, {
    isOpen: true,
    product: null,
    onClose: () => {},
  });
  assertEqual(htmlNoProduct, '', 'Modal must render nothing when product is null');
});

module.exports = suite;
