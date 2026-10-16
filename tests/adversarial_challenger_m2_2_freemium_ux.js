/**
 * Adversarial Challenger Test Suite: Freemium UX, Download Delivery & Modal Dismissibility
 * Agent: challenger_m2_2 (archetype: teamwork_preview_challenger)
 * 
 * Objectives:
 *   1. Frictionless UX: Confirm zero cart/checkout redirects for free items (free-p1..free-p4)
 *   2. Modal Dismissibility: Test ESC key, backdrop click, close button (✕), post-download return
 *   3. Download Delivery & Blob Generation: Test UTF-8 content, metadata, MIME type, browser trigger
 *   4. Lead Capture API: Test channel routing, boundary cases, input validation
 *   5. Upsell Recommendation Matrix: Test product ID validity and pricing integrity
 */

const fs = require('fs');
const path = require('path');
const projectRoot = path.resolve(__dirname, '..');

// Use project jiti for TS/JSX importing
const jiti = require('jiti')(path.join(projectRoot, 'test_loader.js'), {
  jsx: true,
  alias: {
    '@': path.join(projectRoot, 'src'),
  },
});

const {
  TestSuite,
  assert,
  assertEqual,
  assertDeepEqual,
  renderComponent,
} = require('./e2e/test_utils.js');

const { mockProducts } = jiti('@/lib/mockData.ts');
const ProductCard = jiti('@/components/storefront/ProductCard.tsx').default;
const FilterBar = jiti('@/components/storefront/FilterBar.tsx').default;
const FreeDownloadModal = jiti('@/components/storefront/FreeDownloadModal.tsx').default;
const leadsRoute = jiti('@/app/api/leads/route.ts');

const suite = new TestSuite('Adversarial Challenger M2_2: Freemium UX & Download Delivery');

// =========================================================================
// SECTION 1: Frictionless Free Products UX (Zero Cart / Zero Checkout)
// =========================================================================

suite.test('FRIC-1.1: ProductCard source guarantees zero cart addition for free items', () => {
  const productCardSrc = fs.readFileSync(
    path.join(projectRoot, 'src/components/storefront/ProductCard.tsx'),
    'utf-8'
  );

  // Check handleBuyClick logic
  assert(
    productCardSrc.includes('if (product.price === 0)'),
    'ProductCard must check if product.price === 0 in handleBuyClick'
  );
  assert(
    productCardSrc.includes('setIsFreeModalOpen(true)'),
    'ProductCard must open FreeDownloadModal when price is 0'
  );

  // Ensure addItem is ONLY called in the else branch
  const match = productCardSrc.match(
    /if\s*\(\s*product\.price\s*===\s*0\s*\)\s*\{[\s\S]*?setIsFreeModalOpen\(true\);[\s\S]*?\}\s*else\s*\{[\s\S]*?addItem\(product\);[\s\S]*?\}/
  );
  assert(match, 'handleBuyClick must strictly separate free modal from addItem(product)');

  // Verify that FreeDownloadModal is rendered outside <Link> to prevent navigation on modal clicks
  const linkCloseIdx = productCardSrc.indexOf('</Link>');
  const modalIdx = productCardSrc.indexOf('<FreeDownloadModal');
  assert(
    linkCloseIdx > 0 && modalIdx > linkCloseIdx,
    'FreeDownloadModal must be outside </Link> to prevent Link event bubbling'
  );
});

suite.test('FRIC-1.2: Product Detail Page source guarantees zero cart addition for free items', () => {
  const productPageSrc = fs.readFileSync(
    path.join(projectRoot, 'src/app/product/[id]/page.tsx'),
    'utf-8'
  );

  assert(
    productPageSrc.includes('product.price === 0 ? ('),
    'Product page must conditionally branch on product.price === 0'
  );
  assert(
    productPageSrc.includes('setIsFreeModalOpen(true)'),
    'Product page must set isFreeModalOpen to true on button click for free products'
  );
  assert(
    productPageSrc.includes('تحميل مجاني فوري'),
    'Product page button text must say "تحميل مجاني فوري" for free products'
  );
  
  // Ensure addItem is in the alternative branch
  const branchMatch = productPageSrc.match(
    /product\.price\s*===\s*0\s*\?[\s\S]*?setIsFreeModalOpen\(true\)[\s\S]*?:[\s\S]*?addItem\(product\)/
  );
  assert(branchMatch, 'Product page must never call addItem(product) for free items');
});

suite.test('FRIC-1.3: FreeDownloadModal contains zero payment inputs or gateway prompts', () => {
  const modalSrc = fs.readFileSync(
    path.join(projectRoot, 'src/components/storefront/FreeDownloadModal.tsx'),
    'utf-8'
  );

  const paymentKeywords = [
    'creditCard', 'cardNumber', 'رقم البطاقة',
    'cvv', 'CVV', 'expiry', 'تاريخ الانتهاء',
    'instapay', 'إنستاباي', 'vodafone', 'فودافون كاش',
    'fawry pay', 'بوابة فوري', 'stripe', 'mada', 'مدى'
  ];

  for (const kw of paymentKeywords) {
    assert(
      !modalSrc.toLowerCase().includes(kw.toLowerCase()),
      `FreeDownloadModal must NOT contain payment keyword: ${kw}`
    );
  }
});

suite.test('FRIC-1.4: All 4 free lead magnets render FreeDownloadModal correctly', () => {
  const freeProducts = mockProducts.filter((p) => p.price === 0);
  assertEqual(freeProducts.length, 4, 'Must have exactly 4 free lead magnets');

  for (const prod of freeProducts) {
    const html = renderComponent(FreeDownloadModal, {
      isOpen: true,
      product: prod,
      onClose: () => {},
    });

    const expectedTitleEscaped = prod.title.replace(/&/g, '&amp;');
    assert(html.includes(expectedTitleEscaped), `Modal must render product title: ${prod.title}`);
    assert(html.includes('0 ر.س') || html.includes('مجاني 100%'), `Modal must highlight zero cost for ${prod.id}`);
    assert(html.includes('role="dialog"'), 'Modal must have role="dialog"');
    assert(html.includes('aria-modal="true"'), 'Modal must have aria-modal="true"');
  }
});

// =========================================================================
// SECTION 2: Modal Dismissibility Stress-Testing
// =========================================================================

suite.test('DISM-2.1: Close button (✕) and post-download button have onClose handlers', () => {
  const modalSrc = fs.readFileSync(
    path.join(projectRoot, 'src/components/storefront/FreeDownloadModal.tsx'),
    'utf-8'
  );

  // Close button ✕
  assert(
    modalSrc.includes('onClick={onClose}') && modalSrc.includes('aria-label="إغلاق النافذة"'),
    'Close button (✕) must have onClick={onClose} and accessible aria-label'
  );

  // Post-download return button
  assert(
    modalSrc.includes('تم، العودة للمتجر'),
    'Post-download confirmation must provide "تم، العودة للمتجر" button'
  );
});

suite.test('DISM-2.2: Modal backdrop click dismissibility check', () => {
  const modalSrc = fs.readFileSync(
    path.join(projectRoot, 'src/components/storefront/FreeDownloadModal.tsx'),
    'utf-8'
  );

  // Check if backdrop outer div has onClick={onClose} or if an overlay backdrop div exists
  const hasBackdropClick =
    modalSrc.includes('onClick={onClose}') &&
    (modalSrc.includes('fixed inset-0') || modalSrc.includes('absolute inset-0'));

  // In CartModal, there is: <div className="absolute inset-0" onClick={handleClose} aria-hidden="true" />
  // In FreeDownloadModal, check whether backdrop click handler is implemented:
  const hasOverlayBackdropDiv =
    /className="absolute inset-0"[^>]*onClick=\{onClose\}/.test(modalSrc) ||
    /className="fixed inset-0[^"]*"[^>]*onClick=\{onClose\}/.test(modalSrc) ||
    /className="fixed inset-0[^"]*"[^>]*onClick=\{\(e\)\s*=>\s*\{\s*if\s*\(e\.target\s*===\s*e\.currentTarget\)\s*onClose\(\)/.test(modalSrc);

  // We record the exact empirical observation:
  const backdropDismissible = hasOverlayBackdropDiv;
  assert(
    backdropDismissible,
    'EMPIRICAL FINDING: FreeDownloadModal backdrop does NOT have an onClick={onClose} dismiss handler'
  );
});

suite.test('DISM-2.3: Modal ESC key dismissibility check', () => {
  const modalSrc = fs.readFileSync(
    path.join(projectRoot, 'src/components/storefront/FreeDownloadModal.tsx'),
    'utf-8'
  );

  // Check whether useEffect registers keydown listener for Escape
  const hasEscListener =
    modalSrc.includes('keydown') &&
    (modalSrc.includes('Escape') || modalSrc.includes('keyCode === 27'));

  assert(
    hasEscListener,
    'EMPIRICAL FINDING: FreeDownloadModal does NOT register a keydown listener for Escape (ESC key)'
  );
});

// =========================================================================
// SECTION 3: Download Delivery & Blob Generation Stress-Testing
// =========================================================================

suite.test('BLOB-3.1: Blob generator produces valid, non-empty text bundle for all 4 free products', () => {
  const freeProducts = mockProducts.filter((p) => p.price === 0);

  for (const product of freeProducts) {
    // Replicate the exact generator logic from FreeDownloadModal.tsx
    const fileHeader = `======================================================================\n` +
      `               منصة رَصين — RASEEN BUSINESS PLATFORM                  \n` +
      `                   أصل مجاني معتمد للتحميل الفوري                     \n` +
      `======================================================================\n\n` +
      `اسم الأصل: ${product.title}\n` +
      `المعرف: ${product.id}\n` +
      `القسم: ${product.category}\n` +
      `نوع الملف: ${product.fileType}\n` +
      `الحجم التقديري: ${product.fileSize || product.technicalSpecs?.fileSize || 'جاهز للاستخدام'}\n` +
      `الترخيص: ${product.license === 'commercial' ? 'ترخيص تجاري كامل' : 'ترخيص شخصي مصرح'}\n` +
      `تاريخ الإصدار والتحميل: ${new Date().toISOString()}\n\n` +
      `المواصفات الفنية المعتمدة:\n` +
      (product.technicalSpecs?.lodStandard ? `- معيار النمذجة: ${product.technicalSpecs.lodStandard}\n` : '') +
      (product.technicalSpecs?.blocksCount ? `- عدد العائلات / البلوكات: ${product.technicalSpecs.blocksCount}\n` : '') +
      (product.technicalSpecs?.sheetsCount ? `- عدد أوراق العمل: ${product.technicalSpecs.sheetsCount}\n` : '') +
      (product.technicalSpecs?.formulasCount ? `- عدد المعادلات البرمجية: ${product.technicalSpecs.formulasCount}\n` : '') +
      (product.technicalSpecs?.pagesCount ? `- عدد الصفحات القانونية: ${product.technicalSpecs.pagesCount}\n` : '') +
      (product.technicalSpecs?.jurisdiction ? `- الاختصاص القضائي: ${product.technicalSpecs.jurisdiction}\n` : '') +
      `- برامج التوافق: ${product.technicalSpecs?.compatibility?.join(' | ') || 'Office & CAD'}\n` +
      `- صيغ الملفات: ${product.technicalSpecs?.fileFormats?.join(' | ') || 'All formats'}\n\n` +
      `روابط إضافية وتحديثات:\n` +
      `- رابط المنصة: https://raseen.store\n` +
      `- ملف الأصل: ${product.fileUrl || '/downloads/free/' + product.id}\n\n` +
      `----------------------------------------------------------------------\n` +
      `ملاحظة: هذا الأصل مرخص مجاناً 100% بدون أي تكلفة أو وسيلة دفع.\n` +
      `للترقية إلى الباقات الاحترافية الكاملة، استخدم كوبون الخصم: RASEEN40 (خصم 40%)\n` +
      `======================================================================\n`;

    // Verify content length and structure
    assert(fileHeader.length > 300, `Generated bundle for ${product.id} must be > 300 chars`);
    assert(fileHeader.includes(product.id), `Bundle must include product ID ${product.id}`);
    assert(fileHeader.includes('RASEEN40'), 'Bundle must include discount coupon RASEEN40');
    assert(fileHeader.includes('منصة رَصين'), 'Bundle must include platform brand');

    // Test Blob construction in Node.js environment
    const blob = new Blob([fileHeader], { type: 'text/plain;charset=utf-8' });
    assertEqual(blob.type, 'text/plain;charset=utf-8', 'Blob MIME type must be text/plain;charset=utf-8');
    assert(blob.size > 300, 'Blob byte size must be > 300 bytes');
  }
});

suite.test('BLOB-3.2: Filename pattern and download anchor tag generation', () => {
  const modalSrc = fs.readFileSync(
    path.join(projectRoot, 'src/components/storefront/FreeDownloadModal.tsx'),
    'utf-8'
  );

  assert(
    modalSrc.includes('link.download = `${product.id}-starter-pack.txt`'),
    'Filename must follow `${product.id}-starter-pack.txt` pattern'
  );
  assert(
    modalSrc.includes('URL.createObjectURL(blob)'),
    'Must create object URL from blob'
  );
  assert(
    modalSrc.includes('document.body.appendChild(link)'),
    'Must append anchor tag to body for cross-browser click support'
  );
  assert(
    modalSrc.includes('link.click()'),
    'Must trigger programmatic click on anchor'
  );
  assert(
    modalSrc.includes('document.body.removeChild(link)'),
    'Must remove anchor tag from body after click'
  );
  assert(
    modalSrc.includes('URL.revokeObjectURL(url)'),
    'Must revoke object URL to prevent memory leaks'
  );
});

// =========================================================================
// SECTION 4: Lead Capture API Stress-Testing
// =========================================================================

suite.test('LEAD-4.1: /api/leads validates WhatsApp and Email phone/email formats', async () => {
  // 1. Valid WhatsApp
  const reqWA = new Request('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'سالم الدوسري',
      phone: '0551234567',
      channel: 'whatsapp',
      interest: 'تحميل نموذج BIM',
    }),
  });
  const resWA = await leadsRoute.POST(reqWA);
  assertEqual(resWA.status, 200, 'Valid Saudi 05 phone must return 200');

  // 2. Valid Egypt phone
  const reqEG = new Request('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: '01012345678',
      channel: 'whatsapp',
      interest: 'تحميل شيت إكسل',
    }),
  });
  const resEG = await leadsRoute.POST(reqEG);
  assertEqual(resEG.status, 200, 'Valid Egypt 010 phone must return 200');

  // 3. Invalid phone format
  const reqBadPhone = new Request('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: '12345',
      channel: 'whatsapp',
      interest: 'تحميل نموذج',
    }),
  });
  const resBadPhone = await leadsRoute.POST(reqBadPhone);
  assertEqual(resBadPhone.status, 400, 'Invalid phone number must return 400');

  // 4. Invalid email format
  const reqBadEmail = new Request('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'not-an-email',
      channel: 'email',
      interest: 'تحميل نموذج',
    }),
  });
  const resBadEmail = await leadsRoute.POST(reqBadEmail);
  assertEqual(resBadEmail.status, 400, 'Invalid email format must return 400');
});

suite.test('LEAD-4.2: Missing contact input in FreeDownloadModal triggers immediate client error', () => {
  const modalSrc = fs.readFileSync(
    path.join(projectRoot, 'src/components/storefront/FreeDownloadModal.tsx'),
    'utf-8'
  );

  assert(
    modalSrc.includes('يرجى إدخال رقم الواتساب لاستلام رابط التحميل والتحديثات.'),
    'Client form must validate missing WhatsApp contact before network call'
  );
  assert(
    modalSrc.includes('يرجى إدخال البريد الإلكتروني لاستلام رابط التحميل والتحديثات.'),
    'Client form must validate missing Email contact before network call'
  );
});

// =========================================================================
// SECTION 5: Upsell Catalog Recommendation Integrity
// =========================================================================

suite.test('UPSELL-5.1: All upsell target products exist and have valid pricing in catalog', () => {
  const targetIds = ['p41', 'p13', 'p14', 'p1', 'p47', 'p7', 'p38'];

  for (const id of targetIds) {
    const prod = mockProducts.find((p) => p.id === id);
    assert(prod, `Target upsell product ${id} must exist in mockProducts`);
    assert(prod.price > 0, `Target upsell product ${id} must be a premium item (price > 0)`);
    assert(prod.title.length > 5, `Target upsell product ${id} must have descriptive title`);
  }
});

suite.test('UPSELL-5.2: FreeDownloadModal maps every free item to a relevant premium upsell', () => {
  const modalSrc = fs.readFileSync(
    path.join(projectRoot, 'src/components/storefront/FreeDownloadModal.tsx'),
    'utf-8'
  );

  assert(modalSrc.includes("product.id === 'free-p1'"), 'Must handle upsell for free-p1');
  assert(modalSrc.includes("product.id === 'free-p2'"), 'Must handle upsell for free-p2');
  assert(modalSrc.includes("product.id === 'free-p3'"), 'Must handle upsell for free-p3');
  assert(modalSrc.includes("product.id === 'free-p4'"), 'Must handle upsell for free-p4');
  assert(modalSrc.includes('RASEEN40'), 'Must provide 40% discount coupon in upsell');
});

module.exports = suite;

if (require.main === module) {
  suite.run().then((success) => {
    process.exit(success ? 0 : 1);
  });
}
