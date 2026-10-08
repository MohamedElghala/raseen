'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useCommunityStore } from '@/store/communityStore';
import { CommunityCategorySlug, CommunityPost } from '@/lib/communityTypes';
import CreatePostModal from '@/components/community/CreatePostModal';

const CATEGORIES: { slug: CommunityCategorySlug; label: string; icon: string }[] = [
  { slug: 'all', label: 'جميع الأقسام', icon: '🌐' },
  { slug: 'accounting', label: 'المالية والمحاسبة', icon: '📊' },
  { slug: 'legal', label: 'القانون والعقود', icon: '⚖️' },
  { slug: 'engineering', label: 'الهندسة وBIM', icon: '📐' },
  { slug: 'business', label: 'الأعمال والشركات', icon: '💼' },
  { slug: 'requests', label: 'طلبات النماذج المخصصة', icon: '💡' },
];

export default function CommunityPage() {
  const posts = useCommunityStore((s) => s.posts);
  const selectedCategory = useCommunityStore((s) => s.selectedCategory);
  const setSelectedCategory = useCommunityStore((s) => s.setSelectedCategory);
  const searchQuery = useCommunityStore((s) => s.searchQuery);
  const setSearchQuery = useCommunityStore((s) => s.setSearchQuery);
  const activeTab = useCommunityStore((s) => s.activeTab);
  const setActiveTab = useCommunityStore((s) => s.setActiveTab);
  const openCreateModal = useCommunityStore((s) => s.openCreateModal);
  const upvotePost = useCommunityStore((s) => s.upvotePost);
  const upvotedPostIds = useCommunityStore((s) => s.upvotedPostIds);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Category filter
      if (selectedCategory !== 'all' && post.category !== selectedCategory) {
        return false;
      }

      // Tab filter
      if (activeTab === 'requests' && !post.isCustomRequest) return false;
      if (activeTab === 'solved' && !post.isSolved) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = post.title.toLowerCase().includes(q);
        const matchContent = post.content.toLowerCase().includes(q);
        const matchAuthor = post.author.name.toLowerCase().includes(q);
        const matchTags = post.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchContent && !matchAuthor && !matchTags) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (activeTab === 'top') return b.upvotes - a.upvotes;
      return 0; // default order
    });
  }, [posts, selectedCategory, activeTab, searchQuery]);

  return (
    <main className="min-h-screen bg-rawnaq-dark text-white font-cairo py-10" dir="rtl" lang="ar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-rawnaq-navy to-rawnaq-dark border border-rawnaq-border p-8 md:p-12 mb-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rawnaq-gold/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-rawnaq-surface/80 border border-rawnaq-gold/30 rounded-full px-4 py-1.5 text-xs text-rawnaq-gold mb-4 backdrop-blur-md">
              <span>🏛️</span>
              <span>مجتمع رَصين المهني | ساحة الخبراء وصناع الأصول التنفيذية</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              ناقش التحديات التخصصية، واطلب <span className="gold-gradient-text">نماذجك المخصصة</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
              ملتقى يجمع المحاسبين القانونيين، المحامين، ومهندسي BIM ورواد الأعمال لحل المشكلات المعقدة في شيتات الإكسل والعقود والملفات الهندسية، مع إمكانية طلب تصميم أصول رقمية مخصصة.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => openCreateModal('discussion')}
                className="btn-gold !px-6 !py-3 text-sm font-bold flex items-center gap-2 shadow-lg shadow-rawnaq-gold/15"
              >
                <span>➕</span>
                <span>طرح سؤال أو نقاش جديد</span>
              </button>

              <button
                onClick={() => openCreateModal('request')}
                className="px-6 py-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition-all text-sm font-bold flex items-center gap-2 min-h-[44px]"
              >
                <span>💡</span>
                <span>طلب نموذج أو شيت مخصص (Bounty)</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-10 pt-8 border-t border-rawnaq-border/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-black text-rawnaq-gold font-mono">1,280+</div>
              <div className="text-xs text-slate-400 mt-1">نقاش مهني موثق</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white font-mono">340+</div>
              <div className="text-xs text-slate-400 mt-1">خبير وصانع معتمد</div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-400 font-mono">190+</div>
              <div className="text-xs text-slate-400 mt-1">نموذج بطلب مخصص</div>
            </div>
            <div>
              <div className="text-2xl font-black text-green-400 font-mono">94%</div>
              <div className="text-xs text-slate-400 mt-1">نسبة الإجابة والحلول</div>
            </div>
          </div>
        </section>

        {/* Search & Main Category Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Categories Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 min-h-[44px] ${
                  selectedCategory === cat.slug
                    ? 'bg-rawnaq-gold text-rawnaq-dark shadow-md shadow-rawnaq-gold/20'
                    : 'bg-rawnaq-surface border border-rawnaq-border text-slate-300 hover:text-white hover:border-rawnaq-gold/30'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full md:w-80 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في النقاشات والوسوم..."
              className="w-full bg-rawnaq-surface border border-rawnaq-border rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rawnaq-gold transition-colors min-h-[44px]"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Tab Sub-filters */}
        <div className="flex items-center justify-between border-b border-rawnaq-border pb-4 mb-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'all' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              الكل ({posts.length})
            </button>
            <button
              onClick={() => setActiveTab('top')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'top' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              🔥 الأكثر تصويتاً
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'requests' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              💡 طلبات النماذج المخصصة
            </button>
            <button
              onClick={() => setActiveTab('solved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'solved' ? 'bg-green-500/20 text-green-300' : 'text-slate-400 hover:text-green-300'
              }`}
            >
              ✓ نقاشات محلولة
            </button>
          </div>

          <div className="text-xs text-slate-400">
            عرض {filteredPosts.length} نقاش
          </div>
        </div>

        {/* Two-Column Grid: Discussions List + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Discussions Feed (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="p-12 text-center bg-rawnaq-surface rounded-2xl border border-rawnaq-border">
                <span className="text-4xl mb-3 block">🔍</span>
                <h3 className="text-lg font-bold text-white mb-1">لم يتم العثور على نقاشات مطابقة</h3>
                <p className="text-xs text-slate-400 mb-6">
                  جرب البحث بكلمات أخرى أو كن أول من يطرح نقاشاً في هذا القسم.
                </p>
                <button
                  onClick={() => openCreateModal('discussion')}
                  className="btn-gold !px-6 !py-2.5 text-xs font-bold inline-flex items-center gap-2"
                >
                  طرح نقاش الآن ➕
                </button>
              </div>
            ) : (
              filteredPosts.map((post) => {
                const isUpvoted = upvotedPostIds.includes(post.id);

                return (
                  <article
                    key={post.id}
                    className="p-5 md:p-6 bg-rawnaq-surface rounded-2xl border border-rawnaq-border hover:border-rawnaq-gold/30 hover:shadow-lg hover:shadow-black/40 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      
                      {/* Upvote Button Column */}
                      <button
                        onClick={() => upvotePost(post.id)}
                        className={`flex flex-col items-center justify-center min-w-[50px] p-2 rounded-xl border transition-all ${
                          isUpvoted
                            ? 'bg-rawnaq-gold/15 border-rawnaq-gold text-rawnaq-gold shadow-sm'
                            : 'bg-rawnaq-dark border-rawnaq-border text-slate-400 hover:text-white hover:border-rawnaq-border/80'
                        }`}
                        aria-label="تصويت للموضوع"
                      >
                        <span className="text-base leading-none">▲</span>
                        <span className="text-xs font-bold mt-1 font-mono">{post.upvotes}</span>
                      </button>

                      {/* Content Column */}
                      <div className="flex-1 min-w-0">
                        
                        {/* Top Meta: Category + Badges + Time */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rawnaq-dark border border-rawnaq-border text-slate-300">
                            {post.category === 'accounting' && '📊 مالية ومحاسبة'}
                            {post.category === 'legal' && '⚖️ قانون وعقود'}
                            {post.category === 'engineering' && '📐 هندسة وBIM'}
                            {post.category === 'business' && '💼 أعمال وشركات'}
                            {post.category === 'requests' && '💡 طلب نموذج مخصص'}
                          </span>

                          {post.isSolved && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-green-500/15 border border-green-500/40 text-green-400 flex items-center gap-1">
                              <span>✓</span>
                              <span>محلول</span>
                            </span>
                          )}

                          {post.isCustomRequest && post.bounty && (
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/50 text-amber-300 flex items-center gap-1">
                              <span>💰</span>
                              <span>المكافأة: {post.bounty}</span>
                            </span>
                          )}

                          <span className="text-slate-500 text-xs mr-auto">{post.createdAt}</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-rawnaq-gold transition-colors mb-2 leading-snug">
                          <Link href={`/community/${post.id}`}>
                            {post.title}
                          </Link>
                        </h2>

                        {/* Excerpt */}
                        <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed mb-4">
                          {post.content}
                        </p>

                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 mb-4">
                            {post.tags.map((tag) => (
                              <button
                                key={tag}
                                onClick={() => setSearchQuery(tag)}
                                className="text-[10px] font-medium px-2 py-0.5 rounded bg-rawnaq-navy text-slate-400 hover:text-rawnaq-gold border border-rawnaq-border/60 transition-colors"
                              >
                                #{tag}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Footer Meta: Author + Comments */}
                        <div className="flex items-center justify-between pt-3 border-t border-rawnaq-border/50 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-rawnaq-accent flex items-center justify-center text-[10px] font-black text-rawnaq-gold border border-rawnaq-border">
                              {post.author.name.charAt(0)}
                            </div>
                            <span className="font-bold text-white">{post.author.name}</span>
                            {post.author.verified && (
                              <span className="text-cyan-400 text-[11px]" title="خبير معتمد">✓</span>
                            )}
                            <span className="text-slate-400 text-[11px] hidden sm:inline">• {post.author.title}</span>
                          </div>

                          <div className="flex items-center gap-4 text-slate-400">
                            <span className="flex items-center gap-1">
                              <span>💬</span>
                              <span className="font-mono">{post.commentsCount}</span>
                              <span className="hidden sm:inline">ردود</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <span>👁️</span>
                              <span className="font-mono">{post.views}</span>
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {/* Sidebar (1 col) */}
          <aside className="lg:col-span-1 space-y-6">

            {/* Custom Template Request CTA */}
            <div className="p-6 bg-gradient-to-br from-amber-500/10 to-rawnaq-surface rounded-2xl border border-amber-500/30 text-right">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl mb-3 border border-amber-500/40">
                💡
              </div>
              <h3 className="font-black text-white text-base mb-1">
                هل تبحث عن نموذج أو شيت غير موجود؟
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                اطرح طلبك التخصصي وحدد الميزانية (Bounty) وسيقوم أحد صناع المحتوى أو الخبراء بتطويره واعتماده لك خلال أيام.
              </p>
              <button
                onClick={() => openCreateModal('request')}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 text-rawnaq-dark font-black text-xs hover:bg-amber-400 transition-colors shadow-md"
              >
                طلب نموذج مخصص الآن
              </button>
            </div>

            {/* Top Contributors Card */}
            <div className="p-5 bg-rawnaq-surface rounded-2xl border border-rawnaq-border">
              <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                <span>🌟</span>
                <span>أنشط الخبراء وصناع المحتوى</span>
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-between text-xs pb-3 border-b border-rawnaq-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-rawnaq-dark flex items-center justify-center text-xs font-bold text-rawnaq-gold border border-rawnaq-border">
                      م
                    </div>
                    <div>
                      <div className="font-bold text-white">د. محمود الفقي</div>
                      <div className="text-[10px] text-slate-400">مستشار IFRS</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-mono text-[10px] font-bold">
                    28 حلاً معتمداً
                  </span>
                </li>
                <li className="flex items-center justify-between text-xs pb-3 border-b border-rawnaq-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-rawnaq-dark flex items-center justify-center text-xs font-bold text-rawnaq-gold border border-rawnaq-border">
                      خ
                    </div>
                    <div>
                      <div className="font-bold text-white">المستشار خالد عبد الرازق</div>
                      <div className="text-[10px] text-slate-400">محامٍ ومستشار عقود</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-mono text-[10px] font-bold">
                    39 حلاً معتمداً
                  </span>
                </li>
                <li className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-rawnaq-dark flex items-center justify-center text-xs font-bold text-rawnaq-gold border border-rawnaq-border">
                      إ
                    </div>
                    <div>
                      <div className="font-bold text-white">م. إبراهيم ناصف</div>
                      <div className="text-[10px] text-slate-400">خبير نمذجة BIM</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-mono text-[10px] font-bold">
                    21 حلاً معتمداً
                  </span>
                </li>
              </ul>
            </div>

            {/* Trending Tags */}
            <div className="p-5 bg-rawnaq-surface rounded-2xl border border-rawnaq-border">
              <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                <span>🏷️</span>
                <span>الوسوم الأكثر تداولاً</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {['إكسل_محاسبي', 'معايير_IFRS', 'عقود_قانونية', 'Revit_MEP', 'طلب_نموذج', 'ضرائب_مصر', 'الفاتورة_الإلكترونية', 'شركات_ناشئة', 'عمل_حر'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-rawnaq-dark text-slate-300 hover:text-rawnaq-gold hover:border-rawnaq-gold/40 border border-rawnaq-border transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="p-4 bg-rawnaq-dark/60 rounded-xl border border-rawnaq-border/70 text-slate-400 text-[11px] leading-relaxed">
              <span className="font-bold text-slate-300 block mb-1">📜 ميثاق مجتمع رَصين:</span>
              نلتزم بالدقة المهنية، عدم نشر أكواد أو ملفات تنتهك حقوق الملكية، ونشجع على مشاركة الحلول القابلة للتطبيق العملي.
            </div>

          </aside>

        </div>

      </div>

      {/* Create Post / Request Modal */}
      <CreatePostModal />
    </main>
  );
}
