/**
 * Raseen Platform E2E Test Utilities & Oracles
 * Pure JavaScript / Node.js harness using jiti for TypeScript & JSX resolution.
 * Zero external testing framework dependencies — self-contained and isolated.
 */

const path = require('path');
const projectRoot = path.resolve(__dirname, '../..');

// Initialize jiti runtime loader with project root and @/ alias
const jiti = require('jiti')(path.join(projectRoot, 'test_loader.js'), {
  jsx: true,
  alias: {
    '@': path.join(projectRoot, 'src'),
  },
});

// React & ReactDOMServer for component DOM inspection
const React = jiti('react');
const ReactDOMServer = jiti('react-dom/server');

/**
 * Test Runner State
 */
class TestSuite {
  constructor(name) {
    this.name = name;
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.errors = [];
  }

  test(description, fn) {
    this.tests.push({ description, fn });
  }

  async run() {
    console.log(`\n\x1b[36m▶ Running Suite: ${this.name}\x1b[0m`);
    const startTime = Date.now();

    for (const t of this.tests) {
      try {
        await t.fn();
        this.passed++;
        console.log(`  \x1b[32m✔\x1b[0m ${t.description}`);
      } catch (err) {
        this.failed++;
        const msg = err && err.message ? err.message : String(err);
        this.errors.push({ test: t.description, error: msg, stack: err.stack });
        console.log(`  \x1b[31m✖\x1b[0m ${t.description}`);
        console.log(`    \x1b[31mError: ${msg}\x1b[0m`);
      }
    }

    const duration = Date.now() - startTime;
    console.log(`\x1b[90m  Total: ${this.tests.length} | Passed: ${this.passed} | Failed: ${this.failed} (${duration}ms)\x1b[0m`);

    return {
      name: this.name,
      total: this.tests.length,
      passed: this.passed,
      failed: this.failed,
      duration,
      errors: this.errors,
    };
  }
}

/**
 * Assertion Utilities
 */
function assert(condition, message = 'Assertion failed') {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEqual(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`${message || 'Assertion failed'}: expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
  }
}

function assertDeepEqual(actual, expected, message = '') {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    throw new Error(`${message || 'Deep equality failed'}: expected ${expectedStr}, but got ${actualStr}`);
  }
}

function assertMatches(str, regex, message = '') {
  if (typeof str !== 'string' || !regex.test(str)) {
    throw new Error(`${message || 'Regex match failed'}: "${str}" does not match pattern ${regex}`);
  }
}

function assertGreaterThan(actual, min, message = '') {
  if (!(actual > min)) {
    throw new Error(`${message || 'Comparison failed'}: expected ${actual} > ${min}`);
  }
}

function assertGreaterThanOrEqual(actual, min, message = '') {
  if (!(actual >= min)) {
    throw new Error(`${message || 'Comparison failed'}: expected ${actual} >= ${min}`);
  }
}

async function assertThrows(fn, expectedSubstr = '', message = '') {
  let threw = false;
  try {
    await fn();
  } catch (err) {
    threw = true;
    if (expectedSubstr && !String(err).includes(expectedSubstr)) {
      throw new Error(`${message || 'Error mismatch'}: expected error containing "${expectedSubstr}", got "${err.message}"`);
    }
  }
  if (!threw) {
    throw new Error(message || 'Expected function to throw, but it succeeded');
  }
}

/**
 * Authoritative ZATCA TLV Decoder (Oracle)
 * Independent binary decoder to verify compliance with Saudi ZATCA e-invoicing Phase 1/2.
 */
function decodeZatcaTLV(base64Payload) {
  assert(typeof base64Payload === 'string' && base64Payload.length > 0, 'TLV payload must be non-empty string');
  const buffer = Buffer.from(base64Payload, 'base64');
  assert(buffer.length >= 10, 'TLV buffer must be at least 10 bytes for 5 tags');

  const tags = {};
  let offset = 0;

  while (offset < buffer.length) {
    assert(offset + 2 <= buffer.length, `Malformed TLV: truncated header at offset ${offset}`);
    const tag = buffer[offset];
    const length = buffer[offset + 1];
    assert(offset + 2 + length <= buffer.length, `Malformed TLV: tag ${tag} length ${length} exceeds buffer size`);

    const valueBuffer = buffer.subarray(offset + 2, offset + 2 + length);
    const value = valueBuffer.toString('utf-8');
    tags[tag] = {
      tag,
      length,
      value,
      rawBytes: Array.from(valueBuffer),
    };
    offset += 2 + length;
  }

  return tags;
}

/**
 * Authoritative QR Code Matrix Validator (Oracle)
 * Validates ISO/IEC 18004 Standard compliance of the boolean matrix.
 */
function validateQRMatrix(matrix) {
  assert(Array.isArray(matrix), 'QR matrix must be an array');
  const size = matrix.length;
  assert(size >= 21, `QR matrix dimension ${size} is smaller than Version 1 (21)`);

  // Ensure square
  for (let r = 0; r < size; r++) {
    assert(Array.isArray(matrix[r]) && matrix[r].length === size, `Row ${r} length ${matrix[r]?.length} does not match width ${size}`);
    for (let c = 0; c < size; c++) {
      assert(typeof matrix[r][c] === 'boolean', `Module at (${r},${c}) is not boolean: ${typeof matrix[r][c]}`);
    }
  }

  // Version calculation: size = 17 + 4*V
  const version = (size - 17) / 4;
  assert(Number.isInteger(version) && version >= 1 && version <= 40, `Invalid QR matrix size ${size} (derived version ${version})`);

  // Helper to test 7x7 Finder Pattern at (topR, leftC)
  function checkFinder(topR, leftC, name) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        const expectedDark = isOuter || isCenter;
        const actual = matrix[topR + r][leftC + c];
        assert(
          actual === expectedDark,
          `Finder pattern ${name} mismatch at relative (${r},${c}): expected ${expectedDark ? 'dark' : 'light'}, got ${actual ? 'dark' : 'light'}`
        );
      }
    }
  }

  // Check 3 finders
  checkFinder(0, 0, 'Top-Left');
  checkFinder(0, size - 7, 'Top-Right');
  checkFinder(size - 7, 0, 'Bottom-Left');

  // Check Dark Module at (4*V + 9, 8)
  const darkModuleRow = 4 * version + 9;
  assert(matrix[darkModuleRow][8] === true, `Dark module at (${darkModuleRow}, 8) must be true`);

  // Check Timing Patterns
  // Horizontal timing on row 6 between col 8 and size-8
  for (let c = 8; c < size - 8; c++) {
    const expected = c % 2 === 0;
    assert(matrix[6][c] === expected, `Horizontal timing pattern mismatch at (6, ${c}): expected ${expected}, got ${matrix[6][c]}`);
  }

  return {
    size,
    version,
    validFinders: true,
    validTiming: true,
  };
}

/**
 * Render React component to HTML string for SSR inspection
 */
function renderComponent(Component, props = {}) {
  return ReactDOMServer.renderToStaticMarkup(React.createElement(Component, props));
}

module.exports = {
  jiti,
  projectRoot,
  TestSuite,
  assert,
  assertEqual,
  assertDeepEqual,
  assertMatches,
  assertGreaterThan,
  assertGreaterThanOrEqual,
  assertThrows,
  decodeZatcaTLV,
  validateQRMatrix,
  renderComponent,
};
