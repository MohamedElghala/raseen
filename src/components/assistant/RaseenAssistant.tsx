'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Analytics } from '@/lib/analytics';
import { ProductItem } from '@/lib/types';
import { mockProducts } from '@/lib/mockData';
import FreeDownloadModal from '@/components/storefront/FreeDownloadModal';

// --- Types ---
export type IndustryKey = 'companies' | 'construction' | 'ecommerce' | 'restaurants' | 'freelance';
export type NeedKey = 'accounting' | 'legal' | 'breakeven' | 'vendor_profit';

export interface CatalogRecommendation {
  id: string; // e.g. 'acc-1', 'leg-1'
  title: string;
  category: 'accounting' | 'legal';
  priceEGP: number;
  description: string;
  tags: string[];
  link: string;
}

export interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  time: string;
  quickReplies?: { label: string; action: () => void }[];
  actionLink?: { label: string; href: string };
  recommendations?: CatalogRecommendation[];
  recommendedProducts?: ProductItem[];
  intent?: string;
  isProfitExplanation?: boolean;
}

// --- Curated Catalog Matrix: acc-1..12 and leg-1..10 ---
export const ACCOUNTING_CATALOG: CatalogRecommendation[] = [
  {
    id: 'acc-1',
    title: 'شيت المحاسبة المالية الشاملة وميزان المراجعة ودفتر اليومية',
    category: 'accounting',
    priceEGP: 350,
    description: 'شيت متكامل لقيود اليومية الأمريكية، ميزان المراجعة الآلي، وحساب الأرباح والخسائر بمعادلات ديناميكية.',
    tags: ['محاسبة', 'دفتر اليومية', 'Excel'],
    link: '/product/p7',
  },
  {
    id: 'acc-2',
    title: 'شيت التدفقات النقدية والموازنة التقديرية (Cash Flow Master)',
    category: 'accounting',
    priceEGP: 260,
    description: 'مراقبة السيولة النقدية اليومية والشهرية مع تنبؤ بالعجز الفائض وتنبيهات السيولة الحرجة.',
    tags: ['تدفقات نقدية', 'سيولة', 'موازنة'],
    link: '/product/p40',
  },
  {
    id: 'acc-3',
    title: 'حاسبة ضريبة القيمة المضافة (VAT) والإقرارات الإلكترونية ZATCA',
    category: 'accounting',
    priceEGP: 190,
    description: 'متوافق مع معايير هيئة الزكاة والضريبة السعودية (15%) ومصلحة الضرائب المصرية (14%).',
    tags: ['ضرائب', 'ZATCA', 'VAT'],
    link: '/product/p9',
  },
  {
    id: 'acc-4',
    title: 'نظام إدارة المخازن وجرد المستودعات وتكلفة المبيعات (FIFO/LIFO)',
    category: 'accounting',
    priceEGP: 280,
    description: 'تتبع كروت الصنف، تنبيهات حد الطلب، وحساب تكلفة البضاعة المباعة تلقائياً.',
    tags: ['مخازن', 'FIFO', 'تكلفة مبيعات'],
    link: '/product/p8',
  },
  {
    id: 'acc-5',
    title: 'شيت مسير الرواتب والأجور والبدلات والتأمينات الاجتماعية (Payroll)',
    category: 'accounting',
    priceEGP: 220,
    description: 'حساب ساعات العمل الإضافية، الاستقطاعات، التأمينات، وصافي الرواتب بضغطة زر واحدة.',
    tags: ['رواتب', 'أجور', 'HR'],
    link: '/product/p11',
  },
  {
    id: 'acc-6',
    title: 'نموذج دراسة الجدوى والتحليل المالي لـ 3 سنوات ونقطة التعادل',
    category: 'accounting',
    priceEGP: 320,
    description: 'حساب تكاليف التأسيس، العائد على الاستثمار ROI، ومعدل العائد الداخلي IRR للمستثمرين والبنوك.',
    tags: ['دراسة جدوى', 'تعادل', 'استثمار'],
    link: '/product/p3',
  },
  {
    id: 'acc-7',
    title: 'لوحة قيادة Power BI التفاعلية للمؤشرات والتحليل المالي المتقدم',
    category: 'accounting',
    priceEGP: 290,
    description: 'داشبورد ديناميكية تحول أرقام إكسل الصامتة إلى رسوم بيانية ومؤشرات أداء استراتيجية.',
    tags: ['Power BI', 'داشبورد', 'تحليل مالي'],
    link: '/product/p10',
  },
  {
    id: 'acc-8',
    title: 'شيت حصر التكاليف الصناعية والمباشرة وتسعير المنتجات والخدمات',
    category: 'accounting',
    priceEGP: 240,
    description: 'تحديد تكلفة تصنيع الوحدة، هامش المساهمة، وتسعير الخدمات بهامش ربح آمن ومدروس.',
    tags: ['تسعير', 'تكاليف', 'تصنيع'],
    link: '/product/p38',
  },
  {
    id: 'acc-9',
    title: 'شيت إعداد القوائم المالية الآلية (الميزانية وقائمة الدخل والأرباح)',
    category: 'accounting',
    priceEGP: 310,
    description: 'استخراج القوائم الختامية متوافقة مع معايير المحاسبة الدولية IFRS تلقائياً من ميزان المراجعة.',
    tags: ['قوائم مالية', 'IFRS', 'ميزانية'],
    link: '/product/p3',
  },
  {
    id: 'acc-10',
    title: 'شيت مراقبة مديونيات العملاء وأعمار الديون والتحصيل (AR Aging)',
    category: 'accounting',
    priceEGP: 210,
    description: 'توزيع الديون حسب الفترات (30/60/90 يوماً) مع مؤشرات تحصيل ومعدل دوران المدينين.',
    tags: ['أعمار ديون', 'تحصيل', 'عملاء'],
    link: '/product/p7',
  },
  {
    id: 'acc-11',
    title: 'شيت إدارة الأصول الثابتة وحساب الإهلاك السنوي بمختلف الطرق',
    category: 'accounting',
    priceEGP: 180,
    description: 'حساب قسط الإهلاك الثابت والمتناقص ومجمع الإهلاك والقيمة الدفترية للأصول.',
    tags: ['أصول ثابتة', 'إهلاك', 'دفاتر'],
    link: '/product/p37',
  },
  {
    id: 'acc-12',
    title: 'شيت موازنة المصاريف التشغيلية (OPEX) والرأسمالية (CAPEX)',
    category: 'accounting',
    priceEGP: 270,
    description: 'فصل ومراقبة التكاليف التشغيلية والرأسمالية مع مقارنة الفعلي بالمخطط شهرياً.',
    tags: ['OPEX', 'CAPEX', 'موازنة'],
    link: '/product/p12',
  },
];

export const LEGAL_CATALOG: CatalogRecommendation[] = [
  {
    id: 'leg-1',
    title: 'عقد توظيف شامل متوافق مع نظام العمل السعودي والمصري والخليجي',
    category: 'legal',
    priceEGP: 250,
    description: 'صيغة قانونية محكمة تغطي فترات التجربة، ساعات العمل، الإجازات، وحماية سرية البيانات.',
    tags: ['عقد عمل', 'توظيف', 'قانوني'],
    link: '/product/p1',
  },
  {
    id: 'leg-2',
    title: 'اتفاقية سرية وعدم إفشاء معلومات تجارية وتقنية غير قابلة للنقض (NDA)',
    category: 'legal',
    priceEGP: 180,
    description: 'حماية أسرار العمل، الأكواد البرمجية، والأفكار الاستثمارية مع الشركاء والموظفين.',
    tags: ['NDA', 'سرية معلومات', 'حماية الملكية'],
    link: '/product/free-p3',
  },
  {
    id: 'leg-3',
    title: 'عقد شراكة استثمارية وتأسيس شركات وتوزيع حصص الأرباح والخسائر',
    category: 'legal',
    priceEGP: 350,
    description: 'تحديد نسب الشراكة، إدارة الشركة، آلية التخارج، وحصص المستثمر الملائكي والتقني.',
    tags: ['شراكة', 'استثمار', 'تأسيس شركات'],
    link: '/product/p36',
  },
  {
    id: 'leg-4',
    title: 'عقد تقديم خدمات استشارية وتقنية وإدارة مشاريع احترافية (SLA)',
    category: 'legal',
    priceEGP: 220,
    description: 'تحديد نطاق العمل Scope of Work، شروط التسليم، وجداول الدفعات المالية والجزاءات.',
    tags: ['خدمات', 'SLA', 'استشارات'],
    link: '/product/p48',
  },
  {
    id: 'leg-5',
    title: 'عقد مقاولات وتوريد مواد وتنفيذ أعمال تشييد وبناء هندسي',
    category: 'legal',
    priceEGP: 300,
    description: 'شروط الدفعة المقدمة، المستخلصات الشهرية، غرامات التأخير، وخطابات الضمان البنكية.',
    tags: ['مقاولات', 'تشييد', 'هندسة'],
    link: '/product/p15',
  },
  {
    id: 'leg-6',
    title: 'اتفاقية عمل حر وتطوير برمجي وتصميم رقمي وتنازل عن الملكية الفكرية',
    category: 'legal',
    priceEGP: 170,
    description: 'تحمي صاحب العمل والفريلانسر، مع نقل ملكية الكود والتصميم وحظر التنافس.',
    tags: ['عمل حر', 'برمجة', 'تصميم'],
    link: '/product/p29',
  },
  {
    id: 'leg-7',
    title: 'عقد بيع وتنازل نهائي عن ملكية برمجيات وحقوق ملكية فكرية ورقمية',
    category: 'legal',
    priceEGP: 280,
    description: 'توثيق بيع المواقع والتطبيقات وقواعد البيانات والتنازل عن الحقوق الفكرية والتجارية.',
    tags: ['بيع برمجيات', 'حقوق فكرية', 'تنازل'],
    link: '/product/p47',
  },
  {
    id: 'leg-8',
    title: 'عقد إيجار تجاري وإداري للمقرات والمكاتب والمستودعات والشركات',
    category: 'legal',
    priceEGP: 190,
    description: 'شروط التجديد، التأمين المسترد، الصيانة، والتصريح بالأنشطة التجارية المرخصة.',
    tags: ['إيجار تجاري', 'مكاتب', 'عقارات'],
    link: '/product/p1',
  },
  {
    id: 'leg-9',
    title: 'اتفاقية وكالة وتوزيع وتسويق منتجات وبضائع حصرية وغير حصرية',
    category: 'legal',
    priceEGP: 260,
    description: 'تنظيم العلاقة بين المورد والوكيل المحلي، عمولات المبيعات، ومناطق التوزيع الجغرافية.',
    tags: ['وكالة تجارية', 'توزيع', 'تسويق'],
    link: '/product/p6',
  },
  {
    id: 'leg-10',
    title: 'شروط الاستخدام وسياسة الخصوصية للمواقع والمتاجر والتطبيقات الإلكترونية',
    category: 'legal',
    priceEGP: 200,
    description: 'متوافقة مع أنظمة حماية البيانات الشخصية والجرائم الإلكترونية وقوانين التجارة الإلكترونية.',
    tags: ['سياسة الخصوصية', 'شروط الاستخدام', 'متاجر'],
    link: '/product/p47',
  },
];

// --- Validation Regular Expressions ---
// International E.164: + followed by 7 to 15 digits
const E164_PHONE_REGEX = /^\+[1-9]\d{6,14}$/;
// Arab local numbers (Egypt: 010/011/012/015, Saudi: 05, UAE: 05, etc.)
const ARABIC_LOCAL_PHONE_REGEX = /^0(1[0125]\d{8}|5\d{8}|[2-9]\d{6,9})$/;
// Digits without leading plus
const CLEAN_INT_PHONE_REGEX = /^[1-9]\d{6,14}$/;

// RFC 5322 standard compliant email regex
const RFC5322_EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  return (
    E164_PHONE_REGEX.test(cleaned) ||
    ARABIC_LOCAL_PHONE_REGEX.test(cleaned) ||
    CLEAN_INT_PHONE_REGEX.test(cleaned)
  );
}

export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return RFC5322_EMAIL_REGEX.test(email.trim());
}

export default function RaseenAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Recommendation tree navigation state
  const [currentStep, setCurrentStep] = useState<'idle' | 'select_industry' | 'select_need'>('idle');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryKey | null>(null);

  // Lead capture state
  const [showLeadPrompt, setShowLeadPrompt] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadChannel, setLeadChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [leadInterest, setLeadInterest] = useState('استشارة عامة في خدمات رَصين');
  const [leadValidationError, setLeadValidationError] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [capturedLeadId, setCapturedLeadId] = useState<string | null>(null);

  // Free Download Modal state triggered from live product recommendations
  const [isFreeModalOpen, setIsFreeModalOpen] = useState(false);
  const [selectedFreeProduct, setSelectedFreeProduct] = useState<ProductItem | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  };

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: 'أهلاً بك في منصة رَصين! 🌟 أنا مستشار رَصين ومساعدك الذكي لإدارة وتمكين الأعمال.\n\nيسعدني مساعدتك في استكشاف وترشيح أفضل الشيتات المالية والنماذج والعقود القانونية المناسبة لمشروعك، أو الإجابة على استفساراتك حول بيع أصولك وتفعيل أدواتك فوراً.',
          time: getCurrentTime(),
          quickReplies: [
            {
              label: '🎯 شجرة ترشيح الأصول لمشروعي',
              action: () => startRecommendationTree(),
            },
            {
              label: '🏪 كيف أربح 85% كبائع في رَصين؟',
              action: () => explainCreatorProfitModel(),
            },
            {
              label: '📊 استعراض شيتات المحاسبة (acc-1..12)',
              action: () => showAllAccountingSheets(),
            },
            {
              label: '⚖️ استعراض العقود القانونية (leg-1..10)',
              action: () => showAllLegalContracts(),
            },
            {
              label: '📞 حجز استشارة مع فريق المبيعات',
              action: () => openLeadCapture('طلب استشارة مباشرة مع فريق رَصين'),
            },
          ],
        },
      ]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, showLeadPrompt]);

  // --- 85% Creator Profit Model Explanation ---
  const explainCreatorProfitModel = () => {
    const text =
      `🌟 **نموذج أرباح البائعين وصناع الأصول في منصة رَصين (85% ربح صافي)**\n\n` +
      `في رَصين، قمنا ببناء أكثر نماذج الاقتصاد الإبداعي إنصافاً في العالم العربي:\n\n` +
      `• 💎 **85% للبائع**: تحصل على 85% صافية من قيمة كل عملية شراء لملفاتك أو شيتاتك أو قوالبك.\n` +
      `• 🛡️ **15% فقط عمولة المنصة**: تغطي تكاليف بوابات الدفع الإلكتروني، والاستضافة السحابية الآمنة، وحماية التنزيلات، والتسويق الرقمي والدعم الفني.\n` +
      `• ⚡ **تحويل فوري للأرباح**: سحب أرباحك وتلقيها تلقائياً عبر:\n` +
      `   - إنستاباي (InstaPay) والمحافظ الذكية (مصر)\n` +
      `   - بطاقات مدى (Mada) والتحويل البنكي المباشر (السعودية والخليج)\n` +
      `• 🔒 **حماية الملكية الفكرية**: فحص وتشفير ملفاتك وروابط تحميل مؤمنة برموز وحصص تنزيل محددة زمنياً لمنع التسريب.\n` +
      `• 🚀 **انطلاقة خلال 5 دقائق**: تسجيل مجاني وسريع، رفع أصولك، وبدء تحقيق دخل سلبي مستدام.`;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text,
        time: getCurrentTime(),
        isProfitExplanation: true,
        actionLink: {
          label: 'فتح متجر بائع في رَصين الآن (ربح 85%) ←',
          href: '/vendor',
        },
        quickReplies: [
          {
            label: '💼 تحدث مع مسؤول انضمام البائعين',
            action: () => openLeadCapture('استفسار عن الانضمام كبائع - باقة 85% أرباح'),
          },
          {
            label: '🎯 ترشيح أصول لمشروعي',
            action: () => startRecommendationTree(),
          },
        ],
      },
    ]);
  };

  // --- Interactive Recommendation Tree ---
  const startRecommendationTree = () => {
    setCurrentStep('select_industry');
    const text =
      '🎯 **الخطوة 1 من 2**: اختر طبيعة ونشاط مشروعك لنرشح لك أنسب الأصول الاحترافية فوراً:';

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text,
        time: getCurrentTime(),
        quickReplies: [
          {
            label: '🏢 شركات ورواد أعمال وخدمات استشارية',
            action: () => handleSelectIndustry('companies'),
          },
          {
            label: '🏗️ مقاولات وهندسة وتشييد وتوريدات',
            action: () => handleSelectIndustry('construction'),
          },
          {
            label: '🛒 تجارة إلكترونية ومتاجر تجزئة',
            action: () => handleSelectIndustry('ecommerce'),
          },
          {
            label: '🍽️ مطاعم وكافيهات وأغذية ومشروبات',
            action: () => handleSelectIndustry('restaurants'),
          },
          {
            label: '💻 عمل حر وصناع محتوى ومبرمجين',
            action: () => handleSelectIndustry('freelance'),
          },
        ],
      },
    ]);
  };

  const handleSelectIndustry = (industry: IndustryKey) => {
    setSelectedIndustry(industry);
    setCurrentStep('select_need');

    const industryNames: Record<IndustryKey, string> = {
      companies: 'الشركات والاستشارات والرواد',
      construction: 'المقاولات والهندسة والتشييد',
      ecommerce: 'التجارة الإلكترونية والمتاجر',
      restaurants: 'المطاعم والكافيهات والأغذية',
      freelance: 'العمل الحر وصناع المحتوى',
    };

    const text = `رائع! اخترت قطاع: **${industryNames[industry]}** 📌\n**الخطوة 2 من 2**: ما هي أولويتك التشغيلية الحالية؟`;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text,
        time: getCurrentTime(),
        quickReplies: [
          {
            label: '📊 شيتات مالية ومحاسبية وتكاليف',
            action: () => generateRecommendations(industry, 'accounting'),
          },
          {
            label: '⚖️ عقود عمل وشراكة واتفاقيات قانونية',
            action: () => generateRecommendations(industry, 'legal'),
          },
          {
            label: '📈 دراسة جدوى وحساب نقطة التعادل',
            action: () => generateRecommendations(industry, 'breakeven'),
          },
          {
            label: '🏪 بيع خبراتي ونماذجي بربح 85%',
            action: () => explainCreatorProfitModel(),
          },
        ],
      },
    ]);
  };

  const generateRecommendations = (industry: IndustryKey, need: NeedKey) => {
    setCurrentStep('idle');
    let recs: CatalogRecommendation[] = [];
    let summary = '';

    if (need === 'accounting') {
      const mapping: Record<IndustryKey, string[]> = {
        companies: ['acc-1', 'acc-6', 'acc-9', 'acc-2'],
        construction: ['acc-4', 'acc-8', 'acc-11', 'acc-12'],
        ecommerce: ['acc-3', 'acc-4', 'acc-10', 'acc-8'],
        restaurants: ['acc-8', 'acc-5', 'acc-2', 'acc-4'],
        freelance: ['acc-2', 'acc-3', 'acc-6', 'acc-1'],
      };
      const ids = mapping[industry];
      recs = ACCOUNTING_CATALOG.filter((item) => ids.includes(item.id));
      summary = `إليك ترشيحات الأصول المحاسبية والمالية المخصصة لقطاعك:`;
    } else if (need === 'legal') {
      const mapping: Record<IndustryKey, string[]> = {
        companies: ['leg-1', 'leg-2', 'leg-3', 'leg-4'],
        construction: ['leg-5', 'leg-4', 'leg-1', 'leg-8'],
        ecommerce: ['leg-10', 'leg-9', 'leg-2', 'leg-6'],
        restaurants: ['leg-1', 'leg-8', 'leg-4', 'leg-2'],
        freelance: ['leg-6', 'leg-7', 'leg-2', 'leg-4'],
      };
      const ids = mapping[industry];
      recs = LEGAL_CATALOG.filter((item) => ids.includes(item.id));
      summary = `إليك ترشيحات العقود والاتفاقيات القانونية المناسبة لقطاعك:`;
    } else {
      recs = [
        ACCOUNTING_CATALOG.find((i) => i.id === 'acc-6')!,
        ACCOUNTING_CATALOG.find((i) => i.id === 'acc-8')!,
      ].filter(Boolean);
      summary = `إليك ترشيحات دراسات الجدوى وحساب نقطة التعادل والتسعير:`;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: summary,
        time: getCurrentTime(),
        recommendations: recs,
        quickReplies: [
          {
            label: '📞 طلب استشارة أو تخصيص هذه الحزمة',
            action: () =>
              openLeadCapture(
                `طلب استشارة وتخصيص باقة: ${recs.map((r) => r.id).join(', ')}`
              ),
          },
          {
            label: '🔄 إعادة الاستكشاف لمجال آخر',
            action: () => startRecommendationTree(),
          },
        ],
      },
    ]);
  };

  const showAllAccountingSheets = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: '📊 **كتالوج شيتات ونماذج المحاسبة لعام 2026 (acc-1 إلى acc-12)**:\nجميع الشيتات مجهزة بمعادلات إكسيل ديناميكية، حماية من الأخطاء، ومصممة وفق المعايير المحاسبية الدولية:',
        time: getCurrentTime(),
        recommendations: ACCOUNTING_CATALOG,
        actionLink: { label: 'استعراض كافة المنتجات بالسوق', href: '/#products' },
        quickReplies: [
          {
            label: '📞 طلب حزمة المحاسبة المخفضة',
            action: () => openLeadCapture('طلب حزمة الشيتات المحاسبية الكاملة (acc-1..12)'),
          },
          {
            label: '⚖️ استعراض العقود القانونية (leg-1..10)',
            action: () => showAllLegalContracts(),
          },
        ],
      },
    ]);
  };

  const showAllLegalContracts = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: '⚖️ **كتالوج العقود والاتفاقيات القانونية التجارية (leg-1 إلى leg-10)**:\nصيغ استرشادية محررة بعناية لمواءمة الممارسات التجارية وقابلة للتعديل الفوري بصيغتي Word و PDF:',
        time: getCurrentTime(),
        recommendations: LEGAL_CATALOG,
        actionLink: { label: 'استعراض كافة المنتجات بالسوق', href: '/#products' },
        quickReplies: [
          {
            label: '📞 طلب صياغة أو تخصيص عقد قانوني',
            action: () => openLeadCapture('طلب تخصيص عقد قانوني مخصص'),
          },
          {
            label: '📊 استعراض شيتات المحاسبة (acc-1..12)',
            action: () => showAllAccountingSheets(),
          },
        ],
      },
    ]);
  };

  // --- Lead Capture & API Integration ---
  const openLeadCapture = (interestTopic: string) => {
    setLeadInterest(interestTopic);
    setShowLeadPrompt(true);
    setLeadValidationError('');
    setCapturedLeadId(null);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: `يسعدنا جداً خدمتك! 🤝\nيرجى تزويدنا برقم الواتساب أو بريدك الإلكتروني وسيتواصل معك مستشار رَصين لمساعدتك فوراً في: "${interestTopic}".`,
        time: getCurrentTime(),
      },
    ]);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadValidationError('');

    const trimmedPhone = leadPhone.trim();
    const trimmedEmail = leadEmail.trim();

    // Validation
    if (!trimmedPhone && !trimmedEmail) {
      setLeadValidationError('يرجى إدخال رقم الهاتف أو البريد الإلكتروني للتواصل.');
      return;
    }

    if (trimmedPhone && !validatePhone(trimmedPhone)) {
      setLeadValidationError(
        'صيغة رقم الهاتف غير صالحة. يرجى إدخال رقم دولي صحيح (مثال: +966500000000 أو +201000000000) أو محلي (مثال: 0500000000 أو 01000000000).'
      );
      return;
    }

    if (trimmedEmail && !validateEmail(trimmedEmail)) {
      setLeadValidationError('صيغة البريد الإلكتروني غير صالحة وفقاً لمعايير RFC 5322.');
      return;
    }

    if (leadChannel === 'whatsapp' && !trimmedPhone) {
      setLeadValidationError('قناة الواتساب تتطلب تقديم رقم هاتف صالح.');
      return;
    }

    if (leadChannel === 'email' && !trimmedEmail) {
      setLeadValidationError('قناة البريد الإلكتروني تتطلب تقديم بريد إلكتروني صالح.');
      return;
    }

    setIsSubmittingLead(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName.trim() || undefined,
          phone: trimmedPhone || undefined,
          email: trimmedEmail || undefined,
          channel: leadChannel,
          interest: leadInterest,
          metadata: {
            source: 'RaseenAssistant AI Bot',
            selectedIndustry,
            submittedAt: new Date().toISOString(),
          },
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCapturedLeadId(data.leadId);
        setShowLeadPrompt(false);

        // Fire Google Analytics & Ads conversion event
        Analytics.leadCaptured(data.leadId, leadChannel, leadInterest);

        const contactRef = trimmedPhone || trimmedEmail;
        const successText =
          `✅ **تم تسجيل طلبك بنجاح!** (رقم المرجع: \`${data.leadId}\`)\n\n` +
          `سيتواصل معك مستشار رَصين عبر **${leadChannel === 'whatsapp' ? 'الواتساب' : 'البريد الإلكتروني'}** (${contactRef}) في غضون دقائق.\n\n` +
          `يمكنك أيضاً بدء محادثة فورية ومباشرة عبر الواتساب الآن:`;

        const waText = encodeURIComponent(
          `مرحباً فريق رَصين، قمت بتقديم طلب استشارة عبر المساعد الذكي برقم مرجعي: ${data.leadId} بخصوص (${leadInterest}).`
        );

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'assistant',
            text: successText,
            time: getCurrentTime(),
            actionLink: {
              label: '💬 فتح محادثة واتساب فورية الآن',
              href: `https://wa.me/201026046026?text=${waText}`,
            },
            quickReplies: [
              {
                label: '🏪 استكشاف نموذج أرباح البائعين (85%)',
                action: () => explainCreatorProfitModel(),
              },
              {
                label: '🎯 ترشيح أصول أخرى لمشروعي',
                action: () => startRecommendationTree(),
              },
            ],
          },
        ]);
      } else {
        setLeadValidationError(data.error || 'حدث خطأ أثناء معالجة طلبك، يرجى المحاولة ثانية.');
      }
    } catch (err) {
      console.error('Lead submission failed:', err);
      setLeadValidationError('تعذر الاتصال بالخادم، يرجى التأكد من اتصال الإنترنت والمحاولة مجدداً.');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // --- Dynamic Quick Replies Generator ---
  const getDynamicQuickReplies = (
    intent?: string,
    triggerLead?: boolean
  ): { label: string; action: () => void }[] => {
    const replies: { label: string; action: () => void }[] = [];

    if (triggerLead) {
      replies.push({
        label: '📞 إرسال بياناتي للتواصل عبر الواتساب',
        action: () => openLeadCapture(`طلب تواصل مباشر - استفسار ${intent || ''}`),
      });
    }

    switch (intent) {
      case 'engineering_bim':
        replies.push(
          {
            label: '🎁 تحميل حزمة Revit مجاناً (free-p1)',
            action: () => {
              const p1 = mockProducts.find((p) => p.id === 'free-p1');
              if (p1) {
                setSelectedFreeProduct(p1);
                setIsFreeModalOpen(true);
              }
            },
          },
          {
            label: '📐 استعراض قسم الهندسة والـ BIM',
            action: () => {
              const el = document.getElementById('products');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            },
          },
          {
            label: '📞 طلب مكتبة هندسية مخصصة لمكتبي',
            action: () => openLeadCapture('طلب تصميم مكتبة Revit أو بلوكات CAD مخصصة'),
          }
        );
        break;

      case 'financial_accounting':
        replies.push(
          {
            label: '🎁 تحميل شيت الميزانية والسيولة مجاناً (free-p4)',
            action: () => {
              const p4 = mockProducts.find((p) => p.id === 'free-p4');
              if (p4) {
                setSelectedFreeProduct(p4);
                setIsFreeModalOpen(true);
              }
            },
          },
          {
            label: '📊 استعراض شيتات المحاسبة (acc-1..12)',
            action: () => showAllAccountingSheets(),
          },
          {
            label: '📞 طلب استشارة مالية أو ترخيص شركات',
            action: () => openLeadCapture('طلب استشارة مالية ومحاسبية متقدمة'),
          }
        );
        break;

      case 'legal_contracts':
        replies.push(
          {
            label: '🎁 تحميل عقد العمل الحر و NDA مجاناً (free-p3)',
            action: () => {
              const p3 = mockProducts.find((p) => p.id === 'free-p3');
              if (p3) {
                setSelectedFreeProduct(p3);
                setIsFreeModalOpen(true);
              }
            },
          },
          {
            label: '⚖️ استعراض العقود القانونية (leg-1..10)',
            action: () => showAllLegalContracts(),
          },
          {
            label: '📞 طلب صياغة عقد قانوني مخصص',
            action: () => openLeadCapture('طلب صياغة عقد قانوني مخصص'),
          }
        );
        break;

      case 'business_tools':
        replies.push(
          {
            label: '🧾 مولد الفواتير الإلكترونية ZATCA',
            action: () => {
              setIsOpen(false);
              const el = document.getElementById('interactive-suite');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            },
          },
          {
            label: '📈 حاسبة نقطة التعادل وهامش الربح',
            action: () => {
              setIsOpen(false);
              const el = document.getElementById('interactive-suite');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            },
          },
          {
            label: '🔍 فاحص صحة المتاجر والسيو',
            action: () => {
              setIsOpen(false);
              const el = document.getElementById('interactive-suite');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            },
          }
        );
        break;

      case 'vendor_creator':
        replies.push(
          {
            label: '🏪 كيف أربح 85% كبائع في رَصين؟',
            action: () => explainCreatorProfitModel(),
          },
          {
            label: '💼 انضم كبائع في رَصين الآن',
            action: () => {
              window.location.href = '/vendor';
            },
          },
          {
            label: '📞 تحدث مع مسؤول انضمام البائعين',
            action: () => openLeadCapture('استفسار عن الانضمام كبائع - باقة 85% أرباح'),
          }
        );
        break;

      default:
        replies.push(
          {
            label: '🎯 شجرة ترشيح الأصول لمشروعي',
            action: () => startRecommendationTree(),
          },
          {
            label: '🏪 كيف أربح 85% كبائع في رَصين؟',
            action: () => explainCreatorProfitModel(),
          },
          {
            label: '🎁 باقة الأصول المجانية للتحميل الفوري',
            action: () => {
              const p1 = mockProducts.find((p) => p.id === 'free-p1');
              if (p1) {
                setSelectedFreeProduct(p1);
                setIsFreeModalOpen(true);
              }
            },
          },
          {
            label: '📞 حجز استشارة مع فريق المبيعات',
            action: () => openLeadCapture('طلب استشارة مباشرة مع فريق رَصين'),
          }
        );
        break;
    }

    return replies;
  };

  // --- Conversational AI Message Handler (Connected to /api/assistant/chat) ---
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: data.reply,
          time: getCurrentTime(),
          recommendedProducts: data.recommendedProducts || [],
          intent: data.intent,
          quickReplies: getDynamicQuickReplies(data.intent, data.triggerLeadCapture),
        };
        setMessages((prev) => [...prev, assistantMsg]);

        if (data.triggerLeadCapture) {
          setShowLeadPrompt(true);
          setLeadInterest(`طلب استشارة: ${text}`);
        }
      } else {
        respondToFreeText(text);
      }
    } catch {
      respondToFreeText(text);
    } finally {
      setIsTyping(false);
    }
  };

  // --- Hybrid Semantic Fallback Engine (For offline / disconnected clients) ---
  const respondToFreeText = (query: string) => {
    const q = query.toLowerCase();

    // Free Products lookup
    const freeP1 = mockProducts.find((p) => p.id === 'free-p1');
    const freeP2 = mockProducts.find((p) => p.id === 'free-p2');
    const freeP3 = mockProducts.find((p) => p.id === 'free-p3');
    const freeP4 = mockProducts.find((p) => p.id === 'free-p4');

    if (
      q.includes('ربح') ||
      q.includes('85') ||
      q.includes('بائع') ||
      q.includes('متجر') ||
      q.includes('بيع') ||
      q.includes('عمولة') ||
      q.includes('سحب')
    ) {
      explainCreatorProfitModel();
      return;
    }

    if (
      q.includes('ترشيح') ||
      q.includes('أنسب') ||
      q.includes('اختار') ||
      q.includes('قطاع') ||
      q.includes('مجال') ||
      q.includes('مشروعي')
    ) {
      startRecommendationTree();
      return;
    }

    if (
      q.includes('bim') ||
      q.includes('revit') ||
      q.includes('ريفت') ||
      q.includes('بيم') ||
      q.includes('هندس') ||
      q.includes('أوتوكاد') ||
      q.includes('autocad') ||
      q.includes('معمار') ||
      q.includes('boq') ||
      q.includes('حصر')
    ) {
      const bimProducts = [freeP1, freeP2, mockProducts.find((p) => p.id === 'p13')].filter(Boolean) as ProductItem[];
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'assistant',
          text: '📐 **الترسانة الهندسية ونماذج BIM المعمارية والإنشائية**:\n\nنوفر للمهندسين والمقاولين عائلات Revit بارامترية (LOD 350)، وبلوكات AutoCAD (1500+ بلوك)، وشيتات حصر كميات ومقايسات BOQ.\n\n🎁 **هدية مجانية فورية**: يمكنك تنزيل **حزمة عائلات Revit التمهيدية (LOD 300)** مجاناً 100% لتجربة جودة النمذجة قبل اقتناء الترسانة الكاملة!',
          time: getCurrentTime(),
          recommendedProducts: bimProducts,
          intent: 'engineering_bim',
          actionLink: { label: 'تنزيل حزمة Revit المجانية فوراً ←', href: '/product/free-p1' },
          quickReplies: getDynamicQuickReplies('engineering_bim'),
        },
      ]);
      return;
    }

    if (
      q.includes('مجان') ||
      q.includes('هدية') ||
      q.includes('ببلاش') ||
      q.includes('free')
    ) {
      const allFree = mockProducts.filter((p) => p.price === 0);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'assistant',
          text: '🎁 **أهلاً بك في ركن الهدايا والأصول المجانية 100% من رَصين**!\n\nيمكنك تنزيل هذه الأصول فورياً وبدون أي مقابل لتسريع أعمالك:\n1. 📐 **حزمة عائلات Revit المعمارية (LOD 300)**: 35 عائلة بارامترية مجانية.\n2. 📊 **شيت مقايسات وحصر كميات البناء المبدئي (Mini BOQ)**.\n3. ⚖️ **عقد العمل الحر واتفاقية سرية المعلومات (Freelance & NDA)**.\n4. 💵 **شيت الميزانية التقديرية والتدفق النقدي**.',
          time: getCurrentTime(),
          recommendedProducts: allFree,
          actionLink: { label: 'استعراض وتحميل الأصول المجانية كلها ←', href: '/#products' },
          quickReplies: [
            {
              label: '📐 تنزيل حزمة Revit المجانية (free-p1)',
              action: () => {
                if (freeP1) {
                  setSelectedFreeProduct(freeP1);
                  setIsFreeModalOpen(true);
                }
              },
            },
            {
              label: '⚖️ تنزيل عقد العمل الحر المجاني (free-p3)',
              action: () => {
                if (freeP3) {
                  setSelectedFreeProduct(freeP3);
                  setIsFreeModalOpen(true);
                }
              },
            },
          ],
        },
      ]);
      return;
    }

    if (q.includes('شيت') || q.includes('إكسيل') || q.includes('محاسب') || q.includes('acc')) {
      showAllAccountingSheets();
      return;
    }

    if (q.includes('عقد') || q.includes('قانون') || q.includes('nda') || q.includes('leg')) {
      showAllLegalContracts();
      return;
    }

    if (q.includes('فاتورة') || q.includes('zatca') || q.includes('ضريب')) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'assistant',
          text: '🧾 يمكنك إصدار وتخصيص الفواتير الضريبية الإلكترونية المتوافقة مع معايير ZATCA والضرائب المصرية مع رمز QR فوري ومجاني في جناح الأدوات الحية أعلى الصفحة:',
          time: getCurrentTime(),
          intent: 'business_tools',
          actionLink: { label: 'فتح مولد الفواتير الإلكترونية ZATCA', href: '/#interactive-suite' },
          quickReplies: getDynamicQuickReplies('business_tools'),
        },
      ]);
      return;
    }

    if (q.includes('تعادل') || q.includes('نقطة التعادل')) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'assistant',
          text: '📈 حاسبة نقطة التعادل وهامش المساهمة متاحة مجاناً الآن في أعلى الصفحة! يمكنك تحريك أشرطة التكاليف وسعر الوحدة لمعرفة متى تبدأ بجني أرباح حقيقية يومياً.',
          time: getCurrentTime(),
          intent: 'business_tools',
          actionLink: { label: 'جرب حاسبة التعادل فوراً', href: '/#interactive-suite' },
          quickReplies: getDynamicQuickReplies('business_tools'),
        },
      ]);
      return;
    }

    if (
      q.includes('تواصل') ||
      q.includes('واتساب') ||
      q.includes('فريق') ||
      q.includes('مبيعات') ||
      q.includes('مستشار') ||
      q.includes('هاتف')
    ) {
      openLeadCapture(query);
      return;
    }

    // Default polite response
    const defaultRecs = [freeP1, freeP3, freeP4].filter(Boolean) as ProductItem[];
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: 'شكراً لتواصلك مع رَصين! 🌟 منصتنا تقدم أصولاً ونماذج إكسيل وعقوداً قانونية وأدوات إدارة أعمال ذكية تختصر 80% من جهد وتكاليف التأسيس والتشغيل. كيف تحب أن أساعدك الآن؟',
        time: getCurrentTime(),
        recommendedProducts: defaultRecs,
        intent: 'general_support',
        quickReplies: getDynamicQuickReplies('general_support'),
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2.5 bg-slate-950/90 border border-amber-400/40 text-amber-300 px-4 py-2 rounded-full text-xs font-bold shadow-2xl backdrop-blur-xl cursor-pointer hover:border-amber-300 hover:scale-105 transition-all shadow-amber-500/10"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-cairo">مستشار رَصين • المساعد الذكي</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="فتح مستشار رَصين"
          className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-transform cursor-pointer border border-amber-300"
        >
          {isOpen ? (
            <span className="text-xl font-black">✕</span>
          ) : (
            <div className="relative flex items-center justify-center">
              {/* Sleek Advisor Brand Icon */}
              <svg className="w-7 h-7 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M8 10h.01" />
                <path d="M12 10h.01" />
                <path d="M16 10h.01" />
              </svg>
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
            </div>
          )}
        </button>
      </div>

      {/* Chat Drawer / Modal */}
      {isOpen && (
        <div
          dir="rtl"
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] max-h-[640px] h-[82vh] bg-slate-950/95 border border-slate-700/80 rounded-3xl shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden text-right font-cairo text-white animate-fade-in-up"
        >
          {/* Header */}
          <div className="p-4 bg-slate-900/95 border-b border-slate-800/80 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400/20 via-slate-900 to-amber-500/10 border border-amber-400/40 flex items-center justify-center shadow-lg shadow-amber-500/10">
                <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-white tracking-wide">مستشار رَصين</span>
                  <span className="inline-flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>متصل</span>
                  </span>
                </div>
                <span className="text-[11px] text-amber-300/80 font-medium block mt-0.5">
                  المساعد الذكي • إدارة وتمكين الأعمال
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="إغلاق المحادثة"
              className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer border border-slate-700/50"
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[90%] p-3.5 rounded-2xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-bold rounded-br-none shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>

                  {/* Recommendation Asset Cards */}
                  {m.recommendations && m.recommendations.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-800">
                      <span className="text-[11px] font-bold text-amber-400 block">
                        الأصول المقترحة:
                      </span>
                      {m.recommendations.map((rec) => (
                        <div
                          key={rec.id}
                          className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 hover:border-amber-500/40 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">
                              {rec.id}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-400">
                              {rec.priceEGP} ج.م
                            </span>
                          </div>
                          <h4 className="text-[11px] font-bold text-white mt-1">{rec.title}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                            {rec.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2 pt-1 border-t border-slate-900">
                            <a
                              href={rec.link}
                              onClick={() => setIsOpen(false)}
                              className="text-[10px] font-bold text-amber-400 hover:text-amber-300 underline"
                            >
                              عرض في الكتالوج ←
                            </a>
                            <button
                              onClick={() => openLeadCapture(`طلب الأصل: [${rec.id}] ${rec.title}`)}
                              className="text-[10px] font-bold text-slate-300 hover:text-white bg-slate-800 px-2 py-0.5 rounded"
                            >
                              طلب تخصيص
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Live Recommended Product Cards (Free lead magnets prioritized) */}
                  {m.recommendedProducts && m.recommendedProducts.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-400 block">
                          الأصول والحلول المقترحة لك:
                        </span>
                        {m.intent && (
                          <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                            {m.intent}
                          </span>
                        )}
                      </div>
                      {m.recommendedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className={`p-2.5 rounded-xl border transition-all ${
                            prod.price === 0
                              ? 'bg-slate-950 border-emerald-500/40 hover:border-emerald-400 shadow-sm shadow-emerald-500/10'
                              : 'bg-slate-950 border-slate-800 hover:border-amber-500/40'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            {prod.price === 0 ? (
                              <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <span>⚡ أصل مجاني للتحميل الفوري</span>
                              </span>
                            ) : (
                              <span className="font-mono text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">
                                {prod.id}
                              </span>
                            )}
                            <span
                              className={`text-[10px] font-black ${
                                prod.price === 0 ? 'text-emerald-400' : 'text-amber-400'
                              }`}
                            >
                              {prod.price === 0 ? 'مجاناً 100%' : `${prod.price} ج.م`}
                            </span>
                          </div>

                          <h4 className="text-[11px] font-bold text-white mt-1.5 leading-snug">
                            {prod.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                            {prod.description}
                          </p>

                          {/* Action Controls */}
                          <div className="mt-2 pt-2 border-t border-slate-900 flex items-center gap-2">
                            {prod.price === 0 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedFreeProduct(prod);
                                  setIsFreeModalOpen(true);
                                }}
                                className="flex-1 py-1 px-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-lg text-[10px] flex items-center justify-center gap-1 shadow-md transition-all cursor-pointer"
                              >
                                <span>📥 تحميل مجاني فوري (1-Click)</span>
                              </button>
                            ) : (
                              <>
                                <a
                                  href={`/product/${prod.id}`}
                                  onClick={() => setIsOpen(false)}
                                  className="text-[10px] font-bold text-amber-400 hover:text-amber-300 underline"
                                >
                                  تفاصيل الأصل والشراء ←
                                </a>
                                <button
                                  type="button"
                                  onClick={() => openLeadCapture(`طلب شراء أو ترخيص: [${prod.id}] ${prod.title}`)}
                                  className="text-[10px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded transition-colors mr-auto"
                                >
                                  طلب استشارة
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Link Button */}
                  {m.actionLink && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800">
                      <a
                        href={m.actionLink.href}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 underline"
                      >
                        <span>{m.actionLink.label}</span>
                      </a>
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-slate-500 mt-1 px-1 font-mono">{m.time}</span>

                {/* Quick Reply Pills */}
                {m.quickReplies && (
                  <div className="flex flex-wrap gap-1.5 mt-2 justify-end">
                    {m.quickReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={reply.action}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-amber-500/20 hover:border-amber-500/50 text-amber-300 border border-slate-800 text-[10px] font-bold transition-all"
                      >
                        {reply.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-slate-900 p-3 rounded-2xl border border-slate-800 w-20">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            {/* In-chat Lead Capture Form */}
            {showLeadPrompt && (
              <form
                onSubmit={handleLeadSubmit}
                className="bg-slate-900 p-4 rounded-2xl border border-amber-500/40 space-y-3 mt-2 shadow-xl animate-fade-in-up"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-amber-400">
                    طلب تواصل واستشارة فورية
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowLeadPrompt(false)}
                    className="text-[10px] text-slate-400 hover:text-white"
                  >
                    إلغاء ✕
                  </button>
                </div>

                {leadInterest && (
                  <div className="text-[10px] bg-slate-950 p-2 rounded-lg border border-slate-800 text-slate-300">
                    <span className="text-amber-400 font-bold">الاهتمام:</span> {leadInterest}
                  </div>
                )}

                {/* Channel Selector */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLeadChannel('whatsapp')}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                      leadChannel === 'whatsapp'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    💬 واتساب (WhatsApp)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeadChannel('email')}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                      leadChannel === 'email'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    ✉️ بريد إلكتروني (Email)
                  </button>
                </div>

                {/* Name */}
                <div>
                  <input
                    type="text"
                    placeholder="الاسم (اختياري)"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Phone */}
                <div>
                  <input
                    type="tel"
                    placeholder="رقم الواتساب: +966500000000 أو 01000000000"
                    value={leadPhone}
                    onChange={(e) => {
                      setLeadPhone(e.target.value);
                      setLeadValidationError('');
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-left font-mono"
                    dir="ltr"
                  />
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    placeholder="البريد الإلكتروني: name@company.com"
                    value={leadEmail}
                    onChange={(e) => {
                      setLeadEmail(e.target.value);
                      setLeadValidationError('');
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-left font-mono"
                    dir="ltr"
                  />
                </div>

                {/* Validation Error Banner */}
                {leadValidationError && (
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px] leading-relaxed">
                    ⚠️ {leadValidationError}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmittingLead}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-black rounded-lg text-xs transition-all shadow-lg shadow-amber-500/20"
                >
                  {isSubmittingLead ? 'جاري الإرسال والتسجيل...' : 'إرسال طلب التواصل الآن ←'}
                </button>
              </form>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Free-form Input */}
          <div className="p-3 bg-slate-900 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="اكتب سؤالك (مثلاً: كيف أربح 85% كبائع؟ أو شيتات المحاسبة)..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 flex items-center justify-center font-black transition-colors shrink-0"
              >
                ←
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Free Download Modal Triggered Directly from Assistant */}
      <FreeDownloadModal
        isOpen={isFreeModalOpen}
        product={selectedFreeProduct}
        onClose={() => {
          setIsFreeModalOpen(false);
          setSelectedFreeProduct(null);
        }}
      />
    </>
  );
}
