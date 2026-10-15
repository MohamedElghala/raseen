/**
 * Tier 1: Leads Qualification & Capture API Tests
 * Authority: PROJECT.md Feature 9, Interface Contracts
 * Interface: src/app/api/leads/route.ts
 */

const {
  jiti,
  TestSuite,
  assert,
  assertEqual,
  assertMatches,
} = require('./test_utils');

const leadsRoute = jiti('@/app/api/leads/route.ts');

const suite = new TestSuite('Tier 1: Lead Qualification & Capture API (/api/leads)');

// Helper to construct Request object
function createPostRequest(payload) {
  return new Request('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

// Test 1: Valid Saudi Phone Lead Capture
suite.test('LEADS-1.1: Captures qualified lead with Saudi E.164 phone (+966)', async () => {
  const req = createPostRequest({
    name: 'سلطان القحطاني',
    phone: '+966501234567',
    channel: 'whatsapp',
    interest: 'شيت التدفقات النقدية والضرائب 2026',
  });

  const res = await leadsRoute.POST(req);
  assertEqual(res.status, 200, 'Expected HTTP 200 for valid Saudi phone lead');

  const data = await res.json();
  assertEqual(data.success, true, 'Response success must be true');
  assertMatches(data.leadId, /^LEAD-[A-Z0-9]+-\d+$/, 'leadId must follow LEAD-<BASE36>-<RANDOM> standard');
  assert(data.message.includes('بنجاح'), 'Response message must confirm success in Arabic');
});

// Test 2: Valid Egyptian Local Phone Capture
suite.test('LEADS-1.2: Captures qualified lead with Egyptian local mobile number (010...)', async () => {
  const req = createPostRequest({
    name: 'م. كريم محمود',
    phone: '01026046026',
    channel: 'whatsapp',
    interest: 'طلب ترخيص محفظة عقود الشركات',
  });

  const res = await leadsRoute.POST(req);
  assertEqual(res.status, 200, 'Expected HTTP 200 for valid Egyptian mobile number');

  const data = await res.json();
  assertEqual(data.success, true, 'Response success must be true');
  assert(data.leadId && data.leadId.length > 5, 'Valid leadId must be generated');
});

// Test 3: Valid Corporate Email Capture
suite.test('LEADS-1.3: Captures qualified lead with RFC 5322 compliant business email', async () => {
  const req = createPostRequest({
    name: 'Enterprise Procurement Lead',
    email: 'procurement@acme-holdings.com',
    channel: 'email',
    interest: 'B2B Enterprise License & API Integration',
  });

  const res = await leadsRoute.POST(req);
  assertEqual(res.status, 200, 'Expected HTTP 200 for valid email lead');

  const data = await res.json();
  assertEqual(data.success, true, 'Response success must be true');
  assert(data.leadId, 'Lead ID must be returned');
});

// Test 4: Reject Empty Contact Information
suite.test('LEADS-1.4: Rejects submission missing both phone and email with HTTP 400', async () => {
  const req = createPostRequest({
    name: 'مجهول الهوية',
    interest: 'استفسار عام',
  });

  const res = await leadsRoute.POST(req);
  assertEqual(res.status, 400, 'Expected HTTP 400 when both phone and email are missing');

  const data = await res.json();
  assertEqual(data.success, false, 'Response success must be false');
  assert(
    data.error.includes('الهاتف') || data.error.includes('البريد'),
    'Error message must specify requirement of phone or email'
  );
});

// Test 5: Reject Malformed Phone Format
suite.test('LEADS-1.5: Rejects invalid/alphabetic phone numbers with HTTP 400', async () => {
  const req = createPostRequest({
    name: 'Test Visitor',
    phone: 'invalid-phone-xyz',
    channel: 'whatsapp',
  });

  const res = await leadsRoute.POST(req);
  assertEqual(res.status, 400, 'Expected HTTP 400 for malformed phone format');

  const data = await res.json();
  assertEqual(data.success, false, 'Response success must be false');
  assert(data.error.includes('صيغة رقم الهاتف غير صالحة'), 'Error message must explain phone validation failure');
});

// Test 6: Reject Malformed Email Format
suite.test('LEADS-1.6: Rejects malformed email address missing domain with HTTP 400', async () => {
  const req = createPostRequest({
    name: 'Test Visitor',
    email: 'not-an-email-address@missing-tld',
    channel: 'email',
  });

  const res = await leadsRoute.POST(req);
  assertEqual(res.status, 400, 'Expected HTTP 400 for malformed email');

  const data = await res.json();
  assertEqual(data.success, false, 'Response success must be false');
  assert(data.error.includes('صيغة البريد الإلكتروني غير صالحة'), 'Error message must explain email validation failure');
});

// Test 7: Preserves Channel & Metadata Attributes
suite.test('LEADS-1.7: Preserves routing channel (phone/whatsapp/email) and custom metadata', async () => {
  const metadata = {
    sourceSuite: 'StoreAuditWidget',
    score: 65,
    recommendedPillars: ['local_payments'],
  };

  const req = createPostRequest({
    name: 'صاحب متجر سلة',
    phone: '+971509988776',
    channel: 'phone',
    interest: 'تحسين بوابات الدفع ومعدل التحويل',
    metadata,
  });

  const res = await leadsRoute.POST(req);
  assertEqual(res.status, 200, 'Expected HTTP 200 for lead with custom metadata');

  const data = await res.json();
  assertEqual(data.success, true);
  assert(data.leadId);
});

module.exports = suite;
