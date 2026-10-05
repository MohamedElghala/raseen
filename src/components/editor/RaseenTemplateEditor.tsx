'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import RaseenLogoLoader from '@/components/brand/RaseenLogoLoader';

type TemplateType = 'cv' | 'invoice' | 'social' | 'contract' | 'certificate' | 'pitch_deck' | 'quotation' | 'nda';
type ThemeColor = 'gold' | 'navy' | 'emerald' | 'violet' | 'ruby';

interface TemplateConfig {
  id: TemplateType;
  name: string;
  icon: string;
  category: string;
  description: string;
  canvaUrl: string;
}

const TEMPLATES: TemplateConfig[] = [
  {
    id: 'cv',
    name: 'سيرة ذاتية تنفيذية ATS',
    icon: '📄',
    category: 'المهنيين والطلاب',
    description: 'سيرة ذاتية متوافقة بنسبة 100% مع خوارزميات الفرز الآلي وتنسيق ثنائي اللغة.',
    canvaUrl: 'https://www.canva.com/search/templates?q=ats+resume+modern',
  },
  {
    id: 'invoice',
    name: 'فاتورة ضريبية وعرض سعر',
    icon: '🧾',
    category: 'الشركات والمحاسبين',
    description: 'فاتورة رسمية تشمل الرقم الضريبي، كود QR، وحساب تلقائي للضريبة والخصم.',
    canvaUrl: 'https://www.canva.com/search/templates?q=minimalist+invoice',
  },
  {
    id: 'social',
    name: 'منشور إعلاني لإنستجرام/لينكدإن',
    icon: '📱',
    category: 'التسويق والمحتوى',
    description: 'قالب مربع (1:1) بلمسة فاخرة لإطلاق المنتجات والعروض الترويجية الحصرية.',
    canvaUrl: 'https://www.canva.com/search/templates?q=luxury+business+instagram+post',
  },
  {
    id: 'contract',
    name: 'وثيقة اتفاقية وشراكة تجارية',
    icon: '📝',
    category: 'القانون والشركات',
    description: 'عقد موجز يشمل بنود الالتزام، السرية، التوقيعات والأختام الرسمية.',
    canvaUrl: 'https://www.canva.com/search/templates?q=business+agreement+document',
  },
  {
    id: 'certificate',
    name: 'شهادة إتمام واعتماد مهني',
    icon: '🎓',
    category: 'التعليم والتدريب',
    description: 'شهادة تقدير وإنجاز فاخرة بإطارات هندسية وختم ذهبي رقمي.',
    canvaUrl: 'https://www.canva.com/search/templates?q=elegant+certificate+achievement',
  },
  {
    id: 'pitch_deck',
    name: 'عرض المستثمرين (Pitch Deck)',
    icon: '🚀',
    category: 'الشركات والتمويل',
    description: 'شريحة تنفيذية متكاملة لعرض القيمة، حجم السوق، ونموذج العمل أمام المستثمرين.',
    canvaUrl: 'https://www.canva.com/search/templates?q=investor+pitch+deck+startup',
  },
  {
    id: 'quotation',
    name: 'عرض أسعار ونطاق العمل',
    icon: '📋',
    category: 'المبيعات والمشاريع',
    description: 'عرض سعر تجاري موثق يوضح مواصفات التسليم، الجدول الزمني، وشروط الدفعات.',
    canvaUrl: 'https://www.canva.com/search/templates?q=commercial+quotation+proposal',
  },
  {
    id: 'nda',
    name: 'اتفاقية سرية معلومات (NDA)',
    icon: '🔒',
    category: 'القانون وحماية الأفكار',
    description: 'صيغة قانونية ملزمة لحماية الأفكار والبيانات ونماذج التشغيل من التسريب.',
    canvaUrl: 'https://www.canva.com/search/templates?q=non+disclosure+agreement',
  },
];

const THEMES: Record<ThemeColor, { name: string; hex: string; bgLight: string; border: string; text: string; badge: string }> = {
  gold: {
    name: 'ذهب رَصين الملكي',
    hex: '#f5b731',
    bgLight: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-500',
    badge: 'bg-amber-500 text-slate-950',
  },
  navy: {
    name: 'الأزرق التنفيذي',
    hex: '#2563eb',
    bgLight: 'bg-blue-600/10',
    border: 'border-blue-500/30',
    text: 'text-blue-500',
    badge: 'bg-blue-600 text-white',
  },
  emerald: {
    name: 'الزمرد الاستثماري',
    hex: '#10b981',
    bgLight: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-500',
    badge: 'bg-emerald-600 text-white',
  },
  violet: {
    name: 'البنفسجي الإبداعي',
    hex: '#8b5cf6',
    bgLight: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-500',
    badge: 'bg-purple-600 text-white',
  },
  ruby: {
    name: 'العنابي الراقي',
    hex: '#e11d48',
    bgLight: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-500',
    badge: 'bg-rose-600 text-white',
  },
};

export default function RaseenTemplateEditor() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('cv');
  const [activeTheme, setActiveTheme] = useState<ThemeColor>('gold');
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'canva'>('content');
  const [isExporting, setIsExporting] = useState(false);
  const [previewMode, setPreviewMode] = useState<'paper' | 'dark'>('paper');
  const [showCanvaModal, setShowCanvaModal] = useState(false);

  // Editable Form Data
  const [formData, setFormData] = useState({
    // Common
    title: 'م. أحمد خالد الشناوي',
    subtitle: 'مهندس برمجيات أول ومستشار حلول سحابية',
    organization: 'مجموعة رَصين للتكنولوجيا والاستثمار',
    date: new Date().toISOString().split('T')[0],
    email: 'ahmed.khaled@example.com',
    phone: '+20 100 123 4567',
    address: 'القاهرة، مصر • الرياض، السعودية',
    summary: 'خبير تقني يمتلك أكثر من 8 سنوات من الخبرة في بناء المنظومات السحابية عالية التوفر، وتصميم البنى الرقمية القابلة للتوسع. شغوف بالتحول الرقمي وأتمتة سلاسل الإمداد وتطوير تجربة المستخدم العربية.',
    
    // Invoice specifics
    invoiceNumber: 'RSN-2026-089',
    clientName: 'شركة النخبة للاستشارات الرقمية',
    clientVat: '300987654300003',
    item1Name: 'تطوير منصة التجارة الرقمية ومنظومة المدفوعات',
    item1Qty: 1,
    item1Price: 12500,
    item2Name: 'تصميم البنية السحابية وتكامل بروتوكول الأمان SSL',
    item2Qty: 1,
    item2Price: 4500,
    vatRate: 14,

    // Social post specifics
    postHeadline: 'إطلاق الجيل الثاني من حلول الأعمال الذكية',
    postSubtext: 'وفّر ما يزيد عن 70% من وقت فريقك التشغيلي مع أدوات رَصين المصممة خصيصاً لبيئة الأعمال في الشرق الأوسط.',
    postCta: 'حمّل الحزمة المتكاملة اليوم بخصم 40%',
    
    // Certificate specifics
    certRecipient: 'المهندس / عمر عبد العزيز المحمدي',
    certCourse: 'الدبلوم التنفيذي المتقدم في إدارة المنتجات الرقمية والحوسبة السحابية',
    certIssuer: 'أكاديمية رَصين للتعليم التقني المستمر',
    certScore: 'امتياز مع مرتبة الشرف (98%)',

    // Pitch deck specifics
    deckProblem: 'صعوبة وصول رواد الأعمال والشركات في منطقة الشرق الأوسط إلى عقود وأدوات وشيتات محاسبية معتمدة ومجهزة باللغة العربية، مما يسبب إهدار مئات الساعات وملايين الجنيهات.',
    deckSolution: 'منصة "رَصين" كأول مستودع استثماري وتقني متكامل للأصول الرقمية والبرمجية المعتمدة مع التخصيص السحابي الفوري.',
    deckMarket: 'سوق الأصول الرقمية والحلول المؤسسية في منطقة MENA يتجاوز 4.2 مليار دولار سنوياً بمعدل نمو سنوي مركب 24%.',
    deckAsk: '500,000 دولار أمريكي مقابل حصة ملكية 12% لتسريع التوسع في السوق السعودي والإماراتي.',

    // Quotation specifics
    quoteValidity: '15 يوماً من تاريخ الإصدار',
    quoteTerms: '50% دفعة مقدمة عند التعاقد، و 50% عند التسليم النهائي واجتياز الفحص الفني.',

    // NDA specifics
    ndaTerm: 'سنتان من تاريخ التوقيع على الاتفاقية',
    ndaScope: 'تشمل كافة الأكواد المصدرية، الدراسات المالية، خوارزميات الذكاء الاصطناعي، وبيانات العملاء والموردين.',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      window.print();
    }, 900);
  };

  const currentTheme = THEMES[activeTheme];

  // Invoice calculations
  const subtotal = formData.item1Qty * formData.item1Price + formData.item2Qty * formData.item2Price;
  const vatAmount = (subtotal * formData.vatRate) / 100;
  const grandTotal = subtotal + vatAmount;

  return (
    <div className="min-h-screen bg-rawnaq-dark text-slate-100 py-6 md:py-10">
      {/* Top Header & Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rawnaq-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <Link href="/" className="hover:text-rawnaq-gold transition-colors">الرئيسية</Link>
              <span>/</span>
              <span className="text-rawnaq-gold font-bold">محرر القوالب الذكي (Canva Studio)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
              <span className="p-2 rounded-xl bg-gradient-to-br from-rawnaq-gold/20 to-amber-500/10 border border-rawnaq-gold/40 text-rawnaq-gold">
                🎨
              </span>
              <span>استوديو رَصين لتخصيص القوالب</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                متوافق مع Canva & A4 Print
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              خصّص سيرتك الذاتية، فواتيرك، عقودك، ومنشوراتك التسويقية مباشرة في المتصفح وصدّرها فوراً أو افتحها في حسابك على Canva.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowCanvaModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-cyan-400/40 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60 hover:border-cyan-300 font-bold text-sm transition-all shadow-lg shadow-cyan-950/50"
            >
              <span>فتح وتعديل في Canva</span>
              <span className="text-xs bg-cyan-400 text-slate-950 px-1.5 py-0.5 rounded font-black">PRO</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="btn-gold flex items-center gap-2 text-sm shadow-xl shadow-rawnaq-gold/20 hover:scale-105 active:scale-95 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span>تصدير فوري (PDF / طباعة)</span>
            </button>
          </div>
        </div>

        {/* Template Quick Selector Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 mt-6">
          {TEMPLATES.map((tmpl) => {
            const isSelected = selectedTemplate === tmpl.id;
            return (
              <button
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl.id)}
                className={`p-3.5 rounded-xl text-right transition-all flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-rawnaq-surface border-rawnaq-gold ring-1 ring-rawnaq-gold shadow-lg shadow-rawnaq-gold/10'
                    : 'bg-rawnaq-dark/60 border-rawnaq-border/80 hover:border-slate-600 hover:bg-rawnaq-surface/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{tmpl.icon}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-rawnaq-gold animate-pulse" />
                  )}
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${isSelected ? 'text-rawnaq-gold' : 'text-slate-200'}`}>
                    {tmpl.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {tmpl.category}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace: Left = Live Canvas, Right = Editor Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================= */}
          {/* Controls Panel (5 Columns on Desktop) */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 bg-rawnaq-surface border border-rawnaq-border rounded-2xl p-5 md:p-6 shadow-xl space-y-6">
            
            {/* Control Tabs */}
            <div className="flex rounded-xl bg-rawnaq-dark/80 p-1 border border-rawnaq-border">
              <button
                onClick={() => setActiveTab('content')}
                className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${
                  activeTab === 'content'
                    ? 'bg-rawnaq-gold text-rawnaq-dark shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ✏️ تخصيص المحتوى
              </button>
              <button
                onClick={() => setActiveTab('style')}
                className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${
                  activeTab === 'style'
                    ? 'bg-rawnaq-gold text-rawnaq-dark shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🎨 الثيمات والألوان
              </button>
              <button
                onClick={() => setActiveTab('canva')}
                className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${
                  activeTab === 'canva'
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-cyan-400 hover:text-white'
                }`}
              >
                🚀 ربط Canva
              </button>
            </div>

            {/* TAB 1: Content Fields */}
            {activeTab === 'content' && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="border-b border-rawnaq-border/60 pb-3 mb-2 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <span>بيانات قالب:</span>
                    <span className="text-rawnaq-gold font-black">{TEMPLATES.find(t => t.id === selectedTemplate)?.name}</span>
                  </h3>
                  <button
                    onClick={() => {
                      if (confirm('هل ترغب بإعادة تعيين البيانات للقيم الافتراضية؟')) {
                        // Reset logic could go here
                      }
                    }}
                    className="text-xs text-slate-500 hover:text-slate-300"
                  >
                    استعادة الافتراضي
                  </button>
                </div>

                {/* Common Fields */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {selectedTemplate === 'invoice' ? 'اسم المنشأة / المورد' : selectedTemplate === 'certificate' ? 'اسم المستلم' : 'الاسم الكامل / العنوان الرئيسي'}
                  </label>
                  <input
                    type="text"
                    value={selectedTemplate === 'certificate' ? formData.certRecipient : formData.title}
                    onChange={(e) => handleInputChange(selectedTemplate === 'certificate' ? 'certRecipient' : 'title', e.target.value)}
                    className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rawnaq-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {selectedTemplate === 'invoice' ? 'البيان الوصفي للفاتورة' : selectedTemplate === 'certificate' ? 'مسمى الدورة أو الشهادة' : 'المسمى الوظيفي / النص التعريفي'}
                  </label>
                  <input
                    type="text"
                    value={selectedTemplate === 'certificate' ? formData.certCourse : formData.subtitle}
                    onChange={(e) => handleInputChange(selectedTemplate === 'certificate' ? 'certCourse' : 'subtitle', e.target.value)}
                    className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rawnaq-gold transition-colors"
                  />
                </div>

                {/* Specifics based on selected template */}
                {selectedTemplate === 'cv' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">البريد الإلكتروني</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">رقم الهاتف</label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">العنوان / المدينة</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">الملخص المهني (Executive Summary)</label>
                      <textarea
                        rows={4}
                        value={formData.summary}
                        onChange={(e) => handleInputChange('summary', e.target.value)}
                        className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl p-3 text-xs leading-relaxed text-white focus:outline-none focus:border-rawnaq-gold"
                      />
                    </div>
                  </>
                )}

                {selectedTemplate === 'invoice' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">رقم الفاتورة</label>
                        <input
                          type="text"
                          value={formData.invoiceNumber}
                          onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                          className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">الرقم الضريبي للعميل</label>
                        <input
                          type="text"
                          value={formData.clientVat}
                          onChange={(e) => handleInputChange('clientVat', e.target.value)}
                          className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">اسم العميل / المؤسسة</label>
                      <input
                        type="text"
                        value={formData.clientName}
                        onChange={(e) => handleInputChange('clientName', e.target.value)}
                        className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>

                    {/* Invoice Item 1 */}
                    <div className="p-3 rounded-xl bg-rawnaq-dark/60 border border-rawnaq-border/70 space-y-2">
                      <div className="text-xs font-bold text-rawnaq-gold">البند الأول</div>
                      <input
                        type="text"
                        placeholder="وصف الخدمة أو المنتج"
                        value={formData.item1Name}
                        onChange={(e) => handleInputChange('item1Name', e.target.value)}
                        className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400">السعر (ج.م)</label>
                          <input
                            type="number"
                            value={formData.item1Price}
                            onChange={(e) => handleInputChange('item1Price', Number(e.target.value))}
                            className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-lg px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400">الكمية</label>
                          <input
                            type="number"
                            value={formData.item1Qty}
                            onChange={(e) => handleInputChange('item1Qty', Number(e.target.value))}
                            className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-lg px-2 py-1 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Invoice Item 2 */}
                    <div className="p-3 rounded-xl bg-rawnaq-dark/60 border border-rawnaq-border/70 space-y-2">
                      <div className="text-xs font-bold text-rawnaq-gold">البند الثاني</div>
                      <input
                        type="text"
                        placeholder="وصف الخدمة أو المنتج"
                        value={formData.item2Name}
                        onChange={(e) => handleInputChange('item2Name', e.target.value)}
                        className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400">السعر (ج.م)</label>
                          <input
                            type="number"
                            value={formData.item2Price}
                            onChange={(e) => handleInputChange('item2Price', Number(e.target.value))}
                            className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-lg px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400">الكمية</label>
                          <input
                            type="number"
                            value={formData.item2Qty}
                            onChange={(e) => handleInputChange('item2Qty', Number(e.target.value))}
                            className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-lg px-2 py-1 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {selectedTemplate === 'social' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">عنوان المنشور الرئيسي</label>
                      <input
                        type="text"
                        value={formData.postHeadline}
                        onChange={(e) => handleInputChange('postHeadline', e.target.value)}
                        className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">نص المنشور / القيمة المضافة</label>
                      <textarea
                        rows={3}
                        value={formData.postSubtext}
                        onChange={(e) => handleInputChange('postSubtext', e.target.value)}
                        className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl p-3 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">دعوة لاتخاذ إجراء (Call to Action)</label>
                      <input
                        type="text"
                        value={formData.postCta}
                        onChange={(e) => handleInputChange('postCta', e.target.value)}
                        className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                  </>
                )}

                {selectedTemplate === 'contract' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">الطرف الأول (المقدم)</label>
                        <input
                          type="text"
                          value={formData.organization}
                          onChange={(e) => handleInputChange('organization', e.target.value)}
                          className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">الطرف الثاني (المستفيد)</label>
                        <input
                          type="text"
                          value={formData.clientName}
                          onChange={(e) => handleInputChange('clientName', e.target.value)}
                          className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">موضوع الاتفاقية والنطاق</label>
                      <textarea
                        rows={3}
                        value={formData.summary}
                        onChange={(e) => handleInputChange('summary', e.target.value)}
                        className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl p-3 text-xs text-white"
                      />
                    </div>
                  </>
                )}

                {selectedTemplate === 'certificate' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">الجهة المانحة للشهادة</label>
                      <input
                        type="text"
                        value={formData.certIssuer}
                        onChange={(e) => handleInputChange('certIssuer', e.target.value)}
                        className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">التقدير أو النتيجة</label>
                      <input
                        type="text"
                        value={formData.certScore}
                        onChange={(e) => handleInputChange('certScore', e.target.value)}
                        className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                  </>
                )}

                {selectedTemplate === 'pitch_deck' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">المشكلة والتحدي السوقي (Problem)</label>
                      <textarea
                        rows={3}
                        value={formData.deckProblem}
                        onChange={(e) => handleInputChange('deckProblem', e.target.value)}
                        className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl p-3 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">الحل المقترح وميزة المشروع (Solution)</label>
                      <textarea
                        rows={3}
                        value={formData.deckSolution}
                        onChange={(e) => handleInputChange('deckSolution', e.target.value)}
                        className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl p-3 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">حجم السوق وفرصة النمو (Market Size)</label>
                      <input
                        type="text"
                        value={formData.deckMarket}
                        onChange={(e) => handleInputChange('deckMarket', e.target.value)}
                        className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3.5 py-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">طلب التمويل والحصة (Investment Ask)</label>
                      <input
                        type="text"
                        value={formData.deckAsk}
                        onChange={(e) => handleInputChange('deckAsk', e.target.value)}
                        className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3.5 py-2.5 text-xs text-white"
                      />
                    </div>
                  </>
                )}

                {selectedTemplate === 'quotation' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">اسم العميل / الشركة</label>
                        <input
                          type="text"
                          value={formData.clientName}
                          onChange={(e) => handleInputChange('clientName', e.target.value)}
                          className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">مدة صلاحية العرض</label>
                        <input
                          type="text"
                          value={formData.quoteValidity}
                          onChange={(e) => handleInputChange('quoteValidity', e.target.value)}
                          className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">شروط الدفع والتسليم</label>
                      <textarea
                        rows={2}
                        value={formData.quoteTerms}
                        onChange={(e) => handleInputChange('quoteTerms', e.target.value)}
                        className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl p-3 text-xs text-white"
                      />
                    </div>
                  </>
                )}

                {selectedTemplate === 'nda' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">الطرف المفصح</label>
                        <input
                          type="text"
                          value={formData.organization}
                          onChange={(e) => handleInputChange('organization', e.target.value)}
                          className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">الطرف المتلقي للسر</label>
                        <input
                          type="text"
                          value={formData.clientName}
                          onChange={(e) => handleInputChange('clientName', e.target.value)}
                          className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">مدة سريان الالتزام بالسرية</label>
                      <input
                        type="text"
                        value={formData.ndaTerm}
                        onChange={(e) => handleInputChange('ndaTerm', e.target.value)}
                        className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">نطاق المعلومات المحمية</label>
                      <textarea
                        rows={3}
                        value={formData.ndaScope}
                        onChange={(e) => handleInputChange('ndaScope', e.target.value)}
                        className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl p-3 text-xs text-white"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TAB 2: Style & Palettes */}
            {activeTab === 'style' && (
              <div className="space-y-6 animate-fade-in-up">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-3">
                    🎨 لوحة الألوان المعتمدة (Color Palettes)
                  </label>
                  <div className="space-y-2.5">
                    {(Object.keys(THEMES) as ThemeColor[]).map((key) => {
                      const t = THEMES[key];
                      const isSelected = activeTheme === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setActiveTheme(key)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-rawnaq-dark border-rawnaq-gold ring-1 ring-rawnaq-gold'
                              : 'bg-rawnaq-dark/40 border-rawnaq-border/70 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="w-6 h-6 rounded-lg shadow-md border border-white/20"
                              style={{ backgroundColor: t.hex }}
                            />
                            <span className="font-bold text-sm text-white">{t.name}</span>
                          </div>
                          {isSelected ? (
                            <span className="text-xs px-2 py-0.5 rounded bg-rawnaq-gold/20 text-rawnaq-gold font-bold">
                              نشط
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500 font-mono">{t.hex}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Preview Paper Mode */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-2">
                    نمط عرض المعاينة (Canvas Mode)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPreviewMode('paper')}
                      className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                        previewMode === 'paper'
                          ? 'bg-white text-slate-900 border-white'
                          : 'bg-rawnaq-dark text-slate-400 border-rawnaq-border'
                      }`}
                    >
                      📄 ورقة بيضاء (A4 Print Ready)
                    </button>
                    <button
                      onClick={() => setPreviewMode('dark')}
                      className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                        previewMode === 'dark'
                          ? 'bg-slate-900 text-rawnaq-gold border-rawnaq-gold'
                          : 'bg-rawnaq-dark text-slate-400 border-rawnaq-border'
                      }`}
                    >
                      🌙 النمط الليلي الفاخر
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Canva Direct Integration */}
            {activeTab === 'canva' && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-500/40 text-cyan-200">
                  <div className="flex items-center gap-2 mb-2 font-black text-white text-base">
                    <span>⚡</span>
                    <span>التكامل المباشر مع استوديو Canva</span>
                  </div>
                  <p className="text-xs text-cyan-100/80 leading-relaxed mb-4">
                    جميع قوالب رَصين مصممة بأبعاد وتنسيقات متوافقة بنسبة 100% مع حسابك على Canva (Free & Pro). يمكنك فتح القالب كنسخة مخصصة في حسابك فوراً بضغطة زر واحدة.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>تعديل العناصر بحرية على السحابة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>تصدير بدقة 300 DPI و CMYK للطباعة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>مشاركة فريق العمل والعرض المباشر</span>
                    </div>
                  </div>
                </div>

                <a
                  href={TEMPLATES.find(t => t.id === selectedTemplate)?.canvaUrl || 'https://www.canva.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
                >
                  <span>فتح القالب الحالي في Canva الآن ➔</span>
                </a>
              </div>
            )}

            {/* Bottom Actions Summary */}
            <div className="pt-4 border-t border-rawnaq-border/70 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                المستند مُهيأ ومحمي بختم رَصين الرقمي
              </span>
              <button
                onClick={handleExportPDF}
                className="text-xs font-bold text-rawnaq-gold hover:underline flex items-center gap-1"
              >
                <span>طباعة / حفظ PDF</span>
                <span>🖨️</span>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* Live Preview Canvas (7 Columns on Desktop) */}
          {/* ========================================================= */}
          <div className="lg:col-span-7">
            <div className="sticky top-24">
              
              {/* Canvas Header Bar */}
              <div className="bg-rawnaq-surface border border-rawnaq-border rounded-t-2xl p-3 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/70 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/70 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-500/70 inline-block" />
                  <span className="font-mono text-slate-300 ml-2">Live_A4_Canvas.preview</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] bg-rawnaq-dark px-2 py-0.5 rounded border border-rawnaq-border">
                    {previewMode === 'paper' ? 'A4 Paper (Print)' : 'Dark Hologram'}
                  </span>
                  <button
                    onClick={handleExportPDF}
                    className="text-rawnaq-gold hover:text-white font-bold"
                  >
                    تصدير ➔
                  </button>
                </div>
              </div>

              {/* Rendered Live Canvas */}
              <div
                id="printable-template-canvas"
                className={`border-x border-b border-rawnaq-border rounded-b-2xl p-6 sm:p-10 shadow-2xl transition-colors duration-300 min-h-[640px] flex flex-col justify-between ${
                  previewMode === 'paper'
                    ? 'bg-white text-slate-900'
                    : 'bg-[#0b1329] text-slate-100'
                }`}
                style={{
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                
                {/* ------------------------------------------------------------------ */}
                {/* 1. CV TEMPLATE PREVIEW */}
                {/* ------------------------------------------------------------------ */}
                {selectedTemplate === 'cv' && (
                  <div className="space-y-6">
                    {/* Header Strip */}
                    <div
                      className="p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                      style={{
                        backgroundColor: previewMode === 'paper' ? '#f8fafc' : '#0f1a33',
                        borderLeft: `6px solid ${currentTheme.hex}`,
                      }}
                    >
                      <div>
                        <h2 className="text-2xl font-black tracking-tight" style={{ color: currentTheme.hex }}>
                          {formData.title}
                        </h2>
                        <p className="text-sm font-bold opacity-80 mt-1">
                          {formData.subtitle}
                        </p>
                      </div>
                      <div className="text-xs opacity-70 space-y-1 text-left font-mono">
                        <div>{formData.email}</div>
                        <div>{formData.phone}</div>
                        <div>{formData.address}</div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider mb-2 pb-1 border-b" style={{ borderColor: currentTheme.hex, color: currentTheme.hex }}>
                        الملخص المهني • Summary
                      </h3>
                      <p className="text-xs leading-relaxed opacity-85 text-justify">
                        {formData.summary}
                      </p>
                    </div>

                    {/* Experience Blocks */}
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider mb-3 pb-1 border-b" style={{ borderColor: currentTheme.hex, color: currentTheme.hex }}>
                        الخبرات المهنية • Work Experience
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span>مهندس حلول رئيسي (Principal Architect)</span>
                            <span className="font-mono opacity-60">2022 — حتى الآن</span>
                          </div>
                          <div className="text-[11px] opacity-70 mb-1">شركة أوراسكوم القابضة للاتصالات</div>
                          <ul className="list-disc list-inside text-[11px] opacity-80 space-y-0.5">
                            <li>قيادة فريق تقني من 14 مهندساً لإعادة هيكلة البنية السحابية بنسبة توافر 99.99%.</li>
                            <li>أتمتة خطوط النشر CI/CD وتخفيض زمن الاستجابة بنسبة 45%.</li>
                          </ul>
                        </div>

                        <div>
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span>مطور سحابي أول (Senior Cloud Engineer)</span>
                            <span className="font-mono opacity-60">2019 — 2022</span>
                          </div>
                          <div className="text-[11px] opacity-70 mb-1">مجموعة الاتصالات والتحول الرقمي - الرياض</div>
                          <ul className="list-disc list-inside text-[11px] opacity-80 space-y-0.5">
                            <li>بناء واجهات API معقدة لمعالجة أكثر من 2 مليون طلب يومي.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Education & Skills */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-wider mb-2 pb-1 border-b" style={{ borderColor: currentTheme.hex, color: currentTheme.hex }}>
                          التعليم والشهادات
                        </h3>
                        <div className="text-[11px] font-bold">بكالوريوس هندسة الحاسبات والنظم</div>
                        <div className="text-[10px] opacity-70">جامعة القاهرة • مرتبة الشرف الأولى</div>
                      </div>
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-wider mb-2 pb-1 border-b" style={{ borderColor: currentTheme.hex, color: currentTheme.hex }}>
                          المهارات التقنية
                        </h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {['Cloud AWS', 'Next.js', 'PostgreSQL', 'Docker', 'System Design'].map((s) => (
                            <span
                              key={s}
                              className="text-[10px] px-2 py-0.5 rounded font-mono"
                              style={{
                                backgroundColor: previewMode === 'paper' ? '#e2e8f0' : '#1e293b',
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------------ */}
                {/* 2. INVOICE TEMPLATE PREVIEW */}
                {/* ------------------------------------------------------------------ */}
                {selectedTemplate === 'invoice' && (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b pb-5" style={{ borderColor: previewMode === 'paper' ? '#e2e8f0' : '#1e293b' }}>
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden p-1 bg-white/5 border" style={{ borderColor: currentTheme.hex }}>
                          <Image src="/brand/logo_transparent.png" alt="رَصين" fill className="object-contain" />
                        </div>
                        <div>
                          <h2 className="text-xl font-black" style={{ color: currentTheme.hex }}>
                            {formData.title}
                          </h2>
                          <p className="text-xs opacity-70">{formData.subtitle}</p>
                        </div>
                      </div>

                      <div className="text-left font-mono">
                        <span className="text-xs px-2.5 py-1 rounded font-black uppercase tracking-wider" style={{ backgroundColor: currentTheme.hex, color: '#0f172a' }}>
                          فاتورة ضريبية رسمية
                        </span>
                        <div className="text-xs font-bold mt-2">رقم: {formData.invoiceNumber}</div>
                        <div className="text-[11px] opacity-70">التاريخ: {formData.date}</div>
                      </div>
                    </div>

                    {/* Parties */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="p-3 rounded-xl bg-slate-500/5">
                        <div className="font-bold opacity-60 mb-1">العميل المستفيد:</div>
                        <div className="font-black text-sm">{formData.clientName}</div>
                        <div className="font-mono text-[11px] opacity-70 mt-1">الرقم الضريبي: {formData.clientVat}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-500/5 text-left">
                        <div className="font-bold opacity-60 mb-1">طريقة السداد:</div>
                        <div className="font-bold">تحويل بنكي / إنستاباي InstaPay</div>
                        <div className="text-[11px] opacity-70 mt-1">الاستحقاق: عند الاستلام الفوري</div>
                      </div>
                    </div>

                    {/* Table */}
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b" style={{ borderColor: currentTheme.hex }}>
                          <th className="py-2">البند / وصف الخدمة</th>
                          <th className="py-2 text-center">الكمية</th>
                          <th className="py-2 text-left">السعر (ج.م)</th>
                          <th className="py-2 text-left">الإجمالي</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-500/10">
                        <tr>
                          <td className="py-3 font-medium">{formData.item1Name}</td>
                          <td className="py-3 text-center font-mono">{formData.item1Qty}</td>
                          <td className="py-3 text-left font-mono">{formData.item1Price.toLocaleString()}</td>
                          <td className="py-3 text-left font-mono font-bold">{(formData.item1Qty * formData.item1Price).toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-medium">{formData.item2Name}</td>
                          <td className="py-3 text-center font-mono">{formData.item2Qty}</td>
                          <td className="py-3 text-left font-mono">{formData.item2Price.toLocaleString()}</td>
                          <td className="py-3 text-left font-mono font-bold">{(formData.item2Qty * formData.item2Price).toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Totals */}
                    <div className="flex justify-end pt-3">
                      <div className="w-64 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="opacity-70">المجموع الفرعي:</span>
                          <span className="font-mono font-bold">{subtotal.toLocaleString()} ج.م</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-70">ضريبة القيمة المضافة ({formData.vatRate}%):</span>
                          <span className="font-mono font-bold">{vatAmount.toLocaleString()} ج.م</span>
                        </div>
                        <div
                          className="flex justify-between p-2.5 rounded-xl font-black text-sm border-t"
                          style={{
                            backgroundColor: previewMode === 'paper' ? '#f1f5f9' : '#1e293b',
                            color: currentTheme.hex,
                          }}
                        >
                          <span>الإجمالي النهائي المستحق:</span>
                          <span className="font-mono">{grandTotal.toLocaleString()} ج.م</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------------ */}
                {/* 3. SOCIAL POST PREVIEW */}
                {/* ------------------------------------------------------------------ */}
                {selectedTemplate === 'social' && (
                  <div
                    className="aspect-square w-full max-w-md mx-auto rounded-3xl p-8 flex flex-col justify-between text-center relative overflow-hidden shadow-2xl"
                    style={{
                      backgroundColor: previewMode === 'paper' ? '#0f172a' : '#060d1a',
                      color: '#ffffff',
                      border: `2px solid ${currentTheme.hex}`,
                    }}
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: currentTheme.hex }} />
                    
                    {/* Top Brand Bar */}
                    <div className="flex items-center justify-between z-10">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black tracking-wider" style={{ color: currentTheme.hex }}>رَصِيـن</span>
                        <span className="text-[10px] text-slate-400 font-mono">| RASEEN</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/20 bg-white/5 font-mono">
                        NEW RELEASE 2026
                      </span>
                    </div>

                    {/* Center Content */}
                    <div className="my-auto z-10 py-6 space-y-4">
                      <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                        {formData.postHeadline}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto leading-relaxed">
                        {formData.postSubtext}
                      </p>
                    </div>

                    {/* CTA Box */}
                    <div className="z-10">
                      <div
                        className="py-3 px-6 rounded-2xl font-black text-xs sm:text-sm shadow-xl transition-all"
                        style={{
                          backgroundColor: currentTheme.hex,
                          color: '#0f172a',
                        }}
                      >
                        {formData.postCta} ➔
                      </div>
                      <div className="text-[10px] text-slate-400 mt-2 font-mono">
                        www.raseen.net • استوديو الأعمال الذكي
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------------ */}
                {/* 4. CONTRACT TEMPLATE PREVIEW */}
                {/* ------------------------------------------------------------------ */}
                {selectedTemplate === 'contract' && (
                  <div className="space-y-6">
                    <div className="text-center border-b pb-4" style={{ borderColor: currentTheme.hex }}>
                      <span className="text-[11px] font-mono uppercase tracking-widest opacity-60">LEGAL COMMERCIAL AGREEMENT</span>
                      <h2 className="text-xl font-black mt-1" style={{ color: currentTheme.hex }}>
                        وثيقة اتفاقية وشراكة تجارية ملزمة
                      </h2>
                      <p className="text-xs opacity-70 mt-1">تاريخ السريان: {formData.date}</p>
                    </div>

                    <div className="text-xs leading-relaxed space-y-3 opacity-90 text-justify">
                      <p>
                        إنه في يوم <strong>{new Date().toLocaleDateString('ar-EG', { weekday: 'long' })}</strong> الموافق <strong>{formData.date}</strong>، تم الاتفاق والتراضي بين كل من:
                      </p>
                      <div className="p-3 rounded-xl bg-slate-500/5 space-y-1">
                        <div><strong>الطرف الأول:</strong> {formData.organization} (مقدم الأصول والحلول الرقمية)</div>
                        <div><strong>الطرف الثاني:</strong> {formData.clientName} (الشريك / المستفيد)</div>
                      </div>
                      <p>
                        <strong>البند الأول (الهدف والنطاق):</strong> اتفق الطرفان على التعاون المشترك وفق النطاق التالي: {formData.summary}
                      </p>
                      <p>
                        <strong>البند الثاني (السرية وعدم الإفصاح):</strong> يتعهد كل طرف بعدم إفشاء أي أسرار تقنية أو مالية أو نماذج تشغيلية خاصة بالطرف الآخر لأي جهة ثالثة تحت أي ظرف.
                      </p>
                      <p>
                        <strong>البند الثالث (القانون الواجب التطبيق):</strong> يخضع هذا الاتفاق ويفسر وفقاً للقوانين واللوائح المعمول بها في جمهورية مصر العربية ودول مجلس التعاون الخليجي.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-6 border-t" style={{ borderColor: previewMode === 'paper' ? '#e2e8f0' : '#1e293b' }}>
                      <div className="text-center space-y-6 text-xs">
                        <span className="font-bold">توقيع وخاتم الطرف الأول</span>
                        <div className="h-12 border-b border-dashed border-slate-400 w-32 mx-auto" />
                        <div className="text-[10px] opacity-60">رَصين للاستشارات والتقنية</div>
                      </div>
                      <div className="text-center space-y-6 text-xs">
                        <span className="font-bold">توقيع وخاتم الطرف الثاني</span>
                        <div className="h-12 border-b border-dashed border-slate-400 w-32 mx-auto" />
                        <div className="text-[10px] opacity-60">{formData.clientName}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------------ */}
                {/* 5. CERTIFICATE TEMPLATE PREVIEW */}
                {/* ------------------------------------------------------------------ */}
                {selectedTemplate === 'certificate' && (
                  <div
                    className="p-8 rounded-3xl border-4 text-center space-y-6 relative overflow-hidden"
                    style={{
                      borderColor: currentTheme.hex,
                      backgroundColor: previewMode === 'paper' ? '#ffffff' : '#0b1329',
                    }}
                  >
                    <div className="flex justify-center mb-2">
                      <div className="relative w-16 h-16 p-2 rounded-2xl bg-white/5 border shadow-xl" style={{ borderColor: currentTheme.hex }}>
                        <Image src="/brand/logo_transparent.png" alt="رَصين" fill className="object-contain" />
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-mono tracking-widest uppercase opacity-70">
                        CERTIFICATE OF ACHIEVEMENT & EXCELLENCE
                      </div>
                      <h2 className="text-2xl font-black mt-2" style={{ color: currentTheme.hex }}>
                        شهادة إتمام واعتماد مهني
                      </h2>
                    </div>

                    <p className="text-xs opacity-75">تشهد إدارة {formData.certIssuer} بأن</p>

                    <div className="text-2xl font-black py-2 border-b-2 border-dashed max-w-sm mx-auto" style={{ borderColor: currentTheme.hex }}>
                      {formData.certRecipient}
                    </div>

                    <p className="text-xs leading-relaxed max-w-md mx-auto opacity-80">
                      قد أتم بنجاح متطلبات واختبارات:
                      <br />
                      <strong className="text-sm font-bold block mt-1" style={{ color: currentTheme.hex }}>
                        {formData.certCourse}
                      </strong>
                    </p>

                    <div className="flex items-center justify-center gap-6 pt-4 text-xs font-mono">
                      <div>النتيجة: <strong>{formData.certScore}</strong></div>
                      <span>•</span>
                      <div>تاريخ الإصدار: <strong>{formData.date}</strong></div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------------ */}
                {/* 6. PITCH DECK EXECUTIVE SUMMARY PREVIEW */}
                {/* ------------------------------------------------------------------ */}
                {selectedTemplate === 'pitch_deck' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b gap-3" style={{ borderColor: currentTheme.hex }}>
                      <div>
                        <span className="text-[10px] font-mono tracking-widest uppercase opacity-70">EXECUTIVE PITCH DECK</span>
                        <h2 className="text-xl sm:text-2xl font-black mt-1" style={{ color: currentTheme.hex }}>
                          {formData.title} — ملخص جولة التمويل
                        </h2>
                      </div>
                      <div className="p-2.5 rounded-xl text-center border" style={{ borderColor: currentTheme.hex, backgroundColor: previewMode === 'paper' ? '#f8fafc' : '#0f1a33' }}>
                        <div className="text-[10px] opacity-70">مبلغ التمويل المطلوب</div>
                        <div className="text-sm font-black font-mono" style={{ color: currentTheme.hex }}>{formData.deckAsk}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl border" style={{ borderColor: previewMode === 'paper' ? '#e2e8f0' : '#1e293b', backgroundColor: previewMode === 'paper' ? '#f8fafc' : '#0f1a33' }}>
                        <div className="flex items-center gap-2 mb-2 font-bold text-sm text-red-500">
                          <span>⚠️</span>
                          <span>التحدي والمشكلة (Problem)</span>
                        </div>
                        <p className="text-xs leading-relaxed opacity-90">{formData.deckProblem}</p>
                      </div>

                      <div className="p-4 rounded-2xl border" style={{ borderColor: currentTheme.hex, backgroundColor: previewMode === 'paper' ? '#f0fdf4' : '#062016' }}>
                        <div className="flex items-center gap-2 mb-2 font-bold text-sm text-emerald-500">
                          <span>💡</span>
                          <span>الحل التكنولوجي (Solution)</span>
                        </div>
                        <p className="text-xs leading-relaxed opacity-90">{formData.deckSolution}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border" style={{ borderColor: previewMode === 'paper' ? '#e2e8f0' : '#1e293b' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold">فرصة السوق والنمو (Market Opportunity)</span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">TAM & CAGR +24%</span>
                      </div>
                      <p className="text-xs leading-relaxed opacity-85">{formData.deckMarket}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t text-xs font-mono" style={{ borderColor: previewMode === 'paper' ? '#e2e8f0' : '#1e293b' }}>
                      <div>المقر الرئيسي: <strong>{formData.address}</strong></div>
                      <div>التواصل: <strong>{formData.email}</strong></div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------------ */}
                {/* 7. COMMERCIAL QUOTATION PREVIEW */}
                {/* ------------------------------------------------------------------ */}
                {selectedTemplate === 'quotation' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b gap-4" style={{ borderColor: currentTheme.hex }}>
                      <div>
                        <span className="text-[10px] font-mono tracking-widest uppercase opacity-70">OFFICIAL COMMERCIAL QUOTATION</span>
                        <h2 className="text-xl sm:text-2xl font-black mt-1" style={{ color: currentTheme.hex }}>
                          عرض أسعار رسمي ونطاق عمل
                        </h2>
                        <p className="text-xs opacity-70 mt-1">تاريخ الإصدار: {formData.date}</p>
                      </div>
                      <div className="text-left sm:text-right text-xs space-y-1">
                        <div>صلاحية العرض: <strong className="text-amber-500">{formData.quoteValidity}</strong></div>
                        <div>العميل الموجه له: <strong>{formData.clientName}</strong></div>
                      </div>
                    </div>

                    {/* Scope Items */}
                    <div className="p-4 rounded-2xl border space-y-3" style={{ borderColor: previewMode === 'paper' ? '#e2e8f0' : '#1e293b' }}>
                      <div className="text-xs font-bold" style={{ color: currentTheme.hex }}>نطاق الخدمات والبنود المسعرة:</div>
                      <div className="flex items-center justify-between text-xs py-2 border-b" style={{ borderColor: previewMode === 'paper' ? '#f1f5f9' : '#1e293b' }}>
                        <span>1. {formData.item1Name}</span>
                        <span className="font-mono font-bold">{(formData.item1Qty * formData.item1Price).toLocaleString()} ج.م</span>
                      </div>
                      <div className="flex items-center justify-between text-xs py-2 border-b" style={{ borderColor: previewMode === 'paper' ? '#f1f5f9' : '#1e293b' }}>
                        <span>2. {formData.item2Name}</span>
                        <span className="font-mono font-bold">{(formData.item2Qty * formData.item2Price).toLocaleString()} ج.م</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 font-bold text-sm">
                        <span>إجمالي القيمة المقترحة:</span>
                        <span className="font-mono text-base" style={{ color: currentTheme.hex }}>{grandTotal.toLocaleString()} ج.م</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-500/5 text-xs space-y-1">
                      <div className="font-bold">شروط الدفع والتسليم:</div>
                      <p className="opacity-80">{formData.quoteTerms}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-4 border-t text-xs" style={{ borderColor: previewMode === 'paper' ? '#e2e8f0' : '#1e293b' }}>
                      <div className="text-center space-y-4">
                        <span className="font-bold">اعتماد رَصين للحلول الرقمية</span>
                        <div className="h-10 border-b border-dashed border-slate-400 w-32 mx-auto" />
                      </div>
                      <div className="text-center space-y-4">
                        <span className="font-bold">موافقة وتوقيع العميل</span>
                        <div className="h-10 border-b border-dashed border-slate-400 w-32 mx-auto" />
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------------ */}
                {/* 8. MUTUAL NDA PREVIEW */}
                {/* ------------------------------------------------------------------ */}
                {selectedTemplate === 'nda' && (
                  <div className="space-y-6">
                    <div className="text-center border-b pb-4" style={{ borderColor: currentTheme.hex }}>
                      <span className="text-[10px] font-mono tracking-widest uppercase opacity-70">MUTUAL NON-DISCLOSURE AGREEMENT</span>
                      <h2 className="text-xl sm:text-2xl font-black mt-1" style={{ color: currentTheme.hex }}>
                        اتفاقية عدم إفصاح وحماية سرية المعلومات
                      </h2>
                      <p className="text-xs opacity-70 mt-1">تاريخ الاتفاق: {formData.date}</p>
                    </div>

                    <div className="text-xs leading-relaxed space-y-3 opacity-90 text-justify">
                      <p>
                        أبرمت هذه الاتفاقية بين كل من: <strong>الطرف المفصح: {formData.organization}</strong>، و <strong>الطرف المتلقي: {formData.clientName}</strong>.
                      </p>
                      <div className="p-3.5 rounded-xl bg-slate-500/5 space-y-1.5 border" style={{ borderColor: previewMode === 'paper' ? '#e2e8f0' : '#1e293b' }}>
                        <div><strong>1. نطاق السرية:</strong> {formData.ndaScope}</div>
                        <div><strong>2. مدة السريان:</strong> {formData.ndaTerm}</div>
                      </div>
                      <p>
                        <strong>3. التزامات الطرف المتلقي:</strong> يلتزم الطرف المتلقي باتخاذ أعلى درجات الحيطة والعناية للحفاظ على سرية المعلومات وعدم نسخها أو إفشائها دون إذن كتابي مسبق.
                      </p>
                      <p>
                        <strong>4. الاختصاص القضائي:</strong> تختص المحاكم التجارية المختصة بنظر أي نزاع قد ينشأ عن تفسير أو خرق هذه الاتفاقية مع أحقية المطالبة بالتعويض الكامل.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-6 border-t" style={{ borderColor: previewMode === 'paper' ? '#e2e8f0' : '#1e293b' }}>
                      <div className="text-center space-y-4 text-xs">
                        <span className="font-bold">توقيع الطرف المفصح</span>
                        <div className="h-10 border-b border-dashed border-slate-400 w-32 mx-auto" />
                        <div className="text-[10px] opacity-60">{formData.organization}</div>
                      </div>
                      <div className="text-center space-y-4 text-xs">
                        <span className="font-bold">توقيع الطرف المتلقي</span>
                        <div className="h-10 border-b border-dashed border-slate-400 w-32 mx-auto" />
                        <div className="text-[10px] opacity-60">{formData.clientName}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Stamp on Paper */}
                <div className="mt-8 pt-4 border-t flex items-center justify-between text-[10px] opacity-50 font-mono" style={{ borderColor: previewMode === 'paper' ? '#e2e8f0' : '#1e293b' }}>
                  <span>Verified by Raseen Digital Engine • ID: RSN-{selectedTemplate.toUpperCase()}-2026</span>
                  <span>www.raseen.net</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exporting Modal with Animated Raseen Loader */}
      {isExporting && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center animate-fade-in-up">
          <div className="bg-rawnaq-surface border border-rawnaq-gold/40 p-8 rounded-3xl max-w-md w-full shadow-2xl">
            <RaseenLogoLoader
              label="جاري تجميع المستند وتنسيق الطباعة..."
              sublabel="يتم تجهيز مخرجات عالية الدقة A4 بدعم الألوان وخط القاهرة المعتمد"
              size="lg"
            />
          </div>
        </div>
      )}

      {/* Canva Modal */}
      {showCanvaModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in-up">
          <div className="bg-rawnaq-surface border border-cyan-400/40 p-6 md:p-8 rounded-3xl max-w-lg w-full shadow-2xl relative text-right">
            <button
              onClick={() => setShowCanvaModal(false)}
              className="absolute top-5 left-5 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🎨</span>
              <div>
                <h3 className="text-lg font-black text-white">الفتح والتعديل في Canva</h3>
                <span className="text-xs text-cyan-400">Canva Direct Workspace Sync</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              سيتم نقلك الآن إلى منصة Canva مع إعدادات وتنسيقات القالب المختار (<strong>{TEMPLATES.find(t => t.id === selectedTemplate)?.name}</strong>). يمكنك حفظ النسخة فوراً في مجلداتك على كانفا واستخدام مكتبة صورك وخطوطك المفضلة.
            </p>

            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 mb-6 space-y-1">
              <div>📐 الأبعاد: <strong>A4 Portrait (210 × 297 mm)</strong> أو <strong>1080 × 1080 px</strong></div>
              <div>✨ التوافق: <strong>Canva Free & Canva Pro</strong></div>
            </div>

            <div className="flex gap-3">
              <a
                href={TEMPLATES.find(t => t.id === selectedTemplate)?.canvaUrl || 'https://www.canva.com'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowCanvaModal(false)}
                className="flex-1 py-3 text-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-sm shadow-lg hover:from-cyan-300 hover:to-blue-400 transition-all"
              >
                الانتقال إلى Canva ➔
              </a>
              <button
                onClick={() => setShowCanvaModal(false)}
                className="btn-outline text-xs px-4"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
