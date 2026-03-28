import Link from 'next/link';
import React from 'react';

export function NavyBand() {
  return (
    <section className="bg-navy py-11 px-14">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div>
          <h3 className="text-[28px] font-display italic text-white mb-2">
            Available on three marketplaces
          </h3>
          <p className="text-[10px] font-mono tracking-[0.14em] uppercase text-white/38">
            Choose your preferred distribution channel
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-6 md:mt-0">
          <Link 
            href="https://aws.amazon.com/marketplace" 
            target="_blank"
            className="px-6 py-2.5 text-[10px] font-mono tracking-[0.14em] uppercase border border-white/20 text-white/60 hover:bg-white/10 transition-colors rounded-full"
          >
            AWS Marketplace
          </Link>
          <Link 
            href="https://rapidapi.com/clive" 
            target="_blank"
            className="px-6 py-2.5 text-[10px] font-mono tracking-[0.14em] uppercase border border-white/20 text-white/60 hover:bg-white/10 transition-colors rounded-full"
          >
            RapidAPI
          </Link>
          <Link 
            href="https://gumroad.com/clive" 
            target="_blank"
            className="px-6 py-2.5 text-[10px] font-mono tracking-[0.14em] uppercase border border-white/20 text-white/60 hover:bg-white/10 transition-colors rounded-full"
          >
            Gumroad
          </Link>
        </div>
      </div>
    </section>
  );
}