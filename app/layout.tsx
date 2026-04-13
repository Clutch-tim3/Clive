import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Mono, Libre_Baskerville } from 'next/font/google';
import { cookies } from 'next/headers';
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
  variable: '--font-display',
});

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Clive — Developer Platform',
  description: 'APIs, ML models, Chrome extensions, and security tools. Everything a developer needs, priced for builders.',
  openGraph: {
    title: 'Clive — Developer Platform',
    description: 'APIs, ML models, Chrome extensions, and security tools. Everything a developer needs, priced for builders.',
    images: '/logo.png',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check session cookie existence server-side — no Firebase SDK needed.
  // This is the single source of truth: if the cookie is present the user is
  // authenticated (the middleware uses the same check). Using cookies() here
  // automatically opts this layout into dynamic (per-request) rendering.
  const cookieStore = cookies();
  const initialAuthed = !!cookieStore.get('__session')?.value;

  return (
    <html lang="en">
      <body
        className={`${cormorantGaramond.variable} ${libreBaskerville.variable} ${dmMono.variable} antialiased`}
      >
        <Nav initialAuthed={initialAuthed} />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
