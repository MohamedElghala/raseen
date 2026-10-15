/**
 * Adversarial Challenger Test Suite (Milestone M2)
 * Agent: challenger_m2_1 (archetype: teamwork_preview_challenger)
 * 
 * Scope:
 *   1. src/app/api/leads/route.ts (Lead qualification, validation, regexes, security, HTTP 200/400)
 *   2. src/app/api/currency/route.ts (Live rates, in-memory caching, offline fallback, country overrides)
 *   3. src/lib/currency.ts (Single-conversion formatting, mathematical fidelity, RTL formatting)
 */

const path = require('path');
const projectRoot = path.resolve(__dirname, '..');

// Use project jiti to load TypeScript modules
const jiti = require('jiti')(path.join(projectRoot, 'test_loader.js'), {
  jsx: true,
  alias: {
    '@': path.join(projectRoot, 'src'),
  },
});

const leadsRoute = jiti('@/app/api/leads/route.ts');
const currencyRoute = jiti('@/app/api/currency/route.ts');
const currencyLib = jiti('@/lib/currency.ts');

const {
  TestSuite,
  assert,
  assertEqual,
  assertDeepEqual,
  assertGreaterThan,
  assertGreaterThanOrEqual,
  assertMatches,
} = require('./e2e/test_utils.js');

// Helper to construct POST requests for /api/leads
function createLeadPostRequest(body) {
  const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
  return new Request('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: bodyStr,
  });
}

// Helper to construct GET requests for /api/currency
function createCurrencyGetRequest(queryString = '', headers = {}) {
  return new Request(`http://localhost:3000/api/currency${queryString}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...headers,
    },
  });
}

// =========================================================================
// SUITE 1: ADVERSARIAL LEADS API (/api/leads)
// =========================================================================
const leadsSuite = new TestSuite('Tier 5 (Adversarial Challenger): Leads API Stress & Edge Cases');

// ADV-LEADS-1.1: Valid Saudi E.164 phone number
leadsSuite.test('ADV-LEADS-1.1: Accepts valid Saudi E.164 number (+966501234567) with HTTP 200', async () => {
  const req = createLeadPostRequest({
    name: 'سلطان القحطاني',
    phone: '+966501234567',
    channel: 'whatsapp',
    interest: 'شيت التدفقات النقدية والضرائب ZATCA 2026',
  });
  const res = await leadsRoute.POST(req);
  assertEqual(res.status, 200, 'Expected HTTP 200 for valid Saudi E.164');
  const data = await res.json();
  assertEqual(data.success, true);
  assertMatches(data.leadId, /^LEAD-[A-Z0-9]+-\d+$/);
  assert(data.message.includes('بنجاح'));
});

// ADV-LEADS-1.2: Valid Saudi local mobile number (050...)
leadsSuite.test('ADV-LEADS-1.2: Accepts valid Saudi local mobile format (0501234567) with HTTP 200', async () => {
  const req = createLeadPostRequest({
    name: 'عبدالرحمن الدوسري',
    phone: '0501234567',
    channel: 'whatsapp',
    interest: 'طلب ترخيص حزمة العقود التجارية',
  });
  const res = await leadsRoute.POST(req);
  assertEqual(res.status, 200, 'Expected HTTP 200 for valid Saudi local mobile');
  const data = await res.json();
  assertEqual(data.success, true);
  assert(data.leadId && data.leadId.startsWith('LEAD-'));
});

// ADV-LEADS-1.3: Valid Saudi numbers with spacing, brackets, and hyphens
leadsSuite.test('ADV-LEADS-1.3: Sanitizes and accepts formatted Saudi phone "+966 (54) 987-6543"', async () => {
  const req = createLeadPostRequest({
    name: 'ماجد الشمري',
    phone: '+966 (54) 987-6543',
    channel: 'whatsapp',
    interest: 'استشارة تأسيس متجر إلكتروني',
  });
  const res = await leadsRoute.POST(req);
  assertEqual(res.status, 200, 'Expected HTTP 200 after cleaning spaces and punctuation');
  const data = await res.json();
  assertEqual(data.success, true);
});

// ADV-LEADS-1.4: Clean international digits without plus (966501234567)
leadsSuite.test('ADV-LEADS-1.4: Accepts clean international digits without plus prefix (966501234567)', async () => {
  const req = createLeadPostRequest({
    name: 'خالد العنزي',
    phone: '966501234567',
    channel: 'whatsapp',
    interest: 'شيت المحاسبة المالية acc-1',
  });
  const res = await leadsRoute.POST(req);
  assertEqual(res.status, 200, 'Expected HTTP 200 for clean international digits');
  const data = await res.json();
  assertEqual(data.success, true);
});

// ADV-LEADS-2.1: Valid Egyptian local mobile number (010...)
leadsSuite.test('ADV-LEADS-2.1: Accepts valid Egyptian local mobile number (01012345678) with HTTP 200', async () => {
  const req = createLeadPostRequest({
    name: 'م. كريم محمود',
    phone: '01012345678',
    channel: 'whatsapp',
    interest: 'شيت التكاليف الصناعية والتسعير acc-8',
  });
  const res = await leadsRoute.POST(req);
  assertEqual(res.status, 200, 'Expected HTTP 200 for Egyptian 010 mobile');
  const data = await res.json();
  assertEqual(data.success, true);
  assertMatches(data.leadId, /^LEAD-[A-Z0-9]+-\d+$/);
});

// ADV-LEADS-2.2: Valid Egyptian local alternative prefixes (011, 012, 015)
leadsSuite.test('ADV-LEADS-2.2: Accepts all Egyptian telecoms (011..., 012..., 015...) with HTTP 200', async () => {
  const phones = ['01123456789', '01234567890', '01545678901'];
  for (const ph of phones) {
    const req = createLeadPostRequest({
      name: 'عميل مصري',
      phone: ph,
      channel: 'whatsapp',
      interest: 'نموذج دراسة الجدوى acc-6',
    });
    const res = await leadsRoute.POST(req);
    assertEqual(res.status, 200, `Expected HTTP 200 for Egyptian phone ${ph}`);
    const data = await res.json();
    assertEqual(data.success, true);
  }
});

// ADV-LEADS-2.3: Valid Egyptian international E.164 (+201012345678)
leadsSuite.test('ADV-LEADS-2.3: Accepts Egyptian international E.164 (+201012345678) with HTTP 200', async () => {
  const req = createLeadPostRequest({
    name: 'د. طارق المنشاوي',
    phone: '+201012345678',
    channel: 'whatsapp',
    interest: 'عقد اتفاق شراكة وتوزيع أرباح leg-2',
  });
  const res = await leadsRoute.POST(req);
  assertEqual(res.status, 200, 'Expected HTTP 200 for Egyptian international E.164');
  const data = await res.json();
  assertEqual(data.success, true);
});

// ADV-LEADS-3.1: Global E.164 Valid Formats (UAE, US, UK)
leadsSuite.test('ADV-LEADS-3.1: Accepts international GCC & global numbers (+971, +1, +44) with HTTP 200', async () => {
  const globalPhones = ['+971501234567', '+14155552671', '+447911123456'];
  for (const ph of globalPhones) {
    const req = createLeadPostRequest({
      name: 'Global Client',
      phone: ph,
      channel: 'whatsapp',
      interest: 'Enterprise Cross-Border Licensing',
    });
    const res = await leadsRoute.POST(req);
    assertEqual(res.status, 200, `Expected HTTP 200 for international phone ${ph}`);
    const data = await res.json();
    assertEqual(data.success, true);
  }
});

// ADV-LEADS-4.1: Reject purely alphabetic or alphanumeric strings in phone
leadsSuite.test('ADV-LEADS-4.1: Rejects alphabetic and alphanumeric phone strings with HTTP 400', async () => {
  const invalidPhones = [
    'call-me-now',
    'phone_number_here',
    '+96650123456X',
    '0101234567A',
    'TEST12345678',
  ];
  for (const ph of invalidPhones) {
    const req = createLeadPostRequest({
      name: 'Bad Phone User',
      phone: ph,
      channel: 'whatsapp',
    });
    const res = await leadsRoute.POST(req);
    assertEqual(res.status, 400, `Expected HTTP 400 for alphabetic phone "${ph}"`);
    const data = await res.json();
    assertEqual(data.success, false);
    assert(data.error.includes('صيغة رقم الهاتف غير صالحة'));
  }
});

// ADV-LEADS-4.2: Reject phone numbers with invalid length (too short or too long)
leadsSuite.test('ADV-LEADS-4.2: Rejects too short (<7 digits) and too long (>15 digits) phones with HTTP 400', async () => {
  const outOfRangePhones = [
    '+966',               // 3 digits
    '050',                // 3 digits
    '12345',              // 5 digits
    '+96650123456789012345', // 20 digits (> 15 E.164 limit)
  ];
  for (const ph of outOfRangePhones) {
    const req = createLeadPostRequest({
      name: 'Length Test',
      phone: ph,
      channel: 'whatsapp',
    });
    const res = await leadsRoute.POST(req);
    assertEqual(res.status, 400, `Expected HTTP 400 for out-of-range phone "${ph}"`);
    const data = await res.json();
    assertEqual(data.success, false);
  }
});

// ADV-LEADS-4.3: Reject symbols, punctuation only, and malicious characters in phone
leadsSuite.test('ADV-LEADS-4.3: Rejects punctuation-only and malicious scripts in phone with HTTP 400', async () => {
  const malformedPhones = [
    '+++---...',
    '( ) - .',
    '<script>alert(1)</script>',
    "'+OR+1=1--",
    '; DROP TABLE leads;--',
  ];
  for (const ph of malformedPhones) {
    const req = createLeadPostRequest({
      name: 'Punctuation Test',
      phone: ph,
      channel: 'whatsapp',
    });
    const res = await leadsRoute.POST(req);
    assertEqual(res.status, 400, `Expected HTTP 400 for malformed phone "${ph}"`);
    const data = await res.json();
    assertEqual(data.success, false);
  }
});

// ADV-LEADS-5.1: Valid RFC 5322 Emails
leadsSuite.test('ADV-LEADS-5.1: Accepts valid RFC 5322 compliant business & regional emails with HTTP 200', async () => {
  const validEmails = [
    'founder@raseen.sa',
    'procurement@sub.corp.global.com',
    'lead+tag_test-1@domain.co.uk',
    'ahmed.ali_88@egypt-consulting.org',
  ];
  for (const em of validEmails) {
    const req = createLeadPostRequest({
      name: 'Valid Email User',
      email: em,
      channel: 'email',
      interest: 'B2B Enterprise License',
    });
    const res = await leadsRoute.POST(req);
    assertEqual(res.status, 200, `Expected HTTP 200 for email "${em}"`);
    const data = await res.json();
    assertEqual(data.success, true);
    assertMatches(data.leadId, /^LEAD-[A-Z0-9]+-\d+$/);
  }
});

// ADV-LEADS-6.1: Reject malformed emails (RFC 5322 non-compliant)
leadsSuite.test('ADV-LEADS-6.1: Rejects malformed email addresses with HTTP 400', async () => {
  const invalidEmails = [
    'missing-at-sign.com',
    'user@',
    '@missing-user.com',
    'user@localhost',           // Missing valid TLD
    'user name@domain.com',     // Space in local part
    'user@domain .com',         // Space in domain part
    'user@@double-at.com',      // Double @
    'user@.domain.com',         // Leading dot in domain
    'user@domain..com',         // Double dot in domain
  ];
  for (const em of invalidEmails) {
    const req = createLeadPostRequest({
      name: 'Malformed Email User',
      email: em,
      channel: 'email',
    });
    const res = await leadsRoute.POST(req);
    assertEqual(res.status, 400, `Expected HTTP 400 for invalid email "${em}"`);
    const data = await res.json();
    assertEqual(data.success, false);
    assert(data.error.includes('صيغة البريد الإلكتروني غير صالحة'));
  }
});

// ADV-LEADS-7.1: Reject empty bodies and whitespace-only contacts
leadsSuite.test('ADV-LEADS-7.1: Rejects empty object and whitespace-only contact details with HTTP 400', async () => {
  const emptyCases = [
    {},
    { name: 'مجهول' },
    { phone: '', email: '' },
    { phone: '   ', email: '   ' },
    { phone: null, email: null },
  ];
  for (const payload of emptyCases) {
    const req = createLeadPostRequest(payload);
    const res = await leadsRoute.POST(req);
    assertEqual(res.status, 400, 'Expected HTTP 400 when both phone and email are missing/empty');
    const data = await res.json();
    assertEqual(data.success, false);
    assert(data.error.includes('الهاتف') || data.error.includes('البريد'));
  }
});

// ADV-LEADS-7.2: Reject malformed JSON body
leadsSuite.test('ADV-LEADS-7.2: Returns HTTP 400 when request body contains corrupted/invalid JSON', async () => {
  const corruptPayload = '{ "name": "corrupt", phone: not_quoted_string ';
  const req = createLeadPostRequest(corruptPayload);
  const res = await leadsRoute.POST(req);
  assertEqual(res.status, 400, 'Expected HTTP 400 for corrupt JSON payload');
  const data = await res.json();
  assertEqual(data.success, false);
  assert(data.error.includes('بيانات الطلب غير صالحة') || data.error.includes('JSON'));
});

// ADV-LEADS-8.1: Channel consistency enforcement (WhatsApp vs Email)
leadsSuite.test('ADV-LEADS-8.1: Enforces channel-specific required contact methods with HTTP 400', async () => {
  // WhatsApp channel without phone (only email provided) -> MUST fail
  const waWithoutPhoneReq = createLeadPostRequest({
    name: 'واتساب بدون هاتف',
    email: 'valid@company.com',
    channel: 'whatsapp',
  });
  const resWa = await leadsRoute.POST(waWithoutPhoneReq);
  assertEqual(resWa.status, 400, 'WhatsApp channel must reject request without phone');
  const dataWa = await resWa.json();
  assertEqual(dataWa.success, false);
  assert(dataWa.error.includes('الواتساب تتطلب تقديم رقم هاتف'));

  // Email channel without email (only phone provided) -> MUST fail
  const emailWithoutEmailReq = createLeadPostRequest({
    name: 'إيميل بدون بريد',
    phone: '+966501234567',
    channel: 'email',
  });
  const resEm = await leadsRoute.POST(emailWithoutEmailReq);
  assertEqual(resEm.status, 400, 'Email channel must reject request without email');
  const dataEm = await resEm.json();
  assertEqual(dataEm.success, false);
  assert(dataEm.error.includes('البريد الإلكتروني تتطلب'));
});

// ADV-LEADS-8.2: Dual contacts (both valid phone and email) accept on either channel
leadsSuite.test('ADV-LEADS-8.2: Dual contacts (phone + email) succeed on both whatsapp and email channels', async () => {
  const dualPayload = {
    name: 'المؤسس التنفيذي',
    phone: '+966501234567',
    email: 'ceo@raseen-partner.sa',
    interest: 'ترخيص كامل لمنصة رَصين',
  };

  const res1 = await leadsRoute.POST(createLeadPostRequest({ ...dualPayload, channel: 'whatsapp' }));
  assertEqual(res1.status, 200);
  const data1 = await res1.json();
  assertEqual(data1.success, true);

  const res2 = await leadsRoute.POST(createLeadPostRequest({ ...dualPayload, channel: 'email' }));
  assertEqual(res2.status, 200);
  const data2 = await res2.json();
  assertEqual(data2.success, true);
});

// ADV-LEADS-9.1: Ingest XSS, SQLi, and extreme unicode in text fields safely
leadsSuite.test('ADV-LEADS-9.1: Ingests injection attempts and unicode in name, interest, and metadata safely', async () => {
  const injectionPayload = {
    name: "<script>alert('xss_name')</script>",
    phone: '+966501234567',
    email: 'safe@domain.com',
    channel: 'whatsapp',
    interest: "'; DROP TABLE leads; SELECT * FROM users WHERE '1'='1",
    metadata: {
      nestedAttack: '../../../etc/passwd',
      templateInjection: '{{ 7 * 7 }}',
      deepArray: [{ a: 1 }, { b: '<svg onload=alert(1)>' }],
      arabicTashkeel: 'شَرِكَةُ رَصِيــــنٍ لِلْحُلُولِ الإِلِكْتُرُونِيَّةِ',
      emojis: '🏢 🇸🇦 🇪🇬 💰 🚀',
    },
  };

  const res = await leadsRoute.POST(createLeadPostRequest(injectionPayload));
  assertEqual(res.status, 200, 'Expected HTTP 200: safe ingestion without crashing');
  const data = await res.json();
  assertEqual(data.success, true);
  assertMatches(data.leadId, /^LEAD-[A-Z0-9]+-\d+$/);
});

// ADV-LEADS-10.1: Audit Endpoint GET /api/leads
leadsSuite.test('ADV-LEADS-10.1: GET /api/leads audits stored leads and returns correct count', async () => {
  const res = await leadsRoute.GET();
  assertEqual(res.status, 200, 'GET /api/leads must return HTTP 200');
  const data = await res.json();
  assertEqual(data.success, true);
  assertGreaterThanOrEqual(data.count, 5, 'Stored leads count must reflect previous POSTs');
  assert(Array.isArray(data.leads), 'leads must be an array');
  assertGreaterThanOrEqual(data.leads.length, 1);
  const latestLead = data.leads[data.leads.length - 1];
  assert(latestLead.id && latestLead.id.startsWith('LEAD-'));
  assert(latestLead.createdAt);
  assertEqual(latestLead.source, 'RaseenAssistant AI Bot');
});


// =========================================================================
// SUITE 2: ADVERSARIAL CURRENCY ENGINE (/api/currency & src/lib/currency.ts)
// =========================================================================
const currencySuite = new TestSuite('Tier 5 (Adversarial Challenger): Currency Engine & Geolocation');

// ADV-CURR-1.1: GET /api/currency Contract Integrity
currencySuite.test('ADV-CURR-1.1: GET /api/currency returns valid structure with USD base and positive rates', async () => {
  const req = createCurrencyGetRequest();
  const res = await currencyRoute.GET(req);
  assertEqual(res.status, 200, 'Expected HTTP 200 from currency endpoint');

  // Verify Cache-Control header
  const cacheControl = res.headers.get('cache-control');
  assert(cacheControl && cacheControl.includes('public'), 'Cache-Control must declare public caching');
  assert(cacheControl.includes('s-maxage=3600'), 's-maxage must be 1 hour');

  const data = await res.json();
  assertEqual(data.base, 'USD', 'Base currency must be USD');
  assert(typeof data.rates === 'object', 'rates must be object');
  assertEqual(data.rates.USD, 1.0, 'USD rate must be exactly 1.0');

  // Rates sanity
  assertGreaterThan(data.rates.SAR, 3.0, 'SAR rate must be > 3.0');
  assertGreaterThan(data.rates.AED, 3.0, 'AED rate must be > 3.0');
  assertGreaterThan(data.rates.EGP, 30.0, 'EGP rate must be > 30.0');

  // Relative egpRates check (1 EGP = x Currency)
  assert(typeof data.egpRates === 'object', 'egpRates must be object');
  assertEqual(data.egpRates.EGP, 1, '1 EGP = 1 EGP');
  assertGreaterThan(data.egpRates.SAR, 0, 'egpRates.SAR must be > 0');
  assertGreaterThan(data.egpRates.AED, 0, 'egpRates.AED must be > 0');
  assertGreaterThan(data.egpRates.USD, 0, 'egpRates.USD must be > 0');

  // Timestamp and cached fields
  assert(typeof data.timestamp === 'number' && data.timestamp > 0);
  assert(typeof data.cached === 'boolean');
});

// ADV-CURR-2.1: Country Query Override Parameter (?country=...)
currencySuite.test('ADV-CURR-2.1: Country query overrides correctly map SA, EG, AE, US, QA, KW', async () => {
  const countryExpectations = [
    { country: 'SA', expectedCurrency: 'SAR' },
    { country: 'EG', expectedCurrency: 'EGP' },
    { country: 'AE', expectedCurrency: 'AED' },
    { country: 'US', expectedCurrency: 'USD' },
    { country: 'GB', expectedCurrency: 'USD' },
    { country: 'QA', expectedCurrency: 'SAR' }, // GCC mapping
    { country: 'KW', expectedCurrency: 'SAR' }, // GCC mapping
    { country: 'BH', expectedCurrency: 'SAR' }, // GCC mapping
    { country: 'OM', expectedCurrency: 'SAR' }, // GCC mapping
  ];

  for (const item of countryExpectations) {
    const req = createCurrencyGetRequest(`?country=${item.country}`);
    const res = await currencyRoute.GET(req);
    assertEqual(res.status, 200);
    const data = await res.json();
    assertEqual(data.detectedCountry, item.country, `detectedCountry must match "${item.country}"`);
    assertEqual(data.recommendedCurrency, item.expectedCurrency, `recommendedCurrency must be "${item.expectedCurrency}" for ${item.country}`);
  }
});

// ADV-CURR-2.2: Case-insensitivity and fallback on unknown country codes
currencySuite.test('ADV-CURR-2.2: Handles lowercase country (?country=sa) and unknown codes (?country=ZZ)', async () => {
  // Lowercase
  const reqLower = createCurrencyGetRequest('?country=sa');
  const resLower = await currencyRoute.GET(reqLower);
  const dataLower = await resLower.json();
  assertEqual(dataLower.detectedCountry, 'SA');
  assertEqual(dataLower.recommendedCurrency, 'SAR');

  // Egypt lowercase
  const reqEg = createCurrencyGetRequest('?country=eg');
  const resEg = await currencyRoute.GET(reqEg);
  const dataEg = await resEg.json();
  assertEqual(dataEg.detectedCountry, 'EG');
  assertEqual(dataEg.recommendedCurrency, 'EGP');

  // Unknown country fallback
  const reqUnknown = createCurrencyGetRequest('?country=ZZ');
  const resUnknown = await currencyRoute.GET(reqUnknown);
  const dataUnknown = await resUnknown.json();
  assertEqual(dataUnknown.detectedCountry, 'ZZ');
  assertEqual(dataUnknown.recommendedCurrency, 'USD', 'Unknown country code must default to USD');
});

// ADV-CURR-3.1: In-memory Rate Caching Behavior
currencySuite.test('ADV-CURR-3.1: Enforces in-memory rate caching on successive requests within 1-hour TTL', async () => {
  // Request 1
  const req1 = createCurrencyGetRequest('?country=SA');
  const res1 = await currencyRoute.GET(req1);
  const data1 = await res1.json();

  // Request 2 immediately
  const req2 = createCurrencyGetRequest('?country=SA');
  const res2 = await currencyRoute.GET(req2);
  const data2 = await res2.json();

  // Second request MUST be served from memory cache
  assertEqual(data2.cached, true, 'Subsequent request within TTL must return cached: true');
  assertEqual(data2.rates.SAR, data1.rates.SAR, 'Cached SAR rate must remain identical');
  assertEqual(data2.rates.EGP, data1.rates.EGP, 'Cached EGP rate must remain identical');
  assertEqual(data2.rates.USD, data1.rates.USD, 'Cached USD rate must remain identical');
});

// ADV-CURR-4.1: Offline Fallback & Network Fault Injection
currencySuite.test('ADV-CURR-4.1: Seamlessly falls back to static rates when upstream APIs throw network errors', async () => {
  // Temporarily intercept global fetch to simulate complete network blackout
  const originalFetch = global.fetch;
  try {
    global.fetch = async () => {
      throw new Error('ENOTFOUND: Simulated upstream network outage / DNS failure');
    };

    // Call detectUserCurrency directly from lib
    const geo = await currencyLib.detectUserCurrency('185.220.101.5');
    assertEqual(geo.country, 'EG', 'Offline geolocation must safely fallback to EG');
    assertEqual(geo.currency, 'EGP', 'Offline geolocation must safely fallback to EGP');

    // Call currency lib fetchLiveExchangeRates with broken network
    const rates = await currencyLib.fetchLiveExchangeRates();
    assert(rates && typeof rates === 'object');
    assertEqual(rates.EGP, 1, 'Base EGP must be 1');
    assertGreaterThan(rates.SAR, 0, 'Fallback SAR rate must be positive');
  } finally {
    // Restore genuine fetch
    global.fetch = originalFetch;
  }
});

// ADV-CURR-5.1: Mathematical Fidelity of convertPrice
currencySuite.test('ADV-CURR-5.1: convertPrice maintains exact proportional scaling across all currencies', () => {
  const customRates = {
    EGP: 1,
    SAR: 0.08,
    AED: 0.075,
    USD: 0.02,
  };

  assertEqual(currencyLib.convertPrice(500, 'EGP', customRates), 500);
  assertEqual(currencyLib.convertPrice(500, 'SAR', customRates), 40);
  assertEqual(currencyLib.convertPrice(500, 'AED', customRates), 37.5);
  assertEqual(currencyLib.convertPrice(500, 'USD', customRates), 10);

  // Boundary zero
  assertEqual(currencyLib.convertPrice(0, 'SAR', customRates), 0);
  // Large amount (1 million EGP)
  assertEqual(currencyLib.convertPrice(1000000, 'USD', customRates), 20000);
});

// ADV-CURR-5.2: formatPrice Localization, RTL Spacing, and Symbols
currencySuite.test('ADV-CURR-5.2: formatPrice outputs localized strings with proper symbols and rounding', () => {
  // EGP is rounded to integer
  const egp1 = currencyLib.formatPrice(349.85, 'EGP');
  assertEqual(egp1, '350 ج.م');

  // SAR has 2 decimal digits formatted
  const sar1 = currencyLib.formatPrice(100, 'SAR');
  assert(sar1.includes('ر.س'));
  assertMatches(sar1, /^\d+(\.\d{1,2})?\s+ر\.س$/);

  // AED format
  const aed1 = currencyLib.formatPrice(100, 'AED');
  assert(aed1.includes('د.إ'));

  // USD format
  const usd1 = currencyLib.formatPrice(100, 'USD');
  assert(usd1.includes('$'));
});

// ADV-CURR-5.3: Single-Conversion Strict Contract Verification
currencySuite.test('ADV-CURR-5.3: formatPrice guards against double conversion regression', () => {
  const itemPriceEGP = 1000; // 1,000 EGP
  // With default rate ~0.077 SAR per EGP, 1000 EGP = ~77 SAR.
  const formatted = currencyLib.formatPrice(itemPriceEGP, 'SAR');
  
  // It MUST be around 77 SAR
  assert(
    formatted.startsWith('77') || formatted.startsWith('76') || formatted.startsWith('78'),
    `Expected ~77 SAR for 1000 EGP item, got "${formatted}"`
  );

  // If double converted, 77 SAR would be converted again (77 * 0.077 = 5.9 SAR).
  assert(
    !formatted.startsWith('5.') && !formatted.startsWith('6.'),
    'FATAL REGRESSION: Double conversion detected in price formatting pipeline!'
  );
});

// =========================================================================
// RUN ALL SUITES
// =========================================================================
async function runAllChallengerSuites() {
  console.log('\x1b[1m\x1b[33m======================================================================\x1b[0m');
  console.log('\x1b[1m\x1b[33m       ADVERSARIAL CHALLENGER SUITE (MILESTONE M2 EMPIRICAL)         \x1b[0m');
  console.log('\x1b[1m\x1b[33m======================================================================\x1b[0m');
  console.log(`\x1b[90mTarget: /api/leads & /api/currency & src/lib/currency.ts\x1b[0m\n`);

  const r1 = await leadsSuite.run();
  const r2 = await currencySuite.run();

  const total = r1.total + r2.total;
  const passed = r1.passed + r2.passed;
  const failed = r1.failed + r2.failed;

  console.log('\n\x1b[1m\x1b[33m======================================================================\x1b[0m');
  console.log('\x1b[1m\x1b[33m                   CHALLENGER EXECUTION SUMMARY                       \x1b[0m');
  console.log('\x1b[1m\x1b[33m======================================================================\x1b[0m');
  console.log(`  \x1b[1mTotal Tests Executed:\x1b[0m   ${total}`);
  console.log(`  \x1b[1mPassed:\x1b[0m                 \x1b[32m${passed}\x1b[0m`);
  console.log(`  \x1b[1mFailed:\x1b[0m                 ${failed > 0 ? `\x1b[31m${failed}\x1b[0m` : `\x1b[32m0\x1b[0m`}`);

  if (failed > 0) {
    console.log('\n\x1b[31m❌ Adversarial challenge failed! Bugs discovered.\x1b[0m');
    process.exit(1);
  } else {
    console.log('\n\x1b[32m✨ ALL ADVERSARIAL STRESS TESTS PASSED WITH 100% SUCCESS ✨\x1b[0m');
    process.exit(0);
  }
}

if (require.main === module) {
  runAllChallengerSuites().catch((err) => {
    console.error('Fatal error in challenger runner:', err);
    process.exit(1);
  });
}

module.exports = { leadsSuite, currencySuite };
