'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

const MOCK_PURCHASES = [
  {
    id: 'p1',
    title: 'حزمة عقود العمل والشراكة القانونية',
    date: '2026-09-28',
    remainingDownloads: 8,
    maxDownloads: 10,
    image: 'https://placehold.co/600x400/1a2744/f5b731?text=عقود+قانونية',
    fileType: 'DOCX / PDF'
  },
  {
    id: 'p3',
    title: 'شيت إكسل المحاسبة الشاملة والقيود اليومية',
    date: '2026-09-29',
    remainingDownloads: 10,
    maxDownloads: 10,
    image: 'https://placehold.co/600x400/1a2744/f5b731?text=إكسل+محاسبي',
    fileType: 'XLSX'
  },
  {
    id: 'p10',
    title: 'قوالب Notion الذكية لإدارة المهام والمذاكرة',
    date: '2026-09-30',
    remainingDownloads: 4,
    maxDownloads: 10,
    image: 'https://placehold.co/600x400/1a2744/f5b731?text=قالب+نوشن',
    fileType: 'Notion Link'
  },
];

export default function BuyerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const toggleLoginModal = useAuthStore((s) => s.toggleLoginModal);

  const [activeTab, setActiveTab] = useState<'purchases' | 'wishlist'>('purchases');
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadAlert, setDownloadAlert] = useState<string | null>(null);

  const handleDownload = (id: string, title: string) => {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      setDownloadAlert(`تم تجهيز رابط التنزيل المشفر لـ "${title}". صالح لمدة 48 ساعة.`);
      setTimeout(() => setDownloadAlert(null), 5000);
    }, 1200);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-rawnaq-dark text-white font-cairo px-4" dir="rtl" lang="ar">
        <div className="bg-rawnaq-navy p-8 rounded-2xl border border-rawnaq-border text-center max-w-md w-full shadow-2xl">
          <div className="w-16 h-16 bg-rawnaq-accent rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-rawnaq-border text-rawnaq-gold">
            👤
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">يرجى تسجيل الدخول</h1>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            يجب عليك تسجيل الدخول بحسابك للوصول إلى لوحة التحكم والملفات التي قمت بشرائها.
          </p>
          <button
            onClick={() => toggleLoginModal(true)}
            className="btn-gold w-full min-h-[44px]"
          >
            تسجيل الدخول الآن
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-rawnaq-dark text-white font-cairo py-10" dir="rtl" lang="ar">
      <div className="container mx-auto px-4">

        {downloadAlert && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl flex items-center gap-2 text-sm animate-fade-in-up">
            <span>✓</span> {downloadAlert}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-rawnaq-navy p-6 rounded-2xl border border-rawnaq-border">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl font-black text-rawnaq-gold">مرحباً، {user.name}</span>
              <span className="text-xs bg-rawnaq-dark text-slate-300 px-2 py-0.5 rounded-full border border-rawnaq-border">
                {user.role === 'vendor' ? 'حساب بائع' : 'حساب مشتري'}
              </span>
            </div>
            <p className="text-slate-400 text-sm">إدارة مشترياتك، تحميلاتك الفورية، وتفضيلات حسابك.</p>
          </div>
          <div className="flex items-center gap-3">
            {user.role === 'vendor' && (
              <Link href="/vendor" className="btn-gold !px-4 !py-2 text-sm">
                لوحة البائعين 🏪
              </Link>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all text-sm font-semibold min-h-[44px]"
              aria-label="تسجيل الخروج"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-rawnaq-navy p-6 rounded-2xl border border-rawnaq-border">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-rawnaq-border">
                <div className="w-12 h-12 bg-rawnaq-accent rounded-full flex items-center justify-center font-bold text-lg text-rawnaq-gold border border-rawnaq-border">
                  {user.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-white truncate">{user.name}</div>
                  <div className="text-xs text-slate-400 truncate">{user.email}</div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setActiveTab('purchases')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold min-h-[44px] ${
                    activeTab === 'purchases'
                      ? 'bg-rawnaq-gold text-rawnaq-dark'
                      : 'text-slate-400 hover:bg-rawnaq-dark hover:text-white'
                  }`}
                >
                  <span>📦</span>
                  <span>مشترياتي ({MOCK_PURCHASES.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold min-h-[44px] ${
                    activeTab === 'wishlist'
                      ? 'bg-rawnaq-gold text-rawnaq-dark'
                      : 'text-slate-400 hover:bg-rawnaq-dark hover:text-white'
                  }`}
                >
                  <span>❤️</span>
                  <span>المفضلة</span>
                </button>
              </div>
            </div>

            {user.role !== 'vendor' && (
              <div className="bg-gradient-to-br from-rawnaq-accent to-rawnaq-navy p-6 rounded-2xl border border-rawnaq-border text-center">
                <h3 className="font-bold text-white mb-2">هل تصنع أدوات أو شيتات رقمية؟</h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  انضم إلى منصة رَصين كبائع وحقق دخلاً ممتازاً مع عمولة 85% لك وصرف أسبوعي فوري.
                </p>
                <Link
                  href="/vendor"
                  className="btn-outline inline-block w-full text-center text-sm !py-2"
                >
                  بوابة البائعين
                </Link>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-rawnaq-navy p-6 rounded-2xl border border-rawnaq-border min-h-[450px]">

              {activeTab === 'purchases' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span>📦</span>
                    <span>الملفات والأصول المشتراة</span>
                  </h2>
                  <div className="space-y-4">
                    {MOCK_PURCHASES.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row items-center justify-between p-4 bg-rawnaq-surface rounded-xl border border-rawnaq-border gap-4 hover:border-rawnaq-border/80 transition-all"
                      >
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-rawnaq-border bg-rawnaq-dark">
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-sm md:text-base mb-1 line-clamp-1">{item.title}</h3>
                            <div className="flex items-center gap-3 text-xs text-slate-400">
                              <span>تاريخ الشراء: {item.date}</span>
                              <span>•</span>
                              <span className="text-rawnaq-gold font-mono">{item.fileType}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-rawnaq-border sm:border-0">
                          <div className="text-xs text-slate-400 text-center">
                            التحميلات المتبقية
                            <div className="font-bold text-white text-sm">{item.remainingDownloads} / {item.maxDownloads}</div>
                          </div>
                          <button
                            onClick={() => handleDownload(item.id, item.title)}
                            disabled={downloading === item.id || item.remainingDownloads === 0}
                            className={`btn-gold !px-5 !py-2 text-sm flex items-center gap-2 ${
                              item.remainingDownloads === 0 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            aria-label={`تحميل ${item.title}`}
                          >
                            <span>📥</span>
                            <span>{downloading === item.id ? 'جاري التحضير...' : 'تحميل فوري'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="flex flex-col items-center justify-center h-[350px] text-center">
                  <span className="text-5xl mb-4">❤️</span>
                  <h2 className="text-xl font-bold text-white mb-2">قائمة المفضلة فارغة</h2>
                  <p className="text-slate-400 text-sm mb-6 max-w-sm">
                    تصفح السوق وأضف المنتجات التي تهمك إلى قائمة المفضلة للرجوع إليها لاحقاً.
                  </p>
                  <Link href="/" className="btn-gold !px-6 !py-2 text-sm">
                    تصفح المنتجات في السوق
                  </Link>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
