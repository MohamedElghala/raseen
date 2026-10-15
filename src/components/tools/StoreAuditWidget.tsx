'use client';

import React, { useState } from 'react';

interface AuditCheck {
  id: string;
  category: string;
  title: string;
  description: string;
  impactScore: number;
}

const AUDIT_QUESTIONS: AuditCheck[] = [
  {
    id: 'mobile_speed',
    category: 'السرعة وتجربة الجوال',
    title: 'سرعة التحميل وتوافق الهواتف الذكية',
    description: 'هل يتم تحميل متجرك أو موقعك في أقل من 2.5 ثانية على شبكة 4G الجوال؟',
    impactScore: 20,
  },
  {
    id: 'local_payments',
    category: 'بوابات الدفع المحلي',
    title: 'توفير طرق دفع سريعة (Apple Pay / Mada / إنستاباي)',
    description: 'هل تتيح للعميل إتمام الدفع بنقرة واحدة عبر أبل باي ومدى وفودافون كاش دون تعقيد؟',
    impactScore: 25,
  },
  {
    id: 'seo_schema',
    category: 'السيو والظهور في جوجل',
    title: 'البيانات المنظمة لمنتجاتك (Schema Markup & Rich Snippets)',
    description: 'هل تظهر أسعار وتقييمات منتجاتك ونجوم المراجعة مباشرة في نتائج بحث Google؟',
    impactScore: 20,
  },
  {
    id: 'trust_legal',
    category: 'الثقة والحماية القانونية',
    title: 'سياسة الاستبدال والضمان والترخيص التجاري الموثق',
    description: 'هل تضع رقم السجل التجاري / معروف وسياسة إرجاع واضحة تمنح المشتري أماناً 100%؟',
    impactScore: 15,
  },
  {
    id: 'bundle_conversion',
    category: 'تعظيم قيمة سلة المشتري (AOV)',
    title: 'عروض الحزم الذكية وزيادة المبيعات (Order Bumps & Bundles)',
    description: 'هل تعرض باقات مجمعة أو توصيات ذكية داخل صفحة الدفع لرفع متوسط قيمة الطلب؟',
    impactScore: 20,
  },
];

export default function StoreAuditWidget() {
  const [storeName, setStoreName] = useState('');
  const [storeType, setStoreType] = useState('salla');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    mobile_speed: true,
    local_payments: true,
    trust_legal: true,
  });
  const [hasCalculated, setHasCalculated] = useState(false);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalScore = Object.entries(checkedItems).reduce((sum, [id, val]) => {
    if (!val) return sum;
    const item = AUDIT_QUESTIONS.find((q) => q.id === id);
    return sum + (item?.impactScore || 0);
  }, 0);

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: 'ممتاز وعالي التحويل 🚀', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (score >= 50) return { label: 'جيد ويحتاج تحسينات ⚠️', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    return { label: 'مهدد بنزيف المبيعات 🚨', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
  };

  const badge = getScoreBadge(totalScore);

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6 text-white text-right font-cairo">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold mb-2">
            <span>🔍</span>
            <span>فاحص صحة المتاجر والسيو ومعدل التحويل 2026</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            افحص كفاءة متجرك ومعدل إتمام الشراء مجاناً
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            اكتشف أين تتسرب المبيعات وأصلح نقاط الضعف لرفع أرباحك بنسبة تصل إلى +45%.
          </p>
        </div>

        {/* Store Type Selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs self-start sm:self-auto font-bold">
          {[
            { id: 'salla', label: 'سلة (Salla)' },
            { id: 'zid', label: 'زد (Zid)' },
            { id: 'shopify', label: 'شوبيفاي' },
            { id: 'custom', label: 'موقع مستقل' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setStoreType(type.id)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                storeType === type.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input & Live Check List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Check Items Column */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="mb-3">
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              رابط أو اسم متجرك / مشروعك (اختياري للتقييم المخصص)
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="مثال: mybrand.com أو متجر الأناقة"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

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
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-white">
                        {q.title}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full">
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

            {/* Score Ring / Bar */}
            <div className="flex items-center gap-4 py-2">
              <div className="text-5xl font-black font-mono text-cyan-400">
                {totalScore}
                <span className="text-lg font-normal text-slate-500">/100</span>
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-400 transition-all duration-500 rounded-full"
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
              <span className="text-xs font-bold text-slate-300 block">نصائح فورية لرفع مبيعاتك:</span>
              
              {!checkedItems.mobile_speed && (
                <div className="text-[11px] text-amber-300 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                  ⚡ <strong>السرعة حرجة:</strong> كل ثانية تأخير تُفقدك 7% من المبيعات. ضغط الصور وتفعيل الكاش يرفع التحويل فوراً.
                </div>
              )}

              {!checkedItems.local_payments && (
                <div className="text-[11px] text-rose-300 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                  💳 <strong>عائق الدفع:</strong> 68% من عملاء الخليج ومصر يفضلون Apple Pay وإنستاباي. تفعيلها يقلل السلات المتروكة.
                </div>
              )}

              {!checkedItems.seo_schema && (
                <div className="text-[11px] text-cyan-300 bg-cyan-500/10 p-2.5 rounded-lg border border-cyan-500/20">
                  🔍 <strong>السيو الذهبي:</strong> استخدم قوالب السيو وبيانات Schema لتظهر منتجاتك مجاناً في صدارة جوجل.
                </div>
              )}

              {totalScore === 100 && (
                <div className="text-[11px] text-emerald-300 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                  🌟 <strong>متجرك في القمة:</strong> حافظ على هذا المستوى واستفد من خزنة برومبتات التسويق لإطلاق حملات إعلانية مربحة.
                </div>
              )}
            </div>
          </div>

          {/* Quick CTA to relevant assets */}
          <div className="pt-3 border-t border-slate-800">
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
