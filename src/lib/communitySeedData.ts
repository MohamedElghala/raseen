import { CommunityPost } from './communityTypes';

export const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    title: 'كيفية معالجة الإهلاك المحاسبي وفق معيار IFRS 16 في شيتات الإكسل للأصول المؤجرة؟',
    content: `السلام عليكم جميعاً،
نعمل حالياً على تحديث شيت الأصول الثابتة للشركة، وتواجهنا إشكالية في طريقة احتساب حق استخدام الأصل (Right-of-Use Asset) والتزام الإيجار (Lease Liability) مع حساب الفائدة الضمنية ومعدل الخصم المتراكم.
هل يوجد نموذج إكسل جاهز أو دالة مركبة تتعامل مع جدول سداد الإيجارات مع التغيرات في بنود العقد السنوية وفق معايير IFRS؟`,
    author: {
      name: 'أحمد زهران',
      title: 'مدير مالي CFO | معتمد SOCPA',
      verified: true,
      role: 'expert',
    },
    category: 'accounting',
    tags: ['معايير_IFRS', 'إكسل_محاسبي', 'إهلاك_الأصول', 'IFRS16'],
    upvotes: 42,
    views: 890,
    commentsCount: 3,
    createdAt: 'منذ ساعتين',
    isSolved: true,
    relatedProductId: 'p37',
    comments: [
      {
        id: 'c-1',
        postId: 'post-1',
        author: {
          name: 'د. محمود الفقي',
          title: 'مستشار معايير المحاسبة الدولية',
          verified: true,
          role: 'expert',
        },
        content: `وعليكم السلام أخي أحمد.
المعالجة الصحيحة في الإكسل تتطلب استخدام دالة PV لحساب القيمة الحالية لدفعات الإيجار بمعدل الاقتراض الإضافي (IBR).
قمنا بتضمين هذا المنطق بالكامل في شيت "سجل الأصول الثابتة والإهلاك IFRS" المتاح هنا في رَصين (رقم p37)، حيث يقوم بفصل أصل حق الاستخدام وإجراء قيد الإهلاك الشهري آلياً مع قيد فائدة الالتزام. يمكنك مراجعته أو استخدام الصيغة التالية:
\`=PV(IBR_Rate/12, Lease_Months, -Monthly_Payment, 0, 1)\`
مع مراعاة بداية المدة أو نهايتها.`,
        upvotes: 28,
        createdAt: 'منذ ساعة',
        isSolution: true,
      },
      {
        id: 'c-2',
        postId: 'post-1',
        author: {
          name: 'سارة عبد الرحمن',
          title: 'محاسبة أولى',
          verified: false,
          role: 'member',
        },
        content: 'إجابة ممتازة د. محمود! كنت أبحث عن هذه المعادلة بالضبط منذ أسبوع. تم الشراء من شيت رَصين ويعمل بسلاسة.',
        upvotes: 5,
        createdAt: 'منذ 40 دقيقة',
      }
    ]
  },
  {
    id: 'post-2',
    title: 'طلب نموذج مخصص: شيت مالي لإدارة وتكاليف عيادات ومراكز الأسنان الطبية',
    content: `نحتاج نموذج إكسل تنفيذي متكامل مخصص لمركز أسنان يشمل:
1. متابعة مخزون المواد الطبية والزرعات (Implants) مع تنبيهات الصلاحية.
2. حساب نسب أطباء الأسنان والعمولات حسب نوع الإجراء (حشو، تقويم، جراحة).
3. كشف حساب المريض وحالات التقسيط على جلسات.
مستعدون لتمويل النموذج بمكافأة 1,200 ج.م للبائع أو المحاسب الذي يوفره وفق أعلى المعايير.`,
    author: {
      name: 'د. كريم الشناوي',
      title: 'مدير تشغيلي | مراكز النخبة لطب الأسنان',
      verified: true,
      role: 'member',
    },
    category: 'requests',
    tags: ['طلب_نموذج', 'مراكز_طبية', 'إكسل_طبي', 'عمولات_الأطباء'],
    upvotes: 35,
    views: 640,
    commentsCount: 4,
    createdAt: 'منذ 5 ساعات',
    isCustomRequest: true,
    bounty: '1,200 ج.م',
    deadline: 'خلال 4 أيام',
    comments: [
      {
        id: 'c-3',
        postId: 'post-2',
        author: {
          name: 'هاني رسلان',
          title: 'صانع نماذج إكسل معتمد لدى رَصين',
          verified: true,
          role: 'creator',
        },
        content: `تحياتي د. كريم. لدي نموذج مصمم بالفعل لمجمع طبي يتضمن حساب نسب الأطباء ونقاط التعادل ومخزون المواد الاستهلاكية، وسأقوم بتخصيص الجزئية الخاصة بالزرعات ورفعه كأصل حصري على المنصة غداً بإذن الله لتتمكن من تنزيله فوراً.`,
        upvotes: 14,
        createdAt: 'منذ 3 ساعات',
        isSolution: false,
      }
    ]
  },
  {
    id: 'post-3',
    title: 'ما هي البنود الجوهرية لحماية حقوق الملكية الفكرية في عقود العمل عن بعد مع مبرمجين ومصممين؟',
    content: `نقوم بالتعاقد مع فريلانسرز ومطورين عن بعد من خارج مصر لتطوير تطبيق SaaS.
ما هي الصياغة الدقيقة لبند "Work Made for Hire" والتنازل عن الشفرة المصدرية (Source Code Assignment) لمنع أي نزاع مستقبلي على حقوق الكود والتصاميم وفق الأنظمة الدولية؟`,
    author: {
      name: 'م. عمر طارق',
      title: 'مؤسس ومدير تقني CTO',
      verified: false,
      role: 'member',
    },
    category: 'legal',
    tags: ['عقود_قانونية', 'برمجيات', 'ملكية_فكرية', 'SaaS', 'عمل_حر'],
    upvotes: 56,
    views: 1200,
    commentsCount: 2,
    createdAt: 'منذ يوم',
    isSolved: true,
    relatedProductId: 'p1',
    comments: [
      {
        id: 'c-4',
        postId: 'post-3',
        author: {
          name: 'المستشار خالد عبد الرازق',
          title: 'محامٍ بالنقض ومستشار شركات التقنية',
          verified: true,
          role: 'expert',
        },
        content: `مرحباً مهندس عمر. هناك ثلاث ركائز إلزامية لا بد من تضمينها:
1. النص الصريح على أن كافة المخرجات تعتبر "عمل مستأجر" والتنازل الفوري عن كافة الحقوق المالية والأدبية (Intellectual Property Assignment) فور استلام المقابل.
2. التزام المطور بتسليم كافة المستودعات (Git Repositories) وحسابات الخدمات السحابية وعدم الاحتفاظ بنسخ احتياطية.
3. التعهد بعدم انتهاك أكواد طرف ثالث مفتوحة المصدر (GPL/Open Source compliance) لحماية مشروعك من التلوث البرمجي.
يمكنك الاستعانة بحزمة "عقود العمل والشراكة ومطوري البرمجيات" المتاحة في رَصين فهي مصاغة بلغة قانونية معتمدة دولياً ومحلياً.`,
        upvotes: 39,
        createdAt: 'منذ 18 ساعة',
        isSolution: true,
      }
    ]
  },
  {
    id: 'post-4',
    title: 'حل مشكلة ربط عائلات Revit MEP Air Terminals بمجاري الهواء وحساب الـ Friction Loss',
    content: `عند استخدام عائلات مخارج الهواء (Diffusers) في مشروع Revit 2024 تظهر رسالة عدم اكتمال الحسابات الهيدروليكية للنظام، وتتوقف قراءة معدل التدفق CFM على المين دكت.
هل المشكلة في تعريف الـ Flow Configuration (Preset vs System) داخل العائلة؟ وكيف نتفاداها في النماذج الكبيرة؟`,
    author: {
      name: 'م. حسام العوضي',
      title: 'مهندس ميكانيكا وتنسيق BIM',
      verified: true,
      role: 'expert',
    },
    category: 'engineering',
    tags: ['Revit_MEP', 'BIM', 'تكييف_HVAC', 'عائلات_ريفيت'],
    upvotes: 29,
    views: 520,
    commentsCount: 2,
    createdAt: 'منذ يومين',
    isSolved: true,
    relatedProductId: 'p42',
    comments: [
      {
        id: 'c-5',
        postId: 'post-4',
        author: {
          name: 'م. إبراهيم ناصف',
          title: 'خبير نمذجة BIM أول',
          verified: true,
          role: 'expert',
        },
        content: `المشكلة سببها ضبط الـ Flow Configuration على "System" بدلاً من "Preset".
في مخارج الهواء، يجب أن تكون القيمة Preset، والـ Flow Direction مضبوطة على "Inward" لمخارج الإمداد (Supply). راجع مكتبة عائلات Revit MEP المحدثة على رَصين (p42) فهي مضبوطة بالكامل بنظام البارامترات المشتركة بدون أخطاء التدفق.`,
        upvotes: 21,
        createdAt: 'منذ يوم',
        isSolution: true,
      }
    ]
  },
  {
    id: 'post-5',
    title: 'طلب نموذج مخصص: حزمة عقود فرنشايز (امتياز تجاري) متوافقة مع الأنظمة المصرية والسعودية',
    content: `مطلوب حزمة قانونية شاملة لتأسيس نظام فرانشايز لسلسلة مطاعم تشمل:
- عقد الامتياز التجاري الرئيسي (Master Franchise).
- اتفاقية سرية المعلومات ودليل التشغيل (Operations Manual NDA).
- آلية تحصيل الرسوم الملكية الشهرية (Royalty Fees) ورسوم التسويق المشترك.
الميزانية المرصودة للطلب: 1,500 ج.م.`,
    author: {
      name: 'طارق الجوهري',
      title: 'رائد أعمال | مطاعم شيف هاوس',
      verified: false,
      role: 'member',
    },
    category: 'requests',
    tags: ['طلب_نموذج', 'فرنشايز', 'امتياز_تجاري', 'عقود_مطاعم'],
    upvotes: 48,
    views: 950,
    commentsCount: 3,
    createdAt: 'منذ 3 أيام',
    isCustomRequest: true,
    bounty: '1,500 ج.م',
    deadline: 'خلال أسبوع',
  },
  {
    id: 'post-6',
    title: 'تطبيق الفاتورة الإلكترونية ومنظومة الإيصال في مصر: ما هي الالتزامات الفعلية للشركات والمهنيين؟',
    content: `مع تحديثات مصلحة الضرائب الأخيرة لعام 2026، هل ما زال مطلوباً من مكاتب المحاماة والاستشارات الهندسية الانضمام لمنظومة الفاتورة الإلكترونية أم الإيصال الإلكتروني B2C؟ وما هي طريقة الربط مع برامج الحسابات؟`,
    author: {
      name: 'مينا سمير',
      title: 'محاسب قانوني ومدير مكتب ضرائب',
      verified: true,
      role: 'expert',
    },
    category: 'accounting',
    tags: ['الفاتورة_الإلكترونية', 'ضرائب_مصر', 'الإيصال_الإلكتروني', 'شيتات_فواتير'],
    upvotes: 63,
    views: 1450,
    commentsCount: 5,
    createdAt: 'منذ 4 أيام',
    isSolved: false,
  },
  {
    id: 'post-7',
    title: 'أفضل جدول استحقاق (Vesting Schedule) للشركات الناشئة في جولة ما قبل التأسيس (Pre-Seed)',
    content: `نحن 3 مؤسسين نطلق شركة برمجيات جديدة، ونريد وضع جدول توزيع أسهم بمدة 4 سنوات مع Cliff لمدة سنة. ما هو المعيار المقبول للمستثمرين الملائكيين (Angel Investors)؟ وهل يُفضل وضع بند التسريع عند الاستحواذ (Single vs Double Trigger Acceleration)؟`,
    author: {
      name: 'هيثم مندور',
      title: 'مؤسس شركة ناشئة FinTech',
      verified: false,
      role: 'member',
    },
    category: 'business',
    tags: ['شركات_ناشئة', 'Vesting', 'حصص_المؤسسين', 'استثمار_جرئ'],
    upvotes: 51,
    views: 1100,
    commentsCount: 4,
    createdAt: 'منذ 5 أيام',
    isSolved: true,
  },
  {
    id: 'post-8',
    title: 'طلب نموذج مخصص: قوالب Canva لهوية شركات الاستشارات الهندسية والمقاولات (Profile + Banners)',
    content: `نحتاج بروفايل شركة مقاولات فاخر وجاهز للطباعة وعرض المشاريع بصيغة Canva قابلة للتعديل بسهولة، مع تصاميم للسوشيال ميديا وورق مراسلات رسمي.
المكافأة: 700 ج.م.`,
    author: {
      name: 'م. رامي الشريف',
      title: 'مدير تطوير أعمال | شركة صرح للمقاولات',
      verified: false,
      role: 'member',
    },
    category: 'requests',
    tags: ['طلب_نموذج', 'قوالب_Canva', 'بروفايل_شركة', 'مقاولات'],
    upvotes: 27,
    views: 480,
    commentsCount: 2,
    createdAt: 'منذ 6 أيام',
    isCustomRequest: true,
    bounty: '700 ج.م',
    deadline: 'خلال 3 أيام',
  }
];
