'use client';

import React from 'react';

export default function HorizonEclipseBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* 1. Modern Obsidian / Slate Base Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, #1E293B 0%, #0F172A 45%, #0B0F17 100%)',
        }}
      />

      {/* 2. High-Tech Micro-Grid Pattern with Radial Fade Mask */}
      <div 
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, #000 30%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, #000 30%, transparent 85%)',
        }}
      />

      {/* 3. Subtle Ambient Cyan & Emerald Backlighting */}
      {/* Top-Center Ambient Cyan Glow */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] max-w-[100vw] h-[360px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.14) 0%, rgba(15, 23, 42, 0.05) 55%, transparent 75%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Lateral Left Ambient Emerald Glow */}
      <div 
        className="absolute top-1/4 -left-20 w-[420px] h-[420px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.09) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />

      {/* Lateral Right Ambient Cyan/Slate Glow */}
      <div 
        className="absolute top-1/3 -right-20 w-[420px] h-[420px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, rgba(30, 41, 59, 0.15) 40%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />

      {/* 4. Fine Glassmorphic Horizontal Horizon Accent Line */}
      <div 
        className="absolute top-0 left-0 right-0 h-[1px] opacity-30"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.4) 30%, rgba(16, 185, 129, 0.4) 70%, transparent 100%)',
        }}
      />
    </div>
  );
}

