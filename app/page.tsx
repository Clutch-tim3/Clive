import type { Metadata } from 'next';
import { HeroNew as Hero } from '@/components/home/HeroNew';
import { HackKitSpotlight } from '@/components/home/HackKitSpotlight';
import { ProductsSection } from '@/components/home/ProductsSection';
import { WhyClive } from '@/components/home/WhyClive';
import { NavyBand } from '@/components/home/NavyBand';
import { PlatformSection } from '@/components/home/PlatformSection';
import { ChannelsSection } from '@/components/home/ChannelsSection';
import { PricingSection } from '@/components/home/PricingSection';
import { APIlayerPartnersSection } from '@/components/home/APIlayerPartnersSection';
import { ReadyToBuildCTA } from '@/components/home/ReadyToBuildCTA';

export const metadata: Metadata = {
  title: 'Developer API Marketplace — Free Tier on Every API',
  description:
    'Clive is a South African developer API marketplace offering production-ready ' +
    'APIs for security, search, finance, government tenders, contracts, and more. ' +
    'Free tier included on every product. Start building in 5 minutes.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Clive — Developer API Marketplace',
    description:
      'Production-ready APIs for security, search, finance, tenders, and more. ' +
      'Free tier on every product. Build faster.',
    url: '/',
    images: [{ url: '/og/default.png', width: 1200, height: 630 }],
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Clive?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Clive is a South African developer API marketplace offering production-ready REST APIs for security, search, finance, government tenders, contract analysis, and more. Every API includes a free tier with no credit card required.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a free tier on every API?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Every Clive API includes a permanent free tier — not a trial. You get free calls per month on every product, forever. No credit card required to get started.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I get an API key?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Create a free account, navigate to the API you want, and click Acquire. You'll receive your API key instantly. All API keys are scoped per product.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can I sell my own API on Clive?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Clive offers a Provider Console where developers can list their own APIs on the marketplace. Clive takes a 12% commission on paid transactions — providers keep 88%. Products are reviewed within 24 hours.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Clive offer domain registration?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Clive offers domain registration for .com, .co.za, .net, .org, .io, .dev, and other extensions. Availability is checked in real time against the global domain registry.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Clive only for South African developers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Clive is built in South Africa and focused on the African developer market, but the platform is open to developers globally. All APIs are accessible internationally.',
      },
    },
  ],
};

const cliveAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Clive Developer Platform',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  url: 'https://clive.dev',
  description:
    'API marketplace with production-ready REST APIs for developers. ' +
    'Security, search, finance, government tenders, contracts, and domain registration.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'ZAR',
    description: 'Free tier available on every API',
  },
  provider: { '@type': 'Organization', name: 'Donington Vale' },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cliveAppSchema) }}
      />
      <Hero />
      <HackKitSpotlight />
      <ProductsSection />
      <WhyClive />
      <NavyBand />
      <PlatformSection />
      <ChannelsSection />
      <PricingSection />
      <APIlayerPartnersSection />
      <ReadyToBuildCTA />
    </>
  );
}