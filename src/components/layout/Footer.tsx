'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-rawnaq-border bg-rawnaq-dark/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 group" aria-label="الرئيسية - رَصين">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-rawnaq-gold/40 shadow-md shadow-rawnaq-gold/15 bg-white/5 backdrop-blur-sm shrink-0 group-hover:border-rawnaq-gold transition-all duration-300 flex items-center justify-center p-1">
                <Image
                  src="/brand/logo_transparent.png"
                  alt="شعار رَصين"
                  fill
                  className="object-contain p-1 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black gold-gradient-text tracking-tight font-cairo">رَصِيـن</span>
                <span className="text-slate-500 text-xs font-light">|</span>
                <span className="text-xs font-black tracking-widest text-white font-sans uppercase">RASEEN</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              رصيدك الذكي من الأدوات والخبرات الجاهزة. سوق عربي موثوق للأصول الرقمية والشيتات الاحترافية.
            </p>
            <div className="inline-flex items-center gap-2 bg-rawnaq-surface border border-rawnaq-border rounded-full px-4 py-2 text-xs text-slate-300">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              مصر • السعودية • الإمارات • الخليج
            </div>
          </div>

          {/* Categories */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-slate-200 mb-4">التصنيفات</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-slate-400 hover:text-rawnaq-gold transition-colors text-sm">شيتات إكسل</Link></li>
              <li><Link href="/" className="text-slate-400 hover:text-rawnaq-gold transition-colors text-sm">عقود قانونية</Link></li>
              <li><Link href="/" className="text-slate-400 hover:text-rawnaq-gold transition-colors text-sm">قوالب Notion</Link></li>
              <li><Link href="/" className="text-slate-400 hover:text-rawnaq-gold transition-colors text-sm">بلوكات CAD</Link></li>
              <li><Link href="/" className="text-slate-400 hover:text-rawnaq-gold transition-colors text-sm">برومبتات AI</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-slate-200 mb-4">أدوات وروابط</h3>
            <ul className="space-y-3">
              <li><Link href="/editor" className="text-slate-400 hover:text-rawnaq-gold transition-colors text-sm">🎨 محرر القوالب (Canva Studio)</Link></li>
              <li><Link href="/tools" className="text-slate-400 hover:text-rawnaq-gold transition-colors text-sm">أدوات مجانية</Link></li>
              <li><Link href="/vendor" className="text-slate-400 hover:text-rawnaq-gold transition-colors text-sm">بوابة البائعين</Link></li>
              <li><Link href="/dashboard" className="text-slate-400 hover:text-rawnaq-gold transition-colors text-sm">لوحة المشتري</Link></li>
              <li><Link href="/" className="text-slate-400 hover:text-rawnaq-gold transition-colors text-sm">السوق الرقمي</Link></li>
            </ul>
          </div>

          {/* Payment & Trust */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-slate-200 mb-4">طرق الدفع المدعومة</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-rawnaq-surface border border-rawnaq-border text-xs px-2 py-1 rounded text-slate-300">Visa / MasterCard</span>
              <span className="bg-rawnaq-surface border border-rawnaq-border text-xs px-2 py-1 rounded text-slate-300">Paymob Accept</span>
              <span className="bg-rawnaq-surface border border-rawnaq-border text-xs px-2 py-1 rounded text-slate-300">Vodafone Cash</span>
              <span className="bg-rawnaq-surface border border-rawnaq-border text-xs px-2 py-1 rounded text-slate-300">InstaPay</span>
              <span className="bg-rawnaq-surface border border-rawnaq-border text-xs px-2 py-1 rounded text-slate-300">Mada</span>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-rawnaq-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} رَصِيـن (RASEEN). جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">الشروط والأحكام</Link>
            <Link href="/privacy" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">سياسة الخصوصية</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
