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
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none" style={{overflow:'visible'}}>
        <defs><filter id="gip"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <circle cx="16" cy="16" r="12" stroke="rgba(91,148,210,0.85)" strokeWidth="1.5" fill="rgba(27,48,91,0.3)" filter="url(#gip)" style={{animation:'neon-flicker 6s ease-in-out infinite'}}/>
        <ellipse cx="16" cy="16" rx="5.5" ry="12" stroke="rgba(91,148,210,0.4)" strokeWidth="1" fill="none"/>
        <line x1="4" y1="16" x2="28" y2="16" stroke="rgba(91,148,210,0.3)" strokeWidth="0.9"/>
        <line x1="6" y1="10" x2="26" y2="10" stroke="rgba(91,148,210,0.18)" strokeWidth="0.7"/>
        <line x1="6" y1="22" x2="26" y2="22" stroke="rgba(91,148,210,0.18)" strokeWidth="0.7"/>
        <circle cx="21" cy="8.5" r="3.5" fill="rgba(91,148,210,0.85)" filter="url(#gip)" style={{animation:'twinkle 2s ease-in-out infinite'}}/>
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
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none" style={{overflow:'visible'}}>
        <defs><filter id="gvat"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <rect x="5" y="3" width="22" height="26" rx="3" stroke="rgba(91,148,210,0.85)" strokeWidth="1.5" fill="rgba(27,48,91,0.3)" filter="url(#gvat)" style={{animation:'neon-flicker 7s ease-in-out infinite'}}/>
        <line x1="9" y1="10" x2="23" y2="10" stroke="rgba(91,148,210,0.45)" strokeWidth="1"/>
        <line x1="9" y1="14" x2="23" y2="14" stroke="rgba(91,148,210,0.3)" strokeWidth="0.9"/>
        <circle cx="11.5" cy="20.5" r="2.2" stroke="rgba(91,148,210,0.8)" strokeWidth="1.3" fill="none" filter="url(#gvat)"/>
        <circle cx="20.5" cy="25" r="2.2" stroke="rgba(91,148,210,0.8)" strokeWidth="1.3" fill="none" filter="url(#gvat)"/>
        <line x1="21" y1="18.5" x2="11" y2="27" stroke="rgba(91,148,210,0.6)" strokeWidth="1.3" strokeLinecap="round"/>
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
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none" style={{overflow:'visible'}}>
        <defs><filter id="gps"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <path d="M16 4C11.6 4 8 7.7 8 12.5C8 18.8 16 28 16 28C16 28 24 18.8 24 12.5C24 7.7 20.4 4 16 4Z" stroke="rgba(91,148,210,0.85)" strokeWidth="1.5" fill="rgba(27,48,91,0.3)" filter="url(#gps)" style={{animation:'neon-flicker 5.5s ease-in-out infinite'}}/>
        <circle cx="16" cy="12" r="4" fill="rgba(91,148,210,0.75)" filter="url(#gps)" style={{animation:'twinkle 2.5s ease-in-out infinite'}}/>
        <circle cx="16" cy="12" r="7.5" fill="none" stroke="rgba(91,148,210,0.2)" strokeWidth="0.8" strokeDasharray="2 3" style={{animation:'spin-slow 8s linear infinite', transformOrigin:'16px 12px'}}/>
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
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none" style={{overflow:'visible'}}>
        <defs><filter id="gpdf"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <rect x="5" y="7" width="18" height="22" rx="2" stroke="rgba(91,148,210,0.5)" strokeWidth="1" fill="rgba(27,48,91,0.15)" transform="rotate(-4 14 18)"/>
        <path d="M7 4L21 4L27 10L27 28L7 28Z" stroke="rgba(91,148,210,0.85)" strokeWidth="1.5" fill="rgba(27,48,91,0.3)" filter="url(#gpdf)" style={{animation:'neon-flicker 6s ease-in-out infinite'}} strokeLinejoin="round"/>
        <path d="M21 4L21 10L27 10" stroke="rgba(91,148,210,0.5)" strokeWidth="1.2" fill="none"/>
        <line x1="11" y1="15" x2="23" y2="15" stroke="rgba(91,148,210,0.5)" strokeWidth="1"/>
        <line x1="11" y1="19" x2="23" y2="19" stroke="rgba(91,148,210,0.35)" strokeWidth="0.9"/>
        <line x1="11" y1="23" x2="18" y2="23" stroke="rgba(91,148,210,0.25)" strokeWidth="0.9"/>
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
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none" style={{overflow:'visible'}}>
        <defs><filter id="gmed"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <rect x="3" y="8" width="26" height="18" rx="3" stroke="rgba(91,148,210,0.85)" strokeWidth="1.5" fill="rgba(27,48,91,0.3)" filter="url(#gmed)" style={{animation:'neon-flicker 6s ease-in-out infinite'}}/>
        <line x1="7" y1="13" x2="25" y2="13" stroke="rgba(91,148,210,0.45)" strokeWidth="1"/>
        <line x1="7" y1="17" x2="20" y2="17" stroke="rgba(91,148,210,0.32)" strokeWidth="0.9"/>
        <line x1="7" y1="21" x2="22" y2="21" stroke="rgba(91,148,210,0.22)" strokeWidth="0.9"/>
        <circle cx="23" cy="5" r="5" fill="rgba(27,48,91,0.9)" stroke="rgba(91,148,210,0.8)" strokeWidth="1.3" filter="url(#gmed)"/>
        <circle cx="23" cy="5" r="2.2" fill="rgba(91,148,210,0.9)" style={{animation:'badge-live 1.5s ease-in-out infinite'}}/>
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
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none" style={{overflow:'visible'}}>
        <defs><filter id="gcoin"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <circle cx="16" cy="16" r="11" stroke="rgba(91,148,210,0.85)" strokeWidth="1.5" fill="rgba(27,48,91,0.3)" filter="url(#gcoin)" style={{animation:'neon-flicker 5s ease-in-out infinite'}}/>
        <circle cx="16" cy="16" r="7.5" stroke="rgba(91,148,210,0.3)" strokeWidth="0.8" fill="none"/>
        <text x="12.5" y="20" fontFamily="serif" fontSize="11" fill="rgba(91,148,210,0.9)" fontWeight="300">₿</text>
        <circle cx="16" cy="16" r="14" fill="none" stroke="rgba(91,148,210,0.18)" strokeWidth="0.8" strokeDasharray="2 3" style={{animation:'spin-slow 8s linear infinite', transformOrigin:'16px 16px'}}/>
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
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none" style={{overflow:'visible'}}>
        <defs><filter id="gserp"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <circle cx="13" cy="13" r="9" stroke="rgba(91,148,210,0.85)" strokeWidth="1.5" fill="rgba(27,48,91,0.3)" filter="url(#gserp)" style={{animation:'neon-flicker 5s ease-in-out infinite'}}/>
        <line x1="19.5" y1="19.5" x2="28" y2="28" stroke="rgba(91,148,210,0.75)" strokeWidth="3" strokeLinecap="round" filter="url(#gserp)"/>
        <line x1="8" y1="10" x2="18" y2="10" stroke="rgba(91,148,210,0.5)" strokeWidth="0.9"/>
        <line x1="8" y1="13" x2="16" y2="13" stroke="rgba(91,148,210,0.38)" strokeWidth="0.9"/>
        <line x1="8" y1="16" x2="14" y2="16" stroke="rgba(91,148,210,0.25)" strokeWidth="0.9"/>
        <circle cx="13" cy="13" r="5" fill="none" stroke="rgba(91,148,210,0.18)" style={{animation:'pulse-ring 2.5s ease-out infinite'}}/>
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
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none" style={{overflow:'visible'}}>
        <defs><filter id="gavi"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <path d="M5 19L13 12L22 8L24 10.5L18 15.5L22 18L20 20.5L14.5 19L11 22.5L9 21.5L11 17.5Z" stroke="rgba(91,148,210,0.85)" strokeWidth="1.5" fill="rgba(27,48,91,0.3)" strokeLinejoin="round" filter="url(#gavi)" style={{animation:'neon-flicker 6s ease-in-out infinite'}}/>
        <circle cx="23" cy="8" r="2.5" fill="rgba(91,148,210,0.75)" filter="url(#gavi)" style={{animation:'twinkle 2s ease-in-out infinite'}}/>
        <line x1="4" y1="26" x2="14" y2="26" stroke="rgba(91,148,210,0.22)" strokeWidth="0.8" strokeDasharray="2 2"/>
        <line x1="16" y1="26" x2="26" y2="26" stroke="rgba(91,148,210,0.15)" strokeWidth="0.8" strokeDasharray="2 2"/>
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
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none" style={{overflow:'visible'}}>
        <defs><filter id="glang"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <path d="M4 9L4 20Q4 24 7 24L15 24L19 28L19 24L25 24Q28 24 28 20L28 9Q28 6 25 6L7 6Q4 6 4 9Z" stroke="rgba(91,148,210,0.85)" strokeWidth="1.5" fill="rgba(27,48,91,0.3)" filter="url(#glang)" style={{animation:'neon-flicker 5.5s ease-in-out infinite'}}/>
        <text x="9" y="18" fontFamily="'Libre Baskerville',serif" fontSize="9" fill="rgba(91,148,210,0.88)" style={{animation:'neon-flicker 4s ease-in-out 0.5s infinite'}}>Aあ文</text>
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
    <div className="partner-page" style={{ background: '#07070A' }}>
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
      <section className="py-20 px-14 relative" style={{ background: '#07070A' }}>
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
                <div style={{
                  background: '#07070A',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderTop: '1.5px solid rgba(255,255,255,0.16)',
                  borderRadius: '40px',
                  padding: '32px 30px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.07) inset, 0 16px 44px rgba(0,0,0,0.38)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}>
                  {/* top row: icon + badge */}
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'20px' }}>
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(27,48,91,0.55)',
                      border: '1px solid rgba(91,148,210,0.35)',
                      borderTop: '1px solid rgba(91,148,210,0.55)',
                      boxShadow: '0 0 20px rgba(27,48,91,0.5), 0 1px 0 rgba(91,148,210,0.2) inset',
                      flexShrink: 0,
                    }}>
                      {partner.icon}
                    </div>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '4px 10px', borderRadius: '100px',
                      border: '1px solid rgba(91,148,210,0.2)',
                      background: 'rgba(27,48,91,0.25)',
                      fontFamily: 'DM Mono, monospace', fontSize: '9px',
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: 'rgba(91,148,210,0.65)',
                    }}>
                      <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'rgba(91,148,210,0.7)', display:'inline-block' }} />
                      {partner.provider}
                    </div>
                  </div>

                  {/* free tag */}
                  <div style={{
                    fontFamily: 'DM Mono, monospace', fontSize: '9px',
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: 'rgba(91,148,210,0.6)', marginBottom: '6px',
                  }}>✓ Free · {partner.freeTier}</div>

                  {/* category */}
                  <div style={{
                    fontFamily: 'DM Mono, monospace', fontSize: '9px',
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.25)', marginBottom: '10px',
                  }}>
                    {filterCategories.find(cat => cat.id === partner.category)?.label || partner.category}
                  </div>

                  {/* name */}
                  <div style={{
                    fontFamily: 'Cormorant Garamond, serif', fontSize: '26px',
                    fontWeight: 400, color: 'white', marginBottom: '10px', lineHeight: 1.1,
                  }}>{partner.name}</div>

                  {/* description */}
                  <div style={{
                    fontSize: '13px', fontFamily: 'Libre Baskerville, serif',
                    color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: '18px',
                  }}>{partner.description}</div>

                  {/* chips */}
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'20px' }}>
                    {partner.chips.map((chip, chipIndex) => (
                      <span key={chipIndex} style={{
                        padding: '3px 10px', borderRadius: '100px',
                        border: '1px solid rgba(91,148,210,0.2)',
                        fontFamily: 'DM Mono, monospace', fontSize: '9px',
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        color: 'rgba(91,148,210,0.6)',
                      }}>{chip}</span>
                    ))}
                  </div>

                  {/* rule */}
                  <div style={{ height:'1px', background:'rgba(255,255,255,0.07)', marginBottom:'20px', marginTop:'auto' }} />

                  {/* footer */}
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div>
                      <div style={{ fontFamily:'DM Mono, monospace', fontSize:'9px', color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', marginBottom:'3px' }}>
                        Free · then from
                      </div>
                      <div style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'22px', color:'white', fontWeight:400 }}>
                        {partner.price}<em style={{ fontSize:'13px', color:'rgba(255,255,255,0.4)' }}>/month</em>
                      </div>
                    </div>
                    <a href={partner.href} target="_blank" rel="noopener" style={{
                      padding: '9px 18px', borderRadius: '100px',
                      background: 'rgba(27,48,91,0.7)',
                      border: '1px solid rgba(91,148,210,0.3)',
                      fontFamily: 'DM Mono, monospace', fontSize: '10px',
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.85)',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}>
                      Get started →
                    </a>
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
