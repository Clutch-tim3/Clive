'use client';
import React, { useState, useEffect } from 'react';
import { products, getProductsByCategory, Product } from '@/lib/products';
import { FilterBar } from './FilterBar';
import { ProductCard } from './ProductCard';
import { ScrollReveal } from '../ui/ScrollReveal';

interface ProductGridProps {
  initialCategory?: string;
}

export function ProductGrid({ initialCategory = 'all' }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  const filteredProducts = getProductsByCategory(activeCategory);

  return (
    <div>
      <FilterBar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border border-border bg-border">
        {filteredProducts.map((product, index) => (
          <ScrollReveal
            key={product.slug}
            variant={(product.animateIn === 'slide-right' ? 'slideInRight' : 'fadeUp')}
            delay={product.animateDelay || index * 0.05}
          >
            <ProductCard product={product} index={index} />
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}