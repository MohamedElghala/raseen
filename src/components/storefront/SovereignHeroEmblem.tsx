'use client';

import React from 'react';
import Image from 'next/image';

export default function SovereignHeroEmblem() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
      {/* Volumetric Radial Ambient Aura (Gold & Cyber Cyan) */}
      <div 
        className="absolute w-[680px] h-[440px] rounded-full blur-[80px] transform -translate-y-2 pointer-events-none opacity-80"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(245, 183, 49, 0.22) 0%, rgba(56, 189, 248, 0.14) 40%, transparent 75%)',
        }}
      />

      {/* Floating 3D Sovereign Aerodynamic Monogram Emblem */}
      <div className="relative w-[340px] sm:w-[420px] md:w-[480px] aspect-square flex items-center justify-center">
        <Image
          src="/brand/raseen_monogram.jpg"
          alt="رَصين الأيقونة السيادية"
          fill
          priority
          sizes="(max-width: 768px) 340px, 480px"
          className="object-contain transform transition-transform duration-1000 animate-hero-levitate"
          style={{
            mixBlendMode: 'lighten',
            WebkitMaskImage: 'radial-gradient(circle at center, black 48%, transparent 70%)',
            maskImage: 'radial-gradient(circle at center, black 48%, transparent 70%)',
            filter: 'drop-shadow(0 0 45px rgba(245, 183, 49, 0.45)) drop-shadow(0 0 80px rgba(56, 189, 248, 0.25))',
          }}
        />
      </div>
    </div>
  );
}
