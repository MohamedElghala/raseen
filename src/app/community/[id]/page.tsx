'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useCommunityStore } from '@/store/communityStore';
import { useAuthStore } from '@/store/authStore';
import { mockProducts } from '@/lib/mockData';

export default function DiscussionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const postId = resolvedParams.id;

  const posts = useCommunityStore((s) => s.posts);
  const upvotePost = useCommunityStore((s) => s.upvotePost);
  const upvotedPostIds = useCommunityStore((s) => s.upvotedPostIds);
  const addComment = useCommunityStore((s) => s.addComment);
  const markCommentAsSolution = useCommunityStore((s) => s.markCommentAsSolution);
  const upvoteComment = useCommunityStore((s) => s.upvoteComment);
  const upvotedCommentIds = useCommunityStore((s) => s.upvotedCommentIds);

  const currentUser = useAuthStore((s) => s.user);

  const post = posts.find((p) => p.id === postId);

  const [commentContent, setCommentContent] = useState('');
  const [guestName, setGuestName] = useState(currentUser?.name || '');
  const [guestTitle, setGuestTitle] = useState('مهني مستقل');
  const [copied, setCopied] = useState(false);
  const [proposalAlert, setProposalAlert] = useState(false);

  if (!post) {
    return (
      <main className="min-h-screen bg-raseen-dark text-white font-cairo flex items-center justify-center p-4" dir="rtl" lang="ar">
        <div className="bg-raseen-surface p-8 rounded-2xl border border-raseen-border text-center max-w-md w-full">
          <span className="text-4xl mb-3 block">⚠️</span>
          <h1 className="text-xl font-bold mb-2">الموضوع غير موجود</h1>
          <p className="text-xs text-slate-400 mb-6">
            قد يكون تم حذف النقاش أو الرابط غير صحيح.
          </p>
          <Link href="/community" className="btn-gold !px-6 !py-2 text-xs font-bold inline-block">
            العودة لساحة المجتمع ←
          </Link>
        </div>
      </main>
    );
  }

  const isUpvoted = upvotedPostIds.includes(post.id);
  const comments = post.comments || [];
  const relatedProduct = post.relatedProductId
    ? mockProducts.find((p) => p.id === post.relatedProductId)
    : null;

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentContent.trim().length < 5) return;

    addComment(post.id, {
      author: {
        name: currentUser?.name || guestName.trim() || 'عضو في رَصين',
        title: guestTitle.trim() || (currentUser?.role === 'vendor' ? 'صانع محتوى رَصين' : 'مشارك مهني'),
        verified: !!currentUser,
        role: currentUser?.role === 'vendor' ? 'creator' : 'member',
      },
      content: commentContent.trim(),
    });

    setCommentContent('');
  };

  return (
    <main className="min-h-screen bg-raseen-dark text-white font-cairo py-10" dir="rtl" lang="ar">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6" aria-label="مسار التنقل">
          <Link href="/" className="hover:text-raseen-gold transition-colors">الرئيسية</Link>
          <span>/</span>
          <Link href="/community" className="hover:text-raseen-gold transition-colors">مجتمع رَصين</Link>
          <span>/</span>
          <span className="text-slate-300 font-bold truncate max-w-xs">{post.title}</span>
        </nav>

        {copied && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 text-green-400 text-xs rounded-xl flex items-center gap-2 animate-fade-in-up">
            <span>✓</span> تم نسخ رابط النقاش إلى الحافظة بنجاح!
          </div>
        )}

        {proposalAlert && (
          <div className="mb-4 p-4 bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs rounded-xl flex items-center justify-between animate-fade-in-up">
            <div className="flex items-center gap-2">
              <span>🚀</span>
              <span>تم توجيهك لصندوق الردود. يمكنك الآن كتابة عرضك وتفاصيل قدرتك على تنفيذ النموذج لصاحب الطلب.</span>
            </div>
            <button onClick={() => setProposalAlert(false)} className="text-amber-400 font-bold">✕</button>
          </div>
        )}

        {/* Main Post Card */}
        <article className="bg-raseen-surface border border-raseen-border rounded-2xl p-6 md:p-8 mb-8 shadow-xl">
          
          {/* Post Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-raseen-border/70">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-raseen-accent flex items-center justify-center font-black text-lg text-raseen-gold border border-raseen-border">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">{post.author.name}</span>
                  {post.author.verified && (
                    <span className="text-cyan-400 text-sm" title="خبير معتمد في رَصين">✓</span>
                  )}
                  <span className="text-[10px] px-2 py-0.5 rounded bg-raseen-navy text-slate-300 border border-raseen-border">
                    {post.author.role === 'expert' ? 'خبير معتمد' : post.author.role === 'creator' ? 'صانع محتوى' : 'عضو'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{post.author.title} • {post.createdAt}</div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2">
              {post.isSolved && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-500/15 border border-green-500/40 text-green-400 flex items-center gap-1.5">
                  <span>✓</span>
                  <span>نقاش محلول</span>
                </span>
              )}
              {post.isCustomRequest && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 flex items-center gap-1.5">
                  <span>💡</span>
                  <span>طلب أصل تنفيذي مخصص</span>
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-snug mb-6">
            {post.title}
          </h1>

          {/* Body */}
          <div className="text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-8 font-normal">
            {post.content}
          </div>

          {/* Custom Request Bounty Box if applicable */}
          {post.isCustomRequest && post.bounty && (
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-raseen-navy to-amber-500/5 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                  <span>💰</span>
                  <span>المكافأة المرصودة لصانع الأصل (Bounty)</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">{post.bounty}</div>
                <div className="text-xs text-slate-400 mt-1">
                  الموعد المتوقع: {post.deadline || 'خلال 48 ساعة'} • يتم الدفع بضمان رَصين التنفيذي
                </div>
              </div>

              <button
                onClick={() => {
                  setProposalAlert(true);
                  const replyBox = document.getElementById('reply-box');
                  replyBox?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-gold !px-6 !py-2.5 text-xs font-bold shrink-0 shadow-lg shadow-raseen-gold/15"
              >
                تقديم عرض لتنفيذ النموذج 🤝
              </button>
            </div>
          )}

          {/* Linked Product Banner if applicable */}
          {relatedProduct && (
            <div className="mb-8 p-4 rounded-xl bg-raseen-navy/90 border border-raseen-gold/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📦</span>
                <div>
                  <div className="text-xs text-raseen-gold font-bold">أصل معتمد ذو صلة في المتجر:</div>
                  <div className="text-sm font-bold text-white">{relatedProduct.title}</div>
                </div>
              </div>
              <Link
                href={`/product/${relatedProduct.id}`}
                className="px-4 py-2 rounded-lg bg-raseen-gold text-raseen-dark text-xs font-bold hover:bg-raseen-gold-hover transition-colors shrink-0"
              >
                معاينة الأصل في السوق ←
              </Link>
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-3 py-1 rounded-lg bg-raseen-dark text-slate-300 border border-raseen-border"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-raseen-border/70">
            <div className="flex items-center gap-3">
              <button
                onClick={() => upvotePost(post.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  isUpvoted
                    ? 'bg-raseen-gold/15 border-raseen-gold text-raseen-gold'
                    : 'bg-raseen-dark border-raseen-border text-slate-300 hover:text-white'
                }`}
                aria-label="تصويت للموضوع"
              >
                <span>▲</span>
                <span>تأييد الفكرة ({post.upvotes})</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-raseen-dark border border-raseen-border transition-colors"
                title="مشاركة الرابط"
              >
                <span>🔗</span>
                <span>مشاركة</span>
              </button>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-3">
              <span>{post.views} مشاهدة</span>
              <span>•</span>
              <span>{comments.length} رد</span>
            </div>
          </div>

        </article>

        {/* Comments Section */}
        <section className="space-y-6 mb-12">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>💬</span>
              <span>الردود والحلول المهنية ({comments.length})</span>
            </h2>
          </div>

          {comments.length === 0 ? (
            <div className="p-8 text-center bg-raseen-surface/50 rounded-2xl border border-raseen-border text-slate-400 text-xs">
              لا توجد ردود حتى الآن. كن أول من يشارك خبرته ويقدم حلاً معتمداً!
            </div>
          ) : (
            comments.map((comment) => {
              const isCommentUpvoted = upvotedCommentIds.includes(comment.id);

              return (
                <div
                  key={comment.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    comment.isSolution
                      ? 'bg-gradient-to-br from-green-500/10 to-raseen-surface border-green-500/50 shadow-lg shadow-green-500/5'
                      : 'bg-raseen-surface border-raseen-border'
                  }`}
                >
                  {/* Solution Badge Header */}
                  {comment.isSolution && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/40 text-xs font-bold mb-4">
                      <span>✓</span>
                      <span>الحل المعتمد من أصحاب الخبرة</span>
                    </div>
                  )}

                  {/* Author Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-raseen-dark flex items-center justify-center font-bold text-xs text-raseen-gold border border-raseen-border">
                        {comment.author.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-sm">{comment.author.name}</span>
                          {comment.author.verified && (
                            <span className="text-cyan-400 text-xs" title="خبير معتمد">✓</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{comment.author.title} • {comment.createdAt}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!comment.isSolution && (
                        <button
                          onClick={() => markCommentAsSolution(post.id, comment.id)}
                          className="text-[11px] text-slate-400 hover:text-green-400 border border-transparent hover:border-green-500/30 px-2 py-1 rounded-lg transition-colors"
                          title="اعتماد كحل"
                        >
                          اعتماد كحل ✓
                        </button>
                      )}

                      <button
                        onClick={() => upvoteComment(comment.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
                          isCommentUpvoted
                            ? 'bg-raseen-gold/15 text-raseen-gold border-raseen-gold'
                            : 'bg-raseen-dark text-slate-400 border-raseen-border hover:text-white'
                        }`}
                      >
                        <span>▲</span>
                        <span>{comment.upvotes}</span>
                      </button>
                    </div>
                  </div>

                  {/* Comment Body */}
                  <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line font-normal">
                    {comment.content}
                  </div>
                </div>
              );
            })
          )}

          {/* Add Reply Box */}
          <div id="reply-box" className="p-6 bg-raseen-surface rounded-2xl border border-raseen-border shadow-xl">
            <h3 className="font-bold text-white text-base mb-2 flex items-center gap-2">
              <span>✍️</span>
              <span>شارك خبرتك أو قدّم عرضك</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              الردود الاحترافية تمنحك شارة "خبير معتمد" وتزيد من ثقة العملاء في شراء أصولك الرقمية.
            </p>

            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <textarea
                rows={4}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="اكتب ردك التخصصي، الدوال المقترحة، أو تفاصيل العرض بالتفصيل..."
                className="w-full bg-raseen-dark border border-raseen-border rounded-xl p-4 text-sm text-white focus:outline-none focus:border-raseen-gold transition-colors leading-relaxed"
                required
              ></textarea>

              {!currentUser && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">الاسم</label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="اسمك الكريم"
                      className="w-full bg-raseen-dark border border-raseen-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-raseen-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">المسمى المهني</label>
                    <input
                      type="text"
                      value={guestTitle}
                      onChange={(e) => setGuestTitle(e.target.value)}
                      placeholder="مثال: محاسب قانوني"
                      className="w-full bg-raseen-dark border border-raseen-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-raseen-gold"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  className="btn-gold !px-6 !py-2.5 text-xs font-bold flex items-center gap-2 shadow-md shadow-raseen-gold/10"
                >
                  <span>نشر الرد الآن 💬</span>
                </button>
              </div>
            </form>
          </div>

        </section>

      </div>
    </main>
  );
}
