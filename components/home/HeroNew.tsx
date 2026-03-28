'use client';
import Link from 'next/link';
import React from 'react';
import { SectionKicker } from '../ui/SectionKicker';
import { ScrollReveal } from '../ui/ScrollReveal';

export function HeroNew() {
  return (
    <div className="hero min-h-screen pt-32 pb-20 px-12 lg:px-14 relative overflow-hidden bg-black">
      <div className="hero-mesh absolute inset-0 pointer-events-none z-0"></div>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
      
      <div className="hero-inner max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-1">
        <ScrollReveal>
          <div>
            <div className="hero-kicker flex items-center gap-2.5 mb-6">
              <div className="kicker-dot w-4.5 h-4.5 rounded-full bg-navy flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-badge-live"></div>
              </div>
              <span className="text-[10px] font-mono tracking-[0.24em] uppercase text-steel/80">
                Developer Platform · 24+ Products
              </span>
            </div>
            <h1 className="hero-h1 font-display text-[clamp(56px,7.5vw,104px)] text-white mb-6 tracking-[-0.03em]">
              Build<br />with<br />
              <em><span className="neon-word">precision.</span></em>
            </h1>
            <p className="hero-sub text-base font-serif italic text-white/45 leading-relaxed mb-11 max-w-xl">
              APIs, machine learning models, Chrome extensions, and security tools — every product engineered for developers who demand more.
            </p>
            <div className="hero-actions flex gap-3 flex-wrap mb-13">
              <Link 
                href="/#products" 
                className="lg-navy flex items-center gap-2 px-8 py-3.5 text-[11px] font-mono font-medium tracking-[0.1em] uppercase transition-all relative overflow-hidden"
              >
                Browse products
              </Link>
              <Link 
                href="/docs" 
                className="lg flex items-center gap-2 px-8 py-3.5 text-[11px] font-mono font-medium tracking-[0.1em] uppercase transition-all relative overflow-hidden"
              >
                Read the docs
              </Link>
            </div>
            <div className="hero-trust flex gap-5 flex-wrap">
              <span className="trust-item flex items-center gap-2 text-[10px] font-mono tracking-[0.1em] uppercase text-white/30">24+ Products</span>
              <span className="trust-sep text-white/05">·</span>
              <span className="trust-item flex items-center gap-2 text-[10px] font-mono tracking-[0.1em] uppercase text-white/30">3 Marketplaces</span>
              <span className="trust-sep text-white/05">·</span>
              <span className="trust-item flex items-center gap-2 text-[10px] font-mono tracking-[0.1em] uppercase text-white/30">AWS Marketplace</span>
              <span className="trust-sep text-white/05">·</span>
              <span className="trust-item flex items-center gap-2 text-[10px] font-mono tracking-[0.1em] uppercase text-white/30">RapidAPI</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
