'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import HorizonEclipseBackground from './HorizonEclipseBackground';
import InvoiceGenerator from '@/components/tools/InvoiceGenerator';
import BreakEvenCalculator from '@/components/tools/BreakEvenCalculator';
import StoreAuditWidget from '@/components/tools/StoreAuditWidget';

interface HeroProps {
  onSearch: (query: string) => void;
}

const POPULAR_SEARCH_TAGS = [
  'شيت تدفقات نقدية 2026',
  'عقود عمل وتأسيس شركات',
  'قالب Pitch Deck للمستثمرين',
  'سيرة ذاتية تنفيذية ATS',
  'بلوكات AutoCAD & Revit',
  'داشبورد Power BI المالي',
  'عقد سرية معلومات NDA',
  'حصر كميات ومقايسات BOQ',
];

type ActiveTab = 'search' | 'invoice' | 'breakeven' | 'audit';

export default function Hero({ onSearch }: HeroProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('search');
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleChipClick = (tag: string) => {
    setQuery(tag);
    onSearch(tag);
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full pt-6 pb-12 sm:pt-8 sm:pb-16 bg-[#0B0F17] border-b border-slate-800/80 overflow-hidden">
      
      {/* Dynamic Ambient Background Mesh */}
      <HorizonEclipseBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center flex flex-col items-center">
        
        {/* Top Product Hunt / SaaS Style Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold shadow-xl backdrop-blur-xl print:hidden">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>التحديث السحابي 2.0 • أدوات ZATCA الضريبية وحاسبة التعادل متاحة الآن مجاناً</span>
        </div>

        {/* Cinematic Headline - Refined & Comfortable Typographic Hierarchy */}
        <div className="space-y-3 mb-4 sm:mb-6 print:hidden">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight font-cairo">
            منظومة إدارة وتمكين الأعمال الذكية
          </h1>
          <p className="text-base sm:text-xl md:text-2xl font-bold gold-gradient-text leading-relaxed max-w-4xl mx-auto">
            أدوات تفاعلية وشيتات احترافية تختصر سنوات من جهدك
          </p>
        </div>

        {/* Subtitle */}
        <p className="text-slate-300/90 text-xs sm:text-sm md:text-base max-w-2xl mb-8 leading-7 sm:leading-8 font-normal print:hidden">
          الترسانة التنفيذية الأولى لرواد الأعمال والمستشارين والشركات: نماذج إكسل محاسبية مؤتمتة، عقود قانونية موثقة، قوالب كانفا حرة، ومكتبات كاد وريفت معمارية — مع أدوات فحص وتوليد فواتير حية 100% مجاناً.
        </p>

        {/* Live Interactive Power Suite Tabs */}
        <div id="interactive-suite" className="w-full max-w-4xl mb-6 print:hidden">
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-xl">
            
            <button
              onClick={() => setActiveTab('search')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-slate-800/90 text-white border border-amber-400/40 shadow-sm shadow-black/40 backdrop-blur-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>🔍</span>
              <span>سوق الأصول والشيتات (50 أصل)</span>
            </button>

            <button
              onClick={() => setActiveTab('invoice')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'invoice'
                  ? 'bg-slate-800/90 text-white border border-amber-400/40 shadow-sm shadow-black/40 backdrop-blur-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>🧾</span>
              <span>مولد الفواتير الضريبية (ZATCA QR)</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-md border border-emerald-500/30">مجاناً</span>
            </button>

            <button
              onClick={() => setActiveTab('breakeven')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'breakeven'
                  ? 'bg-slate-800/90 text-white border border-amber-400/40 shadow-sm shadow-black/40 backdrop-blur-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>📈</span>
              <span>حاسبة التعادل والأرباح</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-md border border-emerald-500/30">مجاناً</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-slate-800/90 text-white border border-amber-400/40 shadow-sm shadow-black/40 backdrop-blur-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>🔍</span>
              <span>فحص صحة المتاجر والسيو</span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded-md border border-cyan-500/30">جديد</span>
            </button>

          </div>
        </div>

        {/* Tab Content Display Area */}
        <div className="w-full max-w-4xl transition-all duration-300">
          
          {/* 1. Search Bar & Fast Gateways */}
          <div className={activeTab === 'search' ? 'block space-y-4 animate-fade-in-up print:hidden' : 'hidden'}>
            <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto relative flex items-center shadow-2xl shadow-black/80">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  onSearch(e.target.value);
                }}
                placeholder="ابحث في أكثر من 1,400 أصل: شيت محاسبة، عقد شراكة، Pitch Deck، بلوكات CAD..."
                aria-label="ابحث عن المنتجات والأصول الرقمية"
                className="w-full h-12 sm:h-14 pl-3 pr-12 rounded-r-2xl bg-slate-900/95 border-2 border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-all text-xs sm:text-sm font-cairo backdrop-blur-2xl"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
                🔍
              </span>
              <button
                type="submit"
                aria-label="بحث فوري"
                className="btn-gold !rounded-r-none !rounded-l-2xl !h-12 sm:!h-14 !px-6 sm:!px-8 text-xs sm:text-sm font-black whitespace-nowrap flex items-center gap-2 shadow-lg hover:scale-[1.02] transition-transform"
              >
                <span>بحث</span>
                <span>←</span>
              </button>
            </form>

            {/* Popular Tags */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-3xl mx-auto">
              <span className="text-[11px] text-slate-400 font-bold">الأكثر طلباً:</span>
              {POPULAR_SEARCH_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleChipClick(tag)}
                  className="text-[11px] px-3 py-1 bg-slate-900/80 border border-slate-800 hover:border-amber-400 hover:text-amber-300 text-slate-300 rounded-lg transition-all cursor-pointer backdrop-blur-md shadow-sm"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Fast Action Cards (Vendor Gateway & Editor) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto pt-3">
              <Link
                href="/vendor"
                className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 hover:border-amber-400 transition-all text-right flex items-center justify-between group shadow-xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                    🚀
                  </span>
                  <div>
                    <span className="text-xs sm:text-sm font-black text-white block group-hover:text-amber-300 transition-colors">
                      أنشئ متجرك الرقمي كبائع
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      اربح 85% مع تسوية آلية عبر إنستاباي ومدى
                    </span>
                  </div>
                </div>
                <span className="text-amber-400 text-base group-hover:translate-x-[-4px] transition-transform font-bold">
                  ←
                </span>
              </Link>

              <Link
                href="/editor"
                className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400 transition-all text-right flex items-center justify-between group shadow-xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                    🎨
                  </span>
                  <div>
                    <span className="text-xs sm:text-sm font-black text-white block group-hover:text-cyan-300 transition-colors">
                      محرر واستوديو القوالب الذكي
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      خصص قوالبك وشيتاتك مباشرة في المتصفح
                    </span>
                  </div>
                </div>
                <span className="text-cyan-400 text-base group-hover:translate-x-[-4px] transition-transform font-bold">
                  ←
                </span>
              </Link>
            </div>
          </div>

          {/* 2. Embedded Invoice Generator (Zero-Unmount Preserved) */}
          <div className={activeTab === 'invoice' ? 'block animate-fade-in-up text-right' : 'hidden'}>
            <InvoiceGenerator />
          </div>

          {/* 3. Embedded Break-Even Calculator (Zero-Unmount Preserved) */}
          <div className={activeTab === 'breakeven' ? 'block animate-fade-in-up text-right print:hidden' : 'hidden'}>
            <BreakEvenCalculator />
          </div>

          {/* 4. Embedded Store Audit Tool (Zero-Unmount Preserved) */}
          <div className={activeTab === 'audit' ? 'block animate-fade-in-up text-right print:hidden' : 'hidden'}>
            <StoreAuditWidget />
          </div>

        </div>

      </div>
    </section>
  );
}
