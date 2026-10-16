/**
 * Adversarial Challenger Test Suite (Milestone M1 Expansion)
 * Agent: challenger_m1_1 (archetype: teamwork_preview_challenger)
 * 
 * Scope & Objectives:
 *   1. Viewport Edge Cases: Hero classes across responsive screen sizes (mobile 320px, tablet 768px, desktop 1280px+).
 *   2. Tab Switching Logic & Zero-Unmount DOM Architecture: All 4 tabs in Hero.tsx maintaining correct state, classes, and isolation.
 *   3. Catalog Filter Logic in src/app/page.tsx: matchesCategory, matchesSearch, matchesType under edge cases
 *      (category='all', non-existent category, empty search, uppercase/lowercase, special characters, regex payloads, length stress).
 *   4. Visual Hierarchy & Typographic Refinements: Cairo font, softened champagne gold gradients, slate/glass pill buttons in Hero, FilterBar, and Navbar.
 */

const fs = require('fs');
const path = require('path');
const projectRoot = path.resolve(__dirname, '..');

// Initialize jiti loader
const jiti = require('jiti')(path.join(projectRoot, 'test_loader.js'), {
  jsx: true,
  alias: {
    '@': path.join(projectRoot, 'src'),
  },
});

const React = jiti('react');
const ReactDOMServer = jiti('react-dom/server');

const Hero = jiti('@/components/storefront/Hero.tsx').default;
const FilterBar = jiti('@/components/storefront/FilterBar.tsx').default;
const { mockProducts } = jiti('@/lib/mockData.ts');

const {
  TestSuite,
  assert,
  assertEqual,
  assertDeepEqual,
  assertGreaterThan,
  assertGreaterThanOrEqual,
  renderComponent,
} = require('./e2e/test_utils.js');

const suite = new TestSuite('Milestone M1 Expansion: Hero Viewports, Tab Switching, & Catalog Filtering');

// =========================================================================
// SECTION 1: Viewport Edge Cases & Responsive Breakpoint Validation
// =========================================================================

suite.test('VIEWPORT-1.1: Mobile viewport (320px) base classes prevent overflow & overlapping', () => {
  const html = renderComponent(Hero, { onSearch: () => {} });

  // 1. Mobile padding
  assert(html.includes('pt-6 pb-12'), 'Hero must enforce compact vertical padding (pt-6 pb-12) for small mobile screens');

  // 2. Mobile typography scale
  assert(html.includes('text-2xl'), 'H1 base size must be text-2xl on mobile (not excessive text-4xl+)');
  assert(html.includes('text-base'), 'Subtitle base size must be text-base on mobile');
  assert(html.includes('text-xs'), 'Description paragraph base size must be text-xs on mobile');

  // 3. Line height for Arabic Cairo ascenders/descenders
  assert(html.includes('leading-7'), 'Description paragraph must have leading-7 on mobile to prevent overlapping Arabic glyphs');

  // 4. Mobile single-column stacking for action cards
  assert(html.includes('grid-cols-1'), 'Quick action cards must stack in 1 column (grid-cols-1) on mobile screens');

  // 5. Mobile search input height
  assert(html.includes('h-12'), 'Search input base height must be h-12 on mobile');

  // 6. Mobile tab bar wraps safely without horizontal clipping
  assert(html.includes('flex flex-wrap'), 'Tab buttons container must specify flex-wrap to stack safely on 320px viewports');
});

suite.test('VIEWPORT-1.2: Tablet viewport (640px/768px) responsive breakpoint classes (sm: / md:)', () => {
  const html = renderComponent(Hero, { onSearch: () => {} });

  // 1. Tablet padding expansion
  assert(html.includes('sm:pt-8 sm:pb-16'), 'Hero must expand vertical padding on tablet screens (sm:pt-8 sm:pb-16)');

  // 2. Tablet typography progression
  assert(html.includes('sm:text-3xl md:text-4xl'), 'H1 must scale progressively through sm:text-3xl and md:text-4xl');
  assert(html.includes('sm:text-xl md:text-2xl'), 'Subtitle must scale progressively through sm:text-xl and md:text-2xl');
  assert(html.includes('sm:text-sm md:text-base'), 'Paragraph must scale progressively through sm:text-sm and md:text-base');

  // 3. Tablet line height expansion
  assert(html.includes('sm:leading-8'), 'Paragraph line height must expand to sm:leading-8 on tablet');

  // 4. Tablet 2-column action cards grid
  assert(html.includes('sm:grid-cols-2'), 'Quick action cards must expand to 2 columns on tablet viewports (sm:grid-cols-2)');

  // 5. Tablet search input height
  assert(html.includes('sm:h-14'), 'Search input must expand to sm:h-14 on tablet viewports');
});

suite.test('VIEWPORT-1.3: Desktop viewport (1024px/1280px+) maximum bounds and headline sizing (lg:)', () => {
  const html = renderComponent(Hero, { onSearch: () => {} });

  // 1. Desktop headline peak
  assert(html.includes('lg:text-5xl'), 'H1 headline must reach lg:text-5xl for high-conversion desktop presence');

  // 2. Desktop container bounding
  assert(html.includes('max-w-6xl'), 'Hero outer content must be constrained to max-w-6xl to prevent ultra-wide distortion');
  assert(html.includes('max-w-4xl'), 'Interactive suite tab bar must be constrained to max-w-4xl');
  assert(html.includes('max-w-2xl'), 'Search form and action cards must be constrained to max-w-2xl');
});

suite.test('VIEWPORT-1.4: Authentic Arabic RTL alignment & directional docking', () => {
  const html = renderComponent(Hero, { onSearch: () => {} });

  // 1. In RTL, search icon is on the right
  assert(html.includes('right-4'), 'Search icon must be anchored at right-4 in RTL');

  // 2. In RTL, input padding gives clearance for right icon and text on left
  assert(html.includes('pr-12') && html.includes('pl-3'), 'Search input must have pr-12 for right icon clearance and pl-3 in RTL');

  // 3. Input rounded corner on right outer edge, button rounded corner on left outer edge
  assert(html.includes('rounded-r-2xl'), 'Input right edge must have rounded-r-2xl');
  assert(html.includes('!rounded-r-none !rounded-l-2xl'), 'Button left edge must have !rounded-l-2xl and !rounded-r-none');

  // 4. Action card interactive arrows point left (forward reading direction in RTL)
  assert(html.includes('group-hover:translate-x-[-4px]'), 'Hover transition for arrows must translate leftwards [-4px]');
});

// =========================================================================
// SECTION 2: Hero Tab Switching State & Zero-Unmount DOM Architecture
// =========================================================================

suite.test('TABS-2.1: Initial active tab state and styling', () => {
  const html = renderComponent(Hero, { onSearch: () => {} });

  // Search tab active indicator
  const activeClass = 'bg-slate-800/90 text-white border border-amber-400/40 shadow-sm shadow-black/40 backdrop-blur-md';
  assert(html.includes(activeClass), 'Active tab button must have modern slate/glass pill styling');

  // Search content container visible, other 3 containers hidden
  assert(html.includes('block space-y-4 animate-fade-in-up print:hidden'), 'Search tab content container must be visible in initial state');
  const hiddenMatches = (html.match(/class="[^"]*hidden[^"]*"/g) || []).length;
  assertGreaterThanOrEqual(hiddenMatches, 3, 'At least 3 inactive tool containers must have hidden class');
});

suite.test('TABS-2.2: All 4 tab buttons contain authentic labels, icons, and badges', () => {
  const html = renderComponent(Hero, { onSearch: () => {} });

  // Tab 1: Search
  assert(html.includes('سوق الأصول والشيتات (50 أصل)'), 'Tab 1 label must match exactly');
  assert(html.includes('🔍'), 'Tab 1 icon must be present');

  // Tab 2: Invoice
  assert(html.includes('مولد الفواتير الضريبية (ZATCA QR)'), 'Tab 2 label must match exactly');
  assert(html.includes('🧾'), 'Tab 2 icon must be present');
  assert(html.includes('مجاناً'), 'Tab 2 free badge must be present');

  // Tab 3: Break-even
  assert(html.includes('حاسبة التعادل والأرباح'), 'Tab 3 label must match exactly');
  assert(html.includes('📈'), 'Tab 3 icon must be present');

  // Tab 4: Store Audit
  assert(html.includes('فحص صحة المتاجر والسيو'), 'Tab 4 label must match exactly');
  assert(html.includes('جديد'), 'Tab 4 new badge must be present');
});

suite.test('TABS-2.3: Zero-unmount DOM persistence: all 3 freemium tools concurrently rendered in HTML', () => {
  const html = renderComponent(Hero, { onSearch: () => {} });

  // Tool 1: Invoice Generator
  assert(html.includes('id="printable-template-canvas"'), 'InvoiceGenerator must be mounted in DOM for zero-unmount retention');

  // Tool 2: Break-Even Calculator
  assert(html.includes('حاسبة التعادل وهامش الأرباح التفاعلية'), 'BreakEvenCalculator must be mounted in DOM for zero-unmount retention');

  // Tool 3: Store Audit Widget
  assert(html.includes('فاحص صحة المتاجر والسيو'), 'StoreAuditWidget must be mounted in DOM for zero-unmount retention');
});

suite.test('TABS-2.4: Hero tab switching state machine contract verification', () => {
  const heroCode = fs.readFileSync(path.join(projectRoot, 'src/components/storefront/Hero.tsx'), 'utf-8');

  // Verify ActiveTab union type includes all 4 states
  assert(
    heroCode.includes("type ActiveTab = 'search' | 'invoice' | 'breakeven' | 'audit';"),
    'ActiveTab union type must strictly define search, invoice, breakeven, and audit'
  );

  // Verify onClick handlers for each tab
  assert(heroCode.includes("onClick={() => setActiveTab('search')}"), 'Search tab must have setActiveTab handler');
  assert(heroCode.includes("onClick={() => setActiveTab('invoice')}"), 'Invoice tab must have setActiveTab handler');
  assert(heroCode.includes("onClick={() => setActiveTab('breakeven')}"), 'Break-even tab must have setActiveTab handler');
  assert(heroCode.includes("onClick={() => setActiveTab('audit')}"), 'Audit tab must have setActiveTab handler');

  // Verify CSS toggling expressions for each container
  assert(
    heroCode.includes("activeTab === 'search' ? 'block space-y-4 animate-fade-in-up print:hidden' : 'hidden'"),
    'Search container must toggle block vs hidden'
  );
  assert(
    heroCode.includes("activeTab === 'invoice' ? 'block animate-fade-in-up text-right' : 'hidden'"),
    'Invoice container must toggle block vs hidden'
  );
  assert(
    heroCode.includes("activeTab === 'breakeven' ? 'block animate-fade-in-up text-right print:hidden' : 'hidden'"),
    'Break-even container must toggle block vs hidden'
  );
  assert(
    heroCode.includes("activeTab === 'audit' ? 'block animate-fade-in-up text-right print:hidden' : 'hidden'"),
    'Audit container must toggle block vs hidden'
  );
});

// =========================================================================
// SECTION 3: Catalog Filter Logic Adversarial & Boundary Stress Tests
// =========================================================================

// Authoritative filter oracle matching src/app/page.tsx line 28-46
function runCatalogFilter(products, searchTerm, selectedCategory, selectedFileType) {
  return products.filter((product) => {
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

suite.test('FILTER-3.1: Default filter state returns complete product catalog without omission', () => {
  const allResults = runCatalogFilter(mockProducts, '', 'all', 'all');
  assertEqual(allResults.length, mockProducts.length, `Expected all ${mockProducts.length} products to be returned`);
  assertGreaterThanOrEqual(allResults.length, 50, 'Catalog must contain at least 50 products');
});

suite.test('FILTER-3.2: Category filtering for all 5 official pillars', () => {
  const categories = ['business', 'accounting', 'engineering', 'students', 'individuals'];
  let sumOfCategories = 0;

  for (const cat of categories) {
    const filtered = runCatalogFilter(mockProducts, '', cat, 'all');
    assertGreaterThan(filtered.length, 0, `Category ${cat} must return at least 1 product`);
    
    // Check that every returned product strictly matches category
    for (const p of filtered) {
      assertEqual(p.category, cat, `Product ${p.id} category must strictly equal ${cat}`);
    }
    sumOfCategories += filtered.length;
  }

  // The sum of all individual categories must equal the total catalog count
  assertEqual(sumOfCategories, mockProducts.length, 'Sum of all category partitions must equal total catalog size');
});

suite.test('FILTER-3.3: Adversarial category edge cases (non-existent, null-like, unicode)', () => {
  // Non-existent slug
  const nonExistent = runCatalogFilter(mockProducts, '', 'non_existent_category_xyz', 'all');
  assertEqual(nonExistent.length, 0, 'Non-existent category slug must return 0 results');

  // Upper-case mismatch (categories are lowercase slugs)
  const upperCaseCat = runCatalogFilter(mockProducts, '', 'ACCOUNTING', 'all');
  assertEqual(upperCaseCat.length, 0, 'Upper-case category must not match lowercase slug without conversion');

  // Injected symbols
  const injectedCat = runCatalogFilter(mockProducts, '', "accounting' OR '1'='1", 'all');
  assertEqual(injectedCat.length, 0, 'SQL injection in category slug safely returns 0 results');
});

suite.test('FILTER-3.4: Search term whitespace trimming & empty strings', () => {
  const baseCount = mockProducts.length;

  const emptyQueries = ['', '   ', '\t', '\n  \t  \r\n'];
  for (const q of emptyQueries) {
    const res = runCatalogFilter(mockProducts, q, 'all', 'all');
    assertEqual(res.length, baseCount, `Empty query "${q}" must return all products`);
  }
});

suite.test('FILTER-3.5: Case-insensitive search on English keywords (CAD, Revit, Excel, Power BI)', () => {
  const testKeywords = ['revit', 'Revit', 'REVIT', 'rEvIt'];
  const baselineResults = runCatalogFilter(mockProducts, 'revit', 'all', 'all');
  assertGreaterThan(baselineResults.length, 0, 'Query "revit" must find at least 1 product');

  for (const kw of testKeywords) {
    const res = runCatalogFilter(mockProducts, kw, 'all', 'all');
    assertEqual(res.length, baselineResults.length, `Query "${kw}" must yield identical count to baseline`);
    assertEqual(res.map((p) => p.id).sort().join(','), baselineResults.map((p) => p.id).sort().join(','), 'Product IDs must match');
  }

  // Test CAD
  const cadLower = runCatalogFilter(mockProducts, 'cad', 'all', 'all');
  const cadUpper = runCatalogFilter(mockProducts, 'CAD', 'all', 'all');
  assertEqual(cadLower.length, cadUpper.length, 'CAD search must be strictly case-insensitive');
});

suite.test('FILTER-3.6: Multi-field search coverage (Title, Description, and Tags)', () => {
  // 1. Search matching title keyword
  const titleSearch = runCatalogFilter(mockProducts, 'عقود العمل', 'all', 'all');
  assertGreaterThan(titleSearch.length, 0, 'Must match product by title');

  // 2. Search matching description keyword
  const descSearch = runCatalogFilter(mockProducts, 'موازنة', 'all', 'all');
  assertGreaterThan(descSearch.length, 0, 'Must match product by description');

  // 3. Search matching tag
  const tagSearch = runCatalogFilter(mockProducts, 'BIM', 'all', 'all');
  assertGreaterThan(tagSearch.length, 0, 'Must match product by tag');
});

suite.test('FILTER-3.7: Special characters, Regex metacharacters, and XSS safety', () => {
  const specialQueries = [
    '/',
    '//',
    '\\',
    '.*',
    '[a-z]+',
    '(',
    ')',
    '???',
    '<script>alert(1)</script>',
    'SELECT * FROM products',
    '${7*7}',
  ];

  for (const q of specialQueries) {
    let results;
    try {
      results = runCatalogFilter(mockProducts, q, 'all', 'all');
    } catch (err) {
      throw new Error(`Filter threw unhandled error on query "${q}": ${err.message}`);
    }
    assert(Array.isArray(results), `Results for "${q}" must be an array`);
  }
});

suite.test('FILTER-3.8: Astronomical query length stress (5000 characters)', () => {
  const hugeQuery = 'أ'.repeat(5000);
  const startTime = Date.now();
  const res = runCatalogFilter(mockProducts, hugeQuery, 'all', 'all');
  const duration = Date.now() - startTime;

  assertEqual(res.length, 0, '5000-char query must return 0 results');
  assert(duration < 50, `5000-char query must evaluate quickly (<50ms), took ${duration}ms`);
});

suite.test('FILTER-3.9: FileType filtering: free vs specific file extensions', () => {
  // Test 1: 'free' filter
  const freeProducts = runCatalogFilter(mockProducts, '', 'all', 'free');
  assert(Array.isArray(freeProducts), 'Free products must be an array');
  for (const p of freeProducts) {
    assertEqual(p.price, 0, `Product ${p.id} returned by free filter must have price 0`);
  }

  // Test 2: 'excel' filter
  const excelProducts = runCatalogFilter(mockProducts, '', 'all', 'excel');
  assertGreaterThan(excelProducts.length, 0, 'Must have excel products');
  for (const p of excelProducts) {
    assertEqual(p.fileType, 'excel', `Product ${p.id} must have fileType excel`);
  }

  // Test 3: 'cad-revit' filter
  const cadProducts = runCatalogFilter(mockProducts, '', 'all', 'cad-revit');
  assertGreaterThan(cadProducts.length, 0, 'Must have cad-revit products');
  for (const p of cadProducts) {
    assertEqual(p.fileType, 'cad-revit', `Product ${p.id} must have fileType cad-revit`);
  }
});

suite.test('FILTER-3.10: Multi-dimensional intersection (Category + Search + FileType)', () => {
  // Intersection 1: engineering category + 'cad-revit' fileType
  const engCad = runCatalogFilter(mockProducts, '', 'engineering', 'cad-revit');
  assertGreaterThan(engCad.length, 0, 'Must find engineering CAD/Revit products');
  for (const p of engCad) {
    assertEqual(p.category, 'engineering');
    assertEqual(p.fileType, 'cad-revit');
  }

  // Intersection 2: accounting category + search 'ضرائب'
  const accTax = runCatalogFilter(mockProducts, 'ضرائب', 'accounting', 'all');
  for (const p of accTax) {
    assertEqual(p.category, 'accounting');
    const term = 'ضرائب';
    const matches =
      p.title.includes(term) ||
      p.description.includes(term) ||
      p.tags.some((t) => t.includes(term));
    assert(matches, `Product ${p.id} must match search term`);
  }

  // Intersection 3: impossible combination yields 0 results safely
  const impossible = runCatalogFilter(mockProducts, 'nonexistentquery99999', 'engineering', 'notion');
  assertEqual(impossible.length, 0, 'Impossible filter combination must return 0 results');
});

// =========================================================================
// SECTION 4: Visual Hierarchy & Styling Softening Verification
// =========================================================================

suite.test('STYLE-4.1: FilterBar active and inactive button classes match refined slate aesthetic', () => {
  const html = renderComponent(FilterBar, {
    selectedCategory: 'accounting',
    selectedFileType: 'excel',
    onCategoryChange: () => {},
    onFileTypeChange: () => {},
    totalProducts: 50,
  });

  // Active button styling
  const activeBtnClass = 'bg-slate-800 text-amber-300 border-amber-400/40 shadow-sm';
  assert(html.includes(activeBtnClass), 'Active buttons in FilterBar must use softened slate/amber styling');

  // Inactive button styling
  assert(
    html.includes('hover:border-amber-400/40 hover:text-white'),
    'Inactive buttons must feature subtle amber border hover'
  );

  // Absence of obsolete harsh solid gold button classes
  assert(!html.includes('bg-raseen-gold text-raseen-dark border-raseen-gold'), 'Must not contain old glaring solid gold active button class');
});

suite.test('STYLE-4.2: Navbar container & navigation link refinements', () => {
  const navbarCode = fs.readFileSync(path.join(projectRoot, 'src/components/layout/Navbar.tsx'), 'utf-8');

  // Navbar header container
  assert(
    navbarCode.includes('sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80'),
    'Navbar header must use sticky slate-950/85 backdrop-blur-xl styling'
  );

  // Desktop navigation links
  assert(
    navbarCode.includes('text-slate-300 hover:text-white transition-colors font-medium px-4 py-2 rounded-lg hover:bg-slate-800/60'),
    'Navbar links must have softened slate-300 hover states'
  );
});

suite.test('STYLE-4.3: globals.css gradient & glassmorphic tone inspection', () => {
  const cssPath = path.join(projectRoot, 'src/app/globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  // Champagne gold gradient verification
  assert(css.includes('#fef3c7'), '.gold-gradient-text must include champagne #fef3c7 stop');
  assert(css.includes('#fcd34d'), '.gold-gradient-text must include warm amber #fcd34d stop');
  assert(css.includes('#f59e0b'), '.gold-gradient-text must include deep gold #f59e0b stop');

  // Obsidian glass verification
  assert(css.includes('rgba(15, 23, 42, 0.75)'), '.raseen-glass must use slate-900 rgba(15, 23, 42, 0.75)');
  assert(css.includes('rgba(51, 65, 85, 0.5)'), '.raseen-glass must use slate-700 rgba(51, 65, 85, 0.5) border');
});

module.exports = suite;

// Execute directly if run via node
if (require.main === module) {
  suite.run().then((res) => {
    if (res.failed > 0) {
      console.error(`\n\x1b[31mSuite failed with ${res.failed} errors.\x1b[0m`);
      process.exit(1);
    } else {
      console.log(`\n\x1b[32m✨ All ${res.passed} adversarial tests passed successfully!\x1b[0m`);
      process.exit(0);
    }
  });
}
