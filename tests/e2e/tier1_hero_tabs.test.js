/**
 * Tier 1: Hero Tab Zero-Unmount Preservation & Interactive Suite Tests
 * Authority: PROJECT.md § Architecture, Feature 2, Feature 3
 * Interface: src/components/storefront/Hero.tsx ↔ src/components/tools/*
 */

const {
  jiti,
  TestSuite,
  assert,
  assertEqual,
  renderComponent,
} = require('./test_utils');

const Hero = jiti('@/components/storefront/Hero.tsx').default;

const suite = new TestSuite('Tier 1: Hero Tab Zero-Unmount Preservation & Layout');

// Test 1: Zero-Unmount Container Architecture
suite.test('HERO-1.1: Concurrent mounting with zero-unmount CSS toggling (block/hidden)', () => {
  const html = renderComponent(Hero, { onSearch: () => {} });

  // Verify that all 3 freemium tool components and search container exist in the HTML output
  assert(html.includes('id="interactive-suite"'), 'Interactive suite tab bar must be present in DOM');
  assert(html.includes('مولد الفواتير'), 'Invoice Generator must be mounted in DOM');
  assert(html.includes('حاسبة التعادل'), 'Break-Even Calculator must be mounted in DOM');
  assert(html.includes('فاحص صحة المتاجر'), 'Store Audit Widget must be mounted in DOM');

  // Verify hidden class pattern is used for background tabs (zero-unmount pattern)
  const hiddenCount = (html.match(/class="[^"]*hidden[^"]*"/g) || []).length;
  assert(hiddenCount >= 3, `Expected at least 3 hidden tab containers in initial state, found ${hiddenCount}`);
});

// Test 2: Initial Active Tab State
suite.test('HERO-1.2: Default active tab is search catalog with active visual indicator', () => {
  const html = renderComponent(Hero, { onSearch: () => {} });

  // Search input should be rendered and visible
  assert(html.includes('aria-label="ابحث عن المنتجات والأصول الرقمية"'), 'Search input must have accessible aria-label');
  assert(html.includes('placeholder="ابحث في أكثر من 1,400 أصل'), 'Search input must have comprehensive placeholder');

  // Active tab styling (amber gradient indicator) on search tab
  assert(html.includes('from-amber-500 to-amber-600 text-slate-950'), 'Active tab must have amber gradient highlighting');
});

// Test 3: Tab Triggers and Freemium Badges
suite.test('HERO-1.3: All 4 tab triggers exist with distinct labels and freemium badges', () => {
  const html = renderComponent(Hero, { onSearch: () => {} });

  assert(html.includes('سوق الأصول والشيتات (50 أصل)'), 'Search tab trigger must exist');
  assert(html.includes('مولد الفواتير الضريبية (ZATCA QR)'), 'Invoice tab trigger must exist');
  assert(html.includes('حاسبة التعادل والأرباح'), 'Break-even tab trigger must exist');
  assert(html.includes('فحص صحة المتاجر والسيو'), 'Audit tab trigger must exist');

  // Freemium tags
  assert(html.includes('مجاناً'), 'Free tool badges must be visible');
  assert(html.includes('جديد'), 'New feature badges must be visible');
});

// Test 4: RTL Alignment & Cairo Font Layout
suite.test('HERO-1.4: Authentic RTL styling and Cairo typography configuration', () => {
  const html = renderComponent(Hero, { onSearch: () => {} });

  assert(html.includes('font-cairo'), 'Hero headline must enforce native Cairo font');
  assert(html.includes('منظومة إدارة وتمكين الأعمال الذكية'), 'Arabic primary headline must be present');
  assert(html.includes('gold-gradient-text'), 'Gold gradient typography styling must be applied');
});

// Test 5: Quick Discovery Tags & Fast Conversion Gateways
suite.test('HERO-1.5: Popular tags and fast-action cards for Vendor & Studio Editor', () => {
  const html = renderComponent(Hero, { onSearch: () => {} });

  // Popular search chips
  assert(html.includes('الأكثر طلباً:'), 'Popular tags label must exist');
  assert(html.includes('شيت تدفقات نقدية 2026'), 'Cash flow sheet tag must exist');
  assert(html.includes('عقود عمل وتأسيس شركات'), 'Legal contracts tag must exist');

  // Vendor Gateway Link with 85% profit incentive
  assert(html.includes('href="/vendor"'), 'Vendor gateway link must be present');
  assert(html.includes('اربح 85%'), '85% seller profit promise must be stated in Hero');

  // Editor Link
  assert(html.includes('href="/editor"'), 'Template editor link must be present');
});

// Test 6: Print Isolation Attributes
suite.test('HERO-1.6: Interactive tools include print:hidden rules for invoice isolation', () => {
  const html = renderComponent(Hero, { onSearch: () => {} });

  assert(html.includes('print:hidden'), 'Hero containers must use print:hidden to prevent leaking into print pages');
});

module.exports = suite;
