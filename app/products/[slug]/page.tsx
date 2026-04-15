import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { products, getProductBySlug, Product } from '@/lib/products';
import { ProductDetail } from '@/components/products/ProductDetail';

export const revalidate = 3600;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: 'Product Not Found' };

  const title = `${product.name} — ${product.tagline}`;
  const description =
    `${product.name}: ${product.description.slice(0, 140)}. ` +
    `Free tier included — ${product.freeTier}.`;

  return {
    title,
    description,
    keywords: [
      product.name,
      `${product.name} API`,
      `${product.category} API`,
      `${product.name} free tier`,
      'South Africa developer API',
      'REST API',
    ],
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title,
      description,
      url: `/products/${product.slug}`,
      type: 'website',
      images: [{ url: `/og/products/${product.slug}.png`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/og/products/${product.slug}.png`],
    },
  };
}

function ProductSchemas({ product }: { product: Product }) {
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.name,
    url: `https://clive.dev/products/${product.slug}`,
    description: product.description,
    applicationCategory: 'WebAPI',
    operatingSystem: 'Web',
    inLanguage: 'en',
    provider: { '@type': 'Organization', name: 'Donington Vale' },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'ZAR',
      description: `Free tier: ${product.freeTier}`,
      availability: 'https://schema.org/InStock',
    },
    featureList: product.endpoints.map(ep => ep.description).join(', '),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',     item: 'https://clive.dev' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://clive.dev/products' },
      { '@type': 'ListItem', position: 3, name: product.name, item: `https://clive.dev/products/${product.slug}` },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is ${product.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: product.description },
      },
      {
        '@type': 'Question',
        name: `Is there a free tier for ${product.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. ${product.name} includes a permanent free tier: ${product.freeTier}. No credit card required.`,
        },
      },
      {
        '@type': 'Question',
        name: `How many endpoints does ${product.name} have?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${product.name} includes ${product.endpoints.length} endpoint${product.endpoints.length === 1 ? '' : 's'}: ${product.endpoints.map(e => e.path).join(', ')}.`,
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  return (
    <>
      <ProductSchemas product={product as Product} />
      <ProductDetail product={product as Product} />
    </>
  );
}