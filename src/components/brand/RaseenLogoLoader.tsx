'use client';

import React from 'react';
import Image from 'next/image';

interface RaseenLogoLoaderProps {
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function RaseenLogoLoader({
  label = 'جاري التحميل ومعالجة الطلب...',
  sublabel = 'يرجى الانتظار بينما نقوم بتجهيز الروابط المشفرة',
  size = 'md',
}: RaseenLogoLoaderProps) {
  const sizeMap = {
    sm: { container: 'w-24 h-24', img: 64, text: 'text-xs' },
    md: { container: 'w-36 h-36', img: 96, text: 'text-sm' },
    lg: { container: 'w-48 h-48', img: 128, text: 'text-base' },
  }[size];

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none animate-fade-in-up">
      {/* 3D Motion Chamber */}
      <div className={`relative ${sizeMap.container} flex items-center justify-center mb-4`}>
        {/* Hologram Pulse Ring */}
        <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping opacity-30" />
        <div
          className="absolute inset-0 rounded-full border border-dashed border-rawnaq-gold/40 animate-spin"
          style={{ animationDuration: '4s' }}
        />
        <div
          className="absolute inset-2 rounded-full border border-dotted border-cyan-400/50 animate-spin"
          style={{ animationDuration: '8s', animationDirection: 'reverse' }}
        />

        {/* Central Glowing Icon */}
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border border-cyan-400/40 shadow-xl shadow-cyan-900/40 bg-rawnaq-dark/40 backdrop-blur-md flex items-center justify-center p-2">
          <Image
            src="/brand/logo_transparent.png"
            alt="رَصين - لودر التحميل"
            fill
            className="object-contain animate-pulse p-2"
          />
        </div>
      </div>

      {/* Status Label */}
      <div className="space-y-1">
        <h4 className={`font-black text-white ${sizeMap.text} flex items-center justify-center gap-2`}>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{label}</span>
        </h4>
        {sublabel && (
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
}
