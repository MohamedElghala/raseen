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

    // Number of segments along the ring
    const SEGMENTS = 140;
    // Particles traveling along the Mobius track
    const PARTICLE_COUNT = 20;
    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      u: (i / PARTICLE_COUNT) * Math.PI * 4, // 0 to 4pi (2 full turns for complete Mobius cycle)
      speed: 0.005 + (i % 3) * 0.0015,
      size: 2.5 + (i % 2) * 1.5,
      hue: i % 2 === 0 ? '#fef08a' : '#f5b731',
    }));

    const render = () => {
      time += 0.006; // Calm, soothing, luxurious motion

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Authentic Wide Mobius Strip Dimensions
      // Rx, Ry give it an elegant elliptical span behind the text
      const Rx = Math.min(width * 0.34, 290);
      const Ry = Math.min(width * 0.22, 175);
      // W is significantly wider so the Mobius ribbon twist is unmistakable
      const W = Math.min(width * 0.08, 68);
      const D = 650; // Camera distance for subtle perspective

      // Camera view angles: isometric luxury perspective
      const pitch = 0.48; // ~28 degrees tilt
      const yaw = time * 0.25; // Gentle majestic spatial rotation
      const twistPhase = time * 0.65; // Intrinsic Möbius traveling twist!

      // Generate quads for the strip
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

          // 3D coordinates on wide Mobius ribbon
          const rawX = (Rx + v * cosPhi) * Math.cos(u);
          const rawY = (Ry + v * cosPhi) * Math.sin(u);
          const rawZ = v * sinPhi;

          // Apply Yaw (Y-axis rotation)
          const cosYaw = Math.cos(yaw);
          const sinYaw = Math.sin(yaw);
          const x1 = rawX * cosYaw - rawY * sinYaw;
          const y1 = rawX * sinYaw + rawY * cosYaw;
          const z1 = rawZ;

          // Apply Pitch (X-axis tilt)
          const cosPitch = Math.cos(pitch);
          const sinPitch = Math.sin(pitch);
          const x2 = x1;
          const y2 = y1 * cosPitch - z1 * sinPitch;
          const z2 = y1 * sinPitch + z1 * cosPitch;

          // Perspective projection
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

      // Painter's algorithm: sort quads back-to-front by depth
      quads.sort((a, b) => b.avgZ - a.avgZ);

      // Render each quad of the wide ribbon
      for (const q of quads) {
        ctx.beginPath();
        ctx.moveTo(q.p1.x, q.p1.y);
        ctx.lineTo(q.p2.x, q.p2.y);
        ctx.lineTo(q.p3.x, q.p3.y);
        ctx.lineTo(q.p4.x, q.p4.y);
        ctx.closePath();

        const depthNorm = (q.avgZ + Rx) / (Rx * 2);
        const alpha = Math.max(0.18, Math.min(0.85, 1 - depthNorm * 0.4));
        const twistSin = Math.sin(q.twistAngle);

        if (twistSin > 0) {
          // Illuminated Royal Gold side
          ctx.fillStyle = `rgba(245, 183, 49, ${alpha * 0.75})`;
        } else {
          // Inverted/underside side with Bronze/Amber depth
          ctx.fillStyle = `rgba(180, 83, 9, ${alpha * 0.65})`;
        }

        ctx.fill();

        // Edge highlights on the wide strip
        ctx.strokeStyle = `rgba(254, 240, 138, ${alpha * 0.35})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Render traveling quantum particles along the center of the Mobius track
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

        const pAlpha = Math.max(0.25, Math.min(0.9, (scale - 0.7) * 2));

        ctx.beginPath();
        ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = p.hue;
        ctx.globalAlpha = pAlpha;
        ctx.shadowColor = '#f5b731';
        ctx.shadowBlur = 8;
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
      {/* Gentle ambient luxury gold glow */}
      <div className="absolute w-[580px] h-[320px] bg-gradient-to-r from-amber-500/10 via-rawnaq-gold/15 to-yellow-600/10 rounded-full blur-[110px] transform -translate-y-4 pointer-events-none" />

      {/* 3D Wide Mobius Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[950px] max-h-[520px] opacity-75"
        style={{
          filter: 'drop-shadow(0 0 25px rgba(245, 183, 49, 0.2))',
        }}
      />
    </div>
  );
}
