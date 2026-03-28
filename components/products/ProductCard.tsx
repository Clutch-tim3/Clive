'use client';
import Link from 'next/link';
import React from 'react';
import { Product } from '@/lib/products';
import { ShimmerBlock } from '../ui/ShimmerBlock';
import { SectionKicker } from '../ui/SectionKicker';
import { ProductIcon } from '../icons/ProductIcon';

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const categoryLabels = {
    ml: 'ML Model',
    api: 'Developer API',
    ext: 'Chrome Extension',
    app: 'Web Application',
  };

  const animationMap: Record<string, 'fast' | 'default' | 'slow'> = {
    '0': 'fast',
    '1': 'default',
    '2': 'slow',
  };

  const isDark = product.isDark || false;

  return (
    <Link href={`/products/${product.slug}`} className="block group">
      {isDark ? (
        <ShimmerBlock
          animation={animationMap[index.toString()] || 'default'}
          isDark={true}
          variant="water"
          className="h-full"
        >
          <div className="p-8 h-full flex flex-col justify-between hover:bg-black2 transition-colors">
            <div>
              <SectionKicker className="text-white/30">
                {categoryLabels[product.category]}
              </SectionKicker>
              <div className="mb-4">
                <ProductIcon slug={product.slug} size={44} className="mb-4" />
              </div>
              <h3 className="text-[26px] font-display font-normal text-white mb-4">
                {product.name}
              </h3>
              <p className="text-[13px] font-serif text-white/38 mb-6 line-height-75">
                {product.tagline}
              </p>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <div className="text-[11px] font-mono text-white/40">
                {product.pricing.display} {product.pricing.unit}
              </div>
              <div className="flex items-center justify-center w-8 h-8 border border-white/20 rounded-sm group-hover:bg-navy group-hover:border-navy transition-colors">
                <span className="text-[12px] font-mono text-white">→</span>
              </div>
            </div>
          </div>
        </ShimmerBlock>
      ) : (
        <div className="p-8 bg-white hover:bg-paper transition-colors border-b border-r border-border last:border-r-0 last:border-b-0 group relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-navy to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          <div>
            <SectionKicker>
              {categoryLabels[product.category]}
            </SectionKicker>
            <div className="mb-4">
              <ProductIcon slug={product.slug} size={44} className="mb-4" />
            </div>
            <h3 className="text-[26px] font-display font-normal mb-4">
              {product.name}
            </h3>
            <p className="text-[13px] font-serif text-text2 mb-6 line-height-75">
              {product.tagline}
            </p>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <div className="text-[11px] font-mono text-text3">
              {product.pricing.display} {product.pricing.unit}
            </div>
            <div className="flex items-center justify-center w-8 h-8 border border-border rounded-sm group-hover:bg-black group-hover:text-white group-hover:border-black transition-colors">
              <span className="text-[12px] font-mono">→</span>
            </div>
          </div>
        </div>
      )}
    </Link>
  );
}