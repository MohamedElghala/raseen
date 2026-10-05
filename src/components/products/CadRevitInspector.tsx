'use client';

import React, { useState } from 'react';
import { ProductItem } from '@/lib/types';

interface CadRevitInspectorProps {
  product: ProductItem;
}

export default function CadRevitInspector({ product }: CadRevitInspectorProps) {
  const [showWalls, setShowWalls] = useState(true);
  const [showDoors, setShowDoors] = useState(true);
  const [showFurniture, setShowFurniture] = useState(true);
  const [showMep, setShowMep] = useState(true);
  const [viewMode, setViewMode] = useState<'plan' | 'iso'>('plan');

  return (
    <div className="mt-8 bg-rawnaq-navy border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header Bar */}
      <div className="bg-cyan-950/40 border-b border-cyan-500/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-xl text-cyan-400 font-bold">
            📐
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white">فاحص المخططات الهندسية وعائلات Revit / CAD</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                BIM / LOD 350 Ready
              </span>
            </div>
            <p className="text-xs text-slate-400">
              معاينة تفاعلية لطبقات الرسم (Layers)، مواصفات البلوكات، والبارامترات الهندسية الدقيقة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 font-mono bg-rawnaq-dark px-3 py-1.5 rounded-xl border border-rawnaq-border">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>DWG • DXF • RFA • RVT</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* CAD Blueprint Viewport (7 Cols) */}
        <div className="lg:col-span-7 bg-[#070d19] p-4 md:p-6 border-b lg:border-b-0 lg:border-l border-rawnaq-border flex flex-col justify-between relative overflow-hidden">
          {/* Top Controls on Viewport */}
          <div className="flex items-center justify-between mb-4 z-10">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                VIEWPORT: {viewMode === 'plan' ? 'TOP_2D_PLAN' : '3D_ISOMETRIC'}
              </span>
              <span className="text-[10px] font-mono text-slate-400">SCALE 1:1 METRIC</span>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => setViewMode('plan')}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                  viewMode === 'plan' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                2D Plan
              </button>
              <button
                onClick={() => setViewMode('iso')}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                  viewMode === 'iso' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                3D Iso
              </button>
            </div>
          </div>

          {/* Wireframe Canvas Simulation */}
          <div className="relative w-full aspect-[4/3] rounded-xl border border-cyan-500/20 bg-[#040812] flex items-center justify-center overflow-hidden">
            {/* Engineering Grid */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #00f0ff 1px, transparent 1px), linear-gradient(to bottom, #00f0ff 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Crosshairs & Origin */}
            <div className="absolute bottom-4 left-4 text-[10px] font-mono text-cyan-400 flex items-center gap-1 z-10">
              <span className="w-4 h-4 border-l border-b border-cyan-400 inline-block" />
              <span>(0,0,0) WCS</span>
            </div>

            {/* Architectural Vector Elements */}
            <svg className="w-full h-full p-8" viewBox="0 0 400 300" fill="none">
              {/* Outer Walls Layer */}
              {showWalls && (
                <g stroke="#38bdf8" strokeWidth="3" opacity="0.9">
                  <rect x="40" y="40" width="320" height="220" rx="4" />
                  <line x1="160" y1="40" x2="160" y2="260" />
                  <line x1="160" y1="150" x2="360" y2="150" />
                  {/* Dimensions */}
                  <text x="170" y="32" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                    12,500 mm
                  </text>
                  <text x="18" y="150" fill="#38bdf8" fontSize="10" fontFamily="monospace" transform="rotate(-90 18 150)">
                    8,200 mm
                  </text>
                </g>
              )}

              {/* Doors & Windows Layer */}
              {showDoors && (
                <g stroke="#facc15" strokeWidth="2">
                  {/* Door Swing 1 */}
                  <path d="M 160 80 Q 200 80 200 120" strokeDasharray="3 3" />
                  <line x1="160" y1="80" x2="160" y2="120" strokeWidth="3" />
                  {/* Door Swing 2 */}
                  <path d="M 240 150 Q 240 190 280 190" strokeDasharray="3 3" />
                  <line x1="240" y1="150" x2="280" y2="150" strokeWidth="3" />
                  {/* Window 1 */}
                  <line x1="80" y1="40" x2="120" y2="40" stroke="#facc15" strokeWidth="5" />
                  {/* Window 2 */}
                  <line x1="360" y1="80" x2="360" y2="120" stroke="#facc15" strokeWidth="5" />
                </g>
              )}

              {/* Furniture Layer */}
              {showFurniture && (
                <g stroke="#4ade80" strokeWidth="1.5" fill="#4ade80" fillOpacity="0.1">
                  {/* Conference Table */}
                  <rect x="65" y="100" width="70" height="100" rx="12" />
                  {/* Chairs */}
                  <circle cx="50" cy="120" r="8" />
                  <circle cx="50" cy="150" r="8" />
                  <circle cx="50" cy="180" r="8" />
                  <circle cx="150" cy="120" r="8" />
                  <circle cx="150" cy="150" r="8" />
                  <circle cx="150" cy="180" r="8" />
                  {/* Desk in Office 2 */}
                  <rect x="260" y="60" width="70" height="40" rx="4" />
                  <circle cx="295" cy="115" r="9" />
                </g>
              )}

              {/* MEP & Lighting Layer */}
              {showMep && (
                <g stroke="#c084fc" strokeWidth="1.5">
                  {/* Ceiling Diffusers */}
                  <line x1="90" y1="140" x2="110" y2="160" />
                  <line x1="110" y1="140" x2="90" y2="160" />
                  <rect x="85" y="135" width="30" height="30" stroke="#c084fc" strokeDasharray="2 2" />
                  {/* Lighting fixtures */}
                  <circle cx="260" cy="200" r="6" stroke="#c084fc" fill="#c084fc" fillOpacity="0.4" />
                  <circle cx="310" cy="200" r="6" stroke="#c084fc" fill="#c084fc" fillOpacity="0.4" />
                </g>
              )}
            </svg>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Layers Active: {[showWalls, showDoors, showFurniture, showMep].filter(Boolean).length}/4</span>
            <span className="text-cyan-400">Dynamic Blocks: Fully Parametric</span>
          </div>
        </div>

        {/* CAD Specifications & Layer Manager (5 Cols) */}
        <div className="lg:col-span-5 p-6 bg-rawnaq-dark space-y-6">
          {/* Layer Controls */}
          <div>
            <div className="text-xs font-bold text-slate-300 mb-3 flex items-center justify-between">
              <span>مدير طبقات الأوتوكاد (Layer Manager):</span>
              <span className="text-[10px] text-slate-500 font-mono">AIA Standard</span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setShowWalls(!showWalls)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-rawnaq-surface border border-rawnaq-border text-xs transition-colors hover:border-slate-500"
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-sky-400" />
                  <span className="font-mono font-bold text-white">A-WALL</span>
                  <span className="text-slate-400 text-[11px]">(الجدران والمحاور)</span>
                </div>
                <span className={`text-[11px] font-bold ${showWalls ? 'text-emerald-400' : 'text-slate-600'}`}>
                  {showWalls ? 'معروض' : 'مخفي'}
                </span>
              </button>

              <button
                onClick={() => setShowDoors(!showDoors)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-rawnaq-surface border border-rawnaq-border text-xs transition-colors hover:border-slate-500"
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="font-mono font-bold text-white">A-DOOR-GLAZ</span>
                  <span className="text-slate-400 text-[11px]">(الأبواب والشبابيك)</span>
                </div>
                <span className={`text-[11px] font-bold ${showDoors ? 'text-emerald-400' : 'text-slate-600'}`}>
                  {showDoors ? 'معروض' : 'مخفي'}
                </span>
              </button>

              <button
                onClick={() => setShowFurniture(!showFurniture)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-rawnaq-surface border border-rawnaq-border text-xs transition-colors hover:border-slate-500"
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="font-mono font-bold text-white">A-FURN-EQUP</span>
                  <span className="text-slate-400 text-[11px]">(المفروشات والأجهزة)</span>
                </div>
                <span className={`text-[11px] font-bold ${showFurniture ? 'text-emerald-400' : 'text-slate-600'}`}>
                  {showFurniture ? 'معروض' : 'مخفي'}
                </span>
              </button>

              <button
                onClick={() => setShowMep(!showMep)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-rawnaq-surface border border-rawnaq-border text-xs transition-colors hover:border-slate-500"
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-400" />
                  <span className="font-mono font-bold text-white">M-E-DUCT-LITE</span>
                  <span className="text-slate-400 text-[11px]">(التكييف والإنارة)</span>
                </div>
                <span className={`text-[11px] font-bold ${showMep ? 'text-emerald-400' : 'text-slate-600'}`}>
                  {showMep ? 'معروض' : 'مخفي'}
                </span>
              </button>
            </div>
          </div>

          {/* Technical Specs Grid */}
          <div className="p-4 rounded-xl bg-rawnaq-surface/70 border border-rawnaq-border space-y-2.5 text-xs">
            <div className="font-bold text-white border-b border-rawnaq-border pb-1.5">
              المواصفات والمعايير الهندسية:
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">مستوى التفصيل (LOD):</span>
              <span className="font-mono font-bold text-cyan-400">LOD 350 (BIM Ready)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">وحدة القياس المعتمدة:</span>
              <span className="font-mono font-bold text-white">Millimeter (Metric 1:1)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">توافق الأوتوكاد:</span>
              <span className="font-mono font-bold text-white">AutoCAD 2013 - 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">عائلات الريفيت:</span>
              <span className="font-mono font-bold text-emerald-400">Revit 2020 - 2026 (RFA)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
