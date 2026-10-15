/**
 * Adversarial Challenger Test Suite (Milestone M1)
 * Agent: challenger_m1_1 (archetype: teamwork_preview_challenger)
 * Targets:
 *   - src/lib/zatca.ts (TLV encoding, QR matrix generator, dynamic SVG)
 *   - src/components/tools/InvoiceGenerator.tsx (Math, QR integration, Print template)
 *   - src/components/storefront/Hero.tsx (Zero-unmount DOM preservation, tab switching)
 */

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

const zatca = jiti('@/lib/zatca.ts');
const Hero = jiti('@/components/storefront/Hero.tsx').default;
const InvoiceGenerator = jiti('@/components/tools/InvoiceGenerator.tsx').default;

const {
  TestSuite,
  assert,
  assertEqual,
  assertDeepEqual,
  assertGreaterThan,
  decodeZatcaTLV,
  validateQRMatrix,
  renderComponent,
} = require('./e2e/test_utils.js');

const suite = new TestSuite('Tier 5 (Adversarial Challenger): ZATCA TLV, QR Matrix, & Hero DOM');

// =========================================================================
// SECTION 1: Adversarial ZATCA TLV Encoding & Multi-byte Stress Tests
// =========================================================================

suite.test('ADV-1.1: Complex Arabic multi-byte, Tashkeel, Hamzas, and Tatweel/Kashida', () => {
  // Arabic string with every Arabic diacritic (Fatha, Damma, Kasra, Shadda, Sukun, Tanween)
  const extremeArabic = 'شَرِكَةُ رَصِيــــنٍ لِلْحُلُولِ الإِلِكْتُرُونِيَّةِ وَالأَتْمَتَةِ الذَّكِيَّةِ ش.م.م';
  const expectedBytes = Buffer.from(extremeArabic, 'utf-8').length;
  // Verify character length vs byte length (Tashkeel characters each add bytes)
  assertGreaterThan(expectedBytes, extremeArabic.length, 'UTF-8 byte length must exceed string character length');

  const b64 = zatca.generateZatcaTLV(
    extremeArabic,
    '31024589200003',
    '2026-10-15T12:00:00Z',
    '1500.00',
    '225.00'
  );

  const tags = decodeZatcaTLV(b64);
  assertEqual(tags[1].length, expectedBytes, `Tag 1 byte length must equal ${expectedBytes}`);
  assertEqual(tags[1].value, extremeArabic, 'Decoded Arabic with diacritics must match verbatim');
});

suite.test('ADV-1.2: Mixed Bidirectional (Bidi), Emojis, and Punctuation in Seller Name', () => {
  const bidiText = '🏢 شركة Raseen Tech & Co.™ (100% مضمونة) — #1 في السعودية 🇸🇦';
  const expectedBytes = Buffer.from(bidiText, 'utf-8').length;

  const b64 = zatca.generateZatcaTLV(
    bidiText,
    '31024589200003',
    '2026-10-15T12:00:00Z',
    '250.00',
    '37.50'
  );

  const tags = decodeZatcaTLV(b64);
  assertEqual(tags[1].length, expectedBytes, 'Tag 1 length must match 4-byte emoji and mixed UTF-8 bytes');
  assertEqual(tags[1].value, bidiText, 'Decoded mixed Bidi and emoji string must match original');
});

suite.test('ADV-1.3: HTML/XML, Script tags, and SQL injection strings in TLV parameters', () => {
  const attackStrings = [
    '<script>alert("xss")</script>',
    '" OR ""="',
    '<![CDATA[<markup>&amp;</markup>]]>',
    '\\0\\r\\n\\t',
    'seller"with\'quotes`and<brackets>',
  ];

  for (const attack of attackStrings) {
    const b64 = zatca.generateZatcaTLV(
      attack,
      '31024589200003',
      '2026-10-15T12:00:00Z',
      '100.00',
      '15.00'
    );
    const tags = decodeZatcaTLV(b64);
    assertEqual(tags[1].value, attack, `Tag 1 must preserve exact injection string: ${attack}`);
  }
});

suite.test('ADV-1.4: Extreme Numerical Quantities (Zero VAT, Micro-amounts, Trillions)', () => {
  const scenarios = [
    { total: '0.00', vat: '0.00' },          // Zero total, zero VAT (tax exempt / free sample)
    { total: '1000.00', vat: '0.00' },        // 0% VAT export invoice
    { total: '0.01', vat: '0.00' },           // 1 cent transaction
    { total: '999999999999.99', vat: '149999999999.99' }, // Massive corporate invoice
    { total: '1234567.89', vat: '185185.18' },// Irregular decimal fractions
  ];

  for (const s of scenarios) {
    const b64 = zatca.generateZatcaTLV(
      'شركة رَصين',
      '31024589200003',
      '2026-10-15T12:00:00Z',
      s.total,
      s.vat
    );
    const tags = decodeZatcaTLV(b64);
    assertEqual(tags[4].value, s.total, `Tag 4 must preserve total ${s.total}`);
    assertEqual(tags[5].value, s.vat, `Tag 5 must preserve VAT ${s.vat}`);
  }
});

suite.test('ADV-1.5: Object Signature vs 5-arg Positional Signature Strict Equivalence', () => {
  const testCases = [
    {
      sellerName: 'مؤسسة الحلول المتقدمة',
      vatNumber: '300000000000003',
      timestamp: '2026-10-15T09:15:30Z',
      totalAmount: '8500.50',
      vatAmount: '1275.08',
    },
    {
      sellerName: 'مكتب هندسي',
      vatNumber: '311122233344403',
      timestamp: '2026-10-15T23:59:59Z',
      totalAmount: '0.00',
      vatAmount: '0.00',
    },
  ];

  for (const tc of testCases) {
    const b64Obj = zatca.generateZatcaTLV(tc);
    const b64Pos = zatca.generateZatcaTLV(
      tc.sellerName,
      tc.vatNumber,
      tc.timestamp,
      tc.totalAmount,
      tc.vatAmount
    );
    assertEqual(b64Obj, b64Pos, 'Object signature and positional signature must produce bit-for-bit identical Base64');
  }
});

suite.test('ADV-1.6: Falsy and Edge Type Inputs Fallback Verification', () => {
  // Pass empty strings or nullish values to ensure defaults activate without exception
  const b64Empty = zatca.generateZatcaTLV('', '', '', '', '');
  const tagsEmpty = decodeZatcaTLV(b64Empty);
  assertEqual(tagsEmpty[1].value, 'شركة رَصين للحلول الرقمية');
  assertEqual(tagsEmpty[2].value, '31024589200003');
  assertEqual(tagsEmpty[4].value, '0.00');
  assertEqual(tagsEmpty[5].value, '0.00');

  // Passing object with missing fields
  const b64Partial = zatca.generateZatcaTLV({ sellerName: 'متجر تجريبي' });
  const tagsPartial = decodeZatcaTLV(b64Partial);
  assertEqual(tagsPartial[1].value, 'متجر تجريبي');
  assertEqual(tagsPartial[2].value, '31024589200003');
  assertEqual(tagsPartial[4].value, '0.00');
  assertEqual(tagsPartial[5].value, '0.00');
});

suite.test('ADV-1.7: Length byte boundary stress (1 byte to 200 bytes)', () => {
  // Test lengths from 1 to 200 bytes to ensure 1-byte length field in TLV is strictly accurate
  // 1-byte ASCII
  const singleByte = 'A';
  const b64Single = zatca.generateZatcaTLV(singleByte, '31024589200003', '2026-10-15T12:00:00Z', '10.00', '1.50');
  const tagsSingle = decodeZatcaTLV(b64Single);
  assertEqual(tagsSingle[1].length, 1, '1-byte ASCII string must have length 1');
  assertEqual(tagsSingle[1].value, 'A');

  // Multi-byte Arabic strings of varying lengths
  for (const charCount of [1, 5, 25, 50, 75, 100]) {
    const text = 'ر'.repeat(charCount); // Each 'ر' is 2 bytes
    const actualBytes = Buffer.from(text, 'utf-8').length;
    const b64 = zatca.generateZatcaTLV(text, '31024589200003', '2026-10-15T12:00:00Z', '10.00', '1.50');
    const tags = decodeZatcaTLV(b64);
    assertEqual(tags[1].length, actualBytes, `Length byte must match ${actualBytes}`);
    assertEqual(tags[1].value, text, 'Value must match input string exactly');
  }
});

// =========================================================================
// SECTION 2: QR Code Matrix Geometry, Finders, Timing & SVG Stress Tests
// =========================================================================

suite.test('ADV-2.1: Finder Pattern Invariant Checks (3 Corners Dark/Light Modules + Separators)', () => {
  const b64 = zatca.generateZatcaTLV(
    'شركة رَصين',
    '31024589200003',
    '2026-10-15T12:00:00Z',
    '1150.00',
    '150.00'
  );

  const matrix = zatca.renderQRCodeMatrix(b64);
  const size = matrix.length;

  const finders = [
    { topR: 0, leftC: 0, name: 'Top-Left' },
    { topR: 0, leftC: size - 7, name: 'Top-Right' },
    { topR: size - 7, leftC: 0, name: 'Bottom-Left' },
  ];

  for (const f of finders) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        const expected = isOuter || isCenter;
        const actual = matrix[f.topR + r][f.leftC + c];
        assertEqual(
          actual,
          expected,
          `Finder ${f.name} module at relative (${r},${c}) must be ${expected ? 'black' : 'white'}`
        );
      }
    }

    // Check separator modules around finder pattern
    // For Top-Left finder: row 7, col 0..7 and col 7, row 0..7 must be white
    if (f.topR === 0 && f.leftC === 0) {
      for (let c = 0; c <= 7; c++) {
        assertEqual(matrix[7][c], false, `Top-Left horizontal separator at (7, ${c}) must be white`);
      }
      for (let r = 0; r <= 7; r++) {
        assertEqual(matrix[r][7], false, `Top-Left vertical separator at (${r}, 7) must be white`);
      }
    }
  }

  // Ensure bottom-right corner does NOT contain a finder pattern
  let brDarkCount = 0;
  for (let r = size - 7; r < size; r++) {
    for (let c = size - 7; c < size; c++) {
      if (matrix[r][c]) brDarkCount++;
    }
  }
  // A 7x7 finder pattern has 33 dark modules out of 49. Bottom-right is data modules and should not equal 33 in finder layout
  assert(
    brDarkCount !== 33 || matrix[size - 7][size - 7] !== true || matrix[size - 1][size - 1] !== true || matrix[size - 4][size - 4] !== true,
    'Bottom-Right corner must be data space, not an unauthorized finder pattern'
  );
});

suite.test('ADV-2.2: Timing Patterns & Dark Module Compliance', () => {
  const b64 = zatca.generateZatcaTLV(
    'شركة رَصين للحلول الرقمية',
    '31024589200003',
    '2026-10-15T12:00:00Z',
    '5000.00',
    '750.00'
  );

  const matrix = zatca.renderQRCodeMatrix(b64);
  const size = matrix.length;
  const version = (size - 17) / 4;

  // Horizontal timing on row 6 between column 8 and size-8
  for (let c = 8; c < size - 8; c++) {
    const expected = c % 2 === 0;
    assertEqual(matrix[6][c], expected, `Horizontal timing at (6, ${c}) must alternate (expected ${expected})`);
  }

  // Vertical timing on column 6 between row 8 and size-8
  for (let r = 8; r < size - 8; r++) {
    const expected = r % 2 === 0;
    assertEqual(matrix[r][6], expected, `Vertical timing at (${r}, 6) must alternate (expected ${expected})`);
  }

  // Mandatory dark module at (4*V + 9, 8)
  const darkModuleRow = 4 * version + 9;
  assertEqual(matrix[darkModuleRow][8], true, `Dark module at (${darkModuleRow}, 8) must be black/true`);
});

suite.test('ADV-2.3: Dynamic SVG Generation Correctness and Scalability', () => {
  const b64 = zatca.generateZatcaTLV(
    'شركة رَصين',
    '31024589200003',
    '2026-10-15T12:00:00Z',
    '230.00',
    '30.00'
  );

  const matrix = zatca.renderQRCodeMatrix(b64);
  const darkCount = matrix.flat().filter(Boolean).length;

  for (const targetSize of [120, 160, 240, 300]) {
    const svg = zatca.generateZatcaQRSvg(b64, targetSize);
    assert(svg.startsWith('<svg'), 'SVG must start with <svg tag');
    assert(svg.endsWith('</svg>'), 'SVG must properly terminate with </svg>');
    assert(svg.includes(`viewBox="0 0 ${targetSize} ${targetSize}"`), `SVG must contain viewBox for ${targetSize}`);
    assert(svg.includes(`width="${targetSize}"`), `SVG must contain width="${targetSize}"`);
    assert(svg.includes(`height="${targetSize}"`), `SVG must contain height="${targetSize}"`);

    // Count rects
    const rectCount = (svg.match(/<rect/g) || []).length;
    assertEqual(rectCount, darkCount, `SVG rect count (${rectCount}) must match dark modules (${darkCount})`);
  }
});

// =========================================================================
// SECTION 3: Hero Tab Switching Zero-Unmount DOM Preservation
// =========================================================================

suite.test('ADV-1.8: Invisible characters, RTL/LTR marks, and non-breaking spaces in TLV', () => {
  // \u200E (LTR mark), \u200F (RTL mark), \u00A0 (NBSP), \u200B (Zero-width space)
  const specialChars = 'شركة\u200F رَصين\u00A0المتطورة\u200E لتقنية\u200B المعلومات';
  const b64 = zatca.generateZatcaTLV(specialChars, '31024589200003', '2026-10-15T12:00:00Z', '100.00', '15.00');
  const tags = decodeZatcaTLV(b64);
  assertEqual(tags[1].value, specialChars, 'Special unicode whitespace & directional marks must be preserved');
});

suite.test('ADV-2.4: QR Code Matrix Dimension & Boundary Robustness Across Data Sizes', () => {
  // Test varying payload sizes: small (V1-V2), medium (V4-V6), typical ZATCA (V8-V10)
  const smallPayload = 'TLV_SMALL';
  const mSmall = zatca.renderQRCodeMatrix(smallPayload);
  assertGreaterThan(mSmall.length, 20, 'Small payload must produce valid square matrix >= 21');
  const vSmall = validateQRMatrix(mSmall);
  assert(vSmall.validFinders && vSmall.validTiming);

  // Typical ZATCA payload (~130 bytes base64)
  const zatcaPayload = zatca.generateZatcaTLV(
    'شركة رَصين للحلول الرقمية المحدودة',
    '31024589200003',
    '2026-10-15T12:00:00Z',
    '1725.00',
    '225.00'
  );
  const mZatca = zatca.renderQRCodeMatrix(zatcaPayload);
  const vZatca = validateQRMatrix(mZatca);
  assert(vZatca.validFinders && vZatca.validTiming);
  // Verify size matches standard 17 + 4*V
  assertEqual(mZatca.length, 17 + 4 * vZatca.version, 'QR dimension strictly follows 17 + 4*V formula');
});

suite.test('ADV-3.1: Zero-Unmount DOM Layout in Hero.tsx (No Conditional Unmounting)', () => {
  const html = renderComponent(Hero, { onSearch: () => {} });

  // 1. All 4 tab containers are present in HTML concurrently
  assert(html.includes('id="interactive-suite"'), 'Tab navigation bar present');
  assert(html.includes('مولد الفواتير'), 'Invoice Generator present in DOM');
  assert(html.includes('حاسبة التعادل'), 'Break-Even Calculator present in DOM');
  assert(html.includes('فاحص صحة المتاجر'), 'Store Audit Widget present in DOM');

  // 2. Active tab (search) is rendered with 'block'
  const searchBlock = html.includes('block space-y-4');
  assert(searchBlock, 'Search catalog container has block class');

  // Hidden tabs are rendered with 'hidden'
  const hiddenCount = (html.match(/class="[^"]*hidden[^"]*"/g) || []).length;
  assertGreaterThan(hiddenCount, 2, 'Inactive tabs must have hidden class applied');

  // 3. Inspect Hero source code directly to guarantee no conditional unmounting
  const heroSrc = require('fs').readFileSync(
    path.join(projectRoot, 'src/components/storefront/Hero.tsx'),
    'utf-8'
  );
  assert(
    !heroSrc.includes("{activeTab === 'invoice' && <InvoiceGenerator"),
    'Hero must NOT use conditional mounting {activeTab === "invoice" && ...}'
  );
  assert(
    !heroSrc.includes("{activeTab === 'breakeven' && <BreakEvenCalculator"),
    'Hero must NOT use conditional mounting {activeTab === "breakeven" && ...}'
  );
  assert(
    !heroSrc.includes("{activeTab === 'audit' && <StoreAuditWidget"),
    'Hero must NOT use conditional mounting {activeTab === "audit" && ...}'
  );
  assert(
    heroSrc.includes("activeTab === 'invoice' ? 'block"),
    "Hero must use className conditional: activeTab === 'invoice' ? 'block' : 'hidden'"
  );
  assert(
    heroSrc.includes("activeTab === 'breakeven' ? 'block"),
    "Hero must use className conditional: activeTab === 'breakeven' ? 'block' : 'hidden'"
  );
  assert(
    heroSrc.includes("activeTab === 'audit' ? 'block"),
    "Hero must use className conditional: activeTab === 'audit' ? 'block' : 'hidden'"
  );
});

suite.test('ADV-3.2: Hero Container Print Isolation Differentiation', () => {
  const heroSrc = require('fs').readFileSync(
    path.join(projectRoot, 'src/components/storefront/Hero.tsx'),
    'utf-8'
  );

  // Search tab wrapper must have print:hidden
  assert(
    heroSrc.includes("activeTab === 'search' ? 'block space-y-4 animate-fade-in-up print:hidden' : 'hidden'"),
    'Search container must have print:hidden'
  );

  // Break-even tab wrapper must have print:hidden
  assert(
    heroSrc.includes("activeTab === 'breakeven' ? 'block animate-fade-in-up text-right print:hidden' : 'hidden'"),
    'Break-even container must have print:hidden'
  );

  // Audit tab wrapper must have print:hidden
  assert(
    heroSrc.includes("activeTab === 'audit' ? 'block animate-fade-in-up text-right print:hidden' : 'hidden'"),
    'Audit container must have print:hidden'
  );

  // Invoice tab wrapper must NOT have print:hidden so #printable-template-canvas can render on print
  assert(
    heroSrc.includes("activeTab === 'invoice' ? 'block animate-fade-in-up text-right' : 'hidden'"),
    'Invoice container must omit print:hidden so print canvas renders during window.print()'
  );
});

// =========================================================================
// SECTION 4: InvoiceGenerator.tsx Print Isolation & QR Code Embedding
// =========================================================================

suite.test('ADV-4.1: InvoiceGenerator Mounts and Contains Print Canvas with ZATCA QR', () => {
  const html = renderComponent(InvoiceGenerator);

  // Form is marked with print:hidden
  assert(html.includes('print:hidden'), 'Invoice form must have print:hidden class');

  // Printable template canvas exists with hidden print:block
  assert(html.includes('id="printable-template-canvas"'), 'Canvas #printable-template-canvas must exist');
  assert(html.includes('hidden print:block'), 'Canvas must have hidden print:block classes');

  // SVG QR Code exists in both screen and print views
  const svgMatches = (html.match(/<svg/g) || []).length;
  assertGreaterThan(svgMatches, 0, 'Rendered InvoiceGenerator must contain SVG QR Code elements');

  // Mandatory ZATCA fields rendered in print canvas
  assert(html.includes('فاتورة ضريبية إلكترونية مبسطة'), 'Print canvas must declare simplified tax invoice');
  assert(html.includes('شركة رَصين للحلول الرقمية'), 'Default company name rendered in print canvas');
  assert(html.includes('31024589200003'), 'Default tax number rendered in print canvas');
  assert(html.includes('الإجمالي الكلي المستحق:'), 'Total due label rendered in print canvas');
});

suite.test('ADV-4.2: Invoice Math Verification (Subtotal, Discount, Tax, Total)', () => {
  // Simulate invoice math
  const items = [
    { qty: 2, price: 500 }, // 1000
    { qty: 3, price: 150 }, // 450
  ];
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0); // 1450
  assertEqual(subtotal, 1450, 'Subtotal calculation');

  const discountRate = 10; // 10%
  const discountAmount = (subtotal * discountRate) / 100; // 145
  assertEqual(discountAmount, 145, 'Discount amount');

  const taxableAmount = subtotal - discountAmount; // 1305
  assertEqual(taxableAmount, 1305, 'Taxable amount');

  const taxRate = 15; // 15%
  const tax = taxableAmount * (taxRate / 100); // 195.75
  assertEqual(tax, 195.75, 'Tax amount');

  const total = taxableAmount + tax; // 1500.75
  assertEqual(total, 1500.75, 'Final total');

  // TLV generation for this exact math
  const b64 = zatca.generateZatcaTLV(
    'شركة رَصين',
    '31024589200003',
    '2026-10-15T12:00:00Z',
    total.toFixed(2),
    tax.toFixed(2)
  );
  const tags = decodeZatcaTLV(b64);
  assertEqual(tags[4].value, '1500.75', 'Tag 4 matches total.toFixed(2)');
  assertEqual(tags[5].value, '195.75', 'Tag 5 matches tax.toFixed(2)');
});

// Run suite directly if executed as main script, otherwise export
if (require.main === module) {
  suite.run().then((res) => {
    if (res.failed > 0) {
      console.error(`\x1b[31mAdversarial Challenger Suite: ${res.failed} tests failed!\x1b[0m`);
      process.exit(1);
    } else {
      console.log(`\x1b[32mAdversarial Challenger Suite: All ${res.passed} tests passed successfully!\x1b[0m`);
      process.exit(0);
    }
  }).catch((err) => {
    console.error('Fatal in test runner:', err);
    process.exit(1);
  });
}

module.exports = suite;
