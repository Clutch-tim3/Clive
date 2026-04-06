'use client';
import React, { useState, useEffect } from 'react';
import { products, getProductsByCategory } from '@/lib/products';
import { FilterBar } from './FilterBar';
import { ProductCard } from './ProductCard';
import { ScrollReveal } from '../ui/ScrollReveal';
import { SearchBar } from '../ui/SearchBar';

interface ProductGridProps {
  initialCategory?: string;
}

export function ProductGrid({ initialCategory = 'all' }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialCategory) setActiveCategory(initialCategory);
  }, [initialCategory]);

  const byCategory = getProductsByCategory(activeCategory);
  const filteredProducts = searchQuery.trim().length >= 2
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : byCategory;

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <SearchBar
          placeholder="Search products…"
          onQueryChange={setSearchQuery}
        />
      </div>

      <FilterBar
        activeCategory={activeCategory}
        onCategoryChange={cat => { setActiveCategory(cat); setSearchQuery(''); }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 32px' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '36px', color: 'var(--text)', marginBottom: '12px' }}>
              No products found.
            </div>
            <div style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '14px', color: 'var(--text2)', marginBottom: '28px' }}>
              Try a different category or clear your filters.
            </div>
            <button
              onClick={() => setActiveCategory('all')}
              style={{ padding: '11px 28px', borderRadius: '100px', background: 'var(--navy)', color: 'white', border: 'none', fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              Clear filters
            </button>
          </div>
        ) : filteredProducts.map((product, index) => (
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