'use client';

import React, { useState } from 'react';
import GpaCalculator from '@/components/tools/GpaCalculator';
import InvoiceGenerator from '@/components/tools/InvoiceGenerator';
import VatCalculator from '@/components/tools/VatCalculator';
import UnitConverter from '@/components/tools/UnitConverter';
import ExcelFormulaAssistant from '@/components/tools/ExcelFormulaAssistant';
import PdfConverterTool from '@/components/tools/PdfConverterTool';

export default function ToolsPage() {
  const [openSection, setOpenSection] = useState<string | null>('pdf-converter');

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const tools = [
    {
      id: 'pdf-converter',
      title: 'محول ومستخرج المستندات الذكي (PDF to Word & Excel)',
      icon: '📄',
      desc: 'حوّل ملفات العقود والفواتير من PDF إلى مستندات Word أو جداول Excel بدقة OCR.',
      component: <PdfConverterTool />,
    },
    {
      id: 'excel',
      title: 'مساعد ومولد معادلات الإكسيل الذكي (XLOOKUP / SUMIFS)',
      icon: '📗',
      desc: 'صمم معادلات الإكسيل المحاسبية المتقدمة واشتق دوال البحث والجمع الشرطي الجاهزة.',
      component: <ExcelFormulaAssistant />,
    },
    {
      id: 'gpa',
      title: 'حاسبة المعدل التراكمي الجامعي (GPA)',
      icon: '🎓',
      desc: 'احسب معدلك الفصلي والتراكمي بدقة مع تقدير الساعات المعتمدة فورياً.',
      component: <GpaCalculator />,
    },
    {
      id: 'invoice',
      title: 'مولد الفواتير الإلكترونية وعروض الأسعار',
      icon: '📄',
      desc: 'صمم فواتيرك الاحترافية بصيغة جاهزة للطباعة والتصدير كـ PDF مجاناً.',
      component: <InvoiceGenerator />,
    },
    {
      id: 'vat',
      title: 'حاسبة ضريبة القيمة المضافة (VAT)',
      icon: '📊',
      desc: 'حساب الضريبة لمصر (14%)، السعودية (15%)، والإمارات (5%) شامل أو غير شامل.',
      component: <VatCalculator />,
    },
    {
      id: 'unit',
      title: 'محول الوحدات الهندسية والمساحات الشامل',
      icon: '📐',
      desc: 'تحويل وحدات الضغط، القوى، الأطوال، والمساحات الزراعية (فدان، قيراط، سهم).',
      component: <UnitConverter />,
    },
  ];

  return (
    <main className="min-h-screen bg-rawnaq-dark text-white font-cairo py-12" dir="rtl" lang="ar">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-rawnaq-surface text-rawnaq-gold border border-rawnaq-border rounded-full text-xs font-semibold mb-3">
            أدوات مجانية للجميع
          </span>
          <h1 className="text-3xl md:text-4xl font-black gold-gradient-text mb-4">الأدوات التفاعلية الذكية</h1>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            أدوات مصممة خصيصاً للطلاب، المحاسبين، المهندسين، والشركات لحساب الفواتير والضرائب والمعدلات والوحدات بدقة وسرعة وبدون أي تسجيل أو رسوم.
          </p>
        </div>

        <div className="space-y-4">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="bg-rawnaq-navy border border-rawnaq-border rounded-2xl overflow-hidden transition-all duration-300 shadow-lg"
            >
              <button
                onClick={() => toggleSection(tool.id)}
                className="w-full flex items-center justify-between p-6 bg-rawnaq-navy hover:bg-rawnaq-surface transition-colors focus:outline-none min-h-[44px]"
                aria-expanded={openSection === tool.id}
                aria-controls={`sect-${tool.id}`}
              >
                <div className="flex items-center gap-4 text-right">
                  <span className="w-12 h-12 bg-rawnaq-dark rounded-xl flex items-center justify-center text-2xl border border-rawnaq-border shrink-0">
                    {tool.icon}
                  </span>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-white">{tool.title}</h2>
                    <p className="text-xs text-slate-400 hidden sm:block mt-1">{tool.desc}</p>
                  </div>
                </div>
                <span className="text-rawnaq-gold text-xl font-bold px-2">
                  {openSection === tool.id ? '▲' : '▼'}
                </span>
              </button>

              {openSection === tool.id && (
                <div id={`sect-${tool.id}`} className="p-6 border-t border-rawnaq-border/50 bg-rawnaq-surface/50 animate-fade-in-up">
                  {tool.component}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
