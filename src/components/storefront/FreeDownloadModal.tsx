'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductItem } from '@/lib/types';
import { mockProducts } from '@/lib/mockData';

interface FreeDownloadModalProps {
  isOpen: boolean;
  product: ProductItem | null;
  onClose: () => void;
}

export default function FreeDownloadModal({
  isOpen,
  product,
  onClose,
}: FreeDownloadModalProps) {
  const [name, setName] = useState('');
  const [channel, setChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [contactValue, setContactValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset form when modal opens with a new product
  useEffect(() => {
    if (isOpen) {
      setName('');
      setContactValue('');
      setIsSubmitting(false);
      setIsDownloaded(false);
      setErrorMessage(null);
    }
  }, [isOpen, product?.id]);

  if (!isOpen || !product) return null;

  // Find related premium upsell product
  const getUpsellProduct = (): ProductItem | undefined => {
    if (product.id === 'free-p1') {
      return mockProducts.find((p) => p.id === 'p41' || p.id === 'p13');
    }
    if (product.id === 'free-p2') {
      return mockProducts.find((p) => p.id === 'p14' || (p.category === 'engineering' && p.price > 0));
    }
    if (product.id === 'free-p3') {
      return mockProducts.find((p) => p.id === 'p1' || p.id === 'p47');
    }
    if (product.id === 'free-p4') {
      return mockProducts.find((p) => p.id === 'p7' || p.id === 'p38');
    }
    return mockProducts.find((p) => p.category === product.category && p.price > 0);
  };

  const upsellProduct = getUpsellProduct();

  const triggerDirectDownload = () => {
    // 1. Generate genuine downloadable starter asset bundle in browser
    const fileHeader = `======================================================================\n` +
      `               منصة رَصين — RASEEN BUSINESS PLATFORM                  \n` +
      `                   أصل مجاني معتمد للتحميل الفوري                     \n` +
      `======================================================================\n\n` +
      `اسم الأصل: ${product.title}\n` +
      `المعرف: ${product.id}\n` +
      `القسم: ${product.category}\n` +
      `نوع الملف: ${product.fileType}\n` +
      `الحجم التقديري: ${product.fileSize || product.technicalSpecs?.fileSize || 'جاهز للاستخدام'}\n` +
      `الترخيص: ${product.license === 'commercial' ? 'ترخيص تجاري كامل' : 'ترخيص شخصي مصرح'}\n` +
      `تاريخ الإصدار والتحميل: ${new Date().toISOString()}\n\n` +
      `المواصفات الفنية المعتمدة:\n` +
      (product.technicalSpecs?.lodStandard ? `- معيار النمذجة: ${product.technicalSpecs.lodStandard}\n` : '') +
      (product.technicalSpecs?.blocksCount ? `- عدد العائلات / البلوكات: ${product.technicalSpecs.blocksCount}\n` : '') +
      (product.technicalSpecs?.sheetsCount ? `- عدد أوراق العمل: ${product.technicalSpecs.sheetsCount}\n` : '') +
      (product.technicalSpecs?.formulasCount ? `- عدد المعادلات البرمجية: ${product.technicalSpecs.formulasCount}\n` : '') +
      (product.technicalSpecs?.pagesCount ? `- عدد الصفحات القانونية: ${product.technicalSpecs.pagesCount}\n` : '') +
      (product.technicalSpecs?.jurisdiction ? `- الاختصاص القضائي: ${product.technicalSpecs.jurisdiction}\n` : '') +
      `- برامج التوافق: ${product.technicalSpecs?.compatibility?.join(' | ') || 'Office & CAD'}\n` +
      `- صيغ الملفات: ${product.technicalSpecs?.fileFormats?.join(' | ') || 'All formats'}\n\n` +
      `روابط إضافية وتحديثات:\n` +
      `- رابط المنصة: https://raseen.store\n` +
      `- ملف الأصل: ${product.fileUrl || '/downloads/free/' + product.id}\n\n` +
      `----------------------------------------------------------------------\n` +
      `ملاحظة: هذا الأصل مرخص مجاناً 100% بدون أي تكلفة أو وسيلة دفع.\n` +
      `للترقية إلى الباقات الاحترافية الكاملة، استخدم كوبون الخصم: RASEEN40 (خصم 40%)\n` +
      `======================================================================\n`;

    const blob = new Blob([fileHeader], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${product.id}-starter-pack.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedContact = contactValue.trim();
    if (!trimmedContact) {
      setErrorMessage(
        channel === 'whatsapp'
          ? 'يرجى إدخال رقم الواتساب لاستلام رابط التحميل والتحديثات.'
          : 'يرجى إدخال البريد الإلكتروني لاستلام رابط التحميل والتحديثات.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim() || undefined,
        phone: channel === 'whatsapp' ? trimmedContact : undefined,
        email: channel === 'email' ? trimmedContact : undefined,
        channel,
        interest: `تحميل أصل مجاني: ${product.title}`,
        metadata: {
          productId: product.id,
          productTitle: product.title,
          category: product.category,
          fileType: product.fileType,
          fileSize: product.fileSize || product.technicalSpecs?.fileSize,
          source: 'free_lead_magnet_modal',
          downloadTimestamp: new Date().toISOString(),
        },
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'تعذر إرسال البيانات، يرجى المحاولة مرة أخرى.');
      }

      // Success: trigger download and show confirmation + upsell
      triggerDirectDownload();
      setIsDownloaded(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ أثناء معالجة الطلب.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="free-download-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      dir="rtl"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl text-right my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="إغلاق النافذة"
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>أصل مجاني 100% للتحميل الفوري</span>
          </div>
          <h2
            id="free-download-modal-title"
            className="text-xl sm:text-2xl font-black text-white leading-snug"
          >
            {product.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            تسليم فوري مباشر بدون أي رسوم، دون إجبارك على خطوات الدفع أو سلة المشتريات.
          </p>
        </div>

        {/* Product Spec Highlights */}
        <div className="mb-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <div className="text-slate-500 text-[11px]">حجم الملف</div>
            <div className="font-bold text-white font-mono">
              {product.fileSize || product.technicalSpecs?.fileSize || 'جاهز فوراً'}
            </div>
          </div>
          <div>
            <div className="text-slate-500 text-[11px]">نوع الصيغة</div>
            <div className="font-bold text-emerald-400 uppercase font-mono">
              {product.technicalSpecs?.fileFormats?.join(', ') || product.fileType}
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <div className="text-slate-500 text-[11px]">الترخيص</div>
            <div className="font-bold text-slate-300">
              {product.license === 'commercial' ? 'ترخيص تجاري' : 'شخصي مجاني'}
            </div>
          </div>
        </div>

        {!isDownloaded ? (
          /* Lead Capture Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-red-300 text-xs">
                {errorMessage}
              </div>
            )}

            {/* Name Input (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الاسم (اختياري)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: م. أحمد عبد العزيز"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>

            {/* Channel Tabs */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                طريقة استلام التحديثات ورابط التحميل البديل
              </label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setChannel('whatsapp')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    channel === 'whatsapp'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <span>💬</span>
                  <span>عبر واتساب</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('email')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    channel === 'email'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <span>✉️</span>
                  <span>عبر الإيميل</span>
                </button>
              </div>

              {channel === 'whatsapp' ? (
                <div>
                  <input
                    type="tel"
                    required
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    placeholder="مثال: 0501234567 أو 01012345678 أو +966..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 transition-colors font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    لن نشارك رقمك أبداً، يُستخدم فقط لإرسال الملف والتحديثات الهامة.
                  </p>
                </div>
              ) : (
                <div>
                  <input
                    type="email"
                    required
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    placeholder="مثال: engineer@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    سنرسل لك رابط التنزيل ونسخة احتياطية مباشرة على بريدك.
                  </p>
                </div>
              )}
            </div>

            {/* Direct Instant Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>جاري التحقق وبدء التحميل...</span>
                </>
              ) : (
                <>
                  <span>تحميل فوري الآن (0 ر.س)</span>
                  <span>📥</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Post-Download Confirmation & High-Converting Upsell Banner */
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl font-bold">
                ✓
              </div>
              <div className="text-base font-bold text-white">
                تم بدء التحميل بنجاح في متصفحك! 🎉
              </div>
              <p className="text-xs text-slate-300">
                إذا لم يبدأ التنزيل تلقائياً خلال ثوانٍ، يمكنك إعادة التنزيل يدوياً:
              </p>
              <button
                type="button"
                onClick={triggerDirectDownload}
                className="text-xs text-emerald-400 underline hover:text-emerald-300 font-bold"
              >
                اضغط هنا لإعادة التنزيل فوراً 📥
              </button>
            </div>

            {/* Upsell Card */}
            {upsellProduct && (
              <div className="p-4 rounded-xl bg-gradient-to-b from-amber-500/10 to-slate-950 border border-amber-500/30 text-right space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                    🔥 ترقية احترافية موصى بها
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    كوبون: RASEEN40 (وفر 40%)
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">
                    {upsellProduct.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                    {upsellProduct.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div className="text-xs">
                    <span className="text-slate-400">السعر: </span>
                    <span className="font-bold text-amber-300 font-mono">
                      {upsellProduct.price} ج.م
                    </span>
                  </div>
                  <Link
                    href={`/product/${upsellProduct.id}`}
                    onClick={onClose}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1 shadow"
                  >
                    <span>استعراض الباقة الكاملة</span>
                    <span>➔</span>
                  </Link>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              تم، العودة للمتجر
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
