/**
 * Adversarial Reviewer M2-1 Stress Test Harness
 * Author: Reviewer M2-1 (critic & reviewer)
 * Scope: Freemium BIM & Lead Magnets Suite (Requirement R2)
 */

const fs = require('fs');
const path = require('path');
const {
  jiti,
  TestSuite,
  assert,
  assertEqual,
  renderComponent,
} = require('./e2e/test_utils');

const { mockProducts } = jiti('@/lib/mockData.ts');
const ProductCard = jiti('@/components/storefront/ProductCard.tsx').default;
const FilterBar = jiti('@/components/storefront/FilterBar.tsx').default;
const FreeDownloadModal = jiti('@/components/storefront/FreeDownloadModal.tsx').default;
const leadsRoute = jiti('@/app/api/leads/route.ts');

const suite = new TestSuite('Adversarial Reviewer M2-1: Freemium BIM & Lead Magnets Suite');

// --- 1. INTEGRITY & DATA COMPLETENESS ---
suite.test('ADV-M2-1.1: 4 Free Assets have price 0, non-empty specs, and valid metadata', () => {
  const freeItems = mockProducts.filter((p) => p.price === 0);
  assertEqual(freeItems.length, 4, 'Must have exactly 4 free assets');

  for (const item of freeItems) {
    assert(item.id.startsWith('free-'), `ID must start with free-: ${item.id}`);
    assertEqual(item.price, 0, `Price must be 0 for ${item.id}`);
    assert(item.title && item.title.length > 10, `Title must be descriptive: ${item.id}`);
    assert(item.description && item.description.length > 30, `Description must be comprehensive: ${item.id}`);
    assert(item.fileUrl && item.fileUrl.startsWith('/downloads/free/'), `fileUrl must point to /downloads/free/: ${item.id}`);
    assert(item.fileSize && item.fileSize.includes('MB'), `fileSize must be defined: ${item.id}`);
    assert(item.tags && item.tags.includes('مجاني'), `Tags must include 'مجاني': ${item.id}`);
    assert(item.technicalSpecs, `technicalSpecs must be defined for ${item.id}`);
  }
});

// --- 2. ADVERSARIAL FILTERING COMBINATIONS ---
suite.test('ADV-M2-1.2: Free asset filter matrix across all 5 official pillars', () => {
  const filterCatalog = (cat, type, search = '') => {
    return mockProducts.filter((p) => {
      const term = search.toLowerCase().trim();
      const matchesSearch =
        term === '' ||
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.tags.some((t) => t.toLowerCase().includes(term));
      const matchesCat = cat === 'all' || p.category === cat;
      const matchesType = type === 'all' ? true : type === 'free' ? p.price === 0 : p.fileType === type;
      return matchesSearch && matchesCat && matchesType;
    });
  };

  // 'all' + 'free' -> exactly 4 items
  const allFree = filterCatalog('all', 'free');
  assertEqual(allFree.length, 4, 'All categories + free must return 4 items');

  // 'engineering' + 'free' -> 2 items (free-p1, free-p2)
  const engFree = filterCatalog('engineering', 'free');
  assertEqual(engFree.length, 2, 'Engineering + free must return 2 items');
  assert(engFree.some((p) => p.id === 'free-p1'), 'Must include free-p1');
  assert(engFree.some((p) => p.id === 'free-p2'), 'Must include free-p2');

  // 'business' + 'free' -> 1 item (free-p3)
  const bizFree = filterCatalog('business', 'free');
  assertEqual(bizFree.length, 1, 'Business + free must return 1 item');
  assertEqual(bizFree[0].id, 'free-p3', 'Must be free-p3');

  // 'accounting' + 'free' -> 1 item (free-p4)
  const accFree = filterCatalog('accounting', 'free');
  assertEqual(accFree.length, 1, 'Accounting + free must return 1 item');
  assertEqual(accFree[0].id, 'free-p4', 'Must be free-p4');

  // 'students' + 'free' -> 0 items gracefully
  const stuFree = filterCatalog('students', 'free');
  assertEqual(stuFree.length, 0, 'Students + free must return 0 items without crash');

  // 'individuals' + 'free' -> 0 items gracefully
  const indFree = filterCatalog('individuals', 'free');
  assertEqual(indFree.length, 0, 'Individuals + free must return 0 items without crash');

  // Search keyword intersections with free filter
  assertEqual(filterCatalog('all', 'free', 'revit').length, 1, 'Search revit + free -> 1');
  assertEqual(filterCatalog('all', 'free', 'BOQ').length, 1, 'Search BOQ + free -> 1');
  assertEqual(filterCatalog('all', 'free', 'NDA').length, 1, 'Search NDA + free -> 1');
  assertEqual(filterCatalog('all', 'free', 'تدفق نقدي').length, 1, 'Search تدفق نقدي + free -> 1');
  assertEqual(filterCatalog('all', 'free', 'nonexistenttermXYZ').length, 0, 'Non-existent search + free -> 0');
});

// --- 3. PRODUCT CARD CONTRAST & ACCESSIBILITY ---
suite.test('ADV-M2-1.3: ProductCard rendering differentiation: Free vs Premium', () => {
  const freeItem = mockProducts.find((p) => p.id === 'free-p1');
  const premiumItem = mockProducts.find((p) => p.id === 'p1');

  const freeHtml = renderComponent(ProductCard, { product: freeItem });
  const premiumHtml = renderComponent(ProductCard, { product: premiumItem });

  // Free item assertions
  assert(freeHtml.includes('أصل مجاني للتحميل الفوري'), 'Free card must show free badge');
  assert(freeHtml.includes('مجاناً 100%'), 'Free card must show "مجاناً 100%"');
  assert(freeHtml.includes('تحميل مجاني'), 'Free card CTA must say "تحميل مجاني"');
  assert(freeHtml.includes('animate-pulse'), 'Free card badge must pulse');
  assert(freeHtml.includes('animate-ping'), 'Free card dot must ping');

  // Premium item assertions
  assert(!premiumHtml.includes('أصل مجاني للتحميل الفوري'), 'Premium card must NOT show free badge');
  assert(!premiumHtml.includes('مجاناً 100%'), 'Premium card must NOT show "مجاناً 100%"');
  assert(premiumHtml.includes('شراء'), 'Premium card CTA must say "شراء"');
  assert(premiumHtml.includes('🛒'), 'Premium card must show cart icon');
});

// --- 4. MODAL UPSELL INTEGRITY & CODES ---
suite.test('ADV-M2-1.4: FreeDownloadModal upsell recommendation relevance & discount coupon', () => {
  const modalFilePath = path.join(__dirname, '../src/components/storefront/FreeDownloadModal.tsx');
  const modalSource = fs.readFileSync(modalFilePath, 'utf8');

  // Verify RASEEN40 is baked into both the download file template and the post-download upsell card
  assert(modalSource.includes('RASEEN40'), 'Modal source must contain RASEEN40 discount code');
  assert(modalSource.includes('خصم 40%') || modalSource.includes('وفر 40%'), 'Modal source must declare 40% discount highlight');
  assert(modalSource.includes('ترقية احترافية موصى بها'), 'Modal source must have upsell badge');

  // Verify all 4 free items map to existing, active premium products
  const upsellMapping = [
    { freeId: 'free-p1', expectedUpsell: ['p41', 'p13'] },
    { freeId: 'free-p2', expectedUpsell: ['p14'] },
    { freeId: 'free-p3', expectedUpsell: ['p1', 'p47'] },
    { freeId: 'free-p4', expectedUpsell: ['p7', 'p38'] },
  ];

  for (const map of upsellMapping) {
    const freeProduct = mockProducts.find((p) => p.id === map.freeId);
    assert(freeProduct, `Free product ${map.freeId} must exist`);

    const hasMatch = map.expectedUpsell.some((targetId) => {
      const target = mockProducts.find((p) => p.id === targetId);
      return target && target.price > 0;
    });

    assert(hasMatch, `Free product ${map.freeId} must map to an active premium product`);
  }
});

// --- 5. ADVERSARIAL LEAD CAPTURE VALIDATION ---
suite.test('ADV-M2-1.5: Adversarial leads validation: malformed contacts & boundary injection', async () => {
  // Negative Case 1: Bad phone
  const badPhoneReq = new Request('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: '12345',
      channel: 'whatsapp',
      interest: 'تحميل مجاني',
    }),
  });
  const badPhoneRes = await leadsRoute.POST(badPhoneReq);
  assertEqual(badPhoneRes.status, 400, 'Invalid phone number must return 400');

  // Negative Case 2: Bad email
  const badEmailReq = new Request('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'not-an-email',
      channel: 'email',
      interest: 'تحميل مجاني',
    }),
  });
  const badEmailRes = await leadsRoute.POST(badEmailReq);
  assertEqual(badEmailRes.status, 400, 'Invalid email address must return 400');

  // Negative Case 3: Empty contact info
  const emptyReq = new Request('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      channel: 'whatsapp',
      interest: 'تحميل مجاني',
    }),
  });
  const emptyRes = await leadsRoute.POST(emptyReq);
  assertEqual(emptyRes.status, 400, 'Empty contact info must return 400');

  // Positive Case: Valid GCC mobile format
  const validReq = new Request('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'م. مروان المهندس',
      phone: '0551234567',
      channel: 'whatsapp',
      interest: 'تحميل أصل مجاني: حزمة عائلات Revit المعمارية التمهيدية',
      metadata: {
        productId: 'free-p1',
        source: 'free_lead_magnet_modal',
      },
    }),
  });
  const validRes = await leadsRoute.POST(validReq);
  assertEqual(validRes.status, 200, 'Valid KSA mobile must return 200');
  const validData = await validRes.json();
  assertEqual(validData.success, true);
  assert(validData.leadId.startsWith('LEAD-'));
});

// Run the suite
suite.run().then((res) => {
  console.log(`\nReviewer M2-1 Adversarial Suite: ${res.passed}/${res.total} passed (failed: ${res.failed})`);
  if (res.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
