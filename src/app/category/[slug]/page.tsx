import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categories, mockProducts } from '@/lib/mockData';
import ProductCard from '@/components/storefront/ProductCard';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: 'القسم غير موجود - رَصين' };

  return {
    title: `${category.name} | رَصِيـن للأصول الرقمية`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = mockProducts.filter((p) => p.category === slug);

  return (
    <main className="min-h-screen bg-rawnaq-dark text-white font-cairo pb-20" dir="rtl" lang="ar">
      
      {/* Category Hero Banner */}
      <section className="relative w-full py-12 sm:py-16 bg-[#060a14] border-b border-rawnaq-border overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-rawnaq-gold/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center text-xs text-slate-400 gap-2 mb-6" aria-label="مسار التنقل">
            <Link href="/" className="hover:text-rawnaq-gold transition-colors">الرئيسية</Link>
            <span>‹</span>
            <Link href="/#products" className="hover:text-rawnaq-gold transition-colors">السوق الرقمي</Link>
            <span>‹</span>
            <span className="text-rawnaq-gold font-bold">{category.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rawnaq-surface border border-rawnaq-border text-xs text-rawnaq-gold font-bold">
                <span className="text-base">{category.icon}</span>
                <span>قسم معتمد • {categoryProducts.length} أصل رقمي</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {category.name}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {category.description} تم إعداد وتدقيق كافة الملفات بواسطة نخبة من الخبراء والاستشاريين المعتمدين لضمان دقة العمل والامتثال الكامل.
              </p>
            </div>

            <div className="flex flex-wrap md:flex-col gap-3 shrink-0">
              <Link
                href="/#products"
                className="btn-outline !py-2.5 !px-5 text-xs font-bold flex items-center justify-center gap-2"
              >
                <span>تصفح كافة أقسام السوق</span>
                <span>←</span>
              </Link>
              {slug === 'business' || slug === 'students' ? (
                <Link
                  href="/editor"
                  className="btn-gold !py-2.5 !px-5 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-rawnaq-gold/20"
                >
                  <span>فتح محرر الاستوديو المباشر</span>
                  <span>🎨</span>
                </Link>
              ) : null}
            </div>
          </div>

        </div>
      </section>

      {/* Catalog Grid */}
      <section className="container mx-auto px-4 max-w-6xl py-12">
        <div className="flex items-center justify-between pb-4 mb-8 border-b border-rawnaq-border">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{category.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-white">الأصول والملفات المتاحة في هذا القسم</h2>
              <span className="text-xs text-slate-400">جميع الملفات تشمل تسليماً فورياً وترخيص استخدام موثق</span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-rawnaq-gold bg-rawnaq-surface px-3 py-1.5 rounded-lg border border-rawnaq-border">
            {categoryProducts.length} ملف جاهز للتحميل
          </span>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-rawnaq-surface rounded-2xl border border-rawnaq-border">
            <span className="text-4xl block mb-2">📦</span>
            <h3 className="text-lg font-bold text-white mb-1">جاري رفع أصول إضافية في هذا القسم</h3>
            <p className="text-xs text-slate-400">يرجى متابعة التحديثات أو التواصل مع الدعم لطلب ملف مخصص.</p>
          </div>
        )}
      </section>

    </main>
  );
}
