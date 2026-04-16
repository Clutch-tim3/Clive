import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Clive — Support & Enquiries',
  description:
    'Get in touch with the Clive team. Support, provider enquiries, partnerships, and press. ' +
    'Based in Centurion, Gauteng, South Africa. We respond within one business day.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Clive',
    description: 'Reach the Clive team for support, provider enquiries, partnerships, and press.',
    url: '/contact',
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Donington Vale',
  alternateName: 'Clive',
  url: 'https://clive.dev',
  email: 'support@clive.dev',
  description:
    'South African technology company building developer infrastructure, API marketplaces, and financial tooling for African builders.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Centurion',
    addressRegion: 'Gauteng',
    addressCountry: 'ZA',
  },
  areaServed: [
    { '@type': 'Country', name: 'South Africa' },
    { '@type': 'Country', name: 'Africa' },
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@clive.dev',
    contactType: 'customer support',
    availableLanguage: 'English',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {children}
    </>
  );
}
