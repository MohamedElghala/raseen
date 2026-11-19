'use client';

import React, { useState } from 'react';

interface SheetRow {
  code: string;
  item: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  total: number;
  formula?: string;
  isHeader?: boolean;
  isTotal?: boolean;
}

const SAMPLE_INCOME_STATEMENT: SheetRow[] = [
  { code: '4100', item: 'إيرادات المبيعات والخدمات الرئيسية', q1: 185000, q2: 210000, q3: 245000, q4: 290000, total: 930000, isHeader: false },
  { code: '4200', item: 'إيرادات استشارية وعقود تابعة', q1: 35000, q2: 42000, q3: 50000, q4: 65000, total: 192000, isHeader: false },
  { code: '4000', item: 'إجمالي الإيرادات التشغيلية', q1: 220000, q2: 252000, q3: 295000, q4: 355000, total: 1122000, formula: '=SUM(D4:D5)', isTotal: true },
  { code: '5100', item: 'تكلفة المبيعات والأعمال المباشرة (COGS)', q1: -88000, q2: -98000, q3: -115000, q4: -135000, total: -436000, isHeader: false },
  { code: '5000', item: 'مجمل الربح (Gross Profit)', q1: 132000, q2: 154000, q3: 180000, q4: 220000, total: 686000, formula: '=C6+C7', isTotal: true },
  { code: '6100', item: 'مصروفات الرواتب والأجور التنفيذية', q1: -45000, q2: -45000, q3: -48000, q4: -52000, total: -190000, isHeader: false },
  { code: '6200', item: 'مصروفات تسويق وحملات نمو', q1: -18000, q2: -22000, q3: -25000, q4: -32000, total: -97000, isHeader: false },
  { code: '6300', item: 'إهلاك الأصول الثابتة (معيار IFRS 16)', q1: -12000, q2: -12000, q3: -12000, q4: -12000, total: -48000, formula: '=SLN(Cost, Salvage, Life)', isHeader: false },
  { code: '7000', item: 'صافي الربح التشغيلي قبل الفوائد والضرائب (EBIT)', q1: 57000, q2: 75000, q3: 95000, q4: 124000, total: 351000, formula: '=C8-SUM(C9:C11)', isTotal: true },
];

export default function LiveSheetPreview({ title }: { title: string }) {
  const [activeTab, setActiveTab] = useState<'income' | 'balance' | 'cashflow' | 'kpis'>('income');
  const [selectedCell, setSelectedCell] = useState<{ row: string; cell: string; val: string; formula: string }>({
    row: 'مجمل الربح',
    cell: 'H6',
    val: '686,000 ج.م',
    formula: '=SUM(D4:D5)+D7',
  });

  return (
    <div className="bg-raseen-navy border border-raseen-border rounded-2xl overflow-hidden shadow-2xl my-6" dir="rtl" lang="ar">
      {/* Excel Title Bar */}
      <div className="p-3 bg-raseen-dark border-b border-raseen-border flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          <span className="font-bold text-white flex items-center gap-1.5">
            <span>📊</span>
            <span>فاحص ومعاين الإكسل الحي: {title}</span>
          </span>
          <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-mono">
            LIVE XLSX ENGINE
          </span>
        </div>
        <div className="text-[11px] text-slate-400 flex items-center gap-3">
          <span>دوال مبرمجة: SUM / VLOOKUP / IFRS</span>
          <span>•</span>
          <span className="text-green-400">جاهز للتعديل المباشر</span>
        </div>
      </div>

      {/* Formula Bar */}
      <div className="p-2 bg-raseen-surface/90 border-b border-raseen-border flex items-center gap-3 text-xs font-mono">
        <div className="bg-raseen-dark border border-raseen-border px-2 py-1 rounded text-raseen-gold font-bold min-w-[50px] text-center">
          {selectedCell.cell}
        </div>
        <span className="text-slate-400 font-bold font-sans">fx</span>
        <div className="flex-1 bg-raseen-dark border border-raseen-border px-3 py-1 rounded text-slate-200 truncate">
          {selectedCell.formula}
        </div>
      </div>

      {/* Sheet Grid Table */}
      <div className="overflow-x-auto max-h-[380px] p-2 bg-[#091021]">
        <table className="w-full text-right text-xs border-collapse">
          <thead>
            <tr className="bg-raseen-dark/80 text-slate-400 border-b border-raseen-border text-[11px] select-none font-mono">
              <th className="p-2 border-l border-raseen-border/50 text-center w-12">#</th>
              <th className="p-2 border-l border-raseen-border/50">الكود</th>
              <th className="p-2 border-l border-raseen-border/50 min-w-[220px]">بند الحساب / البيان المالي</th>
              <th className="p-2 border-l border-raseen-border/50 text-center">الربع 1 (Q1)</th>
              <th className="p-2 border-l border-raseen-border/50 text-center">الربع 2 (Q2)</th>
              <th className="p-2 border-l border-raseen-border/50 text-center">الربع 3 (Q3)</th>
              <th className="p-2 border-l border-raseen-border/50 text-center">الربع 4 (Q4)</th>
              <th className="p-2 text-center text-raseen-gold font-bold">الإجمالي السنوي</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_INCOME_STATEMENT.map((row, idx) => {
              const isSelected = selectedCell.row === row.item;

              return (
                <tr
                  key={row.code}
                  onClick={() =>
                    setSelectedCell({
                      row: row.item,
                      cell: `H${idx + 4}`,
                      val: `${row.total.toLocaleString()} ج.م`,
                      formula: row.formula || `=SUM(C${idx + 4}:F${idx + 4})`,
                    })
                  }
                  className={`border-b border-raseen-border/40 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-raseen-gold/15 text-white'
                      : row.isTotal
                      ? 'bg-raseen-surface/70 font-bold text-white'
                      : 'hover:bg-raseen-surface/40 text-slate-300'
                  }`}
                >
                  <td className="p-2 text-center font-mono text-[10px] text-slate-500 border-l border-raseen-border/40 select-none">
                    {idx + 4}
                  </td>
                  <td className="p-2 font-mono text-slate-400 border-l border-raseen-border/40 text-[11px]">
                    {row.code}
                  </td>
                  <td className="p-2 font-medium border-l border-raseen-border/40">
                    {row.item}
                  </td>
                  <td className="p-2 text-center font-mono border-l border-raseen-border/40">
                    {row.q1.toLocaleString()}
                  </td>
                  <td className="p-2 text-center font-mono border-l border-raseen-border/40">
                    {row.q2.toLocaleString()}
                  </td>
                  <td className="p-2 text-center font-mono border-l border-raseen-border/40">
                    {row.q3.toLocaleString()}
                  </td>
                  <td className="p-2 text-center font-mono border-l border-raseen-border/40">
                    {row.q4.toLocaleString()}
                  </td>
                  <td
                    className={`p-2 text-center font-mono font-bold ${
                      row.isTotal ? 'text-raseen-gold text-sm' : 'text-slate-200'
                    }`}
                  >
                    {row.total.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Excel Sheet Tabs at Bottom */}
      <div className="p-2 bg-raseen-dark border-t border-raseen-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'income', label: 'قائمة الدخل P&L', icon: '📄' },
            { id: 'balance', label: 'المركز المالي Balance Sheet', icon: '⚖️' },
            { id: 'cashflow', label: 'التدفقات Cash Flow', icon: '💵' },
            { id: 'kpis', label: 'المؤشرات والرسوم KPIs', icon: '📈' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'income' | 'balance' | 'cashflow' | 'kpis')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-raseen-surface text-slate-400 hover:text-white border border-raseen-border'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400">
          <span>انقر على أي صف لمشاهدة المعادلة الرياضية في شريط الصيغ (fx)</span>
        </div>
      </div>
    </div>
  );
}
