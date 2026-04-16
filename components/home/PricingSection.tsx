import Link from 'next/link';
import React from 'react';
import { ScrollReveal } from '../ui/ScrollReveal';

const pricingTiers = [
  {
    name: 'Starter',
    price: '$0',
    period: 'per month, forever',
    features: [
      'Free tier on every product',
      '500–1,000 API calls / month',
      'One Chrome extension included',
      'Community support',
      'No credit card required',
    ],
    isFeatured: false,
  },
  {
    name: 'Developer',
    price: '$49',
    period: 'per month · saves 40% vs individual',
    features: [
      'All thirteen developer APIs',
      '500,000 API calls / month',
      'All eight Chrome extensions — Pro tier',
      'EmbedCore and SearchCore included',
      'Email support',
    ],
    isFeatured: true,
  },
  {
    name: 'Business',
    price: '$149',
    period: 'per month',
    features: [
      'Everything in Developer',
      'Five million API calls / month',
      'ShieldKit Business tier included',
      'Priority Slack and email support',
      '99.9% uptime SLA',
    ],
    isFeatured: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" aria-label="Clive pricing plans" className="bg-black2 py-24 px-12 lg:px-14 border-t border-white/05">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="mb-16">
            <div className="pricing-kicker flex items-center space-x-3 mb-4">
              <div className="h-[2px] w-[28px]" />
              <span className="text-[10px] font-mono tracking-[0.22em] uppercase">Pricing</span>
            </div>
            <h2 className="pricing-h2 text-[clamp(40px,4.5vw,64px)] font-display font-light mb-4 tracking-[-0.025em]">
              Start free.<br/>
              <span>Scale honestly.</span>
            </h2>
            <p className="pricing-sub text-base font-serif italic max-w-2xl">
              Every product has a free tier. Subscribe individually or save 40% with a platform bundle.
            </p>
          </div>
        </ScrollReveal>
        
        <div className="pricing-grid grid grid-cols-1 md:grid-cols-3 gap-5">
          {pricingTiers.map((tier, index) => (
            <ScrollReveal key={index} delay={index * 0.15}>
              <div className={`price-card ${tier.isFeatured ? 'featured' : 'lg'}`}>
                <div className="price-tier">{tier.isFeatured ? 'Developer' : tier.name}</div>
                <div className="price-n">
                  <span><sup>$</sup>{tier.price.replace('$', '')}</span>
                </div>
                <div className="price-per">{tier.period}</div>
                <div className="price-rule" />
                <ul className="price-list">
                  {tier.features.map((feature, i) => (
                    <li key={i}>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.price === '$149' ? 'mailto:sales@clive.dev' : '/auth?screen=signup'}
                  className="price-cta"
                >
                  {tier.isFeatured ? 'Start Developer plan' : (
                    tier.price === '$0' ? 'Get started free' : 'Contact sales'
                  )}
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
