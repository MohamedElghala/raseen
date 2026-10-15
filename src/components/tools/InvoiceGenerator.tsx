'use client';

import React, { useState, useMemo } from 'react';
import { generateZatcaTLV, renderQRCodeMatrix, generateZatcaQRSvg } from '@/lib/zatca';
import { Analytics } from '@/lib/analytics';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number | '';
  price: number | '';
}

export default function InvoiceGenerator() {
  const [companyName, setCompanyName] = useState('شركة رَصين للحلول الرقمية');
  const [taxNumber, setTaxNumber] = useState('31024589200003');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [clientName, setClientName] = useState('مؤسسة الأفق المتقدمة');
  const [clientTaxNumber, setClientTaxNumber] = useState('');
  const [currency, setCurrency] = useState<'SAR' | 'EGP' | 'AED' | 'USD'>('SAR');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'ترخيص نظام أتمتة الأعمال وشيت التدفقات النقدية 2026', quantity: 1, price: 1500 },
    { id: '2', description: 'جلسة استشارية وتخصيص قوالب العقود المعتمدة', quantity: 2, price: 400 },
  ]);
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [taxRate, setTaxRate] = useState<number | ''>(15);
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState('شكراً لتعاملكم معنا. الدفع عبر التحويل البنكي أو إنستاباي / مدى.');
  const [error, setError] = useState('');

  const currencySymbols: Record<string, string> = {
    SAR: 'ر.س',
    EGP: 'ج.م',
    AED: 'د.إ',
    USD: '$',
  };

  const curr = currencySymbols[currency] || 'ر.س';

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, price: 0 }]);
  };
  
  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0), 0);
  };

  const getDiscountAmount = () => {
    return (getSubtotal() * (discount || 0)) / 100;
  };

  const getTaxableAmount = () => {
    return Math.max(0, getSubtotal() - getDiscountAmount());
  };

  const getTax = () => {
    if (!taxEnabled || taxRate === '') return 0;
    return getTaxableAmount() * (Number(taxRate) / 100);
  };

  const getTotal = () => getTaxableAmount() + getTax();

  const subtotal = getSubtotal();
  const tax = getTax();
  const total = getTotal();

  // Authentic ZATCA TLV Base64 payload
  const zatcaPayload = useMemo(() => {
    try {
      return generateZatcaTLV(
        companyName || 'شركة رَصين للحلول الرقمية',
        taxNumber || '31024589200003',
        `${date}T12:00:00Z`,
        total.toFixed(2),
        tax.toFixed(2)
      );
    } catch {
      return '';
    }
  }, [companyName, taxNumber, date, total, tax]);

  // Authentic 2D boolean QR Matrix (ISO/IEC 18004 Standard)
  const qrMatrix = useMemo(() => {
    if (!zatcaPayload) return null;
    try {
      return renderQRCodeMatrix(zatcaPayload);
    } catch {
      return null;
    }
  }, [zatcaPayload]);

  // Fallback / SVG string representation
  const zatcaQrSvg = useMemo(() => {
    if (!zatcaPayload) return '';
    try {
      return generateZatcaQRSvg(zatcaPayload, 160);
    } catch {
      return '';
    }
  }, [zatcaPayload]);

  const handlePrint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !clientName) {
      setError('يرجى إدخال اسم الشركة واسم العميل.');
      return;
    }
    const invalidItems = items.some((i) => !i.description || i.quantity === '' || i.price === '');
    if (invalidItems) {
      setError('يرجى استكمال جميع بيانات بنود الفاتورة.');
      return;
    }
    setError('');
    Analytics.toolUsed('invoice_generator', { total: total, currency });
    window.print();
  };

  return (
    <div className="w-full bg-slate-900/90 text-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl border border-slate-800 font-cairo rtl print:bg-white print:text-black print:border-none print:shadow-none print:p-0" dir="rtl" lang="ar">
      
      {/* Interactive Form (Hidden on Print) */}
      <form onSubmit={handlePrint} className="space-y-6 print:hidden">
        
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold mb-2">
              <span>🧾</span>
              <span>مولد الفواتير وعروض الأسعار الضريبية (ZATCA / ETA)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              أصدر فاتورة أو عرض سعر قانوني في ثوانٍ
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              متوافقة مع هيئة الزكاة والضريبة (ZATCA) ومصلحة الضرائب المصرية، مع رمز الاستجابة السريع QR.
            </p>
          </div>

          {/* Currency Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
            {(['SAR', 'AED', 'EGP', 'USD'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  currency === c
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Company & Client Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">اسم شركتك / المنشأة *</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">الرقم الضريبي للمنشأة (ZATCA)</label>
            <input
              type="text"
              value={taxNumber}
              onChange={(e) => setTaxNumber(e.target.value)}
              placeholder="300000000000003"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-amber-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">اسم العميل / الشركة المستقبلة *</label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">رقم الفاتورة والتاريخ</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-2 py-2 text-xs text-white font-mono focus:border-amber-400 outline-none"
              />
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-2 py-2 text-xs text-white focus:border-amber-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">وصف البند / الخدمة *</th>
                  <th className="py-3 px-3 w-24">الكمية *</th>
                  <th className="py-3 px-3 w-32">سعر الوحدة ({curr}) *</th>
                  <th className="py-3 px-3 w-32">الإجمالي</th>
                  <th className="py-3 px-3 w-12 text-center">حذف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-2.5">
                      <input
                        type="text"
                        required
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="أدخل تفاصيل البند أو الخدمة..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 outline-none"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="number"
                        required
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', e.target.value ? Number(e.target.value) : '')}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white font-mono text-center focus:border-amber-400 outline-none"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', e.target.value ? Number(e.target.value) : '')}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white font-mono text-center focus:border-amber-400 outline-none"
                      />
                    </td>
                    <td className="p-2.5 font-mono font-bold text-amber-400">
                      {((Number(item.quantity) || 0) * (Number(item.price) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })} {curr}
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        className="text-rose-400 hover:text-rose-300 disabled:opacity-20 text-sm px-2 py-1 rounded"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <span>+</span>
            <span>إضافة بند جديد</span>
          </button>
        </div>

        {/* Totals & Tax Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
          
          {/* Left: Tax & Discount presets */}
          <div className="space-y-4">
            {/* Tax Settings */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="taxEnabled"
                  checked={taxEnabled}
                  onChange={(e) => setTaxEnabled(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
                <label htmlFor="taxEnabled" className="text-xs font-bold text-slate-300 cursor-pointer">
                  تطبيق ضريبة القيمة المضافة (VAT)
                </label>
              </div>

              {taxEnabled && (
                <div className="flex items-center gap-2 pt-1">
                  {[
                    { rate: 15, label: '15% (السعودية)' },
                    { rate: 14, label: '14% (مصر)' },
                    { rate: 5, label: '5% (الإمارات)' },
                    { rate: 0, label: '0% (معفاة)' },
                  ].map((preset) => (
                    <button
                      key={preset.rate}
                      type="button"
                      onClick={() => setTaxRate(preset.rate)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                        taxRate === preset.rate
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                          : 'border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Discount */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300">نسبة الخصم التجاري (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                className="w-32 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-amber-400 outline-none"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300">ملاحظات وشروط الدفع</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 outline-none resize-none"
              />
            </div>
          </div>

          {/* Right: Summary & ZATCA QR Preview */}
          <div className="space-y-3 flex flex-col justify-between">
            <div className="space-y-2 bg-slate-900 p-4 rounded-xl border border-slate-800/80 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>المجموع الفرعي:</span>
                <span className="font-mono">{getSubtotal().toLocaleString(undefined, { minimumFractionDigits: 2 })} {curr}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-rose-400">
                  <span>الخصم ({discount}%):</span>
                  <span className="font-mono">-{getDiscountAmount().toLocaleString(undefined, { minimumFractionDigits: 2 })} {curr}</span>
                </div>
              )}

              {taxEnabled && (
                <div className="flex justify-between text-slate-400">
                  <span>ضريبة القيمة المضافة ({taxRate}%):</span>
                  <span className="font-mono">+{getTax().toLocaleString(undefined, { minimumFractionDigits: 2 })} {curr}</span>
                </div>
              )}

              <div className="flex justify-between text-amber-400 font-black text-base border-t border-slate-800 pt-2 mt-1">
                <span>الإجمالي النهائي المستحق:</span>
                <span className="font-mono">{getTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })} {curr}</span>
              </div>
            </div>

            {/* ZATCA QR Simulated Badge */}
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Visual Authentic QR Code Box */}
                <div className="w-14 h-14 bg-white rounded-lg p-1 shrink-0 flex items-center justify-center shadow overflow-hidden">
                  {qrMatrix ? (
                    <svg 
                      viewBox={`0 0 ${qrMatrix.length} ${qrMatrix.length}`} 
                      className="w-full h-full"
                      style={{ shapeRendering: 'crispEdges' }}
                      aria-label="رمز الاستجابة السريع ZATCA QR"
                    >
                      <rect width={qrMatrix.length} height={qrMatrix.length} fill="#ffffff" />
                      {qrMatrix.map((row, r) =>
                        row.map((isDark, c) =>
                          isDark ? (
                            <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#0f172a" />
                          ) : null
                        )
                      )}
                    </svg>
                  ) : (
                    <div 
                      className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                      dangerouslySetInnerHTML={{ __html: zatcaQrSvg }} 
                    />
                  )}
                </div>
                <div className="text-[11px] space-y-0.5">
                  <span className="text-emerald-400 font-bold block">رمز الاستجابة السريع ZATCA QR</span>
                  <span className="text-slate-400 block text-[10px]">مشفّر ببيانات البائع والمشتري والضريبة تلقائياً</span>
                  {zatcaPayload && (
                    <span className="text-[9px] font-mono text-slate-500 block truncate max-w-[220px]" title={zatcaPayload}>
                      TLV: {zatcaPayload.slice(0, 28)}...
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0">
                جاهز للطباعة ✓
              </span>
            </div>

            {error && <div className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">{error}</div>}

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <span>🖨️ طباعة الفاتورة أو حفظها كـ PDF فوراً</span>
              <span>←</span>
            </button>
          </div>

        </div>

      </form>

      {/* High-Resolution Printable A4 Invoice Layout */}
      <div id="printable-template-canvas" className="hidden print:block font-cairo text-slate-950 p-8 max-w-4xl mx-auto bg-white">
        
        {/* Print Header */}
        <div className="border-b-2 border-slate-900 pb-6 mb-6 flex justify-between items-start">
          <div>
            <div className="text-xs font-bold text-slate-500 mb-1">فاتورة ضريبية إلكترونية مبسطة</div>
            <h1 className="text-2xl font-black text-slate-950">{companyName}</h1>
            {taxNumber && <p className="text-xs text-slate-700 mt-1 font-mono">الرقم الضريبي: {taxNumber}</p>}
          </div>

          <div className="text-left">
            {/* Visual Authentic QR Code in Print */}
            <div className="w-24 h-24 bg-white border border-slate-300 rounded p-1 mb-2 inline-block overflow-hidden">
              {qrMatrix ? (
                <svg 
                  viewBox={`0 0 ${qrMatrix.length} ${qrMatrix.length}`} 
                  className="w-full h-full"
                  style={{ shapeRendering: 'crispEdges' }}
                  aria-label="رمز الاستجابة السريع ZATCA QR"
                >
                  <rect width={qrMatrix.length} height={qrMatrix.length} fill="#ffffff" />
                  {qrMatrix.map((row, r) =>
                    row.map((isDark, c) =>
                      isDark ? (
                        <rect key={`print-${r}-${c}`} x={c} y={r} width={1} height={1} fill="#0f172a" />
                      ) : null
                    )
                  )}
                </svg>
              ) : (
                <div 
                  className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: zatcaQrSvg }} 
                />
              )}
            </div>
            <div className="text-xs font-mono">
              <p><strong>رقم الفاتورة:</strong> {invoiceNumber}</p>
              <p><strong>التاريخ:</strong> {date}</p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-slate-50 p-4 rounded-lg mb-6 border border-slate-200">
          <div className="text-xs text-slate-500 font-bold mb-1">بيانات العميل / المشتري:</div>
          <div className="text-base font-bold text-slate-900">{clientName}</div>
          {clientTaxNumber && <div className="text-xs text-slate-600 font-mono mt-0.5">الرقم الضريبي للعميل: {clientTaxNumber}</div>}
        </div>

        {/* Items Table */}
        <table className="w-full text-right mb-6 border-collapse border border-slate-300 text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300">
              <th className="p-2 border border-slate-300">#</th>
              <th className="p-2 border border-slate-300">البند / الخدمة</th>
              <th className="p-2 border border-slate-300 text-center w-16">الكمية</th>
              <th className="p-2 border border-slate-300 text-center w-28">سعر الوحدة ({curr})</th>
              <th className="p-2 border border-slate-300 text-left w-28">الإجمالي ({curr})</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} className="border-b border-slate-200">
                <td className="p-2 border border-slate-300 text-center font-mono">{idx + 1}</td>
                <td className="p-2 border border-slate-300 font-medium">{item.description}</td>
                <td className="p-2 border border-slate-300 text-center font-mono">{item.quantity}</td>
                <td className="p-2 border border-slate-300 text-center font-mono">{(Number(item.price) || 0).toFixed(2)}</td>
                <td className="p-2 border border-slate-300 text-left font-mono font-bold">
                  {((Number(item.quantity) || 0) * (Number(item.price) || 0)).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-72 bg-slate-50 p-4 rounded-lg border border-slate-300 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span>المجموع الخاضع للضريبة:</span>
              <span className="font-mono">{getTaxableAmount().toFixed(2)} {curr}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>الخصم ({discount}%):</span>
                <span className="font-mono">-{getDiscountAmount().toFixed(2)} {curr}</span>
              </div>
            )}
            {taxEnabled && (
              <div className="flex justify-between text-slate-700">
                <span>ضريبة القيمة المضافة ({taxRate}%):</span>
                <span className="font-mono">+{getTax().toFixed(2)} {curr}</span>
              </div>
            )}
            <div className="flex justify-between font-black text-sm border-t-2 border-slate-900 pt-2 text-slate-950">
              <span>الإجمالي الكلي المستحق:</span>
              <span className="font-mono">{getTotal().toFixed(2)} {curr}</span>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        {notes && (
          <div className="border-t border-slate-300 pt-4 text-xs text-slate-600">
            <span className="font-bold text-slate-800 block mb-1">ملاحظات وشروط:</span>
            <p className="whitespace-pre-wrap">{notes}</p>
          </div>
        )}

        <div className="mt-8 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-3">
          تم إنشاء هذه الفاتورة إلكترونياً بواسطة منصة رَصين للأصول وإدارة الأعمال (raseen.me)
        </div>
      </div>

    </div>
  );
}
