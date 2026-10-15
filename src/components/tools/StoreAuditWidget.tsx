'use client';

import React, { useState, useMemo } from 'react';
import { Analytics } from '@/lib/analytics';

interface AuditCheck {
  id: string;
  category: string;
  title: string;
  description: string;
  impactScore: number;
  icon: string;
  advice: {
    general: string;
    salla: string;
    zid: string;
    shopify: string;
    custom: string;
  };
}

const AUDIT_QUESTIONS: AuditCheck[] = [
  {
    id: 'mobile_speed',
    category: 'السرعة وتجربة الجوال',
    title: 'سرعة التحميل وتوافق الهواتف الذكية (Core Web Vitals)',
    description: 'هل يتم تحميل متجرك أو موقعك في أقل من 2.5 ثانية على شبكة 4G الجوال ومعدل LCP ممتاز؟',
    impactScore: 20,
    icon: '⚡',
    advice: {
      general: 'كل ثانية تأخير تُفقدك 7% من المبيعات. ضغط الصور وتفعيل الكاش وشبكة CDN يرفع التحويل فوراً.',
      salla: 'في سلة: قم بتفعيل ضغط الصور التلقائي واختر قالباً حديثاً خفيفاً وتجنب التطبيقات غير المستخدمة.',
      zid: 'في زد: تأكد من تحسين وسائط المنتجات واختيار ثيم متجاوب فائق السرعة من متجر تطبيقات زد.',
      shopify: 'في شوبيفاي: احذف التطبيقات الزائدة واستخدم صيغ WebP للصور مع ثيم Dawn أو Horizon.',
      custom: 'في المواقع المخصصة: استخدم Next.js Image Optimization وخوادم Cloudflare Edge Caching.',
    },
  },
  {
    id: 'local_payments',
    category: 'بوابات الدفع المحلي',
    title: 'توفير طرق دفع سريعة (Apple Pay / Mada / إنستاباي)',
    description: 'هل تتيح للعميل إتمام الدفع بنقرة واحدة عبر أبل باي ومدى وإنستاباي دون تحويلات بنكية معقدة؟',
    impactScore: 20,
    icon: '💳',
    advice: {
      general: 'أكثر من 72% من مشتري الخليج ومصر يفضلون الدفع بنقرة واحدة. غياب Apple Pay يسبب التخلي عن السلة.',
      salla: 'في سلة: فعّل ميزة "سلة باي" لتشغيل مدى وأبل باي فورياً وبدون رسوم تأسيس.',
      zid: 'في زد: فعّل "زد باي" لتمكين كافة بوابات الدفع المحلية والتقسيط عبر تابي وتمارا.',
      shopify: 'في شوبيفاي: اربط بوابة دفع تدعم مدى والخليج مثل Tap أو Moyasar أو PayTabs.',
      custom: 'في المواقع المخصصة: ادمج واجهات Moyasar API أو Tap Payments أو فواتير إنستاباي الآلية.',
    },
  },
  {
    id: 'seo_schema',
    category: 'السيو والظهور في جوجل',
    title: 'البيانات المنظمة لمنتجاتك (Schema Markup & Rich Snippets)',
    description: 'هل تظهر أسعار وتقييمات منتجاتك ونجوم المراجعة وتوفر المخزون مباشرة في نتائج بحث Google؟',
    impactScore: 20,
    icon: '🔍',
    advice: {
      general: 'بيانات Schema تمنح متجرك Rich Snippets مجانية ترفع نسبة النقر CTR بأكثر من +30%.',
      salla: 'في سلة: تأكد من تفعيل إعدادات السيو المتقدمة في صفحة كل منتج وتعبئة الوصف التعريفي.',
      zid: 'في زد: استخدم قالب يدعم Schema Product الافتراضية واكتب عناوين ووصف منتجات غني بالكلمات المفتاحية.',
      shopify: 'في شوبيفاي: ثبت تطبيق JSON-LD for SEO أو عدل كود liquid لتضمين Product Schema.',
      custom: 'في المواقع المخصصة: ضمن وسم Structured Data script type="application/ld+json" في كل صفحة منتج.',
    },
  },
  {
    id: 'trust_legal',
    category: 'الثقة والحماية القانونية',
    title: 'السجل التجاري، التوثيق، وسياسة الاستبدال والضمان',
    description: 'هل تضع رقم السجل التجاري / معروف وسياسة إرجاع وضمان واضحة تمنح المشتري أماناً 100%؟',
    impactScore: 20,
    icon: '🛡️',
    advice: {
      general: 'المستهلك العربي يبحث عن الأمان أولاً. غياب بيانات التوثيق يخفض معدل إتمام الطلب بمقدار النصف.',
      salla: 'في سلة: اربط وثيقة العمل الحر أو السجل التجاري ليظهر شارة "متجر موثق" في الفوتر وصفحة الدفع.',
      zid: 'في زد: أضف أختام التوثيق التجاري في ترويسة المتجر وصفحات الهبوط.',
      shopify: 'في شوبيفاي: أنشئ صفحات ثابتة لسياسة الاسترجاع والشحن والشروط وأضف روابطها في الفوتر.',
      custom: 'في المواقع المخصصة: ادمج أختام الأمان وشهادة SSL وبيانات الضريبة ورقم السجل التجاري الموثق.',
    },
  },
  {
    id: 'bundle_conversion',
    category: 'تعظيم قيمة سلة المشتري (AOV)',
    title: 'عروض الحزم الذكية وزيادة المبيعات (Order Bumps & Upsells)',
    description: 'هل تعرض باقات مجمعة أو توصيات ذكية داخل صفحة الدفع لرفع متوسط قيمة الطلب؟',
    impactScore: 20,
    icon: '🚀',
    advice: {
      general: 'عروض الحزم والـ Upsell ترفع متوسط قيمة الطلب (AOV) بنسبة 25-40% دون زيادة ميزانية الإعلانات.',
      salla: 'في سلة: فعّل ميزة "عروض الحزم والكميات" وتطبيق الخصومات الذكية عند شراء أكثر من قطعة.',
      zid: 'في زد: استخدم تطبيق الباقات والعروض الترويجية في متجر تطبيقات زد.',
      shopify: 'في شوبيفاي: استخدم تطبيقات مثل ReConvert أو WideBundle لتفعيل Order Bumps فورية.',
      custom: 'في المواقع المخصصة: برمج حزم العروض التفاعلية (Bundle Deals) وخصومات السلة التلقائية.',
    },
  },
];

export default function StoreAuditWidget() {
  const [storeName, setStoreName] = useState('');
  const [storeType, setStoreType] = useState<'salla' | 'zid' | 'shopify' | 'custom'>('salla');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    mobile_speed: true,
    local_payments: true,
    trust_legal: true,
  });
  const [copied, setCopied] = useState(false);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const selectAll = () => {
    const all: Record<string, boolean> = {};
    AUDIT_QUESTIONS.forEach((q) => (all[q.id] = true));
    setCheckedItems(all);
  };

  const deselectAll = () => {
    const none: Record<string, boolean> = {};
    AUDIT_QUESTIONS.forEach((q) => (none[q.id] = false));
    setCheckedItems(none);
  };

  const totalScore = useMemo(() => {
    return Object.entries(checkedItems).reduce((sum, [id, val]) => {
      if (!val) return sum;
      const item = AUDIT_QUESTIONS.find((q) => q.id === id);
      return sum + (item?.impactScore || 0);
    }, 0);
  }, [checkedItems]);

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: 'ممتاز وعالي التحويل 🚀', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (score >= 50) return { label: 'متوسط ويحتاج تحسينات ⚠️', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    return { label: 'حرج ومهدد بنزيف المبيعات 🚨', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
  };

  const badge = getScoreBadge(totalScore);

  const storePlatformNames: Record<string, string> = {
    salla: 'سلة (Salla)',
    zid: 'زد (Zid)',
    shopify: 'شوبيفاي (Shopify)',
    custom: 'موقع مستقل (Custom)',
  };

  const handleCopyReport = () => {
    const name = storeName.trim() || 'متجري الإلكتروني';
    const missing = AUDIT_QUESTIONS.filter((q) => !checkedItems[q.id]);
    
    let report = `📊 تقرير فحص صحة المتجر والسيو (${name})\n`;
    report += `المنصة: ${storePlatformNames[storeType]}\n`;
    report += `النتيجة الإجمالية: ${totalScore}/100 (${badge.label})\n\n`;
    
    if (missing.length === 0) {
      report += `✅ متجرك استوفى جميع المعايير الـ 5 بنجاح تام! جاهز لحملات تسويقية موسعة.\n`;
    } else {
      report += `📌 التوصيات الفورية للإصلاح:\n`;
      missing.forEach((item, idx) => {
        const advice = item.advice[storeType] || item.advice.general;
        report += `${idx + 1}. ${item.title}: ${advice}\n`;
      });
    }
    report += `\nتم الفحص بواسطة منصة رَصين (raseen.me)`;

    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      Analytics.toolUsed('store_audit', { score: totalScore, storeType });
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6 text-white text-right font-cairo">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold mb-2">
            <span>🔍</span>
            <span>فاحص صحة المتاجر والسيو ومعدل التحويل (Store Health Audit 100)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            افحص كفاءة متجرك ومعدل إتمام الشراء مجاناً
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            قيّم متجرك من 100 نقطة واكتشف أين تتسرب المبيعات وأصلح نقاط الضعف لرفع أرباحك بنسبة تصل إلى +45%.
          </p>
        </div>

        {/* Store Type Selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs self-start sm:self-auto font-bold">
          {(['salla', 'zid', 'shopify', 'custom'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setStoreType(type)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                storeType === type
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {storePlatformNames[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Input & Live Check List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Check Items Column */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                رابط أو اسم متجرك / مشروعك (اختياري للتقرير المخصص)
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="مثال: mybrand.com أو متجر الأناقة"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Quick check helpers */}
            <div className="flex items-center gap-1.5 self-end pb-0.5">
              <button
                type="button"
                onClick={selectAll}
                className="text-[10px] px-2.5 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors font-medium"
              >
                تحديد الكل
              </button>
              <button
                type="button"
                onClick={deselectAll}
                className="text-[10px] px-2.5 py-1.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors font-medium"
              >
                إلغاء التحديد
              </button>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-2.5">
            {AUDIT_QUESTIONS.map((q) => {
              const isChecked = !!checkedItems[q.id];
              return (
                <div
                  key={q.id}
                  onClick={() => toggleCheck(q.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isChecked
                      ? 'bg-cyan-950/20 border-cyan-500/40 hover:border-cyan-500'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors font-bold text-xs ${
                      isChecked
                        ? 'bg-cyan-500 text-slate-950'
                        : 'border border-slate-700 bg-slate-900 text-transparent'
                    }`}
                  >
                    ✓
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{q.icon}</span>
                        <span>{q.title}</span>
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isChecked ? 'text-cyan-300 bg-cyan-500/20' : 'text-slate-500 bg-slate-800'
                      }`}>
                        +{q.impactScore} نقطة
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {q.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Scorecard & Action Recommendations */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">معدل صحة وكفاءة المتجر:</span>
              <span className={`text-xs px-2.5 py-1 rounded-full border font-bold ${badge.color}`}>
                {badge.label}
              </span>
            </div>

            {/* Score Display & Progress Bar */}
            <div className="flex items-center gap-4 py-2">
              <div className="text-5xl font-black font-mono text-cyan-400">
                {totalScore}
                <span className="text-lg font-normal text-slate-500">/100</span>
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-400 transition-all duration-500 rounded-full shadow-lg"
                    style={{ width: `${totalScore}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 flex justify-between font-mono">
                  <span>ضعيف (0)</span>
                  <span>متوسط (50)</span>
                  <span>محترف (100)</span>
                </div>
              </div>
            </div>

            {/* Targeted Recommendations */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">نصائح مخصصة لمنصة {storePlatformNames[storeType]}:</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {AUDIT_QUESTIONS.filter(q => !checkedItems[q.id]).length} نقاط تحسين
                </span>
              </div>

              {AUDIT_QUESTIONS.filter((q) => !checkedItems[q.id]).map((q) => (
                <div
                  key={q.id}
                  className="text-[11px] text-slate-300 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 space-y-1"
                >
                  <div className="flex items-center gap-1.5 font-bold text-amber-400">
                    <span>{q.icon}</span>
                    <span>{q.title}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    {q.advice[storeType] || q.advice.general}
                  </p>
                </div>
              ))}

              {totalScore === 100 && (
                <div className="text-[11px] text-emerald-300 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                  🌟 <strong>متجرك في القمة بنسبة 100/100!</strong> جاهز تماماً لاستقبال الزوار بدون تسرب مبيعات. استخدم باقات رَصين الإعلانية وبرومبتات التسويق للنمو.
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons: Copy Report & Explore Catalog */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <button
              type="button"
              onClick={handleCopyReport}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-700 cursor-pointer"
            >
              <span>{copied ? '✓ تم نسخ التقرير للحافظة' : '📋 نسخ تقرير الفحص ومشاركته'}</span>
            </button>

            <a
              href="#products"
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <span>احصل على قوالب وأدوات رفع المبيعات</span>
              <span>←</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
