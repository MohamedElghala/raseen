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

  const trustFeatures = [
    {
      icon: '⚡',
      title: 'تسليم فوري ومباشر',
      desc: 'تحميل فوري للملفات بعد نجاح الدفع مع روابط مشفرة صالحة 48 ساعة.',
    },
    {
      icon: '🔒',
      title: 'حماية وتشفير عالي',
      desc: 'ملفات تم تدقيقها لضمان خلوها من الأخطاء والبرمجيات الخبيثة.',
    },
    {
      icon: '💳',
      title: 'وسائل دفع محلية وخليجية',
      desc: 'دعم كامل لبطاقات الائتمان، إنستاباي InstaPay، فودافون كاش، ومدى.',
    },
    {
      icon: '📈',
      title: '85% أرباح صافية للبائعين',
      desc: 'نظام عمولة عادل ومنافس يدعم صانعي المحتوى والمحترفين العرب.',
    },
  ];

  return (
    <>
      <Hero onSearch={setSearchTerm} />

      <div className="container mx-auto px-4 py-8" id="products">
        {/* Curated High-Converting Bundle Packs */}
        <BundleDeals />

        {/* Filter Bar */}
        <div className="mt-8 mb-6">
          <FilterBar
            selectedCategory={selectedCategory}
            selectedFileType={selectedFileType}
            onCategoryChange={setSelectedCategory}
            onFileTypeChange={setSelectedFileType}
            totalProducts={filteredProducts.length}
          />
        </div>

        {/* Products Header */}
        <div className="my-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-rawnaq-surface p-4 rounded-xl border border-rawnaq-border">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              <span>💎</span>
              <span>الأصول والمنتجات الرقمية</span>
              <span className="text-rawnaq-gold text-sm font-normal">
                ({filteredProducts.length} منتج متاح)
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              جميع الملفات جاهزة للاستخدام الفوري ومزودة برخص استخدام موثقة.
            </p>
          </div>

          <Link
            href="/tools"
            className="btn-outline !py-2 !px-4 text-xs font-bold flex items-center gap-1.5"
          >
            <span>🛠️ جرب أدواتنا المجانية (GPA / فواتير / ضرائب)</span>
          </Link>
        </div>

        {/* Products Grid (30 Items Responsive Grid) */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rawnaq-glass rounded-2xl border border-rawnaq-border">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="text-xl font-bold text-white mb-2">لا توجد منتجات تطابق هذا البحث</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              جرب تغيير الكلمات المفتاحية أو إعادة ضبط فلاتر التخصص ونوع الملفات.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedFileType('all');
              }}
              className="btn-gold !px-6 !py-2.5 text-sm"
            >
              إعادة ضبط جميع الفلاتر
            </button>
          </div>
        )}

        {/* Trust & Guarantee Section */}
        <section className="mt-20 py-12 rawnaq-glass px-4 md:px-8 border border-rawnaq-border">
          <h3 className="text-center text-2xl md:text-3xl font-black text-white mb-2">
            لماذا يثق المحترفون في <span className="gold-gradient-text">رَصِيـن</span>؟
          </h3>
          <p className="text-center text-slate-400 text-sm max-w-xl mx-auto mb-10">
            المنصة مصممة بأعلى معايير الأمان والتسليم الفوري لتوفير وقتك الثمين وضمان جودة مخرجاتك المهنية.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {trustFeatures.map((f) => (
              <div key={f.title} className="bg-rawnaq-surface p-6 rounded-xl border border-rawnaq-border flex flex-col items-center">
                <span className="text-3xl mb-3">{f.icon}</span>
                <h4 className="font-bold text-base mb-2 text-white">{f.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
