/**
 * Tier 1: ZATCA TLV Base64 & QR Matrix Verification Tests
 * Authority: Saudi ZATCA (FATOORA) E-Invoicing Phase 1 & 2 Standard
 * Interface: src/lib/zatca.ts
 */

const {
  jiti,
  TestSuite,
  assert,
  assertEqual,
  assertGreaterThan,
  decodeZatcaTLV,
  validateQRMatrix,
} = require('./test_utils');

const zatca = jiti('@/lib/zatca.ts');

const suite = new TestSuite('Tier 1: ZATCA TLV Base64 & Authentic QR Code Matrix');

// Test 1: Standard 5-tag TLV Generation & Oracle Binary Verification
suite.test('ZATCA-1.1: 5-tag TLV generation compliant with ZATCA Phase 1/2 structure', () => {
  const seller = 'شركة رَصين للحلول الرقمية المحدودة';
  const vatNumber = '31024589200003';
  const timestamp = '2026-10-15T14:30:00Z';
  const total = '1725.00';
  const vatTotal = '225.00';

  const b64 = zatca.generateZatcaTLV(seller, vatNumber, timestamp, total, vatTotal);
  assert(typeof b64 === 'string' && b64.length > 0, 'Generated Base64 must be non-empty string');

  // Decode with authoritative oracle
  const tags = decodeZatcaTLV(b64);

  // Assert Tag 1: Seller Name
  assert(tags[1], 'Tag 1 (Seller Name) must exist');
  assertEqual(tags[1].value, seller, 'Tag 1 value must match seller name');
  assertEqual(tags[1].length, Buffer.from(seller, 'utf-8').length, 'Tag 1 length must match UTF-8 byte length');

  // Assert Tag 2: VAT Number
  assert(tags[2], 'Tag 2 (VAT Number) must exist');
  assertEqual(tags[2].value, vatNumber, 'Tag 2 value must match VAT number');
  assertEqual(tags[2].length, 14, 'Tag 2 length must be 14 bytes for 14-character string');

  // Assert Tag 3: Timestamp
  assert(tags[3], 'Tag 3 (Timestamp) must exist');
  assertEqual(tags[3].value, timestamp, 'Tag 3 value must match timestamp');

  // Assert Tag 4: Invoice Total (with VAT)
  assert(tags[4], 'Tag 4 (Total) must exist');
  assertEqual(tags[4].value, total, 'Tag 4 value must match invoice total');

  // Assert Tag 5: VAT Total
  assert(tags[5], 'Tag 5 (VAT Total) must exist');
  assertEqual(tags[5].value, vatTotal, 'Tag 5 value must match VAT amount');
});

// Test 2: Multibyte UTF-8 Arabic Character Handling
suite.test('ZATCA-1.2: Correct multibyte UTF-8 length encoding in Arabic text tags', () => {
  const arabicText = 'مؤسسة الأفق المتقدمة للمقاولات والتوريدات العامة';
  const textEncoderBytes = new TextEncoder().encode(arabicText).length;

  const b64 = zatca.generateZatcaTLV(
    arabicText,
    '300000000000003',
    '2026-10-15T10:00:00Z',
    '500.00',
    '75.00'
  );

  const tags = decodeZatcaTLV(b64);
  assertEqual(tags[1].length, textEncoderBytes, 'Tag length must equal UTF-8 byte count, not string char count');
  assertEqual(tags[1].value, arabicText, 'Decoded UTF-8 string must retain full Arabic fidelity');
});

// Test 3: Dual Signature Equivalence (Object vs Positional)
suite.test('ZATCA-1.3: Object signature and 5-argument positional signature parity', () => {
  const payload = {
    sellerName: 'مكتب استشارات رَصين',
    vatNumber: '31099988810003',
    timestamp: '2026-10-15T18:00:00Z',
    totalAmount: '4600.00',
    vatAmount: '600.00',
  };

  const b64FromObj = zatca.generateZatcaTLV(payload);
  const b64FromArgs = zatca.generateZatcaTLV(
    payload.sellerName,
    payload.vatNumber,
    payload.timestamp,
    payload.totalAmount,
    payload.vatAmount
  );

  assertEqual(b64FromObj, b64FromArgs, 'Object signature and positional signature must produce identical Base64');
});

// Test 4: Authentic QR Code Model 2 Matrix Verification
suite.test('ZATCA-1.4: ISO/IEC 18004 Model 2 QR matrix geometry, finders & timing', () => {
  const b64 = zatca.generateZatcaTLV(
    'شركة رَصين',
    '31024589200003',
    '2026-10-15T12:00:00Z',
    '1150.00',
    '150.00'
  );

  const matrix = zatca.renderQRCodeMatrix(b64);
  const validation = validateQRMatrix(matrix);

  assert(validation.validFinders, 'All three 7x7 corner finder patterns must match ISO standard');
  assert(validation.validTiming, 'Alternating timing patterns must be strictly compliant');
  assertGreaterThan(validation.size, 20, 'QR Matrix size must be at least Version 1 dimension (21x21)');
});

// Test 5: Dynamic SVG Rendering of Authentic QR Matrix
suite.test('ZATCA-1.5: SVG generation with accurate viewBox, rect counts & dimensions', () => {
  const b64 = zatca.generateZatcaTLV(
    'شركة رَصين',
    '31024589200003',
    '2026-10-15T12:00:00Z',
    '230.00',
    '30.00'
  );

  const matrix = zatca.renderQRCodeMatrix(b64);
  const totalDarkModules = matrix.flat().filter(Boolean).length;

  const svg = zatca.generateZatcaQRSvg(b64, 160);
  assert(svg.startsWith('<svg'), 'SVG output must start with <svg tag');
  assert(svg.includes('viewBox="0 0 160 160"'), 'SVG must include viewBox "0 0 160 160"');
  assert(svg.includes('width="160"'), 'SVG must have width 160');
  assert(svg.includes('height="160"'), 'SVG must have height 160');

  // Count rect elements in SVG
  const rectMatches = svg.match(/<rect/g);
  const rectCount = rectMatches ? rectMatches.length : 0;
  assertEqual(rectCount, totalDarkModules, 'SVG must contain exactly one <rect> per dark QR module');
});

// Test 6: Default Fallback Handling for Incomplete Inputs
suite.test('ZATCA-1.6: Graceful fallback defaults when optional fields are omitted', () => {
  const b64 = zatca.generateZatcaTLV({});
  assert(typeof b64 === 'string' && b64.length > 0, 'Default object call must produce valid Base64');

  const tags = decodeZatcaTLV(b64);
  assert(tags[1] && tags[1].value.length > 0, 'Default seller must be non-empty');
  assert(tags[2] && tags[2].value.length > 0, 'Default VAT number must be non-empty');
  assert(tags[3] && tags[3].value.length > 0, 'Default timestamp must be non-empty');
  assertEqual(tags[4].value, '0.00', 'Default total amount must be "0.00"');
  assertEqual(tags[5].value, '0.00', 'Default VAT amount must be "0.00"');
});

module.exports = suite;
