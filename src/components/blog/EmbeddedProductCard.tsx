'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProductItem } from '@/lib/types';
import { mockProducts } from '@/lib/mockData';
import FreeDownloadModal from '@/components/storefront/FreeDownloadModal';

interface EmbeddedProductCardProps {
  productId: string;
  className?: string;
  customCallout?: string;
}

export default function EmbeddedProductCard({
  productId,
  className = '',
  customCallout,
}: EmbeddedProductCardProps) {
  const [isFreeModalOpen, setIsFreeModalOpen] = useState(false);

  // Resolve product data from mockProducts catalog
  const product: ProductItem | undefined = mockProducts.find((p) => p.id === productId);

  if (!product) {
    return null;
  }

  const isFree = product.price === 0;

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-2xl border transition-all duration-300 p-5 sm:p-6 my-6 shadow-xl backdrop-blur-xl ${
          isFree
            ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-slate-950/90 border-emerald-500/40 hover:border-emerald-500/70 shadow-emerald-950/20'
            : 'bg-gradient-to-br from-amber-950/30 via-slate-900/80 to-slate-950/90 border-amber-500/30 hover:border-amber-500/60 shadow-amber-950/20'
        } ${className}`}
      >
        {/* Ambient background glow */}
        <div
          className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            isFree ? 'bg-emerald-500/10' : 'bg-amber-500/10'
          }`}
        />

        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            {isFree ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-black animate-pulse">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>أصل مجاني للتحميل الفوري</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold">
                <span>⭐</span>
                <span>الباقة الاحترافية الكاملة</span>
              </span>
            )}

            <span className="text-[11px] text-slate-400 font-mono">
              معرف: {product.id}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="text-amber-400 font-bold">★ {product.rating}</span>
            <span className="text-slate-400">({product.reviewCount} تقييم)</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{product.salesCount}+ تحميل</span>
          </div>
        </div>

        {/* Custom editorial callout if provided */}
        {customCallout && (
          <div className="mb-3 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-amber-200/90 font-medium">
            💡 {customCallout}
          </div>
        )}

        {/* Title & Description */}
        <div className="mb-4 space-y-1.5">
          <h4 className="text-base sm:text-lg font-black text-white leading-snug">
            {product.title}
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Technical specs pill row */}
        <div className="flex flex-wrap items-center gap-2 mb-5 text-[11px]">
          {product.technicalSpecs?.lodStandard && (
            <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80 text-cyan-300 font-mono">
              {product.technicalSpecs.lodStandard}
            </span>
          )}
          {product.technicalSpecs?.blocksCount && (
            <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80 text-amber-300">
              {product.technicalSpecs.blocksCount} عائلة معتمدة
            </span>
          )}
          {product.technicalSpecs?.sheetsCount && (
            <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80 text-emerald-300">
              {product.technicalSpecs.sheetsCount} أوراق عمل محاسبية
            </span>
          )}
          {product.technicalSpecs?.formulasCount && (
            <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80 text-cyan-300">
              {product.technicalSpecs.formulasCount} معادلة برمجية
            </span>
          )}
          {product.technicalSpecs?.pagesCount && (
            <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80 text-purple-300">
              {product.technicalSpecs.pagesCount} صفحات قانونية
            </span>
          )}
          {product.fileSize && (
            <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80 text-slate-300 font-mono">
              📦 {product.fileSize}
            </span>
          )}
          <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80 text-slate-400">
            بواسطة: {product.vendorName}
          </span>
        </div>

        {/* Price & Action Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
          <div>
            {isFree ? (
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                  مجاناً 100%
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-slate-500 line-through">
                    {product.originalPrice} ج.م
                  </span>
                )}
                <span className="text-[10px] text-emerald-300/80 font-bold bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                  0 ر.س / 0 ج.م
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                  {product.price} ج.م
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-slate-500 line-through">
                    {product.originalPrice} ج.م
                  </span>
                )}
                <span className="text-[10px] text-amber-300/80 font-bold bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded">
                  خصم حصري للقراء
                </span>
              </div>
            )}
            <div className="text-[11px] text-slate-400 mt-0.5">
              {isFree
                ? 'تحميل فوري مباشر بدون أي بطاقة بنكية'
                : 'ترخيص تجاري مدى الحياة + تحديثات مجانية'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isFree ? (
              <button
                type="button"
                onClick={() => setIsFreeModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs sm:text-sm font-black transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 transform active:scale-95"
              >
                <span>📥</span>
                <span>تحميل الأصل مجاناً الآن</span>
              </button>
            ) : (
              <Link
                href={`/product/${product.id}`}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-black transition-all shadow-lg shadow-amber-500/25 flex items-center gap-2 transform active:scale-95"
              >
                <span>🛒</span>
                <span>شراء واستعراض الأصل</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 1-Click Free Download Modal for instant acquisition */}
      {isFree && (
        <FreeDownloadModal
          isOpen={isFreeModalOpen}
          product={product}
          onClose={() => setIsFreeModalOpen(false)}
        />
      )}
    </>
  );
}
