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
    // Particles traveling along the Mobius path
    const PARTICLE_COUNT = 24;
    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      u: (i / PARTICLE_COUNT) * Math.PI * 4, // 0 to 4pi (2 full turns for complete Mobius cycle)
      speed: 0.006 + (i % 3) * 0.002,
      size: 2 + (i % 3),
      hue: i % 2 === 0 ? '#fef08a' : '#f5b731',
    }));

    const render = () => {
      time += 0.008; // Calm, slow, soothing speed

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Radius and ribbon width adapted to container width
      const R = Math.min(width * 0.28, 220);
      const W = Math.min(width * 0.055, 42);
      const D = 600; // Camera distance for subtle perspective

      // Camera view angles (isometric luxury perspective)
      // Slight pitch tilt and very slow majestic yaw
      const pitch = 0.52; // ~30 degrees down view
      const yaw = time * 0.3; // Very slow rotation in space
      const twistPhase = time * 0.7; // The intrinsic Möbius traveling twist!

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

        // Mobius formula: twist is u/2
        // Adding twistPhase makes the twist travel along the ribbon!
        const phi1 = u1 / 2 + twistPhase;
        const phi2 = u2 / 2 + twistPhase;

        const getPoint = (u: number, phi: number, v: number) => {
          // Parametric 3D coords
          const cosPhi = Math.cos(phi);
          const sinPhi = Math.sin(phi);
          const rEff = R + v * cosPhi;

          // 3D coordinates before rotation
          const rawX = rEff * Math.cos(u);
          const rawY = rEff * Math.sin(u);
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

      // Render each quad of the ribbon
      for (const q of quads) {
        ctx.beginPath();
        ctx.moveTo(q.p1.x, q.p1.y);
        ctx.lineTo(q.p2.x, q.p2.y);
        ctx.lineTo(q.p3.x, q.p3.y);
        ctx.lineTo(q.p4.x, q.p4.y);
        ctx.closePath();

        // Shading based on depth and twist orientation
        const depthNorm = (q.avgZ + R) / (R * 2); // 0 (near) to 1 (far)
        const alpha = Math.max(0.25, Math.min(0.92, 1 - depthNorm * 0.45));
        const twistSin = Math.sin(q.twistAngle);

        // Gradient coloring: transition between luminous gold, amber, and deep navy-gold
        if (twistSin > 0) {
          // Front-facing illuminated gold surface
          ctx.fillStyle = `rgba(245, 183, 49, ${alpha})`;
        } else {
          // Inverted/underside surface with bronze-amber tint
          ctx.fillStyle = `rgba(180, 83, 9, ${alpha * 0.85})`;
        }

        ctx.fill();

        // Subtle glowing edges for crisp high-tech definition
        ctx.strokeStyle = `rgba(254, 240, 138, ${alpha * 0.4})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }

      // Render traveling quantum particles along the Mobius track
      for (const p of particles) {
        p.u = (p.u + p.speed) % (Math.PI * 4);

        // v = 0 (travels exactly along the Mobius center backbone)
        const u = p.u % (Math.PI * 2);
        const phi = p.u / 2 + twistPhase;

        const cosPhi = Math.cos(phi);
        const sinPhi = Math.sin(phi);
        const rEff = R + 0 * cosPhi;

        const rawX = rEff * Math.cos(u);
        const rawY = rEff * Math.sin(u);
        const rawZ = 0 * sinPhi;

        // Apply same camera transforms
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

        const pAlpha = Math.max(0.3, Math.min(1, (scale - 0.7) * 2));

        // Draw particle with gentle glow
        ctx.beginPath();
        ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = p.hue;
        ctx.globalAlpha = pAlpha;
        ctx.shadowColor = '#f5b731';
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
      {/* Gentle ambient luxury gold glow */}
      <div className="absolute w-[500px] h-[300px] bg-gradient-to-r from-amber-500/10 via-rawnaq-gold/15 to-yellow-600/10 rounded-full blur-[100px] transform -translate-y-6 pointer-events-none" />

      {/* 3D Mobius Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[900px] max-h-[500px] opacity-80"
        style={{
          filter: 'drop-shadow(0 0 20px rgba(245, 183, 49, 0.25))',
        }}
      />
    </div>
  );
}
