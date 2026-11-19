'use client';

import React, { useState, useEffect } from 'react';

interface ToolLeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
  onProceed: () => void;
}

export default function ToolLeadCaptureModal({
  isOpen,
  onClose,
  toolName,
  onProceed,
}: ToolLeadCaptureModalProps) {
  const [name, setName] = useState('');
  const [channel, setChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [contactValue, setContactValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setContactValue('');
      setIsSubmitting(false);
      setErrorMessage(null);
      setCopiedCoupon(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedContact = contactValue.trim();

    if (!trimmedContact) {
      setErrorMessage(
        channel === 'whatsapp'
          ? 'يرجى إدخال رقم الواتساب لحفظ المستند.'
          : 'يرجى إدخال البريد الإلكتروني لحفظ المستند.'
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        name: name.trim() || undefined,
        phone: channel === 'whatsapp' ? trimmedContact : undefined,
        email: channel === 'email' ? trimmedContact : undefined,
        channel,
        interest: `أداة مجانية: ${toolName}`,
        metadata: {
          toolName,
          source: 'free_tool_lead_capture',
          discountCode: 'RASEEN25',
          timestamp: new Date().toISOString(),
        },
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'تعذر إرسال البيانات.');
      }

      // Proceed with user's action
      onProceed();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ غير متوقع.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onProceed();
    onClose();
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('RASEEN25');
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      dir="rtl"
      lang="ar"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-md bg-raseen-navy border border-raseen-gold/30 rounded-2xl shadow-2xl p-6 overflow-hidden z-10 text-white animate-scale-up">
        {/* Glow decoration */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-raseen-gold/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-raseen-gold/15 text-raseen-gold border border-raseen-gold/30 text-xs font-bold mb-2">
              <span>🎁</span>
              <span>كود خصم 25% فوري: RASEEN25</span>
            </div>
            <h3 className="text-lg font-black text-white">
              احفظ نسختك من {toolName}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg text-sm transition-colors"
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>

        <p className="text-slate-300 text-xs leading-relaxed mb-4">
          أدخل وسيلة التواصل لاستلام نسخة سحابية من الملف واستخدام كود الخصم <strong className="text-raseen-gold">RASEEN25</strong> على كافة شيتات وعقود المنصة التنفيذية.
        </p>

        {/* Promo code badge with copy */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-raseen-dark border border-raseen-border mb-4 text-xs font-mono">
          <span className="text-slate-400 font-sans">كوبون الترقية:</span>
          <div className="flex items-center gap-2">
            <span className="text-raseen-gold font-bold tracking-wider">RASEEN25</span>
            <button
              type="button"
              onClick={handleCopyCoupon}
              className="px-2 py-0.5 rounded bg-raseen-navy hover:bg-raseen-accent border border-raseen-border text-[10px] text-slate-300 transition-colors"
            >
              {copiedCoupon ? '✓ تم النسخ' : 'نسخ'}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-2.5 mb-4 bg-red-500/15 border border-red-500/30 text-red-300 text-xs rounded-xl">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">الاسم الكامل (اختياري)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: م. محمد الأحمد"
              className="w-full px-3 py-2 bg-raseen-dark border border-raseen-border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-raseen-gold transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300">طريقة الاستلام</label>
              <div className="flex items-center gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setChannel('whatsapp')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    channel === 'whatsapp'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  واتساب
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('email')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    channel === 'email'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  إيميل
                </button>
              </div>
            </div>

            <input
              type={channel === 'email' ? 'email' : 'tel'}
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              placeholder={
                channel === 'whatsapp'
                  ? 'رقم الواتساب (مثال: 01012345678 أو +966501234567)'
                  : 'بريدك الإلكتروني (name@example.com)'
              }
              required
              className="w-full px-3 py-2 bg-raseen-dark border border-raseen-border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-raseen-gold transition-colors font-mono"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-gold py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-raseen-gold/15 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <span>حفظ واستلام الكود</span>
                  <span>✓</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              className="px-3 py-2.5 rounded-xl border border-raseen-border text-slate-400 hover:text-white text-xs font-semibold transition-colors"
            >
              تخطي ومتابعة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
