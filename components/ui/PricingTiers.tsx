import React from 'react';
import { PricingTier } from '@/lib/products';

interface PricingTiersProps {
  tiers: PricingTier[];
}

export function PricingTiers({ tiers }: PricingTiersProps) {
  return (
    <div className="space-y-3">
      {tiers.map((tier, index) => (
        <div
          key={index}
          className={`flex items-center justify-between p-4.5 border border-border rounded-lg shadow-sm hover:shadow-md ${
            tier.highlight ? 'bg-navy text-white' : 'bg-white hover:bg-paper'
          }`}
        >
          <div>
            <div className="text-[11px] font-mono tracking-[0.14em] uppercase mb-1">
              {tier.name}
            </div>
            <div className={`text-[11px] font-mono ${
              tier.highlight ? 'text-white/40' : 'text-text3'
            }`}>
              {tier.calls}
            </div>
          </div>
          <div className={`text-2xl font-display ${
            tier.highlight ? 'text-white' : 'text-ink'
          }`}>
            {tier.price}
          </div>
        </div>
      ))}
    </div>
  );
}