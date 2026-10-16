'use client';

import React, { useState, useEffect } from 'react';

interface ReadingProgressBarProps {
  className?: string;
}

export default function ReadingProgressBar({ className = '' }: ReadingProgressBarProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      role="progressbar"
      aria-label="مؤشر تقدم القراءة"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`fixed top-0 left-0 right-0 z-50 h-1 bg-slate-900/40 backdrop-blur-sm pointer-events-none ${className}`}
    >
      <div
        className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 transition-[width] duration-150 ease-out shadow-[0_0_12px_rgba(251,191,36,0.5)]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
