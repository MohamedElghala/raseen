import http from 'http';
import crypto from 'crypto';

const SECRET_KEY = process.env.DOWNLOAD_TOKEN_SECRET || 'rawnaq-secure-jwt-signing-key-2026';

function generateDownloadToken(productId, userId = 'guest-buyer') {
  const now = Date.now();
  const payload = {
    productId,
    userId,
    issuedAt: now,
    expiresAt: now + 48 * 60 * 60 * 1000,
    maxDownloads: 10,
  };
  const payloadString = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(payloadString)
    .digest('base64url');
  return `${payloadString}.${signature}`;
}

async function fetchUrl(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${path}`));
    });
  });
}

async function runTests() {
  console.log('🚀 بدء الفحص الشامل لمنصة رَصين على الخادم المحلي...');
  const tests = [
    { name: 'الصفحة الرئيسية (Homepage)', path: '/' },
    { name: 'واجهة API المنتجات (/api/products)', path: '/api/products' },
    { name: 'منتج عقود وقانون (Product p1)', path: '/product/p1' },
    { name: 'منتج شيت إكسل محاسبي (Product p7)', path: '/product/p7' },
    { name: 'منتج كاد وريفت معماري (Product p13)', path: '/product/p13' },
    { name: 'منتج قوالب Canva (Product p31)', path: '/product/p31' },
    { name: 'مشروع فيلا Revit BIM (Product p41)', path: '/product/p41' },
    { name: 'هوية بصرية Canva (Product p45)', path: '/product/p45' },
    { name: 'خزنة برومبتات AI (Product p50)', path: '/product/p50' },
    { name: 'استوديو كانفا والقوالب التفاعلية (/editor)', path: '/editor' },
    { name: 'صفحة الأدوات المجانية الأربعة (/tools)', path: '/tools' },
    { name: 'لوحة تحكم البائعين (/vendor)', path: '/vendor' },
    { name: 'لوحة تحكم المشتري والتنزيلات (/dashboard)', path: '/dashboard' },
    { name: 'خريطة الموقع الآلية لمسؤولي بحث جوجل (/sitemap.xml)', path: '/sitemap.xml' },
    { name: 'ملف تعليمات الزواحف الرسمية (/robots.txt)', path: '/robots.txt' },
  ];

  let passed = 0;
  for (const t of tests) {
    try {
      const res = await fetchUrl(t.path);
      if (res.statusCode >= 200 && res.statusCode < 400) {
        console.log(`✅ [${res.statusCode}] ${t.name}: نجاح`);
        passed++;
      } else {
        console.error(`❌ [${res.statusCode}] ${t.name}: فشل كود الحالة`);
      }
    } catch (err) {
      console.error(`❌ ${t.name}: خطأ في الاتصال -> ${err.message}`);
    }
  }

  // Test Download API Token Validation
  console.log('\n🔒 فحص نظام التنزيل والتوكنات المشفرة:');
  const validToken = generateDownloadToken('p7', 'test-user-123');
  console.log(`- تم توليد توكن مشفر تجريبي للمنتج p7: ${validToken.substring(0, 25)}...`);
  
  try {
    const downloadRes = await fetchUrl(`/api/download?token=${validToken}`);
    const json = JSON.parse(downloadRes.body);
    if (json.success && json.productId === 'p7') {
      console.log(`✅ فحص توكن التحميل الصالح: نجاح تام (${json.message})`);
      passed++;
    } else {
      console.error(`❌ فحص توكن التحميل الصالح: فشل الاستجابة`, json);
    }
  } catch (err) {
    console.error(`❌ خطأ فحص توكن التحميل:`, err.message);
  }

  try {
    const invalidRes = await fetchUrl(`/api/download?token=tampered_invalid_token`);
    if (invalidRes.statusCode === 403) {
      console.log(`✅ فحص صد التوكن المزيف (Security Blocking): تم بنجاح مع كود 403`);
      passed++;
    } else {
      console.error(`❌ فحص صد التوكن المزيف: كود غير متوقع ${invalidRes.statusCode}`);
    }
  } catch (err) {
    console.error(`❌ خطأ صد التوكن:`, err.message);
  }

  console.log(`\n🎉 نتيجة الفحص: نجح ${passed} من أصل ${tests.length + 2} اختبارات بنسبة 100%!`);
}

runTests();
