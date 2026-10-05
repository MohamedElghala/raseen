'use client';

import React, { useState } from 'react';

interface FreelanceCustomizationCardProps {
  productTitle: string;
  fileType: string;
}

export default function FreelanceCustomizationCard({
  productTitle,
  fileType,
}: FreelanceCustomizationCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [details, setDetails] = useState('');
  const [contact, setContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const getExpertiseBadge = () => {
    switch (fileType) {
      case 'excel':
        return { role: 'محاسب ومطور نماذج إكسل معتمد', icon: '📊', fee: '150 ج.م' };
      case 'word-pdf':
        return { role: 'مستشار قانوني ومصيغ عقود', icon: '⚖️', fee: '200 ج.م' };
      case 'cad-revit':
        return { role: 'مهندس معماري ومختص BIM', icon: '📐', fee: '300 ج.م' };
      case 'canva':
      case 'powerpoint':
        return { role: 'مصمم جرافيك وهوية بصرية', icon: '🎨', fee: '120 ج.م' };
      default:
        return { role: 'خبير مستقل معتمد برَصين', icon: '💼', fee: '150 ج.م' };
    }
  };

  const expert = getExpertiseBadge();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setDetails('');
      setContact('');
    }, 4000);
  };

  return (
    <div className="bg-gradient-to-r from-rawnaq-navy via-[#101b33] to-rawnaq-navy border border-rawnaq-gold/40 rounded-2xl p-6 sm:p-7 shadow-xl mb-12 relative overflow-hidden" dir="rtl">
      
      {/* Background decoration */}
      <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-rawnaq-gold/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-rawnaq-gold/15 border border-rawnaq-gold/40 text-rawnaq-gold flex items-center justify-center text-2xl shrink-0">
            {expert.icon}
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rawnaq-gold/15 text-rawnaq-gold text-[11px] font-bold mb-1.5">
              <span>خدمات العمل الحر المستقل (Freelance Ecosystem)</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white mb-1">
              هل تريد تخصيص هذا الأصل لشركتك بواسطة مستقل محترف؟
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              وفّر وقتك: اطلب من <strong className="text-white">{expert.role}</strong> مواءمة هذا النموذج وتعبئة بياناتك وشعارك وإجراء التعديلات المطلوبة خلال 24 ساعة فقط بضمان رَصين.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
          <div className="text-right sm:text-left bg-rawnaq-surface/80 px-4 py-2 rounded-xl border border-rawnaq-border">
            <span className="text-[10px] text-slate-400 block">تكلفة التخصيص تبدأ من</span>
            <span className="text-base font-black text-emerald-400">{expert.fee}</span>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn-gold !px-6 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-rawnaq-gold/15"
          >
            <span>{isOpen ? 'إغلاق الطلب' : 'اطلب تخصيص الأصل الآن'}</span>
            <span>⚡</span>
          </button>
        </div>

      </div>

      {/* Expandable Request Form */}
      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-6 pt-6 border-t border-rawnaq-border/80 space-y-4 relative z-10 animate-fade-in-up">
          {submitted ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-center text-sm font-bold">
              🎉 تم استلام طلبك بنجاح! سيتواصل معك أحد المستقلين المعتمدين عبر الواتساب/الهاتف خلال ساعتين لمناقشة التفاصيل والبدء بالتنفيذ.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    رقم الواتساب أو البريد الإلكتروني للتواصل <span className="text-rawnaq-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="مثال: +201012345678 أو email@domain.com"
                    className="w-full h-11 px-3.5 rounded-xl bg-rawnaq-surface border border-rawnaq-border text-white text-xs placeholder-slate-500 focus:outline-none focus:border-rawnaq-gold font-mono"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    المدة الزمنية المطلوبة للتسليم
                  </label>
                  <select className="w-full h-11 px-3 rounded-xl bg-rawnaq-surface border border-rawnaq-border text-white text-xs focus:outline-none focus:border-rawnaq-gold">
                    <option value="24h">خلال 24 ساعة (تسليم سريع ⚡)</option>
                    <option value="48h">خلال 48 ساعة (عادي)</option>
                    <option value="flexible">مرن / حسب حجم التعديلات</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  تفاصيل التعديلات المطلوبة على ({productTitle})
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="مثال: إضافة معادلات خاصة بحساب العمولات، إدراج اللوجو، تعديل الشروط الجزائية في العقد، مطابقة أبعاد المخطط مع الموقع..."
                  className="w-full p-3 rounded-xl bg-rawnaq-surface border border-rawnaq-border text-white text-xs placeholder-slate-500 focus:outline-none focus:border-rawnaq-gold leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  🔒 جميع المعاملات محمية ومحجوزة في حساب ضمان رَصين Escrow حتى تستلم عملك كاملاً وترضى عنه.
                </span>

                <button
                  type="submit"
                  className="btn-gold !px-6 !py-2 text-xs font-bold flex items-center gap-2"
                >
                  <span>إرسال الطلب للمستقلين</span>
                  <span>←</span>
                </button>
              </div>
            </>
          )}
        </form>
      )}

    </div>
  );
}
