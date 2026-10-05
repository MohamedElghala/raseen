'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProductItem } from '@/lib/types';

interface ContractInspectorProps {
  product: ProductItem;
}

export default function ContractInspector({ product }: ContractInspectorProps) {
  const [selectedClause, setSelectedClause] = useState<number>(1);
  const [jurisdiction, setJurisdiction] = useState<'eg' | 'sa' | 'ae'>('eg');
  const [hasStamp, setHasStamp] = useState(true);

  const clauses = [
    {
      id: 1,
      title: 'المادة الأولى: التعريفات والأهلية القانونية',
      summary: 'إقرار الطرفين بالتمتع بالأهلية المعتبرة شرعاً ونظاماً لإبرام هذا العقد وتحمل كافة الالتزامات الناشئة عنه دون أي قيد أو مانع.',
      fullText:
        'يقر الطرفان بكامل أهليتهما المعتبرة قانوناً وشرعاً للتصرف والتعاقد، وخلو إرادتهما من أي عيب من عيوب الرضا (كالإكراه أو الغلط أو التدليس). يُقصد بمصطلح "الأصول والخدمات" كافة النواتج الرقمية والوثائق البرمجية المحددة في الملحق الفني لهذا العقد.',
    },
    {
      id: 2,
      title: 'المادة الثانية: نطاق التعاقد والالتزامات الجوهرية',
      summary: 'تحديد دقيق للمهام، معايير القبول الفني، والجدول الزمني لتسليم مراحل المشروع المعتمدة.',
      fullText:
        'يلتزم الطرف الأول بتقديم الخدمات وتنفيذ الأعمال بدقة واحترافية وفق أصول المهنة والأعراف السائدة، مع الالتزام بتسليم مخرجات كل مرحلة في المواعيد المحددة. لا يحق للطرف الثاني طلب تعديلات جوهرية خارج النطاق إلا باتفاق ملحق مكتوب يحدد الأثر المالي والزمني.',
    },
    {
      id: 3,
      title: 'المادة الثالثة: المقابل المالي وجدول الدفعات',
      summary: 'تحديد أتعاب التنفيذ، مواعيد استحقاق الدفعات، وغرامات التأخير في السداد.',
      fullText:
        'يلتزم الطرف الثاني بسداد القيمة الإجمالية المتفق عليها وفق جدول الدفعات المعتمد (50% دفعة مقدمة عند التوقيع، 25% عند اجتياز المعاينة الأولية، 25% عند التسليم النهائي). يترتب على التأخر في سداد أي دفعة عن موعدها تجميد فوري للعمل دون أدنى مسؤولية عن أي تأخير.',
    },
    {
      id: 4,
      title: 'المادة الرابعة: السرية وحماية الملكية الفكرية (NDA)',
      summary: 'حظر إفشاء الأسرار التجارية، الأكواد المصدرية، أو بيانات العملاء لطرف ثالث لمدة سنتين.',
      fullText:
        'يتعهد كل من الطرفين بالمحافظة التامة على سرية البيانات والمعلومات والمستندات ونماذج الأعمال التي يطلع عليها بمناسبة هذا التعاقد، ويحظر إفشاؤها أو استغلالها لمصلحة شخصية أو لصالح الغير. تظل هذه المادة سارية لمدة سنتين بعد انتهاء هذا العقد لأي سبب.',
    },
    {
      id: 5,
      title: 'المادة الخامسة: الاختصاص القضائي وفض النزاعات',
      summary: 'تحديد القانون الواجب التطبيق والمحكمة أو هيئة التحكيم المختصة بنظر أي نزاع.',
      fullText:
        jurisdiction === 'eg'
          ? 'يخضع هذا العقد ويفسر وفقاً لأحكام القوانين المعمول بها في جمهورية مصر العربية (القانون المدني وقانون التجارة)، وتختص المحاكم الاقتصادية بالقاهرة بنظر أي نزاع قد ينشأ بشأنه.'
          : jurisdiction === 'sa'
          ? 'يخضع هذا العقد ويفسر وفقاً للأنظمة واللوائح السارية في المملكة العربية السعودية (نظام المعاملات المدنية ونظام المحاكم التجارية)، وتختص المحكمة التجارية بمدينة الرياض بنظر أي خلاف.'
          : 'يخضع هذا العقد ويفسر وفقاً لقوانين دولة الإمارات العربية المتحدة، وتختص محاكم دبي المدنية والتجارية أو مركز دبي للتحكيم الدولي بنظر أي نزاع ناشئ عنه.',
    },
  ];

  return (
    <div className="mt-8 bg-rawnaq-navy border border-amber-500/30 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header Bar */}
      <div className="bg-amber-950/30 border-b border-amber-500/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl text-amber-400 font-bold">
            ⚖️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white">فاحص البنود والصياغة القانونية المعتمدة</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                Legal Stamped
              </span>
            </div>
            <p className="text-xs text-slate-400">
              صيغ قانونية محكمة ومراجعة من مستشارين معتمدين بمصر والسعودية والإمارات
            </p>
          </div>
        </div>

        {/* Jurisdiction Switcher */}
        <div className="flex items-center gap-2 bg-rawnaq-dark p-1 rounded-xl border border-rawnaq-border text-xs">
          <span className="text-slate-400 px-2">النظام المطبق:</span>
          <button
            onClick={() => setJurisdiction('eg')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              jurisdiction === 'eg' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            🇪🇬 مصر
          </button>
          <button
            onClick={() => setJurisdiction('sa')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              jurisdiction === 'sa' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            🇸🇦 السعودية
          </button>
          <button
            onClick={() => setJurisdiction('ae')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              jurisdiction === 'ae' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            🇦🇪 الإمارات
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Clauses List (5 Cols) */}
        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-l border-rawnaq-border p-4 space-y-2 bg-rawnaq-surface/40">
          <div className="text-xs font-bold text-slate-400 mb-3">فهرس المواد والبنود التعاقدية (انقر للمعاينة):</div>
          {clauses.map((c) => {
            const isSelected = selectedClause === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedClause(c.id)}
                className={`w-full text-right p-3 rounded-xl border transition-all text-xs ${
                  isSelected
                    ? 'bg-rawnaq-dark border-rawnaq-gold text-white shadow-lg'
                    : 'bg-rawnaq-dark/50 border-rawnaq-border/70 text-slate-300 hover:bg-rawnaq-dark hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-bold ${isSelected ? 'text-rawnaq-gold' : 'text-slate-200'}`}>
                    {c.title}
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-rawnaq-gold" />}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{c.summary}</p>
              </button>
            );
          })}

          <div className="pt-3">
            <Link
              href="/editor"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold text-xs shadow-lg hover:brightness-110 transition-all"
            >
              <span>تخصيص هذا العقد في محرر رَصين ➔</span>
            </Link>
          </div>
        </div>

        {/* Clause Details Preview (7 Cols) */}
        <div className="lg:col-span-7 p-6 bg-rawnaq-dark flex flex-col justify-between relative overflow-hidden">
          {/* Watermark */}
          {hasStamp && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="text-7xl font-black text-white rotate-[-30deg]">RASEEN LEGAL</span>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between pb-3 border-b border-rawnaq-border mb-4 text-xs">
              <span className="text-rawnaq-gold font-bold font-mono">
                CLAUSE #{selectedClause} OF {clauses.length}
              </span>
              <button
                onClick={() => setHasStamp(!hasStamp)}
                className="text-[11px] text-slate-400 hover:text-white"
              >
                {hasStamp ? 'إخفاء العلامة المائية' : 'إظهار الختم الرسمي'}
              </button>
            </div>

            <h4 className="text-lg font-bold text-white mb-3">
              {clauses.find((c) => c.id === selectedClause)?.title}
            </h4>

            <div className="p-4 rounded-xl bg-rawnaq-surface/80 border border-rawnaq-border text-sm text-slate-200 leading-relaxed font-sans text-justify">
              {clauses.find((c) => c.id === selectedClause)?.fullText}
            </div>
          </div>

          {/* Verification Badge */}
          <div className="mt-6 pt-4 border-t border-rawnaq-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>الصيغة القانونية: <strong>DOCX + PDF قابلة للتعديل والطباعة الفورية</strong></span>
            </div>
            <span className="font-mono text-[10px] text-slate-500">Hash: SHA256-LEGAL-RSN2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
