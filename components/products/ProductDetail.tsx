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

  const metaCardStyle: React.CSSProperties = {
    padding: '24px 28px',
    border: '1px solid var(--border)',
    background: 'var(--paper)',
    borderRadius: 'var(--r-md)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    transition: 'box-shadow 0.2s',
  };

  const metaLabelStyle: React.CSSProperties = {
    fontSize: '10px',
    fontFamily: 'DM Mono, monospace',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--text3)',
    marginBottom: '8px',
  };

  const metaValStyle: React.CSSProperties = {
    fontSize: '20px',
    fontFamily: 'Cormorant Garamond, serif',
    fontWeight: 300,
    color: 'var(--ink)',
  };

  return (
    <div>
      {/* Hero row */}
      <section className="pt-24 pb-18 px-14 border-b border-border">
        <div
          className="max-w-7xl mx-auto items-start"
          style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '80px' }}
        >
          <div>
            <Link
              href="/#products"
              className="inline-block mb-6 text-[10px] font-mono tracking-[0.14em] uppercase text-text3 hover:text-ink transition-colors"
            >
              ← All products
            </Link>
            <SectionKicker>{categoryLabels[product.category]}</SectionKicker>
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
                <div className="text-[60px] font-display font-light text-white leading-none mb-1">
                  {product.pricing.display}
                </div>
                <div className="text-[10px] font-mono text-white/25 mb-7">
                  {product.pricing.unit}
                </div>
                <hr className="border-white/08 mb-7" />
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
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

      {/* Body row */}
      <section className="py-18 px-14">
        <div
          className="max-w-7xl mx-auto"
          style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '80px', alignItems: 'start' }}
        >
          {/* Main content */}
          <div>
            <div style={{ marginBottom: '80px' }}>
              <SectionKicker>Overview</SectionKicker>
              <h2 className="text-[34px] font-display font-light" style={{ marginBottom: '20px' }}>
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

            <div style={{ marginBottom: '80px' }}>
              <SectionKicker>Endpoints / Capabilities</SectionKicker>
              <h2 className="text-[34px] font-display font-light" style={{ marginBottom: '24px' }}>
                API endpoints
              </h2>
              <EndpointList endpoints={product.endpoints} />
            </div>

            <div>
              <SectionKicker>Pricing</SectionKicker>
              <h2 className="text-[34px] font-display font-light" style={{ marginBottom: '24px' }}>
                Pricing tiers
              </h2>
              <PricingTiers tiers={product.pricing.tiers} />
            </div>
          </div>

          {/* Sidebar meta cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={metaCardStyle}>
              <div style={metaLabelStyle}>Category</div>
              <div style={metaValStyle}>{categoryLabels[product.category]}</div>
            </div>

            <div style={metaCardStyle}>
              <div style={metaLabelStyle}>Available on</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {product.channels.map((channel, index) => (
                  <div key={index} style={metaValStyle}>
                    {channelLabels[channel]}
                  </div>
                ))}
              </div>
            </div>

            <div style={metaCardStyle}>
              <div style={metaLabelStyle}>Free tier</div>
              <div style={metaValStyle}>{product.freeTier}</div>
            </div>

            <div style={metaCardStyle}>
              <div style={metaLabelStyle}>Authentication</div>
              <div style={metaValStyle}>API key</div>
            </div>

            {product.licence && (
              <div style={metaCardStyle}>
                <div style={metaLabelStyle}>Data licence</div>
                <div style={metaValStyle}>{product.licence}</div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
