# سجل الأعطال والحلول — ERRORS_AND_FIXES.md

> سجل تاريخي للعثرات الفعلية التي واجهت منصة **رَصِيـن | RASEEN** وجذورها والحلول النهائية والضوابط الوقائية.

---

### 1. خطأ React Hydration `#418` على الصفحة الرئيسية `/`
- **Issue / Symptom:** ظهور `Minified React error #418` في الكونسول عند تحميل الصفحة الرئيسية بسبب تضمين `InvoiceGenerator` داخل Hero.
- **Root Cause:** استدعاء `.toLocaleString(undefined, ...)` و`.toLocaleString()` يعطي أرقاماً بتنسيق `en-US` داخل Node SSR مقابل تنسيق المتصفح العربي لدى المستخدم.
- **Exact Fix Applied:** تثبيت اللغة في التنسيق العددي إلى `.toLocaleString('en-US', ...)` في [InvoiceGenerator.tsx](file:///D:/Studio_Tools/raseen/src/components/tools/InvoiceGenerator.tsx#L288-L410) و[BreakEvenCalculator.tsx](file:///D:/Studio_Tools/raseen/src/components/tools/BreakEvenCalculator.tsx#L192-L343).
- **Preventive Rule / Anti-Pattern:** يُمنع استخدام `.toLocaleString()` دون تمرير `'en-US'` صراحةً داخل أي مكون React يُصيَّر على الخادم (SSR).

---

### 2. تشوّه ترميز النصوص العربية (Mojibake) وتداخل الطبقات في السلة
- **Issue / Symptom:** ظهور نصوص عربية مرمّزة بشكل خاطئ داخل نافذة السلة قبل التصلب، واحتمال تداخل الـ `z-index` مع عناصر الترويسة.
- **Root Cause:** حفظ نصي بترميز غير متسق مع UTF-8 أو عدم رفع طبقة الدرج فوق شريط التنقل.
- **Exact Fix Applied:** تنظيف النصوص إلى UTF-8 صريح وضبط `z-[80]` على درج السلة في [CartModal.tsx](file:///D:/Studio_Tools/raseen/src/components/storefront/CartModal.tsx#L230-L420).
- **Preventive Rule / Anti-Pattern:** اعتماد ترميز UTF-8 (بدون BOM) والتحقق بالمعاينة الحية عبر لقطة شاشة على الإنتاج.

---

### 3. تسرّب صياغات "معتمد/ذكاء اصطناعي" أو ادعاءات دفع آلي غير مفعل
- **Issue / Symptom:** وجود عبارة `"المؤتمت"` و`"ذكاء اصطناعي"` ورمز `🤖` في الشات بوت، وإشارات غير دقيقة لاعتماد ZATCA أو الدفع التلقائي عبر مدى/فيزا.
- **Root Cause:** نصوص تسويقية مبدئية لم تُراجع بعد توحيد الهوية والوضع التشغيلي الفعلي للدفع.
- **Exact Fix Applied:** تحديث الهوية إلى `"مستشار رَصين"` / `"المساعد الذكي • إدارة وتمكين الأعمال"` وتنظيف النصوص في [RaseenAssistant.tsx](file:///D:/Studio_Tools/raseen/src/components/assistant/RaseenAssistant.tsx)، [blogData.ts](file:///D:/Studio_Tools/raseen/src/lib/blogData.ts#L113-L128)، [communitySeedData.ts](file:///D:/Studio_Tools/raseen/src/lib/communitySeedData.ts#L87)، [QuickStoreWizard.tsx](file:///D:/Studio_Tools/raseen/src/components/vendor/QuickStoreWizard.tsx#L337-L338)، و[Hero.tsx](file:///D:/Studio_Tools/raseen/src/components/storefront/Hero.tsx#L196).
- **Preventive Rule / Anti-Pattern:** مطابقة كل نص واجهة أو مدونة مع ما هو متاح برمجياً وقانونياً في البيئة الإنتاجية، ومنع إعادة تقديم عبارات تسويقية غير مدعومة.

---

### 4. حظر CSP لمسار Google OAuth وتقييد صور SVG في Next/Image
- **Issue / Symptom:** تقييد نموذج تسجيل الدخول عبر Google بسبب غياب `https://accounts.google.com` في `form-action`، وعدم السماح بملفات SVG الآمنة.
- **Root Cause:** سياسة CSP افتراضية صارمة لـ `form-action 'self'` فقط.
- **Exact Fix Applied:** تحديث [next.config.js](file:///D:/Studio_Tools/raseen/next.config.js#L1-L59) لإضافة `https://accounts.google.com` إلى `form-action`، وتفعيل `dangerouslyAllowSVG: true` مع `contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"`.
- **Preventive Rule / Anti-Pattern:** مراجعة ترويسة `CSP` الحية بعد أي تعديل أو إضافة مزود مصادقة خارجي.

---

### 5. اشتراك Supabase المجاني في وضع السكون / غير متاح (`ENOTFOUND tenant/user`)
- **Issue / Symptom:** `/api/health` يعيد `dbStatus: "paused_or_unreachable"` والاتصال المحلي يفشل بالخطأ `FATAL: (ENOTFOUND) tenant/user postgres.llmphkxegxkehnjwsgoi not found`.
- **Root Cause:** توقف أو حذف مشروع Supabase المجاني المرتبط بـ `DATABASE_URL` و`DIRECT_URL`.
- **Exact Fix Applied:** وجود fallback مرن في `/api/products` يحافظ على عمل الكتالوج والتحميل المجاني دون تعطل (500)، مع اختيار الترقية إلى **Neon Postgres (`free_v3`)** عبر Vercel Marketplace (معلّق فقط على موافقة المالك لمرة واحدة على شروط Marketplace عبر `https://vercel.com/mohamed-b1da/~/integrations/accept-terms/neon?source=cli`).
- **Preventive Rule / Anti-Pattern:** تفضيل قواعد البيانات ذات الاستيقاظ الفوري (مثل Neon) وعدم الاعتماد على سقوط قاعدة البيانات كسبب لتوقف الواجهة.

---

### 6. تعطل Git المحلي بخطأ `fatal: bad object HEAD` واستحالة تشغيل `vercel.exe`
- **Issue / Symptom:** أوامر `git status` و`git log` تعيد `fatal: bad object HEAD` عند الكوميت `cdbec93f1ec5efba173061089c8c69c41c49577e`، كما أن استدعاء `vercel.exe` غير معرف في PATH.
- **Root Cause:** تلف/فقدان كائن الكوميت المحلي في `.git/objects`، واعتماد Vercel CLI على `vercel.cmd` داخل كاش npx على القرص `D:`.
- **Exact Fix Applied:** إصلاح مؤشر Git بأمان دون لمس ملفات العمل عبر `git fetch origin main` + `git update-ref refs/heads/main refs/remotes/origin/main` + `git read-tree refs/remotes/origin/main` باستخدام `D:\DevEnvironment\flutter\bin\mingit\cmd\git.exe` (والدفع عبر `-c credential.helper=manager push origin main`)، واستدعاء Vercel CLI عبر `D:\Studio_Tools\npm_cache\_npx\69f9afb961c37556\node_modules\.bin\vercel.cmd`.
- **Preventive Rule / Anti-Pattern:** عدم استخدام `git reset --hard` أبداً عند تلف كائن `HEAD` مع وجود تعديلات غير مرفوعة، وعدم تشغيل `push_to_github_api.js` لعدم استبعاده `.env*` و`.vercel`.

---

### 7. خطأ React Hydration `#418` بعد إضافة منتج إلى السلة (`localStorage`) + تداخل شريط الهاتف (`375px`)
- **Issue / Symptom:** بمجرد حفظ منتج أو عملة أو مفضلة في `localStorage` (`raseen-cart-storage` / `raseen-wishlist-storage`)، يظهر `Minified React error #418` عند إعادة تحميل أي صفحة (`/`, `/product/p1`, `/verify`, `/tools`, `/vendor`)، كما يظهر تداخل بسيط بين كلمة `RASEEN` وقائمة العملة في عرض الموبايل `375px`.
- **Root Cause:** متاجر Zustand في `cartStore.ts` و`wishlistStore.ts` تقرأ حالة `localStorage` على العميل مباشرة بينما SSR يصيّر القيم الافتراضية (`0`, `'EGP'`, `false`) دون انتظار تحقق `mounted` في مكونات الواجهة، فضلاً عن ضيق عرض `375px` مع عرض كلمة `RASEEN` كاملة بجانب الشعار والعملة.
- **Exact Fix Applied:**
  - إضافة بوابة `mounted` (`useEffect(() => setMounted(true), [])`) لحالة `cartCount` و`currency` و`isFav` في [Navbar.tsx](file:///D:/Studio_Tools/raseen/src/components/layout/Navbar.tsx)، و[ProductCard.tsx](file:///D:/Studio_Tools/raseen/src/components/storefront/ProductCard.tsx)، و[BundleDeals.tsx](file:///D:/Studio_Tools/raseen/src/components/storefront/BundleDeals.tsx)، و[ProductDetailClient.tsx](file:///D:/Studio_Tools/raseen/src/components/products/ProductDetailClient.tsx).
  - إخفاء فاصل `| RASEEN` على شاشات `< 640px` (`hidden sm:inline`) وإضافة `priority` لشعار [raseen_monogram.jpg](file:///D:/Studio_Tools/raseen/public/brand/raseen_monogram.jpg) في [Navbar.tsx](file:///D:/Studio_Tools/raseen/src/components/layout/Navbar.tsx).
- **Preventive Rule / Anti-Pattern:** أي مكون Client يقرأ حالة محفوظة في `localStorage` عبر Zustand `persist` يجب أن يحرس القيمة بـ `mounted` قبل أول `useEffect` لتطابق SSR 100%؛ ويجب اختبار التصفح بعد تعديل الحالة (وليس فقط مع سلة فارغة).
