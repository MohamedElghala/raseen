import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartModal from '@/components/storefront/CartModal';
import LoginModal from '@/components/auth/LoginModal';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GOOGLE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'verification_token_placeholder';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://raseen.me'),
  title: {
    default: 'رَصِيـن | سوق الأصول والأدوات الرقمية الاحترافية والعمل الحر',
    template: '%s | رَصِيـن RASEEN',
  },
  description: 'منصة رَصِيـن — رصيدك الذكي من الأدوات والخبرات الجاهزة. شيتات إكسل محاسبية، عقود قانونية موثقة، قوالب كانفا حرة، ومكتبات CAD و Revit معمارية.',
  keywords: [
    'أصول رقمية',
    'رصين',
    'RASEEN',
    'شيتات إكسل',
    'محاسبة',
    'عقود قانونية',
    'قوالب Canva',
    'AutoCAD',
    'Revit BIM',
    'عمل حر',
    'Freelance',
    'إنستاباي',
  ],
  authors: [{ name: 'فريق رَصين الرقمي' }],
  creator: 'رَصِيـن | RASEEN',
  publisher: 'رَصِيـن للأصول الرقمية',
  verification: {
    google: GOOGLE_VERIFICATION,
  },
  openGraph: {
    title: 'رَصِيـن | سوق الأصول والأدوات الرقمية والعمل الحر',
    description: 'أدوات وشيتات وقوالب ذكية تختصر سنوات من جهدك وعملك مع تسليم فوري وتخصيص بواسطة مستقلين معتمدين.',
    url: 'https://raseen.me',
    siteName: 'رَصِيـن | RASEEN',
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'رَصِيـن | سوق الأصول الرقمية والعمل الحر',
    description: 'أدوات وشيتات وقوالب ذكية تختصر سنوات من جهدك وعملك',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'رَصِيـن | RASEEN',
  url: 'https://raseen.me',
  description: 'سوق الأصول الرقمية والإبداعية والعمل الحر في الشرق الأوسط',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://raseen.me/?search={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Google Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />

        {/* Google Analytics 4 (GA4) */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {/* Google Tag Manager (GTM) */}
        {GTM_ID && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `}
          </Script>
        )}
      </head>

      <body className="font-cairo min-h-screen bg-rawnaq-dark text-slate-200 antialiased">
        {/* Google Tag Manager (noscript) */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        <Navbar />
        <main>{children}</main>
        <Footer />
        <CartModal />
        <LoginModal />
      </body>
    </html>
  );
}
