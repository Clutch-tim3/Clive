import Link from 'next/link';
import React from 'react';

export function Footer() {
  return (
    <footer className="text-white px-14">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4" style={{gap: '72px'}}>
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <span className="f-brand text-[26px] font-display tracking-[0.08em] uppercase">
              CL<span className="text-navy">I</span>VE
            </span>
          </div>
          <p className="f-sub text-[13px] font-serif italic mb-6 max-w-md">
            APIs, machine learning models, Chrome extensions, and security tools.
            Everything a developer needs, priced for builders.
          </p>
          <div className="flex items-center gap-3">
            <span className="f-badge px-3 py-1 text-[9px] font-mono border rounded-sm">
              v1.0
            </span>
            <span className="f-badge px-3 py-1 text-[9px] font-mono border rounded-sm">
              MIT SDK
            </span>
            <span className="f-badge px-3 py-1 text-[9px] font-mono border rounded-sm">
              REST &amp; SDK
            </span>
          </div>
        </div>
        
        <div>
          <h3 className="f-col-head text-[9.5px] font-mono tracking-[0.14em] uppercase mb-5">
            Products
          </h3>
          <ul className="f-links space-y-3">
            <li>
              <Link href="/products?cat=api" className="text-[12px] font-serif hover:text-white transition-colors">
                Developer APIs
              </Link>
            </li>
            <li>
              <Link href="/products?cat=ml" className="text-[12px] font-serif hover:text-white transition-colors">
                ML Models
              </Link>
            </li>
            <li>
              <Link href="/products?cat=ext" className="text-[12px] font-serif hover:text-white transition-colors">
                Chrome Extensions
              </Link>
            </li>
            <li>
              <Link href="/products?cat=app" className="text-[12px] font-serif hover:text-white transition-colors">
                Web Applications
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-[12px] font-serif hover:text-white transition-colors">
                All Products
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="f-col-head text-[9.5px] font-mono tracking-[0.14em] uppercase mb-5">
            Platform
          </h3>
          <ul className="f-links space-y-3">
            <li>
              <Link href="/docs" className="text-[12px] font-serif hover:text-white transition-colors">
                Documentation
              </Link>
            </li>
            <li>
              <Link href="/docs/api" className="text-[12px] font-serif hover:text-white transition-colors">
                API Reference
              </Link>
            </li>
            <li>
              <Link href="/docs/sdk" className="text-[12px] font-serif hover:text-white transition-colors">
                SDK
              </Link>
            </li>
            <li>
              <Link href="/changelog" className="text-[12px] font-serif hover:text-white transition-colors">
                Changelog
              </Link>
            </li>
            <li>
              <Link href="/status" className="text-[12px] font-serif hover:text-white transition-colors">
                Status
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="f-col-head text-[9.5px] font-mono tracking-[0.14em] uppercase mb-5">
            Company
          </h3>
          <ul className="f-links space-y-3">
            <li>
              <Link href="/about" className="text-[12px] font-serif hover:text-white transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="https://aws.amazon.com/marketplace" target="_blank" className="text-[12px] font-serif hover:text-white transition-colors">
                AWS Marketplace
              </Link>
            </li>
            <li>
              <Link href="https://rapidapi.com/clive" target="_blank" className="text-[12px] font-serif hover:text-white transition-colors">
                RapidAPI
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-[12px] font-serif hover:text-white transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3" style={{marginTop: '72px'}}>
        <p className="f-copy text-[10px] font-mono">
          © 2026 Clive · A Donington Vale product.
        </p>
        <div className="f-legal flex items-center space-x-6">
          <Link href="/privacy" className="text-[10px] font-mono hover:text-white transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="text-[10px] font-mono hover:text-white transition-colors">
            Terms
          </Link>
          <Link href="/security" className="text-[10px] font-mono hover:text-white transition-colors">
            Security
          </Link>
        </div>
      </div>
    </footer>
  );
}