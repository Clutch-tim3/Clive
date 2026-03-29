import React from 'react';
import { PricingTier } from '@/lib/products';

interface PricingTiersProps {
  tiers: PricingTier[];
}

export function PricingTiers({ tiers }: PricingTiersProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {tiers.map((tier, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderRadius: 'var(--r-md)',
            border: '1px solid var(--border)',
            background: tier.highlight ? 'var(--navy)' : 'var(--paper)',
            color: tier.highlight ? 'white' : 'var(--ink)',
            boxShadow: tier.highlight
              ? '0 4px 20px rgba(27,48,91,0.25)'
              : '0 1px 4px rgba(0,0,0,0.04)',
            transition: 'box-shadow 0.2s',
          }}
        >
          <div>
            <div style={{
              fontSize: '11px',
              fontFamily: 'DM Mono, monospace',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '4px',
              color: tier.highlight ? 'white' : 'var(--ink)',
            }}>
              {tier.name}
            </div>
            <div style={{
              fontSize: '11px',
              fontFamily: 'DM Mono, monospace',
              color: tier.highlight ? 'rgba(255,255,255,0.4)' : 'var(--text3)',
            }}>
              {tier.calls}
            </div>
          </div>
          <div style={{
            fontSize: '24px',
            fontFamily: 'Cormorant Garamond, serif',
            fontWeight: 300,
            color: tier.highlight ? 'white' : 'var(--ink)',
          }}>
            {tier.price}
          </div>
        </div>
      ))}
    </div>
  );
}
