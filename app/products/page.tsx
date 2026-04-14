import { ProductGrid } from '@/components/products/ProductGrid';
import { SectionKicker } from '@/components/ui/SectionKicker';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { cat?: string };
}) {
  const initialCategory = searchParams.cat || 'all';

  return (
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
  );
}