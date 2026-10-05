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
    <section className="relative w-full py-20 md:py-32 bg-[#060a14] border-b border-rawnaq-border overflow-hidden">
      
      {/* ========================================================================= */}
      {/* AUTHENTIC 3D MATHEMATICAL MOBIUS STRIP BACKGROUND CANVAS */}
      {/* ========================================================================= */}
      <MobiusRibbonCanvas />

      {/* ========================================================================= */}
      {/* COMMANDING FULL-WIDTH HERO CONTENT ("واكل للشاشة") */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center flex flex-col items-center">
        
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-rawnaq-surface/90 border border-rawnaq-gold/40 text-rawnaq-gold text-xs font-mono font-bold shadow-2xl backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-rawnaq-gold animate-ping" />
          <span>رَصِيـن | RASEEN • منصة الأصول الرقمية والإبداعية والعمل الحر 2026</span>
        </div>

        {/* MASSIVE HEADLINE (DOMINATES SCREEN WIDTH) */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[1.08] tracking-tight drop-shadow-2xl">
          أدوات وشيتات وقوالب ذكية
          <span className="gold-gradient-text block mt-2 sm:mt-3 drop-shadow-[0_10px_35px_rgba(245,183,49,0.3)]">
            تختصر سنوات من جهدك وعملك
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-200 text-sm sm:text-lg md:text-xl max-w-3xl mb-10 leading-relaxed font-normal opacity-90 drop-shadow">
          الترسانة التنفيذية الأولى في الشرق الأوسط: نماذج إكسل محاسبية مؤتمتة، عقود قانونية موثقة، قوالب كانفا حرة، ومكتبات كاد وريفت معمارية — جاهزة للاستخدام الفوري أو طلب التخصيص بواسطة مستقلين معتمدين.
        </p>

        {/* Central Search Bar */}
        <form onSubmit={handleSubmit} className="w-full max-w-2xl relative mb-4 flex items-center shadow-2xl shadow-black/90">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch(e.target.value);
            }}
            placeholder="ابحث في أكثر من 1,400 أصل: شيت محاسبة، عقد شراكة، Pitch Deck، بلوكات CAD..."
            aria-label="ابحث عن المنتجات والأصول الرقمية"
            className="w-full h-14 sm:h-16 pl-4 pr-12 sm:pr-14 rounded-r-2xl bg-rawnaq-surface/95 border-2 border-rawnaq-border text-white placeholder-slate-400 focus:outline-none focus:border-rawnaq-gold transition-all text-sm sm:text-base font-cairo backdrop-blur-xl"
          />
          <span className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">
            🔍
          </span>
          <button
            type="submit"
            aria-label="بحث فوري"
            className="btn-gold !rounded-r-none !rounded-l-2xl !h-14 sm:!h-16 !px-7 sm:!px-10 text-sm sm:text-base font-black whitespace-nowrap flex items-center gap-2 shadow-xl hover:scale-[1.02] transition-transform"
          >
            <span>بحث</span>
            <span>←</span>
          </button>
        </form>

        {/* Popular Tags Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-2xl">
          <span className="text-xs text-slate-400 font-bold">الأكثر طلباً:</span>
          {POPULAR_SEARCH_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleChipClick(tag)}
              className="text-xs px-3 py-1.5 bg-rawnaq-surface/80 border border-rawnaq-border hover:border-rawnaq-gold hover:text-rawnaq-gold text-slate-300 rounded-xl transition-all cursor-pointer backdrop-blur-sm shadow"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 4 Pillars Interactive Floating Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl pt-2">
          
          <div className="p-4 rounded-2xl bg-rawnaq-surface/70 border border-rawnaq-border/80 backdrop-blur-md hover:border-emerald-500/50 transition-all text-right group">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-2xl p-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">📊</span>
              <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">شيتات Excel الذكية</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">معادلات مؤتمتة وحسابات فورية</p>
          </div>

          <div className="p-4 rounded-2xl bg-rawnaq-surface/70 border border-rawnaq-border/80 backdrop-blur-md hover:border-amber-500/50 transition-all text-right group">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-2xl p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">⚖️</span>
              <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">عقود قانونية موثقة</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">لمصر والسعودية والإمارات</p>
          </div>

          <div className="p-4 rounded-2xl bg-rawnaq-surface/70 border border-rawnaq-border/80 backdrop-blur-md hover:border-cyan-500/50 transition-all text-right group">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-2xl p-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">🎨</span>
              <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">قوالب Canva حرة</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">تعديل بالمتصفح وطباعة A4</p>
          </div>

          <div className="p-4 rounded-2xl bg-rawnaq-surface/70 border border-rawnaq-border/80 backdrop-blur-md hover:border-purple-500/50 transition-all text-right group">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-2xl p-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">📐</span>
              <span className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">مكتبات CAD و Revit</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">بلوكات BIM بمعيار LOD 350</p>
          </div>

        </div>

        {/* Quick Freelance & Store Generator Link Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
          <Link
            href="/vendor"
            className="px-4 py-2 rounded-xl bg-rawnaq-gold/10 border border-rawnaq-gold/40 text-rawnaq-gold hover:bg-rawnaq-gold hover:text-slate-950 transition-all flex items-center gap-2 shadow"
          >
            <span>🚀 أنشئ متجرك الرقمي في 5 دقائق وابدأ البيع</span>
            <span>➔</span>
          </Link>

          <Link
            href="/tools"
            className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all flex items-center gap-2 shadow"
          >
            <span>📄 محول المستندات الذكي PDF to Word & Excel مجاناً</span>
            <span>➔</span>
          </Link>
        </div>

      </div>

    </section>
  );
}
