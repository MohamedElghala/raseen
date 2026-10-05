'use client';

import React, { useState } from 'react';

type FormulaType = 'xlookup' | 'sumifs' | 'pmt' | 'iferror' | 'textjoin';

export default function ExcelFormulaAssistant() {
  const [formulaType, setFormulaType] = useState<FormulaType>('xlookup');
  const [copied, setCopied] = useState(false);

  // Inputs for XLOOKUP
  const [lookupVal, setLookupVal] = useState('A2');
  const [lookupArray, setLookupArray] = useState('Employees!A:A');
  const [returnArray, setReturnArray] = useState('Employees!D:D');
  const [ifNotFound, setIfNotFound] = useState('غير موجود');

  // Inputs for SUMIFS
  const [sumRange, setSumRange] = useState('Sales!F:F');
  const [criteriaRange, setCriteriaRange] = useState('Sales!B:B');
  const [criteriaVal, setCriteriaVal] = useState('"القاهرة"');

  // Inputs for PMT (Loan Calculator)
  const [rate, setRate] = useState('18%');
  const [periods, setPeriods] = useState('36');
  const [loanAmount, setLoanAmount] = useState('200000');

  // Generate formula string
  const getGeneratedFormula = () => {
    switch (formulaType) {
      case 'xlookup':
        return `=XLOOKUP(${lookupVal}, ${lookupArray}, ${returnArray}, "${ifNotFound}", 0)`;
      case 'sumifs':
        return `=SUMIFS(${sumRange}, ${criteriaRange}, ${criteriaVal})`;
      case 'pmt':
        return `=PMT(${rate}/12, ${periods}, -${loanAmount})`;
      case 'iferror':
        return `=IFERROR(VLOOKUP(${lookupVal}, ${lookupArray}, 2, FALSE), "— لا توجد بيانات —")`;
      case 'textjoin':
        return `=TEXTJOIN(" - ", TRUE, A2:D2)`;
      default:
        return '';
    }
  };

  const formula = getGeneratedFormula();

  const handleCopy = () => {
    navigator.clipboard.writeText(formula);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex items-center justify-between pb-3 border-b border-rawnaq-border">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📗</span>
            <span>مولد ومساعد معادلات الإكسيل الذكي (Excel Formula Generator)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            اختر نوع العملية المحاسبية وسنقوم بتركيب المعادلة البرمجية الصحيحة لنسخها في ملفك مباشرة
          </p>
        </div>
      </div>

      {/* Selector Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFormulaType('xlookup')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            formulaType === 'xlookup'
              ? 'bg-emerald-500 text-slate-950 border-emerald-400'
              : 'bg-rawnaq-dark text-slate-300 border-rawnaq-border hover:border-slate-500'
          }`}
        >
          🔍 البحث المتقدم (=XLOOKUP)
        </button>
        <button
          type="button"
          onClick={() => setFormulaType('sumifs')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            formulaType === 'sumifs'
              ? 'bg-emerald-500 text-slate-950 border-emerald-400'
              : 'bg-rawnaq-dark text-slate-300 border-rawnaq-border hover:border-slate-500'
          }`}
        >
          ➕ الجمع الشرطي (=SUMIFS)
        </button>
        <button
          type="button"
          onClick={() => setFormulaType('pmt')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            formulaType === 'pmt'
              ? 'bg-emerald-500 text-slate-950 border-emerald-400'
              : 'bg-rawnaq-dark text-slate-300 border-rawnaq-border hover:border-slate-500'
          }`}
        >
          💳 أقساط القروض (=PMT)
        </button>
        <button
          type="button"
          onClick={() => setFormulaType('iferror')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            formulaType === 'iferror'
              ? 'bg-emerald-500 text-slate-950 border-emerald-400'
              : 'bg-rawnaq-dark text-slate-300 border-rawnaq-border hover:border-slate-500'
          }`}
        >
          🛡️ معالجة الأخطاء (=IFERROR)
        </button>
        <button
          type="button"
          onClick={() => setFormulaType('textjoin')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            formulaType === 'textjoin'
              ? 'bg-emerald-500 text-slate-950 border-emerald-400'
              : 'bg-rawnaq-dark text-slate-300 border-rawnaq-border hover:border-slate-500'
          }`}
        >
          🔗 دمج النصوص (=TEXTJOIN)
        </button>
      </div>

      {/* Dynamic Fields */}
      <div className="p-4 rounded-xl bg-rawnaq-dark border border-rawnaq-border space-y-4">
        {formulaType === 'xlookup' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">قيمة أو خلية البحث (Lookup Value)</label>
              <input
                type="text"
                value={lookupVal}
                onChange={(e) => setLookupVal(e.target.value)}
                className="w-full bg-rawnaq-navy border border-rawnaq-border rounded-lg p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">عمود البحث (Lookup Array)</label>
              <input
                type="text"
                value={lookupArray}
                onChange={(e) => setLookupArray(e.target.value)}
                className="w-full bg-rawnaq-navy border border-rawnaq-border rounded-lg p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">عمود النتيجة المسترجعة (Return Array)</label>
              <input
                type="text"
                value={returnArray}
                onChange={(e) => setReturnArray(e.target.value)}
                className="w-full bg-rawnaq-navy border border-rawnaq-border rounded-lg p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">نص إذا لم يتم العثور على نتيجة</label>
              <input
                type="text"
                value={ifNotFound}
                onChange={(e) => setIfNotFound(e.target.value)}
                className="w-full bg-rawnaq-navy border border-rawnaq-border rounded-lg p-2 text-white"
              />
            </div>
          </div>
        )}

        {formulaType === 'sumifs' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">عمود الأرقام للجمع (Sum Range)</label>
              <input
                type="text"
                value={sumRange}
                onChange={(e) => setSumRange(e.target.value)}
                className="w-full bg-rawnaq-navy border border-rawnaq-border rounded-lg p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">عمود الشرط (Criteria Range)</label>
              <input
                type="text"
                value={criteriaRange}
                onChange={(e) => setCriteriaRange(e.target.value)}
                className="w-full bg-rawnaq-navy border border-rawnaq-border rounded-lg p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">قيمة الشرط المطلوب مطابقتها</label>
              <input
                type="text"
                value={criteriaVal}
                onChange={(e) => setCriteriaVal(e.target.value)}
                className="w-full bg-rawnaq-navy border border-rawnaq-border rounded-lg p-2 text-white font-mono"
              />
            </div>
          </div>
        )}

        {formulaType === 'pmt' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">الفائدة السنوية (Annual Rate)</label>
              <input
                type="text"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full bg-rawnaq-navy border border-rawnaq-border rounded-lg p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">عدد الأشهر (Months)</label>
              <input
                type="text"
                value={periods}
                onChange={(e) => setPeriods(e.target.value)}
                className="w-full bg-rawnaq-navy border border-rawnaq-border rounded-lg p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">قيمة القرض أو التمويل</label>
              <input
                type="text"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full bg-rawnaq-navy border border-rawnaq-border rounded-lg p-2 text-white font-mono"
              />
            </div>
          </div>
        )}

        {(formulaType === 'iferror' || formulaType === 'textjoin') && (
          <div className="text-xs text-slate-300">
            {formulaType === 'iferror'
              ? 'تغليف دالة البحث أو العمليات الحسابية داخل دالة IFERROR يحميك من ظهور أخطاء #N/A أو #DIV/0! المزعجة في جداولك.'
              : 'دالة TEXTJOIN تقوم بدمج عدة خلايا في سطر واحد مع فاصل محدد، مع تجاهل الخلايا الفارغة تلقائياً.'}
          </div>
        )}
      </div>

      {/* Generated Formula Display */}
      <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-emerald-400 font-bold">المعادلة الناتجة الجاهزة للصق في Excel:</span>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5"
          >
            <span>{copied ? '✓ تم النسخ للحافظة!' : 'نسخ المعادلة 📋'}</span>
          </button>
        </div>
        <div className="p-3 rounded-lg bg-rawnaq-dark text-white font-mono text-sm overflow-x-auto border border-rawnaq-border/80 text-left" dir="ltr">
          {formula}
        </div>
      </div>
    </div>
  );
}
