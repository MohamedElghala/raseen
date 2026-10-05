'use client';

import React, { useState } from 'react';
import { ProductItem } from '@/lib/types';

interface ExcelInspectorProps {
  product: ProductItem;
}

export default function ExcelInspector({ product }: ExcelInspectorProps) {
  const [activeTab, setActiveTab] = useState<'journal' | 'trial' | 'income' | 'kpis'>('journal');
  
  // Interactive mini spreadsheet state
  const [val1, setVal1] = useState(45000);
  const [val2, setVal2] = useState(12800);
  const [val3, setVal3] = useState(6400);

  const totalRevenue = val1;
  const totalExpenses = val2 + val3;
  const netIncome = totalRevenue - totalExpenses;
  const profitMargin = Math.round((netIncome / (totalRevenue || 1)) * 100);

  return (
    <div className="mt-8 bg-rawnaq-navy border border-emerald-500/30 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header Bar */}
      <div className="bg-emerald-950/40 border-b border-emerald-500/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl text-emerald-400 font-bold">
            📊
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white">معاين أوراق ومعادلات الإكسيل الحية (Live Excel Engine)</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                Formula Enabled
              </span>
            </div>
            <p className="text-xs text-slate-400">
              استكشف أوراق العمل والمعادلات البرمجية المؤتمتة المضمنة في هذا الشيت قبل التحميل
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 font-mono bg-rawnaq-dark px-3 py-1.5 rounded-xl border border-rawnaq-border">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>XLSX / XLSM Compatible</span>
        </div>
      </div>

      {/* Formula Bar Simulation */}
      <div className="bg-rawnaq-dark/80 border-b border-rawnaq-border px-4 py-2.5 flex items-center gap-3 text-xs font-mono">
        <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
          fx
        </span>
        <div className="text-slate-400 text-[11px] shrink-0 font-bold">
          {activeTab === 'journal' && 'CELL [E12] :'}
          {activeTab === 'trial' && 'CELL [D24] :'}
          {activeTab === 'income' && 'CELL [F18] :'}
          {activeTab === 'kpis' && 'CELL [B08] :'}
        </div>
        <div className="text-slate-200 overflow-x-auto whitespace-nowrap bg-rawnaq-surface px-3 py-1 rounded border border-rawnaq-border flex-1">
          {activeTab === 'journal' && '=XLOOKUP(A12, Accounts_Chart!A:A, Accounts_Chart!B:B, "غير معرف", 0)'}
          {activeTab === 'trial' && '=SUMIFS(General_Journal!F:F, General_Journal!C:C, A24, General_Journal!E:E, "مدين")'}
          {activeTab === 'income' && '=IFERROR((Revenue_Total - Cost_Of_Goods) / Revenue_Total, 0)'}
          {activeTab === 'kpis' && '=AVERAGEIFS(Sales_Data!H:H, Sales_Data!D:D, ">="&DATE(2026,1,1))'}
        </div>
      </div>

      {/* Workbook Tabs */}
      <div className="flex items-center gap-1 px-4 pt-3 bg-rawnaq-surface/50 border-b border-rawnaq-border overflow-x-auto">
        <button
          onClick={() => setActiveTab('journal')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-t border-x ${
            activeTab === 'journal'
              ? 'bg-rawnaq-dark text-emerald-400 border-emerald-500/40 shadow'
              : 'text-slate-400 border-transparent hover:text-white'
          }`}
        >
          📗 01_سجل_القيود_اليومية
        </button>
        <button
          onClick={() => setActiveTab('trial')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-t border-x ${
            activeTab === 'trial'
              ? 'bg-rawnaq-dark text-emerald-400 border-emerald-500/40 shadow'
              : 'text-slate-400 border-transparent hover:text-white'
          }`}
        >
          📊 02_ميزان_المراجعة
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-t border-x ${
            activeTab === 'income'
              ? 'bg-rawnaq-dark text-emerald-400 border-emerald-500/40 shadow'
              : 'text-slate-400 border-transparent hover:text-white'
          }`}
        >
          📈 03_قائمة_الدخل_الختامية
        </button>
        <button
          onClick={() => setActiveTab('kpis')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-t border-x ${
            activeTab === 'kpis'
              ? 'bg-rawnaq-dark text-emerald-400 border-emerald-500/40 shadow'
              : 'text-slate-400 border-transparent hover:text-white'
          }`}
        >
          🎯 04_داشبورد_مؤشرات_KPIs
        </button>
      </div>

      {/* Interactive Sheet Content */}
      <div className="p-4 md:p-6 bg-rawnaq-dark">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
          <span>💡 جرّب تعديل الأرقام أدناه لمشاهدة تفاعل المعادلات والمجاميع التلقائية فوراً:</span>
          <span className="font-mono text-emerald-400 font-bold">Auto-Recalculate: Active</span>
        </div>

        {/* Live Grid */}
        <div className="overflow-x-auto border border-rawnaq-border rounded-xl">
          <table className="w-full text-right text-xs">
            <thead className="bg-rawnaq-surface text-slate-300 font-mono border-b border-rawnaq-border">
              <tr>
                <th className="p-2.5 w-12 text-center text-slate-500 border-l border-rawnaq-border">#</th>
                <th className="p-2.5 border-l border-rawnaq-border">البند المحاسبي / الحساب</th>
                <th className="p-2.5 border-l border-rawnaq-border w-32">نوع الحركة</th>
                <th className="p-2.5 border-l border-rawnaq-border w-40">القيمة المالية (ج.م)</th>
                <th className="p-2.5">المعادلة والحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rawnaq-border text-slate-200 font-mono">
              <tr className="hover:bg-rawnaq-surface/40 transition-colors">
                <td className="p-2.5 text-center text-slate-500 border-l border-rawnaq-border">101</td>
                <td className="p-2.5 border-l border-rawnaq-border font-sans font-medium text-white">إجمالي إيرادات المبيعات والخدمات</td>
                <td className="p-2.5 border-l border-rawnaq-border text-emerald-400">دائن (Credit)</td>
                <td className="p-2 border-l border-rawnaq-border">
                  <input
                    type="number"
                    value={val1}
                    onChange={(e) => setVal1(Number(e.target.value) || 0)}
                    className="w-full bg-rawnaq-navy border border-rawnaq-border rounded px-2 py-1 text-emerald-300 font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </td>
                <td className="p-2.5 text-[11px] text-slate-400 font-sans">معادلة تدفق مبيعات مؤتمتة</td>
              </tr>

              <tr className="hover:bg-rawnaq-surface/40 transition-colors">
                <td className="p-2.5 text-center text-slate-500 border-l border-rawnaq-border">201</td>
                <td className="p-2.5 border-l border-rawnaq-border font-sans font-medium text-white">تكلفة البضاعة والخدمات المباشرة (COGS)</td>
                <td className="p-2.5 border-l border-rawnaq-border text-amber-400">مدين (Debit)</td>
                <td className="p-2 border-l border-rawnaq-border">
                  <input
                    type="number"
                    value={val2}
                    onChange={(e) => setVal2(Number(e.target.value) || 0)}
                    className="w-full bg-rawnaq-navy border border-rawnaq-border rounded px-2 py-1 text-amber-300 font-bold focus:border-amber-500 focus:outline-none"
                  />
                </td>
                <td className="p-2.5 text-[11px] text-slate-400 font-sans">=FIFO_Inventory_Cost()</td>
              </tr>

              <tr className="hover:bg-rawnaq-surface/40 transition-colors">
                <td className="p-2.5 text-center text-slate-500 border-l border-rawnaq-border">301</td>
                <td className="p-2.5 border-l border-rawnaq-border font-sans font-medium text-white">المصروفات التشغيلية والتسويقية (OPEX)</td>
                <td className="p-2.5 border-l border-rawnaq-border text-amber-400">مدين (Debit)</td>
                <td className="p-2 border-l border-rawnaq-border">
                  <input
                    type="number"
                    value={val3}
                    onChange={(e) => setVal3(Number(e.target.value) || 0)}
                    className="w-full bg-rawnaq-navy border border-rawnaq-border rounded px-2 py-1 text-amber-300 font-bold focus:border-amber-500 focus:outline-none"
                  />
                </td>
                <td className="p-2.5 text-[11px] text-slate-400 font-sans">=SUMIFS(Opex_Table)</td>
              </tr>

              {/* Total Calculation Row */}
              <tr className="bg-emerald-950/30 font-bold text-white">
                <td className="p-3 text-center text-emerald-400 border-l border-rawnaq-border">∑</td>
                <td className="p-3 border-l border-rawnaq-border font-sans">صافي الربح التشغيلي المحسوب (Net Profit)</td>
                <td className="p-3 border-l border-rawnaq-border text-emerald-400">
                  هامش الربح: {profitMargin}%
                </td>
                <td className="p-3 border-l border-rawnaq-border text-emerald-400 text-sm">
                  {netIncome.toLocaleString()} ج.م
                </td>
                <td className="p-3 text-[11px] text-emerald-300 font-sans">
                  ✓ ميزان مالي متزن ومحمي بنسبة 100%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Technical Checklist */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-rawnaq-surface border border-rawnaq-border text-center">
            <div className="text-slate-400 mb-1">إصدار الإكسل</div>
            <div className="font-bold text-white font-mono">2016 - 2026 / 365</div>
          </div>
          <div className="p-3 rounded-xl bg-rawnaq-surface border border-rawnaq-border text-center">
            <div className="text-slate-400 mb-1">توافق Google Sheets</div>
            <div className="font-bold text-emerald-400 font-mono">100% متوافق سحابياً</div>
          </div>
          <div className="p-3 rounded-xl bg-rawnaq-surface border border-rawnaq-border text-center">
            <div className="text-slate-400 mb-1">الماكرو والبرمجة</div>
            <div className="font-bold text-rawnaq-gold font-mono">VBA Macros + بدون حماية</div>
          </div>
          <div className="p-3 rounded-xl bg-rawnaq-surface border border-rawnaq-border text-center">
            <div className="text-slate-400 mb-1">اتجاه الأوراق</div>
            <div className="font-bold text-white font-mono">RTL عربي كامل</div>
          </div>
        </div>
      </div>
    </div>
  );
}
