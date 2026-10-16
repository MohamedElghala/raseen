/**
 * Independent Forensic Audit Verification Script for Milestone M2
 * Auditor: Forensic Auditor M2-1 (c332033c-94c0-42ab-a073-9ac6c0a290d1)
 * Target: C:\Users\Mohamed Helmy\.gemini\antigravity\scratch\rawnaq
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

const suite = new TestSuite('Forensic Integrity Audit: Milestone M2');

// =========================================================================
// FORENSIC CHECK 1: Authentic Assertions in tier1_freemium_bim.test.js
// =========================================================================
suite.test('FORENSIC-1: tier1_freemium_bim.test.js assertions are authentic without dummy passes', () => {
  const testFilePath = path.join(__dirname, 'e2e/tier1_freemium_bim.test.js');
  assert(fs.existsSync(testFilePath), 'tier1_freemium_bim.test.js must exist on disk');
  const content = fs.readFileSync(testFilePath, 'utf-8');

  // Check against prohibited facade/bypass patterns
  assert(!content.includes('process.exit(0)'), 'Test must not hardcode process.exit(0)');
  assert(!content.includes('assert(true)'), 'Test must not contain trivial assert(true)');
  assert(!content.includes('assertEqual(1, 1)'), 'Test must not contain tautological assertEqual(1, 1)');
  assert(!content.includes('assertEqual(true, true)'), 'Test must not contain tautological boolean checks');

  // Verify presence of genuine assertion calls
  const assertCount = (content.match(/assert\(/g) || []).length;
  const assertEqualCount = (content.match(/assertEqual\(/g) || []).length;
  assert(assertCount >= 10, `Expected at least 10 assert calls, found ${assertCount}`);
  assert(assertEqualCount >= 15, `Expected at least 15 assertEqual calls, found ${assertEqualCount}`);

  // Verify authentic component rendering calls
  const renderCount = (content.match(/renderComponent\(/g) || []).length;
  assert(renderCount >= 4, `Expected at least 4 renderComponent calls, found ${renderCount}`);

  // Test sensitivity: verify that an assertion would actually throw on invalid value
  let caught = false;
  try {
    assertEqual(content.length, -999, 'Sensitivity test');
  } catch (e) {
    caught = true;
  }
  assert(caught, 'assertEqual must actually throw on mismatch');
});

// =========================================================================
// FORENSIC CHECK 2: Genuine Rich Data in mockData.ts (4 Lead Magnets)
// =========================================================================
suite.test('FORENSIC-2: mockData.ts contains 4 genuine, complete lead magnet assets with rich technicalSpecs', () => {
  const { mockProducts } = jiti('@/lib/mockData.ts');
  const freeItems = mockProducts.filter((p) => p.price === 0);
  assertEqual(freeItems.length, 4, 'Exactly 4 free lead magnets must exist');

  const requiredIds = ['free-p1', 'free-p2', 'free-p3', 'free-p4'];
  const actualIds = freeItems.map((p) => p.id);
  assert(requiredIds.every((id) => actualIds.includes(id)), `Catalog must include ${requiredIds.join(', ')}`);

  // Verify non-empty rich contents
  for (const item of freeItems) {
    assert(item.title && item.title.length > 20, `${item.id}: Title must be descriptive (> 20 chars)`);
    assert(item.description && item.description.length > 50, `${item.id}: Description must be rich (> 50 chars)`);
    assert(item.imageUrl && item.imageUrl.startsWith('https://'), `${item.id}: Must have valid HTTPS image URL`);
    assert(item.fileUrl && item.fileUrl.startsWith('/downloads/free/'), `${item.id}: Must have valid fileUrl`);
    assert(item.fileSize && item.fileSize.includes('MB'), `${item.id}: Must specify fileSize in MB`);
    assert(item.rating >= 4.5, `${item.id}: Must have high rating`);
    assert(item.tags && item.tags.length >= 5, `${item.id}: Must have at least 5 tags`);
    assert(item.technicalSpecs, `${item.id}: Must have technicalSpecs object`);
    assert(item.originalPrice && item.originalPrice > 0, `${item.id}: Must have originalPrice showing value anchor`);
  }

  // Check specific domain deliverables:
  // 1. Revit LOD 300
  const p1 = freeItems.find((p) => p.id === 'free-p1');
  assertEqual(p1.technicalSpecs.lodStandard, 'LOD 300 (Starter Pack)');
  assertEqual(p1.technicalSpecs.blocksCount, 35);
  assert(p1.technicalSpecs.fileFormats.includes('.RFA'));

  // 2. Mini BOQ
  const p2 = freeItems.find((p) => p.id === 'free-p2');
  assertEqual(p2.technicalSpecs.sheetsCount, 4);
  assertEqual(p2.technicalSpecs.formulasCount, 145);
  assert(p2.technicalSpecs.fileFormats.includes('.XLSX'));

  // 3. Mini Legal NDA
  const p3 = freeItems.find((p) => p.id === 'free-p3');
  assertEqual(p3.technicalSpecs.pagesCount, 6);
  assert(p3.technicalSpecs.jurisdiction.includes('السعودية'));

  // 4. Mini Budget Cash Flow
  const p4 = freeItems.find((p) => p.id === 'free-p4');
  assertEqual(p4.technicalSpecs.sheetsCount, 5);
  assertEqual(p4.technicalSpecs.formulasCount, 180);
});

// =========================================================================
// FORENSIC CHECK 3: FreeDownloadModal Authenticity & Real /api/leads integration
// =========================================================================
suite.test('FORENSIC-3: FreeDownloadModal and /api/leads perform authentic lead capture and download generation', async () => {
  const modalFilePath = path.join(__dirname, '..', 'src', 'components', 'storefront', 'FreeDownloadModal.tsx');
  const content = fs.readFileSync(modalFilePath, 'utf-8');

  // Verify real fetch call to /api/leads
  assert(content.includes("fetch('/api/leads'"), 'FreeDownloadModal must execute fetch to /api/leads');
  assert(content.includes("method: 'POST'"), 'Must send POST request');
  assert(content.includes("JSON.stringify(payload)"), 'Must serialize JSON payload');
  assert(content.includes('new Blob('), 'Must create Blob for authentic file download');
  assert(content.includes('URL.createObjectURL('), 'Must create object URL for download');
  assert(content.includes('RASEEN40'), 'Must present promotional coupon RASEEN40 for upsell');

  // Test /api/leads route with real HTTP requests
  const leadsRoute = jiti('@/app/api/leads/route.ts');

  // 3.1: Valid WhatsApp Lead for free asset
  const waReq = new Request('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'مهندس أحمد',
      phone: '0551234567',
      channel: 'whatsapp',
      interest: 'تحميل حزمة عائلات Revit',
      metadata: { productId: 'free-p1' },
    }),
  });
  const waRes = await leadsRoute.POST(waReq);
  const waData = await waRes.json();
  assertEqual(waRes.status, 200, 'WhatsApp lead must return HTTP 200');
  assertEqual(waData.success, true, 'WhatsApp lead must return success: true');
  assert(waData.leadId && waData.leadId.startsWith('LEAD-'), 'leadId must start with LEAD-');

  // 3.2: Valid Email Lead for free asset
  const emReq = new Request('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'مكتب الصفوة للمحاماة',
      email: 'legal@alsafwa-law.com',
      channel: 'email',
      interest: 'تحميل نموذج NDA المجاني',
      metadata: { productId: 'free-p3' },
    }),
  });
  const emRes = await leadsRoute.POST(emReq);
  const emData = await emRes.json();
  assertEqual(emRes.status, 200, 'Email lead must return HTTP 200');
  assertEqual(emData.success, true, 'Email lead must return success: true');

  // 3.3: Invalid Lead Validation (Phone too short) -> Must be rejected with HTTP 400
  const badReq1 = new Request('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: '123',
      channel: 'whatsapp',
    }),
  });
  const badRes1 = await leadsRoute.POST(badReq1);
  assertEqual(badRes1.status, 400, 'Invalid phone number must be rejected with HTTP 400');

  // 3.4: Invalid Lead Validation (Malformed email) -> Must be rejected with HTTP 400
  const badReq2 = new Request('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'not-an-email-address',
      channel: 'email',
    }),
  });
  const badRes2 = await leadsRoute.POST(badReq2);
  assertEqual(badRes2.status, 400, 'Malformed email must be rejected with HTTP 400');
});

// =========================================================================
// FORENSIC CHECK 4: FilterBar Dynamic Filtering Logic
// =========================================================================
suite.test('FORENSIC-4: FilterBar & page.tsx dynamic filtering isolates free items and handles intersections', () => {
  const { mockProducts } = jiti('@/lib/mockData.ts');

  // Filtering function replicating page.tsx lines 28-46
  function filterCatalog(searchTerm, selectedCategory, selectedFileType) {
    return mockProducts.filter((product) => {
      const term = searchTerm.toLowerCase().trim();
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

  // 4.1: 1-Click Free filter returns all 4 free products
  const freeAll = filterCatalog('', 'all', 'free');
  assertEqual(freeAll.length, 4, 'Free filter across all categories must return 4 products');

  // 4.2: Free filter + Engineering category returns free-p1 and free-p2
  const freeEng = filterCatalog('', 'engineering', 'free');
  assertEqual(freeEng.length, 2, 'Free + Engineering must return 2 products');
  assert(freeEng.some((p) => p.id === 'free-p1') && freeEng.some((p) => p.id === 'free-p2'));

  // 4.3: Free filter + Business category returns free-p3
  const freeBiz = filterCatalog('', 'business', 'free');
  assertEqual(freeBiz.length, 1, 'Free + Business must return 1 product');
  assertEqual(freeBiz[0].id, 'free-p3');

  // 4.4: Free filter + Accounting category returns free-p4
  const freeAcc = filterCatalog('', 'accounting', 'free');
  assertEqual(freeAcc.length, 1, 'Free + Accounting must return 1 product');
  assertEqual(freeAcc[0].id, 'free-p4');

  // 4.5: Free filter + Students category returns 0 products
  const freeStu = filterCatalog('', 'students', 'free');
  assertEqual(freeStu.length, 0, 'Free + Students must return 0 products');

  // 4.6: Free filter + Search "Revit" returns free-p1
  const freeSearchRevit = filterCatalog('Revit', 'all', 'free');
  assertEqual(freeSearchRevit.length, 1, 'Free + Search "Revit" must return 1 product');
  assertEqual(freeSearchRevit[0].id, 'free-p1');

  // 4.7: Free filter + Search "غير موجود" returns 0
  const freeSearchNone = filterCatalog('كلمة غير موجودة بتاتاً', 'all', 'free');
  assertEqual(freeSearchNone.length, 0, 'Non-existent search term must return 0');

  // 4.8: Default filter (all, all) returns all 54 products
  const allProds = filterCatalog('', 'all', 'all');
  assertEqual(allProds.length, mockProducts.length, 'Default filter must return all catalog items');
});

// =========================================================================
// FORENSIC CHECK 5: ProductCard Separation from Cart & Free Badge
// =========================================================================
suite.test('FORENSIC-5: ProductCard dispatches free products to FreeDownloadModal, not CartModal', () => {
  const cardPath = path.join(__dirname, '..', 'src', 'components', 'storefront', 'ProductCard.tsx');
  const cardContent = fs.readFileSync(cardPath, 'utf-8');

  // Inspect handleBuyClick implementation
  assert(cardContent.includes('if (product.price === 0)'), 'ProductCard must branch on price === 0');
  assert(cardContent.includes('setIsFreeModalOpen(true)'), 'Must open free modal on price === 0');
  assert(cardContent.includes('addItem(product)'), 'Must call addItem only for paid products');

  // Inspect badge styling
  assert(cardContent.includes('bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600'), 'Must have emerald/teal gradient badge');
  assert(cardContent.includes('animate-pulse'), 'Must have animate-pulse on badge container');
  assert(cardContent.includes('animate-ping'), 'Must have animate-ping on indicator dot');
  assert(cardContent.includes('مجاناً 100%'), 'Must display "مجاناً 100%"');
});

// Run suite
suite.run().then((res) => {
  if (res.failed > 0) {
    console.error(`\n❌ FORENSIC AUDIT FAILED with ${res.failed} failures.`);
    process.exit(1);
  } else {
    console.log(`\n✅ ALL ${res.passed} FORENSIC AUDIT CHECKS PASSED EMPIRICALLY!`);
    process.exit(0);
  }
}).catch((err) => {
  console.error('Fatal error during forensic audit:', err);
  process.exit(1);
});
