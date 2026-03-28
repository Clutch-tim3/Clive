'use client';
import Link from 'next/link';
import React from 'react';
import { Product } from '@/lib/products';
import { ShimmerBlock } from '../ui/ShimmerBlock';
import { SectionKicker } from '../ui/SectionKicker';
import { EndpointList } from '../ui/EndpointList';
import { PricingTiers } from '../ui/PricingTiers';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const categoryLabels = {
    ml: 'ML Model',
    api: 'Developer API',
    ext: 'Chrome Extension',
    app: 'Web Application',
  };

  const channelLabels = {
    direct: 'Clive Direct',
    rapidapi: 'RapidAPI',
    aws: 'AWS Marketplace',
    gumroad: 'Gumroad',
    'chrome-store': 'Chrome Web Store',
  };

  return (
    <div>
      <section className="pt-24 pb-18 px-14 border-b border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div>
            <Link 
              href="/#products" 
              className="inline-block mb-6 text-[10px] font-mono tracking-[0.14em] uppercase text-text3 hover:text-ink transition-colors"
            >
              ← All products
            </Link>
            <SectionKicker>
              {categoryLabels[product.category]}
            </SectionKicker>
            <h1 className="text-[clamp(52px,6.5vw,88px)] font-display font-light mb-4">
              {product.name}
            </h1>
            <p className="text-[17px] font-serif italic text-text2 mb-8">
              {product.tagline}
            </p>
            <div className="flex items-center space-x-4">
              <Link 
                href="/#" 
                className="px-6 py-3 bg-black text-white text-[11px] font-mono tracking-[0.12em] uppercase rounded-sm hover:bg-navy transition-colors"
              >
                Get started
              </Link>
              <Link 
                href="/docs" 
                className="px-6 py-3 border border-border text-[11px] font-mono tracking-[0.12em] uppercase rounded-sm hover:bg-paper transition-colors"
              >
                View documentation
              </Link>
            </div>
          </div>
          
          <div className="sticky top-22">
            <ShimmerBlock variant="lg-strong">
              <div className="p-9">
                <div className="text-[9.5px] font-mono text-white/20 mb-2">
                  {product.pricing.label}
                </div>
                <div className="text-[48px] font-display font-light text-white mb-1">
                  {product.pricing.display}
                </div>
                <div className="text-[10px] font-mono text-white/25 mb-6">
                  {product.pricing.unit}
                </div>
                <hr className="border-white/08 mb-6" />
                <ul className="space-y-3 mb-8">
                  {product.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-[11px] font-mono text-navy/65 mt-0.5">–</span>
                      <span className="text-[12.5px] font-serif text-white/38">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/#" 
                  className="block w-full py-3 text-center bg-white text-black text-[11px] font-mono tracking-[0.12em] uppercase rounded-sm hover:bg-paper transition-colors mb-3"
                >
                  Get started
                </Link>
                <Link 
                  href="/#" 
                  className="block w-full py-3 text-center border border-white/10 text-[11px] font-mono tracking-[0.12em] uppercase rounded-sm hover:bg-white/05 transition-colors"
                >
                  View documentation
                </Link>
              </div>
            </ShimmerBlock>
          </div>
        </div>
      </section>
      
      <section className="py-18 px-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2">
            <div className="mb-12">
              <SectionKicker>Overview</SectionKicker>
              <h2 className="text-[34px] font-display font-light mb-6">
                {product.overview.title}
              </h2>
              <div className="space-y-4">
                {product.overview.body.map((paragraph, index) => (
                  <p key={index} className="text-[14px] font-serif text-text2 line-height-190">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            
            <div className="mb-12">
              <SectionKicker>Endpoints / Capabilities</SectionKicker>
              <h2 className="text-[34px] font-display font-light mb-6">
                API endpoints
              </h2>
              <EndpointList endpoints={product.endpoints} />
            </div>
            
            <div>
              <SectionKicker>Pricing</SectionKicker>
              <h2 className="text-[34px] font-display font-light mb-6">
                Pricing tiers
              </h2>
              <PricingTiers tiers={product.pricing.tiers} />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="p-6 border border-border bg-paper rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-[9px] font-mono tracking-[0.14em] uppercase text-text3 mb-3">
                Category
              </div>
              <div className="text-[18px] font-display">
                {categoryLabels[product.category]}
              </div>
            </div>
            
            <div className="p-6 border border-border bg-paper rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-[9px] font-mono tracking-[0.14em] uppercase text-text3 mb-3">
                Available on
              </div>
              <div className="space-y-2">
                {product.channels.map((channel, index) => (
                  <div key={index} className="text-[18px] font-display">
                    {channelLabels[channel]}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border border-border bg-paper rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-[9px] font-mono tracking-[0.14em] uppercase text-text3 mb-3">
                Free tier
              </div>
              <div className="text-[18px] font-display">
                {product.freeTier}
              </div>
            </div>
            
            <div className="p-6 border border-border bg-paper rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-[9px] font-mono tracking-[0.14em] uppercase text-text3 mb-3">
                Authentication
              </div>
              <div className="text-[18px] font-display">
                API key
              </div>
            </div>
            
            {product.licence && (
              <div className="p-6 border border-border bg-paper rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-[9px] font-mono tracking-[0.14em] uppercase text-text3 mb-3">
                  Data licence
                </div>
                <div className="text-[18px] font-display">
                  {product.licence}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}