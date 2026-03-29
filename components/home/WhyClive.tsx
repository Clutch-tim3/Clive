import React from 'react';
import { SectionKicker } from '../ui/SectionKicker';
import { ScrollReveal } from '../ui/ScrollReveal';

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="rgba(91,148,210,0.9)" strokeWidth="1.5" fill="rgba(27,48,91,0.3)"/>
      </svg>
    ),
    title: 'Sub-15ms latency',
    description: 'GPU-accelerated endpoints across every ML product. EmbedCore processes 256 texts in a single batch at under 15ms p50.'
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="rgba(91,148,210,0.9)" strokeWidth="1.5" fill="rgba(27,48,91,0.3)"/>
        <path d="M8 12l3 3 5-5" stroke="rgba(91,148,210,0.8)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: '60% below market',
    description: 'EmbedCore costs $0.008 per 1M tokens versus $0.020 for OpenAI. ShieldKit delivers VirusTotal-level coverage at 95% lower cost.'
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="11" width="18" height="10" rx="2" stroke="rgba(91,148,210,0.9)" strokeWidth="1.5" fill="rgba(27,48,91,0.3)"/>
        <path d="M7 11V7a5 5 0 0110 0v4" stroke="rgba(91,148,210,0.8)" strokeWidth="1.5"/>
      </svg>
    ),
    title: 'Apache 2.0 licensed',
    description: 'Every ML model uses fully commercial base models. No royalties, no usage restrictions, no legal exposure. Build products without permission.'
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7L2 9l7-1z" stroke="rgba(91,148,210,0.9)" strokeWidth="1.5" fill="rgba(27,48,91,0.3)"/>
      </svg>
    ),
    title: 'AI synthesis layer',
    description: 'HackKit and MeetingIQ use Claude to turn raw data into structured narratives — red team reports, action items, executive summaries — that no competing tool generates.'
  }
];

export function WhyClive() {
  return (
    <section className="py-24 px-12 lg:px-14 bg-black2 relative overflow-hidden border-t border-white/05">
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient"></div>
      <div className="max-w-7xl mx-auto relative z-1">
        <ScrollReveal>
          <div className="mb-12">
            <SectionKicker className="text-steel/60">
              Why Clive
            </SectionKicker>
            <h2 className="text-[clamp(40px,4.5vw,64px)] font-display font-light text-white mb-4 tracking-[-0.025em]">
              One credential.<br/>
              <span>Every capability.</span>
            </h2>
            <p className="text-base font-serif italic text-white/40 max-w-2xl">
              Stop managing seven subscriptions and three self-hosted services. Everything you need to build, secured, searched, and shipped.
            </p>
          </div>
        </ScrollReveal>
        <div className="lg-card-grid">
          {features.map((feature, index) => (
            <ScrollReveal key={index} delay={0.1 * index}>
              <div className="lg-info-card">
                <div className="lg-info-icon">
                  {feature.icon}
                </div>
                <div className="lg-info-title">
                  {feature.title}
                </div>
                <div className="lg-info-desc">
                  {feature.description}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
