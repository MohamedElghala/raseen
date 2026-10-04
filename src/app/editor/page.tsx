import type { Metadata } from 'next';
import RaseenTemplateEditor from '@/components/editor/RaseenTemplateEditor';

export const metadata: Metadata = {
  title: 'محرر القوالب الذكي (Canva Studio) | رَصين للأصول الرقمية',
  description: 'محرر تفاعلي مباشر لتعديل وتخصيص السير الذاتية، الفواتير الضريبية، العقود التجارية، وبوستات السوشيال ميديا وتصديرها PDF فوراً أو فتحها في Canva.',
  keywords: ['محرر قوالب', 'تعديل سيرة ذاتية', 'تصميم كانفا', 'فاتورة إلكترونية', 'Canva editor', 'قوالب جاهزة'],
  openGraph: {
    title: 'استوديو رَصين لتخصيص القوالب الرقمية | Canva Studio',
    description: 'خصّص قوالبك الاحترافية مباشرة من المتصفح وحمّلها بصيغة A4 Print أو صدّرها لحسابك في Canva بضغطة زر.',
    type: 'website',
  },
};

export default function EditorPage() {
  return <RaseenTemplateEditor />;
}
