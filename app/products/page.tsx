import type { Metadata } from 'next';
import { ProductGrid } from '@/components/products/ProductGrid';
import { SectionKicker } from '@/components/ui/SectionKicker';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { products } from '@/lib/products';

export const metadata: Metadata = {
  title: 'API Marketplace — Browse All Developer APIs',
  description:
    'Browse production-ready REST APIs on the Clive marketplace. ' +
    'Security & pentesting, search & embeddings, finance & FX, ' +
    'South African government tenders, contract analysis, and more. ' +
    'Free tier on every API. No credit card required.',
  alternates: { canonical: '/products' },
  openGraph: {
    title: 'Clive API Marketplace — Developer APIs',
    url: '/products',
    images: [{ url: '/og/default.png', width: 1200, height: 630 }],
  },
};

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Clive API Marketplace',
  description: 'All available APIs on the Clive developer platform',
  numberOfItems: products.length,
  itemListElement: products.map((product, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'SoftwareApplication',
      name: product.name,
      url: `https://clive.dev/products/${product.slug}`,
      description: product.tagline,
      applicationCategory: 'WebAPI',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'ZAR',
        description: `Free tier: ${product.freeTier}`,
      },
    },
  })),
};

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { cat?: string };
}) {
  const initialCategory = searchParams.cat || 'all';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <section className="pt-24 pb-18 px-4 sm:px-8 lg:px-14">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="mb-16">
              <SectionKicker>Products</SectionKicker>
              <h1 className="text-[clamp(48px,6vw,72px)] font-display font-light mb-4">
                Product catalogue
              </h1>
              <p className="text-base font-serif italic text-text2 max-w-2xl">
                Browse all Clive products. Filter by category to find the right
                tools for your project.
              </p>
            </div>
          </ScrollReveal>
          <ProductGrid initialCategory={initialCategory} />
        </div>
      </section>
    </>
  );
}