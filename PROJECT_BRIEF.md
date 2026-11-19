# PROJECT BRIEF — رَصِيـن | RASEEN

> **آخر تحديث:** 2026-11-19 | **الحالة:** جاهز على الإنتاج الحي مع حزمة أمان واختبارات E2E متكاملة (79/79)

---

## 1. الهوية والرسالة (Core Identity & Mission)
- **الاسم الرسمي:** **رَصِيـن | RASEEN**
- **الرسالة:** سوق عربي متخصص للأصول الرقمية والقوالب الاحترافية والموارد الهندسية والمحاسبية والقانونية (`B2B / B2C`) مع أدوات أعمال مجانية (حاسبة نقطة التعادل، مولد الفواتير الضريبية ZATCA، محوّل المستندات) و**"مستشار رَصين" (المساعد الذكي • إدارة وتمكين الأعمال)**.
- **مسار المشروع المحلي:** `D:\Studio_Tools\raseen`

---

## 2. المكدس التقني المعتمد (Active Tech Stack)
- **الواجهة الأمامية والخلفية:** Next.js `15.5.26` (App Router) + React `19.1.0` + TypeScript `5.8.0` + Tailwind CSS `3.4.17` + Zustand `5.0.0`.
- **قاعدة البيانات والمصادقة:** Prisma `6.6.0` (PostgreSQL عبر Neon/Supabase مع Resilient Catalog Fallback في `src/app/api/products/route.ts`) + NextAuth v4 (Google OAuth + Credentials مع `crypto.scrypt` و`timingSafeEqual`).
- **الخزنة والتوقيع التشفيري:**
  - توليد ديناميكي للملفات في الذاكرة (`/api/vault/[productId]` و`src/lib/assetVaultGenerator.ts`) لصيغ `.xlsx`, `.docx`, `.zip` (`.dxf`/`.html`/`.md`) بدون استهلاك مساحة Supabase Storage (`$0 egress`).
  - دعم اختياري للتخزين الثابت عبر Cloudflare R2 (`src/lib/r2Signer.ts`).
  - توقيع التراخيص بـ HMAC-SHA256 عبر `LICENSE_SIGNING_SECRET` (`src/lib/licenseServer.ts`) وتذاكر تنزيل لمرة واحدة عبر `DOWNLOAD_TOKEN_SECRET` (`src/lib/storage.ts`).

---

## 3. الروابط والمعرّفات الحية (Live URLs & Infrastructure)
- **رابط الإنتاج الحي:** `https://raseen-nine.vercel.app`
- **مشروع Vercel:** `mohamed-b1da/raseen` (`prj_rNdCNbglHdEV3Kcjjwo4N6IjlSdQ` — المنطقة `iad1`)
- **مستودع GitHub:** `https://github.com/MohamedElghala/raseen.git` (الفرع `main`)
- **بريد الدعم والتواصل:** وفق إعدادات المتغيرات الإنتاجية على Vercel (`NEXTAUTH_URL=https://raseen-nine.vercel.app`).

---

## 4. الإنجازات الأخيرة (Recent Progress / Accomplishments)
- إعادة تصميم وتسمية المساعد إلى **"مستشار رَصين"** (`المساعد الذكي • إدارة وتمكين الأعمال`) وإزالة أي عبارات آلية أو ادعاءات غير موثقة في `RaseenAssistant.tsx` و`blogData.ts` و`communitySeedData.ts` و`QuickStoreWizard.tsx` و`Hero.tsx`.
- معالجة أخطاء React Hydration (`#418`) على الصفحة الرئيسية (بتثبيت التنسيق العددي `en-US` في `InvoiceGenerator.tsx` و`BreakEvenCalculator.tsx`) وعبر جميع الصفحات عند وجود سلة/عملة/مفضلة محفوظة في `localStorage` (بتمرير بوابة `mounted` في `Navbar.tsx` و`ProductCard.tsx` و`BundleDeals.tsx` و`ProductDetailClient.tsx`)، وتحسين ترويسة الموبايل `375px`.
- ضبط سياسة أمان المحتوى `CSP` في `next.config.js` للسماح بـ Google OAuth `form-action` وحماية SVG (`sandbox`)، وتوحيد رسالة كلمة المرور (10 أحرف+) في `register/route.ts`.
- ضبط SEO (`layout.tsx`, `sitemap.ts`, `robots.ts`)، وإعداد ESLint + CI، وفصل `DOWNLOAD_TOKEN_SECRET` و`LICENSE_SIGNING_SECRET` كـ Secrets مستقلة في Vercel Production.
- إصلاح مؤشر Git المحلي غير المتلف ومزامنة المستودع على GitHub مع فحص التسريبات الأمنية (`security_scanner.py`: 0 تسريبات).

---

## 5. الوضع الحالي والخطوات القادمة (Current Status & Next Steps)
- **الوضع الحالي:** الكود والتطبيق على الإنتاج الحي مجتاز لاختبارات النوعية والـ Lint والـ E2E (`79/79`) وفحوص المتصفح والـ APIs الحية. قاعدة بيانات Supabase القديمة (`llmphkxegxkehnjwsgoi`) ما زالت في حالة `paused_or_unreachable`.
- **الخطوة التالية الوحيدة لتفعيل قاعدة بيانات Neon Postgres المجانية:**
  1. موافقة المالك في المتصفح لمرة واحدة على شروط Vercel Marketplace لـ Neon عبر الرابط: `https://vercel.com/mohamed-b1da/~/integrations/accept-terms/neon?source=cli`
  2. تشغيل `vercel integration add neon --plan free_v3 -m region=iad1`، مزامنة `DIRECT_URL = DATABASE_URL_UNPOOLED`، ثم تشغيل `npx prisma db push` و`node prisma/seed.js` وإعادة النشر لتصبح حالة `/api/health` هي `connected`.
- **مؤجل بناءً على قرار المستخدم:** ربط الدومين `raseen.me` من Squarespace DNS إلى Vercel (`A` / `CNAME` مع حفظ سجل Google Search Console `TXT`) وتفعيل المفاتيح الاختيارية (`GEMINI_API_KEY`, `PAYMOB_*`, `R2_*`).
