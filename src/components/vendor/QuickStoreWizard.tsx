'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface QuickStoreWizardProps {
  onFinish?: (storeData: any) => void;
}

export default function QuickStoreWizard({ onFinish }: QuickStoreWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [copied, setCopied] = useState(false);

  // Form State
  const [storeName, setStoreName] = useState('');
  const [storeSlug, setStoreSlug] = useState('');
  const [storeCategory, setStoreCategory] = useState('شيتات إكسل ومحاسبة');
  const [storeBio, setStoreBio] = useState('');

  // Asset State
  const [assetTitle, setAssetTitle] = useState('');
  const [assetType, setAssetType] = useState('excel');
  const [assetPrice, setAssetPrice] = useState('150');
  const [currency, setCurrency] = useState<'EGP' | 'SAR'>('EGP');
  const [instapayHandle, setInstapayHandle] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) return;
    if (!storeSlug.trim()) {
      setStoreSlug(storeName.trim().toLowerCase().replace(/\s+/g, '-'));
    }
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetTitle.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep(3);
      if (onFinish) {
        onFinish({
          storeName,
          storeSlug: storeSlug || 'my-store',
          storeCategory,
          storeBio,
          assetTitle,
          assetType,
          assetPrice,
          currency,
          instapayHandle,
        });
      }
    }, 1500);
  };

  const storeUrl = `https://raseen.me/@${storeSlug || 'store'}`;

  const copyStoreLink = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-rawnaq-navy border border-rawnaq-border rounded-3xl p-6 sm:p-10 shadow-2xl font-cairo text-right relative overflow-hidden" dir="rtl">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-rawnaq-gold/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rawnaq-gold/10 border border-rawnaq-gold/30 text-rawnaq-gold text-xs font-bold mb-3">
          <span>⚡ معالج إطلاق المتاجر السريع في 5 دقائق</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
          ابدأ ببيع أصولك الرقمية اليوم واكسب 85% من أرباحك
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
          حوّل ملفات الإكسل، العقود، التصاميم، والمخططات المعمارية إلى متجر مستقل مع روابط دفع فورية تدعم إنستاباي والمحافظ الإلكترونية.
        </p>

        {/* Progress Tracker */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mt-6">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${step >= 1 ? 'bg-rawnaq-gold text-slate-950 shadow-md' : 'bg-rawnaq-surface text-slate-400'}`}>
            <span>1</span>
            <span>هوية المتجر</span>
          </div>
          <span className="text-slate-600">←</span>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${step >= 2 ? 'bg-rawnaq-gold text-slate-950 shadow-md' : 'bg-rawnaq-surface text-slate-400'}`}>
            <span>2</span>
            <span>رفع أول أصل وتسعيره</span>
          </div>
          <span className="text-slate-600">←</span>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${step === 3 ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-rawnaq-surface text-slate-400'}`}>
            <span>3</span>
            <span>المتجر جاهز للبيع! 🎉</span>
          </div>
        </div>
      </div>

      {/* STEP 1: Store Profile */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-bold text-slate-200 mb-2">
              اسم المتجر أو علامتك التجارية <span className="text-rawnaq-gold">*</span>
            </label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => {
                setStoreName(e.target.value);
                setStoreSlug(e.target.value.trim().toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]/g, '-'));
              }}
              placeholder="مثال: ستوديو أصول المحاسبة، أو المهندس أحمد للتصميم"
              className="w-full h-12 px-4 rounded-xl bg-rawnaq-surface border border-rawnaq-border text-white placeholder-slate-500 focus:outline-none focus:border-rawnaq-gold text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                الرابط المخصص المباشر لمتجرك
              </label>
              <div className="flex items-center h-12 px-3 rounded-xl bg-rawnaq-surface border border-rawnaq-border text-xs text-slate-400" dir="ltr">
                <span className="text-rawnaq-gold font-mono font-bold">raseen.me/@</span>
                <input
                  type="text"
                  value={storeSlug}
                  onChange={(e) => setStoreSlug(e.target.value)}
                  placeholder="your-store"
                  className="bg-transparent border-none text-white focus:outline-none w-full font-mono text-xs pl-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                التخصص الرئيسي للأصول
              </label>
              <select
                value={storeCategory}
                onChange={(e) => setStoreCategory(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-rawnaq-surface border border-rawnaq-border text-white text-sm focus:outline-none focus:border-rawnaq-gold"
              >
                <option value="شيتات إكسل ومحاسبة">📊 شيتات إكسل ومحاسبة وماليات</option>
                <option value="عقود قانونية وإدارية">⚖️ صياغة عقود وقوالب قانونية</option>
                <option value="تصاميم وقوالب كانفا">🎨 تصاميم وسوشيال ميديا وقوالب Canva</option>
                <option value="مخططات معمارية وكاد">📐 مكتبات CAD و Revit وهندسة</option>
                <option value="سير ذاتية ومستندات ATS">📄 سير ذاتية ATS وتطوير مهني</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-200 mb-2">
              نبذة مختصرة لتعريف الزوار بمتجرك (Bio)
            </label>
            <textarea
              rows={2}
              value={storeBio}
              onChange={(e) => setStoreBio(e.target.value)}
              placeholder="نقدم نماذج عملية ومجربة تسهم في تسريع أعمال الشركات وأصحاب الأعمال الناشئة..."
              className="w-full p-3 rounded-xl bg-rawnaq-surface border border-rawnaq-border text-white placeholder-slate-500 focus:outline-none focus:border-rawnaq-gold text-xs leading-relaxed"
            />
          </div>

          <div className="pt-4 flex items-center justify-end">
            <button
              type="submit"
              className="btn-gold !px-8 text-sm font-bold flex items-center gap-2"
            >
              <span>متابعة لرفع أول أصل</span>
              <span>←</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: First Product */}
      {step === 2 && (
        <form onSubmit={handleStep2Submit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-bold text-slate-200 mb-2">
              عنوان المنتج أو الأصل الأول <span className="text-rawnaq-gold">*</span>
            </label>
            <input
              type="text"
              required
              value={assetTitle}
              onChange={(e) => setAssetTitle(e.target.value)}
              placeholder="مثال: شيت ميزان المراجعة والقوائم المالية المؤتمت 2026"
              className="w-full h-12 px-4 rounded-xl bg-rawnaq-surface border border-rawnaq-border text-white placeholder-slate-500 focus:outline-none focus:border-rawnaq-gold text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                صيغة الملف
              </label>
              <select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                className="w-full h-12 px-3 rounded-xl bg-rawnaq-surface border border-rawnaq-border text-white text-xs focus:outline-none focus:border-rawnaq-gold"
              >
                <option value="excel">ملف Excel (.xlsx)</option>
                <option value="word-pdf">عقد أو مستند (DOCX / PDF)</option>
                <option value="canva">قالب Canva تفاعلي</option>
                <option value="cad-revit">مخطط AutoCAD / Revit</option>
                <option value="powerpoint">عرض تقديمي PowerPoint</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                سعر البيع
              </label>
              <div className="flex items-center h-12 rounded-xl bg-rawnaq-surface border border-rawnaq-border overflow-hidden">
                <input
                  type="number"
                  min="50"
                  required
                  value={assetPrice}
                  onChange={(e) => setAssetPrice(e.target.value)}
                  className="w-full h-full px-3 bg-transparent text-white font-bold text-sm focus:outline-none text-center"
                />
                <select
                  value={currency}
                  onChange={(e: any) => setCurrency(e.target.value)}
                  className="bg-rawnaq-dark text-rawnaq-gold text-xs px-2 h-full border-r border-rawnaq-border font-bold focus:outline-none"
                >
                  <option value="EGP">ج.م (مصر)</option>
                  <option value="SAR">ر.س (السعودية)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                معرف إنستاباي / محفظة فودافون كاش
              </label>
              <input
                type="text"
                value={instapayHandle}
                onChange={(e) => setInstapayHandle(e.target.value)}
                placeholder="username@instapay أو رقم الهاتف"
                className="w-full h-12 px-3 rounded-xl bg-rawnaq-surface border border-rawnaq-border text-white placeholder-slate-500 text-xs focus:outline-none focus:border-rawnaq-gold font-mono"
              />
            </div>
          </div>

          {/* Drag & Drop Simulation */}
          <div className="border-2 border-dashed border-rawnaq-border hover:border-rawnaq-gold/50 rounded-2xl p-6 text-center bg-rawnaq-surface/40 transition-colors cursor-pointer">
            <span className="text-3xl block mb-2">📂</span>
            <span className="text-xs font-bold text-slate-200 block mb-1">
              اسحب وأفلت الملف هنا أو انقر للتصفح (حتى 100 ميجابايت)
            </span>
            <span className="text-[11px] text-slate-500 block">
              سيتم تشفير وتوليد روابط تنزيل مؤقتة تلقائياً لكل مشترٍ بعد التحقق من الدفع.
            </span>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-slate-400 hover:text-white px-4 py-2"
            >
              ← العودة لتعديل الهوية
            </button>

            <button
              type="submit"
              disabled={isGenerating}
              className="btn-gold !px-8 text-sm font-bold flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin">⚙️</span>
                  <span>جاري إنشاء صفحة المتجر وروابط الدفع...</span>
                </>
              ) : (
                <>
                  <span>إطلاق المتجر الفوري</span>
                  <span>🚀</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Store Launched Successfully */}
      {step === 3 && (
        <div className="space-y-6 relative z-10 text-center">
          
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center text-3xl mx-auto animate-bounce">
            ✓
          </div>

          <h3 className="text-2xl font-black text-white">
            مبروك! تم إطلاق متجرك الرقمي بنجاح 🎊
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto">
            متجرك جاهز الآن لاستقبال المشترين، توليد الفواتير التلقائية، وإرسال روابط التنزيل المشفرة فور إتمام الدفع.
          </p>

          {/* Store Box Card */}
          <div className="bg-rawnaq-surface border border-rawnaq-gold/40 rounded-2xl p-6 text-right max-w-xl mx-auto shadow-xl">
            <div className="flex items-center justify-between border-b border-rawnaq-border pb-4 mb-4">
              <div>
                <span className="text-xs text-rawnaq-gold font-bold block mb-1">{storeCategory}</span>
                <h4 className="text-lg font-black text-white">{storeName || 'متجري الرقمي'}</h4>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                متصل وجاهز للبيع 🟢
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-300 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-400">المنتج الأول المعروض:</span>
                <span className="font-bold text-white">{assetTitle || 'الأصل الرقمي المختار'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">سعر البيع:</span>
                <span className="font-black text-rawnaq-gold text-sm">{assetPrice} {currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">طرق الدفع المفعلة:</span>
                <span className="text-slate-200 font-bold">إنستاباي • فودافون كاش • مدى • فيزا</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">صافي عائدك (85%):</span>
                <span className="text-emerald-400 font-bold">{(Number(assetPrice) * 0.85).toFixed(1)} {currency}</span>
              </div>
            </div>

            {/* Store URL & Share */}
            <div className="p-3 bg-rawnaq-dark rounded-xl border border-rawnaq-border flex items-center justify-between gap-2" dir="ltr">
              <span className="text-xs font-mono text-rawnaq-gold truncate">{storeUrl}</span>
              <button
                type="button"
                onClick={copyStoreLink}
                className="px-4 py-1.5 bg-rawnaq-surface hover:bg-rawnaq-gold hover:text-slate-950 text-white rounded-lg text-xs font-bold transition-colors shrink-0"
              >
                {copied ? 'تم النسخ! ✓' : 'نسخ الرابط 📋'}
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setStep(1);
                setStoreName('');
                setAssetTitle('');
              }}
              className="btn-outline text-xs px-5 py-2.5"
            >
              + إنشاء متجر آخر أو إضافة منتج جديد
            </button>

            <Link
              href="/vendor"
              className="btn-gold text-xs px-6 py-2.5 font-bold"
            >
              الانتقال للوحة تحكم البائع والأرباح ➔
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}
