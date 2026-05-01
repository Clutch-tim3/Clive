import type { Metadata } from 'next';
import { ProductGrid } from '@/components/products/ProductGrid';
import { getLiveProducts } from '@/lib/firebase/products.server';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'API Marketplace — Browse All Developer APIs',
    description:
      'Browse production-ready REST APIs on the Clive marketplace. Security & pentesting, search & embeddings, finance & FX, government tenders, contract analysis, and more. Free tier on every API. No credit card required.',
    alternates: { canonical: '/products' },
    openGraph: {
      title: 'Clive API Marketplace — Developer APIs',
      url: '/products',
      images: [{ url: '/og/default.png', width: 1200, height: 630 }],
    },
  };
}

export default async function ProductsPage() {
  const productsList = await getLiveProducts();

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Clive API Marketplace',
    description: 'Browse live developer APIs available on Clive.',
    numberOfItems: productsList.length,
    itemListElement: productsList.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: product.name,
        url: `https://clive.dev/products/${product.slug}`,
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-3xl space-y-6">
          <p className="text-sm tracking-[0.35em] text-slate-400 uppercase">API marketplace</p>
          <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">Browse live developer APIs</h1>
          <p className="text-lg leading-8 text-slate-300">
            Production-ready APIs for security, search, finance, analytics, embeddings, and more. All APIs include a free tier with no credit card required.
          </p>
        </div>

        <div className="mt-16">
          <ProductGrid initialCategory="all" initialProducts={productsList as any} />
        </div>
      </section>
    </>
  );
}
