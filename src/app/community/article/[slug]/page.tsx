'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { getArticleBySlug, BLOG_ARTICLES } from '@/lib/blogArticlesData';
import { mockProducts } from '@/lib/mockData';
import ReadingProgressBar from '@/components/blog/ReadingProgressBar';
import TableOfContents from '@/components/blog/TableOfContents';
import EmbeddedProductCard from '@/components/blog/EmbeddedProductCard';
import FreeDownloadModal from '@/components/storefront/FreeDownloadModal';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default function ArticleDetailPage({ params }: ArticlePageProps) {
  // Support both synchronous test execution and Next.js 15 async promise resolution
  const directSlug = (params as any)?.slug;
  const resolvedParams = directSlug ? { slug: directSlug } : use(params);

  const slug = resolvedParams?.slug;
  const article = getArticleBySlug(slug);

  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedFreeProduct, setSelectedFreeProduct] = useState<any | null>(null);

  if (!article) {
    return (
      <main
        className="min-h-screen bg-raseen-dark text-white font-cairo flex items-center justify-center p-4"
        dir="rtl"
        lang="ar"
      >
        <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 text-center max-w-md w-full shadow-2xl backdrop-blur-xl">
          <span className="text-5xl mb-4 block">🔍</span>
          <h1 className="text-xl sm:text-2xl font-bold mb-2 text-white">
            المقال التخصصي غير موجود
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
            ربما تم نقل المقال أو أن الرابط غير صحيح. يمكنك تصفح كافة الأدلة في المدونة التخصصية.
          </p>
          <Link
            href="/community"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 text-xs font-black inline-block shadow-lg shadow-cyan-500/20"
          >
            العودة لمدونة ومجتمع رَصين ←
          </Link>
        </div>
      </main>
    );
  }

  // Find primary free lead magnet if available in embeddedProductIds
  const freeProductId = article.embeddedProductIds.find((pid) => pid.startsWith('free-'));
  const freeProduct = freeProductId ? mockProducts.find((p) => p.id === freeProductId) : null;

  // Other related articles
  const otherArticles = BLOG_ARTICLES.filter((a) => a.id !== article.id);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <main
      className="min-h-screen bg-raseen-dark text-white font-cairo py-8 relative"
      dir="rtl"
      lang="ar"
    >
      {/* Sticky Scroll Progress Bar */}
      <ReadingProgressBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="مسار التنقل"
          className="flex items-center gap-2 text-xs text-slate-400 mb-8 overflow-x-auto pb-2 scrollbar-none"
        >
          <Link href="/" className="hover:text-amber-300 transition-colors">
            الرئيسية
          </Link>
          <span className="text-slate-600">/</span>
          <Link href="/community" className="hover:text-amber-300 transition-colors">
            مجتمع رَصين
          </Link>
          <span className="text-slate-600">/</span>
          <Link href="/community" className="hover:text-cyan-300 transition-colors">
            المدونة التخصصية
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-cyan-400 font-bold truncate max-w-xs sm:max-w-md">
            {article.title}
          </span>
        </nav>

        {/* Article Header Hero */}
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950 to-raseen-dark border border-slate-800 p-6 sm:p-10 md:p-12 mb-10 shadow-2xl backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl space-y-6">
            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-bold">
                {article.categoryLabel}
              </span>
              <span className="text-slate-400 flex items-center gap-1.5">
                <span>⏱️</span>
                <span>{article.readingTime}</span>
              </span>
              <span className="text-slate-400 flex items-center gap-1.5">
                <span>👁️</span>
                <span>{article.views} قراءة</span>
              </span>
              <span className="text-slate-400 font-mono flex items-center gap-1.5">
                <span>📅</span>
                <span>{article.publishedAt}</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
              {article.title}
            </h1>

            {/* Excerpt Lead */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed border-r-4 border-amber-400 pr-4 py-1">
              {article.excerpt}
            </p>

            {/* Author Profile Bar */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shadow-inner">
                  {article.author.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{article.author.name}</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-normal">
                      كاتب معتمد
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">{article.author.role}</div>
                </div>
              </div>

              {/* Share & Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors flex items-center gap-1.5 border border-slate-700"
                >
                  <span>{copiedLink ? '✓ تم النسخ' : '🔗 نسخ الرابط'}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Layout: Reading Content + Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Article Body Column (8 cols) */}
          <article className="lg:col-span-8 space-y-12">
            {article.sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 space-y-4 bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 sm:p-8 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
                    محور #{String(index + 1).padStart(2, '0')}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    {section.title}
                  </h2>
                </div>

                {/* Section Content Paragraphs */}
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  {section.content.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>

                {/* Key Points Bullet List */}
                {section.keyPoints && section.keyPoints.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-800/70 bg-slate-950/60 p-5 rounded-xl border border-slate-800/50 space-y-2.5">
                    <h3 className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                      <span>📌</span>
                      <span>أهم النقاط التنفيذية والخلاصات:</span>
                    </h3>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                      {section.keyPoints.map((point, ptIdx) => (
                        <li key={ptIdx} className="flex items-start gap-2.5 leading-relaxed">
                          <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Callout Box if present */}
                {section.callout && (
                  <div
                    className={`mt-4 p-4 rounded-xl text-xs sm:text-sm leading-relaxed border flex items-start gap-3 ${
                      section.callout.type === 'warning'
                        ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                        : section.callout.type === 'tip'
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                        : 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200'
                    }`}
                  >
                    <span className="text-lg shrink-0">
                      {section.callout.type === 'warning'
                        ? '⚠️'
                        : section.callout.type === 'tip'
                        ? '💡'
                        : 'ℹ️'}
                    </span>
                    <div>{section.callout.text}</div>
                  </div>
                )}

                {/* Embed related product in specific sections */}
                {index === 1 && article.embeddedProductIds[0] && (
                  <div className="pt-2">
                    <EmbeddedProductCard
                      productId={article.embeddedProductIds[0]}
                      customCallout="أصل عملي مجاني مرتبط بهذا الشرح لتطبيقه في مشروعك الآن"
                    />
                  </div>
                )}

                {index === 3 && article.embeddedProductIds[1] && (
                  <div className="pt-2">
                    <EmbeddedProductCard
                      productId={article.embeddedProductIds[1]}
                      customCallout="الترسانة الكاملة المعتمدة للترقية والتنفيذ الشامل"
                    />
                  </div>
                )}
              </section>
            ))}

            {/* End of Article Summary & Embedded Products Showcase */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>🎁</span>
                  <span>الأصول والنماذج التنفيذية الملحقة بهذا الدليل:</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  حمّل النموذج التمهيدي مجاناً، أو احصل على الباقة الاحترافية الكاملة مع ترخيص الاستخدام التجاري.
                </p>
              </div>

              <div className="space-y-4">
                {article.embeddedProductIds.map((pid) => (
                  <EmbeddedProductCard key={pid} productId={pid} />
                ))}
              </div>
            </div>

            {/* Tags Cloud */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-slate-400">الوسوم والكلمات الدلالية:</span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Author Bio Card */}
            {article.author.bio && (
              <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl shrink-0">
                  {article.author.avatar}
                </div>
                <div className="space-y-1 text-center sm:text-right">
                  <h4 className="text-sm font-bold text-white">عن الكاتب: {article.author.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{article.author.bio}</p>
                </div>
              </div>
            )}
          </article>

          {/* Sticky Sidebar Column (4 cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
            {/* Interactive Table of Contents */}
            <TableOfContents sections={article.sections} />

            {/* Quick Free Lead Magnet Card */}
            {freeProduct && (
              <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900/90 rounded-2xl border border-emerald-500/40 p-5 space-y-4 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 text-lg">🎁</span>
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-400 font-mono">
                      هدية القراء المجانية
                    </span>
                    <h4 className="text-xs font-bold text-white line-clamp-1">
                      {freeProduct.title}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {freeProduct.description}
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-emerald-500/20">
                  <span className="text-emerald-300 font-bold font-mono">مجاناً 100%</span>
                  <button
                    type="button"
                    onClick={() => setSelectedFreeProduct(freeProduct)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-emerald-500/20"
                  >
                    تنزيل فوري 📥
                  </button>
                </div>
              </div>
            )}

            {/* Related Articles Navigation */}
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
                <span>📚</span>
                <span>أدلة تخصصية أخرى في المدونة:</span>
              </h4>
              <ul className="space-y-3">
                {otherArticles.map((other) => (
                  <li key={other.id} className="text-xs">
                    <Link
                      href={`/community/article/${other.slug}`}
                      className="group block space-y-1 hover:text-cyan-300 transition-colors"
                    >
                      <div className="text-[10px] text-cyan-400 font-bold">
                        {other.categoryLabel} • {other.readingTime}
                      </div>
                      <div className="text-slate-200 group-hover:text-cyan-300 font-medium leading-snug line-clamp-2">
                        {other.title}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Back to Community Link */}
            <div className="text-center pt-2">
              <Link
                href="/community"
                className="text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 py-2"
              >
                <span>←</span>
                <span>العودة إلى ساحة المجتمع والمدونة الكاملة</span>
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Free Lead Magnet Download Modal */}
      {selectedFreeProduct && (
        <FreeDownloadModal
          isOpen={true}
          product={selectedFreeProduct}
          onClose={() => setSelectedFreeProduct(null)}
        />
      )}
    </main>
  );
}
