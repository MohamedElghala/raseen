'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import HorizonEclipseBackground from './HorizonEclipseBackground';

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
      {/* MAJESTIC ARCHITECTURAL GOLDEN HORIZON ECLIPSE BACKGROUND */}
      {/* ========================================================================= */}
      <HorizonEclipseBackground />

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

        {/* The Two Main Action Gateways (Store Creator & Document Converter) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl pt-2">
          
          <Link
            href="/vendor"
            className="p-3.5 rounded-2xl bg-rawnaq-surface/85 border border-rawnaq-gold/40 hover:border-rawnaq-gold transition-all text-right flex items-center justify-between group shadow-lg backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-rawnaq-gold/15 text-rawnaq-gold flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                🚀
              </span>
              <div>
                <span className="text-xs font-black text-white block group-hover:text-rawnaq-gold transition-colors">
                  أنشئ متجرك الرقمي في 5 دقائق
                </span>
                <span className="text-[11px] text-slate-400 block">
                  ابدأ ببيع ملفاتك واكسب 85% مع إنستاباي
                </span>
              </div>
            </div>
            <span className="text-rawnaq-gold text-sm group-hover:translate-x-[-4px] transition-transform">
              ←
            </span>
          </Link>

          <Link
            href="/tools"
            className="p-3.5 rounded-2xl bg-rawnaq-surface/85 border border-cyan-500/40 hover:border-cyan-400 transition-all text-right flex items-center justify-between group shadow-lg backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                📄
              </span>
              <div>
                <span className="text-xs font-black text-white block group-hover:text-cyan-400 transition-colors">
                  محول المستندات الذكي مجاناً
                </span>
                <span className="text-[11px] text-slate-400 block">
                  تحويل من PDF إلى Word و Excel بدقة OCR
                </span>
              </div>
            </div>
            <span className="text-cyan-400 text-sm group-hover:translate-x-[-4px] transition-transform">
              ←
            </span>
          </Link>

        </div>

      </div>

    </section>
  );
}
