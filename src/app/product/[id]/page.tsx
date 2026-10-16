'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { mockProducts, mockReviews } from '@/lib/mockData';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/currency';
import ProductCard from '@/components/storefront/ProductCard';
import FreeDownloadModal from '@/components/storefront/FreeDownloadModal';
import ExcelInspector from '@/components/products/ExcelInspector';
import ContractInspector from '@/components/products/ContractInspector';
import CadRevitInspector from '@/components/products/CadRevitInspector';
import FreelanceCustomizationCard from '@/components/products/FreelanceCustomizationCard';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';

  const addItem = useCartStore((state) => state.addItem);
  const currency = useCartStore((state) => state.currency);
  const [isFreeModalOpen, setIsFreeModalOpen] = useState(false);

  const product = useMemo(() => {
    return mockProducts.find((p) => p.id === id);
  }, [id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return mockProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  const reviews = useMemo(() => {
    return mockReviews.filter((r) => r.productId === id);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-raseen-dark text-white font-cairo px-4" dir="rtl" lang="ar">
        <h1 className="text-4xl font-bold text-raseen-gold mb-4">404 - المنتج غير موجود</h1>
        <p className="text-slate-400 mb-8">عذراً، المنتج الذي تبحث عنه غير متوفر أو تم حذفه.</p>
        <button
          onClick={() => router.push('/')}
          className="btn-gold"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const displayPrice = formatPrice(product.price, currency);
  const displayOriginalPrice = product.originalPrice
    ? formatPrice(product.originalPrice, currency)
    : null;

  return (
    <main className="min-h-screen bg-raseen-dark text-white font-cairo pb-20" dir="rtl" lang="ar">
      <div className="container mx-auto px-4 py-8">

        {/* Breadcrumb & Back button */}
        <div className="flex items-center justify-between mb-8">
          <nav className="flex items-center text-sm text-slate-400 flex-wrap gap-2">
            <Link href="/" className="hover:text-raseen-gold transition-colors">الرئيسية</Link>
            <span>‹</span>
            <span className="text-slate-300">{product.category}</span>
            <span>‹</span>
            <span className="text-white font-medium">{product.title}</span>
          </nav>
          <button
            onClick={() => router.back()}
            className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors text-sm"
          >
            <span>› عودة</span>
          </button>
        </div>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-raseen-navy p-6 md:p-8 rounded-2xl border border-raseen-border mb-16">
          {/* Visuals */}
          <div className="relative aspect-[3/2] w-full rounded-xl overflow-hidden border border-raseen-border bg-raseen-dark">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-block px-3 py-1 bg-raseen-dark border border-raseen-border text-raseen-gold rounded-full text-xs font-semibold">
                  {product.category}
                </span>
                {product.price === 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 text-slate-950 rounded-full text-xs font-black shadow-lg shadow-emerald-500/20 border border-emerald-300/40 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                    <span>أصل مجاني للتحميل الفوري</span>
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">{product.title}</h1>

              <div className="flex items-center gap-4 mb-6 text-sm flex-wrap">
                <div className="flex items-center text-raseen-gold gap-1">
                  <span>⭐</span>
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-slate-400">({reviews.length} تقييم)</span>
                </div>
                <div className="text-slate-600">|</div>
                <div className="text-slate-400">
                  المبيعات: <span className="text-white font-bold">{product.salesCount || 0}</span>
                </div>
                <div className="text-slate-600">|</div>
                <div className="text-green-400 flex items-center gap-1">
                  <span>✓</span> تسليم فوري وتلقائي
                </div>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed mb-6 flex-grow text-sm md:text-base">
              {product.description}
            </p>

            <div className="bg-raseen-surface p-4 rounded-xl border border-raseen-border mb-6 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">نوع الترخيص:</span>
                <span className="text-white font-semibold">
                  {product.license === 'commercial' ? 'تجاري ومشاريع عمل' : 'استخدام شخصي'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">صيغة الملف:</span>
                <span className="text-raseen-gold font-semibold uppercase">{product.fileType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">البائع والمطور:</span>
                <span className="text-white font-semibold">{product.vendorName}</span>
              </div>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-slate-400 text-xs">الوسوم:</span>
                {product.tags.map((tag: string) => (
                  <span key={tag} className="px-2.5 py-1 bg-raseen-dark text-slate-300 text-xs rounded-md border border-raseen-border">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Canva / Online Customizer banner */}
            {(product.fileType === 'canva' || product.tags?.some((t: string) => t.toLowerCase() === 'canva')) && (
              <div className="mb-6 p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎨</span>
                  <div>
                    <div className="font-bold text-white text-sm">متاح للتعديل المباشر في المتصفح و Canva</div>
                    <div className="text-xs text-cyan-300">يمكنك تخصيص بياناتك ومعاينتها فوراً قبل أو بعد التحميل</div>
                  </div>
                </div>
                <Link
                  href="/editor"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 transition-colors shadow"
                >
                  فتح في الاستوديو ➔
                </Link>
              </div>
            )}

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-raseen-border">
              <div>
                {displayOriginalPrice && (
                  <div className="text-slate-500 line-through text-xs mb-1">{displayOriginalPrice}</div>
                )}
                {product.price === 0 ? (
                  <div className="text-3xl font-black text-emerald-400">مجاناً 100%</div>
                ) : (
                  <div className="text-3xl font-black text-raseen-gold">{displayPrice}</div>
                )}
              </div>

              {product.price === 0 ? (
                <button
                  onClick={() => setIsFreeModalOpen(true)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black flex items-center gap-2 !px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 text-base transition-all"
                  aria-label="تحميل مجاني فوري"
                >
                  <span>تحميل مجاني فوري</span>
                  <span>📥</span>
                </button>
              ) : (
                <button
                  onClick={() => addItem(product)}
                  className="btn-gold flex items-center gap-2 !px-8 shadow-lg shadow-raseen-gold/20"
                  aria-label="أضف للسلة"
                >
                  <span>أضف للسلة</span>
                  <span>🛒</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Specialized Technology & Asset Inspector */}
        {product.fileType === 'excel' && (
          <div className="mb-16">
            <ExcelInspector product={product} />
          </div>
        )}

        {(product.fileType === 'word-pdf' || product.tags.includes('عقود') || product.tags.includes('قانوني')) && (
          <div className="mb-16">
            <ContractInspector product={product} />
          </div>
        )}

        {product.fileType === 'cad-revit' && (
          <div className="mb-16">
            <CadRevitInspector product={product} />
          </div>
        )}

        {/* Freelance Customization & Expert Assistance */}
        <FreelanceCustomizationCard productTitle={product.title} fileType={product.fileType} />

        {/* Reviews Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-raseen-border pb-4">
            تقييمات المشترين ({reviews.length})
          </h2>
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-raseen-surface p-5 rounded-xl border border-raseen-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-raseen-accent rounded-full flex items-center justify-center font-bold text-raseen-gold border border-raseen-border">
                        {review.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{review.userName}</div>
                        <div className="text-xs text-slate-500">{review.date}</div>
                      </div>
                    </div>
                    <div className="text-raseen-gold text-sm">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-raseen-surface rounded-xl border border-raseen-border text-slate-400">
              لا توجد تقييمات لهذا المنتج بعد. كن أول من يقيّم بعد الشراء!
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-raseen-border pb-4">منتجات مشابهة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}

      </div>

      {product.price === 0 && (
        <FreeDownloadModal
          isOpen={isFreeModalOpen}
          product={product}
          onClose={() => setIsFreeModalOpen(false)}
        />
      )}
    </main>
  );
}
