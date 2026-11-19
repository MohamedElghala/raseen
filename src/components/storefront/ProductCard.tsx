'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { ProductItem } from '@/lib/types';
import { formatPrice } from '@/lib/currency';
import FreeDownloadModal from './FreeDownloadModal';

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const currency = useCartStore((s) => s.currency);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isFav = useWishlistStore((s) => s.isInWishlist(product.id));
  const [isFreeModalOpen, setIsFreeModalOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.imageUrl || '/products/fallback-card.svg');

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.price === 0) {
      setIsFreeModalOpen(true);
    } else {
      addItem(product);
      toggleCart(true);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const displayPrice = formatPrice(product.price, currency);
  const displayOriginal = product.originalPrice
    ? formatPrice(product.originalPrice, currency)
    : null;

  return (
    <>
      <article className="group flex flex-col rounded-xl overflow-hidden bg-raseen-surface border border-raseen-border hover:border-raseen-gold/40 hover:shadow-lg hover:shadow-raseen-gold/5 transition-all duration-300 raseen-glass-hover">
        <div className="relative aspect-[3/2] w-full bg-raseen-navy overflow-hidden">
          <Link
            href={`/product/${product.id}`}
            className="block w-full h-full"
            aria-label={`عرض تفاصيل المنتج ${product.title}`}
          >
            <Image
              src={imgSrc}
              alt={product.title}
              fill
              onError={() => setImgSrc('/products/fallback-card.svg')}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />

            <div className="absolute top-3 right-3 bg-raseen-dark/80 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white border border-raseen-border">
              {product.category === 'business' && '🏢 شركات'}
              {product.category === 'accounting' && '📊 محاسبة'}
              {product.category === 'engineering' && '📐 هندسة'}
              {product.category === 'students' && '🎓 طلاب'}
              {product.category === 'individuals' && '👤 أفراد'}
            </div>

            {product.price === 0 ? (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 text-slate-950 px-2.5 py-1 rounded-lg text-[11px] font-black shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 border border-emerald-300/40 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                <span>أصل مجاني للتحميل الفوري</span>
              </div>
            ) : discountPercent > 0 ? (
              <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white shadow-sm">
                وفر {discountPercent}%
              </div>
            ) : null}

            {(product.fileType === 'canva' || product.tags.some(t => t.toLowerCase() === 'canva')) && (
              <div className="absolute bottom-3 left-3 bg-cyan-950/85 border border-cyan-400/50 text-cyan-300 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[11px] font-black flex items-center gap-1 shadow-md shadow-cyan-950/50">
                <span>🎨</span>
                <span>Canva Ready</span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={handleWishlistClick}
            className={`absolute bottom-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all border min-h-[44px] min-w-[44px] flex items-center justify-center ${
              isFav
                ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-lg shadow-red-500/20'
                : 'bg-raseen-dark/50 hover:bg-raseen-dark text-slate-300 hover:text-red-400 border-transparent hover:border-raseen-border'
            }`}
            aria-label={isFav ? 'إزالة من المفضلة' : 'أضف إلى المفضلة'}
          >
            <svg className="w-5 h-5" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        <div className="p-4 flex flex-col flex-1 gap-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase px-2 py-0.5 rounded bg-raseen-navy border border-raseen-border text-raseen-gold font-bold">
              {product.fileType}
            </span>
            <span>{product.license === 'commercial' ? 'ترخيص تجاري' : 'ترخيص شخصي'}</span>
          </div>

          <Link href={`/product/${product.id}`} className="block space-y-2 focus:outline-none">
            <h3 className="text-lg font-bold text-white line-clamp-2 leading-snug hover:text-raseen-gold transition-colors" title={product.title}>
              {product.title}
            </h3>

            <p className="text-sm text-slate-400 line-clamp-2">{product.description}</p>
          </Link>

          <div className="flex items-center gap-2 mt-auto pt-1">
            <div className="w-6 h-6 rounded-full bg-raseen-accent flex items-center justify-center text-xs font-bold text-white border border-raseen-border">
              {product.vendorName.charAt(0)}
            </div>
            <span className="text-xs text-slate-300">{product.vendorName}</span>
          </div>

          <div className="flex items-center justify-between mt-2 pt-3 border-t border-raseen-border/50 gap-2">
            <div className="flex flex-col">
              {product.price === 0 ? (
                <span className="text-lg sm:text-xl font-black text-emerald-400">مجاناً 100%</span>
              ) : (
                <span className="text-lg sm:text-xl font-black text-raseen-gold">{displayPrice}</span>
              )}
              {displayOriginal && (
                <span className="text-xs text-slate-500 line-through">{displayOriginal}</span>
              )}
              <span className="text-[10px] text-green-400 flex items-center gap-1 font-medium">
                {product.price === 0 ? '✓ تحميل فوري' : '✓ تسليم رقمي موثق'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/product/${product.id}`}
                className="text-xs text-slate-300 hover:text-raseen-gold font-bold px-2 py-1 rounded transition-colors flex items-center gap-1"
              >
                <span>التفاصيل</span>
                <span className="text-sm">←</span>
              </Link>
              <button
                type="button"
                onClick={handleBuyClick}
                aria-label={product.price === 0 ? `تحميل ${product.title} مجاناً` : `شراء ${product.title} الآن`}
                className={`!px-3.5 !py-2 text-xs font-bold flex items-center gap-1.5 shadow-md ${
                  product.price === 0
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 rounded-xl transition-all'
                    : 'btn-gold shadow-raseen-gold/10'
                }`}
              >
                <span>{product.price === 0 ? 'تحميل مجاني' : 'شراء'}</span>
                <span>{product.price === 0 ? '📥' : '🛒'}</span>
              </button>
            </div>
          </div>
        </div>
      </article>
      {product.price === 0 && (
        <FreeDownloadModal
          isOpen={isFreeModalOpen}
          product={product}
          onClose={() => setIsFreeModalOpen(false)}
        />
      )}
    </>
  );
}
