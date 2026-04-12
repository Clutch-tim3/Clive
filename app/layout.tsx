import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Mono, Libre_Baskerville } from 'next/font/google';
import { cookies } from 'next/headers';
import '@/styles/globals.css';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { verifyDomainServiceOnStartup } from '@/lib/domains/startup';
import { getSessionUser } from '@/lib/firebase/auth';

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
  // Detect auth state server-side so Nav renders correctly on first paint.
  // Using cookies() here opts this layout into dynamic rendering automatically.
  let initialUser: { displayName: string | null; email: string | null } | null = null;
  try {
    const cookieStore = cookies();
    if (cookieStore.get('__session')?.value) {
      const u = await getSessionUser();
      if (u) initialUser = { displayName: u.displayName ?? null, email: u.email ?? null };
    }
  } catch { /* leave initialUser as null */ }

  return (
    <html lang="en">
      <body
        className={`${cormorantGaramond.variable} ${libreBaskerville.variable} ${dmMono.variable} antialiased`}
      >
        <Nav initialUser={initialUser} />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}