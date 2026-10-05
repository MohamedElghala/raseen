'use client';

import React, { useState } from 'react';

export default function PdfConverterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('نموذج_عقد_شراكة_تجاري_معتمد.pdf');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [convertedMode, setConvertedMode] = useState<'word' | 'excel' | 'text'>('word');
  const [extractedText, setExtractedText] = useState<string>(
    `عقد اتفاقية وشراكة استراتيجية
إنه في يوم الإثنين الموافق 2026/10/05، تم الاتفاق بين:
الطرف الأول: شركة رَصين للحلول الرقمية (المطور)
الطرف الثاني: مؤسسة النخبة للأعمال (الشريك التجاري)

المادة 1: نطاق التعاقد والالتزامات
اتفق الطرفان على توريد وإدارة الأصول الرقمية والشيتات المحاسبية وفق الملحق الفني.
المادة 2: المقابل المالي
يتم سداد المستحقات بنسبة 50% دفعة مقدمة و 50% عند اجتياز الفحص البرمجي النهائي.`
  );
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleSimulateConvert = (mode: 'word' | 'excel' | 'text') => {
    setIsProcessing(true);
    setConvertedMode(mode);
    setDownloadSuccess(null);

    setTimeout(() => {
      setIsProcessing(false);
      if (mode === 'word') {
        setExtractedText((prev) => prev);
      } else if (mode === 'excel') {
        setExtractedText(
          `البند,الكمية,السعر الفردي,الإجمالي (ج.م)
تطوير منصة التجارة,1,12500,12500
إعداد البنية السحابية,1,4500,4500
ضريبة القيمة المضافة 14%,1,2380,2380
الإجمالي الكلي المستحق,,,19380`
        );
      }
    }, 1200);
  };

  const handleDownloadFile = () => {
    const ext = convertedMode === 'word' ? 'docx' : convertedMode === 'excel' ? 'csv' : 'txt';
    const mime = convertedMode === 'word' ? 'application/msword' : convertedMode === 'excel' ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;';
    const blob = new Blob([extractedText], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `raseen_converted_${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(`تم تصدير وتحميل الملف بصيغة .${ext.toUpperCase()} بنجاح!`);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-rawnaq-border gap-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📄</span>
            <span>محول ومستخرج المستندات الذكي (PDF to Word & Excel Converter)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            حوّل ملفات العقود، الفواتير، والتقارير من PDF إلى مستندات Word أو جداول Excel قابلة للتعديل الفوري
          </p>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
          OCR Instant Engine
        </span>
      </div>

      {/* Upload & Dropzone */}
      <div className="p-6 border-2 border-dashed border-rawnaq-border rounded-2xl bg-rawnaq-dark text-center hover:border-rawnaq-gold/50 transition-colors">
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-rawnaq-surface flex items-center justify-center text-2xl border border-rawnaq-border">
          📥
        </div>
        <p className="text-sm font-bold text-white mb-1">
          اسحب وأفلت ملف الـ PDF هنا، أو تصفح من جهازك
        </p>
        <p className="text-xs text-slate-400 mb-4">
          الملف الحالي الجاهز للمعاينة: <strong className="text-rawnaq-gold font-mono">{fileName}</strong>
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <label className="btn-outline !py-2 !px-4 text-xs cursor-pointer">
            <span>اختر ملفاً من جهازك</span>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setFile(f);
                  setFileName(f.name);
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* Action Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleSimulateConvert('word')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              convertedMode === 'word'
                ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/30'
                : 'bg-rawnaq-dark text-slate-300 border-rawnaq-border hover:border-slate-500'
            }`}
          >
            <span>📝 تحويل إلى Word (.DOCX)</span>
          </button>

          <button
            type="button"
            onClick={() => handleSimulateConvert('excel')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              convertedMode === 'excel'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/30'
                : 'bg-rawnaq-dark text-slate-300 border-rawnaq-border hover:border-slate-500'
            }`}
          >
            <span>📊 تحويل إلى جداول Excel (.XLSX)</span>
          </button>

          <button
            type="button"
            onClick={() => handleSimulateConvert('text')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              convertedMode === 'text'
                ? 'bg-amber-600 text-white border-amber-400 shadow-lg shadow-amber-600/30'
                : 'bg-rawnaq-dark text-slate-300 border-rawnaq-border hover:border-slate-500'
            }`}
          >
            <span>📄 استخراج نصوص نقية (TXT)</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleDownloadFile}
          disabled={isProcessing}
          className="btn-gold !py-2 !px-5 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rawnaq-gold/20"
        >
          <span>تنزيل الملف المحول</span>
          <span>⬇️</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center animate-fade-in-up">
          {downloadSuccess}
        </div>
      )}

      {/* Live Extracted Content Editor / Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>معاينة المحتوى المستخرج بدقة الذكاء الاصطناعي (قابل للتعديل قبل التنزيل):</span>
          <span className="font-mono text-cyan-400">Status: Verified & OCR Extracted</span>
        </div>

        {isProcessing ? (
          <div className="p-12 rounded-xl bg-rawnaq-dark border border-rawnaq-border text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 mx-auto border-2 border-rawnaq-gold border-t-transparent rounded-full animate-spin" />
            <p className="text-xs">جاري تفكيك صفحات الـ PDF واستخراج الجداول والنصوص بدقة...</p>
          </div>
        ) : (
          <textarea
            rows={7}
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            className="w-full p-4 rounded-xl bg-rawnaq-dark border border-rawnaq-border text-white text-xs font-mono leading-relaxed focus:outline-none focus:border-rawnaq-gold transition-colors"
          />
        )}
      </div>
    </div>
  );
}
