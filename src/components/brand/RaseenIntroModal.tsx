'use client';

import React, { useState } from 'react';
import RaseenMotionGraphic from './RaseenMotionGraphic';

interface RaseenIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RaseenIntroModal({ isOpen, onClose }: RaseenIntroModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in p-4">
      {/* Close/Skip Button */}
      <button
        onClick={onClose}
        className="absolute top-6 left-6 z-50 px-4 py-2 bg-rawnaq-surface/80 border border-slate-700 text-slate-300 hover:text-white hover:border-rawnaq-gold rounded-xl text-xs font-bold transition-all flex items-center gap-2"
      >
        <span>✕ تخطي الانترو (Skip Intro)</span>
      </button>

      {/* Main Intro Stage */}
      <div className="w-full max-w-4xl flex flex-col items-center justify-center">
        <RaseenMotionGraphic
          mode="intro"
          size="xl"
          soundEnabled={true}
          onComplete={() => {
            // Can auto-close or keep finished
          }}
        />

        <div className="mt-8 flex gap-4">
          <button
            onClick={onClose}
            className="btn-gold !py-2.5 !px-6 text-sm font-bold flex items-center gap-2"
          >
            <span>دخول إلى منصة رَصِيـن ➔</span>
          </button>
        </div>
      </div>
    </div>
  );
}
