'use client';

import dynamic from 'next/dynamic';

const RaseenTemplateEditor = dynamic(
  () => import('@/components/editor/RaseenTemplateEditor'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-raseen-dark flex items-center justify-center text-white font-cairo" dir="rtl">
        <div className="text-center space-y-3">
          <div className="text-4xl animate-pulse">🎨</div>
          <p className="text-sm font-bold text-slate-300">جاري تحميل استوديو تصميم وتخصيص القوالب...</p>
        </div>
      </div>
    ),
  }
);

export default function EditorClientLoader() {
  return <RaseenTemplateEditor />;
}
