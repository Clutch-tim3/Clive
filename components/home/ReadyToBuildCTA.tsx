import Link from 'next/link';
import React from 'react';

export function ReadyToBuildCTA() {
  return (
    <section className="relative bg-black py-30 px-12 lg:px-14 overflow-hidden border-t border-white/05">
      {/* Ambient orbs */}
      <div className="absolute pointer-events-none rounded-full blur-[90px] w-[600px] h-[600px] bg-navy/20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute pointer-events-none rounded-full blur-[70px] w-[300px] h-[300px] bg-steel/7 right-[10%] top-[20%]"></div>
      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(27,48,91,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(27,48,91,0.04)_1px,transparent_1px)] bg-[length:52px_52px]"></div>
      <div className="max-w-[800px] mx-auto text-center relative z-1">
        <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-steel/55 mb-5 flex items-center justify-center gap-3">
          <span className="block w-7 h-px bg-steel/35"></span>
          Get started today
          <span className="block w-7 h-px bg-steel/35"></span>
        </div>
        <h2 className="font-display font-light text-[clamp(44px,6vw,80px)] text-white tracking-[-0.03em] leading-none mb-5">
          Ready to build?
        </h2>
        <p className="text-base font-serif italic text-white/40 leading-[1.85] mb-12 max-w-[540px] mx-auto">
          Every product ships with a free tier. No credit card. No minimum commitment. Start with one API and expand as you grow.
        </p>
        {/* CTA buttons row */}
        <div className="flex items-center justify-center gap-3.5 flex-wrap mb-14">
          {/* Primary liquid glass capsule */}
          <Link 
            href="/#products"
            className="inline-flex items-center gap-2.25 px-9 py-3.75 rounded-full font-mono text-[11px] font-medium tracking-[0.12em] uppercase bg-white/92 backdrop-blur-sm border border-white/70 border-t-white text-black shadow-[0_1px_0_white_inset,0_8px_28px_rgba(0,0,0,0.25)] transition-all hover:bg-white"
          >
            Browse products →
          </Link>
          {/* Ghost glass capsule */}
          <Link 
            href="/docs"
            className="inline-flex items-center gap-2.25 px-9 py-3.75 rounded-full font-mono text-[11px] tracking-[0.12em] uppercase bg-navy/60 backdrop-blur-md border border-steel/30 border-t-steel/50 text-white shadow-[0_1px_0_rgba(91,148,210,0.2)_inset,0_8px_24px_rgba(27,48,91,0.35)] transition-all hover:bg-navy/70"
          >
            View documentation
          </Link>
        </div>
        {/* Trust signals row */}
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2 font-mono text-[9.5px] tracking-[0.12em] uppercase text-white/28">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="rgba(91,148,210,0.6)" strokeWidth="1.5"/><path d="M8 12l3 3 5-5" stroke="rgba(91,148,210,0.6)" strokeWidth="1.5" strokeLinecap="round"/></svg>
            Free tier on every product
          </div>
          <div className="flex items-center gap-2 font-mono text-[9.5px] tracking-[0.12em] uppercase text-white/28">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="rgba(91,148,210,0.6)" strokeWidth="1.5"/><path d="M8 12l3 3 5-5" stroke="rgba(91,148,210,0.6)" strokeWidth="1.5" strokeLinecap="round"/></svg>
            No credit card required
          </div>
          <div className="flex items-center gap-2 font-mono text-[9.5px] tracking-[0.12em] uppercase text-white/28">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="rgba(91,148,210,0.6)" strokeWidth="1.5"/><path d="M8 12l3 3 5-5" stroke="rgba(91,148,210,0.6)" strokeWidth="1.5" strokeLinecap="round"/></svg>
            Instant API key
          </div>
          <div className="flex items-center gap-2 font-mono text-[9.5px] tracking-[0.12em] uppercase text-white/28">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="rgba(91,148,210,0.6)" strokeWidth="1.5"/><path d="M8 12l3 3 5-5" stroke="rgba(91,148,210,0.6)" strokeWidth="1.5" strokeLinecap="round"/></svg>
            Cancel anytime
          </div>
        </div>
        {/* Marketplace logos strip */}
        <div className="flex items-center justify-center gap-5 flex-wrap mt-13 pt-10 border-t border-white/05">
          <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-white/20">Also available on</span>
          <div className="px-5 py-2 rounded-full bg-white/04 border border-white/09 border-t-white/15 font-mono text-[9.5px] tracking-[0.1em] uppercase text-white/35">AWS Marketplace</div>
          <div className="px-5 py-2 rounded-full bg-white/04 border border-white/09 border-t-white/15 font-mono text-[9.5px] tracking-[0.1em] uppercase text-white/35">RapidAPI</div>
          <div className="px-5 py-2 rounded-full bg-white/04 border border-white/09 border-t-white/15 font-mono text-[9.5px] tracking-[0.1em] uppercase text-white/35">Gumroad</div>
        </div>
      </div>
    </section>
  );
}
