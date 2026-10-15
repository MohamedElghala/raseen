'use client';

import React from 'react';

export default function HorizonEclipseBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Subtle High-Tech Micro-Dot Grid */}
      <div 
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: 'radial-gradient(rgba(245, 183, 49, 0.4) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* 2. Top-Center Ambient Glow Mesh (Amber & Cyber Indigo) */}
      <div 
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[750px] max-w-[100vw] h-[350px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(245, 183, 49, 0.16) 0%, rgba(99, 102, 241, 0.12) 40%, transparent 75%)',
          filter: 'blur(70px)',
        }}
      />

      {/* 3. Subtle Lateral Atmosphere Glows */}
      <div 
        className="absolute top-1/3 -right-28 w-[400px] h-[400px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(245, 183, 49, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div 
        className="absolute top-1/2 -left-28 w-[400px] h-[400px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
    </div>
  );
}
