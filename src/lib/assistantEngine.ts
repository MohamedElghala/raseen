import { mockProducts } from '@/lib/mockData';
import { ProductItem } from '@/lib/types';

export type AssistantIntent =
  | 'engineering_bim'
  | 'financial_accounting'
  | 'legal_contracts'
  | 'business_tools'
  | 'vendor_creator'
  | 'general_support';

export interface AssistantChatRequest {
  message?: string;
  history?: Array<{ sender: 'user' | 'assistant'; text: string }>;
  context?: Record<string, any>;
}

export interface AssistantChatResponse {
  reply: string;
  intent: AssistantIntent;
  recommendedProducts: ProductItem[];
  triggerLeadCapture: boolean;
}

// Normalize Arabic text for accurate semantic matching
export function normalizeArabic(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '') // Remove tashkeel
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();
}

// Intent Classification Engine across 6 core categories
export function detectIntent(rawText: string): {
  intent: AssistantIntent;
  score: number;
  triggerLeadCapture: boolean;
} {
  const norm = normalizeArabic(rawText);

  // Check lead capture triggers
  const leadTriggers = [
    'تواصل',
    'اتصال',
    'اتصل',
    'رقم',
    'واتساب',
    'whatsapp',
    'مبيعات',
    'استشاره',
    'استشارة',
    'شراء',
    'تخصيص',
    'مكالمه',
    'مكالمة',
    'فريق',
    'مندوب',
    'حجز',
    'طلب خاص',
    'ترخيص شركات',
    'enterprise',
    'عرض سعر',
  ];
  const triggerLeadCapture = leadTriggers.some((kw) => norm.includes(normalizeArabic(kw)));

  const intentKeywords: Record<AssistantIntent, string[]> = {
    engineering_bim: [
      'bim',
      'revit',
      'ريفيت',
      'ريفت',
      'بيم',
      'هندسه',
      'هندسي',
      'معمار',
      'معماري',
      'اوتوكاد',
      'autocad',
      'cad',
      'boq',
      'حصر',
      'كميات',
      'مقايسات',
      'انشائي',
      'مخططات',
      'بلوكات',
      'عائلات',
      'lod',
      'lod 300',
      'lod 350',
      'rfa',
      'rvt',
      'dwg',
      'خرسانه',
      'تسليح',
      'مهندس',
      'مقاول',
      'مقاولات',
    ],
    financial_accounting: [
      'محاسب',
      'محاسبه',
      'شيت',
      'شيتات',
      'مالي',
      'ماليه',
      'ميزان',
      'مراجعه',
      'قيود',
      'يوميه',
      'دفتر',
      'تدفق',
      'تدفقات',
      'كاش',
      'cash flow',
      'سيوله',
      'رواتب',
      'اجور',
      'payroll',
      'ضريبه',
      'ضرائب',
      'vat',
      'zatca',
      'زكاه',
      'تكلفه',
      'تكاليف',
      'مخازن',
      'مستودع',
      'جرد',
      'fifo',
      'ميزانيه',
      'budget',
      'ارباح وخسائر',
      'power bi',
    ],
    legal_contracts: [
      'عقد',
      'عقود',
      'قانون',
      'قانوني',
      'اتفاقيه',
      'اتفاقيات',
      'nda',
      'سريه',
      'عمل حر',
      'فريلانس',
      'شراكه',
      'تاسيس',
      'توظيف',
      'ترخيص',
      'تنازل',
      'ملكية فكريه',
      'بيع برمجيات',
      'ايجار',
      'سياسه الخصوصيه',
      'شروط الاستخدام',
      'محامي',
      'بنود',
      'صياغه',
    ],
    business_tools: [
      'اداه',
      'ادوات',
      'حاسبه',
      'تعادل',
      'نقطه التعادل',
      'break-even',
      'فاحص',
      'سيو',
      'seo',
      'متجر',
      'فحص',
      'تدقيق',
      'مولد الفواتير',
      'عروض اسعار',
      'quotation',
      'qr كود',
      'كروت',
      'هامش الربح',
      'مساهمه',
      'تحويل العملات',
      'صرف',
      'دراسه جدوي',
    ],
    vendor_creator: [
      'بائع',
      'بائعين',
      'صناع',
      'صانع',
      'متجر بائع',
      '85',
      '85%',
      'نسبه',
      'عموله',
      'بيع ملفات',
      'نشر',
      'رفع منتج',
      'استلام الارباح',
      'انستاباي',
      'instapay',
      'مدي',
      'mada',
      'سحب ارباح',
      'تسجيل بائع',
      'صناع الاصول',
      'ارباح البائعين',
    ],
    general_support: [
      'دعم',
      'مساعده',
      'سلام',
      'اهل',
      'مرحب',
      'منصه',
      'رصين',
      'خدمات',
      'اسعار',
      'خصم',
      'كوبون',
      'باقات',
      'تطوير',
      'شرح',
    ],
  };

  const scores: Record<AssistantIntent, number> = {
    engineering_bim: 0,
    financial_accounting: 0,
    legal_contracts: 0,
    business_tools: 0,
    vendor_creator: 0,
    general_support: 0,
  };

  for (const [intentKey, kws] of Object.entries(intentKeywords)) {
    for (const kw of kws) {
      const normalizedKw = normalizeArabic(kw);
      if (norm.includes(normalizedKw)) {
        // Boost weighted keywords
        if (kw === '85' || kw === '85%' || kw === 'بائع' || kw === 'صناع الاصول') {
          scores[intentKey as AssistantIntent] += 4;
        } else if (kw === 'bim' || kw === 'revit' || kw === 'ريفت' || kw === 'boq') {
          scores[intentKey as AssistantIntent] += 3;
        } else if (kw === 'nda' || kw === 'عقد' || kw === 'عقود') {
          scores[intentKey as AssistantIntent] += 3;
        } else if (kw === 'نقطه التعادل' || kw === 'تعادل' || kw === 'فاحص') {
          scores[intentKey as AssistantIntent] += 3;
        } else {
          scores[intentKey as AssistantIntent] += 1;
        }
      }
    }
  }

  let highestIntent: AssistantIntent = 'general_support';
  let maxScore = 0;

  for (const [intentKey, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      highestIntent = intentKey as AssistantIntent;
    }
  }

  return {
    intent: highestIntent,
    score: maxScore,
    triggerLeadCapture,
  };
}

// Catalog Product Recommendation Engine (Free Lead Magnets Prioritized)
export function getRecommendedProducts(
  intent: AssistantIntent,
  queryText: string
): ProductItem[] {
  const normQuery = normalizeArabic(queryText);

  // Free Lead Magnets
  const freeP1 = mockProducts.find((p) => p.id === 'free-p1'); // Revit Starter LOD 300
  const freeP2 = mockProducts.find((p) => p.id === 'free-p2'); // Mini BOQ Starter
  const freeP3 = mockProducts.find((p) => p.id === 'free-p3'); // Mini NDA & Freelance
  const freeP4 = mockProducts.find((p) => p.id === 'free-p4'); // Mini Cash Flow & Budget

  // Commercial Flagships
  const paidEng1 = mockProducts.find((p) => p.id === 'p13'); // AutoCAD Blocks
  const paidEng2 = mockProducts.find((p) => p.id === 'p41'); // Villa Revit LOD 350
  const paidEng3 = mockProducts.find((p) => p.id === 'p14'); // Structural Calculations
  const paidAcc1 = mockProducts.find((p) => p.id === 'p7');  // Accounting Master
  const paidAcc2 = mockProducts.find((p) => p.id === 'p8');  // Power BI
  const paidAcc3 = mockProducts.find((p) => p.id === 'p10'); // Inventory FIFO
  const paidLeg1 = mockProducts.find((p) => p.id === 'p1');  // Business Contracts Suite
  const paidLeg2 = mockProducts.find((p) => p.id === 'p47'); // SaaS Agreements
  const paidBiz1 = mockProducts.find((p) => p.id === 'p2');  // Pitch Deck
  const paidBiz2 = mockProducts.find((p) => p.id === 'p38'); // Pricing & Break-even

  let curated: (ProductItem | undefined)[] = [];

  switch (intent) {
    case 'engineering_bim':
      // Free lead magnets free-p1 and free-p2 strictly first, followed by commercial BIM
      curated = [freeP1, freeP2, paidEng2, paidEng1, paidEng3];
      break;

    case 'financial_accounting':
      // Free lead magnet free-p4 and free-p2 first, followed by commercial accounting
      curated = [freeP4, freeP2, paidAcc1, paidAcc2, paidAcc3];
      break;

    case 'legal_contracts':
      // Free lead magnet free-p3 strictly first, followed by commercial contract suites
      curated = [freeP3, paidLeg1, paidLeg2];
      break;

    case 'business_tools':
      // Free lead magnets free-p4 and free-p3 first, followed by commercial tools
      curated = [freeP4, freeP3, paidBiz2, paidBiz1];
      break;

    case 'vendor_creator':
      // Free contract free-p3 to protect creator IP, free cash flow free-p4, and commercial packs
      curated = [freeP3, freeP4, paidLeg2, paidLeg1];
      break;

    case 'general_support':
    default:
      // Showcase top free lead magnets spanning domains
      curated = [freeP1, freeP3, freeP4, paidAcc1, paidLeg1];
      break;
  }

  // Filter out any undefined items
  const validCurated = curated.filter((p): p is ProductItem => Boolean(p));

  // If user searched for a very specific keyword (e.g. revit, boq, ضرائب), check direct catalog matches
  const keywordMatches = mockProducts.filter((p) => {
    const titleNorm = normalizeArabic(p.title);
    const descNorm = normalizeArabic(p.description);
    const tagsNorm = p.tags.map(normalizeArabic).join(' ');
    return (
      (normQuery.length > 3 && (titleNorm.includes(normQuery) || tagsNorm.includes(normQuery) || descNorm.includes(normQuery)))
    );
  });

  if (keywordMatches.length > 0) {
    // Partition into free and paid, ensuring free comes first!
    const freeMatches = keywordMatches.filter((p) => p.price === 0);
    const paidMatches = keywordMatches.filter((p) => p.price > 0);
    const combined = [...freeMatches, ...paidMatches, ...validCurated];
    // De-duplicate
    const seen = new Set<string>();
    const deduplicated: ProductItem[] = [];
    for (const item of combined) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        deduplicated.push(item);
      }
    }
    return deduplicated.slice(0, 4);
  }

  // Sort ensuring free lead magnets (price === 0) strictly appear first
  const sorted = [...validCurated].sort((a, b) => {
    if (a.price === 0 && b.price > 0) return -1;
    if (a.price > 0 && b.price === 0) return 1;
    return 0;
  });

  return sorted.slice(0, 4);
}

// Articulate Arabic Conversational Advisory Engine
export function generateAdvisoryReply(
  intent: AssistantIntent,
  queryText: string,
  recommendedProducts: ProductItem[],
  triggerLeadCapture: boolean
): string {
  const freeItems = recommendedProducts.filter((p) => p.price === 0);
  const freeCount = freeItems.length;

  let advice = '';

  switch (intent) {
    case 'engineering_bim':
      advice =
        `📐 **الترسانة الهندسية ونماذج BIM المعمارية المعتمدة**:\n\n` +
        `أهلاً بك يا باشمهندس! توفر منصة رَصين ترسانة هندسية متكاملة للمكاتب الاستشارية والمقاولين وفق أعلى المعايير العالمية (LOD 300 و LOD 350).\n\n` +
        (freeCount > 0
          ? `🎁 **هدية فورية لك**: يمكنك الآن تنزيل **${freeItems[0].title}** مجاناً 100% بنقرة زر واحدة لاختبار جودة العائلات والنمذجة قبل اقتناء الباقات الشاملة!\n\n`
          : '') +
        `• 🏛️ **نماذج Revit معمارية متقدمة**: مشاريع فلل ومبانٍ سكنية كاملة بكافة التفاصيل الإنشائية والمعمارية.\n` +
        `• 📏 **شيتات حصر كميات ومقايسات (BOQ)**: معادلات دقيقة لحصر الخرسانات، حديد التسليح، والتشطيبات.\n` +
        `• 📐 **مكتبة 1500+ بلوك AutoCAD**: منظمة في طبقات (Layers) معيارية جاهزة للمخططات التنفيذية.`;
      break;

    case 'financial_accounting':
      advice =
        `📊 **الحلول المالية والمحاسبية المعتمدة ومطابقة ZATCA**:\n\n` +
        `مرحباً بك! صُممت نماذج رَصين المحاسبية بواسطة ماليين ومحاسبين قانونيين لتمنحك دقة متناهية وإدارة سيولة آمنة:\n\n` +
        (freeCount > 0
          ? `🎁 **هدية مجانية فورية**: شيت **${freeItems[0].title}** متاح للتحميل الفوري بدون أي مقابل لتنظيم ميزانيتك وتدفقاتك فوراً!\n\n`
          : '') +
        `• 💵 **شيت المحاسبة المالية الشاملة**: قيود يومية أمريكية آلية، ميزان مراجعة ذاتي التوازن، وقوائم دخل ختامية.\n` +
        `• 🧾 **التوافق التام مع الضرائب و ZATCA**: حساب ضريبة القيمة المضافة وإصدار الإقرارات والربط مع الفاتورة الإلكترونية.\n` +
        `• 📈 **لوحات قيادة Power BI تفاعلية**: تحويل أرقامك الصامتة إلى مؤشرات أداء بصرية تدعم اتخاذ القرار.`;
      break;

    case 'legal_contracts':
      advice =
        `⚖️ **العقود التجارية والاتفاقيات القانونية الموثقة**:\n\n` +
        `أهلاً بك! في رَصين، قمنا بصياغة ومراجعة كافة العقود مع كبرى المكاتب القانونية التجارية لحماية استثماراتك وحقوقك الفكرية:\n\n` +
        (freeCount > 0
          ? `🎁 **نموذج قانوني مجاني فوري**: يمكنك الآن تنزيل **${freeItems[0].title}** بصيغتي Word و PDF لحماية أعمالك وتعاقداتك اليوم مجاناً!\n\n`
          : '') +
        `• 🛡️ **اتفاقيات سرية المعلومات (NDA)**: متوافقة مع الأنظمة السعودية والمصرية وقوانين التجارة الخليجية.\n` +
        `• 💼 **عقود الشراكة وتأسيس الشركات**: بنود توزيع الحصص، التخارج، والمسؤوليات الإدارية.\n` +
        `• 💻 **عقود العمل الحر وتطوير البرمجيات والـ SaaS**: صياغة دقيقة لنقل الملكية الفكرية وحظر المنافسة.`;
      break;

    case 'business_tools':
      advice =
        `⚡ **جناح أدوات إدارة الأعمال المباشر (Interactive Suite)**:\n\n` +
        `تضع منصة رَصين بين يديك في أعلى الصفحة الرئيسية مجموعة من أقوى الأدوات المجانية الحية:\n\n` +
        `1. 🧾 **مولد الفواتير وعروض الأسعار ZATCA**: دعم ضريبة 15% و 14%، رمز استجابة QR سريع، وتصدير PDF مقاس A4 فوري.\n` +
        `2. 📈 **حاسبة نقطة التعادل وهامش الربح**: شرائح منزلقة تفاعلية لحساب عدد الوحدات وتكلفة التأسيس وصافي الأرباح.\n` +
        `3. 🔍 **فاحص صحة المتاجر والسيو**: تقييم فوري لمعدل التحويل وبوابات الدفع المحلي ونصائح تسويقية عملية.\n\n` +
        (freeCount > 0
          ? `💡 **أصل مجاني مقترح**: شيت **${freeItems[0].title}** متاح للتحميل الفوري كأداة إكسل مساعدة.`
          : '');
      break;

    case 'vendor_creator':
      advice =
        `🏪 **نموذج أرباح البائعين وصناع الأصول في رَصين (85% ربح صافي)**:\n\n` +
        `رَصين تبني بيئة العمل الرقمية الأكثر عدالة ودعماً لصناع المحتوى في الوطن العربي:\n\n` +
        `• 💎 **85% للبائع**: تحصل على 85% صافية من كل عملية شراء لملفاتك أو شيتاتك أو قوالبك.\n` +
        `• 🛡️ **15% عمولة تشغيل فقط**: تغطي تكاليف بوابات الدفع (Stripe, Paymob, Mada)، التخزين السحابي وحماية الملفات.\n` +
        `• ⚡ **سحب أرباحك فورياً**: تلقي أرباحك آلياً عبر إنستاباي (InstaPay) والمحافظ في مصر، أو بطاقات مدى والتحويل البنكي في السعودية والخليج.\n` +
        `• 🔒 **حماية الملكية الفكرية**: تشفير الملفات وروابط تنزيل مؤقتة مشفرة لمنع إعادة التوزيع غير المصرح به.\n` +
        `• 🚀 **ابدأ خلال 5 دقائق**: تسجيل مجاني، فتح المتجر، وبدء تحقيق دخل سلبي مستدام.`;
      break;

    case 'general_support':
    default:
      advice =
        `🌟 **أهلاً بك في منصة رَصين لإدارة الأعمال (Raseen Business Platform)**!\n\n` +
        `أنا مستشارك الذكي المؤتمت المتاح على مدار الساعة (24/7). أساعدك في اختيار أفضل الأدوات الرقمية المناسبة لمجالك:\n\n` +
        `• 📐 **الهندسة والـ BIM**: عائلات Revit LOD 300/350، بلوكات AutoCAD، وجداول BOQ.\n` +
        `• 📊 **المالية والمحاسبة**: شيتات ميزان المراجعة، التدفقات النقدية، وفواتير ZATCA.\n` +
        `• ⚖️ **العقود القانونية**: اتفاقيات العمل الحر، NDA، وعقود الشركات وتطوير البرمجيات.\n` +
        `• 🏪 **متجر البائعين**: انضم كبائع واكسب 85% صافي من مبيعات ملفاتك مع سحب فوري للأرباح.\n\n` +
        `🎁 نوفر أيضاً باقة أصول مجانية 100% للتحميل الفوري بدون أي وسيلة دفع لتجربة الجودة أولاً!`;
      break;
  }

  if (triggerLeadCapture) {
    advice +=
      `\n\n🤝 **يسعدنا تواصلك المباشر**: فريق مستشاري رَصين جاهز لمساعدتك عبر الواتساب أو البريد الإلكتروني. يمكنك إرسال بياناتك وسنتواصل معك خلال دقائق!`;
  }

  return advice;
}

// Optional asynchronous enhancement via Local AI Gateway if available
export async function tryEnhanceWithAIGateway(prompt: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 800); // 800ms fast timeout

    const res = await fetch('http://127.0.0.1:8080/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemini-2.0-flash',
        messages: [
          {
            role: 'system',
            content:
              'أنت المساعد الذكي الخبير لمنصة رَصين لإدارة الأعمال. تحدث بأسلوب عربي فصيح، مهني، جذاب وودود مع استخدام الإيموجي وتنسيق المقروئية العالية.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content && typeof content === 'string' && content.trim().length > 20) {
        return content.trim();
      }
    }
  } catch {
    // Graceful silent fallback to local semantic generator
  }
  return null;
}
