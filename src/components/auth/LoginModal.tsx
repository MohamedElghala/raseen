'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useAuthStore } from '@/store/authStore';
import { checkPasswordStrength } from '@/lib/passwords';

export default function LoginModal() {
  const isLoginOpen = useAuthStore((s) => s.isLoginOpen);
  const toggleLoginModal = useAuthStore((s) => s.toggleLoginModal);
  
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'buyer' | 'vendor'>('buyer');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoginOpen) return null;

  const pwdStrength = checkPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('يرجى إدخال عنوان بريد إلكتروني صحيح');
      return;
    }

    if (!password) {
      setError('كلمة المرور مطلوبة');
      return;
    }

    if (tab === 'register') {
      if (!name || name.trim().length < 2) {
        setError('يرجى إدخال الاسم بالكامل (حرفين على الأقل)');
        return;
      }
      if (!pwdStrength.isValid) {
        setError(pwdStrength.message || 'كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على أرقام وحروف');
        return;
      }
      if (password !== confirmPassword) {
        setError('كلمتا المرور غير متطابقتين');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (tab === 'register') {
        // 1. Call real register API to save in Supabase PostgreSQL
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'فشل إنشاء الحساب');
        }

        setSuccess('تم إنشاء حسابك بنجاح في قاعدة البيانات! جاري تسجيل الدخول...');
        
        // Auto login with credentials
        const loginRes = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (loginRes?.error) {
          setTab('login');
          setError('تم إنشاء الحساب، يرجى تسجيل الدخول');
        } else {
          setTimeout(() => {
            toggleLoginModal(false);
            window.location.reload();
          }, 800);
        }

      } else {
        // 2. Real Login with Credentials
        const loginRes = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (loginRes?.error) {
          setError(loginRes.error === 'CredentialsSignin' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : loginRes.error);
        } else {
          toggleLoginModal(false);
          window.location.reload();
        }
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في الاتصال، يرجى المحاولة لاحقاً');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestBrowsing = () => {
    toggleLoginModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity">
      <div 
        className="absolute inset-0" 
        onClick={() => toggleLoginModal(false)} 
        aria-hidden="true"
      />
      
      <div className="relative w-full max-w-md bg-[#0a1224] border border-rawnaq-border/90 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        
        {/* Header tabs */}
        <div className="flex border-b border-rawnaq-border/60 bg-rawnaq-dark/40">
          <button 
            type="button"
            onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
            className={`flex-1 py-3.5 text-center font-bold text-sm transition-colors min-h-[44px]
              ${tab === 'login' ? 'text-rawnaq-gold border-b-2 border-rawnaq-gold bg-rawnaq-surface/40' : 'text-slate-400 hover:text-white'}`}
          >
            تسجيل الدخول
          </button>
          <button 
            type="button"
            onClick={() => { setTab('register'); setError(''); setSuccess(''); }}
            className={`flex-1 py-3.5 text-center font-bold text-sm transition-colors min-h-[44px]
              ${tab === 'register' ? 'text-rawnaq-gold border-b-2 border-rawnaq-gold bg-rawnaq-surface/40' : 'text-slate-400 hover:text-white'}`}
          >
            إنشاء حساب جديد
          </button>
          
          <button 
            type="button"
            onClick={() => toggleLoginModal(false)}
            aria-label="إغلاق النافذة"
            className="absolute top-2.5 left-2.5 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-6">

          {/* Account Role Selector */}
          <div className="mb-5">
            <span className="text-xs text-slate-400 font-bold block mb-2">نوع الحساب المطلوب:</span>
            <div className="grid grid-cols-2 gap-2 p-1 bg-rawnaq-surface/80 rounded-xl border border-rawnaq-border">
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[38px] ${
                  role === 'buyer' 
                    ? 'bg-rawnaq-gold text-rawnaq-dark shadow' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>🛒</span>
                <span>عميل / مشتري</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('vendor')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[38px] ${
                  role === 'vendor' 
                    ? 'bg-rawnaq-gold text-rawnaq-dark shadow' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>🏪</span>
                <span>بائع / صانع محتوى</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 text-center">
              {role === 'buyer' ? 'تصفح وتحميل الأصول والشيتات الرقمية فوراً' : 'إنشاء متجرك الخاص وبيع ملفاتك وجني أرباح 85%'}
            </p>
          </div>

          {/* Quick Google Sign In */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: role === 'vendor' ? '/vendor' : '/' })}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm transition-all shadow flex items-center justify-center gap-3 border border-slate-200 active:scale-95 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>المتابعة باستخدام Google</span>
            </button>

            <div className="relative my-3 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-rawnaq-border/60"></div>
              </div>
              <span className="relative px-3 bg-[#0a1224] text-[11px] text-slate-400">أو بالبريد الإلكتروني المباشر</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {error && (
              <div className="p-2.5 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-xs font-medium">
                {error}
              </div>
            )}

            {success && (
              <div className="p-2.5 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-xs font-medium">
                {success}
              </div>
            )}
            
            {tab === 'register' && (
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-300 font-medium" htmlFor="name">الاسم بالكامل</label>
                <input 
                  id="name"
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="min-h-[42px] w-full px-3.5 rounded-lg bg-rawnaq-surface border border-rawnaq-border text-white placeholder-slate-500 focus:outline-none focus:border-rawnaq-gold transition-colors text-xs sm:text-sm"
                  placeholder="محمد حلمي"
                  required
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-300 font-medium" htmlFor="email">البريد الإلكتروني</label>
              <input 
                id="email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-h-[42px] w-full px-3.5 rounded-lg bg-rawnaq-surface border border-rawnaq-border text-white placeholder-slate-500 focus:outline-none focus:border-rawnaq-gold transition-colors text-left text-xs sm:text-sm"
                placeholder="name@domain.com"
                dir="ltr"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-300 font-medium" htmlFor="password">كلمة المرور</label>
              <input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="min-h-[42px] w-full px-3.5 rounded-lg bg-rawnaq-surface border border-rawnaq-border text-white placeholder-slate-500 focus:outline-none focus:border-rawnaq-gold transition-colors text-left text-xs sm:text-sm"
                placeholder="••••••••"
                dir="ltr"
                required
              />
              
              {/* Real-time Password Strength Indicator for Register */}
              {tab === 'register' && password && (
                <div className="mt-1">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-400">قوة كلمة المرور:</span>
                    <span style={{ color: pwdStrength.color }} className="font-bold">{pwdStrength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div 
                        key={step} 
                        className="flex-1 h-full rounded-full transition-all"
                        style={{ 
                          backgroundColor: step <= pwdStrength.score ? pwdStrength.color : '#334155' 
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {tab === 'register' && (
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-300 font-medium" htmlFor="confirmPassword">تأكيد كلمة المرور</label>
                <input 
                  id="confirmPassword"
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="min-h-[42px] w-full px-3.5 rounded-lg bg-rawnaq-surface border border-rawnaq-border text-white placeholder-slate-500 focus:outline-none focus:border-rawnaq-gold transition-colors text-left text-xs sm:text-sm"
                  placeholder="••••••••"
                  dir="ltr"
                  required
                />
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full min-h-[44px] bg-rawnaq-gold hover:bg-[#e0a629] text-rawnaq-dark font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm cursor-pointer"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-rawnaq-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  جاري التحقق والمزامنة مع السيرفر...
                </>
              ) : (
                tab === 'login' ? 'دخول آمن للمنصة' : `إنشاء حساب ${role === 'vendor' ? 'بائع' : 'عميل'} رسمي`
              )}
            </button>
          </form>

          {/* Guest Mode - Clear, Restricted, Professional */}
          <div className="mt-4 pt-3 border-t border-rawnaq-border/50 text-center">
            <button 
              onClick={handleGuestBrowsing}
              type="button"
              className="text-xs text-slate-400 hover:text-rawnaq-gold transition-colors font-medium underline underline-offset-4"
            >
              المتابعة بالتصفح كزائر (بدون حساب)
            </button>
            <p className="text-[10px] text-slate-500 mt-1">
              * التصفح كزائر يتيح استكشاف المنتجات والبحث وتجربة الأدوات، ويلزم تسجيل حساب عند الشراء أو التحميل.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
