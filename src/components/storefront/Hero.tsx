'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MobiusRibbonCanvas from './MobiusRibbonCanvas';

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
  'عقد سرية NDA',
  'حصر كميات BOQ',
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
    <section className="relative w-full pt-4 pb-8 sm:pt-6 sm:pb-10 md:pt-8 md:pb-12 bg-[#060a14] border-b border-rawnaq-border overflow-hidden">
      
      {/* ========================================================================= */}
      {/* AUTHENTIC 3D MATHEMATICAL MOBIUS STRIP BACKGROUND CANVAS */}
      {/* ========================================================================= */}
      <MobiusRibbonCanvas />

      {/* ========================================================================= */}
      {/* ABOVE-THE-FOLD COMPACT HERO CONTENT (NO SCROLL NEEDED) */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center flex flex-col items-center">
        
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-2.5 sm:mb-3 rounded-full bg-rawnaq-surface/90 border border-rawnaq-gold/40 text-rawnaq-gold text-[11px] font-mono font-bold shadow-lg backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-rawnaq-gold animate-ping" />
          <span>رَصِيـن | RASEEN • منصة الأصول الرقمية والإبداعية والعمل الحر 2026</span>
        </div>

        {/* COMPACT COMMANDING 2-LINE HEADLINE */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-3 leading-snug tracking-tight drop-shadow-xl">
          أدوات وشيتات وقوالب ذكية
          <span className="gold-gradient-text block mt-0.5 sm:mt-1 drop-shadow-[0_6px_20px_rgba(245,183,49,0.3)]">
            تختصر سنوات من جهدك وعملك
          </span>
        </h1>

        {/* Subtitle - Crisp and immediately visible without scroll */}
        <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-2xl mb-4 sm:mb-5 leading-relaxed font-normal opacity-90 drop-shadow">
          الترسانة التنفيذية الأولى في الشرق الأوسط: نماذج إكسل محاسبية مؤتمتة، عقود قانونية موثقة، قوالب كانفا حرة، ومكتبات كاد وريفت معمارية — جاهزة للاستخدام الفوري أو طلب التخصيص بواسطة مستقلين معتمدين.
        </p>

        {/* Central Search Bar */}
        <form onSubmit={handleSubmit} className="w-full max-w-xl relative mb-2.5 sm:mb-3 flex items-center shadow-xl shadow-black/80">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch(e.target.value);
            }}
            placeholder="ابحث في أكثر من 1,400 أصل: شيت محاسبة، عقد شراكة، Pitch Deck، بلوكات CAD..."
            aria-label="ابحث عن المنتجات والأصول الرقمية"
            className="w-full h-11 sm:h-12 pl-3 pr-10 sm:pr-12 rounded-r-xl bg-rawnaq-surface/95 border-2 border-rawnaq-border text-white placeholder-slate-400 focus:outline-none focus:border-rawnaq-gold transition-all text-xs sm:text-sm font-cairo backdrop-blur-xl"
          />
          <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">
            🔍
          </span>
          <button
            type="submit"
            aria-label="بحث فوري"
            className="btn-gold !rounded-r-none !rounded-l-xl !h-11 sm:!h-12 !px-5 sm:!px-7 text-xs sm:text-sm font-black whitespace-nowrap flex items-center gap-1.5 shadow-lg hover:scale-[1.02] transition-transform"
          >
            <span>بحث</span>
            <span>←</span>
          </button>
        </form>

        {/* Popular Tags Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4 sm:mb-5 max-w-2xl">
          <span className="text-[11px] text-slate-400 font-bold">الأكثر طلباً:</span>
          {POPULAR_SEARCH_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleChipClick(tag)}
              className="text-[11px] px-2.5 py-1 bg-rawnaq-surface/80 border border-rawnaq-border hover:border-rawnaq-gold hover:text-rawnaq-gold text-slate-300 rounded-lg transition-all cursor-pointer backdrop-blur-sm shadow-sm"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 4 Pillars Interactive Floating Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 w-full max-w-3xl pt-1">
          
          <div className="p-2.5 sm:p-3 rounded-xl bg-rawnaq-surface/70 border border-rawnaq-border/80 backdrop-blur-md hover:border-emerald-500/50 transition-all text-right group">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xl p-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">📊</span>
              <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">شيتات Excel الذكية</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight">معادلات مؤتمتة وحسابات فورية</p>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-rawnaq-surface/70 border border-rawnaq-border/80 backdrop-blur-md hover:border-amber-500/50 transition-all text-right group">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xl p-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">⚖️</span>
              <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">عقود قانونية موثقة</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight">لمصر والسعودية والإمارات</p>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-rawnaq-surface/70 border border-rawnaq-border/80 backdrop-blur-md hover:border-cyan-500/50 transition-all text-right group">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xl p-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">🎨</span>
              <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">قوالب Canva حرة</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight">تعديل بالمتصفح وطباعة A4</p>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-rawnaq-surface/70 border border-rawnaq-border/80 backdrop-blur-md hover:border-purple-500/50 transition-all text-right group">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xl p-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">📐</span>
              <span className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">مكتبات CAD و Revit</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight">بلوكات BIM بمعيار LOD 350</p>
          </div>

        </div>

        {/* Quick Freelance & Store Generator Link Bar */}
        <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2.5 text-[11px] sm:text-xs font-bold">
          <Link
            href="/vendor"
            className="px-3.5 py-1.5 rounded-lg bg-rawnaq-gold/10 border border-rawnaq-gold/40 text-rawnaq-gold hover:bg-rawnaq-gold hover:text-slate-950 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>🚀 أنشئ متجرك الرقمي في 5 دقائق وابدأ البيع</span>
            <span>➔</span>
          </Link>

          <Link
            href="/tools"
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>📄 محول المستندات الذكي PDF to Word & Excel مجاناً</span>
            <span>➔</span>
          </Link>
        </div>

      </div>

    </section>
  );
}
