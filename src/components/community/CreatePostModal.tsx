'use client';

import React, { useState } from 'react';
import { useCommunityStore } from '@/store/communityStore';
import { useAuthStore } from '@/store/authStore';
import { CommunityCategorySlug } from '@/lib/communityTypes';

export default function CreatePostModal() {
  const isOpen = useCommunityStore((s) => s.isCreateModalOpen);
  const closeModal = useCommunityStore((s) => s.closeCreateModal);
  const initialType = useCommunityStore((s) => s.createModalType);
  const addPost = useCommunityStore((s) => s.addPost);
  const currentUser = useAuthStore((s) => s.user);

  const [postType, setPostType] = useState<'discussion' | 'request'>(initialType);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CommunityCategorySlug>(
    initialType === 'request' ? 'requests' : 'accounting'
  );
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [bounty, setBounty] = useState('');
  const [deadline, setDeadline] = useState('خلال 48 ساعة');
  const [guestName, setGuestName] = useState(currentUser?.name || '');
  const [guestTitle, setGuestTitle] = useState('مهني مستقل');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 8) {
      setError('يرجى كتابة عنوان واضح للنقاش (8 أحرف على الأقل).');
      return;
    }
    if (content.trim().length < 15) {
      setError('يرجى تقديم تفاصيل أوضح للموضوع (15 حرفاً على الأقل).');
      return;
    }
    if (!currentUser && guestName.trim().length < 3) {
      setError('يرجى إدخال اسمك الكريم لعرضه مع المشاركة.');
      return;
    }

    const tags = tagsInput
      .split(/[,،\s]+/)
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    addPost({
      title: title.trim(),
      content: content.trim(),
      category: postType === 'request' ? 'requests' : category,
      author: {
        name: currentUser?.name || guestName.trim(),
        title: guestTitle.trim() || (currentUser?.role === 'vendor' ? 'صانع محتوى رَصين' : 'عضو في مجتمع رَصين'),
        verified: !!currentUser,
        role: currentUser?.role === 'vendor' ? 'creator' : 'member',
      },
      tags: tags.length > 0 ? tags : [postType === 'request' ? 'طلب_نموذج' : 'نقاش_مهني'],
      isCustomRequest: postType === 'request',
      bounty: postType === 'request' ? bounty.trim() || 'قابل للتفاوض' : undefined,
      deadline: postType === 'request' ? deadline : undefined,
    });

    closeModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      dir="rtl"
      lang="ar"
    >
      <div className="relative w-full max-w-2xl bg-rawnaq-navy border border-rawnaq-border rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-rawnaq-border bg-rawnaq-surface">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span>{postType === 'request' ? '💡' : '💬'}</span>
              <span>{postType === 'request' ? 'طلب نموذج أو أصل تنفيذي مخصص' : 'طرح نقاش أو سؤال مهني جديد'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              شارك مع نخبة الخبراء وصناع الأصول في الوطن العربي.
            </p>
          </div>
          <button
            onClick={closeModal}
            className="w-9 h-9 rounded-xl bg-rawnaq-dark border border-rawnaq-border text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            aria-label="إغلاق النافذة"
          >
            ✕
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-2 bg-rawnaq-dark border-b border-rawnaq-border">
          <button
            type="button"
            onClick={() => {
              setPostType('discussion');
              if (category === 'requests') setCategory('accounting');
            }}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              postType === 'discussion'
                ? 'bg-rawnaq-surface text-rawnaq-gold border border-rawnaq-gold/30 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>💬</span>
            <span>نقاش / سؤال تخصصي</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setPostType('request');
              setCategory('requests');
            }}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              postType === 'request'
                ? 'bg-rawnaq-surface text-amber-400 border border-amber-500/40 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>💡</span>
            <span>طلب نموذج مخصص (Bounty)</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              عنوان الموضوع <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                postType === 'request'
                  ? 'مثال: طلب شيت إكسل لحساب تكاليف وعمولات مراكز الأشعة الطبية'
                  : 'مثال: كيف يتم حساب مخصص نهاية الخدمة وفق نظام العمل السعودي في الإكسل؟'
              }
              className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rawnaq-gold transition-colors"
              required
            />
          </div>

          {/* Category */}
          {postType === 'discussion' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                القسم التخصصي <span className="text-red-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CommunityCategorySlug)}
                className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rawnaq-gold transition-colors"
              >
                <option value="accounting">📊 المالية والمحاسبة والضرائب</option>
                <option value="legal">⚖️ القانون والعقود والامتثال</option>
                <option value="engineering">📐 الهندسة والمعمار وBIM/CAD</option>
                <option value="business">💼 ريادة الأعمال وتأسيس الشركات</option>
              </select>
            </div>
          )}

          {/* Bounty and Deadline for Custom Requests */}
          {postType === 'request' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  💰 الميزانية المقترحة / المكافأة (Bounty)
                </label>
                <input
                  type="text"
                  value={bounty}
                  onChange={(e) => setBounty(e.target.value)}
                  placeholder="مثال: 800 ج.م أو 100$"
                  className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  ⏱️ الموعد الزمني المطلوب
                </label>
                <select
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="عاجل (خلال 24 ساعة)">عاجل (خلال 24 ساعة)</option>
                  <option value="خلال 48 ساعة">خلال 48 ساعة</option>
                  <option value="خلال 4 أيام">خلال 4 أيام</option>
                  <option value="خلال أسبوع">خلال أسبوع</option>
                </select>
              </div>
            </div>
          )}

          {/* Content */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              تفاصيل الموضوع أو متطلبات النموذج <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اشرح المشكلة بدقة، اذكر الدوال أو الشروط المطلوبة، أو حدد المخرجات المتوقعة..."
              className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl p-4 text-sm text-white focus:outline-none focus:border-rawnaq-gold transition-colors leading-relaxed"
              required
            ></textarea>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              الوسوم والكلمات الدلالية (مفصولة بمسافة أو فاصلة)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="مثال: إكسل IFRS ضرائب_مصر"
              className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rawnaq-gold transition-colors"
            />
          </div>

          {/* Guest Identity if not logged in */}
          {!currentUser && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-rawnaq-border/50">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  الاسم الكريم <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="مثال: م. وائل الشريف"
                  className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rawnaq-gold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  المسمى أو التخصص المهني
                </label>
                <input
                  type="text"
                  value={guestTitle}
                  onChange={(e) => setGuestTitle(e.target.value)}
                  placeholder="مثال: محاسب قانوني / مهندس مدني"
                  className="w-full bg-rawnaq-dark border border-rawnaq-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rawnaq-gold"
                />
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-rawnaq-border">
            <button
              type="button"
              onClick={closeModal}
              className="px-5 py-2.5 rounded-xl border border-rawnaq-border text-slate-300 hover:text-white text-xs font-bold transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn-gold !px-6 !py-2.5 text-xs font-bold flex items-center gap-2 shadow-lg shadow-rawnaq-gold/10"
            >
              <span>{postType === 'request' ? 'نشر طلب النموذج 🚀' : 'نشر النقاش الآن 💬'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
