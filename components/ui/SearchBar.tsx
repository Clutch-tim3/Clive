'use client';
import React, { useState, useRef, useEffect } from 'react';
import { products } from '@/lib/products';

const PARTNER_INDEX = [
  { id: 'ipstack',       name: 'IPstack',       tagline: 'Real-time IP geolocation API',             category: 'Geolocation',    tags: ['ip','geo','location'],               href: 'https://apilayer.com/marketplace/ip_to_geolocation-api?fpr=thabang75' },
  { id: 'vatlayer',      name: 'VATlayer',      tagline: 'EU VAT validation and rates',               category: 'Finance',        tags: ['vat','tax','eu'],                    href: 'https://apilayer.com/marketplace/vat-api?fpr=thabang75' },
  { id: 'positionstack', name: 'PositionStack',  tagline: 'Forward & reverse geocoding',              category: 'Geolocation',    tags: ['geocoding','address','maps'],         href: 'https://apilayer.com/marketplace/positionstack-api?fpr=thabang75' },
  { id: 'pdflayer',      name: 'PDFlayer',       tagline: 'HTML to PDF conversion API',               category: 'Developer Tools', tags: ['pdf','html','convert'],              href: 'https://apilayer.com/marketplace/pdf-api?fpr=thabang75' },
  { id: 'mediastack',    name: 'Mediastack',     tagline: 'Real-time and historical news',            category: 'Media',          tags: ['news','media','content'],             href: 'https://apilayer.com/marketplace/mediastack-api?fpr=thabang75' },
  { id: 'coinlayer',     name: 'Coinlayer',      tagline: 'Cryptocurrency exchange rates',            category: 'Finance',        tags: ['crypto','bitcoin','rates'],           href: 'https://apilayer.com/marketplace/coinlayer-api?fpr=thabang75' },
  { id: 'serpstack',     name: 'Serpstack',      tagline: 'Google Search results API',                category: 'Developer Tools', tags: ['search','google','serp','seo'],      href: 'https://apilayer.com/marketplace/serpstack-api?fpr=thabang75' },
  { id: 'aviationstack', name: 'Aviationstack',  tagline: 'Real-time flight tracking API',           category: 'Aviation',       tags: ['flights','aviation','airports'],      href: 'https://apilayer.com/marketplace/aviationstack-api?fpr=thabang75' },
  { id: 'languagelayer', name: 'Languagelayer',  tagline: 'Language detection for 173 languages',    category: 'Language',       tags: ['language','nlp','detection','ai'],    href: 'https://apilayer.com/marketplace/languagelayer-api?fpr=thabang75' },
];

const SEARCH_INDEX = [
  ...products.map(p => ({
    id: p.slug,
    name: p.name,
    tagline: p.tagline,
    category: p.category,
    tags: p.features?.slice(0, 4) ?? [],
    type: 'clive' as const,
    href: `/products/${p.slug}`,
  })),
  ...PARTNER_INDEX.map(p => ({ ...p, type: 'partner' as const })),
];

function search(query: string) {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  return SEARCH_INDEX.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.tagline.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.tags.some(t => String(t).toLowerCase().includes(q))
  ).slice(0, 8);
}

interface SearchBarProps {
  /** If true, hides on mobile (< 768px) — for nav usage */
  navMode?: boolean;
  /** Called when query changes — for products page filtering */
  onQueryChange?: (q: string) => void;
  placeholder?: string;
}

export function SearchBar({ navMode = false, onQueryChange, placeholder = 'Search APIs…' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof SEARCH_INDEX>([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onQueryChange?.(val);
    const r = search(val);
    setResults(r);
    setOpen(val.trim().length >= 2);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: navMode ? undefined : 'block' }}
      className={navMode ? 'search-nav-wrap' : ''}>
      {navMode && (
        <style>{`
          @media (max-width: 767px) { .search-nav-wrap { display: none !important; } }
        `}</style>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
          style={{ position: 'absolute', left: '12px', color: 'rgba(255,255,255,0.25)', pointerEvents: 'none', flexShrink: 0 }}>
          <circle cx="11" cy="11" r="7" />
          <line x1="17" y1="17" x2="22" y2="22" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          placeholder={placeholder}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '100px',
            padding: '9px 16px 9px 36px',
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.06em',
            color: 'rgba(255,255,255,0.75)',
            width: navMode ? '190px' : '100%',
            outline: 'none',
            transition: 'border-color 0.2s, background 0.2s',
          }}
          onFocusCapture={e => {
            (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(91,148,210,0.45)';
            (e.currentTarget as HTMLInputElement).style.background = 'rgba(255,255,255,0.07)';
          }}
          onBlur={e => {
            (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)';
            (e.currentTarget as HTMLInputElement).style.background = 'rgba(255,255,255,0.05)';
          }}
        />
      </div>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          right: 0,
          minWidth: navMode ? '320px' : undefined,
          background: '#0C0C10',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
          zIndex: 500,
          overflow: 'hidden',
        }}>
          {results.length === 0 ? (
            <div style={{ padding: '16px', fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
              No results for "{query}"
            </div>
          ) : results.map(p => (
            <a
              key={p.id}
              href={p.href}
              target={p.type === 'partner' ? '_blank' : undefined}
              rel={p.type === 'partner' ? 'noopener noreferrer' : undefined}
              onClick={() => setOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                textDecoration: 'none',
                background: 'transparent',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(27,48,91,0.3)'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'}
            >
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '8px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                padding: '2px 7px',
                borderRadius: '100px',
                flexShrink: 0,
                ...(p.type === 'clive'
                  ? { background: 'rgba(27,48,91,0.5)', color: 'rgba(91,148,210,0.8)' }
                  : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }),
              }}>
                {p.type === 'clive' ? 'Clive' : 'Partner'}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', color: '#fff' }}>{p.name}</div>
                <div style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '11px', color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.tagline}</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
