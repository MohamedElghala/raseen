'use client';

import React, { useState } from 'react';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number | '';
  price: number | '';
}

export default function InvoiceGenerator() {
  const [companyName, setCompanyName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [clientName, setClientName] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, price: 0 }
  ]);
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [taxRate, setTaxRate] = useState<number | ''>(15);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const addItem = () => setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, price: 0 }]);
  
  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0), 0);
  };

  const getTax = () => {
    if (!taxEnabled || taxRate === '') return 0;
    return getSubtotal() * (Number(taxRate) / 100);
  };

  const getTotal = () => getSubtotal() + getTax();

  const handlePrint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !clientName) {
      setError('يرجى إدخال اسم الشركة واسم العميل.');
      return;
    }
    const invalidItems = items.some(i => !i.description || i.quantity === '' || i.price === '');
    if (invalidItems) {
      setError('يرجى استكمال جميع بيانات بنود الفاتورة.');
      return;
    }
    setError('');
    window.print();
  };

  return (
    <div className="bg-[#0b1329] text-white p-6 rounded-xl shadow-lg border border-[#f5b731]/20 font-[Cairo] rtl print:bg-white print:text-black print:border-none print:shadow-none print:p-0" dir="rtl" lang="ar">
      <h2 className="text-2xl font-bold mb-6 text-[#f5b731] flex items-center gap-2 print:hidden">
        <span>📄</span> مولد الفواتير الإلكترونية
      </h2>

      {/* Editor Section */}
      <form onSubmit={handlePrint} className="space-y-6 print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">اسم الشركة / الفرد *</label>
            <input
              type="text"
              aria-label="اسم الشركة"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full min-h-[44px] bg-[#0b1329] border border-gray-700 rounded px-3 py-2 focus:border-[#f5b731] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">اسم العميل *</label>
            <input
              type="text"
              aria-label="اسم العميل"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full min-h-[44px] bg-[#0b1329] border border-gray-700 rounded px-3 py-2 focus:border-[#f5b731] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">رقم الفاتورة</label>
            <input
              type="text"
              aria-label="رقم الفاتورة"
              required
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full min-h-[44px] bg-[#0b1329] border border-gray-700 rounded px-3 py-2 focus:border-[#f5b731] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">التاريخ</label>
            <input
              type="date"
              aria-label="التاريخ"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full min-h-[44px] bg-[#0b1329] border border-gray-700 rounded px-3 py-2 focus:border-[#f5b731] outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-[#f5b731]/30">
                <th className="pb-2">البند *</th>
                <th className="pb-2 w-24">الكمية *</th>
                <th className="pb-2 w-32">سعر الوحدة *</th>
                <th className="pb-2 w-32">الإجمالي</th>
                <th className="pb-2 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-800">
                  <td className="py-2 pr-2">
                    <input
                      type="text"
                      aria-label={`وصف البند ${index + 1}`}
                      required
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="w-full min-h-[44px] bg-transparent border border-gray-700 rounded px-2"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      aria-label={`كمية البند ${index + 1}`}
                      required
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', e.target.value ? Number(e.target.value) : '')}
                      className="w-full min-h-[44px] bg-transparent border border-gray-700 rounded px-2"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      aria-label={`سعر البند ${index + 1}`}
                      required
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', e.target.value ? Number(e.target.value) : '')}
                      className="w-full min-h-[44px] bg-transparent border border-gray-700 rounded px-2"
                    />
                  </td>
                  <td className="py-2 px-2 text-gray-300">
                    {((Number(item.quantity) || 0) * (Number(item.price) || 0)).toFixed(2)}
                  </td>
                  <td className="py-2 pl-2 text-center">
                    <button
                      type="button"
                      aria-label={`حذف البند ${index + 1}`}
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="text-red-400 disabled:opacity-50 min-h-[44px] px-2"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <button type="button" onClick={addItem} className="text-[#f5b731] text-sm border border-[#f5b731]/30 px-4 py-2 rounded min-h-[44px]">
          + إضافة بند
        </button>

        <div className="flex flex-col md:flex-row gap-6 border-t border-gray-700 pt-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="taxEnabled"
                aria-label="تفعيل الضريبة"
                checked={taxEnabled}
                onChange={(e) => setTaxEnabled(e.target.checked)}
                className="w-5 h-5 accent-[#f5b731]"
              />
              <label htmlFor="taxEnabled">إضافة ضريبة (%)</label>
              {taxEnabled && (
                <input
                  type="number"
                  aria-label="نسبة الضريبة"
                  min="0"
                  max="100"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value ? Number(e.target.value) : '')}
                  className="w-20 min-h-[44px] bg-[#0b1329] border border-gray-700 rounded px-2 focus:border-[#f5b731]"
                />
              )}
            </div>
            <div>
              <label className="block text-sm mb-1">ملاحظات</label>
              <textarea
                aria-label="ملاحظات"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full min-h-[88px] bg-[#0b1329] border border-gray-700 rounded px-3 py-2 focus:border-[#f5b731] outline-none resize-none"
              ></textarea>
            </div>
          </div>
          
          <div className="flex-1 bg-gray-800/50 p-4 rounded text-lg font-medium space-y-2">
            <div className="flex justify-between">
              <span>المجموع الفرعي:</span>
              <span>{getSubtotal().toFixed(2)}</span>
            </div>
            {taxEnabled && (
              <div className="flex justify-between text-gray-400">
                <span>الضريبة:</span>
                <span>{getTax().toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#f5b731] font-bold border-t border-gray-700 pt-2 mt-2">
              <span>الإجمالي:</span>
              <span>{getTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {error && <div className="text-red-400 bg-red-500/10 p-3 rounded">{error}</div>}

        <button type="submit" className="w-full bg-[#f5b731] hover:bg-[#e0a629] text-[#0b1329] font-bold py-3 rounded min-h-[44px]">
          طباعة / تصدير PDF
        </button>
      </form>

      {/* Print Preview Section */}
      <div className="hidden print:block font-sans">
        <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold mb-2">فاتورة</h1>
            <h2 className="text-xl font-bold">{companyName || 'اسم الشركة'}</h2>
          </div>
          <div className="text-left">
            <p><strong>رقم الفاتورة:</strong> {invoiceNumber}</p>
            <p><strong>التاريخ:</strong> {date}</p>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-1">فاتورة إلى:</h3>
          <p className="text-lg">{clientName || 'اسم العميل'}</p>
        </div>

        <table className="w-full text-right mb-8 border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2">البند</th>
              <th className="border border-black p-2">الكمية</th>
              <th className="border border-black p-2">سعر الوحدة</th>
              <th className="border border-black p-2">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="border border-black p-2">{item.description}</td>
                <td className="border border-black p-2">{item.quantity}</td>
                <td className="border border-black p-2">{item.price}</td>
                <td className="border border-black p-2">{((Number(item.quantity) || 0) * (Number(item.price) || 0)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between mb-2">
              <span>المجموع الفرعي:</span>
              <span>{getSubtotal().toFixed(2)}</span>
            </div>
            {taxEnabled && (
              <div className="flex justify-between mb-2">
                <span>الضريبة ({taxRate}%):</span>
                <span>{getTax().toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-xl border-t-2 border-black pt-2">
              <span>الإجمالي:</span>
              <span>{getTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {notes && (
          <div className="mt-8 border-t border-gray-300 pt-4">
            <h4 className="font-bold mb-2">ملاحظات:</h4>
            <p className="whitespace-pre-wrap">{notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
