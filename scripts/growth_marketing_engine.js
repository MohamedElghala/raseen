/**
 * Raseen Platform Autonomous Growth & Content Marketing Automation Engine
 * Generates viral Arabic marketing campaigns, video scripts, social threads, and SEO broadcasts.
 * Executable standalone or via GitHub Actions scheduled workflow.
 */

const fs = require('fs');
const path = require('path');

const CAMPAIGNS = [
  {
    id: 'campaign-zatca-invoice',
    theme: 'مولد الفواتير الضريبية المعتمدة لـ ZATCA مجاناً',
    targetAudience: 'الشركات، المحاسبين، رواد الأعمال في السعودية ومصر',
    freeLeadMagnet: 'مولد الفواتير الإلكترونية ZATCA QR وطباعة A4 PDF الفورية',
    url: 'https://raseen-nine.vercel.app',
    hook: 'ليه تدفع آلاف الريالات في برامج فوترة معقدة وأنت تقدر تولد فواتيرك الضريبية بباركود ZATCA المعتمد في 10 ثوانٍ مجاناً؟',
    videoScript: {
      hook_0_5s: 'وقف تضيع فلوسك على اشتراكات برامج الفواتير! 🛑',
      problem_5_20s: 'لو عندك متجر أو شركة صغيرة، هيئة الزكاة والضريبة بتطلب فواتير إلكترونية مبسطة بـ QR Code مشفر بنظام TLV Base64، وأغلب البرامج بتطلب اشتراك شهري غالي.',
      solution_20_45s: 'منصة رَصين وفرتلك مولد الفواتير الضريبية مجاناً بالكامل. بتدخل بياناتك، ونسب الضريبة (15% أو 14%)، وبيولدلك باركود QR حقيقي متوافق مع تطبيق زاتكا، وتطبع فاتورة A4 أنيقة فورا.',
      cta_45_60s: 'ادخل على raseen.me وجربها الآن بدون تسجيل وبدون أي رسوم! الرابط في البايو.',
    },
    socialPosts: {
      twitter: `هل شركتك أو متجرك محتاج فواتير ضريبية فورية متوافقة مع هيئة الزكاة (ZATCA)؟ 📄🇸🇦

بدون اشتراكات وبدون تعقيد:
✅ تشفير TLV Base64 القياسي لرمز QR
✅ دعم ضريبة 15% و 14% والخصومات
✅ طباعة A4 PDF جاهزة للتسليم
✅ مجاناً 100%

جربها الآن: https://raseen-nine.vercel.app

#ريادة_أعمال #تجارة_إلكترونية #زاتكا #محاسبة #رصين`,
      linkedin: `لأصحاب الشركات الناشئة ورواد الأعمال في الخليج ومصر:

الامتثال لمتطلبات الفوترة الإلكترونية وهيئة الزكاة والضريبة (ZATCA Phase 1 & 2) أصبح أمراً جوهرياً لكل نشاط تجاري.

في منصة رَصين (RASEEN)، أطلقنا أداة "مولد الفواتير وعروض الأسعار الضريبية" بشكل مجاني تماماً، لتمكين أصحاب الأعمال من إصدار فواتير قانونية تتضمن باركود QR مشفر وتصدير عالي الدقة مقاس A4، مع تبديل العملات (SAR, EGP, AED, USD).

جرب الأداة مباشرة من متصفحك: https://raseen-nine.vercel.app

#إدارة_الأعمال #الفوترة_الإلكترونية #سلاسل_الإمداد #رصين #FinTech`,
      whatsappStatus: `📄 محتاج فاتورة ضريبية رسمية بباركود ZATCA في ثوانٍ ومجاناً مقاس A4؟ 
ادخل على منصة رَصين وجربها فوراً:
https://raseen-nine.vercel.app`,
    },
  },
  {
    id: 'campaign-breakeven-calculator',
    theme: 'حاسبة نقطة التعادل وهوامش الأرباح للمشاريع والمتاجر',
    targetAudience: 'أصحاب المتاجر الإلكترونية، المطاعم، الشركات الناشئة',
    freeLeadMagnet: 'حاسبة التعادل، هامش المساهمة، ومعدل المبيعات اليومي',
    url: 'https://raseen-nine.vercel.app',
    hook: 'عارف متجرك محتاج يبيع كام قطعة في اليوم عشان يغطي مصاريفه ويبدأ يكسب صافي أرباح؟',
    videoScript: {
      hook_0_5s: 'أكبر سبب لفشل 70% من المتاجر الجديدة هو عدم معرفة نقطة التعادل! 📉',
      problem_5_20s: 'كتير بيبيع ومبسوط بحجم المبيعات، بس في آخر الشهر يكتشف إنه خسران! ليه؟ لأنه مش حاسب التكاليف الثابتة والتكلفة المتغيرة لكل طلب.',
      solution_20_45s: 'بحاسبة نقطة التعادل من رَصين، بتحدد تكاليفك الثابتة، وسعر بيع المنتج، وتكلفته عليك.. وفي ثانية واحدة الأداة بتقولك محتاج تبيع كام وحدة شهرياً ويومياً علشان توصل للربح المستهدف.',
      cta_45_60s: 'احسب أرقام مشروعك واعرف مستقبلك المالي مجاناً على raseen.me الآن.',
    },
    socialPosts: {
      twitter: `قبل ما تبدأ حملتك الإعلانية الجاية.. هل عارف نقطة التعادل لمشروعك (Break-Even Point)؟ 📊💡

حاسبة رَصين المالية الذكية تمنحك:
🎯 كمية وحدات التعادل بدقة
💰 إيرادات التعادل المطلوبة شهرياً
📈 معدل المبيعات اليومي المستهدف
🛡️ مؤشر هامش الأمان للربحية

احسبها مجاناً في دقيقة: https://raseen-nine.vercel.app

#تسويق #متاجر_إلكترونية #سلة #زد #أرباح`,
      linkedin: `التسعير العشوائي هو العدو الأول لاستدامة الشركات الناشئة.

أطلقت منصة رَصين حاسبة نقطة التعادل والأرباح التفاعلية، المصممة لمساعدة المديرين الماليين وأصحاب المشروعات في تقييم الجدوى الاقتصادية وحساب هوامش المساهمة ومعدل التشغيل اليومي (Daily Run Rate).

الأداة متاحة مجاناً بدون تسجيل لدعم منظومة ريادة الأعمال العربية:
https://raseen-nine.vercel.app

#إدارة_مالية #دراسة_جدوى #تسعير #Startups #ECommerce`,
      whatsappStatus: `📊 احسب نقطة التعادل وهوامش أرباح مشروعك بدقة في دقيقة واحدة مجاناً:
https://raseen-nine.vercel.app`,
    },
  },
  {
    id: 'campaign-store-audit',
    theme: 'فحص صحة المتاجر والسيو ومعدل التحويل (Store Audit)',
    targetAudience: 'تجار سلة، زد، وشوبيفاي',
    freeLeadMagnet: 'فاحص المتاجر الـ 100 نقطة وتشخيص تسرب المبيعات',
    url: 'https://raseen-nine.vercel.app',
    hook: 'بتصرف فلوس إعلانات على متجرك بس المبيعات ضعيفة؟ اكتشف فين المشكلة في دقيقة واحدة مجاناً!',
    videoScript: {
      hook_0_5s: 'فلوس إعلاناتك بتروح على الأرض ومتجرك فيه تسريب مبيعات؟ 🛒💸',
      problem_5_20s: 'أكتر من 80% من زوار المتاجر بيخرجوا بدون شراء بسبب بطء الجوال، أو غياب بوابات الدفع المحلي (زي مدى وإنستاباي)، أو نقص بيانات الثقة.',
      solution_20_45s: 'فاحص المتاجر على منصة رَصين بيقيم متجرك في 5 محاور أساسية من 100 نقطة، وبيديلك خطة علاج واضحة للتطبيق فوراً في متجرك على سلة أو زد أو شوبيفاي.',
      cta_45_60s: 'افحص صحة متجرك وانسخ خطة العلاج مجاناً على raseen.me الآن!',
    },
    socialPosts: {
      twitter: `أين تتسرب مبيعات متجرك الإلكتروني؟ 🛒🔍

فاحص صحة المتاجر من رَصين يقيم:
⚡ سرعة التصفح وتجربة الجوال
💳 دعم بوابات الدفع المحلي (مدى / إنستاباي / تابي)
🔍 بيانات السيو المنظم (Schema.org)
🛡️ إشارات الثقة والضمانات

افحص متجرك مجاناً واحصل على تقريرك: https://raseen-nine.vercel.app

#سلة #زد #شوبيفاي #سيو #تجارة_الكترونية`,
      linkedin: `تحسين معدلات التحويل (CRO) في المتاجر الإلكترونية يتطلب تشخيصاً دقيقاً لكل مرحلة في قمع المبيعات.

أداة Store Health & SEO Diagnostic الجديدة على منصة رَصين تمكن ملاك المتاجر من تقييم الأداء عبر 5 ركائز رئيسية مع توليد توصيات فورية قابلة للتنفيذ.

رابط فحص المتاجر: https://raseen-nine.vercel.app

#تجارة_رقمية #سيو #تحسين_التحويل #متاجر_سعودية`,
      whatsappStatus: `🛒 افحص متجرك الإلكتروني واعرف سبب ضعف المبيعات وخطة علاجه مجاناً:
https://raseen-nine.vercel.app`,
    },
  },
  {
    id: 'campaign-creator-earnings',
    theme: 'اربح 85% من مبيعات ملفاتك وقوالبك الرقمية',
    targetAudience: 'المحاسبين، المهندسين المعماريين، المحامين، المصممين',
    freeLeadMagnet: 'انضم كبائع معتمد بدون رسوم اشتراك شهرية',
    url: 'https://raseen-nine.vercel.app/vendor',
    hook: 'لو عندك شيتات إكسل احترافية، أو عقود قانونية، أو بلوكات كاد.. ليه سايبها على جهازك ومبتكسبش منها آلاف شهرياً؟',
    videoScript: {
      hook_0_5s: 'الملفات اللي على لابتوبك دي تسوى آلاف وأنت مش واخد بالك! 💻💰',
      problem_5_20s: 'كتير من المحترفين صمموا شيتات وقوالب خارقة استخدموها في شغلهم، وناس كتير محتاجة تشتريها وجاهزة تدفع فيها فوراً.',
      solution_20_45s: 'على منصة رَصين، بتفتح متجرك مجاناً، بتعرض ملفاتك، والمنصة بتوفرلك الدفع الإلكتروني والتحميل الآمن، وبتحصل على 85% من كل عملية بيع مباشرة على حسابك البنكي أو إنستاباي.',
      cta_45_60s: 'انضم كبائع معتمد على raseen.me/vendor وابدأ تحقيق دخل سلبي الآن!',
    },
    socialPosts: {
      twitter: `هل تمتلك شيتات إكسل متميزة، أو قوالب قانونية، أو مكتبات معمارية؟ 💼🚀

حوّل خبرتك إلى دخل دوري مستمر مع منصة رَصين:
💰 85% صافي أرباح لك كصانع محتوى
⚡ تسليم آمن وتلقائي 24/7 لملفاتك
💳 استلام أرباحك عبر إنستاباي، فودافون كاش، ومدى
🆓 لا توجد أي رسوم تسجيل شهرية

سجل كبائع معتمد اليوم: https://raseen-nine.vercel.app/vendor

#عمل_حر #دخل_سلبي #صانع_محتوى #إكسل #رصين`,
      linkedin: `دعوة للمحترفين والمستشارين:

تتيح منصة رَصين لخبراء المحاسبة، القانون، والهندسة المعمارية تسويق وبيع أصولهم الرقمية (Digital Assets) بنظام مشاركة أرباح عادل (85% للمبدع و 15% للمنصة) مع بنية دفع وتسليم مؤمنة بالكامل.

انضم لشبكة بائعي رَصين المعتمدين:
https://raseen-nine.vercel.app/vendor

#اقتصاد_المبدعين #العمل_الحر #أصول_رقمية #استشارات`,
      whatsappStatus: `💼 افتح متجرك لبيع القوالب والشيتات الرقمية وجني أرباح 85% مع رَصين:
https://raseen-nine.vercel.app/vendor`,
    },
  },
];

async function runAutomation() {
  console.log('🚀 Running Raseen Growth Marketing Engine...');
  const dateStr = new Date().toISOString().split('T')[0];
  
  // Select campaign based on day of month (round-robin)
  const dayIndex = new Date().getDate() % CAMPAIGNS.length;
  const currentCampaign = CAMPAIGNS[dayIndex];
  console.log(`📌 Selected Campaign for today (${dateStr}): [${currentCampaign.id}] ${currentCampaign.theme}`);

  // 1. Write public marketing digest JSON
  const outputDir = path.join(process.cwd(), 'public', 'marketing');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const digestPayload = {
    generatedAt: new Date().toISOString(),
    campaignId: currentCampaign.id,
    theme: currentCampaign.theme,
    targetAudience: currentCampaign.targetAudience,
    freeLeadMagnet: currentCampaign.freeLeadMagnet,
    hook: currentCampaign.hook,
    videoScript: currentCampaign.videoScript,
    socialPosts: currentCampaign.socialPosts,
    allCampaignsCount: CAMPAIGNS.length,
    activeUrl: currentCampaign.url,
  };

  const digestFile = path.join(outputDir, 'growth_digest.json');
  fs.writeFileSync(digestFile, JSON.stringify(digestPayload, null, 2), 'utf-8');
  console.log(`✔ Generated public JSON digest: ${digestFile}`);

  // 2. Generate Human-Readable MARKETING_DISPATCH.md in root
  const markdownContent = `# 🚀 النشرة التسويقية اليومية لمنصة رَصين (Daily Growth Dispatch)
تاريخ التوليد: ${new Date().toISOString()}

## 🎯 حملة اليوم الأساسية: ${currentCampaign.theme}
- **الجمهور المستهدف:** ${currentCampaign.targetAudience}
- **أداة الجذب المجانية (Lead Magnet):** ${currentCampaign.freeLeadMagnet}
- **الرابط المستهدف:** [${currentCampaign.url}](${currentCampaign.url})
- **الخطاف الافتتاحي (Hook):** ${currentCampaign.hook}

---

### 🎬 سيناريو فيديو تيك توك وريلز وشورتس (60 ثانية)
- **الخطاف (0-5 ثوانٍ):**
  > ${currentCampaign.videoScript.hook_0_5s}
- **المشكلة وتوعية العميل (5-20 ثانية):**
  > ${currentCampaign.videoScript.problem_5_20s}
- **الحل العملي من منصة رَصين (20-45 ثانية):**
  > ${currentCampaign.videoScript.solution_20_45s}
- **الدعوة للإجراء (Call to Action - 45-60 ثانية):**
  > ${currentCampaign.videoScript.cta_45_60s}

---

### 🐦 تغريدة / منشور منصة X (Twitter)
\`\`\`text
${currentCampaign.socialPosts.twitter}
\`\`\`

---

### 💼 منشور لينكد إن المهني (LinkedIn B2B Post)
\`\`\`text
${currentCampaign.socialPosts.linkedin}
\`\`\`

---

### 💬 رسالة وحالة الواتساب (WhatsApp Status / Direct Outreach)
\`\`\`text
${currentCampaign.socialPosts.whatsappStatus}
\`\`\`

---
*تم توليد هذه النشرة آلياً بواسطة محرك النمو لمنصة رَصين — رصيدك الذكي من الأدوات والخبرات.*
`;

  const dispatchFile = path.join(process.cwd(), 'MARKETING_DISPATCH.md');
  fs.writeFileSync(dispatchFile, markdownContent, 'utf-8');
  console.log(`✔ Generated Markdown dispatch bulletin: ${dispatchFile}`);

  console.log('✨ Growth marketing engine completed successfully!');
}

runAutomation().catch((err) => {
  console.error('Growth engine error:', err);
  process.exit(1);
});
