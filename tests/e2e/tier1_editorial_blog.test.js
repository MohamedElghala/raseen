/**
 * Tier 1: Editorial Blog & Knowledge Hub Suite Tests
 * Authority: Requirement R3, Milestone M3
 * Interface: src/lib/blogTypes.ts, src/lib/blogArticlesData.ts,
 *            src/components/blog/ReadingProgressBar.tsx,
 *            src/components/blog/TableOfContents.tsx,
 *            src/components/blog/EmbeddedProductCard.tsx,
 *            src/app/community/page.tsx,
 *            src/app/community/article/[slug]/page.tsx
 */

const {
  jiti,
  TestSuite,
  assert,
  assertEqual,
  renderComponent,
} = require('./test_utils');

const { BLOG_ARTICLES, getArticleBySlug, getArticlesByCategory } = jiti('@/lib/blogArticlesData.ts');
const ReadingProgressBar = jiti('@/components/blog/ReadingProgressBar.tsx').default;
const TableOfContents = jiti('@/components/blog/TableOfContents.tsx').default;
const EmbeddedProductCard = jiti('@/components/blog/EmbeddedProductCard.tsx').default;
const CommunityPage = jiti('@/app/community/page.tsx').default;
const ArticleDetailPage = jiti('@/app/community/article/[slug]/page.tsx').default;

const suite = new TestSuite('Tier 1: Editorial Blog & Knowledge Hub Suite');

// Test 1: Verify 3 Authoritative SEO articles exist with valid slugs, categories, and embedded products
suite.test('BLOG-1.1: 3 Authoritative SEO articles exist with valid slugs, categories, and embedded products', () => {
  assert(BLOG_ARTICLES && Array.isArray(BLOG_ARTICLES), 'BLOG_ARTICLES must be an array');
  assert(BLOG_ARTICLES.length >= 3, 'Must contain at least 3 comprehensive SEO articles');

  // 1. Engineering BIM Article
  const bimArt = getArticleBySlug('bim-lod-standards-engineering');
  assert(bimArt, 'BIM LOD standards article must exist');
  assertEqual(bimArt.category, 'engineering');
  assertEqual(bimArt.categoryLabel, 'الهندسة وBIM');
  assert(bimArt.title.includes('LOD 300/400'), 'BIM article title must mention LOD 300/400');
  assert(bimArt.embeddedProductIds.includes('free-p1'), 'BIM article must embed free-p1 (Revit Starter)');
  assert(bimArt.embeddedProductIds.includes('p13'), 'BIM article must embed p13 (AutoCAD blocks)');
  assert(bimArt.sections.length >= 5, 'BIM article must have at least 5 structured sections');
  assert(bimArt.sections.some((s) => s.id === 'lod-definition-matrix'), 'BIM article must contain lod-definition-matrix');
  assert(bimArt.readingTime && bimArt.readingTime.includes('دقائق'), 'BIM article must have reading time');

  // 2. Financial Models & IFRS Article
  const finArt = getArticleBySlug('financial-modeling-cashflow-ifrs');
  assert(finArt, 'Financial modeling IFRS article must exist');
  assertEqual(finArt.category, 'financial');
  assertEqual(finArt.categoryLabel, 'المالية والمحاسبة الدولية');
  assert(finArt.title.includes('IFRS') || finArt.title.includes('النماذج المالية'), 'Financial article title must mention IFRS or financial models');
  assert(finArt.embeddedProductIds.includes('free-p4'), 'Financial article must embed free-p4 (Cash Flow & Budget)');
  assert(finArt.embeddedProductIds.includes('p7'), 'Financial article must embed p7 (Accounting sheet)');
  assert(finArt.sections.length >= 5, 'Financial article must have at least 5 structured sections');
  assert(finArt.sections.some((s) => s.id === 'ifrs-framework-cashflow'), 'Financial article must contain ifrs-framework-cashflow');

  // 3. Legal Contracts & NDA Article
  const legArt = getArticleBySlug('legal-contracts-nda-ip-protection');
  assert(legArt, 'Legal contracts NDA article must exist');
  assertEqual(legArt.category, 'legal');
  assertEqual(legArt.categoryLabel, 'القانون وحماية الملكية الفكرية');
  assert(legArt.title.includes('NDA') || legArt.title.includes('سرية المعلومات'), 'Legal article title must mention NDA or confidentiality');
  assert(legArt.embeddedProductIds.includes('free-p3'), 'Legal article must embed free-p3 (Mini NDA)');
  assert(legArt.embeddedProductIds.includes('p1'), 'Legal article must embed p1 (Legal Contracts bundle)');
  assert(legArt.sections.length >= 5, 'Legal article must have at least 5 structured sections');
  assert(legArt.sections.some((s) => s.id === 'contract-scope-deliverables'), 'Legal article must contain contract-scope-deliverables');

  // Verify getArticlesByCategory
  const engArticles = getArticlesByCategory('engineering');
  assert(engArticles.length >= 1, 'getArticlesByCategory(engineering) must return engineering articles');
  const allArticles = getArticlesByCategory('all');
  assertEqual(allArticles.length, BLOG_ARTICLES.length, 'getArticlesByCategory(all) must return all articles');
});

// Test 2: ReadingProgressBar renders accessible progressbar element with 0-100 tracking
suite.test('BLOG-1.2: ReadingProgressBar renders accessible progressbar element with 0-100 tracking', () => {
  const html = renderComponent(ReadingProgressBar);
  assert(html.includes('role="progressbar"'), 'Must have role="progressbar"');
  assert(html.includes('aria-label="مؤشر تقدم القراءة"'), 'Must have accessible aria-label');
  assert(html.includes('aria-valuemin="0"'), 'Must have aria-valuemin="0"');
  assert(html.includes('aria-valuemax="100"'), 'Must have aria-valuemax="100"');
  assert(html.includes('fixed top-0'), 'Must be fixed at the top of the viewport');
  assert(html.includes('z-50'), 'Must have z-50 to overlay sticky navigation');
});

// Test 3: TableOfContents renders all section anchors with smooth scroll navigation
suite.test('BLOG-1.3: TableOfContents renders all section anchors with smooth scroll navigation', () => {
  const bimArt = getArticleBySlug('bim-lod-standards-engineering');
  assert(bimArt, 'bim-lod-standards-engineering must exist');

  const html = renderComponent(TableOfContents, {
    sections: bimArt.sections,
  });

  assert(html.includes('aria-label="فهرس محتويات المقال"'), 'Must declare navigation landmark with aria-label');
  assert(html.includes('فهرس محتويات المقال'), 'Must render title heading');
  assert(html.includes(`${bimArt.sections.length} محاور`), 'Must render count of sections');

  // Verify each section anchor is rendered
  for (const sec of bimArt.sections) {
    assert(html.includes(`href="#${sec.id}"`), `Must render href anchor link for section #${sec.id}`);
  }
  // Check index badges
  assert(html.includes('>01<'), 'Must render 01 index badge');
  assert(html.includes('>02<'), 'Must render 02 index badge');
});

// Test 4: EmbeddedProductCard resolves free lead magnets with 0 price and emerald pulse badge
suite.test('BLOG-1.4: EmbeddedProductCard resolves free lead magnets with 0 price and emerald pulse badge', () => {
  const html = renderComponent(EmbeddedProductCard, { productId: 'free-p1' });

  assert(html.includes('أصل مجاني للتحميل الفوري'), 'Must render "أصل مجاني للتحميل الفوري" badge');
  assert(html.includes('مجاناً 100%'), 'Must render price as "مجاناً 100%"');
  assert(html.includes('تحميل الأصل مجاناً الآن'), 'Must render free download CTA button');
  assert(html.includes('animate-pulse'), 'Must have animated pulse');
  assert(html.includes('animate-ping'), 'Must have animated ping indicator dot');
  assert(html.includes('حزمة عائلات Revit المعمارية التمهيدية'), 'Must render free product title');
});

// Test 5: EmbeddedProductCard resolves premium paid products with pricing and store link
suite.test('BLOG-1.5: EmbeddedProductCard resolves premium paid products with pricing and store link', () => {
  const html = renderComponent(EmbeddedProductCard, { productId: 'p13' });

  assert(html.includes('مكتبة بلوكات AutoCAD المعمارية المعتمدة'), 'Must render p13 title');
  assert(html.includes('200 ج.م'), 'Must render price 200 ج.م');
  assert(html.includes('الباقة الاحترافية الكاملة'), 'Must indicate premium package badge');
  assert(html.includes('href="/product/p13"'), 'Must link to /product/p13 for purchase');
  assert(html.includes('شراء واستعراض الأصل'), 'Must render purchase CTA');
});

// Test 6: Community page renders dual-view switcher and editorial blog catalog
suite.test('BLOG-1.6: Community page renders dual-view switcher and editorial blog catalog', () => {
  const html = renderComponent(CommunityPage);

  // Verify dual switcher tabs
  assert(
    html.includes('المدونة التخصصية ومقالات السيو'),
    'Must render "المدونة التخصصية ومقالات السيو" tab button'
  );
  assert(
    html.includes('ساحة النقاشات وطلبات النماذج'),
    'Must render "ساحة النقاشات وطلبات النماذج" tab button'
  );

  // In default blog view, verify knowledge base header
  assert(
    html.includes('RASEEN EDITORIAL') && html.includes('TECHNICAL KNOWLEDGE BASE'),
    'Must render editorial knowledge base badge'
  );
  assert(html.includes('المدونة التخصصية ومركز أبحاث السيو'), 'Must render blog header title');

  // Verify articles rendered
  assert(html.includes('الدليل الشامل لمعايير نمذجة معلومات البناء BIM'), 'Must render BIM article');
  assert(html.includes('دليل بناء النماذج المالية والتدفقات النقدية'), 'Must render Financial article');
  assert(html.includes('الدليل القانوني لصياغة عقود العمل الحر'), 'Must render Legal article');

  // Verify links to article reader
  assert(
    html.includes('href="/community/article/bim-lod-standards-engineering"'),
    'Must link to BIM article slug'
  );
  assert(
    html.includes('href="/community/article/financial-modeling-cashflow-ifrs"'),
    'Must link to Financial article slug'
  );
  assert(
    html.includes('href="/community/article/legal-contracts-nda-ip-protection"'),
    'Must link to Legal article slug'
  );
});

// Test 7: Article detail page resolves slug and renders full content with sections, TOC, and embedded products
suite.test('BLOG-1.7: Article detail page resolves slug and renders full content with sections, TOC, and embedded products', () => {
  const bimPromise = Object.assign(
    Promise.resolve({ slug: 'bim-lod-standards-engineering' }),
    { slug: 'bim-lod-standards-engineering' }
  );
  const html = renderComponent(ArticleDetailPage, {
    params: bimPromise,
  });

  // Verify progress bar
  assert(html.includes('role="progressbar"'), 'Detail page must render ReadingProgressBar');

  // Verify Breadcrumbs
  assert(html.includes('الرئيسية'), 'Must render breadcrumb home');
  assert(html.includes('مجتمع رَصين'), 'Must render breadcrumb community');
  assert(html.includes('المدونة التخصصية'), 'Must render breadcrumb blog');

  // Verify Article Title & Author
  assert(html.includes('الدليل الشامل لمعايير نمذجة معلومات البناء BIM'), 'Must render H1 title');
  assert(html.includes('م. طارق الزيات'), 'Must render author name');

  // Verify Section anchors
  assert(html.includes('id="lod-definition-matrix"'), 'Must render section #lod-definition-matrix');
  assert(html.includes('id="lod300-vs-lod400-shop-drawings"'), 'Must render section #lod300-vs-lod400-shop-drawings');
  assert(html.includes('id="revit-parametric-optimization"'), 'Must render section #revit-parametric-optimization');

  // Verify TOC
  assert(html.includes('فهرس محتويات المقال'), 'Must render TableOfContents sidebar');

  // Verify Embedded Product Cards inside article
  assert(html.includes('أصل مجاني للتحميل الفوري'), 'Must embed free lead magnet (free-p1)');
  assert(html.includes('حزمة عائلات Revit المعمارية التمهيدية'), 'Must display free-p1 title');
  assert(html.includes('مكتبة بلوكات AutoCAD المعمارية المعتمدة'), 'Must display p13 title');

  // Verify graceful 404 fallback for missing article
  const notFoundPromise = Object.assign(
    Promise.resolve({ slug: 'non-existent-article-slug' }),
    { slug: 'non-existent-article-slug' }
  );
  const htmlNotFound = renderComponent(ArticleDetailPage, {
    params: notFoundPromise,
  });
  assert(htmlNotFound.includes('المقال التخصصي غير موجود'), 'Must show not-found message for invalid slug');
  assert(htmlNotFound.includes('العودة لمدونة ومجتمع رَصين'), 'Must offer return to community link');
});

module.exports = suite;
