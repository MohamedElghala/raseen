'use client';

import React from 'react';

export default function HorizonEclipseBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Deep Space Radial Ambient Glow */}
      <div 
        className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] max-w-[120vw] h-[260px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(245, 183, 49, 0.28) 0%, rgba(217, 119, 6, 0.14) 35%, transparent 70%)',
          filter: 'blur(45px)',
        }}
      />

      {/* 2. Luminous Razor-Sharp Horizon Beam (Gold & Cyber Cyan Accent) */}
      <div 
        className="absolute top-[35%] left-[8%] right-[8%] h-[2px] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(56, 189, 248, 0.6) 18%, #fef08a 50%, rgba(245, 183, 49, 0.85) 82%, transparent 100%)',
          boxShadow: '0 0 25px rgba(245, 183, 49, 0.9), 0 0 55px rgba(56, 189, 248, 0.55)',
        }}
      />

      {/* 3. Colossal Architectural Horizon Disc */}
      <div 
        className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[850px] max-w-[125vw] h-[850px] rounded-full pointer-events-none"
        style={{
          background: '#060a14',
          borderTop: '2px solid rgba(245, 183, 49, 0.75)',
          boxShadow: '0 -15px 45px rgba(245, 183, 49, 0.25)',
        }}
      />
    </div>
  );
}
