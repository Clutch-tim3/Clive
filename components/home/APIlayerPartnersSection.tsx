'use client';

import React, { useState } from 'react';
import { SectionKicker } from '../ui/SectionKicker';
import { ScrollReveal } from '../ui/ScrollReveal';

const partnerAPIs = [
  {
    name: 'IPstack',
    tagline: 'Real-time IP geolocation covering 200,000+ cities in 200+ countries. Identify where your visitors are and personalise their experience instantly.',
    category: 'geo',
    categoryLabel: 'Geo & Location',
    features: ['IP → Country', 'City & Coords', 'ISP & ASN', 'VPN Detection', 'IPv4 & IPv6'],
    useCases: [
      'Personalise content, language, and currency by visitor location',
      'Block or flag access from restricted regions for compliance',
      'Fraud prevention by detecting VPN, Tor, and proxy connections',
    ],
    price: 'From $9.99',
    freeTier: true,
  },
  {
    name: 'VATlayer',
    tagline: 'EU VAT number validation and EU VAT rates lookup for all 28 EU member states. Stay compliant with European tax regulations automatically.',
    category: 'finance',
    categoryLabel: 'Finance',
    features: ['VAT Validation', 'EU Rates Lookup', '28 Countries', 'Business Info', 'VIES Data'],
    useCases: [
      'B2B SaaS charging EU customers — validate VAT numbers at checkout',
      'E-commerce platforms applying the correct VAT rate per country',
      'Accounting software automating EU tax compliance',
    ],
    price: 'From $9.99',
    freeTier: true,
  },
  {
    name: 'PositionStack',
    tagline: 'Forward and reverse geocoding API. Convert addresses to coordinates and coordinates to addresses — in batch, with high global accuracy.',
    category: 'geo',
    categoryLabel: 'Geo & Location',
    features: ['Forward Geocoding', 'Reverse Geocoding', 'Batch Requests', 'Global Coverage', 'Address Parsing'],
    useCases: [
      'Logistics and delivery apps converting customer addresses to coordinates',
      'Property platforms enriching listings with precise lat/long data',
      'Field service apps reversing GPS coordinates to readable addresses',
    ],
    price: 'From $9.99',
    freeTier: true,
  },
  {
    name: 'PDFlayer',
    tagline: 'HTML to PDF conversion API. Turn any webpage or HTML template into a pixel-perfect PDF document — headers, footers, watermarks, and custom page sizes included.',
    category: 'tools',
    categoryLabel: 'Dev Tools',
    features: ['HTML → PDF', 'URL → PDF', 'Custom Headers', 'Watermarks', 'Page Sizes'],
    useCases: [
      'Invoice and receipt generation from HTML billing templates',
      'Report builders converting HTML dashboards to downloadable PDFs',
      'Document generation pipelines for contracts, certificates, and forms',
    ],
    price: 'From $9.99',
    freeTier: true,
  },
  {
    name: 'MediaStack',
    tagline: 'Real-time and historical news API. Search, filter, and stream live news from 7,500+ global sources across every category, language, and country.',
    category: 'data',
    categoryLabel: 'Data',
    features: ['Live News Feed', '7,500+ Sources', '50 Languages', 'Historical Data', 'Category Filter'],
    useCases: [
      'News aggregator and media monitoring applications',
      'Social platforms and feeds that need fresh content at launch',
      'Sentiment analysis pipelines consuming live news as input',
    ],
    price: 'From $9.99',
    freeTier: true,
  },
  {
    name: 'Coinlayer',
    tagline: 'Cryptocurrency exchange rates and conversion API. Real-time data from 25+ exchanges covering 385+ coins in JSON format — updated every 60 seconds.',
    category: 'finance',
    categoryLabel: 'Finance',
    features: ['385+ Coins', '25 Exchanges', '60s Updates', 'Historical Data', 'Conversion'],
    useCases: [
      'Crypto portfolio trackers and wallet applications',
      'E-commerce platforms accepting cryptocurrency payments',
      'DeFi dashboards displaying live cross-exchange rate data',
    ],
    price: 'From $9.99',
    freeTier: true,
  },
  {
    name: 'Serpstack',
    tagline: 'Real-time Google Search Results API. Retrieve structured SERP data — organic results, ads, featured snippets, knowledge panels — in clean JSON.',
    category: 'tools',
    categoryLabel: 'Dev Tools',
    features: ['Google SERP', 'Organic Results', 'Featured Snippets', 'Local Results', 'Images & News'],
    useCases: [
      'SEO tools monitoring keyword rankings and SERP volatility',
      'Competitive intelligence platforms tracking competitor visibility',
      'AI applications grounding responses with live search context',
    ],
    price: 'From $29.99',
    freeTier: true,
  },
  {
    name: 'Aviationstack',
    tagline: 'Real-time and historical flight tracking API. Live flight status, schedules, routes, and airport data for 13,000+ airlines and 7,000+ airports worldwide.',
    category: 'data',
    categoryLabel: 'Data',
    features: ['Live Flight Status', '13,000+ Airlines', '7,000+ Airports', 'Historical Data', 'Route Search'],
    useCases: [
      'Travel apps displaying live flight status and delays to passengers',
      'Corporate travel tools tracking employee flight itineraries',
      'Airport display systems showing real-time arrivals and departures',
    ],
    price: 'From $9.99',
    freeTier: true,
  },
  {
    name: 'Languagelayer',
    tagline: 'Language detection API for 173 world languages. Identify the language of any text with confidence scores — single strings or batch requests supported.',
    category: 'data',
    categoryLabel: 'Data',
    features: ['173 Languages', 'Confidence Score', 'Batch Detection', 'Script Detection', 'Mixed Content'],
    useCases: [
      'Content platforms auto-routing submissions to the correct language review queue',
      'Customer support tools detecting the language of inbound tickets',
      'Translation pipelines that need to know the source language before processing',
    ],
    price: 'From $9.99',
    freeTier: true,
  },
];

const filters = [
  { id: 'all', label: 'All' },
  { id: 'geo', label: 'Geo & Location' },
  { id: 'finance', label: 'Finance' },
  { id: 'data', label: 'Data' },
  { id: 'tools', label: 'Dev Tools' },
];

export function APIlayerPartnersSection() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredAPIs = activeFilter === 'all'
    ? partnerAPIs
    : partnerAPIs.filter(api => api.category === activeFilter);

  return (
    <section id="partner-apis" className="py-24 px-14 bg-black2 border-t border-white/05">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="mb-16">
            <SectionKicker className="text-steel/60">Partner APIs</SectionKicker>
            <h2 className="text-[clamp(32px,4vw,48px)] font-display font-light mb-4 text-white">
              Nine APIs.<br />
              Zero friction.
            </h2>
            <p className="text-base font-serif italic text-white/40 max-w-2xl">
              Battle-tested, well-documented, and trusted by hundreds of thousands of developers. 
              Click any card to get started directly on APIlayer's platform.
            </p>
          </div>
        </ScrollReveal>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-12 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`font-mono text-[10px] tracking-[0.14em] uppercase px-5 py-2.5 rounded-full transition-all ${
                activeFilter === filter.id
                  ? 'bg-navy text-white border border-navy shadow-[0_4px_16px_rgba(27,48,91,0.25)]'
                  : 'border border-white/08 text-white/40 hover:border-steel/30 hover:text-steel/70'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Partner API grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAPIs.map((api, index) => (
            <ScrollReveal key={api.name} delay={index * 0.1}>
              <div className="group rounded-[40px] border border-white/08 bg-white/04 hover:border-white/16 hover:translate-y-[-4px] transition-all duration-300 overflow-hidden flex flex-col">
                {/* Card header */}
                <div className="relative h-[180px] bg-black flex items-center justify-center overflow-hidden rounded-t-[40px]">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(27,48,91,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(27,48,91,0.06)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none" />
                  
                  {/* Partner badge */}
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-sm border border-white/10 border-t-white/18 font-mono text-[8.5px] tracking-[0.1em] uppercase text-white/45">
                    <div className="w-3.5 h-3.5 rounded-full bg-navy/70 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-steel/80 animate-pulse" />
                    </div>
                    APIlayer
                  </div>

                  {/* Category chip */}
                  <div className="absolute bottom-3.5 left-3.5 font-mono text-[8.5px] tracking-[0.12em] uppercase px-3 py-1 rounded-full bg-navy/35 border border-navy/45 border-t-steel/30 text-steel/75 backdrop-blur-sm">
                    {api.categoryLabel}
                  </div>

                  {/* Icon placeholder */}
                  <div className="relative z-10 w-24 h-24 rounded-full bg-navy/20 border border-steel/20 flex items-center justify-center">
                    <span className="font-display text-2xl text-steel/80">{api.name.charAt(0)}</span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-7 flex-1 flex flex-col">
                  <h3 className="font-display text-2xl font-light text-white mb-2 tracking-[-0.01em]">
                    {api.name}
                  </h3>
                  <p className="text-[13.5px] text-white/50 leading-[1.7] mb-5 italic">
                    {api.tagline}
                  </p>

                  {/* Feature pills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {api.features.map((feature) => (
                      <span
                        key={feature}
                        className="font-mono text-[9px] tracking-[0.1em] uppercase px-3 py-1 rounded-full bg-navy/05 border border-navy/10 text-steel/70"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Use cases */}
                  <div className="mb-6">
                    <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-white/30 mb-2.5">
                      Built for
                    </div>
                    <div className="flex flex-col gap-2">
                      {api.useCases.map((useCase, i) => (
                        <div key={i} className="text-[12.5px] text-white/50 flex gap-2.5 items-start leading-[1.5]">
                          <span className="font-mono text-[10px] text-steel/50 flex-shrink-0 pt-0.5">–</span>
                          {useCase}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card footer */}
                <div className="flex items-center justify-between p-5 border-t border-white/08 mt-auto flex-wrap gap-3">
                  <div className="flex flex-col gap-1">
                    {api.freeTier && (
                      <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-navy/55 bg-navy/07 px-2.5 py-1 rounded-full border border-navy/12 inline-block">
                        Free tier
                      </span>
                    )}
                    <span className="font-display text-xl font-light text-white">
                      {api.price} <span className="font-mono text-[13px] text-white/40 font-normal">/ month</span>
                    </span>
                  </div>
                  <a
                    href="https://apilayer.com?fpr=thabang75"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono text-[10.5px] font-medium tracking-[0.1em] uppercase bg-navy text-white border border-navy shadow-[0_4px_16px_rgba(27,48,91,0.3),0_1px_0_rgba(255,255,255,0.1)_inset] hover:bg-navy2 hover:shadow-[0_8px_28px_rgba(27,48,91,0.45),0_1px_0_rgba(255,255,255,0.1)_inset] transition-all"
                  >
                    <span>Get started</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6h8M6 2l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Disclosure banner */}
        <div className="mt-12 flex items-center gap-3 justify-center py-3.5 px-6 bg-navy/08 border border-navy/10 rounded-full">
          <div className="w-4.5 h-4.5 rounded-full bg-navy/15 border border-navy/25 flex items-center justify-center flex-shrink-0">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="4.5" stroke="rgba(27,48,91,0.5)" />
              <path d="M5 4.5v3M5 3h.01" stroke="rgba(27,48,91,0.7)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="font-mono text-[10px] tracking-[0.08em] text-white/40">
            Clive is an affiliate partner of APIlayer. When you click "Get started" and make a purchase, 
            Clive may earn a commission — at no additional cost to you.
          </p>
        </div>
      </div>
    </section>
  );
}
