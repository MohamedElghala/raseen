'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function LoginModal() {
  const isLoginOpen = useAuthStore((s) => s.isLoginOpen);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const toggleLoginModal = useAuthStore((s) => s.toggleLoginModal);
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('buyer');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoginOpen) return null;

  const validate = () => {
    if (!email) return 'البريد الإلكتروني مطلوب';
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'صيغة البريد الإلكتروني غير صحيحة';
    if (!password) return 'كلمة المرور مطلوبة';
    if (password.length < 6) return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    if (tab === 'register' && !name) return 'الاسم مطلوب';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      if (tab === 'login') {
        login(email, password);
      } else {
        register(name, email, password, role as any);
      }
      toggleLoginModal(false);
    } catch {
      setError('حدث خطأ أثناء العملية، يرجى المحاولة لاحقاً');
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoBuyer = () => {
    setTab('login');
    setEmail('buyer@rawnaq.com');
    setPassword('password123');
  };

  const setDemoVendor = () => {
    setTab('login');
    setEmail('vendor@rawnaq.com');
    setPassword('password123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity">
      <div 
        className="absolute inset-0" 
        onClick={() => toggleLoginModal(false)} 
        aria-hidden="true"
      />
      
      <div className="relative w-full max-w-md bg-rawnaq-dark border border-rawnaq-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header tabs */}
        <div className="flex border-b border-rawnaq-border">
          <button 
            onClick={() => { setTab('login'); setError(''); }}
            className={`flex-1 py-4 text-center font-bold transition-colors min-h-[44px]
              ${tab === 'login' ? 'text-rawnaq-gold border-b-2 border-rawnaq-gold bg-rawnaq-surface/50' : 'text-slate-400 hover:text-white hover:bg-rawnaq-surface/30'}`}
          >
            تسجيل الدخول
          </button>
          <button 
            onClick={() => { setTab('register'); setError(''); }}
            className={`flex-1 py-4 text-center font-bold transition-colors min-h-[44px]
              ${tab === 'register' ? 'text-rawnaq-gold border-b-2 border-rawnaq-gold bg-rawnaq-surface/50' : 'text-slate-400 hover:text-white hover:bg-rawnaq-surface/30'}`}
          >
            إنشاء حساب
          </button>
          
          <button 
            onClick={() => toggleLoginModal(false)}
            aria-label="إغلاق النافذة"
            className="absolute top-3 left-3 p-2 text-slate-400 hover:text-white hover:bg-rawnaq-navy rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm font-medium">
                {error}
              </div>
            )}
            
            {tab === 'register' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-slate-300 font-medium" htmlFor="name">الاسم بالكامل</label>
                <input 
                  id="name"
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="min-h-[44px] w-full px-4 rounded-lg bg-rawnaq-surface border border-rawnaq-border text-white placeholder-slate-500 focus:outline-none focus:border-rawnaq-gold transition-colors"
                  placeholder="محمد أحمد"
                  aria-required="true"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-slate-300 font-medium" htmlFor="email">البريد الإلكتروني</label>
              <input 
                id="email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-h-[44px] w-full px-4 rounded-lg bg-rawnaq-surface border border-rawnaq-border text-white placeholder-slate-500 focus:outline-none focus:border-rawnaq-gold transition-colors text-left"
                placeholder="example@email.com"
                dir="ltr"
                aria-required="true"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-slate-300 font-medium" htmlFor="password">كلمة المرور</label>
              <input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="min-h-[44px] w-full px-4 rounded-lg bg-rawnaq-surface border border-rawnaq-border text-white placeholder-slate-500 focus:outline-none focus:border-rawnaq-gold transition-colors text-left"
                placeholder="••••••••"
                dir="ltr"
                aria-required="true"
              />
            </div>

            {tab === 'register' && (
              <div className="flex flex-col gap-1.5 mt-2">
                <span className="text-sm text-slate-300 font-medium">نوع الحساب</span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="role" 
                      value="buyer"
                      checked={role === 'buyer'}
                      onChange={() => setRole('buyer')}
                      className="w-4 h-4 text-rawnaq-gold focus:ring-rawnaq-gold border-gray-600 bg-rawnaq-dark"
                    />
                    <span className="text-white text-sm">مشتري</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="role" 
                      value="vendor"
                      checked={role === 'vendor'}
                      onChange={() => setRole('vendor')}
                      className="w-4 h-4 text-rawnaq-gold focus:ring-rawnaq-gold border-gray-600 bg-rawnaq-dark"
                    />
                    <span className="text-white text-sm">بائع</span>
                  </label>
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full min-h-[44px] bg-rawnaq-gold hover:bg-[#e0a629] text-rawnaq-dark font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-rawnaq-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  جاري المعالجة...
                </>
              ) : (
                tab === 'login' ? 'دخول' : 'إنشاء حساب جديد'
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-rawnaq-border/50">
            <p className="text-center text-sm text-slate-400 mb-4">الدخول السريع (للتجربة)</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={setDemoBuyer}
                type="button"
                className="w-full min-h-[44px] bg-rawnaq-surface hover:bg-rawnaq-surface/70 border border-rawnaq-border text-white text-sm font-medium rounded-lg transition-colors"
              >
                دخول كمشتري (تجربة)
              </button>
              <button 
                onClick={setDemoVendor}
                type="button"
                className="w-full min-h-[44px] bg-rawnaq-surface hover:bg-rawnaq-surface/70 border border-rawnaq-border text-white text-sm font-medium rounded-lg transition-colors"
              >
                دخول كبائع (تجربة)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
