'use client';

import React, { useState, useMemo } from 'react';

export default function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState<number>(15000); // تكاليف ثابتة شهرية (إيجار، رواتب، أدوات)
  const [unitPrice, setUnitPrice] = useState<number>(250);     // سعر بيع الوحدة / الخدمة
  const [unitCost, setUnitCost] = useState<number>(100);       // التكلفة المتغيرة للوحدة (تكلفة الإنتاج أو التسليم)
  const [targetProfit, setTargetProfit] = useState<number>(10000); // هدف الربح الشهري المطلوب
  const [currency, setCurrency] = useState<'SAR' | 'EGP' | 'AED' | 'USD'>('SAR');

  const currencySymbols: Record<string, string> = {
    SAR: 'ر.س',
    EGP: 'ج.م',
    AED: 'د.إ',
    USD: '$',
  };

  const curr = currencySymbols[currency] || 'ر.س';

  const stats = useMemo(() => {
    const contributionMargin = Math.max(0, unitPrice - unitCost);
    const marginRatio = unitPrice > 0 ? (contributionMargin / unitPrice) * 100 : 0;
    
    // عدد الوحدات للتعادل (Break-even Units)
    const breakEvenUnits = contributionMargin > 0 ? Math.ceil(fixedCosts / contributionMargin) : 0;
    
    // إيراد التعادل (Break-even Revenue)
    const breakEvenRevenue = breakEvenUnits * unitPrice;

    // وحدات لتحقيق الربح المستهدف
    const targetUnits = contributionMargin > 0 ? Math.ceil((fixedCosts + targetProfit) / contributionMargin) : 0;
    const targetRevenue = targetUnits * unitPrice;

    return {
      contributionMargin,
      marginRatio: marginRatio.toFixed(1),
      breakEvenUnits,
      breakEvenRevenue,
      targetUnits,
      targetRevenue,
      isViable: contributionMargin > 0,
    };
  }, [fixedCosts, unitPrice, unitCost, targetProfit]);

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6 text-white text-right font-cairo">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold mb-2">
            <span>📈</span>
            <span>حاسبة التعادل وهامش الأرباح التفاعلية</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            متى يبدأ مشروعك بجني أرباح حقيقية؟
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            حدد تكاليفك الثابتة وسعر بيع وحدتك لاكتشاف نقطة الأمان المالي وتوقعات النمو بدقة متناهية.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          {(['SAR', 'AED', 'EGP', 'USD'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                currency === c
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Inputs vs Real-time Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-5 bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
          
          {/* 1. Fixed Costs */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm font-bold">
              <span className="text-slate-300">التكاليف الثابتة شهرياً (رواتب، إيجار، خوادم، تسويق أساسي)</span>
              <span className="text-amber-400 font-mono text-sm">{fixedCosts.toLocaleString()} {curr}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={150000}
              step={500}
              value={fixedCosts}
              onChange={(e) => setFixedCosts(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1,000 {curr}</span>
              <span>150,000 {curr}</span>
            </div>
          </div>

          {/* 2. Unit Selling Price */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm font-bold">
              <span className="text-slate-300">سعر بيع الوحدة / الخدمة للعميل</span>
              <span className="text-emerald-400 font-mono text-sm">{unitPrice.toLocaleString()} {curr}</span>
            </div>
            <input
              type="range"
              min={10}
              max={5000}
              step={10}
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10 {curr}</span>
              <span>5,000 {curr}</span>
            </div>
          </div>

          {/* 3. Variable Cost per Unit */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm font-bold">
              <span className="text-slate-300">التكلفة المتغيرة للوحدة (خامات، عمولة، شحن، تنفيذ)</span>
              <span className="text-rose-400 font-mono text-sm">{unitCost.toLocaleString()} {curr}</span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.max(10, unitPrice - 5)}
              step={5}
              value={unitCost}
              onChange={(e) => setUnitCost(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 {curr}</span>
              <span>{Math.max(10, unitPrice - 5).toLocaleString()} {curr}</span>
            </div>
          </div>

          {/* 4. Target Profit */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs sm:text-sm font-bold">
              <span className="text-cyan-300">الربح الصافي المستهدف شهرياً</span>
              <span className="text-cyan-400 font-mono text-sm">{targetProfit.toLocaleString()} {curr}</span>
            </div>
            <input
              type="range"
              min={0}
              max={200000}
              step={1000}
              value={targetProfit}
              onChange={(e) => setTargetProfit(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 {curr} (التعادل فقط)</span>
              <span>200,000 {curr}</span>
            </div>
          </div>
        </div>

        {/* Results & Insights Column */}
        <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
          
          {/* Top Key Result Cards */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Break-Even Units */}
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl relative overflow-hidden">
              <div className="text-[11px] font-bold text-amber-400 mb-1">نقطة التعادل (Break-even)</div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                {stats.breakEvenUnits.toLocaleString()}
                <span className="text-xs font-normal text-slate-300 mr-1.5">مبيعة</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                بقيمة <span className="text-white font-bold font-mono">{stats.breakEvenRevenue.toLocaleString()} {curr}</span>
              </div>
            </div>

            {/* Profit Margin Ratio */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl relative overflow-hidden">
              <div className="text-[11px] font-bold text-emerald-400 mb-1">هامش المساهمة للوحدة</div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                %{stats.marginRatio}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                ربح الوحدة: <span className="text-white font-bold font-mono">{stats.contributionMargin.toLocaleString()} {curr}</span>
              </div>
            </div>
          </div>

          {/* Target Profit Achievement Card */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span>🎯</span>
                <span>لتحقيق صافي ربح {targetProfit.toLocaleString()} {curr}:</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                الهدف الشهري
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono">
                  {stats.targetUnits.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 mr-2">وحدة / طلب شهرياً</span>
              </div>
              <div className="text-left text-xs font-mono text-slate-300">
                إجمالي إيراد: <span className="text-white font-bold">{stats.targetRevenue.toLocaleString()} {curr}</span>
              </div>
            </div>

            {/* Daily Pace */}
            <div className="bg-slate-900 p-2.5 rounded-xl flex items-center justify-between text-xs text-slate-400">
              <span>المعدل اليومي المطلوب (30 يوم):</span>
              <span className="text-amber-400 font-bold font-mono">
                {(stats.targetUnits / 30).toFixed(1)} طلب / يوم
              </span>
            </div>
          </div>

          {/* Action Callout */}
          <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-cyan-500/10 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-white block">تريد دراسة جدوى مالية متكاملة بملف إكسيل؟</span>
              <span className="text-[11px] text-slate-400">احصل على شيت التدفقات النقدية والموازنات المعتمد 2026</span>
            </div>
            <a
              href="#products"
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-all shadow-md shrink-0 mr-2"
            >
              استعراض الشيتات ←
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
