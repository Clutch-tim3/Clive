'use client';
import Link from 'next/link';
import React from 'react';
import { Product } from '@/lib/products';
import { ShimmerBlock } from '../ui/ShimmerBlock';
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
    <div className="detail-page">
      {/* Atmosphere layers */}
      <div className="detail-mesh" />
      <div className="detail-scan" />

      {/* ── Hero section ── */}
      <section style={{ padding: '96px 48px 72px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div
          className="max-w-7xl mx-auto"
          style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '80px', alignItems: 'start' }}
        >
          {/* Left — headings + CTAs */}
          <div>
            <Link href="/#products" className="detail-back">
              ← All products
            </Link>

            <div className="detail-cat">{categoryLabels[product.category]}</div>

            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(54px, 7vw, 92px)',
              fontWeight: 300,
              color: 'white',
              marginBottom: '18px',
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}>
              {product.name}
            </h1>

            <p style={{
              fontSize: '17px',
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.75,
              maxWidth: '500px',
              marginBottom: '36px',
              fontFamily: 'Libre Baskerville, serif',
            }}>
              {product.tagline}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link href={`/auth?screen=signup&product=${product.slug}`} className="side-cta" style={{ display: 'inline-block', width: 'auto', padding: '12px 28px', marginBottom: 0 }}>
                Get started
              </Link>
              <Link href="/docs" className="side-cta-ghost" style={{ display: 'inline-block', width: 'auto', padding: '11px 28px' }}>
                Documentation
              </Link>
            </div>
          </div>

          {/* Right — sticky sidebar price card */}
          <div className="detail-side">
            <ShimmerBlock variant="lg-strong">
              <div style={{ padding: '40px' }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9.5px', color: 'rgba(255,255,255,0.2)', marginBottom: '8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  {product.pricing.label}
                </div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '62px', fontWeight: 300, color: 'white', lineHeight: 1, marginBottom: '4px', letterSpacing: '-0.03em' }}>
                  {product.pricing.display}
                </div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginBottom: '28px' }}>
                  {product.pricing.unit}
                </div>
                <hr style={{ borderColor: 'rgba(255,255,255,0.08)', marginBottom: '28px' }} />
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px', listStyle: 'none', padding: 0 }}>
                  {product.features.slice(0, 4).map((feature, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(91,148,210,0.65)', marginTop: '2px', flexShrink: 0 }}>–</span>
                      <span style={{ fontSize: '12.5px', fontFamily: 'Libre Baskerville, serif', color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link href={`/auth?screen=signup&product=${product.slug}`} className="side-cta">Get started</Link>
                  <Link href="/docs" className="side-cta-ghost">View documentation</Link>
                </div>
              </div>
            </ShimmerBlock>
          </div>
        </div>
      </section>

      {/* ── Body section ── */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '80px 48px 120px', display: 'grid', gridTemplateColumns: '1fr 420px', gap: '80px', alignItems: 'start' }}>

        {/* Main content */}
        <div>
          {/* Overview */}
          <div style={{ marginBottom: '80px' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9.5px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.65)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '18px', height: '1px', background: 'rgba(91,148,210,0.5)', flexShrink: 0 }} />
              Overview
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '38px', fontWeight: 300, color: 'white', marginBottom: '20px', letterSpacing: '-0.02em' }}>
              {product.overview.title}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {product.overview.body.map((paragraph, i) => (
                <p key={i} style={{ fontSize: '14px', lineHeight: 1.9, color: 'rgba(255,255,255,0.5)', fontFamily: 'Libre Baskerville, serif' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Endpoints */}
          <div style={{ marginBottom: '80px' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9.5px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.65)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '18px', height: '1px', background: 'rgba(91,148,210,0.5)', flexShrink: 0 }} />
              Endpoints / Capabilities
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '38px', fontWeight: 300, color: 'white', marginBottom: '24px', letterSpacing: '-0.02em' }}>
              API endpoints
            </h2>
            <EndpointList endpoints={product.endpoints} />
          </div>

          {/* Pricing */}
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9.5px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.65)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '18px', height: '1px', background: 'rgba(91,148,210,0.5)', flexShrink: 0 }} />
              Pricing
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '38px', fontWeight: 300, color: 'white', marginBottom: '24px', letterSpacing: '-0.02em' }}>
              Pricing tiers
            </h2>
            <PricingTiers tiers={product.pricing.tiers} />
          </div>
        </div>

        {/* Sidebar meta cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'sticky', top: '88px' }}>
          <div className="meta-card-dark">
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.55)', marginBottom: '10px' }}>
              Category
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 300, color: 'white' }}>
              {categoryLabels[product.category]}
            </div>
          </div>

          <div className="meta-card-dark">
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.55)', marginBottom: '10px' }}>
              Available on
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {product.channels.map((channel, i) => (
                <div key={i} style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 300, color: 'white' }}>
                  {channelLabels[channel]}
                </div>
              ))}
            </div>
          </div>

          <div className="meta-card-dark">
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.55)', marginBottom: '10px' }}>
              Free tier
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 300, color: 'white' }}>
              {product.freeTier}
            </div>
          </div>

          <div className="meta-card-dark">
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.55)', marginBottom: '10px' }}>
              Authentication
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 300, color: 'white' }}>
              API Key (Header)
            </div>
          </div>

          {product.licence && (
            <div className="meta-card-dark">
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.55)', marginBottom: '10px' }}>
                Data licence
              </div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 300, color: 'white' }}>
                {product.licence}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
