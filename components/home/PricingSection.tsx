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
    <section id="pricing" className="bg-black2 py-24 px-12 lg:px-14 border-t border-white/05">
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
              <div className={`price-card rounded-[40px] p-10 relative overflow-hidden transition-all ${
                tier.isFeatured 
                  ? 'featured bg-navy border border-steel/40 border-t border-steel/60 shadow-[0_1px_0_rgba(91,148,210,0.2)_inset,0_24px_64px_rgba(27,48,91,0.35)] hover:translate-y-[-6px] hover:shadow-[0_1px_0_rgba(91,148,210,0.25)_inset,0_32px_80px_rgba(27,48,91,0.45)]' 
                  : 'lg border border-white/12 bg-white/06 hover:translate-y-[-4px] hover:shadow-lg'
              }`}>
                <div className="price-tier text-[10px] font-mono tracking-[0.2em] uppercase mb-6">
                  {tier.isFeatured ? 'Developer' : tier.name}
                </div>
                <div className="price-n font-display text-[64px] font-light leading-none mb-1 tracking-[-0.03em]">
                  {tier.isFeatured ? (
                    <span>${tier.price.replace('$', '')}</span>
                  ) : (
                    <span><sup>$</sup>{tier.price.replace('$', '')}</span>
                  )}
                </div>
                <div className="price-per text-[10px] font-mono tracking-[0.08em] mb-7">
                  {tier.period}
                </div>
                <div className="price-rule h-px mb-6"></div>
                <ul className="price-list space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="text-sm flex items-start gap-2.5">
                      <span className="text-[10px] font-mono mt-0.5 text-steel/50">–</span>
                      <span>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/#" 
                  className={`block w-full text-center px-4 py-3.5 text-[10.5px] font-mono tracking-[0.12em] uppercase rounded-[100px] transition-all ${
                    tier.isFeatured 
                      ? 'bg-white/90 text-navy border-transparent hover:bg-white' 
                      : 'bg-transparent text-white border border-white/12 hover:bg-white/10'
                  }`}
                >
                  {tier.isFeatured ? 'Start Developer plan' : (
                    tier.price === '$0' ? 'Get started' : 'Contact sales'
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
