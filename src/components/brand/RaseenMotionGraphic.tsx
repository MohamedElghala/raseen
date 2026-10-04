'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export type MotionMode = 'intro' | 'loader' | 'showcase';

interface RaseenMotionGraphicProps {
  mode?: MotionMode;
  onComplete?: () => void;
  autoPlay?: boolean;
  loop?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  soundEnabled?: boolean;
}

export default function RaseenMotionGraphic({
  mode = 'showcase',
  onComplete,
  autoPlay = true,
  loop = mode === 'loader',
  size = 'lg',
  soundEnabled = false,
}: RaseenMotionGraphicProps) {
  // Phases: 0: Idle/Spin, 1: Assembling, 2: Hologram Projection, 3: Completed Lockup
  const [phase, setPhase] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [isMuted, setIsMuted] = useState<boolean>(!soundEnabled);
  const [speed, setSpeed] = useState<number>(1);
  const [activeLayers, setActiveLayers] = useState({
    spin3D: true,
    goldenRibbon: true,
    hologramGrid: true,
    bezierCurves: true,
    dataIndicators: true,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Web Audio Synthesizer for High-Tech Sound FX
  const playSoundEffect = (type: 'whoosh' | 'build' | 'hologram' | 'lock') => {
    if (isMuted || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'whoosh') {
        // Sci-Fi Low Whoosh
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.35);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'build') {
        // Digital Laser Sweep
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(850, now + 0.3);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'hologram') {
        // High-Tech Cyber Shimmer
        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.45);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === 'lock') {
        // Crisp Tech Lock Chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      }
    } catch {
      // Audio playback fails gracefully if browser restricts
    }
  };

  // Choreography Sequence Controller
  useEffect(() => {
    if (!isPlaying) return;

    const phaseDurations = [
      1200 / speed, // Phase 0: 3D Spin
      1400 / speed, // Phase 1: Construction & Assembly
      1600 / speed, // Phase 2: Hologram & Blueprint Reveal
      1800 / speed, // Phase 3: Final Lockup
    ];

    if (phase === 0) {
      playSoundEffect('whoosh');
      timerRef.current = setTimeout(() => {
        setPhase(1);
      }, phaseDurations[0]);
    } else if (phase === 1) {
      playSoundEffect('build');
      timerRef.current = setTimeout(() => {
        setPhase(2);
      }, phaseDurations[1]);
    } else if (phase === 2) {
      playSoundEffect('hologram');
      timerRef.current = setTimeout(() => {
        setPhase(3);
      }, phaseDurations[2]);
    } else if (phase === 3) {
      playSoundEffect('lock');
      if (loop) {
        timerRef.current = setTimeout(() => {
          setPhase(0);
        }, phaseDurations[3]);
      } else if (onComplete) {
        timerRef.current = setTimeout(() => {
          onComplete();
        }, phaseDurations[3]);
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, isPlaying, speed, loop]);

  const restartMotion = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase(0);
    setIsPlaying(true);
  };

  // Dimensions by size prop
  const sizeClasses = {
    sm: 'w-40 h-40',
    md: 'w-64 h-64',
    lg: 'w-80 h-80 md:w-96 md:h-96',
    xl: 'w-96 h-96 md:w-[480px] md:h-[480px]',
    fullscreen: 'w-full h-full min-h-[500px]',
  }[size];

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${size === 'fullscreen' ? 'w-full' : ''}`}>
      {/* 3D Motion Arena */}
      <div
        className={`relative ${sizeClasses} flex items-center justify-center overflow-hidden rounded-3xl bg-radial from-[#0e1a38]/80 to-[#070d1e] border border-cyan-500/20 shadow-2xl shadow-cyan-950/40`}
        style={{ perspective: '1200px' }}
      >
        {/* Hologram Background Grid & Cyber Waves (Visible in Phases 2 and 3) */}
        {activeLayers.hologramGrid && (
          <div
            className={`absolute inset-0 pointer-events-none transition-all duration-700 ${
              phase >= 2 ? 'opacity-100 scale-100' : 'opacity-10 scale-95'
            }`}
          >
            {/* Perspective Cyber Floor / Matrix Grid */}
            <div
              className="absolute inset-0 bg-[linear-gradient(to_right,#00d2ff12_1px,transparent_1px),linear-gradient(to_bottom,#00d2ff12_1px,transparent_1px)] bg-[size:24px_24px]"
              style={{
                maskImage: 'radial-gradient(circle at center, black 40%, transparent 85%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 85%)',
              }}
            />

            {/* Excel & Blueprint Window Simulation Behind */}
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[72%] h-[72%] border border-cyan-400/30 rounded-xl bg-cyan-950/15 backdrop-blur-[2px] transition-all duration-1000 ${
                phase >= 2 ? 'scale-100 opacity-90' : 'scale-75 opacity-0'
              }`}
            >
              {/* Window Header */}
              <div className="h-5 border-b border-cyan-500/25 px-2 flex items-center justify-between text-[9px] text-cyan-400/80 font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-ping"></span>
                  RASEEN_ASSETS_MATRIX.v3
                </span>
                <span className="text-[8px] text-cyan-300/60">HMAC_SHA256 // ENCRYPTED</span>
              </div>

              {/* Blueprint Spreadsheet Cells */}
              <div className="p-2 grid grid-cols-4 gap-1 opacity-40 text-[8px] font-mono text-cyan-300">
                <div className="border border-cyan-500/20 p-0.5 rounded">R_MOD</div>
                <div className="border border-cyan-500/20 p-0.5 rounded">CAD_3D</div>
                <div className="border border-cyan-500/20 p-0.5 rounded">XLS_99</div>
                <div className="border border-cyan-500/20 p-0.5 rounded">ROI_85%</div>
              </div>
            </div>

            {/* Glowing Laser Scanline */}
            <div
              className={`absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#00d2ff] transition-all duration-1000 ${
                phase === 2 ? 'top-[85%] opacity-100 animate-pulse' : 'top-0 opacity-0'
              }`}
            />
          </div>
        )}

        {/* Orbiting Tech Particles & Gyro Rings */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Orbital Ring 1 (Gold) */}
          <div
            className={`w-[85%] h-[85%] rounded-full border border-dashed border-rawnaq-gold/25 transition-transform duration-1000 ${
              phase === 0 ? 'animate-spin' : 'rotate-45'
            }`}
            style={{ animationDuration: '6s' }}
          />
          {/* Orbital Ring 2 (Cyan Holographic) */}
          <div
            className={`w-[95%] h-[95%] rounded-full border border-dotted border-cyan-400/30 transition-transform duration-1000 ${
              phase >= 2 ? 'animate-spin' : 'rotate-12'
            }`}
            style={{ animationDuration: '10s' }}
          />
        </div>

        {/* Central 3D Transforming Hybrid Lettermark (R / ر) */}
        <div
          className="relative z-20 flex items-center justify-center transition-all duration-700 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform:
              phase === 0 && activeLayers.spin3D
                ? 'rotateY(720deg) scale(0.85)'
                : phase === 1
                ? 'rotateY(0deg) scale(0.92)'
                : phase === 2
                ? 'rotateY(0deg) scale(1.02)'
                : 'rotateY(0deg) scale(1)',
            transition: 'transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          {/* Luminous Glow Aura */}
          <div
            className={`absolute w-44 h-44 rounded-full blur-2xl transition-all duration-700 pointer-events-none ${
              phase >= 2
                ? 'bg-gradient-to-tr from-cyan-500/30 via-rawnaq-gold/30 to-cyan-400/20 scale-125 opacity-100'
                : 'bg-rawnaq-gold/15 scale-90 opacity-40'
            }`}
          />

          {/* Official Holographic Emblem Image */}
          <div className="relative w-48 h-48 md:w-56 md:h-56 select-none">
            <Image
              src="/brand/tech/tech_3_digital_sheets.jpg"
              alt="شعار رَصين الموشن جرافيك"
              fill
              className={`object-contain transition-all duration-700 ${
                phase === 0
                  ? 'brightness-125 contrast-125 filter drop-shadow-[0_0_20px_rgba(245,183,49,0.5)]'
                  : phase === 1
                  ? 'brightness-110 drop-shadow-[0_0_25px_rgba(0,210,255,0.4)]'
                  : 'brightness-105 drop-shadow-[0_0_35px_rgba(0,210,255,0.6)]'
              }`}
              priority
            />

            {/* Bezier Curves & Vector Anchor Nodes (Active in Phase 2 & 3) */}
            {activeLayers.bezierCurves && phase >= 2 && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none animate-fade-in-up"
                viewBox="0 0 200 200"
              >
                {/* Dynamic Bezier Tangent Line */}
                <line
                  x1="60"
                  y1="140"
                  x2="150"
                  y2="90"
                  stroke="#00d2ff"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                  className="opacity-70"
                />
                <circle cx="60" cy="140" r="3.5" fill="#00d2ff" className="animate-ping" />
                <circle cx="60" cy="140" r="3" fill="#ffffff" />
                <circle cx="150" cy="90" r="3.5" fill="#f5b731" className="animate-ping" />
                <circle cx="150" cy="90" r="3" fill="#f5b731" />

                {/* Vector Arc Trace */}
                <path
                  d="M 50,70 Q 110,40 145,95 T 160,150"
                  fill="none"
                  stroke="url(#cyanGoldGrad)"
                  strokeWidth="1.8"
                  strokeDasharray="200"
                  strokeDashoffset={phase === 3 ? '0' : '40'}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="cyanGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00d2ff" />
                    <stop offset="100%" stopColor="#f5b731" />
                  </linearGradient>
                </defs>
              </svg>
            )}
          </div>
        </div>

        {/* Live Tech Data Telemetry Badges (Active in Phases 2 and 3) */}
        {activeLayers.dataIndicators && (
          <div
            className={`absolute inset-x-3 bottom-3 flex justify-between items-center text-[10px] font-mono transition-opacity duration-700 pointer-events-none ${
              phase >= 2 ? 'opacity-90' : 'opacity-0'
            }`}
          >
            <span className="px-2 py-0.5 rounded bg-black/60 border border-cyan-500/30 text-cyan-300 backdrop-blur-sm">
              ▲ R / ر // FUSION ACTIVE
            </span>
            <span className="px-2 py-0.5 rounded bg-black/60 border border-rawnaq-gold/30 text-rawnaq-gold backdrop-blur-sm">
              HOLO-ASSET // 100% READY
            </span>
          </div>
        )}

        {/* Shockwave Flash Burst on Lockup (Phase 3 Trigger) */}
        {phase === 3 && (
          <div className="absolute inset-0 bg-cyan-400/10 pointer-events-none animate-ping rounded-3xl" />
        )}
      </div>

      {/* Intro Branding Reveal (When in Intro or Showcase mode) */}
      {(mode === 'intro' || mode === 'showcase') && (
        <div
          className={`mt-6 text-center transition-all duration-700 ${
            phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-1">
            <span className="text-3xl md:text-4xl font-black gold-gradient-text tracking-tight font-cairo">
              رَصِيـن
            </span>
            <span className="text-cyan-400 text-lg font-light">|</span>
            <span className="text-base md:text-lg font-black tracking-[0.25em] text-white font-sans uppercase">
              RASEEN
            </span>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            رصيدك الذكي من الأدوات والخبرات الجاهزة
          </p>

          {/* Phase Status Pill */}
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rawnaq-surface/80 border border-cyan-500/30 text-[11px] text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>
              {phase === 0 && 'مرحلة 1: الدوران ثلاثي الأبعاد والتسارع (3D Spin)'}
              {phase === 1 && 'مرحلة 2: البناء الهيكلي لشريط الذهب (Ribbon Assembly)'}
              {phase === 2 && 'مرحلة 3: انبثاق الهولوغرام وشبكة الشيتات (Holo-Grid Projection)'}
              {phase === 3 && 'مرحلة 4: اكتمال وثبات الهوية الموثوقة (Identity Lockup)'}
            </span>
          </div>
        </div>
      )}

      {/* Interactive Controls Bar (Only in Showcase Mode) */}
      {mode === 'showcase' && (
        <div className="mt-6 w-full max-w-xl p-4 bg-rawnaq-surface/90 border border-rawnaq-border rounded-2xl backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Play/Replay Button */}
            <button
              onClick={restartMotion}
              className="px-4 py-2 bg-rawnaq-gold text-rawnaq-dark font-bold rounded-xl hover:bg-rawnaq-gold-hover transition-all flex items-center gap-1.5 shadow-md shadow-rawnaq-gold/20"
            >
              <span>↺</span>
              <span>إعادة تشغيل الحركة من البداية</span>
            </button>

            {/* Mute/Sound Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`px-3 py-2 rounded-xl border transition-all flex items-center gap-1.5 ${
                isMuted
                  ? 'border-slate-700 text-slate-400 hover:text-white'
                  : 'border-cyan-500/50 text-cyan-300 bg-cyan-950/30'
              }`}
            >
              <span>{isMuted ? '🔇 الصوت مكتوم' : '🔊 المؤثر الصوتي نشط'}</span>
            </button>

            {/* Speed Selector */}
            <div className="flex items-center gap-1 bg-rawnaq-dark px-2 py-1 rounded-xl border border-rawnaq-border">
              <span className="text-slate-400 text-[11px]">السرعة:</span>
              {[0.75, 1, 1.5].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    speed === s ? 'bg-rawnaq-gold text-rawnaq-dark' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Layer Switches */}
          <div className="mt-3 pt-3 border-t border-rawnaq-border/60 flex flex-wrap gap-2 text-[11px]">
            <span className="text-slate-400 self-center">الطبقات:</span>
            <button
              onClick={() =>
                setActiveLayers((prev) => ({ ...prev, hologramGrid: !prev.hologramGrid }))
              }
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                activeLayers.hologramGrid
                  ? 'border-cyan-500/40 text-cyan-300 bg-cyan-950/20'
                  : 'border-slate-800 text-slate-500'
              }`}
            >
              شبكة الهولوغرام
            </button>
            <button
              onClick={() =>
                setActiveLayers((prev) => ({ ...prev, bezierCurves: !prev.bezierCurves }))
              }
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                activeLayers.bezierCurves
                  ? 'border-cyan-500/40 text-cyan-300 bg-cyan-950/20'
                  : 'border-slate-800 text-slate-500'
              }`}
            >
              منحنيات بيزييه (Bezier)
            </button>
            <button
              onClick={() =>
                setActiveLayers((prev) => ({ ...prev, spin3D: !prev.spin3D }))
              }
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                activeLayers.spin3D
                  ? 'border-rawnaq-gold/40 text-rawnaq-gold bg-rawnaq-gold/10'
                  : 'border-slate-800 text-slate-500'
              }`}
            >
              الدوران ثلاثي الأبعاد
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
