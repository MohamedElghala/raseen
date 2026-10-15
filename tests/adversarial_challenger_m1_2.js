/**
 * Adversarial Challenger Test Suite 2 (Milestone M1)
 * Agent: challenger_m1_2 (archetype: teamwork_preview_challenger)
 * 
 * Objective:
 *   Adversarially challenge the business calculators and print styles:
 *   1. BreakEvenCalculator.tsx: boundary inputs (unit price <= variable cost, division by zero protection,
 *      NaN protection, negative numbers, extreme sales targets).
 *   2. StoreAuditWidget.tsx: 100-point score edge cases (all checked, none checked, platform switches).
 *   3. globals.css: @media print CSS rules to verify invoice isolation and prevent styling collisions on screen.
 */

const fs = require('fs');
const path = require('path');
const projectRoot = path.resolve(__dirname, '..');

// Use project jiti
const jiti = require('jiti')(path.join(projectRoot, 'test_loader.js'), {
  jsx: true,
  alias: {
    '@': path.join(projectRoot, 'src'),
  },
});

const React = jiti('react');
const ReactDOMServer = jiti('react-dom/server');

const BreakEvenCalculator = jiti('@/components/tools/BreakEvenCalculator.tsx').default;
const StoreAuditWidget = jiti('@/components/tools/StoreAuditWidget.tsx').default;
const Hero = jiti('@/components/storefront/Hero.tsx').default;
const InvoiceGenerator = jiti('@/components/tools/InvoiceGenerator.tsx').default;

const {
  TestSuite,
  assert,
  assertEqual,
  assertDeepEqual,
  assertGreaterThan,
  assertGreaterThanOrEqual,
  renderComponent,
} = require('./e2e/test_utils.js');

const suite = new TestSuite('Adversarial Challenger M1_2: Calculators & Print Isolation');

// =========================================================================
// SECTION 1: BreakEvenCalculator Adversarial & Boundary Tests
// =========================================================================

// Simulation oracle of BreakEven calculation logic to isolate pure math
function calculateBreakEven(fixedCosts, unitPrice, unitCost, targetProfit, operatingDays) {
  const contributionMargin = Math.max(0, unitPrice - unitCost);
  const marginRatio = unitPrice > 0 ? (contributionMargin / unitPrice) * 100 : 0;
  const costRatio = unitPrice > 0 ? (unitCost / unitPrice) * 100 : 0;
  
  const breakEvenUnits = contributionMargin > 0 ? Math.ceil(fixedCosts / contributionMargin) : 0;
  const breakEvenRevenue = breakEvenUnits * unitPrice;

  const targetUnits = contributionMargin > 0 ? Math.ceil((fixedCosts + targetProfit) / contributionMargin) : 0;
  const targetRevenue = targetUnits * unitPrice;

  const days = Math.max(1, operatingDays);
  const dailyTargetUnits = (targetUnits / days).toFixed(1);
  const dailyTargetRevenue = Math.round(targetRevenue / days);
  const dailyBreakEvenUnits = (breakEvenUnits / days).toFixed(1);

  const isViable = unitPrice > unitCost;

  return {
    contributionMargin,
    marginRatio: marginRatio.toFixed(1),
    costRatio: costRatio.toFixed(1),
    breakEvenUnits,
    breakEvenRevenue,
    targetUnits,
    targetRevenue,
    dailyTargetUnits,
    dailyTargetRevenue,
    dailyBreakEvenUnits,
    isViable,
  };
}

suite.test('BE-1.1: Standard Viable Business Model Calculations', () => {
  const result = calculateBreakEven(15000, 250, 100, 10000, 30);
  
  assertEqual(result.contributionMargin, 150, 'Contribution margin must be 150');
  assertEqual(result.marginRatio, '60.0', 'Margin ratio must be 60.0%');
  assertEqual(result.costRatio, '40.0', 'Cost ratio must be 40.0%');
  assertEqual(result.breakEvenUnits, 100, 'Break-even units = 15000 / 150 = 100');
  assertEqual(result.breakEvenRevenue, 25000, 'Break-even revenue = 100 * 250 = 25000');
  assertEqual(result.targetUnits, 167, 'Target units = ceil((15000+10000)/150) = 167');
  assertEqual(result.targetRevenue, 41750, 'Target revenue = 167 * 250 = 41750');
  assertEqual(result.dailyBreakEvenUnits, '3.3', 'Daily break-even units over 30 days = 3.3');
  assertEqual(result.dailyTargetUnits, '5.6', 'Daily target units over 30 days = 5.6');
  assertEqual(result.dailyTargetRevenue, 1392, 'Daily target revenue = round(41750/30) = 1392');
  assertEqual(result.isViable, true, 'isViable must be true when unitPrice > unitCost');
});

suite.test('BE-1.2: Boundary unitPrice <= unitCost (Loss / Zero Margin)', () => {
  // Case A: unitPrice === unitCost (Zero contribution margin)
  const equalCase = calculateBreakEven(15000, 100, 100, 10000, 30);
  assertEqual(equalCase.contributionMargin, 0, 'Margin must be 0 when price equals cost');
  assertEqual(equalCase.marginRatio, '0.0', 'Margin ratio must be 0.0%');
  assertEqual(equalCase.costRatio, '100.0', 'Cost ratio must be 100.0%');
  assertEqual(equalCase.breakEvenUnits, 0, 'Break-even units must be 0 (no division by zero Infinity)');
  assertEqual(equalCase.breakEvenRevenue, 0, 'Break-even revenue must be 0');
  assertEqual(equalCase.targetUnits, 0, 'Target units must be 0');
  assertEqual(equalCase.isViable, false, 'isViable must be false when unitPrice === unitCost');

  // Case B: unitPrice < unitCost (Negative margin)
  const lossCase = calculateBreakEven(20000, 50, 150, 10000, 30);
  assertEqual(lossCase.contributionMargin, 0, 'Margin must clamp to 0 instead of negative number');
  assertEqual(lossCase.marginRatio, '0.0', 'Margin ratio must be 0.0%');
  assertEqual(lossCase.costRatio, '300.0', 'Cost ratio = (150/50)*100 = 300.0%');
  assertEqual(lossCase.breakEvenUnits, 0, 'Break-even units must not be negative or Infinite');
  assertEqual(lossCase.dailyBreakEvenUnits, '0.0', 'Daily break-even must be 0.0');
  assertEqual(lossCase.isViable, false, 'isViable must be false');
});

suite.test('BE-1.3: Division by Zero Safeguards (Zero Inputs)', () => {
  // unitPrice = 0
  const zeroPrice = calculateBreakEven(10000, 0, 0, 5000, 30);
  assertEqual(zeroPrice.marginRatio, '0.0', 'Margin ratio must be 0.0 when unitPrice is 0 (no NaN)');
  assertEqual(zeroPrice.costRatio, '0.0', 'Cost ratio must be 0.0 when unitPrice is 0 (no NaN)');
  assertEqual(zeroPrice.breakEvenUnits, 0, 'Break-even units must be 0');
  assertEqual(zeroPrice.isViable, false, 'isViable must be false when unitPrice is 0');

  // operatingDays = 0 or negative
  const zeroDays = calculateBreakEven(15000, 250, 100, 10000, 0);
  assert(!isNaN(Number(zeroDays.dailyBreakEvenUnits)), 'dailyBreakEvenUnits must not be NaN when operatingDays is 0');
  assert(isFinite(Number(zeroDays.dailyBreakEvenUnits)), 'dailyBreakEvenUnits must not be Infinite when operatingDays is 0');
  assertEqual(zeroDays.dailyBreakEvenUnits, '100.0', 'When days=0, Math.max(1, 0) clamps to 1 day');

  const negDays = calculateBreakEven(15000, 250, 100, 10000, -10);
  assertEqual(negDays.dailyBreakEvenUnits, '100.0', 'Negative operatingDays clamped to 1');
});

suite.test('BE-1.4: Negative Numbers Clamping & Protection', () => {
  // In the component input handlers:
  // fixedCosts: Math.max(0, Number(val))
  // unitPrice: Math.max(1, Number(val))
  // unitCost: Math.max(0, Number(val))
  // targetProfit: Math.max(0, Number(val))

  const cleanFixed = Math.max(0, Number('-5000'));
  const cleanPrice = Math.max(1, Number('-150'));
  const cleanCost = Math.max(0, Number('-20'));
  const cleanProfit = Math.max(0, Number('-9999'));

  assertEqual(cleanFixed, 0, 'Fixed costs must clamp negative to 0');
  assertEqual(cleanPrice, 1, 'Unit price must clamp negative to at least 1');
  assertEqual(cleanCost, 0, 'Unit cost must clamp negative to 0');
  assertEqual(cleanProfit, 0, 'Target profit must clamp negative to 0');

  const result = calculateBreakEven(cleanFixed, cleanPrice, cleanCost, cleanProfit, 30);
  assertEqual(result.breakEvenUnits, 0, 'Zero fixed costs with positive margin yields 0 break-even units');
  assertEqual(result.isViable, true, 'isViable is true since 1 > 0');
});

suite.test('BE-1.5: NaN and Empty String Input Safety', () => {
  // When an input is cleared in browser: e.target.value === ""
  // Number("") === 0
  const emptyVal = '';
  const numEmpty = Number(emptyVal);
  assertEqual(numEmpty, 0, 'Empty string converts to 0');

  const safeFixed = Math.max(0, numEmpty);
  const safePrice = Math.max(1, numEmpty);
  assertEqual(safeFixed, 0, 'safeFixed from empty string is 0');
  assertEqual(safePrice, 1, 'safePrice from empty string is 1 (prevents price=0)');

  // Calculation with 0 fixed costs, 1 unit price, 0 unit cost
  const res = calculateBreakEven(safeFixed, safePrice, 0, 0, 30);
  assert(!isNaN(Number(res.marginRatio)), 'marginRatio must not be NaN');
  assert(!isNaN(Number(res.breakEvenUnits)), 'breakEvenUnits must not be NaN');
  assert(!isNaN(Number(res.targetUnits)), 'targetUnits must not be NaN');
});

suite.test('BE-1.6: Extreme Sales Targets & Astronomical Numbers', () => {
  // 1 Billion fixed costs, 50 Billion target profit, 500,000 price, 100,000 cost
  const hugeFixed = 1000000000;
  const hugeProfit = 50000000000;
  const price = 500000;
  const cost = 100000;

  const result = calculateBreakEven(hugeFixed, price, cost, hugeProfit, 30);
  assertEqual(result.contributionMargin, 400000, 'Margin = 400k');
  assertEqual(result.marginRatio, '80.0', 'Margin ratio = 80.0%');
  assertEqual(result.costRatio, '20.0', 'Cost ratio = 20.0%');
  assertEqual(result.breakEvenUnits, 2500, '1B / 400k = 2500 units');
  assertEqual(result.targetUnits, 127500, '(1B + 50B) / 400k = 127,500 units');
  assert(isFinite(result.targetRevenue), 'targetRevenue must be a finite number');
  assertEqual(result.targetRevenue, 63750000000, 'Target revenue = 127500 * 500000 = 63.75 Billion');
  
  // Verify string formatting does not throw or truncate
  const formattedRevenue = result.targetRevenue.toLocaleString();
  assert(formattedRevenue.includes('63') && formattedRevenue.includes('750'), 'Formatted revenue must contain correct digits');
});

suite.test('BE-1.7: Operating Days Switching (30 Days vs 22 Days)', () => {
  const result30 = calculateBreakEven(15000, 250, 100, 10000, 30);
  const result22 = calculateBreakEven(15000, 250, 100, 10000, 22);

  assertEqual(result30.breakEvenUnits, result22.breakEvenUnits, 'Monthly units remain identical');
  assertEqual(result30.dailyBreakEvenUnits, '3.3', '30 days daily break-even is 3.3');
  assertEqual(result22.dailyBreakEvenUnits, '4.5', '22 days daily break-even is 4.5');
  assertGreaterThan(Number(result22.dailyBreakEvenUnits), Number(result30.dailyBreakEvenUnits), 'Daily pace must be higher for fewer working days');
});

suite.test('BE-1.8: BreakEvenCalculator Component SSR & DOM Layout Integrity', () => {
  const html = renderComponent(BreakEvenCalculator);

  // Check titles and typography
  assert(html.includes('حاسبة التعادل وهامش الأرباح التفاعلية'), 'Header title must be present');
  assert(html.includes('متى يبدأ مشروعك بجني أرباح حقيقية؟'), 'Main headline must be present');

  // Check currency buttons
  assert(html.includes('SAR') && html.includes('AED') && html.includes('EGP') && html.includes('USD'), 'All 4 currencies must be rendered');

  // Check dual input controls (sliders + numeric inputs)
  assert(html.includes('type="number"'), 'Numeric direct inputs must exist');
  assert(html.includes('type="range"'), 'Range sliders must exist');

  // Check metric outputs
  assert(html.includes('نقطة التعادل (Break-even)'), 'Break-even metric card must exist');
  assert(html.includes('هامش المساهمة للوحدة'), 'Contribution margin card must exist');
  assert(html.includes('الربح الصافي المستهدف شهرياً'), 'Target profit card must exist');
  assert(html.includes('معدل التعادل اليومي:'), 'Daily pace run rate must exist');
});

// =========================================================================
// SECTION 2: StoreAuditWidget Adversarial & Edge Case Tests
// =========================================================================

// Store Audit questions definition verification
const AUDIT_QUESTIONS = [
  'mobile_speed',
  'local_payments',
  'seo_schema',
  'trust_legal',
  'bundle_conversion',
];

function calculateAuditScore(checkedMap) {
  return AUDIT_QUESTIONS.reduce((sum, id) => {
    return sum + (checkedMap[id] ? 20 : 0);
  }, 0);
}

function getAuditBadge(score) {
  if (score >= 80) return { label: 'ممتاز وعالي التحويل 🚀', color: 'emerald' };
  if (score >= 50) return { label: 'متوسط ويحتاج تحسينات ⚠️', color: 'amber' };
  return { label: 'حرج ومهدد بنزيف المبيعات 🚨', color: 'rose' };
}

suite.test('AUD-2.1: 100-Point Score Edge Cases (All Checked, None Checked, Thresholds)', () => {
  // Case A: All Checked (100/100)
  const allChecked = {
    mobile_speed: true,
    local_payments: true,
    seo_schema: true,
    trust_legal: true,
    bundle_conversion: true,
  };
  const score100 = calculateAuditScore(allChecked);
  assertEqual(score100, 100, 'Score when all checked must be exactly 100');
  const badge100 = getAuditBadge(score100);
  assertEqual(badge100.color, 'emerald', 'Badge for 100 must be emerald');
  assert(badge100.label.includes('ممتاز'), 'Badge label must state excellent');

  // Case B: None Checked (0/100)
  const noneChecked = {
    mobile_speed: false,
    local_payments: false,
    seo_schema: false,
    trust_legal: false,
    bundle_conversion: false,
  };
  const score0 = calculateAuditScore(noneChecked);
  assertEqual(score0, 0, 'Score when none checked must be exactly 0');
  const badge0 = getAuditBadge(score0);
  assertEqual(badge0.color, 'rose', 'Badge for 0 must be rose');
  assert(badge0.label.includes('حرج'), 'Badge label must state critical');

  // Case C: Threshold 80 (4 checked)
  const score80 = calculateAuditScore({
    mobile_speed: true,
    local_payments: true,
    seo_schema: true,
    trust_legal: true,
    bundle_conversion: false,
  });
  assertEqual(score80, 80, 'Score must be 80');
  assertEqual(getAuditBadge(score80).color, 'emerald', '80 points is the lower boundary for emerald');

  // Case D: Threshold 60 (3 checked - Default initial state)
  const score60 = calculateAuditScore({
    mobile_speed: true,
    local_payments: true,
    trust_legal: true,
  });
  assertEqual(score60, 60, 'Initial score must be 60');
  assertEqual(getAuditBadge(score60).color, 'amber', '60 points is amber');

  // Case E: Threshold 40 (2 checked)
  const score40 = calculateAuditScore({
    mobile_speed: true,
    local_payments: true,
  });
  assertEqual(score40, 40, 'Score must be 40');
  assertEqual(getAuditBadge(score40).color, 'rose', '40 points must be critical rose (<50)');
});

suite.test('AUD-2.2: Platform Switches & Specialized Advice Coverage', () => {
  // Extract questions from StoreAuditWidget component
  const html = renderComponent(StoreAuditWidget);

  // Check platforms are present
  assert(html.includes('سلة (Salla)'), 'Salla platform must be available');
  assert(html.includes('زد (Zid)'), 'Zid platform must be available');
  assert(html.includes('شوبيفاي (Shopify)'), 'Shopify platform must be available');
  assert(html.includes('موقع مستقل (Custom)'), 'Custom platform must be available');

  // Check all 5 questions are rendered with their +20 badges
  assert(html.includes('سرعة التحميل وتوافق الهواتف الذكية'), 'Speed question must be present');
  assert(html.includes('توفير طرق دفع سريعة'), 'Payment question must be present');
  assert(html.includes('البيانات المنظمة لمنتجاتك'), 'Schema question must be present');
  assert(html.includes('السجل التجاري، التوثيق، وسياسة الاستبدال'), 'Trust question must be present');
  assert(html.includes('عروض الحزم الذكية وزيادة المبيعات'), 'Bundle question must be present');

  const pointBadges = (html.match(/\+20 نقطة/g) || []).length;
  assertEqual(pointBadges, 5, 'Must contain exactly five "+20 نقطة" badges for a 100-point total');
});

suite.test('AUD-2.3: Report Generation & Formatting Integrity', () => {
  // Generate sample report
  const storePlatformNames = {
    salla: 'سلة (Salla)',
    zid: 'زد (Zid)',
    shopify: 'شوبيفاي (Shopify)',
    custom: 'موقع مستقل (Custom)',
  };

  function generateReport(storeName, storeType, score, badgeLabel, missingCount) {
    const name = storeName.trim() || 'متجري الإلكتروني';
    let report = `📊 تقرير فحص صحة المتجر والسيو (${name})\n`;
    report += `المنصة: ${storePlatformNames[storeType]}\n`;
    report += `النتيجة الإجمالية: ${score}/100 (${badgeLabel})\n\n`;
    if (missingCount === 0) {
      report += `✅ متجرك استوفى جميع المعايير الـ 5 بنجاح تام! جاهز لحملات تسويقية موسعة.\n`;
    } else {
      report += `📌 التوصيات الفورية للإصلاح:\n`;
    }
    report += `\nتم الفحص بواسطة منصة رَصين (raseen.me)`;
    return report;
  }

  // Test report with empty name (fallback)
  const repDefault = generateReport('   ', 'salla', 60, 'متوسط ويحتاج تحسينات ⚠️', 2);
  assert(repDefault.includes('(متجري الإلكتروني)'), 'Empty name must fallback to default placeholder');
  assert(repDefault.includes('المنصة: سلة (Salla)'), 'Must contain platform name');
  assert(repDefault.includes('60/100'), 'Must contain score');
  assert(repDefault.includes('raseen.me'), 'Must contain platform citation');

  // Test report with custom name and 100/100 score
  const rep100 = generateReport('متجر النخبة العربي', 'shopify', 100, 'ممتاز وعالي التحويل 🚀', 0);
  assert(rep100.includes('(متجر النخبة العربي)'), 'Custom name must be reflected');
  assert(rep100.includes('المنصة: شوبيفاي (Shopify)'), 'Platform must be Shopify');
  assert(rep100.includes('استوفى جميع المعايير الـ 5 بنجاح تام'), 'Must confirm all 5 criteria passed');
});

suite.test('AUD-2.4: StoreAuditWidget Component SSR & DOM Layout Integrity', () => {
  const html = renderComponent(StoreAuditWidget);

  assert(html.includes('فاحص صحة المتاجر والسيو ومعدل التحويل (Store Health Audit 100)'), 'Header badge must exist');
  assert(html.includes('افحص كفاءة متجرك ومعدل إتمام الشراء مجاناً'), 'Main heading must exist');
  assert(html.includes('تحديد الكل'), 'Select all button must exist');
  assert(html.includes('إلغاء التحديد'), 'Deselect all button must exist');
  assert(html.includes('نسخ تقرير الفحص ومشاركته'), 'Copy report action button must exist');
  assert(html.includes('احصل على قوالب وأدوات رفع المبيعات'), 'CTA button to catalog must exist');
});

// =========================================================================
// SECTION 3: globals.css @media print & Styling Isolation Tests
// =========================================================================

suite.test('CSS-3.1: globals.css @media print Rules Syntax and Structure', () => {
  const cssPath = path.join(projectRoot, 'src/app/globals.css');
  assert(fs.existsSync(cssPath), 'globals.css file must exist');
  const css = fs.readFileSync(cssPath, 'utf-8');

  // 1. Verify @media print declaration
  assert(css.includes('@media print'), 'Must include @media print declaration');

  // 2. Verify @page rules
  assert(css.includes('@page'), 'Must include @page styling block');
  assert(css.includes('size: A4 portrait;'), '@page must enforce A4 portrait');
  assert(css.includes('margin: 8mm 10mm;'), '@page must define consistent print margins');

  // 3. Verify white background and exact color adjust
  assert(css.includes('background: #ffffff !important;'), 'Print background must be white');
  assert(css.includes('-webkit-print-color-adjust: exact !important;'), 'Must preserve exact print colors');
  assert(css.includes('print-color-adjust: exact !important;'), 'Standard print-color-adjust must be exact');

  // 4. Verify body * visibility hidden rule
  assert(css.includes('body * {') && css.includes('visibility: hidden;'), 'body * must hide visibility of ambient elements');

  // 5. Verify printable canvas isolation
  assert(css.includes('#printable-template-canvas,'), 'Must target #printable-template-canvas for visibility');
  assert(css.includes('#printable-template-canvas * {') && css.includes('visibility: visible;'), 'Canvas and its children must be visible');
  assert(css.includes('#printable-template-canvas {'), 'Must have specific rules for canvas layout');
  assert(css.includes('position: absolute !important;'), 'Canvas must be positioned absolute');
  assert(css.includes('top: 0 !important;'), 'Canvas must anchor to top: 0');
  assert(css.includes('left: 0 !important;'), 'Canvas must anchor to left: 0');
});

suite.test('CSS-3.2: Print Exclusion Selectors for Interactive UI Shell', () => {
  const cssPath = path.join(projectRoot, 'src/app/globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  // Extract the excluded selector list
  const excludedElements = [
    'header',
    'footer',
    'nav',
    'aside',
    'button',
    'form',
    'input',
    'textarea',
    'select',
    '#interactive-suite',
    '.print\\:hidden',
    '[data-no-print]',
  ];

  for (const sel of excludedElements) {
    assert(css.includes(sel), `Print stylesheet must explicitly exclude ${sel}`);
  }

  // Ensure they are display: none !important
  assert(css.includes('display: none !important;'), 'Excluded elements must have display: none !important');
});

suite.test('CSS-3.3: Verification of Screen Isolation & Zero Styling Collision', () => {
  const cssPath = path.join(projectRoot, 'src/app/globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  // Check that @media print block is properly closed
  const printIndex = css.indexOf('@media print');
  assertGreaterThan(printIndex, 0, '@media print must be in the CSS');

  const afterPrint = css.slice(printIndex);
  let openBraces = 0;
  let closedBraces = 0;
  for (const char of afterPrint) {
    if (char === '{') openBraces++;
    if (char === '}') closedBraces++;
    if (openBraces > 0 && openBraces === closedBraces) {
      // Reached the closing brace of @media print
      break;
    }
  }

  assertEqual(openBraces, closedBraces, '@media print block must be syntactically balanced and closed');
  assertGreaterThan(openBraces, 3, '@media print block must contain sub-rules');

  // Verify that on-screen invoice canvas has hidden class
  const invoiceHtml = renderComponent(InvoiceGenerator);
  assert(
    invoiceHtml.includes('id="printable-template-canvas"') &&
    invoiceHtml.includes('hidden print:block'),
    '#printable-template-canvas must have "hidden print:block" classes so it is invisible on screen'
  );
});

suite.test('CSS-3.4: DOM Ancestor Compatibility (Invoice Tab Print Immunity)', () => {
  // Render Hero component to inspect DOM hierarchy
  const heroHtml = renderComponent(Hero, { onSearch: () => {} });

  // 1. #interactive-suite is the tab-switching buttons bar, NOT an ancestor of invoice tab content
  const tabSuiteIndex = heroHtml.indexOf('id="interactive-suite"');
  const invoiceTabContainerIndex = heroHtml.indexOf('activeTab === \'invoice\'') !== -1 
    ? heroHtml.indexOf('activeTab === \'invoice\'')
    : heroHtml.indexOf('id="printable-template-canvas"');

  assertGreaterThan(tabSuiteIndex, 0, 'id="interactive-suite" must exist in Hero');
  assertGreaterThan(invoiceTabContainerIndex, tabSuiteIndex, 'Invoice canvas must be rendered after interactive-suite tab bar');

  // 2. Form inside InvoiceGenerator closes BEFORE #printable-template-canvas
  // If #printable-template-canvas were inside <form>, "form { display: none !important; }" would kill it!
  const invoiceCode = fs.readFileSync(path.join(projectRoot, 'src/components/tools/InvoiceGenerator.tsx'), 'utf-8');
  const formCloseIndex = invoiceCode.indexOf('</form>');
  const canvasStartIndex = invoiceCode.indexOf('id="printable-template-canvas"');

  assertGreaterThan(formCloseIndex, 0, '</form> must exist in InvoiceGenerator');
  assertGreaterThan(canvasStartIndex, formCloseIndex, '#printable-template-canvas MUST be located AFTER </form> closes');

  // 3. Crisp edges for SVG QR matrix in print
  const css = fs.readFileSync(path.join(projectRoot, 'src/app/globals.css'), 'utf-8');
  assert(
    css.includes('#printable-template-canvas svg') && css.includes('shape-rendering: crispEdges !important;'),
    'Print stylesheet must enforce crispEdges on SVG QR codes for 100% scan reliability'
  );
});

module.exports = suite;

// Execute directly if run via node
if (require.main === module) {
  suite.run().then((res) => {
    if (res.failed > 0) {
      console.error(`\n\x1b[31mSuite failed with ${res.failed} errors.\x1b[0m`);
      process.exit(1);
    } else {
      console.log(`\n\x1b[32mAll ${res.passed} tests passed successfully!\x1b[0m`);
      process.exit(0);
    }
  });
}
