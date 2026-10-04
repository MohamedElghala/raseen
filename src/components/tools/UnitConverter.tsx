'use client';

import React, { useState } from 'react';

type UnitCategory = 'length' | 'area' | 'pressure' | 'force';

const CATEGORIES: { id: UnitCategory; label: string }[] = [
  { id: 'length', label: 'الأطوال' },
  { id: 'area', label: 'المساحات' },
  { id: 'pressure', label: 'الضغط' },
  { id: 'force', label: 'القوة' }
];

const UNITS: Record<UnitCategory, { id: string; label: string; factor: number }[]> = {
  length: [
    { id: 'm', label: 'متر', factor: 1 },
    { id: 'cm', label: 'سنتيمتر', factor: 0.01 },
    { id: 'mm', label: 'مليمتر', factor: 0.001 },
    { id: 'km', label: 'كيلومتر', factor: 1000 },
    { id: 'in', label: 'بوصة', factor: 0.0254 },
    { id: 'ft', label: 'قدم', factor: 0.3048 },
    { id: 'yd', label: 'ياردة', factor: 0.9144 }
  ],
  area: [
    { id: 'm2', label: 'متر²', factor: 1 },
    { id: 'km2', label: 'كم²', factor: 1e6 },
    { id: 'feddan', label: 'فدان', factor: 4200.83 },
    { id: 'qirat', label: 'قيراط', factor: 175.03 },
    { id: 'sahm', label: 'سهم', factor: 7.29 },
    { id: 'ft2', label: 'قدم²', factor: 0.092903 },
    { id: 'acre', label: 'إيكر', factor: 4046.86 }
  ],
  pressure: [
    { id: 'pa', label: 'باسكال', factor: 1 },
    { id: 'kpa', label: 'كيلوباسكال', factor: 1000 },
    { id: 'mpa', label: 'ميجاباسكال', factor: 1e6 },
    { id: 'bar', label: 'بار', factor: 1e5 },
    { id: 'psi', label: 'psi', factor: 6894.76 },
    { id: 'atm', label: 'atm', factor: 101325 }
  ],
  force: [
    { id: 'n', label: 'نيوتن', factor: 1 },
    { id: 'kn', label: 'كيلونيوتن', factor: 1000 },
    { id: 'kgf', label: 'كجم قوة', factor: 9.80665 },
    { id: 'tf', label: 'طن قوة', factor: 9806.65 },
    { id: 'lbf', label: 'رطل قوة', factor: 4.44822 }
  ]
};

export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState<string>(UNITS['length'][0].id);
  const [toUnit, setToUnit] = useState<string>(UNITS['length'][1].id);
  const [value, setValue] = useState<number | ''>('');

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    setFromUnit(UNITS[cat][0].id);
    setToUnit(UNITS[cat][1].id);
    setValue('');
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const getResult = () => {
    if (value === '' || isNaN(Number(value)) || Number(value) < 0) return '';
    const currentUnits = UNITS[category];
    const from = currentUnits.find(u => u.id === fromUnit);
    const to = currentUnits.find(u => u.id === toUnit);
    if (!from || !to) return '';

    // Convert from source to base unit, then from base unit to target
    const baseValue = Number(value) * from.factor;
    const result = baseValue / to.factor;
    
    // Format to avoid long decimals but keep precision
    return Number.isInteger(result) ? result.toString() : parseFloat(result.toPrecision(7)).toString();
  };

  const hasError = value !== '' && (isNaN(Number(value)) || Number(value) < 0);

  return (
    <div className="bg-[#0b1329] text-white p-6 rounded-xl shadow-lg border border-[#f5b731]/20 font-[Cairo] rtl max-w-2xl mx-auto" dir="rtl" lang="ar">
      <h2 className="text-2xl font-bold mb-6 text-[#f5b731] flex items-center gap-2">
        <span>📐</span> محول الوحدات الهندسية الشامل
      </h2>

      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-4 py-2 rounded-full min-h-[44px] transition-colors ${
              category === cat.id
                ? 'bg-[#f5b731] text-[#0b1329] font-bold'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-center bg-gray-900/50 p-6 rounded-lg border border-gray-800">
        <div className="space-y-4">
          <label className="block text-sm text-gray-400">من</label>
          <select
            aria-label="الوحدة المحول منها"
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full min-h-[44px] bg-[#0b1329] border border-gray-700 rounded px-3 py-2 outline-none focus:border-[#f5b731]"
          >
            {UNITS[category].map(u => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
          <input
            type="number"
            aria-label="القيمة المراد تحويلها"
            min="0"
            required
            value={value}
            onChange={(e) => setValue(e.target.value ? Number(e.target.value) : '')}
            placeholder="0"
            className={`w-full min-h-[44px] bg-[#0b1329] border rounded px-4 py-2 outline-none text-xl font-bold focus:border-[#f5b731] transition-colors ${
              hasError ? 'border-red-500' : 'border-gray-700'
            }`}
          />
          {hasError && <p className="text-red-400 text-sm">القيمة يجب أن تكون رقماً موجباً.</p>}
        </div>

        <button
          onClick={swapUnits}
          aria-label="تبديل الوحدات"
          className="w-12 h-12 bg-gray-800 hover:bg-[#f5b731] hover:text-[#0b1329] rounded-full flex items-center justify-center transition-all mx-auto text-xl"
        >
          ⇄
        </button>

        <div className="space-y-4">
          <label className="block text-sm text-gray-400">إلى</label>
          <select
            aria-label="الوحدة المحول إليها"
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full min-h-[44px] bg-[#0b1329] border border-gray-700 rounded px-3 py-2 outline-none focus:border-[#f5b731]"
          >
            {UNITS[category].map(u => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
          <div className="w-full min-h-[44px] bg-gray-800/50 border border-gray-700 rounded px-4 py-2 text-xl font-bold text-[#f5b731] flex items-center">
            {getResult() || '0'}
          </div>
        </div>
      </div>
    </div>
  );
}
