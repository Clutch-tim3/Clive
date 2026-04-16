import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HackKit — Penetration Testing & Domain Recon API',
  description:
    'HackKit consolidates the external pentest recon stack: domain intelligence, subdomain enumeration, ' +
    'CVE correlation, credential exposure, OSINT, and AI-synthesised red team reports. ' +
    'Ten capabilities, one credential.',
  alternates: { canonical: '/products/hackkit' },
  robots: { index: false, follow: true },
};

export default function HackKitRedirect() {
  redirect('/products/hackkit');
}
