'use client';

import React, { useState, useMemo } from 'react';

export default function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState<number>(15000); // تكاليف ثابتة شهرية (إيجار، رواتب، أدوات)
  const [unitPrice, setUnitPrice] = useState<number>(250);     // سعر بيع الوحدة / الخدمة
  const [unitCost, setUnitCost] = useState<number>(100);       // التكلفة المتغيرة للوحدة (تكلفة الإنتاج أو التسليم)
  const [targetProfit, setTargetProfit] = useState<number>(10000); // هدف الربح الشهري المطلوب
  const [operatingDays, setOperatingDays] = useState<number>(30); // أيام العمل الشهرية لحساب المعدل اليومي
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
    const costRatio = unitPrice > 0 ? (unitCost / unitPrice) * 100 : 0;
    
    // عدد الوحدات للتعادل (Break-even Units)
    const breakEvenUnits = contributionMargin > 0 ? Math.ceil(fixedCosts / contributionMargin) : 0;
    
    // إيراد التعادل (Break-even Revenue)
    const breakEvenRevenue = breakEvenUnits * unitPrice;

    // وحدات لتحقيق الربح المستهدف
    const targetUnits = contributionMargin > 0 ? Math.ceil((fixedCosts + targetProfit) / contributionMargin) : 0;
    const targetRevenue = targetUnits * unitPrice;

    // المعدل اليومي (Daily Run Rate)
    const days = Math.max(1, operatingDays);
    const dailyTargetUnits = (targetUnits / days).toFixed(1);
    const dailyTargetRevenue = Math.round(targetRevenue / days);
    const dailyBreakEvenUnits = (breakEvenUnits / days).toFixed(1);

    const isViable = unitPrice > unitCost;

    return {
      contributionMargin,
      marginRatio: marginRatio.toFixed(1),
      costRatio: costRatio.toFixed(1),
      breakEvenUnits,
      breakEvenRevenue,
      targetUnits,
      targetRevenue,
      dailyTargetUnits,
      dailyTargetRevenue,
      dailyBreakEvenUnits,
      isViable,
    };
  }, [fixedCosts, unitPrice, unitCost, targetProfit, operatingDays]);

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6 text-white text-right font-cairo">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold mb-2">
            <span>📈</span>
            <span>حاسبة التعادل وهامش الأرباح التفاعلية (Break-Even Engine)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            متى يبدأ مشروعك بجني أرباح حقيقية؟
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            تحكّم في تكاليفك الثابتة وسعر بيع وحدتك لاكتشاف نقطة الأمان المالي ومعدل المبيعات اليومي بدقة.
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
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
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
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
              <span className="text-slate-300">التكاليف الثابتة شهرياً (رواتب، إيجار، خوادم، تسويق)</span>
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-0.5">
                <input
                  type="number"
                  min={0}
                  max={500000}
                  value={fixedCosts}
                  onChange={(e) => setFixedCosts(Math.max(0, Number(e.target.value)))}
                  className="w-20 bg-transparent text-amber-400 font-mono text-sm text-center outline-none"
                />
                <span className="text-[11px] text-slate-400 font-mono">{curr}</span>
              </div>
            </div>
            <input
              type="range"
              min={1000}
              max={150000}
              step={500}
              value={Math.min(150000, fixedCosts)}
              onChange={(e) => setFixedCosts(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1,000 {curr}</span>
              <span>75,000 {curr}</span>
              <span>150,000 {curr}</span>
            </div>
          </div>

          {/* 2. Unit Selling Price */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
              <span className="text-slate-300">سعر بيع الوحدة / الخدمة للعميل</span>
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-0.5">
                <input
                  type="number"
                  min={1}
                  max={50000}
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Math.max(1, Number(e.target.value)))}
                  className="w-16 bg-transparent text-emerald-400 font-mono text-sm text-center outline-none"
                />
                <span className="text-[11px] text-slate-400 font-mono">{curr}</span>
              </div>
            </div>
            <input
              type="range"
              min={10}
              max={5000}
              step={10}
              value={Math.min(5000, unitPrice)}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10 {curr}</span>
              <span>2,500 {curr}</span>
              <span>5,000 {curr}</span>
            </div>
          </div>

          {/* 3. Variable Cost per Unit */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
              <span className="text-slate-300">التكلفة المتغيرة للوحدة (خامات، عمولة، شحن، تنفيذ)</span>
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-0.5">
                <input
                  type="number"
                  min={0}
                  max={50000}
                  value={unitCost}
                  onChange={(e) => setUnitCost(Math.max(0, Number(e.target.value)))}
                  className="w-16 bg-transparent text-rose-400 font-mono text-sm text-center outline-none"
                />
                <span className="text-[11px] text-slate-400 font-mono">{curr}</span>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={Math.max(10, unitPrice * 1.2)}
              step={5}
              value={unitCost}
              onChange={(e) => setUnitCost(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 {curr}</span>
              <span>{(unitPrice / 2).toLocaleString()} {curr}</span>
              <span>{Math.round(unitPrice * 1.2).toLocaleString()} {curr}</span>
            </div>

            {/* Non-viability Warning */}
            {!stats.isViable && (
              <div className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/30 p-2 rounded-xl">
                ⚠️ التكلفة المتغيرة أعلى من أو تساوي سعر البيع! هامش المساهمة بالسالب ولا يمكن الوصول لنقطة التعادل.
              </div>
            )}
          </div>

          {/* 4. Target Profit */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
              <span className="text-cyan-300">الربح الصافي المستهدف شهرياً</span>
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-0.5">
                <input
                  type="number"
                  min={0}
                  max={500000}
                  value={targetProfit}
                  onChange={(e) => setTargetProfit(Math.max(0, Number(e.target.value)))}
                  className="w-20 bg-transparent text-cyan-400 font-mono text-sm text-center outline-none"
                />
                <span className="text-[11px] text-slate-400 font-mono">{curr}</span>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={200000}
              step={1000}
              value={Math.min(200000, targetProfit)}
              onChange={(e) => setTargetProfit(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 {curr} (التعادل فقط)</span>
              <span>100,000 {curr}</span>
              <span>200,000 {curr}</span>
            </div>
          </div>

          {/* 5. Operating Days Configuration */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">أيام العمل الشهرية لحساب معدل المبيعات:</span>
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              {[
                { days: 30, label: '30 يوم (كامل الشهر)' },
                { days: 22, label: '22 يوم (أيام العمل)' },
              ].map((opt) => (
                <button
                  key={opt.days}
                  type="button"
                  onClick={() => setOperatingDays(opt.days)}
                  className={`px-2.5 py-1 text-[11px] rounded font-bold transition-all ${
                    operatingDays === opt.days
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Results & Insights Column */}
        <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
          
          {/* Top Key Result Cards */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Break-Even Units */}
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl relative overflow-hidden shadow-lg">
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
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl relative overflow-hidden shadow-lg">
              <div className="text-[11px] font-bold text-emerald-400 mb-1">هامش المساهمة للوحدة</div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                %{stats.marginRatio}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                ربح الوحدة: <span className="text-white font-bold font-mono">{stats.contributionMargin.toLocaleString()} {curr}</span>
              </div>
            </div>
          </div>

          {/* Unit Cost vs Contribution Margin Visual Ratio Meter */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-300">تشريح سعر بيع الوحدة ({unitPrice} {curr}):</span>
              <span className="text-emerald-400 font-mono font-bold">ربح صافٍ: {stats.contributionMargin} {curr}</span>
            </div>
            
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
              <div 
                className="bg-rose-500/80 transition-all duration-300"
                style={{ width: `${Math.min(100, Number(stats.costRatio))}%` }}
                title={`التكلفة المتغيرة: ${stats.costRatio}%`}
              />
              <div 
                className="bg-emerald-500 transition-all duration-300 flex-1"
                title={`هامش الربح: ${stats.marginRatio}%`}
              />
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-0.5">
              <span className="text-rose-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                تكلفة متغيرة ({stats.costRatio}%)
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                هامش المساهمة ({stats.marginRatio}%)
              </span>
            </div>
          </div>

          {/* Target Profit Achievement & Daily Run Rate Card */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3.5">
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

            {/* Daily Pace / Run Rate */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-xs">
              <div className="bg-slate-900/90 p-2.5 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block mb-0.5">معدل التعادل اليومي:</span>
                <span className="text-amber-400 font-bold font-mono text-sm">
                  {stats.dailyBreakEvenUnits} طلب / يوم
                </span>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block mb-0.5">معدل تحقيق الهدف ({operatingDays} يوم):</span>
                <span className="text-cyan-400 font-bold font-mono text-sm">
                  {stats.dailyTargetUnits} طلب / يوم
                </span>
              </div>
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
