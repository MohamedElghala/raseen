'use client';

import React, { useState } from 'react';

const COUNTRIES = [
  { name: 'السعودية', rate: 15 },
  { name: 'مصر', rate: 14 },
  { name: 'الإمارات', rate: 5 },
];

export default function VatCalculator() {
  const [rate, setRate] = useState(15);
  const [amount, setAmount] = useState<number | ''>('');
  const [isInclusive, setIsInclusive] = useState(false);

  const calculate = () => {
    const val = Number(amount);
    if (!amount || isNaN(val) || val < 0) {
      return { base: 0, tax: 0, total: 0 };
    }

    if (isInclusive) {
      const base = val / (1 + rate / 100);
      const tax = val - base;
      return { base, tax, total: val };
    } else {
      const tax = val * (rate / 100);
      const total = val + tax;
      return { base: val, tax, total };
    }
  };

  const results = calculate();
  const hasError = amount !== '' && (isNaN(Number(amount)) || Number(amount) < 0);

  return (
    <div className="bg-[#0b1329] text-white p-6 rounded-xl shadow-lg border border-[#f5b731]/20 font-[Cairo] rtl max-w-md mx-auto" dir="rtl" lang="ar">
      <h2 className="text-2xl font-bold mb-6 text-[#f5b731] flex items-center gap-2">
        <span>📊</span> حاسبة ضريبة القيمة المضافة
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm mb-2 text-gray-300">الدولة / نسبة الضريبة</label>
          <div className="flex gap-2">
            {COUNTRIES.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setRate(c.rate)}
                className={`flex-1 min-h-[44px] rounded border transition-colors ${
                  rate === c.rate 
                    ? 'bg-[#f5b731] text-[#0b1329] border-[#f5b731] font-bold' 
                    : 'bg-transparent border-gray-600 text-gray-300 hover:border-[#f5b731]/50'
                }`}
              >
                {c.name} ({c.rate}%)
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-300">طريقة الحساب</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="calcType"
                aria-label="المبلغ بدون ضريبة"
                checked={!isInclusive}
                onChange={() => setIsInclusive(false)}
                className="w-5 h-5 accent-[#f5b731]"
              />
              <span>المبلغ بدون ضريبة</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="calcType"
                aria-label="المبلغ شامل الضريبة"
                checked={isInclusive}
                onChange={() => setIsInclusive(true)}
                className="w-5 h-5 accent-[#f5b731]"
              />
              <span>المبلغ شامل الضريبة</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-300">المبلغ</label>
          <input
            type="number"
            aria-label="المبلغ"
            min="0"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
            className={`w-full min-h-[44px] bg-[#0b1329] border rounded px-4 py-2 outline-none text-xl font-bold focus:border-[#f5b731] transition-colors ${
              hasError ? 'border-red-500' : 'border-gray-600'
            }`}
            placeholder="0.00"
          />
          {hasError && <p className="text-red-400 mt-2 text-sm">يرجى إدخال مبلغ صحيح أكبر من أو يساوي صفر.</p>}
        </div>

        <div className="bg-[#f5b731]/5 border-2 border-[#f5b731]/30 rounded-lg p-5 space-y-4">
          <div className="flex justify-between items-center text-gray-300">
            <span>المبلغ بدون ضريبة:</span>
            <span className="font-bold text-lg">{results.base.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-gray-300 border-b border-gray-700/50 pb-4">
            <span>قيمة الضريبة ({rate}%):</span>
            <span className="font-bold text-lg text-[#f5b731]">{results.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">المبلغ الإجمالي:</span>
            <span className="font-bold text-2xl text-[#f5b731]">{results.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
