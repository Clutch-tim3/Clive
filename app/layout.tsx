import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, DM_Mono, Libre_Baskerville } from 'next/font/google';
import '@/styles/globals.css';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { verifyDomainServiceOnStartup } from '@/lib/domains/startup';

if (process.env.NODE_ENV !== 'test') {
  verifyDomainServiceOnStartup().catch(console.error);
}

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
});

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
  preload: true,
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://clive.dev';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#07070A',
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default: 'Clive — Developer API Marketplace',
    template: '%s | Clive',
  },

  description:
    'Clive is a South African developer API marketplace. ' +
    'Acquire production-ready APIs for security, search, finance, ' +
    'government tenders, contracts, and more. Free tier on every product.',

  keywords: [
    'API marketplace',
    'developer APIs',
    'South Africa API',
    'REST API',
    'security API',
    'penetration testing API',
    'government tender South Africa',
    'search API',
    'domain registration South Africa',
    'buy domain South Africa',
    'developer platform South Africa',
    'API marketplace South Africa',
    'free API tier',
    'HackKit API',
    'TenderIQ API',
    'Clive developer',
  ],

  authors: [{ name: 'Donington Vale', url: APP_URL }],
  creator: 'Donington Vale',
  publisher: 'Clive — Donington Vale',
  category: 'technology',

  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: APP_URL,
    siteName: 'Clive',
    title: 'Clive — Developer API Marketplace',
    description:
      'South African developer API marketplace. ' +
      'Production-ready APIs for security, search, finance, tenders, and more. ' +
      'Free tier on every product.',
    images: [
      {
        url: '/og/default.png',
        width: 1200,
        height: 630,
        alt: 'Clive — Developer API Marketplace',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@cliveDev',
    creator: '@cliveDev',
    title: 'Clive — Developer API Marketplace',
    description:
      'South African developer API marketplace. Production-ready APIs. Free tier on every product.',
    images: ['/og/default.png'],
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

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: '/favicon.ico',
  },

  manifest: '/manifest.webmanifest',

  alternates: {
    canonical: '/',
    languages: {
      'en-ZA': '/',
      'en': '/',
    },
  },

  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || '',
    other: {
      'msvalidate.01': process.env.BING_SITE_VERIFICATION || '',
    },
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Clive',
  url: 'https://clive.dev',
  description: 'South African developer API marketplace',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://clive.dev/products?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Clive',
  legalName: 'Donington Vale',
  url: 'https://clive.dev',
  logo: 'https://clive.dev/logo.png',
  foundingDate: '2026',
  foundingLocation: {
    '@type': 'Place',
    addressCountry: 'ZA',
    addressLocality: 'Centurion',
    addressRegion: 'Gauteng',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@clive.dev',
    contactType: 'customer support',
    availableLanguage: ['English'],
  },
  sameAs: [
    'https://twitter.com/cliveDev',
    'https://github.com/clive-dev',
    'https://www.linkedin.com/company/clive-dev',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-ZA">
      <body
        className={`${cormorantGaramond.variable} ${libreBaskerville.variable} ${dmMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* Nav detects auth state itself via __auth cookie (client-side) */}
        <Nav />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
