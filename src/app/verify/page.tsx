'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface VerifiedLicenseInfo {
  licenseId: string;
  assetId: string;
  assetTitle: string;
  buyerIdentifier: string;
  issuedAt: string;
  licenseType: string;
  verificationHash: string;
  orderId?: string;
}

export default function VerifyLicensePage() {
  const [tokenInput, setTokenInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    valid: boolean;
    error?: string;
    license?: VerifiedLicenseInfo;
    verifiedAt?: string;
  } | null>(null);

  const verifyToken = async (tokenValue: string) => {
    const trimmed = tokenValue.trim();
    if (!trimmed) {
      setResult({ valid: false, error: 'يرجى لصق رمز التوثيق المرفق مع وثيقة الترخيص.' });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: trimmed }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ valid: false, error: 'تعذر الاتصال بخادم التحقق، يرجى المحاولة مجدداً.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      if (token) {
        setTokenInput(token);
        verifyToken(token);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyToken(tokenInput);
  };

  return (
    <main className="min-h-screen bg-raseen-dark text-white font-cairo py-14 px-4" dir="rtl" lang="ar">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
            <span>🛡️</span>
            <span>RASEEN LICENSE VERIFICATION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            التحقق الرقمي من تراخيص رَصين
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
            تأكد من صحة وأصالة أي رخصة استخدام صادرة عن منصة رَصين عبر التحقق التشفيري (HMAC-SHA256).
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl"
        >
          <label className="block text-xs font-bold text-slate-300">
            رمز التوثيق الرقمي (Verification Token):
          </label>
          <textarea
            rows={3}
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="الصق رمز التوثيق الموجود داخل ملف الترخيص..."
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
            dir="ltr"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="btn-gold w-full py-3 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isLoading ? 'جاري التحقق المشفر...' : 'فحص صحة الترخيص الآن 🔍'}</span>
          </button>
        </form>

        {result && (
          <div
            className={`rounded-2xl p-6 border ${
              result.valid
                ? 'bg-emerald-950/30 border-emerald-500/40'
                : 'bg-red-950/30 border-red-500/40'
            }`}
          >
            {result.valid && result.license ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xl">
                    ✓
                  </span>
                  <div>
                    <h2 className="text-lg font-black text-emerald-300">ترخيص سليم وموثق رقمياً</h2>
                    <p className="text-xs text-slate-400">توقيع رقمي صالح صادر عن منصة رَصين</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 block">رقم الترخيص:</span>
                    <span className="font-mono font-bold text-amber-300">{result.license.licenseId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">نوع الترخيص:</span>
                    <span className="font-bold text-white">{result.license.licenseType}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block">اسم الأصل الرقمي:</span>
                    <span className="font-bold text-white">{result.license.assetTitle}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">المرخص له:</span>
                    <span className="font-bold text-white">{result.license.buyerIdentifier}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">تاريخ الإصدار:</span>
                    <span className="font-mono text-slate-300" dir="ltr">
                      {new Date(result.license.issuedAt).toISOString().split('T')[0]}
                    </span>
                  </div>
                  {result.license.orderId && (
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block">المرجع:</span>
                      <span className="font-mono text-slate-300">{result.license.orderId}</span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/product/${result.license.assetId}`}
                  className="inline-flex items-center gap-2 text-xs text-amber-300 hover:text-amber-200 font-bold"
                >
                  <span>عرض صفحة الأصل في المتجر ←</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <span className="text-2xl text-red-400">✖</span>
                <div>
                  <h2 className="text-base font-bold text-red-300">تعذر التحقق من الترخيص</h2>
                  <p className="text-xs text-slate-300 mt-1">
                    {result.error || 'رمز التحقق غير صحيح أو تم التلاعب بمحتواه.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-white underline">
            العودة إلى الرئيسية
          </Link>
        </div>
      </div>
    </main>
  );
}
