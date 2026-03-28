import Link from 'next/link';
import React from 'react';
import { ShimmerBlock } from '../ui/ShimmerBlock';
import { ScrollReveal } from '../ui/ScrollReveal';

const channels = [
  {
    number: '01',
    name: 'Clive Direct',
    description: 'Buy directly on clive.dev at the best available price.',
    isDark: true,
    href: '/',
  },
  {
    number: '02',
    name: 'AWS Marketplace',
    description: 'Deploy ML models as SageMaker endpoints...',
    isDark: false,
    href: 'https://aws.amazon.com/marketplace',
  },
  {
    number: '03',
    name: 'RapidAPI',
    description: 'All thirteen developer APIs and three ML model products listed...',
    isDark: false,
    href: 'https://rapidapi.com/clive',
  },
];

export function ChannelsSection() {
  return (
    <section className="py-24 px-14">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-border bg-border">
          {channels.map((channel, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              {channel.isDark ? (
                <ShimmerBlock animation="slow" className="h-full">
                  <div className="p-11 h-full flex flex-col">
                    <div className="text-[48px] font-display font-light text-white/05 mb-4">
                      {channel.number}
                    </div>
                    <h3 className="text-[24px] font-display mb-3">{channel.name}</h3>
                    <p className="text-[13px] font-serif text-white/38 mb-6">
                      {channel.description}
                    </p>
                    <Link 
                      href={channel.href}
                      className="flex items-center space-x-2 text-[10px] font-mono text-navy mt-auto transition-all group"
                    >
                      <span>Learn more</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </ShimmerBlock>
              ) : (
                <div className="p-11 bg-white hover:bg-paper transition-colors">
                  <div className="text-[48px] font-display font-light text-border2 mb-4">
                    {channel.number}
                  </div>
                  <h3 className="text-[24px] font-display mb-3">{channel.name}</h3>
                  <p className="text-[13px] font-serif text-text2 mb-6">
                    {channel.description}
                  </p>
                  <Link 
                    href={channel.href}
                    className="flex items-center space-x-2 text-[10px] font-mono text-navy mt-auto transition-all group"
                  >
                    <span>Learn more</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              )}
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}