/**
 * Tier 5: Production Hardening, Vault Delivery, Signed Licenses, Validation & Rate-Limit Suite
 */

const fs = require('fs');
const path = require('path');
const {
  jiti,
  TestSuite,
  assert,
  assertEqual,
  assertGreaterThan,
  renderComponent,
} = require('./test_utils');

const { NextRequest } = jiti('next/server');
const ordersRoute = jiti('@/app/api/orders/route.ts');
const vaultRoute = jiti('@/app/api/vault/[productId]/route.ts');
const downloadRoute = jiti('@/app/api/download/route.ts');
const verifyRoute = jiti('@/app/api/verify/route.ts');
const leadsRoute = jiti('@/app/api/leads/route.ts');
const productsRoute = jiti('@/app/api/products/route.ts');
const chatRoute = jiti('@/app/api/assistant/chat/route.ts');
const registerRoute = jiti('@/app/api/auth/register/route.ts');
const paymobWebhook = jiti('@/app/api/paymob/webhook/route.ts');
const rateLimit = jiti('@/lib/rateLimit.ts');
const { mockProducts } = jiti('@/lib/mockData.ts');
const { EXCHANGE_RATES, convertPrice } = jiti('@/lib/currency.ts');
const { checkPasswordStrength } = jiti('@/lib/passwords.ts');
const { generateProductAssetFile } = jiti('@/lib/assetVaultGenerator.ts');
const ProductCard = jiti('@/components/storefront/ProductCard.tsx').default;
const Footer = jiti('@/components/layout/Footer.tsx').default;

const suite = new TestSuite('Tier 5: Security Hardening, Asset Vault & Signed Licenses');

suite.test('HARD-5.1: /api/orders rejects unknown product IDs and invalid inputs (HTTP 400)', async () => {
  rateLimit.resetRateLimitForTests();

  const reqUnknown = new NextRequest('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '198.51.100.1' },
    body: JSON.stringify({
      buyerContact: 'buyer@company.com',
      items: [{ id: 'non-existent-id-999', quantity: 1 }],
    }),
  });
  const resUnknown = await ordersRoute.POST(reqUnknown);
  assertEqual(resUnknown.status, 400, 'Unknown product ID must be rejected with HTTP 400');

  const reqNoContact = new NextRequest('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '198.51.100.2' },
    body: JSON.stringify({
      items: [{ id: 'free-p1', quantity: 1 }],
    }),
  });
  const resNoContact = await ordersRoute.POST(reqNoContact);
  assertEqual(resNoContact.status, 400, 'Order without contact must be rejected with HTTP 400');
});

suite.test('HARD-5.2: Paid checkout starts pending with ZERO tokens/licenses & PPP currency conversion', async () => {
  rateLimit.resetRateLimitForTests();

  const p1 = mockProducts.find((p) => p.id === 'p1');
  assert(p1 && p1.price > 0, 'Paid product p1 must exist');

  const req = new NextRequest('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '198.51.100.3' },
    body: JSON.stringify({
      buyerContact: '+966501112233',
      paymentMethod: 'instapay',
      currency: 'SAR',
      items: [{ id: 'p1', quantity: 1 }],
    }),
  });

  const res = await ordersRoute.POST(req);
  const data = await res.json();

  assertEqual(res.status, 200, 'Paid pending order creation must return HTTP 200');
  assertEqual(data.status, 'pending', 'Unpaid manual transfer must strictly have status pending');
  assertEqual(data.currency, 'SAR', 'Currency must remain SAR');
  assert(data.totalAmount < data.totalAmountEGP, 'SAR PPP totalAmount must be converted rather than raw EGP');
  assertEqual(Array.isArray(data.tokens) ? data.tokens.length : -1, 0, 'Pending paid order must NOT issue download tokens');
  assertEqual(Array.isArray(data.licenses) ? data.licenses.length : -1, 0, 'Pending paid order must NOT issue signed licenses');
});

suite.test('HARD-5.3: Free $0 order issues completed status, download tokens, and signed HMAC license', async () => {
  rateLimit.resetRateLimitForTests();

  const req = new NextRequest('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '198.51.100.4' },
    body: JSON.stringify({
      buyerContact: 'engineer@raseen.test',
      paymentMethod: 'free',
      currency: 'EGP',
      items: [{ id: 'free-p2', quantity: 1 }],
    }),
  });

  const res = await ordersRoute.POST(req);
  const data = await res.json();

  assertEqual(res.status, 200, 'Free order must return HTTP 200');
  assertEqual(data.status, 'completed', 'Free $0 order must complete immediately');
  assertEqual(data.totalAmountEGP, 0, 'Free order EGP total must be 0');
  assertEqual(data.tokens.length, 1, 'Free order must issue 1 download token');
  assertEqual(data.licenses.length, 1, 'Free order must issue 1 signed license');
  assert(data.tokens[0].downloadUrl.startsWith('/api/vault/free-p2'), 'Token downloadUrl must point to /api/vault');
  assert(data.licenses[0].verificationToken && data.licenses[0].verificationToken.includes('.'), 'Signed license must contain payload.sig');
});

suite.test('HARD-5.4: Real Binary OOXML/ZIP Vault Delivery via /api/vault & access rejection on bad tokens', async () => {
  rateLimit.resetRateLimitForTests();

  // 1. Unauthorized without token -> 401
  const unauthReq = new NextRequest('http://localhost:3000/api/vault/free-p2', {
    headers: { 'x-forwarded-for': '198.51.100.5' },
  });
  const unauthRes = await vaultRoute.GET(unauthReq, { params: Promise.resolve({ productId: 'free-p2' }) });
  assertEqual(unauthRes.status, 401, 'Missing token must return 401');

  // 2. Tampered token -> 403
  const badReq = new NextRequest('http://localhost:3000/api/vault/free-p2?token=tampered.signature', {
    headers: { 'x-forwarded-for': '198.51.100.6' },
  });
  const badRes = await vaultRoute.GET(badReq, { params: Promise.resolve({ productId: 'free-p2' }) });
  assertEqual(badRes.status, 403, 'Tampered token must return 403');

  // 3. Real token via /api/orders -> download real binary .xlsx (PKZIP magic bytes 0x50 0x4B 0x03 0x04)
  const orderReq = new NextRequest('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '198.51.100.7' },
    body: JSON.stringify({
      buyerContact: 'vault.tester@raseen.test',
      items: [{ id: 'free-p2', quantity: 1 }],
    }),
  });
  const orderData = await (await ordersRoute.POST(orderReq)).json();
  const token = orderData.tokens[0].token;

  const vaultReq = new NextRequest(
    `http://localhost:3000/api/vault/free-p2?token=${encodeURIComponent(token)}`,
    { headers: { 'x-forwarded-for': '198.51.100.8' } }
  );
  const vaultRes = await vaultRoute.GET(vaultReq, { params: Promise.resolve({ productId: 'free-p2' }) });
  assertEqual(vaultRes.status, 200, 'Authorized vault fetch must return HTTP 200');
  const disp = vaultRes.headers.get('content-disposition') || '';
  assert(disp.includes('attachment') && disp.includes('.xlsx'), 'Content-Disposition must serve .xlsx attachment');

  const bytes = new Uint8Array(await vaultRes.arrayBuffer());
  assertGreaterThan(bytes.length, 500, 'Real generated XLSX binary must be > 500 bytes');
  assertEqual(bytes[0], 0x50, 'First byte must be P (PKZIP header)');
  assertEqual(bytes[1], 0x4b, 'Second byte must be K (PKZIP header)');
  assertEqual(bytes[2], 0x03, 'Third byte must be 0x03');
  assertEqual(bytes[3], 0x04, 'Fourth byte must be 0x04');

  // Cross-product token reuse must be blocked (token for free-p2 used on p1)
  const crossReq = new NextRequest(
    `http://localhost:3000/api/vault/p1?token=${encodeURIComponent(token)}`,
    { headers: { 'x-forwarded-for': '198.51.100.9' } }
  );
  const crossRes = await vaultRoute.GET(crossReq, { params: Promise.resolve({ productId: 'p1' }) });
  assertEqual(crossRes.status, 403, 'Cross-product token reuse must be blocked with 403');
});

suite.test('HARD-5.5: Asset generator creates valid binary DOCX, CAD ZIP, Canva ZIP, and AI Bundle ZIP', () => {
  const docx = generateProductAssetFile('free-p3', 'legal.tester@raseen.test');
  const cad = generateProductAssetFile('free-p1', 'arch@raseen.test');
  const canva = generateProductAssetFile('p45', 'brand@raseen.test');
  const aiBundle = generateProductAssetFile('p50', 'growth@raseen.test');

  for (const [label, file, ext] of [
    ['DOCX', docx, '.docx'],
    ['CAD ZIP', cad, '.zip'],
    ['Canva ZIP', canva, '.zip'],
    ['AI Bundle ZIP', aiBundle, '.zip'],
  ]) {
    assert(file && file.buffer.length > 400, `${label} must generate non-empty buffer`);
    assert(file.filename.endsWith(ext), `${label} filename must end with ${ext}`);
    assertEqual(file.buffer[0], 0x50, `${label} must start with PK magic byte`);
    assertEqual(file.buffer[1], 0x4b, `${label} second byte must be K`);
  }
});

suite.test('HARD-5.6: /api/download issues single-use ticket and blocks ticket replay', async () => {
  rateLimit.resetRateLimitForTests();

  const orderReq = new NextRequest('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '198.51.100.10' },
    body: JSON.stringify({
      buyerContact: 'ticket@raseen.test',
      items: [{ id: 'free-p4', quantity: 1 }],
    }),
  });
  const orderData = await (await ordersRoute.POST(orderReq)).json();
  const token = orderData.tokens[0].token;

  const dlReq = new NextRequest(`http://localhost:3000/api/download?token=${encodeURIComponent(token)}`, {
    headers: { 'x-forwarded-for': '198.51.100.11' },
  });
  const dlRes = await downloadRoute.GET(dlReq);
  const dlData = await dlRes.json();

  assertEqual(dlRes.status, 200, 'Download verification must return HTTP 200');
  assert(dlData.directDownloadUrl && dlData.directDownloadUrl.includes('ticket='), 'Download endpoint must return single-use ticket URL');

  const ticketUrl = `http://localhost:3000${dlData.directDownloadUrl}`;
  const firstFetch = await vaultRoute.GET(
    new NextRequest(ticketUrl, { headers: { 'x-forwarded-for': '198.51.100.12' } }),
    { params: Promise.resolve({ productId: 'free-p4' }) }
  );
  assertEqual(firstFetch.status, 200, 'First consumption of single-use ticket must succeed');

  const replayFetch = await vaultRoute.GET(
    new NextRequest(ticketUrl, { headers: { 'x-forwarded-for': '198.51.100.13' } }),
    { params: Promise.resolve({ productId: 'free-p4' }) }
  );
  assertEqual(replayFetch.status, 403, 'Replaying consumed ticket must be rejected with HTTP 403');
});

suite.test('HARD-5.7: /api/verify validates HMAC licenses and rejects tampered or forged tokens', async () => {
  rateLimit.resetRateLimitForTests();

  const orderReq = new NextRequest('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '198.51.100.14' },
    body: JSON.stringify({
      buyerContact: 'licensor@raseen.test',
      items: [{ id: 'free-p1', quantity: 1 }],
    }),
  });
  const orderData = await (await ordersRoute.POST(orderReq)).json();
  const verificationToken = orderData.licenses[0].verificationToken;

  // 1. Valid POST verification
  const validRes = await verifyRoute.POST(
    new NextRequest('http://localhost:3000/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '198.51.100.15' },
      body: JSON.stringify({ token: verificationToken }),
    })
  );
  const validData = await validRes.json();
  assertEqual(validRes.status, 200, 'Valid HMAC license must verify HTTP 200');
  assertEqual(validData.valid, true, 'Verified response valid flag must be true');
  assertEqual(validData.license.assetId, 'free-p1', 'License payload must retain assetId');

  // 2. Tamper signature
  const [b64, sig] = verificationToken.split('.');
  const flippedChar = sig[0] === 'A' ? 'B' : 'A';
  const tamperedToken = `${b64}.${flippedChar}${sig.slice(1)}`;
  const tamperedRes = await verifyRoute.POST(
    new NextRequest('http://localhost:3000/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '198.51.100.16' },
      body: JSON.stringify({ token: tamperedToken }),
    })
  );
  const tamperedData = await tamperedRes.json();
  assertEqual(tamperedRes.status, 404, 'Tampered license must be rejected');
  assertEqual(tamperedData.valid, false, 'Tampered license valid flag must be false');
});

suite.test('HARD-5.8: Paymob webhook fails closed when unconfigured (503) & IP rate limiter enforces 429', async () => {
  rateLimit.resetRateLimitForTests();

  const prevSecret = process.env.PAYMOB_HMAC_SECRET;
  delete process.env.PAYMOB_HMAC_SECRET;
  const whRes = await paymobWebhook.POST(
    new NextRequest('http://localhost:3000/api/paymob/webhook', {
      method: 'POST',
      body: JSON.stringify({ obj: { success: true } }),
    })
  );
  if (prevSecret) process.env.PAYMOB_HMAC_SECRET = prevSecret;
  assertEqual(whRes.status, 503, 'Paymob webhook without secret must fail closed with HTTP 503');

  // Burst 42 requests from same test IP against /api/verify (limit = 40/min)
  let saw429 = false;
  for (let i = 0; i < 42; i++) {
    const res = await verifyRoute.GET(
      new NextRequest('http://localhost:3000/api/verify?token=invalid.token', {
        headers: { 'x-forwarded-for': '198.51.100.99' },
      })
    );
    if (res.status === 429) {
      saw429 = true;
      break;
    }
  }
  rateLimit.resetRateLimitForTests();
  assert(saw429, 'Sliding-window IP rate limiter must return HTTP 429 on burst traffic');
});

suite.test('HARD-5.9: /api/products exposes x-data-source header, featured filter, and clean static catalog', async () => {
  const req = new NextRequest('http://localhost:3000/api/products?featured=true', {
    headers: { 'x-forwarded-for': '198.51.100.20' },
  });
  const res = await productsRoute.GET(req);
  const data = await res.json();

  assertEqual(res.status, 200, '/api/products must return HTTP 200');
  const ds = res.headers.get('x-data-source');
  assert(ds === 'database' || ds === 'resilient-fallback', 'x-data-source header must indicate source');
  assertGreaterThan(data.products.length, 0, 'featured=true must return featured products');
  assert(data.products.every((p) => Boolean(p.featured)), 'All returned items must have featured === true');

  // Catalog structural integrity
  assertEqual(mockProducts.length, 54, 'Catalog must contain all 54 verified assets');
  for (const p of mockProducts) {
    assert(p.imageUrl && p.imageUrl.startsWith('https://'), `Product ${p.id} must have HTTPS imageUrl`);
    assert(p.createdAt === '2026-03-01T00:00:00.000Z', `Product ${p.id} must use static createdAt to avoid SSR/CSR hydration mismatch`);
  }

  // Paid product lead capture must NOT unlock free vault downloads
  const paidLeadRes = await leadsRoute.POST(
    new NextRequest('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '198.51.100.21' },
      body: JSON.stringify({
        name: 'Paid Lead',
        email: 'paid@raseen.test',
        metadata: { productId: 'p1', source: 'free_preview' },
      }),
    })
  );
  const paidLeadData = await paidLeadRes.json();
  assert(!paidLeadData.downloadUrl && !paidLeadData.downloadToken, 'Paid product lead request must NOT receive direct vault downloadUrl');
});

suite.test('HARD-5.10: /api/orders currency totalAmount matches UI EXCHANGE_RATES (zero PPP overcharge mismatch)', async () => {
  rateLimit.resetRateLimitForTests();

  const p1 = mockProducts.find((p) => p.id === 'p1');
  assert(p1 && p1.price === 250, 'p1 base price must be 250 EGP');

  for (const curr of ['SAR', 'AED', 'USD']) {
    const req = new NextRequest('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `198.51.100.3${curr.length}` },
      body: JSON.stringify({
        buyerContact: 'buyer@raseen.test',
        paymentMethod: 'instapay',
        currency: curr,
        items: [{ id: 'p1', quantity: 2 }],
      }),
    });
    const res = await ordersRoute.POST(req);
    const data = await res.json();
    assertEqual(res.status, 200, `/api/orders must accept currency ${curr}`);
    const expectedTotal = convertPrice(p1.price * 2, curr, EXCHANGE_RATES);
    assertEqual(
      data.totalAmount,
      expectedTotal,
      `Order total for ${curr} (${data.totalAmount}) must match UI EXCHANGE_RATES (${expectedTotal})`
    );
  }
});

suite.test('HARD-5.11: /api/assistant/chat enforces Zod schema bounds (400) & IP rate limit (429)', async () => {
  rateLimit.resetRateLimitForTests();

  const tooLongRes = await chatRoute.POST(
    new Request('http://localhost:3000/api/assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '198.51.100.40' },
      body: JSON.stringify({ message: 'أ'.repeat(1505) }),
    })
  );
  assertEqual(tooLongRes.status, 400, 'Over-length message (>1500 chars) must fail AssistantChatSchema with HTTP 400');

  let saw429 = false;
  for (let i = 0; i < 30; i++) {
    const res = await chatRoute.POST(
      new Request('http://localhost:3000/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '198.51.100.41' },
        body: JSON.stringify({ message: 'أهلا بك' }),
      })
    );
    if (res.status === 429) {
      saw429 = true;
      break;
    }
  }
  rateLimit.resetRateLimitForTests();
  assert(saw429, '/api/assistant/chat must enforce sliding-window rate limit (HTTP 429)');
});

suite.test('HARD-5.12: Strong 10-char password policy & /api/auth/register DB 503 handling', async () => {
  rateLimit.resetRateLimitForTests();

  const weakPasswords = ['123456', 'abcdefg1', 'Short1!', 'lowercase123!', 'UPPERCASE123!', 'NoSpecial123'];
  for (const pwd of weakPasswords) {
    assertEqual(checkPasswordStrength(pwd).isValid, false, `Weak password "${pwd}" must fail checkPasswordStrength`);
    const regRes = await registerRoute.POST(
      new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '198.51.100.50' },
        body: JSON.stringify({
          name: 'مستخدم تجريبي',
          email: 'weak-test@raseen.test',
          password: pwd,
          role: 'buyer',
        }),
      })
    );
    assertEqual(regRes.status, 400, `Register API must reject weak password "${pwd}" with HTTP 400`);
  }

  const strongPwd = 'Raseen#2026Pass';
  assertEqual(checkPasswordStrength(strongPwd).isValid, true, '15-char mixed-case+digit+symbol password must pass');

  const validRegRes = await registerRoute.POST(
    new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '198.51.100.51' },
      body: JSON.stringify({
        name: 'سارة المحاسبة',
        email: `test-${Date.now()}@raseen.test`,
        password: strongPwd,
        role: 'buyer',
      }),
    })
  );
  // In offline/paused DB environments, DB error must surface cleanly as HTTP 503 (never 500 or false duplicate 400)
  assert(
    validRegRes.status === 503 || validRegRes.status === 201,
    `Valid registration must return 201 (live DB) or 503 (DB unavailable), got ${validRegRes.status}`
  );
});

suite.test('HARD-5.13: ProductCard valid HTML (no <button> inside <Link>), zero fake sales/ratings, & JSON-LD honesty', () => {
  const p1 = mockProducts.find((p) => p.id === 'p1');
  const html = renderComponent(ProductCard, { product: p1 });

  // Verify no <button> tag appears nested inside any <a ...>...</a>
  const anchorMatches = html.match(/<a\b[\s\S]*?<\/a>/g) || [];
  assertGreaterThan(anchorMatches.length, 0, 'ProductCard must contain navigation links');
  for (const anchor of anchorMatches) {
    assert(!/<button\b/i.test(anchor), 'ProductCard must NOT nest <button> inside <Link>/<a>');
  }

  assert(!html.includes('مبيعة'), 'ProductCard must not display fabricated salesCount');
  assert(!html.includes('⭐'), 'ProductCard must not display fabricated rating stars');

  const productPageSrc = fs.readFileSync(
    path.join(process.cwd(), 'src/app/product/[id]/page.tsx'),
    'utf8'
  );
  assert(!productPageSrc.includes('aggregateRating'), 'Product schema must omit fabricated aggregateRating');
});

suite.test('HARD-5.14: Footer includes Canva category link & HomeClient syncs reactive URL ?filter', () => {
  const footerHtml = renderComponent(Footer);
  assert(footerHtml.includes('/?filter=canva'), 'Footer must expose Canva category filter link');

  const homeClientSrc = fs.readFileSync(
    path.join(process.cwd(), 'src/components/storefront/HomeClient.tsx'),
    'utf8'
  );
  assert(homeClientSrc.includes('useSearchParams'), 'HomeClient must use reactive useSearchParams for footer links');
  assert(homeClientSrc.includes("selectedFileType === 'design-studio'"), 'HomeClient must filter both Canva and PowerPoint under design-studio pillar');
});

module.exports = suite;
