'use client';
import Link from 'next/link';
import React from 'react';
import { Product } from '@/lib/products';
import { ProductIcon } from '../icons/ProductIcon';

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const categoryLabels: Record<string, string> = {
    ml: 'ML Model',
    api: 'Developer API',
    ext: 'Chrome Extension',
    app: 'Web Application',
  };

  return (
    <Link href={`/products/${product.slug}`} className="block group">
      <div className="p-8 h-full flex flex-col justify-between relative overflow-hidden transition-all"
        style={{
          background: '#07070A',
          border: '1px solid rgba(255,255,255,0.08)',
          borderTop: '1.5px solid rgba(255,255,255,0.14)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset',
        }}
      >
        <div>
          <div style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '9px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(91,148,210,0.65)',
            marginBottom: '16px',
          }}>
            {categoryLabels[product.category]}
          </div>
          <div className="mb-4">
            <ProductIcon slug={product.slug} size={44} className="mb-4" />
          </div>
          <h3 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '26px',
            fontWeight: 400,
            color: 'white',
            marginBottom: '12px',
          }}>
            {product.name}
          </h3>
          <p style={{
            fontSize: '13px',
            fontFamily: 'Libre Baskerville, serif',
            color: 'rgba(255,255,255,0.45)',
            marginBottom: '24px',
            lineHeight: 1.75,
          }}>
            {product.tagline}
          </p>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div style={{
            fontSize: '11px',
            fontFamily: 'DM Mono, monospace',
            color: 'rgba(255,255,255,0.30)',
          }}>
            {product.pricing.display} {product.pricing.unit}
          </div>
          <div className="flex items-center justify-center w-8 h-8 rounded-sm transition-all group-hover:bg-navy"
            style={{
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            <span className="text-[12px] font-mono">→</span>
          </div>
        </div>
        {/* Hover lift shadow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ boxShadow: '0 4px 28px rgba(0,0,0,0.55), 0 1px 0 rgba(91,148,210,0.1) inset' }}
        />
      </div>
    </Link>
  );
}
