'use client';

import React, { useState } from 'react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

// Partner API data
const partnerAPIs = [
  {
    id: 'ipstack',
    name: 'IPstack',
    category: 'geo',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><filter id="pf1"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <circle cx="14" cy="14" r="11" stroke="rgba(91,148,210,0.85)" strokeWidth="1.4" fill="rgba(27,48,91,0.2)" filter="url(#pf1)"/>
        <ellipse cx="14" cy="14" rx="5" ry="11" stroke="rgba(91,148,210,0.5)" strokeWidth="1" fill="none"/>
        <line x1="3" y1="14" x2="25" y2="14" stroke="rgba(91,148,210,0.4)" strokeWidth="0.9"/>
        <line x1="5" y1="9" x2="23" y2="9" stroke="rgba(91,148,210,0.25)" strokeWidth="0.8"/>
        <line x1="5" y1="19" x2="23" y2="19" stroke="rgba(91,148,210,0.25)" strokeWidth="0.8"/>
        <circle cx="17" cy="10" r="2.5" fill="rgba(91,148,210,0.7)" filter="url(#pf1)"/>
      </svg>
    ),
    provider: 'APIlayer',
    freeTier: '1,000 req/month',
    price: '$9',
    description: 'Real-time IP geolocation API. Identify country, region, city, latitude, longitude, timezone, and threat level for any IP address. Covers 200,000+ cities across 200+ countries with IPv4 and IPv6 support.',
    chips: ['IP Geolocation', 'Threat Detection', 'IPv4 + IPv6', '200+ countries'],
    href: 'https://apilayer.com?fpr=thabang75'
  },
  {
    id: 'vatlayer',
    name: 'VatLayer',
    category: 'data',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><filter id="pf2"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <rect x="4" y="5" width="20" height="18" rx="3" stroke="rgba(91,148,210,0.85)" strokeWidth="1.4" fill="rgba(27,48,91,0.2)" filter="url(#pf2)"/>
        <text x="7" y="16" fontFamily="DM Mono,monospace" fontSize="8" fill="rgba(91,148,210,0.85)">VAT</text>
        <polyline points="6,20 10,15 14,18 18,12 22,14" fill="none" stroke="rgba(91,148,210,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    provider: 'APIlayer',
    freeTier: '100 req/month',
    price: '$14',
    description: 'EU VAT validation and rates API. Validate any EU VAT number in real-time via VIES, retrieve current rates for all 28 EU member states, and perform VAT-inclusive and exclusive price calculations.',
    chips: ['VAT Validation', 'EU VAT Rates', '28 EU States', 'VIES Database'],
    href: 'https://apilayer.com?fpr=thabang75'
  },
  {
    id: 'positionstack',
    name: 'PositionStack',
    category: 'geo',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><filter id="pf3"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <path d="M14 4C9 4 5 8.1 5 13.2C5 19.6 14 25 14 25S23 19.6 23 13.2C23 8.1 19 4 14 4Z" stroke="rgba(91,148,210,0.85)" strokeWidth="1.4" fill="rgba(27,48,91,0.2)" filter="url(#pf3)"/>
        <circle cx="14" cy="13" r="3.5" fill="rgba(91,148,210,0.65)" filter="url(#pf3)"/>
      </svg>
    ),
    provider: 'APIlayer',
    freeTier: '25,000 req/month',
    price: '$9',
    description: 'Forward and reverse batch geocoding API. Convert any address or place name into coordinates, or reverse any lat/lng into a human-readable address. Supports batch requests for bulk address processing.',
    chips: ['Forward Geocoding', 'Reverse Geocoding', 'Batch Requests', '25k free calls'],
    href: 'https://apilayer.com?fpr=thabang75'
  },
  {
    id: 'pdflayer',
    name: 'PDFlayer',
    category: 'dev',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><filter id="pf4"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <path d="M7 3L18 3L23 8L23 25L7 25Z" stroke="rgba(91,148,210,0.85)" strokeWidth="1.4" fill="rgba(27,48,91,0.2)" filter="url(#pf4)"/>
        <path d="M18 3L18 8L23 8" stroke="rgba(91,148,210,0.5)" strokeWidth="1.2" fill="none"/>
        <text x="9.5" y="18" fontFamily="DM Mono,monospace" fontSize="6.5" fill="rgba(91,148,210,0.85)">PDF</text>
      </svg>
    ),
    provider: 'APIlayer',
    freeTier: '100 req/month',
    price: '$9',
    description: 'HTML to PDF conversion API. Pass any URL or raw HTML and receive a pixel-perfect PDF. Supports custom page size, orientation, headers, footers, watermarks, and encryption. Ideal for invoicing and report generation.',
    chips: ['HTML → PDF', 'URL → PDF', 'Custom Headers', 'Watermarks'],
    href: 'https://apilayer.com?fpr=thabang75'
  },
  {
    id: 'mediastack',
    name: 'Mediastack',
    category: 'media',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><filter id="pf5"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <rect x="3" y="6" width="22" height="16" rx="3" stroke="rgba(91,148,210,0.85)" strokeWidth="1.4" fill="rgba(27,48,91,0.2)" filter="url(#pf5)"/>
        <line x1="6" y1="11" x2="22" y2="11" stroke="rgba(91,148,210,0.4)" strokeWidth="0.9"/>
        <line x1="6" y1="15" x2="18" y2="15" stroke="rgba(91,148,210,0.3)" strokeWidth="0.9"/>
        <line x1="6" y1="19" x2="20" y2="19" stroke="rgba(91,148,210,0.25)" strokeWidth="0.9"/>
        <circle cx="21" cy="8" r="4" fill="rgba(27,48,91,0.8)" stroke="rgba(91,148,210,0.7)" strokeWidth="1" filter="url(#pf5)"/>
      </svg>
    ),
    provider: 'APIlayer',
    freeTier: '500 req/month',
    price: '$9',
    description: 'Real-time and historical news data API. Search and filter live news from 7,500+ worldwide sources across 50+ languages by keyword, source, category, country, and date range — all as clean structured JSON.',
    chips: ['Live News Feed', '7,500+ Sources', '50+ Languages', 'Historical Data'],
    href: 'https://apilayer.com?fpr=thabang75'
  },
  {
    id: 'coinlayer',
    name: 'Coinlayer',
    category: 'data',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><filter id="pf6"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <circle cx="14" cy="14" r="10" stroke="rgba(91,148,210,0.85)" strokeWidth="1.4" fill="rgba(27,48,91,0.2)" filter="url(#pf6)"/>
        <circle cx="14" cy="14" r="7" stroke="rgba(91,148,210,0.35)" strokeWidth="0.8" fill="none"/>
        <text x="11" y="18" fontFamily="Cormorant Garamond,serif" fontSize="10" fill="rgba(91,148,210,0.85)" fontWeight="300">₿</text>
        <circle cx="14" cy="14" r="12" fill="none" stroke="rgba(91,148,210,0.2)" strokeWidth="0.7" strokeDasharray="2 3" style={{ animation: 'spin-slow 8s linear infinite', transformOrigin: '14px 14px' }}/>
      </svg>
    ),
    provider: 'APIlayer',
    freeTier: '1,000 req/month',
    price: '$9',
    description: 'Cryptocurrency exchange rates API. Real-time and historical crypto data from 25+ exchanges covering 385+ coins. Returns rates in any target currency, supports batch conversion, and provides 24-hour change data.',
    chips: ['385+ Coins', '25+ Exchanges', 'Real-time Rates', 'Historical Data'],
    href: 'https://apilayer.com?fpr=thabang75'
  },
  {
    id: 'serpstack',
    name: 'Serpstack',
    category: 'dev',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><filter id="pf7"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <circle cx="12" cy="12" r="8" stroke="rgba(91,148,210,0.85)" strokeWidth="1.4" fill="rgba(27,48,91,0.2)" filter="url(#pf7)"/>
        <line x1="18" y1="18" x2="25" y2="25" stroke="rgba(91,148,210,0.75)" strokeWidth="2.5" strokeLinecap="round" filter="url(#pf7)"/>
        <line x1="7" y1="10" x2="17" y2="10" stroke="rgba(91,148,210,0.5)" strokeWidth="0.9"/>
        <line x1="7" y1="13" x2="15" y2="13" stroke="rgba(91,148,210,0.35)" strokeWidth="0.9"/>
        <line x1="7" y1="16" x2="13" y2="16" stroke="rgba(91,148,210,0.25)" strokeWidth="0.9"/>
      </svg>
    ),
    provider: 'APIlayer',
    freeTier: '100 req/month',
    price: '$29',
    description: 'Real-time Google Search results API. Structured SERP data — organic listings, ads, featured snippets, knowledge panels, local pack — all as JSON. No proxy management or headless browser required.',
    chips: ['Google SERP', 'Organic + Ads', 'Featured Snippets', 'Real-time'],
    href: 'https://apilayer.com?fpr=thabang75'
  },
  {
    id: 'aviationstack',
    name: 'Aviationstack',
    category: 'data',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><filter id="pf8"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <path d="M5 16L12 10L20 7L22 9L16 14L20 16L18 18L13 17L10 20L8 19L10 15Z" stroke="rgba(91,148,210,0.85)" strokeWidth="1.3" fill="rgba(27,48,91,0.25)" strokeLinejoin="round" filter="url(#pf8)"/>
        <circle cx="22" cy="7" r="2" fill="rgba(91,148,210,0.5)" filter="url(#pf8)"/>
        <line x1="5" y1="22" x2="14" y2="22" stroke="rgba(91,148,210,0.25)" strokeWidth="0.8" strokeDasharray="2 2"/>
        <line x1="16" y1="22" x2="24" y2="22" stroke="rgba(91,148,210,0.18)" strokeWidth="0.8" strokeDasharray="2 2"/>
      </svg>
    ),
    provider: 'APIlayer',
    freeTier: '500 req/month',
    price: '$9',
    description: 'Real-time and historical flight tracking API. Live flight status, departures, arrivals, airline routes, and airport schedules from 13,000+ airlines across 250+ countries. 250 million+ tracked flights.',
    chips: ['Live Flight Status', '13,000+ Airlines', '250+ Countries', 'Airport Data'],
    href: 'https://apilayer.com?fpr=thabang75'
  },
  {
    id: 'languagelayer',
    name: 'Languagelayer',
    category: 'media',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><filter id="pf9"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <path d="M4 8L4 18Q4 21 7 21L14 21L17 24L17 21L21 21Q24 21 24 18L24 8Q24 5 21 5L7 5Q4 5 4 8Z" stroke="rgba(91,148,210,0.85)" strokeWidth="1.3" fill="rgba(27,48,91,0.2)" filter="url(#pf9)"/>
        <text x="8" y="15.5" fontFamily="DM Mono,monospace" fontSize="7.5" fill="rgba(91,148,210,0.8)">Aあ文</text>
      </svg>
    ),
    provider: 'APIlayer',
    freeTier: '1,000 req/month',
    price: '$9',
    description: 'Language detection API for 173 world languages. Pass any text and receive the detected language, confidence score, alternate candidates, and script type. Handles mixed-language text, short strings, and transliterated content.',
    chips: ['173 Languages', 'Confidence Score', 'Mixed Language', 'Script Detection'],
    href: 'https://apilayer.com?fpr=thabang75'
  }
];

// Filter categories
const filterCategories = [
  { id: 'all', label: 'All' },
  { id: 'geo', label: 'Geolocation' },
  { id: 'data', label: 'Data & Finance' },
  { id: 'dev', label: 'Developer Tools' },
  { id: 'media', label: 'Media & Content' }
];

export default function PartnersPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter partners by category
  const filteredPartners = activeCategory === 'all'
    ? partnerAPIs
    : partnerAPIs.filter(partner => partner.category === activeCategory);

  return (
    <div className="partner-page">
      {/* Hero Section */}
      <section className="min-h-screen py-32 px-14 flex items-center relative overflow-hidden bg-black">
        {/* Background Orbs */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-radial from-navy/22 to-transparent blur-[80px] -translate-y-1/4 translate-x-1/4 animate-orb-float"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-navy/12 to-transparent blur-[80px] translate-y-1/4 -translate-x-1/4 animate-orb-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-[250px] h-[250px] bg-gradient-radial from-steel/07 to-transparent blur-[80px] -translate-y-1/2 -translate-x-1/2 animate-orb-float" style={{ animationDelay: '6s' }}></div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2.5 mb-7 px-4.5 py-1.5 rounded-full bg-navy/25 border border-steel/22">
              <div className="w-6.5 h-6.5 rounded-full bg-navy flex items-center justify-center text-sm animate-pulse-glow">
                🔗
              </div>
              <span className="font-mono text-[9.5px] tracking-[0.18em] uppercase text-steel/75">
                Curated Partner APIs — Powered by APIlayer
              </span>
            </div>

            <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-steel/50 mb-3.5 flex items-center gap-3">
              <span className="w-6.5 h-px bg-steel/35"></span>
              Partner Marketplace
            </div>

            <h1 className="font-display text-white text-5xl md:text-7xl lg:text-[100px] mb-5.5 leading-none">
              More APIs.<br />
              <em className="italic bg-gradient-to-r from-steel to-navy bg-clip-text text-transparent">One platform.</em>
            </h1>

            <p className="text-[16px] italic text-white/42 leading-relaxed mb-12 max-w-3xl">
              Nine battle-tested APIs from APIlayer — curated and listed on Clive so you discover the right tool faster. Geolocation, aviation, crypto, VAT, PDF, search, news, geocoding, and language intelligence.
            </p>

            {/* Stats */}
            <div className="flex gap-0 flex-wrap mb-13">
              <div className="flex flex-col gap-1 px-0 md:px-9">
                <div className="font-display text-[40px] text-white">
                  9<em className="text-steel/85 text-[24px]">+</em>
                </div>
                <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-white/28">
                  Partner APIs
                </div>
              </div>
              <div className="flex flex-col gap-1 px-0 md:px-9 border-l border-white/06">
                <div className="font-display text-[40px] text-white">
                  445<em className="text-steel/85 text-[24px]">k</em>
                </div>
                <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-white/28">
                  APIlayer developers
                </div>
              </div>
              <div className="flex flex-col gap-1 px-0 md:px-9 border-l border-white/06">
                <div className="font-display text-[40px] text-white">
                  30<em className="text-steel/85 text-[24px]">m+</em>
                </div>
                <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-white/28">
                  Calls per month
                </div>
              </div>
              <div className="flex flex-col gap-1 px-0 md:px-9 border-l border-white/06">
                <div className="font-display text-[40px] text-white">
                  Free
                </div>
                <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-white/28">
                  Tier on every API
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-4 flex-wrap mb-0">
              <span className="font-mono text-[9.5px] tracking-[0.12em] uppercase text-white/28 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-steel/40"></span>
                REST JSON API
              </span>
              <span className="font-mono text-[9.5px] tracking-[0.12em] uppercase text-white/28 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-steel/40"></span>
                445k+ developers
              </span>
              <span className="font-mono text-[9.5px] tracking-[0.12em] uppercase text-white/28 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-steel/40"></span>
                Free tier · No credit card
              </span>
              <span className="font-mono text-[9.5px] tracking-[0.12em] uppercase text-white/28 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-steel/40"></span>
                Instant API key
              </span>
            </div>

            {/* Disclosure */}
            <div className="flex items-start gap-3.5 mt-11 p-4.5 rounded-lg bg-white/03 border border-white/07 border-l-2 border-steel/30 max-w-3xl">
              <div className="w-5 h-5 rounded-full bg-steel/15 border border-steel/30 flex items-center justify-center text-sm font-mono text-steel/70 mt-0.5 flex-shrink-0">
                i
              </div>
              <p className="font-mono text-[10px] tracking-[0.08em] leading-relaxed text-white/30">
                <strong className="text-white/50">Affiliate disclosure:</strong> Products on this page are provided by APIlayer. Clicking "Get started" will take you to APIlayer's platform. Clive earns a commission on qualifying purchases made through these links. Pricing and availability are determined by APIlayer.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-10 px-14 bg-navy/dim border-y border-border overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap animate-shimmer">
          <span className="flex items-center gap-2.5 text-[10px] font-mono tracking-[0.14em] uppercase text-text3">
            <span className="w-1 h-1 rounded-full bg-navy"></span>
            IP Geolocation
          </span>
          <span className="flex items-center gap-2.5 text-[10px] font-mono tracking-[0.14em] uppercase text-text3">
            <span className="w-1 h-1 rounded-full bg-navy"></span>
            VAT Validation
          </span>
          <span className="flex items-center gap-2.5 text-[10px] font-mono tracking-[0.14em] uppercase text-text3">
            <span className="w-1 h-1 rounded-full bg-navy"></span>
            Forward Geocoding
          </span>
          <span className="flex items-center gap-2.5 text-[10px] font-mono tracking-[0.14em] uppercase text-text3">
            <span className="w-1 h-1 rounded-full bg-navy"></span>
            HTML to PDF
          </span>
          <span className="flex items-center gap-2.5 text-[10px] font-mono tracking-[0.14em] uppercase text-text3">
            <span className="w-1 h-1 rounded-full bg-navy"></span>
            Live News API
          </span>
          <span className="flex items-center gap-2.5 text-[10px] font-mono tracking-[0.14em] uppercase text-text3">
            <span className="w-1 h-1 rounded-full bg-navy"></span>
            Crypto Rates
          </span>
          <span className="flex items-center gap-2.5 text-[10px] font-mono tracking-[0.14em] uppercase text-text3">
            <span className="w-1 h-1 rounded-full bg-navy"></span>
            Google SERP
          </span>
          <span className="flex items-center gap-2.5 text-[10px] font-mono tracking-[0.14em] uppercase text-text3">
            <span className="w-1 h-1 rounded-full bg-navy"></span>
            Flight Tracking
          </span>
          <span className="flex items-center gap-2.5 text-[10px] font-mono tracking-[0.14em] uppercase text-text3">
            <span className="w-1 h-1 rounded-full bg-navy"></span>
            Language Detection
          </span>
          {/* Duplicate for seamless loop */}
          <span className="flex items-center gap-2.5 text-[10px] font-mono tracking-[0.14em] uppercase text-text3">
            <span className="w-1 h-1 rounded-full bg-navy"></span>
            IP Geolocation
          </span>
          <span className="flex items-center gap-2.5 text-[10px] font-mono tracking-[0.14em] uppercase text-text3">
            <span className="w-1 h-1 rounded-full bg-navy"></span>
            VAT Validation
          </span>
          <span className="flex items-center gap-2.5 text-[10px] font-mono tracking-[0.14em] uppercase text-text3">
            <span className="w-1 h-1 rounded-full bg-navy"></span>
            Forward Geocoding
          </span>
          <span className="flex items-center gap-2.5 text-[10px] font-mono tracking-[0.14em] uppercase text-text3">
            <span className="w-1 h-1 rounded-full bg-navy"></span>
            HTML to PDF
          </span>
          <span className="flex items-center gap-2.5 text-[10px] font-mono tracking-[0.14em] uppercase text-text3">
            <span className="w-1 h-1 rounded-full bg-navy"></span>
            Live News API
          </span>
          <span className="flex items-center gap-2.5 text-[10px] font-mono tracking-[0.14em] uppercase text-text3">
            <span className="w-1 h-1 rounded-full bg-navy"></span>
            Crypto Rates
          </span>
          <span className="flex items-center gap-2.5 text-[10px] font-mono tracking-[0.14em] uppercase text-text3">
            <span className="w-1 h-1 rounded-full bg-navy"></span>
            Google SERP
          </span>
          <span className="flex items-center gap-2.5 text-[10px] font-mono tracking-[0.14em] uppercase text-text3">
            <span className="w-1 h-1 rounded-full bg-navy"></span>
            Flight Tracking
          </span>
          <span className="flex items-center gap-2.5 text-[10px] font-mono tracking-[0.14em] uppercase text-text3">
            <span className="w-1 h-1 rounded-full bg-navy"></span>
            Language Detection
          </span>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 px-14 relative bg-black">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="font-mono text-[9.5px] tracking-[0.24em] uppercase text-steel/55 mb-3.5 flex items-center gap-3">
              <span className="w-6.5 h-px bg-steel/35"></span>
              9 APIs · Affiliate Partnership
            </div>

            <h2 className="font-display text-white text-4xl md:text-5xl lg:text-[58px] mb-3.5">
              Partner API catalogue
            </h2>

            <p className="text-[15px] italic text-white/38 leading-relaxed mb-13 max-w-2xl">
              Every API below is provided by APIlayer. Free tier available on all nine. No credit card required to start.
            </p>
          </ScrollReveal>

          {/* Filter Tabs */}
          <ScrollReveal>
            <div className="flex gap-2 mb-11 flex-wrap">
              {filterCategories.map(category => (
                <button
                  key={category.id}
                  className={`px-4.5 py-2 rounded-full border text-[9.5px] font-mono tracking-[0.12em] uppercase transition-all ${
                    activeCategory === category.id
                      ? 'bg-navy text-white border-navy shadow-lg'
                      : 'bg-transparent text-white/35 border-white/10 hover:border-steel/30 hover:text-steel/75'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPartners.map((partner, index) => (
              <ScrollReveal key={partner.id} delay={index * 0.1}>
                <div className="rounded-2xl bg-white/055 backdrop-blur-md border border-white/10 border-t-2 border-white/22 shadow-xl p-8 relative overflow-hidden animate-border-glow">
                  {/* Refraction Sweep */}
                  <div className="absolute inset-0 rounded-2xl pointer-events-none z-0 bg-gradient-to-r from-transparent via-white/08 to-transparent bg-[length:250%_100%] animate-sweep-card"></div>
                  
                  {/* Scan Line */}
                  <div className="absolute left-0 right-0 h-px pointer-events-none z-0 bg-gradient-to-r from-transparent via-steel/20 to-transparent animate-scan"></div>

                  <div className="relative z-10">
                    {/* Card Top */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-13 h-13 rounded-lg flex items-center justify-center bg-navy/25 border border-steel/20 border-t-steel/35 shadow-lg transition-all flex-shrink-0">
                        {partner.icon}
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy/20 border border-navy/35 text-[8.5px] font-mono tracking-[0.12em] uppercase text-steel/60">
                        <div className="w-1 h-1 rounded-full bg-steel/60"></div>
                        {partner.provider}
                      </div>
                    </div>

                    {/* Free Tag */}
                    <div className="inline-flex items-center gap-1.5 text-[8px] font-mono tracking-[0.1em] uppercase px-2.25 py-0.75 rounded-full bg-steel/08 border border-steel/15 text-steel/55 mb-2.5">
                      ✓ Free · {partner.freeTier}
                    </div>

                    {/* Category */}
                    <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-steel/55 mb-2 flex items-center gap-2">
                      <span className="w-3 h-px bg-steel/40"></span>
                      {filterCategories.find(cat => cat.id === partner.category)?.label || partner.category}
                    </div>

                    {/* Name */}
                    <div className="font-display text-2xl text-white mb-3">
                      {partner.name}
                    </div>

                    {/* Description */}
                    <div className="text-sm leading-relaxed text-white/60 mb-5.5">
                      {partner.description}
                    </div>

                    {/* Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {partner.chips.map((chip, chipIndex) => (
                        <span
                          key={chipIndex}
                          className="font-mono text-[8.5px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full bg-navy/15 border border-navy/30 text-steel/70"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>

                    {/* Rule */}
                    <div className="h-px bg-white/07 mb-5"></div>

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-col gap-0.5">
                        <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-steel/70">
                          Free · then from
                        </div>
                        <div className="font-display text-lg text-white">
                          {partner.price}<em className="text-white/40 text-sm">/month</em>
                        </div>
                      </div>
                      <a
                        href={partner.href}
                        target="_blank"
                        rel="noopener"
                        className="inline-flex items-center gap-2 px-5.5 py-2.5 rounded-full font-mono text-[10px] font-medium tracking-[0.1em] uppercase text-white relative overflow-hidden bg-navy/70 backdrop-blur-md border border-steel/30 border-t-steel/50 shadow-lg transition-all"
                      >
                        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/08 to-transparent pointer-events-none"></span>
                        Get started <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Bottom Disclosure */}
          <ScrollReveal>
            <div className="max-w-7xl mx-auto mt-14 p-6 rounded-xl bg-white/025 border border-white/06 border-t-steel/10 flex items-start gap-4">
              <div className="text-xl mt-0.5 flex-shrink-0">
                ⓘ
              </div>
              <div className="font-mono text-[10px] tracking-[0.07em] leading-relaxed text-white/28">
                All partner products on this page are provided by <strong>APIlayer</strong>
                (<a href="https://apilayer.com?fpr=thabang75" target="_blank" rel="noopener" className="text-steel/50 hover:text-steel/80 transition-colors">apilayer.com</a>).
                Clicking "Get started" redirects to APIlayer's platform. Pricing, availability, and rate limits
                are set by APIlayer and subject to change. <strong>Clive earns an affiliate commission on
                qualifying purchases</strong> made through these links at no additional cost to you.
                All support requests should be directed to APIlayer.
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
