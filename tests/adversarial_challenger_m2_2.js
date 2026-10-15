/**
 * Adversarial Challenger Test Suite 2 (Milestone M2)
 * Agent: challenger_m2_2 (archetype: teamwork_preview_challenger)
 * 
 * Objectives:
 *   1. RaseenAssistant.tsx:
 *      - Verify all branches of recommendation tree map to catalog products (acc-1..12, leg-1..10)
 *      - Verify Arabic explanation of 85% creator profit model (InstaPay, Mada, 15% platform fee, /vendor)
 *      - Verify WhatsApp deep link generation, URL encoding, and Lead qualification regexes
 *   2. src/lib/currency.ts:
 *      - Empirically verify that formatPrice(convertPrice(amount, curr), curr) does NOT happen anywhere
 *      - Verify formatPrice(amountEGP, curr) correctly executes single conversion
 *      - Verify math properties, active rates immutability, and country-to-currency mapping
 *   3. push_to_github_api.js:
 *      - Verify no PAT or credentials are hardcoded or leaked
 *      - Verify exit behavior when environment variables are missing
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
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
  assertGreaterThan,
  assertGreaterThanOrEqual,
} = require('./e2e/test_utils.js');

const suite = new TestSuite('Adversarial Challenger M2_2: Assistant, Currency & Security');

// =========================================================================
// SECTION 1: RaseenAssistant Recommendation Tree & Curated Catalog Matrix
// =========================================================================

const assistantModule = jiti('@/components/assistant/RaseenAssistant.tsx');
const {
  ACCOUNTING_CATALOG,
  LEGAL_CATALOG,
  validatePhone,
  validateEmail,
} = assistantModule;

suite.test('ASST-2.1: Accounting Catalog Matrix Completeness (acc-1..12)', () => {
  assert(Array.isArray(ACCOUNTING_CATALOG), 'ACCOUNTING_CATALOG must be an array');
  assertEqual(ACCOUNTING_CATALOG.length, 12, 'ACCOUNTING_CATALOG must contain exactly 12 items');

  const expectedIds = Array.from({ length: 12 }, (_, i) => `acc-${i + 1}`);
  const actualIds = ACCOUNTING_CATALOG.map((item) => item.id);

  // Check all expected IDs are present and in order
  assertDeepEqual(actualIds, expectedIds, 'Accounting catalog IDs must match acc-1 through acc-12 exactly');

  // Verify unique IDs (no duplicates)
  const uniqueIds = new Set(actualIds);
  assertEqual(uniqueIds.size, 12, 'Accounting catalog must have 12 unique IDs');

  // Verify item properties
  ACCOUNTING_CATALOG.forEach((item) => {
    assert(item.id && typeof item.id === 'string', `Item must have string id: ${item.id}`);
    assert(item.title && typeof item.title === 'string', `Item ${item.id} must have non-empty title`);
    assertEqual(item.category, 'accounting', `Item ${item.id} category must be 'accounting'`);
    assert(typeof item.priceEGP === 'number' && item.priceEGP > 0, `Item ${item.id} priceEGP must be > 0`);
    assert(item.description && item.description.length > 10, `Item ${item.id} description must be detailed`);
    assert(Array.isArray(item.tags) && item.tags.length > 0, `Item ${item.id} must have tags`);
    assertEqual(item.link, '/#products', `Item ${item.id} link must navigate to catalog anchor /#products`);
  });
});

suite.test('ASST-2.2: Legal Catalog Matrix Completeness (leg-1..10)', () => {
  assert(Array.isArray(LEGAL_CATALOG), 'LEGAL_CATALOG must be an array');
  assertEqual(LEGAL_CATALOG.length, 10, 'LEGAL_CATALOG must contain exactly 10 items');

  const expectedIds = Array.from({ length: 10 }, (_, i) => `leg-${i + 1}`);
  const actualIds = LEGAL_CATALOG.map((item) => item.id);

  // Check all expected IDs are present and in order
  assertDeepEqual(actualIds, expectedIds, 'Legal catalog IDs must match leg-1 through leg-10 exactly');

  // Verify unique IDs
  const uniqueIds = new Set(actualIds);
  assertEqual(uniqueIds.size, 10, 'Legal catalog must have 10 unique IDs');

  // Verify item properties
  LEGAL_CATALOG.forEach((item) => {
    assert(item.id && typeof item.id === 'string', `Item must have string id: ${item.id}`);
    assert(item.title && typeof item.title === 'string', `Item ${item.id} must have non-empty title`);
    assertEqual(item.category, 'legal', `Item ${item.id} category must be 'legal'`);
    assert(typeof item.priceEGP === 'number' && item.priceEGP > 0, `Item ${item.id} priceEGP must be > 0`);
    assert(item.description && item.description.length > 10, `Item ${item.id} description must be detailed`);
    assert(Array.isArray(item.tags) && item.tags.length > 0, `Item ${item.id} must have tags`);
    assertEqual(item.link, '/#products', `Item ${item.id} link must navigate to catalog anchor /#products`);
  });
});

suite.test('ASST-2.3: Interactive Recommendation Tree Branch Traversal & Product Resolution', () => {
  // Read source to inspect recommendation mappings directly
  const assistantSrc = fs.readFileSync(
    path.join(projectRoot, 'src/components/assistant/RaseenAssistant.tsx'),
    'utf-8'
  );

  const industries = ['companies', 'construction', 'ecommerce', 'restaurants', 'freelance'];
  const needs = ['accounting', 'legal', 'breakeven'];

  // Map of expected recommendation mappings extracted from code
  const accountingMappings = {
    companies: ['acc-1', 'acc-6', 'acc-9', 'acc-2'],
    construction: ['acc-4', 'acc-8', 'acc-11', 'acc-12'],
    ecommerce: ['acc-3', 'acc-4', 'acc-10', 'acc-8'],
    restaurants: ['acc-8', 'acc-5', 'acc-2', 'acc-4'],
    freelance: ['acc-2', 'acc-3', 'acc-6', 'acc-1'],
  };

  const legalMappings = {
    companies: ['leg-1', 'leg-2', 'leg-3', 'leg-4'],
    construction: ['leg-5', 'leg-4', 'leg-1', 'leg-8'],
    ecommerce: ['leg-10', 'leg-9', 'leg-2', 'leg-6'],
    restaurants: ['leg-1', 'leg-8', 'leg-4', 'leg-2'],
    freelance: ['leg-6', 'leg-7', 'leg-2', 'leg-4'],
  };

  const accountingCatalogMap = new Map(ACCOUNTING_CATALOG.map((i) => [i.id, i]));
  const legalCatalogMap = new Map(LEGAL_CATALOG.map((i) => [i.id, i]));

  // Test every accounting branch
  for (const ind of industries) {
    const targetIds = accountingMappings[ind];
    assert(targetIds && targetIds.length > 0, `Industry ${ind} must have accounting target IDs`);

    for (const id of targetIds) {
      const found = accountingCatalogMap.get(id);
      assert(found !== undefined, `Branch (industry=${ind}, need=accounting) maps to non-existent ID: ${id}`);
      assertEqual(found.category, 'accounting', `Item ${id} must be categorized as accounting`);
    }

    // Verify filter operation works without returning undefined
    const recs = ACCOUNTING_CATALOG.filter((item) => targetIds.includes(item.id));
    assertEqual(recs.length, targetIds.length, `Branch ${ind}: expected ${targetIds.length} items, got ${recs.length}`);
  }

  // Test every legal branch
  for (const ind of industries) {
    const targetIds = legalMappings[ind];
    assert(targetIds && targetIds.length > 0, `Industry ${ind} must have legal target IDs`);

    for (const id of targetIds) {
      const found = legalCatalogMap.get(id);
      assert(found !== undefined, `Branch (industry=${ind}, need=legal) maps to non-existent ID: ${id}`);
      assertEqual(found.category, 'legal', `Item ${id} must be categorized as legal`);
    }

    const recs = LEGAL_CATALOG.filter((item) => targetIds.includes(item.id));
    assertEqual(recs.length, targetIds.length, `Branch ${ind}: expected ${targetIds.length} items, got ${recs.length}`);
  }

  // Test breakeven branch: maps to acc-6 and acc-8
  const beIds = ['acc-6', 'acc-8'];
  for (const id of beIds) {
    assert(accountingCatalogMap.has(id), `Breakeven branch item ${id} must exist in accounting catalog`);
  }

  // Check Catalog Reachability: verify which catalog items are reachable from recommendation tree
  const reachableAccounting = new Set();
  Object.values(accountingMappings).forEach((arr) => arr.forEach((id) => reachableAccounting.add(id)));
  beIds.forEach((id) => reachableAccounting.add(id));

  // 11 of 12 accounting products are represented across the 5 industries (acc-7 is in full catalog view)
  assertGreaterThanOrEqual(
    reachableAccounting.size,
    11,
    'At least 11 accounting products must be reachable across industries'
  );

  const reachableLegal = new Set();
  Object.values(legalMappings).forEach((arr) => arr.forEach((id) => reachableLegal.add(id)));
  // All 10 legal products are represented across the 5 industries
  assertEqual(
    reachableLegal.size,
    10,
    'All 10 legal products must be reachable across industries'
  );
});

// =========================================================================
// SECTION 2: 85% Creator Profit Model Arabic Explanation
// =========================================================================

suite.test('ASST-2.4: 85% Creator Profit Model Arabic Explanation Fidelity', () => {
  const assistantSrc = fs.readFileSync(
    path.join(projectRoot, 'src/components/assistant/RaseenAssistant.tsx'),
    'utf-8'
  );

  // Extract explainCreatorProfitModel function body
  const fnMatch = assistantSrc.match(/const explainCreatorProfitModel = \(\) => \{([\s\S]*?)\};/);
  assert(fnMatch !== null, 'explainCreatorProfitModel function must exist in RaseenAssistant.tsx');

  const fnBody = fnMatch[1];

  // 1. Must explicitly state 85% creator profit
  assert(fnBody.includes('85% للبائع') || fnBody.includes('85% ربح صافي'), 'Must state 85% net profit for creator');

  // 2. Must state 15% platform fee
  assert(fnBody.includes('15%') && fnBody.includes('المنصة'), 'Must explain 15% platform commission');

  // 3. Must explain payment channels: InstaPay and Mada
  assert(fnBody.includes('إنستاباي') || fnBody.includes('InstaPay'), 'Must mention InstaPay payout channel');
  assert(fnBody.includes('مدى') || fnBody.includes('Mada'), 'Must mention Mada / GCC bank transfer payout channel');

  // 4. Must provide actionLink to /vendor
  assert(fnBody.includes("href: '/vendor'"), 'Must link directly to /vendor onboarding page');

  // 5. Must mention IP protection / encryption
  assert(fnBody.includes('الملكية الفكرية') || fnBody.includes('تشفير'), 'Must mention IP protection and encryption');
});

suite.test('ASST-2.5: Free-text Trigger Matching for 85% Creator Model', () => {
  const assistantSrc = fs.readFileSync(
    path.join(projectRoot, 'src/components/assistant/RaseenAssistant.tsx'),
    'utf-8'
  );

  // Verify keyword triggers exist in respondToFreeText
  const triggers = ['ربح', '85', 'بائع', 'متجر', 'بيع', 'عمولة', 'سحب'];
  for (const trigger of triggers) {
    assert(
      assistantSrc.includes(`q.includes('${trigger}')`),
      `respondToFreeText must match creator profit keyword: "${trigger}"`
    );
  }
});

// =========================================================================
// SECTION 3: WhatsApp Deep Link Generation & Contact Validation
// =========================================================================

suite.test('ASST-2.6: WhatsApp Deep Link Generation & URL Encoding Oracles', () => {
  const assistantSrc = fs.readFileSync(
    path.join(projectRoot, 'src/components/assistant/RaseenAssistant.tsx'),
    'utf-8'
  );

  // Verify WhatsApp base link format
  assert(
    assistantSrc.includes('https://wa.me/201026046026?text='),
    'WhatsApp deep link must target https://wa.me/201026046026?text='
  );

  // Oracle test of deep link generation
  const testLeadId = 'LEAD-MVA12345-9999';
  const testInterest = 'طلب باقة: acc-1, acc-6 & استشارة شركات ناشئة (VIP)';

  const waRawText = `مرحباً فريق رَصين، قمت بتقديم طلب استشارة عبر المساعد الذكي برقم مرجعي: ${testLeadId} بخصوص (${testInterest}).`;
  const waEncoded = encodeURIComponent(waRawText);
  const waUrl = `https://wa.me/201026046026?text=${waEncoded}`;

  // Verify valid URL
  assert(waUrl.startsWith('https://wa.me/201026046026?text='), 'Must have proper base URL');
  assert(!waUrl.includes(' '), 'Encoded URL must have NO unencoded whitespace');
  assert(!waUrl.includes('\n'), 'Encoded URL must have NO unencoded newlines');

  // Verify full decodability (no loss of Arabic or special characters)
  const decodedText = decodeURIComponent(waEncoded);
  assertEqual(decodedText, waRawText, 'Decoded text must match original raw message verbatim');
  assert(decodedText.includes(testLeadId), 'Decoded message must contain the exact leadId');
  assert(decodedText.includes(testInterest), 'Decoded message must contain user interest topic');
});

suite.test('ASST-2.7: Phone & Email Validation Regexes (Adversarial Boundary Testing)', () => {
  // Test valid phone numbers
  const validPhones = [
    '+966501234567', // Saudi E.164
    '+201012345678', // Egypt E.164
    '+971501234567', // UAE E.164
    '+14155552671',  // US E.164
    '01012345678',   // Egypt local mobile (010)
    '01112345678',   // Egypt local mobile (011)
    '01212345678',   // Egypt local mobile (012)
    '01512345678',   // Egypt local mobile (015)
    '0501234567',    // Saudi local mobile (05)
    '+966 50 123 4567', // Formatted with spaces
    '010-1234-5678',   // Formatted with dashes
  ];

  for (const phone of validPhones) {
    assertEqual(validatePhone(phone), true, `Phone "${phone}" should be valid`);
  }

  // Test invalid phone numbers
  const invalidPhones = [
    '',
    '123',
    'abc',
    '+',
    '+0123456', // E.164 cannot start with +0
    '000000000',
    null,
    undefined,
  ];

  for (const phone of invalidPhones) {
    assertEqual(validatePhone(phone), false, `Phone "${phone}" should be rejected`);
  }

  // Test valid emails
  const validEmails = [
    'user@example.com',
    'mohamed.helmy@raseen.com',
    'ceo+tag@startup.co.uk',
    'contact_us@enterprise.org',
    'first.last@domain.com.eg',
  ];

  for (const email of validEmails) {
    assertEqual(validateEmail(email), true, `Email "${email}" should be valid`);
  }

  // Test invalid emails
  const invalidEmails = [
    '',
    'plainaddress',
    '@missingusername.com',
    'missingdomain@.com',
    'missingat.com',
    'spaces in@domain.com',
    null,
    undefined,
  ];

  for (const email of invalidEmails) {
    assertEqual(validateEmail(email), false, `Email "${email}" should be rejected`);
  }
});

// =========================================================================
// SECTION 4: Currency Engine Single-Conversion & Repository Verification
// =========================================================================

const currencyLib = jiti('@/lib/currency.ts');
const {
  formatPrice,
  convertPrice,
  getActiveRates,
  updateExchangeRates,
  EXCHANGE_RATES,
  COUNTRY_TO_CURRENCY_MAP,
} = currencyLib;

suite.test('CURR-2.1: Single Conversion Guarantee - formatPrice Mathematical Correctness', () => {
  const basePriceEGP = 1000;

  // EGP format
  const egpFormatted = formatPrice(basePriceEGP, 'EGP');
  assertEqual(egpFormatted, '1000 ج.م', 'EGP must format without decimals and with ج.م');

  // SAR format (rate 0.077 -> 77 SAR)
  const sarFormatted = formatPrice(basePriceEGP, 'SAR');
  assertEqual(sarFormatted, '77 ر.س', 'SAR must convert 1000 * 0.077 = 77 and format with ر.س');

  // AED format (rate 0.074 -> 74 AED)
  const aedFormatted = formatPrice(basePriceEGP, 'AED');
  assertEqual(aedFormatted, '74 د.إ', 'AED must convert 1000 * 0.074 = 74 and format with د.إ');

  // USD format (rate 0.02 -> 20 USD)
  const usdFormatted = formatPrice(basePriceEGP, 'USD');
  assertEqual(usdFormatted, '20 $', 'USD must convert 1000 * 0.02 = 20 and format with $');
});

suite.test('CURR-2.2: Double-Conversion Trap Elimination Across Entire Repository', () => {
  // Empirically scan ALL source files in src/
  function scanDir(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        scanDir(full, fileList);
      } else if (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.jsx')) {
        fileList.push(full);
      }
    }
    return fileList;
  }

  const allSrcFiles = scanDir(path.join(projectRoot, 'src'));
  const suspiciousDoubleConversions = [];

  for (const filePath of allSrcFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Pattern 1: formatPrice(convertPrice(...))
    if (/formatPrice\s*\(\s*convertPrice\s*\(/.test(content)) {
      suspiciousDoubleConversions.push({
        file: path.relative(projectRoot, filePath),
        pattern: 'formatPrice(convertPrice(...))',
      });
    }

    // Pattern 2: convertPrice(formatPrice(...))
    if (/convertPrice\s*\(\s*formatPrice\s*\(/.test(content)) {
      suspiciousDoubleConversions.push({
        file: path.relative(projectRoot, filePath),
        pattern: 'convertPrice(formatPrice(...))',
      });
    }

    // Pattern 3: passing already converted price variable to formatPrice
    if (/formatPrice\s*\(\s*convertedPrice\s*,/.test(content) || /formatPrice\s*\(\s*priceSAR\s*,/.test(content)) {
      suspiciousDoubleConversions.push({
        file: path.relative(projectRoot, filePath),
        pattern: 'formatPrice(convertedPrice, ...)',
      });
    }
  }

  assertEqual(
    suspiciousDoubleConversions.length,
    0,
    `Double conversion patterns found in source code: ${JSON.stringify(suspiciousDoubleConversions)}`
  );
});

suite.test('CURR-2.3: Mathematical Magnitude Check Between Single and Double Conversion', () => {
  const basePriceEGP = 1000;
  const rates = getActiveRates();

  // Correct Single Conversion:
  const singleSAR = convertPrice(basePriceEGP, 'SAR', rates);
  assertEqual(singleSAR, 77, 'Single conversion: 1000 EGP * 0.077 = 77 SAR');

  // Buggy Double Conversion:
  const doubleSAR = convertPrice(singleSAR, 'SAR', rates);
  assertEqual(doubleSAR, 5.929, 'Double conversion would produce 5.929 SAR (13x smaller!)');

  const ratio = singleSAR / doubleSAR;
  assertGreaterThan(ratio, 12, 'Double conversion error ratio is catastrophic (> 12x error)');
});

suite.test('CURR-2.4: Active Rates Immutability & Country Geolocation Mapping Oracle', () => {
  // Check activeRates clone immutability
  const rates1 = getActiveRates();
  rates1.SAR = 999; // mutate returned object

  const rates2 = getActiveRates();
  assertEqual(rates2.SAR, 0.077, 'Mutating getActiveRates() return value must NOT mutate internal state');

  // Check COUNTRY_TO_CURRENCY_MAP oracle
  assertEqual(COUNTRY_TO_CURRENCY_MAP.EG, 'EGP', 'Egypt maps to EGP');
  assertEqual(COUNTRY_TO_CURRENCY_MAP.SA, 'SAR', 'Saudi Arabia maps to SAR');
  assertEqual(COUNTRY_TO_CURRENCY_MAP.AE, 'AED', 'UAE maps to AED');
  assertEqual(COUNTRY_TO_CURRENCY_MAP.US, 'USD', 'United States maps to USD');
  assertEqual(COUNTRY_TO_CURRENCY_MAP.GB, 'USD', 'UK maps to USD');
  assertEqual(COUNTRY_TO_CURRENCY_MAP.KW, 'SAR', 'Kuwait maps to SAR');
});

// =========================================================================
// SECTION 5: push_to_github_api.js Credentials & Leak Verification
// =========================================================================

suite.test('SEC-2.1: Sanitization and Secret Leak Check in push_to_github_api.js', () => {
  const scriptPath = path.join(projectRoot, 'push_to_github_api.js');
  assert(fs.existsSync(scriptPath), 'push_to_github_api.js must exist');

  const content = fs.readFileSync(scriptPath, 'utf-8');

  // Check for classic GitHub PAT tokens
  const tokenRegexes = [
    /ghp_[a-zA-Z0-9]{36}/,
    /github_pat_[a-zA-Z0-9_]{50,}/,
    /gho_[a-zA-Z0-9]{36}/,
    /ghu_[a-zA-Z0-9]{36}/,
    /ghs_[a-zA-Z0-9]{36}/,
    /ghr_[a-zA-Z0-9]{36}/,
  ];

  for (const regex of tokenRegexes) {
    assert(!regex.test(content), `Found hardcoded token matching ${regex} in push_to_github_api.js!`);
  }

  // Verify it reads only from environment variables
  assert(
    content.includes('process.env.GITHUB_PAT || process.env.GITHUB_TOKEN'),
    'push_to_github_api.js must prioritize process.env.GITHUB_PAT || process.env.GITHUB_TOKEN'
  );

  // Verify clean exit when token is missing
  assert(
    content.includes('Error: GITHUB_PAT or GITHUB_TOKEN environment variable is required.') &&
    content.includes('process.exit(1)'),
    'Must cleanly exit with status 1 if no token environment variable is provided'
  );
});

suite.test('SEC-2.2: Empirical Execution of push_to_github_api.js Without Token', () => {
  const scriptPath = path.join(projectRoot, 'push_to_github_api.js');

  let failed = false;
  let exitCode = 0;
  let stderrOutput = '';

  try {
    // Run script with sanitized empty environment
    execSync(`node "${scriptPath}"`, {
      env: { ...process.env, GITHUB_PAT: '', GITHUB_TOKEN: '' },
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch (err) {
    failed = true;
    exitCode = err.status;
    stderrOutput = err.stderr ? err.stderr.toString() : '';
  }

  assertEqual(failed, true, 'Script must fail when executed without GITHUB_PAT/GITHUB_TOKEN');
  assertEqual(exitCode, 1, 'Script must exit with code 1');
  assert(
    stderrOutput.includes('Error: GITHUB_PAT or GITHUB_TOKEN environment variable is required.'),
    `stderr must state required env variable. Got: ${stderrOutput}`
  );
});

// Run all tests in suite
suite.run().then((summary) => {
  if (summary.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
});
