'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { ProductItem } from '@/lib/types';
import { formatPrice } from '@/lib/currency';

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const currency = useCartStore((s) => s.currency);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isFav = useWishlistStore((s) => s.isInWishlist(product.id));

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
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
    <Link
      href={`/product/${product.id}`}
      className="block group rounded-xl overflow-hidden bg-raseen-surface border border-raseen-border hover:border-raseen-gold/40 hover:shadow-lg hover:shadow-raseen-gold/5 transition-all duration-300 raseen-glass-hover"
      aria-label={`عرض تفاصيل المنتج ${product.title}`}
    >
      <div className="relative aspect-[3/2] w-full bg-raseen-navy overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
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
          <div className="absolute top-3 left-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 px-2.5 py-1 rounded-md text-xs font-black shadow-lg shadow-emerald-500/20 flex items-center gap-1">
            <span>🎁</span>
            <span>هدية مجانية</span>
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

        <button
          onClick={handleWishlistClick}
          className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-md transition-all border min-h-[44px] min-w-[44px] flex items-center justify-center ${
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

      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1 text-raseen-gold">
            <span>⭐</span>
            <span className="font-medium">{product.rating}</span>
            <span>({product.reviewCount})</span>
          </div>
          <div>{product.salesCount} مبيعة</div>
        </div>

        <h3 className="text-lg font-bold text-white line-clamp-2 leading-snug" title={product.title}>
          {product.title}
        </h3>

        <p className="text-sm text-slate-400 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-2 mt-1">
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
              ✓ تسليم فوري
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 group-hover:text-raseen-gold font-bold px-2 py-1 rounded transition-colors flex items-center gap-1">
              <span>التفاصيل</span>
              <span className="text-sm">←</span>
            </span>
            <button
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
    </Link>
  );
}
