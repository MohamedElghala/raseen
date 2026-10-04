const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categoriesData = [
  { slug: 'business', name: 'شركات ورواد أعمال', nameEn: 'Business', icon: '🏢', description: 'ملفات وقوالب مخصصة للشركات، العقود، والأتمتة.' },
  { slug: 'accounting', name: 'محاسبين وماليين', nameEn: 'Accounting', icon: '📊', description: 'أدوات مالية، شيتات إكسل، وداشبورد Power BI متقدمة.' },
  { slug: 'engineering', name: 'مهندسين ومعماريين', nameEn: 'Engineering', icon: '📐', description: 'مخططات، بلوكات AutoCAD، عائلات Revit، وجداول حصر.' },
  { slug: 'students', name: 'طلاب وباحثين', nameEn: 'Students', icon: '🎓', description: 'سير ذاتية ATS، قوالب Notion، وعروض تخرج أكاديمية.' },
  { slug: 'individuals', name: 'أفراد وإنتاجية', nameEn: 'Individuals', icon: '👤', description: 'ميزانية شخصية، تخطيط حياة، وعقود عمل حر.' }
];

const usersData = [
  { id: 'usr-vendor-1', name: 'م. أحمد البائع', email: 'vendor@raseen.com', password: 'password123', role: 'vendor', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
  { id: 'usr-buyer-1', name: 'سارة المشتري', email: 'buyer@raseen.com', password: 'password123', role: 'buyer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
  { id: 'usr-admin-1', name: 'مدير رَصين', email: 'admin@raseen.com', password: 'adminpassword', role: 'admin', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' }
];

const productsData = [
  // 🏢 1. Business
  {
    id: 'p1',
    title: 'حزمة عقود العمل والشراكة واتفاقيات عدم الإفصاح (NDA)',
    description: '15 نموذج عقد قانوني مصاغ بعناية فائقة بواسطة محامين تجاريين معتمدين. تشمل عقود تأسيس شركات، اتفاقيات شراكة استثمارية، عقود توظيف، وصيغ NDA متوافقة مع القوانين المصرية والخليجية.',
    price: 250,
    originalPrice: 400,
    categorySlug: 'business',
    fileType: 'word-pdf',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 42,
    salesCount: 187,
    tags: 'عقود,قانوني,شركات,شراكة,NDA,توظيف',
    featured: true
  },
  {
    id: 'p2',
    title: 'قالب عرض المستثمرين الاحترافي (Pitch Deck Master)',
    description: 'أكثر من 45 شريحة بوربوينت بتصميم عالمي لجولات الاستثمار Seed & Series A. مبني وفق معايير Silicon Valley ومترجم ومصمم خصيصاً للشركات الناشئة في الشرق الأوسط.',
    price: 180,
    originalPrice: 300,
    categorySlug: 'business',
    fileType: 'powerpoint',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 31,
    salesCount: 142,
    tags: 'Pitch Deck,استثمار,شركات ناشئة,سلايدات,تمويل',
    featured: true
  },
  {
    id: 'p3',
    title: 'نموذج دراسة الجدوى والتحليل المالي لـ 3 سنوات',
    description: 'شيت إكسل ديناميكي معقد ومبسط يحسب تكاليف التأسيس، الأرباح المتوقعة، نقطة التعادل، ومعدل العائد الداخلي (IRR) مع تقارير رسومية جاهزة للبنوك والمستثمرين.',
    price: 320,
    originalPrice: 500,
    categorySlug: 'business',
    fileType: 'excel',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 56,
    salesCount: 215,
    tags: 'دراسة جدوى,نموذج مالي,Excel,استثمار,IRR',
    featured: false
  },
  {
    id: 'p4',
    title: 'حزمة سيناريوهات أتمتة الأعمال (Make & Zapier Blueprints)',
    description: 'سيناريوهات جاهزة للاستيراد بضغطة زر لربط المتجر الإلكتروني ببرامج المحاسبة، إرسال رسائل واتساب تلقائية للعملاء، وتحديث جداول المبيعات السحابية بدون كود.',
    price: 210,
    originalPrice: 350,
    categorySlug: 'business',
    fileType: 'notion',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 19,
    salesCount: 88,
    tags: 'أتمتة,Zapier,Make,واتساب,NoCode,إنتاجية',
    featured: false
  },
  {
    id: 'p5',
    title: 'نظام إدارة علاقات العملاء الشامل (Notion Enterprise CRM)',
    description: 'نظام Notion متكامل لإدارة الصفقات، متابعة خط سير المبيعات (Sales Pipeline)، تتبع اتصالات العملاء والمهام اليومية مع تنبيهات مؤتمتة وتوافق تام مع الجوال.',
    price: 160,
    originalPrice: 280,
    categorySlug: 'business',
    fileType: 'notion',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 38,
    salesCount: 164,
    tags: 'CRM,Notion,مبيعات,عملاء,إدارة',
    featured: false
  },
  {
    id: 'p6',
    title: 'حقيبة لوائح ونماذج الموارد البشرية والرواتب (HR Pack)',
    description: 'أكثر من 30 نموذجاً إدارياً يشمل لائحة العمل الداخلية، نماذج تقييم الأداء السنوي، خطابات العرض الوظيفي، وسياسات الإجازات والمكافآت.',
    price: 195,
    originalPrice: 320,
    categorySlug: 'business',
    fileType: 'word-pdf',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 27,
    salesCount: 110,
    tags: 'HR,موارد بشرية,رواتب,لوائح,عقود',
    featured: false
  },

  // 📊 2. Accounting
  {
    id: 'p7',
    title: 'شيت إكسل المحاسبة الشاملة (دليل الحسابات والقوائم المالية)',
    description: 'النظام المحاسبي المتكامل: قيود اليومية، ميزان المراجعة، الأستاذ العام، قائمة الدخل، والمركز المالي بمجرد إدخال المعاملة بدون أي برامج خارجية معقدة.',
    price: 350,
    originalPrice: 550,
    categorySlug: 'accounting',
    fileType: 'excel',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 78,
    salesCount: 340,
    tags: 'محاسبة,Excel,قوائم مالية,ميزانية,قيود',
    featured: true
  },
  {
    id: 'p8',
    title: 'نظام إدارة المخازن وحساب تكلفة البضاعة المباعة (FIFO)',
    description: 'شيت تتبع حركات المخزون وارد/منصرف بتقييم الوارد أولاً يصرف أولاً (FIFO)، جرد فوري، وتنبيهات أوتوماتيكية بنقاط إعادة الطلب والحد الأدنى.',
    price: 240,
    originalPrice: 380,
    categorySlug: 'accounting',
    fileType: 'excel',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 45,
    salesCount: 195,
    tags: 'مخازن,FIFO,جرد,تكلفة,مبيعات',
    featured: false
  },
  {
    id: 'p9',
    title: 'حاسبة ضريبة القيمة المضافة والإقرار الإلكتروني (مصر والخليج)',
    description: 'حساب ضريبة الـ 14% المصرية والـ 15% السعودية تلقائياً، مع توليد نموذج تقرير الإقرار الضريبي الشهري والربع سنوي المعتمد وجداول الفواتير.',
    price: 150,
    originalPrice: 260,
    categorySlug: 'accounting',
    fileType: 'excel',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 62,
    salesCount: 280,
    tags: 'ضرائب,VAT,قيمة مضافة,إقرار,حاسبة',
    featured: false
  },
  {
    id: 'p10',
    title: 'لوحة تحليلات Power BI التنفيذية للمؤشرات المالية (CFO Dashboard)',
    description: 'داشبورد تفاعلية احترافية تعرض هوامش الربح، التدفقات النقدية، المبيعات حسب القنوات، ومعدلات الدوران مع تقارير ديناميكية بنقرة زر.',
    price: 280,
    originalPrice: 450,
    categorySlug: 'accounting',
    fileType: 'powerpoint',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 34,
    salesCount: 130,
    tags: 'Power BI,CFO,تقارير,داشبورد,تحليل مالي',
    featured: true
  },
  {
    id: 'p11',
    title: 'شيت مسير الرواتب والتأمينات الاجتماعية والضرائب 2026',
    description: 'شيت مسير رواتب مفصل متوافق مع شرائح كسب العمل والتأمينات الاجتماعية الجديدة. يحسب البدلات، الاستقطاعات، وساعات العمل الإضافي لكل موظف بدقة.',
    price: 175,
    originalPrice: 290,
    categorySlug: 'accounting',
    fileType: 'excel',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 29,
    salesCount: 122,
    tags: 'رواتب,تأمينات,ضرائب,كسب عمل,شيت',
    featured: false
  },
  {
    id: 'p12',
    title: 'أداة توقعات التدفقات النقدية والميزانية التقديرية (Cash Flow Forecast)',
    description: 'توقع السيولة النقدية لـ 12 شهراً قادمة، إدارة التزامات الموردين وتحصيلات العملاء مع سيناريوهات Best/Worst Case لتفادي أزمات السيولة.',
    price: 210,
    originalPrice: 340,
    categorySlug: 'accounting',
    fileType: 'excel',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 23,
    salesCount: 95,
    tags: 'تدفق نقدي,سيولة,ميزانية,Cash Flow,توقعات',
    featured: false
  },

  // 📐 3. Engineering
  {
    id: 'p13',
    title: 'مكتبة 1500+ بلوك AutoCAD معماري وإنشائي معتمد',
    description: 'أكبر مكتبة بلوكات أوتوكاد معمارية وإنشائية وكهروميكانيكية (مفروشات، أبواب، سيارات، أشجار، تفاصيل تسليح) منظمة في طبقات Layers قياسية.',
    price: 200,
    originalPrice: 350,
    categorySlug: 'engineering',
    fileType: 'cad-revit',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 91,
    salesCount: 420,
    tags: 'AutoCAD,بلوكات,معماري,إنشائي,CAD',
    featured: true
  },
  {
    id: 'p14',
    title: 'شيت الحسابات وتصميم العناصر الإنشائية والخرسانة المسلحة',
    description: 'شيت إكسل لتصميم الكمرات، الأعمدة، القواعد المنفصلة والمشتركة، وبلاطات السقف وفقاً للكود المصري والكود الأمريكي ACI مع تفريد حديد التسليح.',
    price: 300,
    originalPrice: 480,
    categorySlug: 'engineering',
    fileType: 'excel',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 53,
    salesCount: 230,
    tags: 'إنشائي,خرسانة,تصميم,تسليح,مهندس',
    featured: true
  },
  {
    id: 'p15',
    title: 'قوالب مقايسات حصر الكميات والمستخلصات (BOQ Master)',
    description: 'جداول حصر هندسي شاملة لأعمال الحفر، الخرسانات، التشطيبات، والكهرباء مع شيت حساب مستخلصات المقاولين الدورية والضرائب وغرامات التأخير.',
    price: 190,
    originalPrice: 320,
    categorySlug: 'engineering',
    fileType: 'excel',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 40,
    salesCount: 175,
    tags: 'حصر كميات,مقايسة,BOQ,مستخلصات,مقاولات',
    featured: false
  },
  {
    id: 'p16',
    title: 'عائلات Revit معمارية وكهروميكانيكية بارامترية (Revit Families)',
    description: 'أكثر من 250 عائلة ريفيت تفاعلية عالية الدقة مع خامات واقعية ومعاملات بارامترية جاهزة للاستخدام في مشاريع الـ BIM وتصميمات الفلل والأبراج.',
    price: 260,
    originalPrice: 420,
    categorySlug: 'engineering',
    fileType: 'cad-revit',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 36,
    salesCount: 140,
    tags: 'Revit,BIM,عائلات,معماري,تصميم 3D',
    featured: false
  },
  {
    id: 'p17',
    title: 'جدول زمني متقدم لإدارة المشروعات مع منحنى S-Curve',
    description: 'شيت إكسل لمتابعة الخطة الزمنية للمشروع، تتبع نسب الإنجاز الفعلية مقابل المخططة وتوليد منحنى التدفق والتقدم S-Curve أوتوماتيكياً.',
    price: 180,
    originalPrice: 290,
    categorySlug: 'engineering',
    fileType: 'excel',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 28,
    salesCount: 115,
    tags: 'جدول زمني,S-Curve,إدارة مشروعات,إكسل,موقع',
    featured: false
  },
  {
    id: 'p18',
    title: 'شيت حساب أحمال التكييف وتصميم مجاري الهواء (HVAC Duct Sizing)',
    description: 'أداة هندسية لحساب أحمال التبريد الحرارية للغرف وتحديد أقطار ومقاسات دكت التكييف ومخارج الهواء ومعدل تدفق الهواء CFM وفقاً لمعايير ASHRAE.',
    price: 220,
    originalPrice: 360,
    categorySlug: 'engineering',
    fileType: 'excel',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 22,
    salesCount: 89,
    tags: 'ميكانيكا,HVAC,تكييف,تبريد,دكت,ASHRAE',
    featured: false
  },

  // 🎓 4. Students
  {
    id: 'p19',
    title: 'حزمة السير الذاتية الاحترافية المتوافقة مع أنظمة الفرز (ATS-Ready CVs)',
    description: '10 قوالب سيرة ذاتية عصرية مصممة لتجاوز روبوتات الفرز الآلي ATS بنجاح 100%. متاحة بصيغ Word قابلة للتعديل الكامل مع نماذج خطابات تغطية Cover Letter.',
    price: 79,
    originalPrice: 150,
    categorySlug: 'students',
    fileType: 'word-pdf',
    license: 'personal',
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 115,
    salesCount: 560,
    tags: 'سيرة ذاتية,CV,ATS,وظائف,Cover Letter',
    featured: true
  },
  {
    id: 'p20',
    title: 'نظام إدارة الحياة الجامعية والدراسة المتكامل (Notion Student OS)',
    description: 'لوحة Notion ذكية تجمع مواعيد المحاضرات، تتبع المهام والواجبات، دفتر ملاحظات المواد، حاسبة المعدل التراكمي الفورية، وجدول مراجعة الاختبارات.',
    price: 99,
    originalPrice: 180,
    categorySlug: 'students',
    fileType: 'notion',
    license: 'personal',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 64,
    salesCount: 290,
    tags: 'جامعة,Notion,دراسة,تنظيم,طلاب,GPA',
    featured: false
  },
  {
    id: 'p21',
    title: 'حزمة عروض تخرج ومشاريع تخرج جامعية (Graduation Presentation Pack)',
    description: 'أكثر من 60 شريحة بوربوينت أكاديمية أنيقة مع رسوم بيانية ومخططات جاهزة لعرض مشاريع التخرج ورسائل الماجستير والدكتوراه.',
    price: 110,
    originalPrice: 200,
    categorySlug: 'students',
    fileType: 'powerpoint',
    license: 'personal',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 47,
    salesCount: 185,
    tags: 'تخرج,بوربوينت,ماجستير,عرض تقديمي,أبحاث',
    featured: false
  },
  {
    id: 'p22',
    title: 'دليل برومبتات الذكاء الاصطناعي للأبحاث الأكاديمية (Prompt Guide)',
    description: 'أكثر من 120 برومبت مدروس لـ ChatGPT و Claude لتلخيص الأوراق البحثية، إعادة الصياغة الأكاديمية، استخراج الأفكار، وصياغة المنهجية البحثية.',
    price: 85,
    originalPrice: 150,
    categorySlug: 'students',
    fileType: 'ai-prompts',
    license: 'personal',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 38,
    salesCount: 210,
    tags: 'ذكاء اصطناعي,برومبتات,ChatGPT,أبحاث,Claude',
    featured: true
  },
  {
    id: 'p23',
    title: 'مخطط التحضير لاختبارات الآيلتس والتوفل (IELTS 8.0 Prep Master)',
    description: 'جدول دراسي تفاعلي لمدة 60 يوماً يشمل تتبع تدريبات المحادثة والكتابة، بنك كلمات أكاديمية مدمج، وقوالب كتابة المقالات Task 1 & Task 2.',
    price: 95,
    originalPrice: 170,
    categorySlug: 'students',
    fileType: 'notion',
    license: 'personal',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 31,
    salesCount: 145,
    tags: 'IELTS,إنجليزي,توفل,دراسة,تحضير',
    featured: false
  },
  {
    id: 'p24',
    title: 'قوالب كتابة وتنسيق الأوراق البحثية بمعايير IEEE / APA',
    description: 'ملفات Word مجهزة مسبقاً بهوامش وتنسيقات جاهزة للخطوط، الجداول، المراجع وقوائم المصادر وفق أحدث أدلة التوثيق العالمية IEEE و APA 7th.',
    price: 65,
    originalPrice: 120,
    categorySlug: 'students',
    fileType: 'word-pdf',
    license: 'personal',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 26,
    salesCount: 130,
    tags: 'أبحاث,توثيق,APA,IEEE,قوالب,مراجع',
    featured: false
  },

  // 👤 5. Individuals
  {
    id: 'p25',
    title: 'مخطط الميزانية والمصاريف الشخصية الذكي (قاعدة 50/30/20)',
    description: 'شيت إكسل ملون وسهل الاستخدام يقسم دخلك الشهري أوتوماتيكياً بين الاحتياجات، الرغبات، والادخار مع تنبيهات عند تجاوز سقف المصاريف.',
    price: 110,
    originalPrice: 200,
    categorySlug: 'individuals',
    fileType: 'excel',
    license: 'personal',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 88,
    salesCount: 410,
    tags: 'ميزانية,ادخار,مصاريف,شخصي,توفير',
    featured: true
  },
  {
    id: 'p26',
    title: 'لوحة تخطيط الحياة وتتبع العادات (Notion Life OS)',
    description: 'منظومة إنتاجية مبنية في Notion تشمل تتبع العادات اليومية، لوحة الرؤية والأهداف السنوية، إدارة قراءات الكتب، ويوميات الامتنان اليومية.',
    price: 125,
    originalPrice: 220,
    categorySlug: 'individuals',
    fileType: 'notion',
    license: 'personal',
    imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 52,
    salesCount: 260,
    tags: 'إنتاجية,عادات,تخطيط,Notion,أهداف,تطوير ذات',
    featured: false
  },
  {
    id: 'p27',
    title: 'حزمة قوالب السوشيال ميديا والإعلانات (Social Media Growth Kit)',
    description: '30 تصميماً احترافياً لمنشورات وقصص إنستغرام ولينكد إن وبوربوينت متناسقة الألوان لزيادة التفاعل والمبيعات للمشاريع الشخصية والمستقلين.',
    price: 140,
    originalPrice: 250,
    categorySlug: 'individuals',
    fileType: 'powerpoint',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 41,
    salesCount: 195,
    tags: 'سوشيال ميديا,تصميم,إنستغرام,إعلانات,سلايدات',
    featured: false
  },
  {
    id: 'p28',
    title: 'مخطط الوجبات الأسبوعي وقائمة التسوق الصحي والرياضة',
    description: 'جدول إكسل ديناميكي لحساب السعرات الحرارية والماكروز، تخطيط وجبات الأسبوع، وتوليد قائمة مشتريات السوبرماركت تلقائياً لتوفير الوقت والمال.',
    price: 75,
    originalPrice: 130,
    categorySlug: 'individuals',
    fileType: 'excel',
    license: 'personal',
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 29,
    salesCount: 140,
    tags: 'تغذية,وجبات,دايت,تسوق,صحة,سعرات',
    featured: false
  },
  {
    id: 'p29',
    title: 'حزمة عقود ونماذج العمل الحر للمستقلين (Freelancer Protection Pack)',
    description: 'عقود تقديم خدمات رقمية، اتفاقيات تسليم المراحل، وشروط الدفع المسبق وحفظ حقوق الملكية الفكرية لحماية المستقلين من المماطلة في السداد.',
    price: 135,
    originalPrice: 230,
    categorySlug: 'individuals',
    fileType: 'word-pdf',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 46,
    salesCount: 220,
    tags: 'فريلانسر,عقود,عمل حر,مستقلين,حماية حقوق',
    featured: false
  },
  {
    id: 'p30',
    title: 'مكتبة برومبتات Midjourney للتصميم التجاري والمنتجات',
    description: 'أكثر من 200 برومبت معتمد لتوليد صور المنتجات الواقعية، الخلفيات الإعلانية الفاخرة، تصاميم العبوات، والواجهات الرقمية باستخدام Midjourney v6.',
    price: 120,
    originalPrice: 210,
    categorySlug: 'individuals',
    fileType: 'ai-prompts',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 35,
    salesCount: 180,
    featured: true
  },
  {
    id: 'p31',
    title: 'حزمة 60 قالب بوست وريلز Canva احترافي لشركات التجارة والمطاعم',
    description: 'مجموعة قوالب كانفا مصممة بأبعاد 1080×1080 و 1080×1920 جاهزة للتعديل بضغطة زر. تشمل إعلانات خصومات، عروض نهاية الموسم، ومسابقات تفاعلية.',
    price: 199,
    originalPrice: 350,
    categorySlug: 'individuals',
    fileType: 'canva',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 78,
    salesCount: 410,
    tags: 'canva,انستجرام,ريلز,سوشيال ميديا,تصاميم,تسويق',
    featured: true
  },
  {
    id: 'p32',
    title: 'قالب السيرة الذاتية التنفيذي الذهبي ATS + رابط تعديل فوري في Canva',
    description: 'قالب سيرة ذاتية ثنائي اللغة (عربي / إنجليزي) مصمم لاجتياز فلاتر ATS مع رابط فتح وتعديل مباشر في Canva وخيارات ألوان متعددة.',
    price: 89,
    originalPrice: 160,
    categorySlug: 'students',
    fileType: 'canva',
    license: 'personal',
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewCount: 145,
    salesCount: 920,
    tags: 'canva,سيرة ذاتية,ATS,توظيف,لينكدإن',
    featured: true
  },
  {
    id: 'p33',
    title: 'نظام الفواتير وعروض الأسعار الضريبية للشركات والمستقلين (Canva & Excel Master)',
    description: 'قوالب فواتير أنيقة ومتوافقة مع متطلبات هيئة الزكاة والضريبة والجمارك ومصلحة الضرائب المصرية، مع QR code وحساب تلقائي للضريبة.',
    price: 149,
    originalPrice: 250,
    categorySlug: 'accounting',
    fileType: 'canva',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 63,
    salesCount: 380,
    tags: 'canva,فواتير,ضرائب,حسابات,عروض أسعار',
    featured: false
  },
  {
    id: 'p34',
    title: 'حزمة قوالب العروض التقديمية والتقارير السنوية الفاخرة للشركات (Canva Pitch Deck)',
    description: 'أكثر من 55 شريحة عرض تقديمية بتنسيق 16:9 لعرض الميزانيات، خطط العمل، والنتائج السنوية بأعلى معايير الإخراج البصري.',
    price: 240,
    originalPrice: 420,
    categorySlug: 'business',
    fileType: 'canva',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 51,
    salesCount: 290,
    tags: 'canva,سلايدات,تقارير,عرض تقديمي,شركات',
    featured: true
  },
  {
    id: 'p35',
    title: 'مجموعة شهادات التقدير والاعتماد الأكاديمي والمهني (Vector & Canva Ready)',
    description: '12 قالباً لشهادات التخرج، التدريب، والتكريم الرسمي بنقوش إسلامية وزخارف كلاسيكية حديثة قابلة للتعديل والطباعة الفورية بدقة 300 DPI.',
    price: 110,
    originalPrice: 200,
    categorySlug: 'students',
    fileType: 'canva',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 42,
    salesCount: 215,
    tags: 'canva,شهادات,تدريب,اعتماد,تعليم',
    featured: false
  },
  {
    id: 'p36',
    title: 'حزمة عقود الشراكة وحماية الملكية الفكرية وصيغ التفويض التجاري (Word + Canva Sign)',
    description: 'صيغ تعاقدية قانونية متقدمة لتوزيع الأرباح، تأسيس الشركات، وحفظ حقوق الملكية الفكرية وتراخيص الاستخدام التجاري للبرمجيات.',
    price: 280,
    originalPrice: 450,
    categorySlug: 'business',
    fileType: 'word-pdf',
    license: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 37,
    salesCount: 175,
    tags: 'canva,عقود,شراكة,ملكية فكرية,قانوني',
    featured: false
  }
];

async function main() {
  console.log('🚀 بدء تغذية قاعدة بيانات رَصِين (Seeding Raseen Database)...');

  // 1. Seed Categories
  console.log('📦 إضافة وتحديث الفئات الخمس...');
  const categoryMap = {};
  for (const cat of categoriesData) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, nameEn: cat.nameEn, icon: cat.icon, description: cat.description },
      create: { slug: cat.slug, name: cat.name, nameEn: cat.nameEn, icon: cat.icon, description: cat.description }
    });
    categoryMap[cat.slug] = c.id;
  }

  // 2. Seed Users
  console.log('👥 إضافة وتحديث المستخدمين الافتراضيين...');
  for (const usr of usersData) {
    await prisma.user.upsert({
      where: { email: usr.email },
      update: { name: usr.name, password: usr.password, role: usr.role, avatar: usr.avatar },
      create: { id: usr.id, name: usr.name, email: usr.email, password: usr.password, role: usr.role, avatar: usr.avatar }
    });
  }

  const defaultVendorId = 'usr-vendor-1';

  // 3. Seed 30 Products
  console.log('💎 إضافة وتحديث الـ 30 أصلاً رقمياً معتمداً...');
  for (const p of productsData) {
    const catId = categoryMap[p.categorySlug];
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        title: p.title,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        fileType: p.fileType,
        license: p.license,
        imageUrl: p.imageUrl,
        rating: p.rating,
        reviewCount: p.reviewCount,
        salesCount: p.salesCount,
        tags: p.tags,
        featured: p.featured,
        categoryId: catId,
        vendorId: defaultVendorId
      },
      create: {
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        fileType: p.fileType,
        license: p.license,
        imageUrl: p.imageUrl,
        rating: p.rating,
        reviewCount: p.reviewCount,
        salesCount: p.salesCount,
        tags: p.tags,
        featured: p.featured,
        categoryId: catId,
        vendorId: defaultVendorId
      }
    });
  }

  console.log('✅ اكتملت تغذية قاعدة البيانات بنجاح: 5 فئات، 3 مستخدمين، و 30 منتجاً.');
}

main()
  .catch((e) => {
    console.error('❌ خطأ أثناء تغذية قاعدة البيانات:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
