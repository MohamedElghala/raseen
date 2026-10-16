/**
 * Tier 1: RaseenAssistant AI Conversational Upgrade Tests
 * Authority: Requirement R4, DISPATCH.md, PROJECT.md § Milestone M4
 * Interface: src/app/api/assistant/chat/route.ts, src/components/assistant/RaseenAssistant.tsx
 */

const {
  jiti,
  TestSuite,
  assert,
  assertEqual,
  renderComponent,
} = require('./test_utils');

const chatRoute = jiti('@/app/api/assistant/chat/route.ts');
const { detectIntent, getRecommendedProducts, generateAdvisoryReply } = jiti('@/lib/assistantEngine.ts');
const RaseenAssistantModule = jiti('@/components/assistant/RaseenAssistant.tsx');
const RaseenAssistant = RaseenAssistantModule.default;
const { validatePhone, validateEmail } = RaseenAssistantModule;

const suite = new TestSuite('Tier 1: RaseenAssistant AI Conversational Engine');

function createPostRequest(payload) {
  return new Request('http://localhost:3000/api/assistant/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof payload === 'string' ? payload : JSON.stringify(payload),
  });
}

// Test 1: Intent Classification across 6 categories
suite.test('ASST-1.1: Intent classification accurately resolves all 6 core categories', async () => {
  const testCases = [
    {
      query: 'أحتاج عائلات ريفيت ونماذج BIM معمارية وبلوكات أوتوكاد لمشروع برج سكني',
      expectedIntent: 'engineering_bim',
    },
    {
      query: 'أريد شيت إكسل محاسبي لميزان المراجعة والرواتب والتدفقات النقدية ZATCA',
      expectedIntent: 'financial_accounting',
    },
    {
      query: 'أبحث عن صيغة عقد عمل حر قانوني واتفاقية سرية معلومات NDA للشركات',
      expectedIntent: 'legal_contracts',
    },
    {
      query: 'كيف أستخدم حاسبة نقطة التعادل ومولد فواتير زاتكا في المنصة؟',
      expectedIntent: 'business_tools',
    },
    {
      query: 'كيف أربح 85% كبائع في رَصين وأسحب أرباحي عبر إنستاباي ومدى؟',
      expectedIntent: 'vendor_creator',
    },
    {
      query: 'أهلاً بك، ما هي الخدمات والحلول الرقمية التي توفرها منصة رَصين؟',
      expectedIntent: 'general_support',
    },
  ];

  for (const tc of testCases) {
    const res = await chatRoute.POST(createPostRequest({ message: tc.query }));
    assertEqual(res.status, 200, `Expected HTTP 200 for query: ${tc.query}`);

    const data = await res.json();
    assertEqual(
      data.intent,
      tc.expectedIntent,
      `Query "${tc.query}" must classify as ${tc.expectedIntent}, got ${data.intent}`
    );
    assert(data.reply && data.reply.length > 50, 'Reply must be substantive');
    assert(Array.isArray(data.recommendedProducts), 'recommendedProducts must be an array');
  }
});

// Test 2: Dynamic product recommendations strictly prioritizing free lead magnets
suite.test('ASST-1.2: Dynamic product recommendations strictly prioritize free lead magnets (price === 0)', async () => {
  // 1. Engineering BIM intent -> must prioritize free-p1 and/or free-p2
  const engRes = await chatRoute.POST(
    createPostRequest({ message: 'أريد ملفات BIM ونماذج Revit LOD 300' })
  );
  const engData = await engRes.json();
  assertEqual(engData.intent, 'engineering_bim');
  assert(engData.recommendedProducts.length > 0, 'Must recommend products');
  assertEqual(engData.recommendedProducts[0].price, 0, 'First recommended product must be free (price === 0)');
  assert(
    engData.recommendedProducts.some((p) => p.id === 'free-p1'),
    'Must include free-p1 (Revit Starter)'
  );

  // 2. Financial Accounting intent -> must prioritize free-p4 (Cash flow & budget)
  const accRes = await chatRoute.POST(
    createPostRequest({ message: 'أريد نموذج ميزانية وإدارة سيولة وتدفقات نقدية' })
  );
  const accData = await accRes.json();
  assertEqual(accData.intent, 'financial_accounting');
  assertEqual(accData.recommendedProducts[0].price, 0, 'First recommended accounting product must be free');
  assert(
    accData.recommendedProducts.some((p) => p.id === 'free-p4'),
    'Must include free-p4 (Mini Cash Flow)'
  );

  // 3. Legal Contracts intent -> must prioritize free-p3 (Mini NDA & Freelance)
  const legRes = await chatRoute.POST(
    createPostRequest({ message: 'أحتاج اتفاقية عدم إفصاح وعقد عمل حر' })
  );
  const legData = await legRes.json();
  assertEqual(legData.intent, 'legal_contracts');
  assertEqual(legData.recommendedProducts[0].price, 0, 'First recommended legal product must be free');
  assertEqual(legData.recommendedProducts[0].id, 'free-p3', 'free-p3 must be first for legal inquiries');
});

// Test 3: Articulate Arabic domain guidance responses
suite.test('ASST-1.3: Conversational advisory responses provide articulate Arabic domain guidance', async () => {
  // Test vendor earnings explanation
  const vendorRes = await chatRoute.POST(
    createPostRequest({ message: 'كم عمولة المنصة وكم أرباح البائعين؟' })
  );
  const vendorData = await vendorRes.json();
  assertEqual(vendorData.intent, 'vendor_creator');
  assert(vendorData.reply.includes('85%'), 'Reply must articulate 85% creator profit model');
  assert(vendorData.reply.includes('15%'), 'Reply must mention 15% platform fee');
  assert(
    vendorData.reply.includes('إنستاباي') || vendorData.reply.includes('InstaPay') || vendorData.reply.includes('مدى'),
    'Reply must mention payout channels (InstaPay/Mada)'
  );

  // Test BIM engineering advice
  const bimRes = await chatRoute.POST(
    createPostRequest({ message: 'مكتب هندسي يحتاج مقايسات ومخططات ريفت' })
  );
  const bimData = await bimRes.json();
  assert(bimData.reply.includes('LOD'), 'BIM reply must mention LOD standard');
  assert(bimData.reply.includes('Revit') || bimData.reply.includes('ريفت'), 'BIM reply must mention Revit');
});

// Test 4: Lead Capture Trigger on commercial / consultation requests
suite.test('ASST-1.4: Lead capture triggers dynamically on commercial/consultation queries', async () => {
  // High commercial intent query
  const leadReq = createPostRequest({
    message: 'أريد التواصل مع فريق المبيعات عبر الواتساب للاستشارة حول باقة الشركات',
  });
  const leadRes = await chatRoute.POST(leadReq);
  const leadData = await leadRes.json();
  assertEqual(leadData.triggerLeadCapture, true, 'Consultation query must set triggerLeadCapture to true');
  assert(leadData.reply.includes('تواصلك') || leadData.reply.includes('الواتساب'), 'Reply must acknowledge direct contact');

  // General informational query -> triggerLeadCapture should be false
  const infoReq = createPostRequest({
    message: 'ما هي مواصفات نموذج ريفيت المعماري؟',
  });
  const infoRes = await chatRoute.POST(infoReq);
  const infoData = await infoRes.json();
  assertEqual(infoData.triggerLeadCapture, false, 'Informational query must not trigger forced lead capture');
});

// Test 5: Input validation & error boundaries
suite.test('ASST-1.5: Chat API validates input payloads and returns HTTP 400 on malformed/empty requests', async () => {
  // Empty message
  const emptyRes = await chatRoute.POST(createPostRequest({ message: '' }));
  assertEqual(emptyRes.status, 400, 'Empty message must return HTTP 400');
  const emptyData = await emptyRes.json();
  assert(emptyData.error, 'Error message must be present');

  // Whitespace only
  const wsRes = await chatRoute.POST(createPostRequest({ message: '     ' }));
  assertEqual(wsRes.status, 400, 'Whitespace message must return HTTP 400');

  // Invalid JSON
  const invalidReq = new Request('http://localhost:3000/api/assistant/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"message": not-valid-json',
  });
  const invalidRes = await chatRoute.POST(invalidReq);
  assertEqual(invalidRes.status, 400, 'Malformed JSON must return HTTP 400');

  // GET Route Health Check
  const getRes = await chatRoute.GET();
  assertEqual(getRes.status, 200, 'GET /api/assistant/chat must return HTTP 200');
  const getData = await getRes.json();
  assertEqual(getData.status, 'online');
  assertEqual(getData.intentsSupported.length, 6, 'Must declare all 6 supported intents');
});

// Test 6: RaseenAssistant component rendering & contact validations
suite.test('ASST-1.6: RaseenAssistant component renders trigger, validates contacts, and integrates FreeDownloadModal', () => {
  // Component static rendering test
  const html = renderComponent(RaseenAssistant);
  assert(html.includes('مساعد رَصين الذكي 🟢 متصل'), 'Component must render floating trigger button');
  assert(html.includes('فتح المساعد الذكي'), 'Component must render accessible aria-label');

  // Phone Validation Logic Verification
  // Valid Saudi numbers
  assert(validatePhone('+966501234567'), 'Valid Saudi E.164 phone must pass');
  assert(validatePhone('0501234567'), 'Valid Saudi local phone must pass');
  // Valid Egyptian numbers
  assert(validatePhone('01026046026'), 'Valid Egyptian local phone must pass');
  assert(validatePhone('+201026046026'), 'Valid Egyptian E.164 phone must pass');
  // Invalid phones
  assertEqual(validatePhone('abc1234'), false, 'Alphabetic phone must fail');
  assertEqual(validatePhone('123'), false, 'Too short phone must fail');
  assertEqual(validatePhone(''), false, 'Empty phone must fail');

  // Email Validation Logic Verification
  assert(validateEmail('client@company.com'), 'Standard business email must pass');
  assert(validateEmail('founder.tech@startup.org.sa'), 'Subdomain regional email must pass');
  assertEqual(validateEmail('invalid-email-at'), false, 'Email missing @ must fail');
  assertEqual(validateEmail('user@'), false, 'Email missing domain must fail');
  assertEqual(validateEmail(''), false, 'Empty email must fail');
});

module.exports = suite;
