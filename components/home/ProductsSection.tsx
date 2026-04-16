import React from 'react';
import { ProductGrid } from '../products/ProductGrid';
import { SectionKicker } from '../ui/SectionKicker';
import { ScrollReveal } from '../ui/ScrollReveal';

export function ProductsSection() {
  return (
    <section id="products" aria-label="Clive product catalogue" className="py-24 px-14" style={{ background: 'var(--paper)' }}>
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="mb-16">
            <SectionKicker>Products</SectionKicker>
            <h2 className="text-[clamp(32px,4vw,48px)] font-display font-light mb-4" style={{ color: 'var(--black)' }}>
              Everything you need. <br />
              Nothing superfluous.
            </h2>
            <p className="text-base font-serif italic max-w-2xl" style={{ color: 'var(--text2)' }}>
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