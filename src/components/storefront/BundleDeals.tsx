'use client';

import React from 'react';
import Image from 'next/image';
import { bundleDeals, products } from '@/lib/mockData';
import { useCartStore } from '@/store/cartStore';
import { convertPrice, formatPrice } from '@/lib/currency';

export default function BundleDeals() {
  const addItem = useCartStore((s) => s.addItem);
  const currency = useCartStore((s) => s.currency);

  const handleAddBundle = (productIds: string[]) => {
    productIds.forEach((id) => {
      const prod = products.find((p) => p.id === id);
      if (prod) addItem(prod);
    });
  };

  return (
    <section className="my-16 rawnaq-glass p-6 md:p-8 border border-rawnaq-gold/30 relative overflow-hidden shadow-2xl">
      <div className="absolute -right-20 -top-20 w-60 h-60 bg-rawnaq-gold/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rawnaq-gold/10 border border-rawnaq-gold/30 rounded-full text-xs text-rawnaq-gold font-bold mb-2">
            <span>🔥 حزم التوفير الحصرية (Bundles)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white">
            حقائب رقمية متكاملة بخصومات تصل إلى <span className="text-rawnaq-gold">40%</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            اشترِ مجموعة الأدوات المنسقة معاً لتوفير الوقت والمال بنقرة واحدة.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {bundleDeals.map((bundle) => {
          const displayPrice = formatPrice(convertPrice(bundle.bundlePrice, currency), currency);
          const displayOriginal = formatPrice(convertPrice(bundle.originalPrice, currency), currency);

          return (
            <div
              key={bundle.id}
              className="bg-rawnaq-surface border border-rawnaq-border hover:border-rawnaq-gold/50 rounded-2xl p-5 flex flex-col justify-between transition-all group hover:shadow-xl hover:shadow-rawnaq-gold/5"
            >
              <div>
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-4 border border-rawnaq-border bg-rawnaq-dark">
                  <Image
                    src={bundle.imageUrl}
                    alt={bundle.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-red-500/90 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-black text-white shadow-md">
                    {bundle.discountBadge}
                  </div>
                </div>

                <h3 className="font-bold text-white text-base md:text-lg mb-2 leading-snug group-hover:text-rawnaq-gold transition-colors">
                  {bundle.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">
                  {bundle.description}
                </p>
              </div>

              <div className="pt-4 border-t border-rawnaq-border/60 flex items-center justify-between">
                <div>
                  <div className="text-slate-500 line-through text-xs">{displayOriginal}</div>
                  <div className="text-xl font-black text-rawnaq-gold">{displayPrice}</div>
                </div>

                <button
                  onClick={() => handleAddBundle(bundle.productIds)}
                  className="btn-gold !px-4 !py-2 text-xs md:text-sm font-bold flex items-center gap-1.5 shadow-md shadow-rawnaq-gold/20"
                  aria-label={`شراء حزمة ${bundle.title}`}
                >
                  <span>أضف الحزمة</span>
                  <span>🎁</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
