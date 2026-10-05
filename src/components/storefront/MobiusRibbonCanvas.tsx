'use client';

import React, { useEffect, useRef } from 'react';

export default function MobiusRibbonCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const SEGMENTS = 140;
    const PARTICLE_COUNT = 24;
    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      u: (i / PARTICLE_COUNT) * Math.PI * 4,
      speed: 0.005 + (i % 3) * 0.0015,
      size: 2.2 + (i % 2) * 1.2,
      hue: i % 2 === 0 ? '#38bdf8' : '#f5b731',
    }));

    const render = () => {
      time += 0.007; // Calm, soothing, majestic speed

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Perfectly balanced holographic Mobius dimensions
      const Rx = Math.min(width * 0.32, 270);
      const Ry = Math.min(width * 0.20, 160);
      // Width reduced slightly per user request (from 68 down to 48px)
      const W = Math.min(width * 0.058, 48);
      const D = 620;

      // Camera view angles
      const pitch = 0.50; // ~29 degrees isometric view
      const yaw = time * 0.22; // Gentle spatial revolution
      const twistPhase = time * 0.60; // Intrinsic Möbius traveling twist

      interface Quad {
        p1: { x: number; y: number; z: number };
        p2: { x: number; y: number; z: number };
        p3: { x: number; y: number; z: number };
        p4: { x: number; y: number; z: number };
        avgZ: number;
        index: number;
        twistAngle: number;
      }

      const quads: Quad[] = [];

      for (let i = 0; i < SEGMENTS; i++) {
        const u1 = (i / SEGMENTS) * Math.PI * 2;
        const u2 = ((i + 1) / SEGMENTS) * Math.PI * 2;

        const phi1 = u1 / 2 + twistPhase;
        const phi2 = u2 / 2 + twistPhase;

        const getPoint = (u: number, phi: number, v: number) => {
          const cosPhi = Math.cos(phi);
          const sinPhi = Math.sin(phi);

          const rawX = (Rx + v * cosPhi) * Math.cos(u);
          const rawY = (Ry + v * cosPhi) * Math.sin(u);
          const rawZ = v * sinPhi;

          // Yaw
          const cosYaw = Math.cos(yaw);
          const sinYaw = Math.sin(yaw);
          const x1 = rawX * cosYaw - rawY * sinYaw;
          const y1 = rawX * sinYaw + rawY * cosYaw;
          const z1 = rawZ;

          // Pitch
          const cosPitch = Math.cos(pitch);
          const sinPitch = Math.sin(pitch);
          const x2 = x1;
          const y2 = y1 * cosPitch - z1 * sinPitch;
          const z2 = y1 * sinPitch + z1 * cosPitch;

          // Perspective
          const scale = D / (D + z2);
          const projX = centerX + x2 * scale;
          const projY = centerY + y2 * scale;

          return { x: projX, y: projY, z: z2 };
        };

        const p1 = getPoint(u1, phi1, -W);
        const p2 = getPoint(u1, phi1, W);
        const p3 = getPoint(u2, phi2, W);
        const p4 = getPoint(u2, phi2, -W);

        const avgZ = (p1.z + p2.z + p3.z + p4.z) / 4;

        quads.push({
          p1,
          p2,
          p3,
          p4,
          avgZ,
          index: i,
          twistAngle: phi1,
        });
      }

      // Painter's algorithm
      quads.sort((a, b) => b.avgZ - a.avgZ);

      // Render holographic dual-tone quads
      for (const q of quads) {
        ctx.beginPath();
        ctx.moveTo(q.p1.x, q.p1.y);
        ctx.lineTo(q.p2.x, q.p2.y);
        ctx.lineTo(q.p3.x, q.p3.y);
        ctx.lineTo(q.p4.x, q.p4.y);
        ctx.closePath();

        const depthNorm = (q.avgZ + Rx) / (Rx * 2);
        const alpha = Math.max(0.18, Math.min(0.80, 1 - depthNorm * 0.45));
        const twistSin = Math.sin(q.twistAngle);

        // High-Tech Holographic Coloring: Cyber Cyan / Luminous Electric Gold
        if (twistSin > 0) {
          // Cyber Cyan Hologram face
          ctx.fillStyle = `rgba(14, 165, 233, ${alpha * 0.65})`;
        } else {
          // Luminous Gold / Amber Hologram face
          ctx.fillStyle = `rgba(245, 183, 49, ${alpha * 0.60})`;
        }

        ctx.fill();

        // High-tech holographic neon edge outline
        const edgeColor = twistSin > 0 ? 'rgba(56, 189, 248, 0.45)' : 'rgba(254, 240, 138, 0.45)';
        ctx.strokeStyle = edgeColor;
        ctx.lineWidth = 0.85;
        ctx.stroke();
      }

      // Render traveling holographic quantum particles
      for (const p of particles) {
        p.u = (p.u + p.speed) % (Math.PI * 4);

        const u = p.u % (Math.PI * 2);
        const phi = p.u / 2 + twistPhase;

        const cosPhi = Math.cos(phi);
        const sinPhi = Math.sin(phi);

        const rawX = Rx * Math.cos(u);
        const rawY = Ry * Math.sin(u);
        const rawZ = 0 * sinPhi;

        const cosYaw = Math.cos(yaw);
        const sinYaw = Math.sin(yaw);
        const x1 = rawX * cosYaw - rawY * sinYaw;
        const y1 = rawX * sinYaw + rawY * cosYaw;
        const z1 = rawZ;

        const cosPitch = Math.cos(pitch);
        const sinPitch = Math.sin(pitch);
        const x2 = x1;
        const y2 = y1 * cosPitch - z1 * sinPitch;
        const z2 = y1 * sinPitch + z1 * cosPitch;

        const scale = D / (D + z2);
        const px = centerX + x2 * scale;
        const py = centerY + y2 * scale;

        const pAlpha = Math.max(0.25, Math.min(0.95, (scale - 0.7) * 2.2));

        ctx.beginPath();
        ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = p.hue;
        ctx.globalAlpha = pAlpha;
        ctx.shadowColor = p.hue === '#38bdf8' ? '#38bdf8' : '#f5b731';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
      {/* Ambient Cyber Holographic Glow (Cyan & Gold) */}
      <div className="absolute w-[600px] h-[300px] bg-gradient-to-r from-sky-500/12 via-cyan-400/10 to-amber-500/12 rounded-full blur-[100px] transform -translate-y-2 pointer-events-none" />

      {/* 3D Holographic Mobius Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[920px] max-h-[500px] opacity-80"
        style={{
          filter: 'drop-shadow(0 0 25px rgba(56, 189, 248, 0.25)) drop-shadow(0 0 15px rgba(245, 183, 49, 0.2))',
        }}
      />
    </div>
  );
}
