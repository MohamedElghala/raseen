'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import QuickStoreWizard from '@/components/vendor/QuickStoreWizard';

export default function VendorDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const toggleLoginModal = useAuthStore((s) => s.toggleLoginModal);

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'upload' | 'wizard'>('overview');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    fileType: '',
    price: '',
    licenseType: 'commercial',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const [vendorProducts, setVendorProducts] = useState([
    { id: '1', title: 'حزمة عقود العمل والشراكة القانونية', price: 250, sales: 320, status: 'نشط' },
    { id: '2', title: 'شيت إكسل المحاسبة الشاملة والقيود', price: 350, sales: 180, status: 'نشط' },
    { id: '3', title: 'حزمة بلوكات AutoCAD المعمارية المعتمدة', price: 200, sales: 95, status: 'نشط' },
  ]);

  if (!user || user.role !== 'vendor') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-rawnaq-dark text-white font-cairo px-4" dir="rtl" lang="ar">
        <div className="bg-rawnaq-navy p-8 rounded-2xl border border-rawnaq-border text-center max-w-md w-full shadow-2xl">
          <div className="w-16 h-16 bg-rawnaq-accent rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-rawnaq-border text-rawnaq-gold">
            🏪
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">بوابة البائعين وصناع المحتوى</h1>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            هذه اللوحة مخصصة للبائعين لإدارة ملفاتهم ومتابعة أرباحهم وصرف مستحقاتهم الأسبوعية (85%).
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => toggleLoginModal(true)}
              className="btn-gold w-full min-h-[44px]"
            >
              تسجيل الدخول أو إنشاء حساب بائع
            </button>
            <Link
              href="/"
              className="btn-outline w-full min-h-[44px] text-sm text-center flex items-center justify-center"
            >
              العودة للرئيسية وتصفح السوق
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'اسم المنتج مطلوب بالعربية';
    if (!formData.description || formData.description.length < 20) {
      newErrors.description = 'الوصف مطلوب ويجب أن يكون 20 حرفاً على الأقل';
    }
    if (!formData.category) newErrors.category = 'يرجى اختيار القسم';
    if (!formData.fileType) newErrors.fileType = 'يرجى اختيار نوع الملف';
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) < 50) {
      newErrors.price = 'الحد الأدنى لسعر المنتج في رَصين هو 50 ج.م';
    }
    if (!formData.licenseType) newErrors.licenseType = 'يرجى اختيار نوع الترخيص';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        const newProd = {
          id: String(Date.now()),
          title: formData.title,
          price: Number(formData.price),
          sales: 0,
          status: 'قيد التدقيق الآلي',
        };
        setVendorProducts([newProd, ...vendorProducts]);
        setSuccessNotice(`تم رفع المنتج "${formData.title}" بنجاح وجاري فحصه آلياً.`);
        setFormData({ title: '', description: '', category: '', fileType: '', price: '', licenseType: 'commercial' });
        setActiveTab('products');
        setTimeout(() => setSuccessNotice(null), 5000);
      }, 1200);
    }
  };

  const handleDeleteRequest = (id: string) => {
    setProductToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setVendorProducts(vendorProducts.filter((p) => p.id !== productToDelete));
      setSuccessNotice('تم حذف المنتج بنجاح.');
      setTimeout(() => setSuccessNotice(null), 4000);
    }
    setShowConfirmModal(false);
    setProductToDelete(null);
  };

  return (
    <main className="min-h-screen bg-rawnaq-dark text-white font-cairo py-10" dir="rtl" lang="ar">
      <div className="container mx-auto px-4">

        {successNotice && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl flex items-center gap-2 text-sm animate-fade-in-up">
            <span>✓</span> {successNotice}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-rawnaq-navy p-6 rounded-2xl border border-rawnaq-border">
          <div>
            <h1 className="text-3xl font-black text-rawnaq-gold mb-1">لوحة تحكم البائع</h1>
            <p className="text-slate-400 text-sm">مرحباً {user.name}، إدارة أصولك الرقمية ونظام الصرف الأسبوعي الآلي (85%).</p>
          </div>
          <button
            onClick={() => setActiveTab('upload')}
            className="btn-gold flex items-center gap-2 !px-6 shadow-lg shadow-rawnaq-gold/20"
          >
            <span>+</span>
            <span>رفع منتج جديد</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-rawnaq-surface p-1.5 rounded-xl border border-rawnaq-border w-full max-w-2xl">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all min-h-[44px] ${
              activeTab === 'overview' ? 'bg-rawnaq-gold text-rawnaq-dark' : 'text-slate-400 hover:text-white'
            }`}
          >
            نظرة عامة
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all min-h-[44px] ${
              activeTab === 'products' ? 'bg-rawnaq-gold text-rawnaq-dark' : 'text-slate-400 hover:text-white'
            }`}
          >
            منتجاتي ({vendorProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all min-h-[44px] ${
              activeTab === 'upload' ? 'bg-rawnaq-gold text-rawnaq-dark' : 'text-slate-400 hover:text-white'
            }`}
          >
            رفع منتج
          </button>
          <button
            onClick={() => setActiveTab('wizard')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all min-h-[44px] flex items-center justify-center gap-1.5 ${
              activeTab === 'wizard' ? 'bg-gradient-to-r from-rawnaq-gold to-yellow-500 text-slate-950 shadow' : 'text-rawnaq-gold hover:text-white bg-rawnaq-gold/10'
            }`}
          >
            <span>⚡</span>
            <span>معالج المتجر (5 دقائق)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-rawnaq-navy p-6 md:p-8 rounded-2xl border border-rawnaq-border min-h-[500px]">

          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-rawnaq-surface p-6 rounded-xl border border-rawnaq-border">
                  <div className="text-slate-400 text-sm mb-2 flex items-center justify-between">
                    <span>إجمالي المبيعات</span>
                    <span>💰</span>
                  </div>
                  <div className="text-2xl font-black text-white">15,340 ج.م</div>
                  <div className="text-xs text-slate-500 mt-2">منذ بداية الشهر الحالي</div>
                </div>

                <div className="bg-rawnaq-surface p-6 rounded-xl border border-green-500/20">
                  <div className="text-slate-400 text-sm mb-2 flex items-center justify-between">
                    <span className="text-green-400 font-bold">صافي أرباحك (85%)</span>
                    <span>📈</span>
                  </div>
                  <div className="text-2xl font-black text-green-400">13,039 ج.م</div>
                  <div className="text-xs text-slate-500 mt-2">مستحقات معتمدة ومؤكدة</div>
                </div>

                <div className="bg-rawnaq-surface p-6 rounded-xl border border-rawnaq-border">
                  <div className="text-slate-400 text-sm mb-2 flex items-center justify-between">
                    <span>عمولة المنصة (15%)</span>
                    <span>🏢</span>
                  </div>
                  <div className="text-2xl font-black text-slate-300">2,301 ج.م</div>
                  <div className="text-xs text-slate-500 mt-2">شاملة بوابات الدفع والتخزين</div>
                </div>

                <div className="bg-rawnaq-surface p-6 rounded-xl border border-rawnaq-border">
                  <div className="text-slate-400 text-sm mb-2 flex items-center justify-between">
                    <span>المنتجات النشطة</span>
                    <span>📦</span>
                  </div>
                  <div className="text-2xl font-black text-rawnaq-gold">{vendorProducts.length} منتجات</div>
                  <div className="text-xs text-slate-500 mt-2">متوفرة للتنزيل الفوري</div>
                </div>
              </div>

              {/* Payout Banner */}
              <div className="bg-gradient-to-r from-rawnaq-surface via-rawnaq-accent to-rawnaq-surface p-6 rounded-xl border border-rawnaq-gold/30 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">⚡</span>
                    <h3 className="text-lg font-bold text-white">دفعة الصرف الأسبوعية القادمة</h3>
                  </div>
                  <p className="text-slate-400 text-sm">
                    تحويل بنكي / محفظة فودافون كاش / إنستاباي آلي عبر شبكة Paymob Send.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-center">
                  <div className="bg-rawnaq-dark px-4 py-2 rounded-xl border border-rawnaq-border">
                    <div className="text-rawnaq-gold font-bold text-lg">الخميس القادم</div>
                    <div className="text-xs text-slate-400">تلقائياً وبدون تدخل</div>
                  </div>
                  <div className="bg-rawnaq-dark px-4 py-2 rounded-xl border border-rawnaq-border">
                    <div className="text-white font-bold text-lg">2,450 ج.م</div>
                    <div className="text-xs text-green-400">المبلغ الجاهز للصرف</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">قائمة الأصول الرقمية المرفوعة</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-rawnaq-border text-slate-400 text-sm">
                      <th className="pb-4 font-normal px-3">اسم المنتج</th>
                      <th className="pb-4 font-normal px-3">السعر</th>
                      <th className="pb-4 font-normal px-3">المبيعات</th>
                      <th className="pb-4 font-normal px-3">الحالة</th>
                      <th className="pb-4 font-normal px-3 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorProducts.map((p) => (
                      <tr key={p.id} className="border-b border-rawnaq-border/50 hover:bg-rawnaq-surface/50 transition-colors">
                        <td className="py-4 px-3 font-bold text-white">{p.title}</td>
                        <td className="py-4 px-3 text-rawnaq-gold font-mono">{p.price} ج.م</td>
                        <td className="py-4 px-3 text-slate-300">{p.sales} مبيعة</td>
                        <td className="py-4 px-3">
                          <span className={`px-2.5 py-1 text-xs rounded-full border ${
                            p.status === 'نشط'
                              ? 'bg-green-500/10 text-green-400 border-green-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => alert(`تعديل المنتج "${p.title}"`)}
                              className="px-3 py-1.5 bg-rawnaq-dark text-slate-300 hover:text-white rounded-lg border border-rawnaq-border hover:border-rawnaq-gold text-xs transition-colors min-h-[36px]"
                              aria-label={`تعديل ${p.title}`}
                            >
                              ✏️ تعديل
                            </button>
                            <button
                              onClick={() => handleDeleteRequest(p.id)}
                              className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg border border-red-500/20 text-xs transition-colors min-h-[36px]"
                              aria-label={`حذف ${p.title}`}
                            >
                              🗑️ حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-bold text-white mb-2">رفع أصل رقمي جديد</h2>
              <p className="text-slate-400 text-sm mb-6">
                املأ بيانات المنتج. يتم الفحص التلقائي لنوع الملف ورخص الاستخدام لضمان أعلى معايير الجودة للمشترين.
              </p>

              <form onSubmit={handleUploadSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">اسم المنتج (بالعربية) *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className={`w-full bg-rawnaq-surface border ${errors.title ? 'border-red-500' : 'border-rawnaq-border'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rawnaq-gold min-h-[44px]`}
                      placeholder="مثال: شيت تحليل مالي شامل بالإكسل"
                    />
                    {errors.title && <span className="text-red-400 text-xs mt-1 block">{errors.title}</span>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">الفئة المستهدفة *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className={`w-full bg-rawnaq-surface border ${errors.category ? 'border-red-500' : 'border-rawnaq-border'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rawnaq-gold min-h-[44px]`}
                    >
                      <option value="">اختر الفئة</option>
                      <option value="business">شركات ورواد أعمال (🏢)</option>
                      <option value="accounting">محاسبين وماليين (📊)</option>
                      <option value="engineering">مهندسين ومعماريين (📐)</option>
                      <option value="students">طلاب وباحثين (🎓)</option>
                      <option value="individuals">أفراد وإنتاجية (👤)</option>
                    </select>
                    {errors.category && <span className="text-red-400 text-xs mt-1 block">{errors.category}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">وصف تفصيلي للملف والقيمة المضافة *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full bg-rawnaq-surface border ${errors.description ? 'border-red-500' : 'border-rawnaq-border'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rawnaq-gold min-h-[110px] resize-y`}
                    placeholder="اشرح ماذا يتضمن الملف، كيفية استخدامه، ولمن موجه بالتحديد..."
                  />
                  {errors.description && <span className="text-red-400 text-xs mt-1 block">{errors.description}</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">السعر (جنيه مصري) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className={`w-full bg-rawnaq-surface border ${errors.price ? 'border-red-500' : 'border-rawnaq-border'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rawnaq-gold min-h-[44px]`}
                      placeholder="الحد الأدنى 50"
                      min="50"
                    />
                    {errors.price && <span className="text-red-400 text-xs mt-1 block">{errors.price}</span>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">نوع الملف *</label>
                    <select
                      value={formData.fileType}
                      onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                      className={`w-full bg-rawnaq-surface border ${errors.fileType ? 'border-red-500' : 'border-rawnaq-border'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rawnaq-gold min-h-[44px]`}
                    >
                      <option value="">اختر نوع الملف</option>
                      <option value="excel">شيت إكسل (.xlsx)</option>
                      <option value="notion">قالب نوشن (Notion Template)</option>
                      <option value="powerpoint">عرض بوربوينت (.pptx)</option>
                      <option value="word-pdf">عقد أو وثيقة (.docx / .pdf)</option>
                      <option value="cad-revit">ملف أوتوكاد / ريفيت (.dwg / .rvt)</option>
                      <option value="ai-prompts">برومبتات ذكاء اصطناعي</option>
                    </select>
                    {errors.fileType && <span className="text-red-400 text-xs mt-1 block">{errors.fileType}</span>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">نوع الترخيص الممنوح *</label>
                    <select
                      value={formData.licenseType}
                      onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
                      className={`w-full bg-rawnaq-surface border ${errors.licenseType ? 'border-red-500' : 'border-rawnaq-border'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rawnaq-gold min-h-[44px]`}
                    >
                      <option value="personal">استخدام شخصي فقط</option>
                      <option value="commercial">استخدام تجاري ومشاريع</option>
                      <option value="resell">ترخيص إعادة بيع كامل</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-rawnaq-border">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">ملف المنتج الرقمي (التنزيل الفوري)</label>
                    <input
                      type="file"
                      className="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-rawnaq-surface file:text-rawnaq-gold file:cursor-pointer cursor-pointer bg-rawnaq-dark border border-rawnaq-border rounded-xl min-h-[44px] p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">صورة الغلاف والمعاينة (Preview Image)</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-rawnaq-surface file:text-rawnaq-gold file:cursor-pointer cursor-pointer bg-rawnaq-dark border border-rawnaq-border rounded-xl min-h-[44px] p-2"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-gold !px-8 min-h-[44px]"
                  >
                    {isSubmitting ? 'جاري الفحص والنشر...' : 'نشر المنتج في السوق 🚀'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'wizard' && (
            <div className="py-4">
              <QuickStoreWizard
                onFinish={(data) => {
                  setSuccessNotice(`تم إنشاء متجر "${data.storeName}" بنجاح! الرابط جاهز للمشاركة.`);
                }}
              />
            </div>
          )}

        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-rawnaq-navy border border-rawnaq-border rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">تأكيد حذف المنتج</h3>
            <p className="text-slate-400 text-sm mb-6">
              هل أنت متأكد من حذف هذا المنتج؟ لن يتمكن المشترون الجدد من شرائه.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn-outline !py-2 !px-4 text-sm"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm min-h-[44px] transition-colors"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
