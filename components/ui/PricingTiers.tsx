import React from 'react';
import { PricingTier } from '@/lib/products';

interface PricingTiersProps {
  tiers: PricingTier[];
}

export function PricingTiers({ tiers }: PricingTiersProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {tiers.map((tier, index) => (
        <div key={index} className={`tier-row-dark${tier.highlight ? ' highlight' : ''}`}>
          <div>
            <div style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: tier.highlight ? 'white' : 'rgba(255,255,255,0.65)',
              marginBottom: '4px',
            }}>
              {tier.name}
            </div>
            <div style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              color: tier.highlight ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.32)',
            }}>
              {tier.calls}
            </div>
          </div>
          <div style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '28px',
            fontWeight: 300,
            color: tier.highlight ? 'white' : 'rgba(255,255,255,0.75)',
            letterSpacing: '-0.02em',
          }}>
            {tier.price}
          </div>
        </div>
      ))}
    </div>
  );
}
