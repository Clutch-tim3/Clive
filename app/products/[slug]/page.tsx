import { notFound } from 'next/navigation';
import { products, getProductBySlug, Product } from '@/lib/products';
import { ProductDetail } from '@/components/products/ProductDetail';

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  
  if (!product) {
    return {
      title: 'Product not found',
      description: 'The requested product could not be found.',
    };
  }
  
  return {
    title: `${product.name} — Clive`,
    description: product.tagline,
    openGraph: {
      title: `${product.name} — Clive`,
      description: product.tagline,
      images: `/og/${product.slug}.png`,
      type: 'website',
    },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  
  if (!product) {
    notFound();
  }
  
  return <ProductDetail product={product as Product} />;
}