import React from 'react';
import { ScrollReveal } from '../ui/ScrollReveal';

const stats = [
  { number: '24<span>+</span>', label: 'Products shipped' },
  { number: '3', label: 'Marketplaces' },
  { number: '8', label: 'Chrome extensions' },
  { number: '60<span>%</span>', label: 'Below market pricing' },
];

export function StatsStrip() {
  return (
    <section className="stats-strip-dark py-14 px-12 lg:px-14">
      <div className="stats-inner max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
        {stats.map((stat, index) => (
          <ScrollReveal key={index} delay={index * 0.1}>
            <div className={`stat-item px-10 ${
              index > 0 ? 'relative' : ''
            }`}>
              {index > 0 && (
                <div className="absolute left-0 top-0 bottom-0 w-px bg-white/06"></div>
              )}
              <div className="stat-n font-display text-[60px] font-light leading-none tracking-[-0.03em] text-white">
                <span dangerouslySetInnerHTML={{ __html: stat.number }}></span>
              </div>
              <div className="stat-l text-[10px] font-mono tracking-[0.15em] uppercase text-white/30 mt-1">
                {stat.label}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}