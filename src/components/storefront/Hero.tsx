'use client';

import React, { useState } from 'react';

interface HeroProps {
  onSearch: (query: string) => void;
}

const POPULAR_SEARCH_TAGS = [
  'عقود عمل',
  'شيت إكسل محاسبي',
  'سيرة ذاتية ATS',
  'بلوكات AutoCAD',
  'قوالب Notion',
  'Power BI',
  'ميزانية شخصية',
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
      <div className="absolute inset-0 bg-rawnaq-navy/40 backdrop-blur-sm z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-rawnaq-gold/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-rawnaq-surface border border-rawnaq-gold/30 text-rawnaq-gold text-xs md:text-sm font-bold shadow-lg shadow-rawnaq-gold/5">
          <span>✦ السوق العربي الأول للأصول الرقمية الاحترافية في مصر والخليج</span>
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
          أدوات وشيتات وقوالب ذكية <br />
          <span className="gold-gradient-text">تختصر سنوات من جهدك وعملك</span>
        </h1>

        <p className="text-slate-300 text-sm md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          منصة رَصِيـن توفر لرواد الأعمال، المحاسبين، المهندسين، والطلاب ملفات عملية موثوقة جاهزة للتنفيذ الفوري: شيتات إكسل متقدمة، عقود قانونية، قوالب نوشن، وبلوكات CAD معتمدة.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto relative mb-4 flex items-center shadow-xl shadow-rawnaq-gold/5">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch(e.target.value);
            }}
            placeholder="ابحث عن: شيت إكسيل محاسبي، عقد شراكة، قالب Notion، بلوكات CAD..."
            aria-label="ابحث عن المنتجات الرقمية"
            className="w-full h-14 pl-4 pr-6 rounded-r-xl bg-rawnaq-surface border border-rawnaq-border text-white placeholder-slate-400 focus:outline-none focus:border-rawnaq-gold transition-colors text-base"
          />
          <button
            type="submit"
            aria-label="بحث"
            className="btn-gold !rounded-r-none !rounded-l-xl !h-14 !px-8 text-base font-bold whitespace-nowrap flex items-center gap-2"
          >
            <span>بحث</span>
            <span>🔍</span>
          </button>
        </form>

        {/* Search Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-2xl">
          <span className="text-xs text-slate-400 ml-1">الأكثر بحثاً:</span>
          {POPULAR_SEARCH_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleChipClick(tag)}
              className="text-xs px-3 py-1 bg-rawnaq-surface border border-rawnaq-border hover:border-rawnaq-gold hover:text-rawnaq-gold text-slate-300 rounded-full transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-slate-300 text-xs md:text-sm pt-4 border-t border-rawnaq-border/40 w-full max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-rawnaq-gold text-lg">⚡</span>
            <span>تسليم فوري بعد الدفع</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-lg">🛡️</span>
            <span>ملفات مفحوصة ومؤمنة 100%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400 text-lg">📄</span>
            <span>رخص استخدام شخصية وتجارية موثقة</span>
          </div>
        </div>
      </div>
    </section>
  );
}
