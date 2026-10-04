import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartModal from '@/components/storefront/CartModal';
import LoginModal from '@/components/auth/LoginModal';

export const metadata: Metadata = {
  title: 'رَصِيـن | سوق الأصول والأدوات الرقمية الاحترافية',
  description: 'منصة رَصِيـن — رصيدك الذكي من الأدوات والخبرات الجاهزة. شيتات إكسل، عقود قانونية، قوالب Notion، بلوكات CAD، وبرومبتات AI موثوقة.',
  keywords: ['أصول رقمية', 'رصين', 'Raseen', 'شيتات إكسل', 'قوالب Notion', 'عقود قانونية', 'AutoCAD', 'متجر رقمي عربي'],
  openGraph: {
    title: 'رَصِيـن | سوق الأصول والأدوات الرقمية',
    description: 'رصيدك الذكي من الأدوات والخبرات الجاهزة التي تختصر سنوات من جهدك',
    type: 'website',
    locale: 'ar_EG',
    siteName: 'Raseen',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'رَصِيـن | سوق الأصول والأدوات الرقمية',
    description: 'رصيدك الذكي من الأدوات والخبرات الجاهزة التي تختصر سنوات من جهدك',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-cairo min-h-screen bg-rawnaq-dark text-slate-200 antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CartModal />
        <LoginModal />
      </body>
    </html>
  );
}
