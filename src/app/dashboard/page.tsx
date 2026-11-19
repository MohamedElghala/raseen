'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useAuthStore } from '@/store/authStore';
import { mockProducts } from '@/lib/mockData';

interface SavedOrderItem {
  id: string;
  title: string;
  fileType?: string;
  imageUrl?: string;
  downloadUrl?: string;
  licenseToken?: string;
}

interface SavedOrderRecord {
  orderId: string;
  status: 'completed' | 'pending' | string;
  currency: string;
  totalAmount: number;
  createdAt: string;
  buyerContact?: string;
  items: SavedOrderItem[];
}

export default function BuyerDashboardPage() {
  const { data: session, status: sessionStatus } = useSession();
  const toggleLoginModal = useAuthStore((s) => s.toggleLoginModal);
  const [orders, setOrders] = useState<SavedOrderRecord[]>([]);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('raseen-orders-history');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setOrders(parsed);
        }
      }
    } catch {
      // ignore corrupted local storage payload
    }
  }, []);

  if (sessionStatus === 'loading') {
    return (
      <main className="min-h-screen bg-raseen-dark flex items-center justify-center py-20 px-4">
        <div className="bg-raseen-surface border border-raseen-border rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-pulse">
          <div className="text-3xl mb-3">⏳</div>
          <p className="text-sm text-slate-300 font-bold">جاري التحقق من جلستك الآمنة...</p>
        </div>
      </main>
    );
  }

  const sessionUser = session?.user as
    | { name?: string | null; email?: string | null; image?: string | null; role?: string }
    | undefined;

  if (!sessionUser) {
    return (
      <main className="min-h-screen bg-raseen-dark flex items-center justify-center py-20 px-4">
        <div className="bg-raseen-surface border border-raseen-border rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-2xl font-black text-white mb-2">يرجى تسجيل الدخول</h1>
          <p className="text-slate-400 text-sm mb-6">
            هذه الصفحة مخصصة للمشترين المسجلين للوصول إلى مكتبة الأصول، سجل الطلبات، والتحقق من التراخيص.
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => toggleLoginModal(true)} className="btn-gold w-full">
              تسجيل الدخول للمنصة
            </button>
            <Link href="/verify" className="btn-outline w-full text-sm">
              التحقق من رخصة أو طلب برقم المرجع
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const displayName = sessionUser.name || 'مستخدم رَصين';
  const displayEmail = sessionUser.email || '';
  const userRole = sessionUser.role || 'buyer';
  const totalPurchasedItems = orders.reduce((acc, ord) => acc + (ord.items?.length || 0), 0);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('raseen-auth-storage');
    }
    signOut({ callbackUrl: '/' });
  };

  const resolveThumb = (item: SavedOrderItem): string => {
    const fromCatalog = mockProducts.find((p) => p.id === item.id)?.imageUrl;
    return fromCatalog || item.imageUrl || '/products/fallback-card.svg';
  };

  return (
    <main className="min-h-screen bg-raseen-dark py-12" dir="rtl" lang="ar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-raseen-border">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-black text-raseen-gold">مرحباً، {displayName}</h1>
              <span className="text-xs px-2.5 py-1 rounded bg-raseen-accent border border-raseen-border text-slate-300 font-bold">
                {userRole === 'vendor'
                  ? 'حساب بائع'
                  : userRole === 'admin'
                    ? 'حساب إدارة'
                    : 'حساب عميل'}
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              لوحة إدارة الطلبات الرقمية، ملفات الخزنة، والتحقق من التراخيص المشفرة.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/verify" className="btn-outline text-sm">
              🛡️ فحص رخصة رقمية
            </Link>
            {(userRole === 'vendor' || userRole === 'admin') && (
              <Link href="/vendor" className="btn-outline text-sm">
                🏪 الانتقال لبوابة البائع
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-bold text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* Download Notice */}
        {downloadNotice && (
          <div className="mb-8 p-4 rounded-xl bg-green-950/60 border border-green-500/50 text-green-300 text-sm flex items-center gap-3">
            <span className="text-xl">✅</span>
            <p className="font-bold">{downloadNotice}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Account Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-raseen-surface border border-raseen-border rounded-xl p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-raseen-gold/20 border border-raseen-gold flex items-center justify-center text-raseen-gold font-black text-xl overflow-hidden">
                  {sessionUser.image ? (
                    <img src={sessionUser.image} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    displayName.charAt(0)
                  )}
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-white truncate">{displayName}</div>
                  <div className="text-xs text-slate-400 truncate" dir="ltr">
                    {displayEmail}
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm border-t border-raseen-border/60 pt-4">
                <div className="flex justify-between text-slate-300">
                  <span>إجمالي الطلبات:</span>
                  <span className="font-bold text-white">{orders.length}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>الأصول المسجلة:</span>
                  <span className="font-bold text-raseen-gold">{totalPurchasedItems}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>حالة الجلسة:</span>
                  <span className="text-green-400 font-bold">موثقة (NextAuth)</span>
                </div>
              </div>
            </div>

            {userRole !== 'vendor' && (
              <div className="bg-gradient-to-br from-raseen-surface to-slate-900 border border-raseen-gold/30 rounded-xl p-6">
                <h3 className="font-bold text-raseen-gold mb-2">لديك خبرة مهنية؟</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  انضم كبائع على منصة رَصين وارفع قوالبك الهندسية أو المحاسبية واحصل على 85% من قيمة كل عملية بيع.
                </p>
                <Link href="/vendor" className="btn-outline w-full text-xs text-center block">
                  اعرف المزيد عن البيع
                </Link>
              </div>
            )}
          </div>

          {/* Orders & Vault History */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span>📦</span>
              <span>سجل الطلبات ومكتبة التحميل ({orders.length})</span>
            </h2>

            {orders.length === 0 ? (
              <div className="bg-raseen-surface border border-raseen-border rounded-2xl p-8 text-center">
                <div className="text-4xl mb-3">🗂️</div>
                <h3 className="text-lg font-bold text-white mb-2">لا توجد طلبات مسجلة في هذا المتصفح بعد</h3>
                <p className="text-sm text-slate-400 max-w-lg mx-auto mb-6">
                  عند إتمام أي طلب مجاني (0 ج.م) أو حجز طلب مدفوع من السلة، سيتم حفظ سجل الطلب وروابط خزنة الملفات وشهادة الترخيص هنا تلقائياً.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link href="/#products" className="btn-gold text-sm">
                    تصفح الأصول والقوالب
                  </Link>
                  <Link href="/verify" className="btn-outline text-sm">
                    فحص كود ترخيص حالي
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const isCompleted = order.status === 'completed';
                  return (
                    <div
                      key={order.orderId}
                      className="bg-raseen-surface border border-raseen-border rounded-2xl p-5 shadow-lg space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-raseen-border/60 text-xs">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-mono font-bold text-raseen-gold" dir="ltr">
                            {order.orderId}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded font-bold ${
                              isCompleted
                                ? 'bg-green-500/15 text-green-300 border border-green-500/30'
                                : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {isCompleted ? 'مكتمل — جاهز للتحميل' : 'قيد التحقق اليدوي من التحويل'}
                          </span>
                        </div>
                        <div className="text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString('ar-EG')} •{' '}
                          <span className="text-white font-bold">
                            {order.totalAmount} {order.currency}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={`${order.orderId}-${item.id}`}
                            className="bg-raseen-dark/60 border border-raseen-border/70 rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
                          >
                            <div className="flex items-center gap-4">
                              <img
                                src={resolveThumb(item)}
                                alt={item.title}
                                onError={(e) => {
                                  e.currentTarget.src = '/products/fallback-card.svg';
                                }}
                                className="w-16 h-16 rounded-lg object-cover border border-raseen-border shrink-0 bg-slate-900"
                              />
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  {item.fileType && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-raseen-gold border border-slate-700 uppercase">
                                      {item.fileType}
                                    </span>
                                  )}
                                </div>
                                <Link
                                  href={`/product/${item.id}`}
                                  className="font-bold text-white text-sm hover:text-raseen-gold transition-colors"
                                >
                                  {item.title}
                                </Link>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                              {isCompleted && item.downloadUrl ? (
                                <a
                                  href={item.downloadUrl}
                                  download
                                  onClick={() =>
                                    setDownloadNotice(`بدأ تحميل الملف الفعلي للأصل "${item.title}" من خزنة رَصين.`)
                                  }
                                  className="btn-gold !px-4 !py-2 text-xs text-center flex-1 sm:flex-none"
                                >
                                  ⬇️ تحميل الملف الآن
                                </a>
                              ) : (
                                <span className="px-3 py-2 rounded-lg text-xs bg-slate-800 text-amber-300 border border-slate-700">
                                  يُفعَّل التحميل بعد تأكيد التحويل
                                </span>
                              )}

                              {item.licenseToken && (
                                <Link
                                  href={`/verify?token=${encodeURIComponent(item.licenseToken)}`}
                                  className="btn-outline !px-3 !py-2 text-xs text-center"
                                >
                                  🛡️ عرض الرخصة
                                </Link>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
