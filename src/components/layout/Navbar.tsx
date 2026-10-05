'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import type { Currency } from '@/lib/types';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalItems = useCartStore((s) => s.totalItems);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const currency = useCartStore((s) => s.currency);
  const setCurrency = useCartStore((s) => s.setCurrency);

  const user = useAuthStore((s) => s.user);
  const toggleLoginModal = useAuthStore((s) => s.toggleLoginModal);
  const logout = useAuthStore((s) => s.logout);

  const cartCount = totalItems();

  const navLinks = [
    { href: '/#products', label: 'السوق الرقمي', icon: '🛒' },
    { href: '/editor', label: 'محرر القوالب (Canva Studio)', icon: '🎨' },
    { href: '/tools', label: 'أدوات مجانية', icon: '🛠️' },
    { href: '/vendor', label: 'بوابة البائعين', icon: '🏪' },
  ];

  return (
    <header className="sticky top-0 z-50 rawnaq-glass border-x-0 border-t-0 rounded-none border-b border-rawnaq-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Logo with Refined Mobius Infinity Ribbon */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group" aria-label="الرئيسية - رَصين">
            <div className="relative w-11 h-11 rounded-xl bg-rawnaq-surface border border-rawnaq-border flex items-center justify-center p-2 group-hover:border-rawnaq-gold/60 transition-all duration-300 shadow-lg shadow-black/50">
              <svg viewBox="0 0 32 32" fill="none" className="w-full h-full transform group-hover:scale-105 transition-transform duration-300">
                <path 
                  d="M7 16C7 11.5817 10.5817 8 15 8C19.4183 8 20.5 13 25 13C27.2091 13 29 14.7909 29 17C29 19.2091 27.2091 21 25 21C20.5 21 19.4183 16 15 16C10.5817 16 7 19.5817 7 24" 
                  stroke="url(#mobiusNavbarGrad)" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                />
                <circle cx="25" cy="17" r="2.5" fill="#f5b731"/>
                <circle cx="7" cy="16" r="2" fill="#fef08a"/>
                <defs>
                  <linearGradient id="mobiusNavbarGrad" x1="7" y1="8" x2="29" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fef08a"/>
                    <stop offset="0.5" stopColor="#f5b731"/>
                    <stop offset="1" stopColor="#c9962a"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 leading-none">
                <span className="text-2xl md:text-3xl font-black gold-gradient-text tracking-tight font-cairo">رَصِيـن</span>
                <span className="text-slate-500 text-xs font-light">|</span>
                <span className="text-xs md:text-sm font-black tracking-[0.2em] text-white font-sans uppercase">RASEEN</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:block mt-0.5">منصة الأصول الرقمية والإبداعية</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-1" aria-label="القائمة الرئيسية">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-300 hover:text-rawnaq-gold transition-colors font-medium px-4 py-2 rounded-lg hover:bg-rawnaq-accent/30"
              >
                {link.icon} {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">

            {/* Currency Switcher */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="bg-rawnaq-surface border border-rawnaq-border text-slate-300 rounded-lg px-2 py-1.5 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-rawnaq-gold min-h-[44px] cursor-pointer"
              aria-label="تغيير العملة"
            >
              <option value="EGP">🇪🇬 EGP</option>
              <option value="SAR">🇸🇦 SAR</option>
              <option value="AED">🇦🇪 AED</option>
              <option value="USD">🇺🇸 USD</option>
            </select>

            {/* Cart Button */}
            <button
              onClick={() => toggleCart()}
              className="relative p-2 text-slate-300 hover:text-rawnaq-gold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-rawnaq-accent/30"
              aria-label={`سلة المشتريات (${cartCount} عنصر)`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.076.721-.506 1.393-1.235 1.393H4.366a1.25 1.25 0 01-1.235-1.393l1.263-12A1.25 1.25 0 015.63 8.507h12.74c.648 0 1.18.493 1.236 1.143z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -left-0.5 bg-rawnaq-gold text-rawnaq-dark text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth */}
            <div className="hidden md:block">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link href="/dashboard" className="btn-outline !px-3 !py-1.5 text-sm">
                    {user.name}
                  </Link>
                  <button
                    onClick={logout}
                    className="text-slate-400 hover:text-red-400 text-xs transition-colors"
                    aria-label="تسجيل الخروج"
                  >
                    خروج
                  </button>
                </div>
              ) : (
                <button onClick={() => toggleLoginModal(true)} className="btn-gold !px-4 !py-2 text-sm">
                  تسجيل الدخول
                </button>
              )}
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-rawnaq-gold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="القائمة الرئيسية"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-rawnaq-dark/95 backdrop-blur-lg border-t border-rawnaq-border animate-fade-in-up">
          <div className="px-4 pt-2 pb-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-slate-200 hover:text-rawnaq-gold font-medium py-3 border-b border-rawnaq-border/50 min-h-[44px]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.icon} {link.label}
              </Link>
            ))}

            <div className="pt-3">
              {user ? (
                <div className="flex flex-col gap-3">
                  <Link href="/dashboard" className="btn-outline text-center" onClick={() => setIsMobileMenuOpen(false)}>
                    حسابي — {user.name}
                  </Link>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-red-400 text-sm py-2">
                    تسجيل الخروج
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { toggleLoginModal(true); setIsMobileMenuOpen(false); }}
                  className="btn-gold w-full text-center"
                >
                  تسجيل الدخول
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
