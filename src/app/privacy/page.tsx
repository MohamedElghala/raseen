import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | رَصِيـن RASEEN',
  description: 'سياسة الخصوصية وحماية البيانات في منصة رَصين للأصول الرقمية والعمل الحر وفق أعلى المعايير الأمنية.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-rawnaq-dark text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto rawnaq-glass p-6 sm:p-10 border border-rawnaq-border/80 rounded-2xl shadow-2xl">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-mono">
          <Link href="/" className="hover:text-rawnaq-gold transition-colors">الرئيسية</Link>
          <span>/</span>
          <span className="text-rawnaq-gold">سياسة الخصوصية</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 font-cairo">
          سياسة الخصوصية وحماية البيانات
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mb-8 border-b border-rawnaq-border/60 pb-4">
          آخر تحديث: 05 أكتوبر 2026 • تلتزم منصة "رَصِيـن" بحماية خصوصية بياناتك وفقاً لأعلى المعايير الأمنية العالمية ومبادئ Google OAuth.
        </p>

        {/* Content Sections */}
        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-slate-300">
          
          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-rawnaq-gold">1.</span>
              البيانات التي نجمعها
            </h2>
            <p className="mb-2">
              عند استخدامك لمنصة "رَصِيـن"، قد نجمع بعض المعلومات الأساسية لتقديم خدماتنا بأعلى كفاءة:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 mr-2">
              <li><strong>بيانات الحساب:</strong> عند تسجيل الدخول عبر Google، نجمع اسمك، عنوان بريدك الإلكتروني، وصورة ملفك الشخصي فقط لتخصيص حسابك ومزامنة مشترياتك.</li>
              <li><strong>بيانات الشراء والتحميل:</strong> سجل المنتجات والأصول الرقمية التي قمت بشرائها وروابط التنزيل المخصصة لك.</li>
              <li><strong>البيانات التقنية:</strong> عنوان IP، نوع المتصفح، ومعلومات الاستخدام عبر Google Analytics لتحسين أداء المنصة وسرعة تصفحها.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-rawnaq-gold">2.</span>
              كيف نستخدم معلوماتك؟
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 mr-2">
              <li>تسهيل تسجيل الدخول والتحقق الآمن من هوية المشتري والبائع.</li>
              <li>تسليم الأصول الرقمية وتوليد روابط التنزيل المشفرة والمؤقتة لملفاتك.</li>
              <li>إرسال الفواتير الإلكترونية وإشعارات تأكيد الشراء عبر البريد الإلكتروني.</li>
              <li>حساب وتحويل مستحقات وأرباح البائعين (85%) بدقة وشفافية.</li>
              <li>حماية المنصة من محاولات الاحتيال أو التحميلات غير المصرح بها.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-rawnaq-gold">3.</span>
              حماية البيانات وعدم مشاركتها
            </h2>
            <p className="mb-2">
              نلتزم التزاماً صارماً بعدم بيع أو تأجير أو مشاركة بياناتك الشخصية مع أي طرف ثالث لأغراض تسويقية أو تجارية. يتم تخزين جميع البيانات في خوادم سحابية مشفرة (PostgreSQL عبر بروتوكولات SSL/TLS).
            </p>
            <p className="text-slate-400">
              يتم التعامل فقط مع شركاء البنية التحتية المعتمدين والموثوقين لمعالجة المعاملات (مثل خوادم Google Cloud و Supabase وبوابات الدفع المرخصة من البنك المركزي مثل Paymob).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-rawnaq-gold">4.</span>
              ملفات تعريف الارتباط (Cookies)
            </h2>
            <p>
              نستخدم ملفات تعريف الارتباط الأساسية لحفظ جلسة تسجيل الدخول وتذكر محتويات سلة المشتريات والعملة المختارة (EGP, SAR, AED, USD). يمكنك تعطيل ملفات تعريف الارتباط من متصفحك في أي وقت، مع العلم أن بعض ميزات الموقع مثل الدخول الفوري قد تتأثر.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-rawnaq-gold">5.</span>
              حقوق المستخدم وحذف البيانات
            </h2>
            <p>
              يحق لك في أي وقت طلب نسخة من بياناتك المخزنة لدينا، أو طلب تعديلها أو حذف حسابك وسجل بياناتك نهائياً من قاعدة بياناتنا عبر التواصل المباشر مع فريق الدعم الفني.
            </p>
          </section>

          <section className="bg-rawnaq-surface/60 p-5 rounded-xl border border-rawnaq-border">
            <h2 className="text-lg font-bold text-rawnaq-gold mb-2">التواصل معنا</h2>
            <p className="text-sm text-slate-300">
              لأي استفسارات أو طلبات تتعلق بالخصوصية وحماية البيانات، يسعدنا تواصلك معنا مباشرة عبر البريد الإلكتروني:
            </p>
            <p className="text-sm font-mono text-white mt-2">
              support@raseen.me • raseen.digital.hub@gmail.com
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
