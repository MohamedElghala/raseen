'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/currency';
import RaseenLogoLoader from '@/components/brand/RaseenLogoLoader';
import { Analytics } from '@/lib/analytics';
import { generateDigitalLicense } from '@/lib/licenseEngine';

interface OrderTokenEntry {
  productId: string;
  token: string;
  downloadUrl: string;
  verifyUrl?: string;
}

interface OrderLicenseEntry {
  licenseId: string;
  assetId: string;
  assetTitle: string;
  buyerIdentifier: string;
  issuedAt: string;
  licenseType: 'Commercial' | 'Personal' | 'Enterprise';
  verificationHash: string;
  verificationToken?: string;
  protectionTerms: string[];
}

type PaymentMethod = 'instapay' | 'vodafone' | 'whatsapp' | 'preview_sample' | null;

export default function CartModal() {
  const isOpen = useCartStore((s) => s.isOpen);
  const items = useCartStore((s) => s.items);
  const currency = useCartStore((s) => s.currency);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('instapay');
  const [buyerContact, setBuyerContact] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState<typeof items>([]);
  const [orderReference, setOrderReference] = useState('');
  const [orderStatus, setOrderStatus] = useState<'completed' | 'pending'>('pending');
  const [orderTokens, setOrderTokens] = useState<OrderTokenEntry[]>([]);
  const [orderLicenses, setOrderLicenses] = useState<OrderLicenseEntry[]>([]);
  const [copiedInstaPay, setCopiedInstaPay] = useState(false);
  const [copiedVodafone, setCopiedVodafone] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalPriceEGP = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const displayTotalPrice = formatPrice(totalPriceEGP, currency);

  const handleCheckout = () => {
    Analytics.beginCheckout(totalPriceEGP, items.length);
    setStep('checkout');
  };

  const handleConfirmOrder = async () => {
    if (!buyerContact.trim()) {
      setContactError('يرجى كتابة رقم الهاتف أو البريد الإلكتروني لإرسال تفاصيل الطلب ورابط التحميل');
      return;
    }
    setContactError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerContact: buyerContact.trim(),
          buyerEmail: buyerContact.includes('@') ? buyerContact.trim() : undefined,
          paymentMethod: paymentMethod || 'instapay',
          currency,
          items: items.map((i) => ({ id: i.id, quantity: i.quantity || 1 })),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setContactError(data.error || 'تعذر تسجيل الطلب، يرجى التحقق من البيانات والمحاولة مجدداً.');
        return;
      }

      const finalOrderId = data.orderId || `ORD-${Date.now().toString(36).toUpperCase()}`;
      const status: 'completed' | 'pending' = data.status === 'completed' ? 'completed' : 'pending';
      const tokens: OrderTokenEntry[] = Array.isArray(data.tokens) ? data.tokens : [];
      const licenses: OrderLicenseEntry[] = Array.isArray(data.licenses) ? data.licenses : [];

      setOrderReference(finalOrderId);
      setOrderStatus(status);
      setOrderTokens(tokens);
      setOrderLicenses(licenses);

      if (typeof window !== 'undefined') {
        try {
          const existingRaw = localStorage.getItem('raseen-orders-history');
          const existing = existingRaw ? JSON.parse(existingRaw) : [];
          const record = {
            orderId: finalOrderId,
            status,
            currency,
            totalAmount: data.totalAmount ?? totalPriceEGP,
            createdAt: new Date().toISOString(),
            buyerContact: buyerContact.trim(),
            items: items.map((i) => ({
              id: i.id,
              title: i.title,
              fileType: i.fileType,
              imageUrl: i.imageUrl,
              downloadUrl: tokens.find((t) => t.productId === i.id)?.downloadUrl,
              licenseToken: licenses.find((l) => l.assetId === i.id)?.verificationToken,
            })),
          };
          localStorage.setItem(
            'raseen-orders-history',
            JSON.stringify([record, ...existing].slice(0, 20))
          );
        } catch {
          // ignore localStorage failures in restricted browsers
        }
      }

      Analytics.purchase(finalOrderId, totalPriceEGP, currency);
      setPurchasedItems([...items]);
      clearCart();
      setStep('success');
    } catch {
      setContactError('تعذر الاتصال بالخادم لإتمام الطلب، يرجى المحاولة بعد قليل.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    toggleCart(false);
    setTimeout(() => {
      setStep('cart');
      setPaymentMethod('instapay');
      setDownloadNotice(null);
      setContactError(null);
    }, 300);
  };

  const triggerAssetDownload = (itemTitle: string, itemId: string) => {
    const tokenEntry = orderTokens.find((t) => t.productId === itemId);
    if (orderStatus === 'completed' && tokenEntry?.downloadUrl) {
      const a = document.createElement('a');
      a.href = tokenEntry.downloadUrl;
      a.download = `raseen-${itemId}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloadNotice(`جاري تحميل الملف الأصلي لـ [${itemTitle}]!`);
      setTimeout(() => setDownloadNotice(null), 4000);
      return;
    }

    setDownloadNotice('روابط تنزيل الملفات المدفوعة تتفعل فور تأكيد التحويل المالي عبر الواتساب.');
    setTimeout(() => setDownloadNotice(null), 4500);
  };

  const triggerDownload = (itemTitle: string, itemId: string = 'p-asset') => {
    try {
      const serverLic = orderLicenses.find((l) => l.assetId === itemId);
      const license =
        serverLic ||
        generateDigitalLicense(
          itemId,
          itemTitle,
          buyerContact || 'عميل رَصين',
          'Commercial'
        );

      const isReceiptOnly = orderStatus !== 'completed';
      const verifyUrl =
        license.verificationToken
          ? `https://raseen-nine.vercel.app/verify?token=${encodeURIComponent(license.verificationToken)}`
          : 'https://raseen-nine.vercel.app/verify';

      const licenseText = [
        '======================================================================',
        isReceiptOnly
          ? '              منصة رَصين — وثيقة حجز طلب بانتظار التحويل              '
          : '                 منصة رَصين — وثيقة ترخيص رقمي موثقة                ',
        '               RASEEN VERIFIABLE DIGITAL ASSET RECORD                 ',
        '======================================================================',
        '',
        `رقم الطلب المرجعي: ${orderReference}`,
        `حالة الطلب: ${isReceiptOnly ? 'بانتظار تأكيد التحويل المالي (Pending)' : 'مكتمل ومفعّل (Completed)'}`,
        `رقم الوثيقة: ${license.licenseId}`,
        `اسم الأصل: ${license.assetTitle}`,
        `المشتري: ${license.buyerIdentifier}`,
        `نوع الترخيص: ${license.licenseType}`,
        `تاريخ الإصدار: ${license.issuedAt}`,
        `بصمة التحقق (SHA-256): ${license.verificationHash}`,
        ...(license.verificationToken
          ? ['', `رمز التوثيق الرقمي:`, license.verificationToken, `رابط التحقق الرسمي: ${verifyUrl}`]
          : []),
        '',
        'شروط الاستخدام والحماية:',
        ...license.protectionTerms.map((t, idx) => `${idx + 1}. ${t}`),
        '',
        '----------------------------------------------------------------------',
        'صادر عن منصة رَصين للأصول الرقمية (https://raseen-nine.vercel.app)',
        '======================================================================',
      ].join('\n');

      const blob = new Blob([licenseText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = isReceiptOnly
        ? `order_receipt_${orderReference}_${itemId}.txt`
        : `license_${license.licenseId}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadNotice(
        isReceiptOnly
          ? `تم حفظ وثيقة حجز الطلب [${orderReference}] بنجاح.`
          : `تم تحميل وثيقة ترخيص [${itemTitle}] بنجاح!`
      );
      setTimeout(() => setDownloadNotice(null), 4000);
    } catch {
      setDownloadNotice('تعذر بدء التحميل التلقائي، يمكنك نسخ رقم المرجع أو مراجعة لوحة المشتري.');
    }
  };

  const copyToClipboard = (text: string, type: 'instapay' | 'vodafone') => {
    navigator.clipboard.writeText(text);
    if (type === 'instapay') {
      setCopiedInstaPay(true);
      setTimeout(() => setCopiedInstaPay(false), 2500);
    } else {
      setCopiedVodafone(true);
      setTimeout(() => setCopiedVodafone(false), 2500);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `السلام عليكم، أود تأكيد طلبي من منصة رَصين:\nرقم الطلب: ${orderReference}\nالأصول المطلوبة: ${purchasedItems.map((p) => p.title).join('، ')}\nالإجمالي: ${displayTotalPrice}\nرقم الهاتف/البريد: ${buyerContact || 'غير محدد'}`
  );

  return (
    <div className="fixed inset-0 z-[80] flex justify-start bg-black/80 backdrop-blur-md transition-opacity" dir="rtl" lang="ar">
      <div className="absolute inset-0" onClick={handleClose} aria-hidden="true" />

      <div className="relative w-full max-w-md h-full bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col animate-slide-in-right overflow-hidden font-cairo">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <span className="text-amber-400">🛒</span>
            <span>
              {step === 'cart' && 'سلة الأصول والشيتات'}
              {step === 'checkout' && 'خيارات استلام الطلب والتحويل'}
              {step === 'success' && 'تم تسجيل طلبك بنجاح!'}
            </span>
          </h2>
          <button
            onClick={handleClose}
            aria-label="إغلاق السلة"
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Notices */}
        {downloadNotice && (
          <div className="p-3 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in-up">
            <span>✓</span>
            <span>{downloadNotice}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {step === 'cart' && (
            items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl text-slate-500">
                  🛒
                </div>
                <div className="space-y-1">
                  <p className="text-white font-bold text-sm">سلة المشتريات فارغة حالياً</p>
                  <p className="text-slate-400 text-xs">تصفح الكتالوج واختر من بين أكثر من 54 شيت ونموذج معتمد</p>
                </div>
                <button
                  onClick={handleClose}
                  className="btn-gold !px-6 !py-2.5 text-xs font-bold"
                >
                  تصفح الأصول الرقمية
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-3"
                  >
                    <div className="relative w-16 h-14 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                      <Image
                        src={item.imageUrl || '/products/fallback-card.svg'}
                        alt={item.title}
                        fill
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/products/fallback-card.svg';
                        }}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-white truncate" title={item.title}>
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded">
                          {item.fileType}
                        </span>
                        <span className="text-xs font-black text-amber-400 font-mono">
                          {item.price === 0 ? 'مجاناً' : formatPrice(item.price, currency)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label={`حذف ${item.title} من السلة`}
                      className="p-2 text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10 cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )
          )}

          {isLoading ? (
            <div className="py-12">
              <RaseenLogoLoader
                label="جاري تجهيز مرجع طلبك وتوليد التراخيص..."
                sublabel="نظام رَصين التنفيذي يسجل كود الطلب ويعد التراخيص القانونية"
                size="md"
              />
            </div>
          ) : step === 'checkout' ? (
            <div className="space-y-4">
              
              {/* Direct Transparency Notice */}
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs leading-relaxed">
                <span className="font-bold block mb-1">⚡ آلية التحويل المباشر وتفعيل التحميل:</span>
                بعد تأكيد الطلب، يرجى إرسال التحويل عبر إنستاباي أو فودافون كاش ومشاركة صورة الإشعار عبر الواتساب لتفعيل روابط التحميل والشهادة الرقمية (الأصول المجانية تتفعل فوراً).
              </div>

              {/* Buyer Contact */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  رقم الواتساب أو البريد الإلكتروني لاستلام الملفات <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={buyerContact}
                  onChange={(e) => {
                    setBuyerContact(e.target.value);
                    if (contactError) setContactError(null);
                  }}
                  placeholder="مثال: 010XXXXXXXX أو name@domain.com"
                  className={`w-full bg-slate-900 border ${
                    contactError ? 'border-red-500 ring-1 ring-red-500/50' : 'border-slate-800'
                  } rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 min-h-[44px]`}
                  required
                />
                {contactError && (
                  <p className="text-red-400 text-[11px] mt-1.5 font-bold flex items-center gap-1">
                    <span>⚠</span>
                    <span>{contactError}</span>
                  </p>
                )}
              </div>

              {/* Payment & Order Options */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-white font-bold text-xs mb-2">اختر طريقة السداد المفضلة:</h3>

                {/* InstaPay */}
                <label
                  className={`flex flex-col gap-2 p-3 rounded-xl cursor-pointer border transition-all ${
                    paymentMethod === 'instapay'
                      ? 'border-amber-400 bg-amber-500/10'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="instapay"
                      checked={paymentMethod === 'instapay'}
                      onChange={() => setPaymentMethod('instapay')}
                      className="accent-[#f5b731] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-base">⚡</span>
                    <div className="flex-1">
                      <span className="text-white text-xs font-bold block">تحويل لحظي عبر إنستاباي (InstaPay)</span>
                      <span className="text-[11px] text-slate-400">تحويل فوري بدون رسوم من أي بنك مصري</span>
                    </div>
                  </div>
                  {paymentMethod === 'instapay' && (
                    <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between bg-slate-900/90 p-2.5 rounded-lg text-xs">
                      <span className="text-slate-300 font-mono text-[11px]">IPA: raseen@instapay</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('raseen@instapay', 'instapay')}
                        className="text-amber-400 text-[10px] font-bold px-2 py-1 rounded bg-slate-800 border border-slate-700 hover:border-amber-400 cursor-pointer"
                      >
                        {copiedInstaPay ? '✓ تم النسخ' : 'نسخ المعرف'}
                      </button>
                    </div>
                  )}
                </label>

                {/* Vodafone Cash */}
                <label
                  className={`flex flex-col gap-2 p-3 rounded-xl cursor-pointer border transition-all ${
                    paymentMethod === 'vodafone'
                      ? 'border-amber-400 bg-amber-500/10'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="vodafone"
                      checked={paymentMethod === 'vodafone'}
                      onChange={() => setPaymentMethod('vodafone')}
                      className="accent-[#f5b731] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-base">📱</span>
                    <div className="flex-1">
                      <span className="text-white text-xs font-bold block">فودافون كاش والمحافظ الذكية</span>
                      <span className="text-[11px] text-slate-400">تحويل فوري من أي محفظة إلكترونية بمصر</span>
                    </div>
                  </div>
                  {paymentMethod === 'vodafone' && (
                    <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between bg-slate-900/90 p-2.5 rounded-lg text-xs">
                      <span className="text-slate-300 font-mono text-[11px]">رقم المحفظة: 01026938995</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('01026938995', 'vodafone')}
                        className="text-amber-400 text-[10px] font-bold px-2 py-1 rounded bg-slate-800 border border-slate-700 hover:border-amber-400 cursor-pointer"
                      >
                        {copiedVodafone ? '✓ تم النسخ' : 'نسخ الرقم'}
                      </button>
                    </div>
                  )}
                </label>
              </div>
            </div>
          ) : step === 'success' ? (
            <div className="py-4 space-y-4">
              <div
                className={`p-4 border rounded-2xl text-center space-y-2 ${
                  orderStatus === 'completed'
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-amber-500/10 border-amber-500/30'
                }`}
              >
                <span className="text-3xl block">{orderStatus === 'completed' ? '🎉' : '⏳'}</span>
                <h3 className="text-base font-bold text-white">
                  {orderStatus === 'completed'
                    ? 'تم تفعيل طلبك وروابط التنزيل بنجاح!'
                    : 'تم تسجيل طلبك — بانتظار تأكيد التحويل'}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {orderStatus === 'completed'
                    ? 'ملفاتك جاهزة الآن للتحميل المباشر مع شهادة الترخيص الموثقة.'
                    : 'أرسل صورة إشعار التحويل عبر الواتساب بالأسفل لتفعيل روابط التحميل الفوري والترخيص الرسمي.'}
                </p>
                <div className="mt-2 inline-flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-amber-400">
                  <span>المرجع:</span>
                  <span>{orderReference}</span>
                </div>
              </div>

              {/* WhatsApp Confirmation */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2.5">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <span>💬</span>
                  <span>تأكيد التحويل واستلام التحديثات:</span>
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  أرسل إشعار التحويل عبر الواتساب لتفعيل روابط التحميل الكاملة والدعم الفني فوراً.
                </p>
                <a
                  href={`https://wa.me/201026938995?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold w-full text-xs font-bold py-2.5 flex items-center justify-center gap-2 !bg-emerald-600 hover:!bg-emerald-500 !text-white shadow-lg shadow-emerald-600/20"
                >
                  <span>إرسال إشعار الدفع عبر واتساب</span>
                  <span>📱</span>
                </a>
              </div>

              {/* Download Assets / Licenses */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300">الأصول والوثائق الرقمية:</h4>
                <div className="space-y-2">
                  {purchasedItems.map((pi) => (
                    <div
                      key={pi.id}
                      className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-white truncate max-w-[190px]">{pi.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {pi.fileType}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {orderStatus === 'completed' && orderTokens.some((t) => t.productId === pi.id) && (
                          <button
                            onClick={() => triggerAssetDownload(pi.title, pi.id)}
                            className="btn-gold flex-1 !px-3 !py-1.5 text-xs font-bold cursor-pointer"
                          >
                            تحميل الملف الأصلي 📥
                          </button>
                        )}
                        <button
                          onClick={() => triggerDownload(pi.title, pi.id)}
                          className="btn-outline flex-1 !px-3 !py-1.5 text-xs font-bold cursor-pointer"
                        >
                          {orderStatus === 'completed' ? 'شهادة الترخيص 🛡️' : 'إيصال حجز الطلب 📄'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    href="/dashboard"
                    onClick={handleClose}
                    className="btn-outline w-full text-center text-xs font-bold min-h-[44px] flex items-center justify-center border-slate-700 text-slate-300 hover:text-white hover:border-amber-400"
                  >
                    لوحة المشتري والتراخيص الموثقة
                  </Link>
                  <button
                    onClick={handleClose}
                    className="text-slate-400 hover:text-white text-xs transition-colors py-2 cursor-pointer"
                  >
                    متابعة التصفح
                  </button>
                </div>
              </div>
            </div>
          ) : null}

        </div>

        {/* Footer Actions */}
        {step !== 'success' && items.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-900 flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-300 font-bold">الإجمالي:</span>
              <span className="text-lg font-black text-amber-400 font-mono">{displayTotalPrice}</span>
            </div>

            {step === 'cart' ? (
              <button
                onClick={handleCheckout}
                className="btn-gold w-full text-xs font-bold py-3 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 cursor-pointer"
              >
                <span>متابعة إتمام الطلب والدفع</span>
                <span>←</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep('cart')}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-bold min-h-[44px] cursor-pointer"
                >
                  رجوع
                </button>
                <button
                  onClick={handleConfirmOrder}
                  className="btn-gold flex-1 text-xs font-bold py-3 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 cursor-pointer"
                >
                  <span>تأكيد الطلب وحفظ الملفات</span>
                  <span>✓</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
