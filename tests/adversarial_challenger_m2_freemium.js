/**
 * Adversarial Challenger Test Suite: Freemium BIM & Lead Magnets Rigor
 * Milestone: M2 Expansion
 * Agent: challenger_m2_1 (Adversarial Freemium Data & Lead Validation)
 * 
 * Target:
 *   1. Freemium Catalog Data (mockData.ts: free-p1 to free-p4, pricing, specs, tags, anchor value)
 *   2. FilterBar 1-Click Free Filter & Multi-Condition Catalog Filtering (page.tsx logic, categories, search terms)
 *   3. ProductCard & FreeDownloadModal Component Structure (emerald badge, instant download, upsell card)
 *   4. Lead Capture API (/api/leads: payload edge cases, invalid phone/email, channel constraints, security)
 */

const path = require('path');
const projectRoot = path.resolve(__dirname, '..');

// Use project jiti runtime loader
const jiti = require('jiti')(path.join(projectRoot, 'test_loader.js'), {
  jsx: true,
  alias: {
    '@': path.join(projectRoot, 'src'),
  },
});

const { mockProducts } = jiti('@/lib/mockData.ts');
const ProductCard = jiti('@/components/storefront/ProductCard.tsx').default;
const FilterBar = jiti('@/components/storefront/FilterBar.tsx').default;
const FreeDownloadModal = jiti('@/components/storefront/FreeDownloadModal.tsx').default;
const leadsRoute = jiti('@/app/api/leads/route.ts');

const {
  TestSuite,
  assert,
  assertEqual,
  assertDeepEqual,
  assertGreaterThan,
  assertGreaterThanOrEqual,
  renderComponent,
} = require('./e2e/test_utils.js');

// Helper to construct Request objects for POST /api/leads
function createLeadRequest(body) {
  const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
  return new Request('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: bodyStr,
  });
}

// Replicate the storefront filtering logic from src/app/page.tsx (lines 28-46)
function filterCatalog(products, { searchTerm = '', selectedCategory = 'all', selectedFileType = 'all' } = {}) {
  const term = searchTerm.toLowerCase().trim();
  return products.filter((product) => {
    const matchesSearch =
      term === '' ||
      product.title.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.tags.some((t) => t.toLowerCase().includes(term));
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesType =
      selectedFileType === 'all'
        ? true
        : selectedFileType === 'free'
        ? product.price === 0
        : product.fileType === selectedFileType;
    return matchesSearch && matchesCategory && matchesType;
  });
}

const mainSuite = new TestSuite('Adversarial Challenger M2-1: Freemium BIM & Lead Magnets Rigor');

// =========================================================================
// SECTION 1: FREEMIUM CATALOG DATA RIGOR & INTEGRITY
// =========================================================================

mainSuite.test('DATA-1: Catalog contains exactly 4 free lead magnets with price === 0 and distinct IDs', () => {
  const freeProducts = mockProducts.filter((p) => p.price === 0);
  assertEqual(freeProducts.length, 4, 'Must have exactly 4 free lead magnet products');

  // Verify unique IDs across entire catalog (no collisions)
  const allIds = mockProducts.map((p) => p.id);
  const uniqueIds = new Set(allIds);
  assertEqual(uniqueIds.size, allIds.length, 'Every product in mockProducts must possess a unique ID');

  const expectedIds = ['free-p1', 'free-p2', 'free-p3', 'free-p4'];
  for (const id of expectedIds) {
    const p = mockProducts.find((item) => item.id === id);
    assert(p, `Free product ${id} must exist in mockProducts`);
    assertEqual(p.price, 0, `Product ${id} price must be exactly 0`);
    assert(p.originalPrice && p.originalPrice > 0, `Product ${id} must have positive originalPrice anchor`);
    assert(p.title && p.title.length > 10, `Product ${id} must have a descriptive Arabic title`);
    assert(p.description && p.description.length > 30, `Product ${id} must have a detailed description`);
    assert(p.imageUrl && p.imageUrl.startsWith('https://'), `Product ${id} must have valid HTTPS imageUrl`);
    assert(p.fileUrl && p.fileUrl.startsWith('/downloads/free/'), `Product ${id} must have a valid free download path`);
    assert(p.fileSize && p.fileSize.includes('MB'), `Product ${id} must specify human-readable fileSize in MB`);
  }
});

mainSuite.test('DATA-2: free-p1 (Revit LOD 300 Starter Pack) satisfies all BIM architectural specifications', () => {
  const p1 = mockProducts.find((p) => p.id === 'free-p1');
  assert(p1, 'free-p1 must exist');
  assertEqual(p1.category, 'engineering');
  assertEqual(p1.fileType, 'cad-revit');
  assertEqual(p1.license, 'commercial');
  assertEqual(p1.fileSize, '48.5 MB');
  assertEqual(p1.technicalSpecs?.blocksCount, 35, 'Must contain 35 parametric Revit families');
  assertEqual(p1.technicalSpecs?.lodStandard, 'LOD 300 (Starter Pack)', 'Must adhere to LOD 300');
  
  const formats = p1.technicalSpecs?.fileFormats || [];
  assert(formats.includes('.RFA'), 'Must support .RFA format');
  assert(formats.includes('.RVT'), 'Must support .RVT format');
  assert(formats.includes('.DWG'), 'Must support .DWG format');

  const compat = p1.technicalSpecs?.compatibility || [];
  assert(compat.some((c) => c.includes('Revit')), 'Must declare Autodesk Revit compatibility');
  
  assert(p1.tags.includes('BIM'), 'Tags must include BIM');
  assert(p1.tags.includes('Revit'), 'Tags must include Revit');
  assert(p1.tags.includes('LOD 300'), 'Tags must include LOD 300');
});

mainSuite.test('DATA-3: free-p2 (Mini BOQ Starter) satisfies all engineering quantity surveying specifications', () => {
  const p2 = mockProducts.find((p) => p.id === 'free-p2');
  assert(p2, 'free-p2 must exist');
  assertEqual(p2.category, 'engineering');
  assertEqual(p2.fileType, 'excel');
  assertEqual(p2.fileSize, '2.8 MB');
  assertEqual(p2.technicalSpecs?.sheetsCount, 4, 'Must have 4 worksheets');
  assertEqual(p2.technicalSpecs?.formulasCount, 145, 'Must have 145 automated formulas');

  const formats = p2.technicalSpecs?.fileFormats || [];
  assert(formats.includes('.XLSX'), 'Must support .XLSX');
  assert(formats.includes('.XLSM'), 'Must support .XLSM');

  assert(p2.tags.includes('BOQ'), 'Tags must include BOQ');
  assert(p2.tags.includes('حصر كميات'), 'Tags must include حصر كميات');
  assert(p2.tags.includes('مقايسات'), 'Tags must include مقايسات');
});

mainSuite.test('DATA-4: free-p3 (Mini NDA & Freelance) satisfies all legal business contracts specifications', () => {
  const p3 = mockProducts.find((p) => p.id === 'free-p3');
  assert(p3, 'free-p3 must exist');
  assertEqual(p3.category, 'business');
  assertEqual(p3.fileType, 'word-pdf');
  assertEqual(p3.license, 'commercial');
  assertEqual(p3.fileSize, '1.2 MB');
  assertEqual(p3.technicalSpecs?.pagesCount, 6, 'Must have 6 legal pages');
  assert(p3.technicalSpecs?.jurisdiction?.includes('السعودية'), 'Must include Saudi Arabia jurisdiction');
  assert(p3.technicalSpecs?.jurisdiction?.includes('مصر'), 'Must include Egypt jurisdiction');

  const formats = p3.technicalSpecs?.fileFormats || [];
  assert(formats.includes('.DOCX'), 'Must support .DOCX');
  assert(formats.includes('.PDF'), 'Must support .PDF');

  assert(p3.tags.includes('NDA'), 'Tags must include NDA');
  assert(p3.tags.includes('عقد عمل حر'), 'Tags must include عقد عمل حر');
  assert(p3.tags.includes('قانوني'), 'Tags must include قانوني');
});

mainSuite.test('DATA-5: free-p4 (Mini Cash Flow & Budget) satisfies all accounting financial model specifications', () => {
  const p4 = mockProducts.find((p) => p.id === 'free-p4');
  assert(p4, 'free-p4 must exist');
  assertEqual(p4.category, 'accounting');
  assertEqual(p4.fileType, 'excel');
  assertEqual(p4.fileSize, '3.4 MB');
  assertEqual(p4.technicalSpecs?.sheetsCount, 5, 'Must have 5 worksheets');
  assertEqual(p4.technicalSpecs?.formulasCount, 180, 'Must have 180 dynamic formulas');

  const formats = p4.technicalSpecs?.fileFormats || [];
  assert(formats.includes('.XLSX'), 'Must support .XLSX');
  assert(formats.includes('.PDF'), 'Must support .PDF');

  assert(p4.tags.includes('ميزانية'), 'Tags must include ميزانية');
  assert(p4.tags.includes('تدفق نقدي'), 'Tags must include تدفق نقدي');
  assert(p4.tags.includes('Cash Flow'), 'Tags must include Cash Flow');
});

// =========================================================================
// SECTION 2: 1-CLICK FILTER & STOREFRONT FILTERING LOGIC
// =========================================================================

mainSuite.test('FILTER-1: FilterBar renders 1-Click Free button with active state & aria-pressed toggle', () => {
  // Test inactive state (selectedFileType === 'all')
  const htmlInactive = renderComponent(FilterBar, {
    selectedCategory: 'all',
    selectedFileType: 'all',
    onCategoryChange: () => {},
    onFileTypeChange: () => {},
    totalProducts: 54,
  });

  assert(htmlInactive.includes('🎁 أصول مجانية للتحميل الفوري (4 نماذج)'), 'Must contain 1-click free filter button label');
  assert(htmlInactive.includes('aria-pressed="false"'), 'Must have aria-pressed="false" when inactive');
  assert(htmlInactive.includes('animate-ping'), 'Must include pulsating indicator dot');

  // Test active state (selectedFileType === 'free')
  const htmlActive = renderComponent(FilterBar, {
    selectedCategory: 'all',
    selectedFileType: 'free',
    onCategoryChange: () => {},
    onFileTypeChange: () => {},
    totalProducts: 4,
  });

  assert(htmlActive.includes('aria-pressed="true"'), 'Must have aria-pressed="true" when active');
  assert(htmlActive.includes('from-emerald-500 to-teal-500'), 'Must apply active emerald gradient');
  assert(htmlActive.includes('scale-105'), 'Must apply scale-105 visual emphasis');
});

mainSuite.test('FILTER-2: 1-Click Free filter toggles cleanly between 4 free assets and full catalog', () => {
  // 1. Initial full catalog
  const full = filterCatalog(mockProducts, { selectedFileType: 'all' });
  assertEqual(full.length, mockProducts.length, 'Full catalog must return all mock products');

  // 2. 1-Click Free filter activated
  const freeOnly = filterCatalog(mockProducts, { selectedFileType: 'free' });
  assertEqual(freeOnly.length, 4, '1-Click Free filter must isolate exactly 4 free assets');
  for (const p of freeOnly) {
    assertEqual(p.price, 0, `Filtered free product ${p.id} must have price 0`);
  }

  // 3. Toggled off back to all
  const reverted = filterCatalog(mockProducts, { selectedFileType: 'all' });
  assertEqual(reverted.length, mockProducts.length, 'Reverting filter must restore all products');
});

mainSuite.test('FILTER-3: Cross-filtering 1-Click Free filter with Category tabs', () => {
  // Category 'engineering' + 'free' -> 2 products (free-p1, free-p2)
  const engineeringFree = filterCatalog(mockProducts, { selectedCategory: 'engineering', selectedFileType: 'free' });
  assertEqual(engineeringFree.length, 2, 'engineering + free must return 2 products');
  const engIds = engineeringFree.map((p) => p.id).sort();
  assertDeepEqual(engIds, ['free-p1', 'free-p2'], 'engineering + free must be free-p1 and free-p2');

  // Category 'business' + 'free' -> 1 product (free-p3)
  const businessFree = filterCatalog(mockProducts, { selectedCategory: 'business', selectedFileType: 'free' });
  assertEqual(businessFree.length, 1, 'business + free must return 1 product');
  assertEqual(businessFree[0].id, 'free-p3', 'business + free must be free-p3');

  // Category 'accounting' + 'free' -> 1 product (free-p4)
  const accountingFree = filterCatalog(mockProducts, { selectedCategory: 'accounting', selectedFileType: 'free' });
  assertEqual(accountingFree.length, 1, 'accounting + free must return 1 product');
  assertEqual(accountingFree[0].id, 'free-p4', 'accounting + free must be free-p4');

  // Category 'students' + 'free' -> 0 products (no free student lead magnets)
  const studentsFree = filterCatalog(mockProducts, { selectedCategory: 'students', selectedFileType: 'free' });
  assertEqual(studentsFree.length, 0, 'students + free must return 0 products');

  // Category 'individuals' + 'free' -> 0 products
  const individualsFree = filterCatalog(mockProducts, { selectedCategory: 'individuals', selectedFileType: 'free' });
  assertEqual(individualsFree.length, 0, 'individuals + free must return 0 products');
});

mainSuite.test('FILTER-4: Adversarial search queries combined with 1-Click Free filter', () => {
  // 1. Case-insensitivity & whitespace trimming
  const revitSearch = filterCatalog(mockProducts, { selectedFileType: 'free', searchTerm: '   ReViT   ' });
  assertEqual(revitSearch.length, 1, 'Search "   ReViT   " under free filter must match free-p1');
  assertEqual(revitSearch[0].id, 'free-p1');

  // 2. Arabic query in title
  const boqSearch = filterCatalog(mockProducts, { selectedFileType: 'free', searchTerm: 'مقايسات' });
  assertEqual(boqSearch.length, 1, 'Search "مقايسات" under free filter must match free-p2');
  assertEqual(boqSearch[0].id, 'free-p2');

  // 3. Arabic query in description
  const legalDescSearch = filterCatalog(mockProducts, { selectedFileType: 'free', searchTerm: 'الأنظمة السعودية' });
  assertEqual(legalDescSearch.length, 1, 'Search "الأنظمة السعودية" under free filter must match free-p3');
  assertEqual(legalDescSearch[0].id, 'free-p3');

  // 4. Overlapping search: "إكسل" in tags/title matches free-p2 and free-p4
  const excelSearch = filterCatalog(mockProducts, { selectedFileType: 'free', searchTerm: 'إكسل' });
  assertEqual(excelSearch.length, 2, 'Search "إكسل" under free filter must match both free-p2 and free-p4');
  const excelIds = excelSearch.map((p) => p.id).sort();
  assertDeepEqual(excelIds, ['free-p2', 'free-p4']);

  // 5. English tag query: "Cash Flow"
  const cashFlowSearch = filterCatalog(mockProducts, { selectedFileType: 'free', searchTerm: 'cash flow' });
  assertEqual(cashFlowSearch.length, 1, 'Search "cash flow" under free filter must match free-p4');
  assertEqual(cashFlowSearch[0].id, 'free-p4');

  // 6. Contradictory search (valid word but not in free products)
  const noMatchSearch = filterCatalog(mockProducts, { selectedFileType: 'free', searchTerm: 'سلايدات بوربوينت' });
  assertEqual(noMatchSearch.length, 0, 'Non-existent term in free products must return empty array without crashing');

  // 7. Contradictory combination: Category 'business' + Search 'Revit' + 'free' -> 0 products
  const conflictSearch = filterCatalog(mockProducts, {
    selectedCategory: 'business',
    selectedFileType: 'free',
    searchTerm: 'Revit',
  });
  assertEqual(conflictSearch.length, 0, 'Conflicting category and search under free filter must return 0 products');
});

// =========================================================================
// SECTION 3: STOREFRONT COMPONENT RENDERING & UPSELL INTEGRATION
// =========================================================================

mainSuite.test('UI-1: ProductCard displays emerald free badge & direct download CTA for all 4 free assets', () => {
  const freeProducts = mockProducts.filter((p) => p.price === 0);
  assertEqual(freeProducts.length, 4);

  for (const product of freeProducts) {
    const html = renderComponent(ProductCard, { product });

    // Free badge with glowing emerald gradient
    assert(html.includes('أصل مجاني للتحميل الفوري'), `ProductCard for ${product.id} must render free badge`);
    assert(html.includes('from-emerald-500'), `ProductCard for ${product.id} must use emerald gradient`);
    assert(html.includes('animate-pulse'), `ProductCard for ${product.id} must include animate-pulse`);
    assert(html.includes('animate-ping'), `ProductCard for ${product.id} must include animate-ping`);

    // Price section
    assert(html.includes('مجاناً 100%'), `ProductCard for ${product.id} must display "مجاناً 100%"`);

    // CTA button
    assert(html.includes('تحميل مجاني'), `ProductCard for ${product.id} CTA must say "تحميل مجاني"`);
    assert(html.includes('📥'), `ProductCard for ${product.id} CTA must have download emoji`);

    // Must NOT show paid cart action or cart icon for free products
    assert(!html.includes('شراء'), `ProductCard for ${product.id} must NOT render "شراء"`);
  }
});

mainSuite.test('UI-2: ProductCard for standard paid products displays purchase CTA and no free badges', () => {
  const paidProduct = mockProducts.find((p) => p.price > 0);
  assert(paidProduct, 'Must have at least one paid product');

  const html = renderComponent(ProductCard, { product: paidProduct });

  assert(!html.includes('أصل مجاني للتحميل الفوري'), 'Paid ProductCard must NOT render free badge');
  assert(!html.includes('مجاناً 100%'), 'Paid ProductCard must NOT display "مجاناً 100%"');
  assert(html.includes('شراء'), 'Paid ProductCard must render "شراء" button');
  assert(html.includes('🛒'), 'Paid ProductCard must render cart icon');
});

mainSuite.test('UI-3: FreeDownloadModal renders rich lead capture in Phase 1, and verifies upsell product mapping & RASEEN40 coupon', () => {
  const expectedUpsells = [
    { freeId: 'free-p1', expectedUpsellIds: ['p41', 'p13'] },
    { freeId: 'free-p2', expectedUpsellIds: ['p14'] },
    { freeId: 'free-p3', expectedUpsellIds: ['p1', 'p47'] },
    { freeId: 'free-p4', expectedUpsellIds: ['p7', 'p38'] },
  ];

  for (const item of expectedUpsells) {
    const product = mockProducts.find((p) => p.id === item.freeId);
    assert(product, `Product ${item.freeId} must exist`);

    // 1. Verify Phase 1 (Lead Capture Dialog)
    const html = renderComponent(FreeDownloadModal, {
      isOpen: true,
      product,
      onClose: () => {},
    });

    assert(html.includes('role="dialog"'), 'Modal must have role="dialog"');
    assert(html.includes('aria-modal="true"'), 'Modal must have aria-modal="true"');
    assert(html.includes('أصل مجاني 100% للتحميل الفوري'), 'Modal must declare 100% free badge');
    assert(html.includes('تحميل فوري الآن (0 ر.س)'), 'Phase 1 submit button must provide instant 0-cost download');
    assert(html.includes(product.fileSize || product.technicalSpecs?.fileSize), 'Modal must display file size');

    // 2. Verify Upsell Products exist in catalog and have positive pricing
    for (const upsellId of item.expectedUpsellIds) {
      const upsellProd = mockProducts.find((p) => p.id === upsellId);
      assert(upsellProd, `Upsell product ${upsellId} for ${item.freeId} must exist in mockProducts`);
      assert(upsellProd.price > 0, `Upsell product ${upsellId} must be a premium paid product (price > 0)`);
      assert(upsellProd.title.length > 5, `Upsell product ${upsellId} must have valid title`);
    }
  }

  // 3. Verify FreeDownloadModal component source code contains the RASEEN40 coupon and 40% discount
  const fs = require('fs');
  const modalSource = fs.readFileSync(path.join(projectRoot, 'src/components/storefront/FreeDownloadModal.tsx'), 'utf-8');
  assert(modalSource.includes('RASEEN40'), 'FreeDownloadModal must feature RASEEN40 discount coupon for upsell conversions');
  assert(modalSource.includes('وفر 40%') || modalSource.includes('خصم 40%'), 'FreeDownloadModal must display 40% discount benefit');
  assert(modalSource.includes('triggerDirectDownload'), 'FreeDownloadModal must contain automated browser direct download trigger');
});

// =========================================================================
// SECTION 4: LEAD CAPTURE PAYLOAD EDGE CASES (/api/leads)
// =========================================================================

mainSuite.test('LEADS-1: Valid Free Asset WhatsApp lead capture succeeds with HTTP 200 and leadId', async () => {
  const validSaudiNumbers = [
    '+966501234567',
    '+966559876543',
    '0501234567',
    '0549876543',
    '+966 50 123 4567',
    '+966-50-123-4567',
  ];

  for (const phone of validSaudiNumbers) {
    const req = createLeadRequest({
      name: 'مهندس سعودي',
      phone,
      channel: 'whatsapp',
      interest: 'تحميل أصل مجاني: حزمة عائلات Revit المعمارية التمهيدية (LOD 300)',
      metadata: {
        productId: 'free-p1',
        source: 'free_lead_magnet_modal',
      },
    });

    const res = await leadsRoute.POST(req);
    const data = await res.json();

    assertEqual(res.status, 200, `POST /api/leads with phone "${phone}" must return HTTP 200`);
    assertEqual(data.success, true);
    assert(data.leadId && data.leadId.startsWith('LEAD-'), 'Must return valid leadId');
  }
});

mainSuite.test('LEADS-2: Valid Free Asset Egyptian WhatsApp lead capture succeeds with HTTP 200', async () => {
  const validEgyptNumbers = [
    '01012345678',
    '01123456789',
    '01234567890',
    '01512345678',
    '+201012345678',
    '+20 11 2345 6789',
  ];

  for (const phone of validEgyptNumbers) {
    const req = createLeadRequest({
      name: 'مهندس مصري',
      phone,
      channel: 'whatsapp',
      interest: 'تحميل أصل مجاني: شيت مقايسات وحصر كميات البناء المبدئي (Mini BOQ Starter)',
      metadata: {
        productId: 'free-p2',
        source: 'free_lead_magnet_modal',
      },
    });

    const res = await leadsRoute.POST(req);
    const data = await res.json();

    assertEqual(res.status, 200, `POST /api/leads with Egypt phone "${phone}" must return HTTP 200`);
    assertEqual(data.success, true);
    assert(data.leadId && data.leadId.startsWith('LEAD-'), 'Must return valid leadId');
  }
});

mainSuite.test('LEADS-3: Valid Free Asset Email lead capture succeeds with HTTP 200', async () => {
  const validEmails = [
    'architect@raseen.org',
    'engineer.bim+free@domain.com',
    'legal.advisor@firm.co.sa',
    'cfo@holding-group.eg',
  ];

  for (const email of validEmails) {
    const req = createLeadRequest({
      name: 'زائر دولي',
      email,
      channel: 'email',
      interest: 'تحميل أصل مجاني: نموذج عقد العمل الحر واتفاقية سرية المعلومات (Mini NDA)',
      metadata: {
        productId: 'free-p3',
        source: 'free_lead_magnet_modal',
      },
    });

    const res = await leadsRoute.POST(req);
    const data = await res.json();

    assertEqual(res.status, 200, `POST /api/leads with email "${email}" must return HTTP 200`);
    assertEqual(data.success, true);
    assert(data.leadId && data.leadId.startsWith('LEAD-'), 'Must return valid leadId');
  }
});

mainSuite.test('LEADS-4: Missing name gracefully defaults to platform placeholder without crashing', async () => {
  const req = createLeadRequest({
    phone: '+966501122334',
    channel: 'whatsapp',
    interest: 'تحميل أصل مجاني: شيت الميزانية التقديرية والتدفق النقدي',
    metadata: { productId: 'free-p4' },
  });

  const res = await leadsRoute.POST(req);
  const data = await res.json();

  assertEqual(res.status, 200);
  assertEqual(data.success, true);

  // Check stored lead name in GET endpoint
  const getRes = await leadsRoute.GET();
  const getData = await getRes.json();
  const stored = getData.leads.find((l) => l.id === data.leadId);
  assert(stored, 'Lead must be found in stored registry');
  assertEqual(stored.name, 'عميل محتمل من منصة رَصين', 'Missing name must default to placeholder');
});

mainSuite.test('LEADS-5: Invalid phone formats return HTTP 400 Bad Request with Arabic error', async () => {
  const invalidPhones = [
    '12345',              // Too short
    '051234567890123456', // Too long (>15 digits)
    'abcdefghijk',        // Alphabetical letters
    '+00123456789',       // Invalid country code starting with 0
    '050-not-a-number',   // Mixed alphanumeric
    '0000000000',         // Invalid carrier
  ];

  for (const badPhone of invalidPhones) {
    const req = createLeadRequest({
      name: 'اختبار هاتف غير صالح',
      phone: badPhone,
      channel: 'whatsapp',
      interest: 'تحميل مجاني',
    });

    const res = await leadsRoute.POST(req);
    const data = await res.json();

    assertEqual(res.status, 400, `Invalid phone "${badPhone}" must return HTTP 400`);
    assertEqual(data.success, false);
    assert(data.error && data.error.includes('رقم الهاتف'), 'Error message must mention phone issue');
  }
});

mainSuite.test('LEADS-6: Invalid email formats return HTTP 400 Bad Request with Arabic error', async () => {
  const invalidEmails = [
    'notanemail',
    'missingatsign.com',
    'user@',
    '@nodomain.com',
    'user@nodot',
    'user with spaces@domain.com',
    'user@domain..com',
  ];

  for (const badEmail of invalidEmails) {
    const req = createLeadRequest({
      name: 'اختبار إيميل غير صالح',
      email: badEmail,
      channel: 'email',
      interest: 'تحميل مجاني',
    });

    const res = await leadsRoute.POST(req);
    const data = await res.json();

    assertEqual(res.status, 400, `Invalid email "${badEmail}" must return HTTP 400`);
    assertEqual(data.success, false);
    assert(data.error && data.error.includes('البريد الإلكتروني'), 'Error message must mention email issue');
  }
});

mainSuite.test('LEADS-7: Channel constraints enforced: whatsapp requires phone, email requires email', async () => {
  // Channel = 'whatsapp' but only email provided
  const reqWhatsappNoPhone = createLeadRequest({
    name: 'عميل بدون هاتف',
    email: 'valid@example.com',
    channel: 'whatsapp',
  });
  const res1 = await leadsRoute.POST(reqWhatsappNoPhone);
  const data1 = await res1.json();
  assertEqual(res1.status, 400, 'channel=whatsapp without phone must return 400');
  assert(data1.error.includes('الواتساب'), 'Must mention whatsapp channel requires phone');

  // Channel = 'email' but only phone provided
  const reqEmailNoEmail = createLeadRequest({
    name: 'عميل بدون إيميل',
    phone: '+966501234567',
    channel: 'email',
  });
  const res2 = await leadsRoute.POST(reqEmailNoEmail);
  const data2 = await res2.json();
  assertEqual(res2.status, 400, 'channel=email without email must return 400');
  assert(data2.error.includes('البريد الإلكتروني'), 'Must mention email channel requires email');

  // Both missing
  const reqBothMissing = createLeadRequest({
    name: 'لا هاتف ولا إيميل',
    channel: 'whatsapp',
  });
  const res3 = await leadsRoute.POST(reqBothMissing);
  assertEqual(res3.status, 400, 'Missing both contact fields must return 400');

  // Empty JSON body {}
  const reqEmptyBody = createLeadRequest({});
  const res4 = await leadsRoute.POST(reqEmptyBody);
  assertEqual(res4.status, 400, 'Empty body must return 400');

  // Malformed JSON string
  const reqMalformed = createLeadRequest('{bad-json-string');
  const res5 = await leadsRoute.POST(reqMalformed);
  assertEqual(res5.status, 400, 'Malformed JSON must return 400');
});

mainSuite.test('LEADS-8: Security stress-testing: XSS, SQLi, and large payloads safely handled', async () => {
  const securityPayloads = [
    {
      name: '<script>alert("XSS")</script>',
      phone: '+966501234567',
      channel: 'whatsapp',
      interest: '<img src=x onerror=alert(1)>',
      metadata: { attack: '<svg onload=alert(document.cookie)>' },
    },
    {
      name: "'; DROP TABLE leads; --",
      phone: '+966501234567',
      channel: 'whatsapp',
      interest: "' UNION SELECT username, password FROM users --",
      metadata: { sql: "1' OR '1'='1" },
    },
    {
      name: 'A'.repeat(5000), // 5KB large string
      phone: '+966501234567',
      channel: 'whatsapp',
      interest: 'B'.repeat(5000),
      metadata: { blob: 'C'.repeat(10000) },
    },
  ];

  for (const payload of securityPayloads) {
    const req = createLeadRequest(payload);
    const res = await leadsRoute.POST(req);
    const data = await res.json();

    assertEqual(res.status, 200, 'Security payload must be handled safely without unhandled exception');
    assertEqual(data.success, true);
    assert(data.leadId, 'Must return leadId');
  }
});

// Run all test cases
mainSuite.run().then((result) => {
  if (result.failed > 0) {
    console.error(`\n❌ Adversarial Challenger M2-1 suite failed with ${result.failed} errors.`);
    process.exit(1);
  } else {
    console.log(`\n✨ Adversarial Challenger M2-1 suite passed 100% (${result.passed}/${result.total} tests).`);
    process.exit(0);
  }
}).catch((err) => {
  console.error('Fatal execution error in test suite:', err);
  process.exit(1);
});
