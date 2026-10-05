import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الشروط والأحكام | رَصِيـن RASEEN',
  description: 'الشروط والأحكام المنظمة لشراء وبيع واستخدام الأصول الرقمية والتراخيص والعمل الحر في منصة رَصين.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-rawnaq-dark text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto rawnaq-glass p-6 sm:p-10 border border-rawnaq-border/80 rounded-2xl shadow-2xl">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-mono">
          <Link href="/" className="hover:text-rawnaq-gold transition-colors">الرئيسية</Link>
          <span>/</span>
          <span className="text-rawnaq-gold">الشروط والأحكام</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 font-cairo">
          الشروط والأحكام وسياسة الاستخدام
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mb-8 border-b border-rawnaq-border/60 pb-4">
          تاريخ السريان: 05 أكتوبر 2026 • تحكم هذه الاتفاقية حقوق وواجبات المشترين والبائعين ومستخدمي منصة "رَصِيـن".
        </p>

        {/* Content Sections */}
        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-slate-300">
          
          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-rawnaq-gold">1.</span>
              مقدمة وقبول الشروط
            </h2>
            <p>
              باستخدامك لمنصة "رَصِيـن" (RASEEN) أو إنشاء حساب أو شراء أي من المنتجات الرقمية المعروضة، فإنك تقر وتوافق على الالتزام الكامل بهذه الشروط والأحكام، بالإضافة إلى سياسة الخصوصية الخاصة بنا.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-rawnaq-gold">2.</span>
              تراخيص الأصول الرقمية وحقوق الاستخدام
            </h2>
            <p className="mb-2">
              جميع الأصول المعروضة (نماذج إكسل، عقود قانونية، مكتبات AutoCAD و Revit، وقوالب Canva) تمنح للمشتري ترخيص استخدام غير حصري وفق الآتي:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 mr-2">
              <li><strong>الترخيص الشخصي/التجاري الداخلي:</strong> يحق للمشتري استخدام الملف وتطبيقه في أعماله وشركته ومشاريع عملائه ومخرجاته النهائية.</li>
              <li><strong>حظر إعادة البيع أو التوزيع:</strong> يُحظر تماماً إعادة بيع الملفات الأصلية أو مشاركتها مجاناً أو نشرها في منصات ومواقع أخرى بهيئتها المصدرية.</li>
              <li><strong>حقوق الملكية الفكرية:</strong> تظل حقوق التأليف والتصميم الأصلية محفوظة لمنشئ الأصل وللمنصة.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-rawnaq-gold">3.</span>
              سياسة الاسترجاع للمنتجات الرقمية
            </h2>
            <p className="mb-2">
              نظراً لطبيعة المنتجات الرقمية غير الملموسة وقابليتها للنسخ الفوري بمجرد التنزيل، فإن جميع المبيعات تعتبر نهائية وغير قابلة للاسترجاع النقدي بمجرد إتمام التحميل بنجاح.
            </p>
            <p className="text-slate-400">
              استثناءً من ذلك، يلتزم فريق رَصين بإصلاح الملف أو استبداله أو رد المبلغ في حال ثبت وجود تلف تقني لا يمكن حله أو تعارض جوهري بين محتوى الملف والوصف المعلن عنه خلال 48 ساعة من الشراء.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-rawnaq-gold">4.</span>
              بوابة البائعين ومستحقات الأرباح
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 mr-2">
              <li>تمنح منصة رَصين البائعين عمولة عادلة قدرها <strong>85% من صافي المبيعات</strong>، وتستقطع المنصة 15% فقط كرسوم تشغيلية ودعم فني.</li>
              <li>يتعهد البائع بأن جميع الملفات المرفوعة من إعداده وتصميمه الشخصي ولا تنتهك أي حقوق ملكية فكرية أو أسرار تجارية لطرف ثالث.</li>
              <li>تتم تسوية وسحب أرباح البائعين دورياً عبر إنستاباي، فودافون كاش، أو التحويل البنكي وفق الحد الأدنى للسحب.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-rawnaq-gold">5.</span>
              إخلاء المسؤولية المهنية والقانونية
            </h2>
            <p>
              النماذج القانونية، المالية، والمحاسبية المتاحة على المنصة هي أدوات استرشادية احترافية صُممت لمساعدة رواد الأعمال والمختصين، ولا تُعد بديلاً عن استشارة محامٍ مرخص أو محاسب قانوني معتمد لتكييفها وفق ظروف كل حالة محددة وتشريعات كل دولة.
            </p>
          </section>

          <section className="bg-rawnaq-surface/60 p-5 rounded-xl border border-rawnaq-border">
            <h2 className="text-lg font-bold text-rawnaq-gold mb-2">القانون والاختصاص القضائي</h2>
            <p className="text-sm text-slate-300">
              تخضع هذه الشروط والأحكام وتفسر وفقاً للتشريعات والقوانين التجارية المعمول بها في جمهورية مصر العربية ودول مجلس التعاون الخليجي، وتختص المحاكم المعنية بالنظر في أي نزاع ينشأ عنها.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
