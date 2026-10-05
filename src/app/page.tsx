'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Hero from '@/components/storefront/Hero';
import FilterBar from '@/components/storefront/FilterBar';
import ProductCard from '@/components/storefront/ProductCard';
import BundleDeals from '@/components/storefront/BundleDeals';
import { mockProducts } from '@/lib/mockData';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFileType, setSelectedFileType] = useState('all');
  const [activeFilterNotice, setActiveFilterNotice] = useState<string | null>(null);

  const handlePillarSelect = (category: string, fileType: string, label: string) => {
    setSelectedCategory(category);
    setSelectedFileType(fileType);
    setSearchTerm('');
    setActiveFilterNotice(label);
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        term === '' ||
        product.title.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.tags.some((t) => t.toLowerCase().includes(term));
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchesType =
        selectedFileType === 'all' || product.fileType === selectedFileType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [searchTerm, selectedCategory, selectedFileType]);

  return (
    <>
      {/* 1. Hero Section with High-Tech Animated Asset Engine */}
      <Hero onSearch={setSearchTerm} />

      <div className="container mx-auto px-4 py-12 space-y-24">
        
        {/* 2. Interactive Asset Suite (4 Pillars) */}
        <section id="pillars" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-rawnaq-border pb-4">
            <div>
              <div className="text-[11px] font-mono text-rawnaq-gold font-bold mb-1">INTERACTIVE ASSET SUITE</div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">أركان منظومة رَصين المتكاملة</h2>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              اضغط على أي ركن للانتقال المباشر وتصفية الأصول التخصصية أو فتح محرر الاستوديو المباشر.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* 1. Excel Pillar */}
            <div 
              onClick={() => handlePillarSelect('accounting', 'all', 'النماذج والشيتات المالية المحاسبية')}
              className={`rounded-2xl p-6 space-y-4 transition-all cursor-pointer group border flex flex-col justify-between ${
                selectedCategory === 'accounting' 
                  ? 'bg-emerald-950/40 border-emerald-500 shadow-xl shadow-emerald-500/10 scale-[1.02]' 
                  : 'bg-rawnaq-surface border-rawnaq-border hover:border-emerald-500/50 hover:bg-rawnaq-surface/90'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    📊
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    12 شيت تخصصي
                  </span>
                </div>
                <h3 className="font-black text-lg text-white group-hover:text-emerald-300 transition-colors">
                  النماذج والشيتات المالية
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  شيتات محاسبة آلية، حساب ضريبة القيمة المضافة، موازنات تقديرية، ولوحات قيادة مالية مرتبطة بـ Power BI.
                </p>
                <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5 pt-1">
                  <span>✓</span> معادلات ديناميكية بدون أخطاء
                </div>
              </div>

              <div className="pt-3 space-y-2">
                <button 
                  type="button"
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-between group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all shadow-sm"
                >
                  <span>استعراض الشيتات في السوق</span>
                  <span className="text-sm font-black transition-transform group-hover:translate-x-[-3px]">←</span>
                </button>
                <Link
                  href="/category/accounting"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full py-1.5 px-2 text-center text-[11px] text-slate-400 hover:text-emerald-300 transition-colors block"
                >
                  فتح صفحة القسم المستقلة ↗
                </Link>
              </div>
            </div>

            {/* 2. Legal Pillar */}
            <div 
              onClick={() => handlePillarSelect('business', 'word-pdf', 'العقود والأطر القانونية')}
              className={`rounded-2xl p-6 space-y-4 transition-all cursor-pointer group border flex flex-col justify-between ${
                selectedCategory === 'business' 
                  ? 'bg-blue-950/40 border-blue-500 shadow-xl shadow-blue-500/10 scale-[1.02]' 
                  : 'bg-rawnaq-surface border-rawnaq-border hover:border-blue-500/50 hover:bg-rawnaq-surface/90'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    ⚖️
                  </div>
                  <span className="text-[11px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                    10 عقود معتمدة
                  </span>
                </div>
                <h3 className="font-black text-lg text-white group-hover:text-blue-300 transition-colors">
                  العقود والأطر القانونية
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  عقود عمل وتوظيف، اتفاقيات عدم إفصاح (NDA)، عقود شراكة وتأسيس شركات مصاغة وفق الأنظمة القانونية العربية.
                </p>
                <div className="text-[11px] text-blue-400 font-mono flex items-center gap-1.5 pt-1">
                  <span>✓</span> صيغ Word + PDF قابلة للتعديل
                </div>
              </div>

              <div className="pt-3 space-y-2">
                <button 
                  type="button"
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300 font-bold text-xs flex items-center justify-between group-hover:bg-blue-500 group-hover:text-slate-950 transition-all shadow-sm"
                >
                  <span>استعراض العقود في السوق</span>
                  <span className="text-sm font-black transition-transform group-hover:translate-x-[-3px]">←</span>
                </button>
                <Link
                  href="/category/business"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full py-1.5 px-2 text-center text-[11px] text-slate-400 hover:text-blue-300 transition-colors block"
                >
                  فتح صفحة القسم المستقلة ↗
                </Link>
              </div>
            </div>

            {/* 3. Canva Studio Pillar */}
            <div 
              className="rounded-2xl p-6 space-y-4 transition-all group border flex flex-col justify-between bg-rawnaq-surface border-rawnaq-border hover:border-cyan-500/50 hover:bg-rawnaq-surface/90 relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🎨
                  </div>
                  <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                    محرر مباشر + 14 قالباً
                  </span>
                </div>
                <h3 className="font-black text-lg text-white group-hover:text-cyan-300 transition-colors">
                  استوديو قوالب Canva
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  عروض تقديمية (Pitch Decks)، تقارير أعمال، وهويات بصرية كاملة مع إمكانية التعديل داخل المتصفح أو في Canva.
                </p>
                <div className="text-[11px] text-cyan-400 font-mono flex items-center gap-1.5 pt-1">
                  <span>✓</span> تعديل مباشر وطباعة A4
                </div>
              </div>

              <div className="pt-3 space-y-2">
                <Link 
                  href="/editor"
                  className="w-full py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-between transition-all shadow-md shadow-cyan-500/20"
                >
                  <span>🎨 فتح محرر الاستوديو المباشر</span>
                  <span className="text-sm font-black">➔</span>
                </Link>
                <button 
                  type="button"
                  onClick={() => handlePillarSelect('all', 'powerpoint', 'قوالب العروض وكانفا والتصميم')}
                  className="w-full py-2 px-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-[11px] flex items-center justify-between hover:bg-cyan-500/20 transition-all"
                >
                  <span>تصفح قوالب التصميم في السوق</span>
                  <span>←</span>
                </button>
              </div>
            </div>

            {/* 4. CAD Pillar */}
            <div 
              onClick={() => handlePillarSelect('engineering', 'cad-revit', 'المكتبات الهندسية CAD & BIM')}
              className={`rounded-2xl p-6 space-y-4 transition-all cursor-pointer group border flex flex-col justify-between ${
                selectedCategory === 'engineering' 
                  ? 'bg-purple-950/40 border-purple-500 shadow-xl shadow-purple-500/10 scale-[1.02]' 
                  : 'bg-rawnaq-surface border-rawnaq-border hover:border-purple-500/50 hover:bg-rawnaq-surface/90'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    📐
                  </div>
                  <span className="text-[11px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                    8 مشاريع ومكتبات
                  </span>
                </div>
                <h3 className="font-black text-lg text-white group-hover:text-purple-300 transition-colors">
                  المكتبات الهندسية CAD & BIM
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  مكتبات معمارية وإنشائية وكهروميكانيكية متوافقة مع الكود العربي والاشتراطات الهندسية الحديثة 2026.
                </p>
                <div className="text-[11px] text-purple-400 font-mono flex items-center gap-1.5 pt-1">
                  <span>✓</span> ملفات .DWG و .RVT معيارية
                </div>
              </div>

              <div className="pt-3 space-y-2">
                <button 
                  type="button"
                  className="w-full py-2.5 px-3 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 font-bold text-xs flex items-center justify-between group-hover:bg-purple-500 group-hover:text-slate-950 transition-all shadow-sm"
                >
                  <span>استعراض المكتبات في السوق</span>
                  <span className="text-sm font-black transition-transform group-hover:translate-x-[-3px]">←</span>
                </button>
                <Link
                  href="/category/engineering"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full py-1.5 px-2 text-center text-[11px] text-slate-400 hover:text-purple-300 transition-colors block"
                >
                  فتح صفحة القسم المستقلة ↗
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* 3. Curated High-Converting Bundle Packs */}
        <BundleDeals />

        {/* 4. Filter Bar & Comprehensive Catalog */}
        <section id="products" className="space-y-6 scroll-mt-24">
          
          {/* Active Filter Announcement Banner */}
          {activeFilterNotice && (
            <div className="p-4 rounded-2xl bg-rawnaq-surface border-2 border-rawnaq-gold flex items-center justify-between flex-wrap gap-4 shadow-xl shadow-rawnaq-gold/5 animate-fade-in-up">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">تم تحديد الركن التخصصي:</span>
                  <span className="text-base font-black text-white">
                    {activeFilterNotice}{' '}
                    <span className="text-rawnaq-gold font-mono text-sm">
                      ({filteredProducts.length} أصل متاح)
                    </span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedFileType('all');
                  setActiveFilterNotice(null);
                  setSearchTerm('');
                }}
                className="px-4 py-2 rounded-xl bg-rawnaq-dark border border-slate-600 hover:border-rawnaq-gold hover:text-rawnaq-gold text-xs font-bold text-slate-200 transition-all flex items-center gap-1.5"
              >
                <span>✕ إلغاء التصفية وعرض كافة الأصول</span>
              </button>
            </div>
          )}

          <FilterBar
            selectedCategory={selectedCategory}
            selectedFileType={selectedFileType}
            onCategoryChange={(cat) => {
              setSelectedCategory(cat);
              if (cat === 'all') setActiveFilterNotice(null);
            }}
            onFileTypeChange={(type) => {
              setSelectedFileType(type);
              if (type === 'all' && selectedCategory === 'all') setActiveFilterNotice(null);
            }}
            totalProducts={filteredProducts.length}
          />

          {/* Catalog Subheader */}
          <div className="my-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-rawnaq-surface p-4 rounded-xl border border-rawnaq-border">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                <span>💎</span>
                <span>الأصول والمنتجات الرقمية المعتمدة</span>
                <span className="text-rawnaq-gold text-sm font-normal font-mono">
                  ({filteredProducts.length} منتج متاح)
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                جميع الملفات مفحوصة، معتمدة، ومزودة برخص استخدام موثقة.
              </p>
            </div>

            <Link
              href="/tools"
              className="btn-outline !py-2 !px-4 text-xs font-bold flex items-center gap-1.5"
            >
              <span>🛠️ جرب أدواتنا المجانية (GPA / فواتير / ضرائب)</span>
            </Link>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-rawnaq-surface rounded-2xl border border-rawnaq-border">
              <span className="text-4xl block mb-2">🔍</span>
              <h3 className="text-lg font-bold text-white mb-1">لم نجد أصولاً تطابق بحثك</h3>
              <p className="text-xs text-slate-400">جرب البحث بكلمات أخرى أو اختر فئة مختلفة من الشريط أعلاه.</p>
            </div>
          )}
        </section>

        {/* 5. Canva Studio Showcase & Live In-Browser Editing */}
        <section className="bg-rawnaq-surface border border-rawnaq-border rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold">
                <span>✦</span>
                <span>RASEEN TEMPLATES & CANVA ENGINE</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                عدل قوالبك في المتصفح واطبعها مباشرة دون برامج معقدة
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                يقدم استوديو رَصين محرر قوالب تفاعلياً مدمجاً يتيح لك معاينة وتخصيص مستنداتك وعروضك التقديمية في ثوانٍ، وتصديرها كملفات A4 عالية الدقة للطباعة أو فتحها في حسابك على Canva بضغطة واحدة.
              </p>
              
              <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-lg bg-rawnaq-dark border border-rawnaq-border">
                  <span className="text-white font-bold block mb-1">1. اختر القالب</span>
                  <span className="text-[11px] text-slate-400">تصفح نماذج الأعمال</span>
                </div>
                <div className="p-3 rounded-lg bg-rawnaq-dark border border-rawnaq-border">
                  <span className="text-white font-bold block mb-1">2. خصص المحتوى</span>
                  <span className="text-[11px] text-slate-400">عدل النصوص والألوان</span>
                </div>
                <div className="p-3 rounded-lg bg-rawnaq-dark border border-rawnaq-border">
                  <span className="text-white font-bold block mb-1">3. اطبع أو صدّر</span>
                  <span className="text-[11px] text-slate-400">ملفات PDF جاهزة</span>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  href="/editor"
                  className="btn-gold !py-3 !px-6 text-sm font-bold inline-flex items-center gap-2"
                >
                  <span>فتح محرر القوالب المباشر</span>
                  <span>🎨</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-rawnaq-dark border border-rawnaq-border rounded-xl p-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-rawnaq-border text-xs mb-4">
                <span className="font-mono text-slate-400">A4 PDF Preview</span>
                <span className="text-rawnaq-gold font-mono font-bold">READY TO PRINT</span>
              </div>
              <div className="bg-rawnaq-surface rounded-lg p-6 border border-rawnaq-border/60 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-2xl">
                  📄
                </div>
                <h4 className="font-bold text-sm text-white">تصدير متوافق مع مقاييس A4 الدولية</h4>
                <p className="text-xs text-slate-400">هوامش طباعة دقيقة، خطوط مضمنة، وألوان CMYK/RGB مطابقة للمستندات التنفيذية.</p>
              </div>
            </div>

          </div>
        </section>

        {/* 6. Free Productivity Tools Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-rawnaq-border pb-4">
            <div>
              <div className="text-[11px] font-mono text-rawnaq-gold font-bold mb-1">FREE PRODUCTIVITY TOOLS</div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">أدوات العمل التفاعلية المجانية</h2>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              أدوات حسابية وإنتاجية متطورة متاحة مجاناً لجميع الزوار للمساعدة في العمل اليومي.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <Link href="/tools" className="bg-rawnaq-surface border border-rawnaq-border rounded-xl p-5 hover:border-rawnaq-gold/40 transition-all block">
              <span className="text-2xl block mb-3">📄</span>
              <h4 className="font-bold text-sm text-white mb-1.5">مولد الفواتير الإلكترونية</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">إنشاء فواتير تجارية وضريبية فورية مع تصدير وطباعة PDF مباشرة.</p>
              <span className="text-[10px] font-mono text-rawnaq-gold">استخدم مجاناً ←</span>
            </Link>

            <Link href="/tools" className="bg-rawnaq-surface border border-rawnaq-border rounded-xl p-5 hover:border-rawnaq-gold/40 transition-all block">
              <span className="text-2xl block mb-3">📊</span>
              <h4 className="font-bold text-sm text-white mb-1.5">حاسبة ضريبة القيمة المضافة</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">حساب الضريبة لمصر (14%)، السعودية (15%)، والإمارات (5%) بضغطة زر.</p>
              <span className="text-[10px] font-mono text-rawnaq-gold">استخدم مجاناً ←</span>
            </Link>

            <Link href="/tools" className="bg-rawnaq-surface border border-rawnaq-border rounded-xl p-5 hover:border-rawnaq-gold/40 transition-all block">
              <span className="text-2xl block mb-3">🎓</span>
              <h4 className="font-bold text-sm text-white mb-1.5">حاسبة المعدل التراكمي (GPA)</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">حساب المعدل الجامعي الفصلي والتراكمي بالساعات المعتمدة وسلم 4.0.</p>
              <span className="text-[10px] font-mono text-rawnaq-gold">استخدم مجاناً ←</span>
            </Link>

            <Link href="/tools" className="bg-rawnaq-surface border border-rawnaq-border rounded-xl p-5 hover:border-rawnaq-gold/40 transition-all block">
              <span className="text-2xl block mb-3">📐</span>
              <h4 className="font-bold text-sm text-white mb-1.5">محول الوحدات الهندسية</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">تحويل دقيق لوحدات الضغط، القوة، المساحة، والأطوال للمهندسين.</p>
              <span className="text-[10px] font-mono text-rawnaq-gold">استخدم مجاناً ←</span>
            </Link>

          </div>
        </section>

        {/* 7. Creator Economy Section (85% Payout) */}
        <section className="bg-rawnaq-surface border border-rawnaq-border rounded-2xl p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rawnaq-gold/15 text-rawnaq-gold text-xs font-mono font-bold">
            <span>CREATOR ECONOMY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            حول نماذجك وخبرتك إلى دخل سلبي مستمر
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            انضم إلى مجتمع الخبراء على منصة رَصين، واعرض شيتاتك وقوالبك لمئات آلاف المهتمين في مصر ودول الخليج. ستحصل على <strong className="text-rawnaq-gold font-mono text-lg">85%</strong> من إجمالي مبيعاتك مع تسوية مالية أسبوعية فورية كل خميس.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link href="/vendor" className="btn-gold !py-3.5 !px-8 text-sm font-bold">
              افتح متجرك الرقمي في دقائق
            </Link>
            <Link href="/vendor" className="btn-outline !py-3.5 !px-8 text-sm font-bold">
              دليل ومعايير قبول الأصول
            </Link>
          </div>
        </section>

        {/* 8. FAQ Section */}
        <section className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-2xl font-black text-white">الأسئلة الشائعة</h2>
            <p className="text-xs text-slate-400">إجابات واضحة عن كل ما يخص شراء واستخدام الأصول الرقمية</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 bg-rawnaq-surface border border-rawnaq-border rounded-xl space-y-2">
              <h4 className="font-bold text-white text-sm">كيف أستلم الملفات بعد إتمام الدفع؟</h4>
              <p className="text-slate-300 leading-relaxed">بمجرد تأكيد الدفع الإلكتروني، سيظهر لك رابط التحميل الفوري في صفحة الشراء، كما سيتم حفظ نسخة احتياطية دائمة داخل حسابك في لوحة المشتريات.</p>
            </div>
            <div className="p-4 bg-rawnaq-surface border border-rawnaq-border rounded-xl space-y-2">
              <h4 className="font-bold text-white text-sm">هل شيتات إكسل تعمل على Google Sheets والموبايل؟</h4>
              <p className="text-slate-300 leading-relaxed">نعم، جميع النماذج المالية مصممة ومعيارية لتتوافق مع Microsoft Excel 2016 فما فوق، وتعمل بسلاسة تامة على Google Sheets وتطبيقات الهواتف الذكية.</p>
            </div>
            <div className="p-4 bg-rawnaq-surface border border-rawnaq-border rounded-xl space-y-2">
              <h4 className="font-bold text-white text-sm">ما هي وسائل الدفع المدعومة؟</h4>
              <p className="text-slate-300 leading-relaxed">ندعم الدفع الآمن بنسبة 100% عبر البطاقات البنكية (Visa و MasterCard)، محافظ المحمول مثل Vodafone Cash، خدمة InstaPay في مصر، وبطاقات مدى (Mada) في السعودية.</p>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
