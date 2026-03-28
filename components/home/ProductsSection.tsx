import React from 'react';
import { ProductGrid } from '../products/ProductGrid';
import { SectionKicker } from '../ui/SectionKicker';
import { ScrollReveal } from '../ui/ScrollReveal';

export function ProductsSection() {
  return (
    <section id="products" className="py-24 px-14">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="mb-16">
            <SectionKicker>Products</SectionKicker>
            <h2 className="text-[clamp(32px,4vw,48px)] font-display font-light mb-4">
              Everything you need. <br />
              Nothing superfluous.
            </h2>
            <p className="text-base font-serif italic text-text2 max-w-2xl">
              A curated collection of APIs, machine learning models, Chrome 
              extensions, and security tools — all built with the same attention 
              to detail and developer experience.
            </p>
          </div>
        </ScrollReveal>
        
        <ProductGrid />
      </div>
    </section>
  );
}