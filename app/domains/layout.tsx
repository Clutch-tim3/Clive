import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register a Domain — .com .co.za .net .org .io .dev',
  description:
    'Register .com, .co.za, .net, .org, .io, and .dev domains from Clive. ' +
    'Real-time availability check. South African registrar. ' +
    'Register your domain today.',
  keywords: [
    'buy domain South Africa',
    'register domain co.za',
    'domain registration South Africa',
    'buy co.za domain',
    'domain name South Africa',
    'register domain name',
    'co.za registration',
  ],
  alternates: { canonical: '/domains' },
  openGraph: {
    title: 'Register a Domain — Clive',
    description: 'Real-time domain availability. Register .com .co.za .net .org .io and more.',
    url: '/domains',
    images: [{ url: '/og/default.png', width: 1200, height: 630 }],
  },
};

export default function DomainsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
