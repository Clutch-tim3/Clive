'use client';
import Link from 'next/link';
import React from 'react';

export function Nav() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, text: string) => {
    console.log(`Nav link clicked: ${text}`);
    console.log(`Href: ${e.currentTarget.href}`);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-14 h-full flex items-center justify-between">
        <Link href="/" onClick={(e) => handleClick(e, 'Home')}>
          <span className="text-2xl font-display tracking-[0.08em] uppercase">
            CL<span className="text-navy">I</span>VE
          </span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link 
            href="/products" 
            className="text-[10.5px] font-mono tracking-[0.14em] uppercase text-ink hover:text-navy transition-colors"
            onClick={(e) => handleClick(e, 'Products')}
          >
            Products
          </Link>
          <Link 
            href="/" 
            className="text-[10.5px] font-mono tracking-[0.14em] uppercase text-ink hover:text-navy transition-colors"
            onClick={(e) => handleClick(e, 'Platform')}
          >
            Platform
          </Link>
          <Link 
            href="/pricing" 
            className="text-[10.5px] font-mono tracking-[0.14em] uppercase text-ink hover:text-navy transition-colors"
            onClick={(e) => handleClick(e, 'Pricing')}
          >
            Pricing
          </Link>
          <Link 
            href="/partners" 
            className="text-[10.5px] font-mono tracking-[0.14em] uppercase text-steel hover:text-navy transition-colors"
            onClick={(e) => handleClick(e, 'Partner APIs')}
          >
            Partner APIs
          </Link>
          <Link 
            href="/docs" 
            className="text-[10.5px] font-mono tracking-[0.14em] uppercase text-ink hover:text-navy transition-colors"
            onClick={(e) => handleClick(e, 'Documentation')}
          >
            Documentation
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link 
            href="/#" 
            className="px-4 py-2 glass-light text-[10.5px] font-mono tracking-[0.14em] uppercase border border-white/20 rounded-sm hover:bg-paper transition-colors"
            onClick={(e) => handleClick(e, 'Sign in')}
          >
            Sign in
          </Link>
          <Link 
            href="/#" 
            className="px-4 py-2 glass-dark text-[10.5px] font-mono tracking-[0.14em] uppercase text-white rounded-sm hover:bg-navy transition-colors"
            onClick={(e) => handleClick(e, 'Get started')}
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
