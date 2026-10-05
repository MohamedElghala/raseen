'use client';

import React, { useState } from 'react';

interface HeroProps {
  onSearch: (query: string) => void;
}

const POPULAR_SEARCH_TAGS = [
  'شيت تدفقات نقدية',
  'عقود عمل وتأسيس',
  'قالب Pitch Deck',
  'سيرة ذاتية ATS',
  'بلوكات AutoCAD',
  'داشبورد Power BI',
  'نظام Notion',
];

export default function Hero({ onSearch }: HeroProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChipClick = (tag: string) => {
    setQuery(tag);
    onSearch(tag);
  };

  return (
    <section className="relative w-full py-16 px-4 md:py-24 bg-rawnaq-dark border-b border-rawnaq-border overflow-hidden">
      {/* Background glow and subtle grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rawnaq-gold/10 via-rawnaq-dark to-rawnaq-dark pointer-events-none"></div>
      <div className="absolute -top-40 right-1/4 w-96 h-96 bg-rawnaq-gold/5 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Right Column (Text, Headline, and Search) */}
          <div className="lg:col-span-7 flex flex-col items-start text-right">
            
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full bg-rawnaq-surface border border-rawnaq-gold/30 text-rawnaq-gold text-xs font-mono font-bold shadow-lg shadow-black/50">
              <span className="w-2 h-2 rounded-full bg-rawnaq-gold animate-ping"></span>
              <span>المنصة المعتمدة 2026 للأصول الرقمية والإبداعية</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.18] tracking-tight">
              أدوات وشيتات وقوالب ذكية <br />
              <span className="gold-gradient-text">
                تختصر سنوات من جهدك وعملك
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-xl mb-8 leading-relaxed font-normal">
              منظومة تنفيذية موثوقة تضم نماذج مالية مؤتمتة، عقود قانونية معتمدة، قوالب نوشن وكانفا تفاعلية، ومكتبات هندسية جاهزة للتطبيق الفوري دون تعقيد.
            </p>

            {/* Smart Search Bar */}
            <form onSubmit={handleSubmit} className="w-full max-w-xl relative mb-4 flex items-center shadow-2xl shadow-black/80">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  onSearch(e.target.value);
                }}
                placeholder="ابحث عن: شيت إكسيل، عقد شراكة، قالب Pitch Deck، بلوكات CAD..."
                aria-label="ابحث عن المنتجات والأصول الرقمية"
                className="w-full h-14 pl-4 pr-12 rounded-r-xl bg-rawnaq-surface border border-rawnaq-border text-white placeholder-slate-400 focus:outline-none focus:border-rawnaq-gold transition-colors text-sm sm:text-base font-cairo"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
                🔍
              </span>
              <button
                type="submit"
                aria-label="بحث"
                className="btn-gold !rounded-r-none !rounded-l-xl !h-14 !px-6 sm:!px-8 text-sm sm:text-base font-bold whitespace-nowrap flex items-center gap-1.5"
              >
                <span>بحث</span>
                <span>←</span>
              </button>
            </form>

            {/* Search Suggestion Chips */}
            <div className="flex flex-wrap items-center gap-2 mb-8 max-w-xl">
              <span className="text-xs text-slate-400">الأكثر طلباً:</span>
              {POPULAR_SEARCH_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleChipClick(tag)}
                  className="text-xs px-2.5 py-1 bg-rawnaq-surface border border-rawnaq-border hover:border-rawnaq-gold hover:text-rawnaq-gold text-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Micro Highlights Strip */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 pt-4 border-t border-rawnaq-border/60 w-full max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-rawnaq-gold text-base">⚡</span>
                <span>تحميل فوري في ثوانٍ</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 text-base">🛡️</span>
                <span>فحص وتدقيق 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 text-base">📄</span>
                <span>رخص استخدام موثقة</span>
              </div>
            </div>

          </div>

          {/* Left Column: High-Tech Animated Asset Engine Component */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            
            {/* Ambient Background Aura */}
            <div className="absolute inset-0 bg-gradient-to-br from-rawnaq-gold/20 via-cyan-500/10 to-transparent rounded-3xl blur-2xl opacity-60"></div>

            {/* High-Tech Terminal Card */}
            <div className="relative w-full max-w-md bg-rawnaq-surface/90 backdrop-blur-xl border border-rawnaq-border rounded-2xl p-6 shadow-2xl space-y-4 hover:border-rawnaq-gold/50 transition-all duration-300">
              
              {/* Terminal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-rawnaq-border">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                  <span className="text-[11px] font-mono text-slate-400 mr-2">RASEEN CORE v2.6</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>أتمتة ذكية LIVE</span>
                </div>
              </div>

              {/* Automation Code Simulation Box */}
              <div className="bg-rawnaq-dark/80 rounded-xl p-3.5 border border-rawnaq-border/70 font-mono text-xs space-y-2">
                <div className="text-slate-400 flex items-center justify-between text-[11px]">
                  <span>// أتمتة النماذج الحسابية</span>
                  <span className="text-rawnaq-gold">Excel Engine</span>
                </div>
                <div className="text-emerald-400 text-xs font-bold break-all">
                  =XLOOKUP(Asset, RaseenDB, InstantValue)
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-rawnaq-border/40 text-[11px]">
                  <span className="text-slate-400">معدل العائد الداخلي (IRR):</span>
                  <span className="text-rawnaq-gold font-bold">+34.8% سنوياً</span>
                </div>
              </div>

              {/* Animated Floating Feature Badges */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                
                <div className="p-3 bg-rawnaq-accent/40 border border-rawnaq-border rounded-xl space-y-1 hover:border-cyan-400/40 transition-colors">
                  <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-bold">
                    <span>🎨</span>
                    <span>استوديو كانفا</span>
                  </div>
                  <span className="text-[11px] text-slate-300 block">تعديل مباشر وطباعة A4</span>
                  <span className="text-[9px] font-mono text-cyan-400">1-CLICK EDIT</span>
                </div>

                <div className="p-3 bg-rawnaq-accent/40 border border-rawnaq-border rounded-xl space-y-1 hover:border-emerald-400/40 transition-colors">
                  <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold">
                    <span>⚖️</span>
                    <span>عقود قانونية</span>
                  </div>
                  <span className="text-[11px] text-slate-300 block">صيغ موثقة لمصر والخليج</span>
                  <span className="text-[9px] font-mono text-emerald-400">CERTIFIED #2026</span>
                </div>

              </div>

              {/* Ease of Use Indicator Footer */}
              <div className="pt-3 border-t border-rawnaq-border/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="p-1 rounded bg-rawnaq-gold/20 text-rawnaq-gold text-xs">✓</span>
                  <span>سهولة مطلقة: جاهز بنقرة واحدة</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Zero Setup Required</span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
