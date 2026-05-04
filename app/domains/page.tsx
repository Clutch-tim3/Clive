'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface AvailabilityResult {
  domainName:    string;
  tld:           string;
  sld:           string;
  status:        'available' | 'taken' | 'premium' | 'unsupported' | 'error';
  purchasable:   boolean;
  priceUSD?:     number;
  priceZAR?:     number;
  renewalUSD?:   number;
  renewalZAR?:   number;
  isPremium:     boolean;
  errorMessage?: string;
}

interface TLDPrice {
  tld:        string;
  priceUSD:   number;
  priceZAR:   number;
  renewalZAR: number;
}

const PILL_TLDS = ['com', 'co.za', 'net', 'org', 'io', 'dev', 'app', 'ai', 'store', 'co'];

// Category labels shown on result rows
const TLD_CATEGORY: Record<string, string> = {
  'co.za': 'ZA', africa: 'ZA',
  io: 'TECH', dev: 'TECH', app: 'TECH', ai: 'TECH', tech: 'TECH',
  cloud: 'TECH', digital: 'TECH', run: 'TECH', systems: 'TECH',
  network: 'TECH', works: 'TECH', page: 'TECH',
  store: 'SHOP', shop: 'SHOP', online: 'SHOP',
  studio: 'CREATIVE', design: 'CREATIVE', media: 'CREATIVE', agency: 'CREATIVE',
  co: 'BIZ', biz: 'BIZ', group: 'BIZ', solutions: 'BIZ',
  services: 'BIZ', consulting: 'BIZ', global: 'BIZ', world: 'BIZ',
  me: 'PERSONAL',
  org: 'ORG',
  site: 'WEB', info: 'WEB',
};

const CATEGORY_COLOR: Record<string, string> = {
  ZA:       'rgba(80,200,120,0.7)',
  TECH:     'rgba(91,148,210,0.75)',
  SHOP:     'rgba(210,160,50,0.75)',
  CREATIVE: 'rgba(180,100,210,0.75)',
  BIZ:      'rgba(91,180,210,0.7)',
  PERSONAL: 'rgba(210,130,80,0.7)',
  ORG:      'rgba(130,200,160,0.7)',
  WEB:      'rgba(180,180,180,0.5)',
};

// Helper function to get .com price for comparison
function getComPrice(): number {
  // In a real implementation, this would come from the TLD prices
  // For now, return a reasonable default
  return 20000; // R200/year in cents
}

function DomainsPageContent() {
  const router = useRouter();
  const params = useSearchParams();

  const [input,         setInput]         = useState('');
  const [results,       setResults]       = useState<AvailabilityResult[]>([]);
  const [loading,       setLoading]       = useState(false);
  const [searched,      setSearched]      = useState('');
  const [tldPrices,     setTldPrices]     = useState<TLDPrice[]>([]);
  const [priceError,    setPriceError]    = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchError,   setSearchError]   = useState(false);
  const [debouncedInput, setDebouncedInput] = useState('');

  useEffect(() => {
    fetch('/api/domains/tlds')
      .then(r => r.json())
      .then((d: { tlds?: TLDPrice[] }) => {
        if (d.tlds) setTldPrices(d.tlds.slice(0, 12));
        else setPriceError(true);
      })
      .catch(() => setPriceError(true));
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('recent_domain_searches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const doSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setSearched(trimmed);
    setResults([]);
    setLoading(true);
    try {
      const res  = await fetch(`/api/domains/check?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json() as { results?: AvailabilityResult[]; error?: string };
      if (data.results) {
        const filtered = data.results.filter(r => r.status !== 'error' && r.status !== 'unsupported');
        const STATUS_ORDER: Record<string, number> = { available: 0, premium: 1, taken: 2 };
        filtered.sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9));
        setResults(filtered);
        setSearchError(false);
        // Add to recent searches
        setRecentSearches(prev => {
          const updated = [trimmed, ...prev.filter(s => s !== trimmed)].slice(0, 5);
          localStorage.setItem('recent_domain_searches', JSON.stringify(updated));
          return updated;
        });
      } else {
        setSearchError(true);
      }
    } catch {
      setSearchError(true);
    } finally {
      setLoading(false);
    }
   }, []);

   // Debounce search input
   useEffect(() => {
     const handler = setTimeout(() => {
       setDebouncedInput(input);
     }, 300);
     
     return () => {
       clearTimeout(handler);
     };
   }, [input]);

   useEffect(() => {
     const q = params.get('q');
     if (q) { setInput(q); doSearch(q); }
   }, [params, doSearch]);

   const handleSearch = useCallback(() => {
     doSearch(debouncedInput);
   }, [debouncedInput, doSearch]);

  const appendTLD = (tld: string) => {
    const base = input.replace(/\.[a-z.]+$/, '').toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!base) return;
    const full = `${base}.${tld}`;
    setInput(full);
    doSearch(full);
  };

  const showIdle = !loading && !searched;

  // Derived result groups
  const sldBase        = searched.replace(/\.[a-z.]+$/, '');
  const available      = results.filter(r => r.status === 'available' || r.status === 'premium');
  const taken          = results.filter(r => r.status === 'taken');
  const comTaken       = results.find(r => r.tld === 'com')?.status === 'taken';
  const variants       = comTaken
    ? [`get${sldBase}`, `${sldBase}hq`, `${sldBase}app`, `my${sldBase}`].filter(v => v.length <= 63)
    : [];

  return (
    <>
       <style>{`
         @keyframes pulse    { 0%,100%{opacity:.35} 50%{opacity:.75} }
         @keyframes shimmer  { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
         @keyframes dotPulse { 0%,100%{transform:scale(1);opacity:.9} 50%{transform:scale(1.5);opacity:1} }
         @keyframes availablePulse { 
           0%, 100% { box-shadow: 0 0 0 0 rgba(80, 200, 120, 0.4); }
           50% { box-shadow: 0 0 0 8px rgba(80, 200, 120, 0); }
         }
       `}</style>
      <Nav />
      <div style={{ minHeight: '100vh', background: '#07070A', paddingTop: '64px' }}>

        {/* Grid mesh */}
        <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(27,48,91,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(27,48,91,0.05) 1px,transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', top: '-140px', right: '-100px', width: '700px', height: '700px', background: 'rgba(27,48,91,0.18)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', bottom: '-80px', left: '-80px', width: '500px', height: '500px', background: 'rgba(27,48,91,0.1)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '860px', margin: '0 auto', padding: '80px 32px 120px' }}>
          <style>{`
            @media (max-width: 768px) {
              div[style*="padding: 80px 32px 120px"] { padding: 60px 20px 80px !important; }
              h1[style*="fontSize: clamp(52px,7vw,88px)"] { fontSize: clamp(36px,10vw,52px) !important; }
              input[style*="padding: 18px 160px 18px 28px"] { padding: 16px 140px 16px 20px !important; fontSize: 12px !important; }
              button[style*="right: 8px"] { right: 6px !important; padding: 8px 20px !important; }
            }
            @media (max-width: 480px) {
              div[style*="gridTemplateColumns: 14px 1fr auto auto auto"] { gridTemplateColumns: 12px 1fr auto !important; }
              div[style*="minWidth: 140px"] { minWidth: 120px !important; }
              div[style*="fontSize: 22px"] { fontSize: 18px !important; }
            }
          `}</style>

          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.65)', marginBottom: '22px' }}>
              Domain Registration
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(52px,7vw,88px)', color: '#fff', lineHeight: 1.05, margin: '0 0 20px' }}>
              Secure your domain.
            </h1>
            <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '16px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 40px' }}>
              Check availability across 30+ extensions instantly. Get smart suggestions tailored to your search.
            </p>

              {/* Search box */}
              <div style={{ position: 'relative', maxWidth: '680px', margin: '0 auto 20px' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    placeholder=" "
                    aria-label="Search for domain name"
                    autoComplete="off"
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1.5px solid rgba(255,255,255,0.1)',
                      borderRadius: '100px', color: 'white',
                      fontFamily: "'DM Mono', monospace", fontSize: '13px',
                      padding: '24px 160px 12px 28px', outline: 'none',
                      transition: 'border-color .2s, box-shadow .2s',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = 'rgba(91,148,210,0.5)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(91,148,210,0.1)';
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <label
                    style={{
                      position: 'absolute',
                      left: '28px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontFamily: "'DM Mono', monospace",
                      fontSize: input ? '10px' : '13px',
                      color: input ? 'rgba(91,148,210,0.7)' : 'rgba(255,255,255,0.5)',
                      pointerEvents: 'none',
                      transition: 'all .2s',
                      background: 'rgba(7,7,10,0.8)',
                      padding: '0 6px',
                      borderRadius: '3px'
                    }}
                  >
                    Search for your domain name...
                  </label>
                </div>
                {input && (
                  <button
                    onClick={() => setInput('')}
                    aria-label="Clear search input"
                    style={{ position: 'absolute', right: '90px', top: '50%', transform: 'translateY(-50%)', padding: '8px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '12px' }}
                  >
                    ✕
                  </button>
                )}
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  aria-label="Perform domain search"
                  style={{
                    position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                    padding: '10px 24px', background: loading ? 'rgba(27,48,91,0.5)' : '#1B305B',
                    border: 'none', borderRadius: '100px',
                    fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: loading ? 'rgba(255,255,255,0.4)' : 'white',
                    cursor: loading ? 'default' : 'pointer', transition: 'background .2s',
                  }}
                  onMouseEnter={e => { if (!loading) (e.currentTarget.style.background = '#243d6e'); }}
                  onMouseLeave={e => (e.currentTarget.style.background = loading ? 'rgba(27,48,91,0.5)' : '#1B305B')}
                >
                  {loading ? '…' : 'Search'}
                </button>
              </div>

              {/* Quick picks row */}
              <div style={{ marginTop: '24px' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>
                  Quick picks
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {['clivedev.com', 'clivestudio.com', 'clivetech.com', 'clivestore.com'].map(domain => (
                    <button
                      key={domain}
                      onClick={() => { setInput(domain); doSearch(domain); }}
                      aria-label={`Search for ${domain}`}
                      style={{ padding: '8px 16px', background: 'rgba(27,48,91,0.3)', border: '1px solid rgba(91,148,210,0.2)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '12px', color: 'rgba(91,148,210,0.8)', cursor: 'pointer', transition: 'all .15s' }}
                      onMouseEnter={e => { (e.currentTarget.style.borderColor = 'rgba(91,148,210,0.4)'); (e.currentTarget.style.background = 'rgba(27,48,91,0.5)'); }}
                      onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(91,148,210,0.18)'); (e.currentTarget.style.background = 'rgba(27,48,91,0.3)'); }}
                    >
                      {domain}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent searches */}
            {recentSearches.length > 0 && !input && !loading && !searched && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: '8px' }}>
                  Recent searches
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {recentSearches.map(search => (
                    <button
                      key={search}
                      onClick={() => { setInput(search); doSearch(search); }}
                      aria-label={`Search for ${search} again`}
                      style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(91,148,210,0.8)', cursor: 'pointer', transition: 'all .15s' }}
                      onMouseEnter={e => { (e.currentTarget.style.borderColor = 'rgba(91,148,210,0.22)'); (e.currentTarget.style.background = 'rgba(255,255,255,0.05)'); }}
                      onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'); (e.currentTarget.style.background = 'rgba(255,255,255,0.03)'); }}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TLD pills — now 10, with prices */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {PILL_TLDS.map(tld => {
                const p   = tldPrices.find(t => t.tld === tld);
                const cat = TLD_CATEGORY[tld];
                const col = cat ? CATEGORY_COLOR[cat] : 'rgba(91,148,210,0.85)';
                return (
                  <button
                    key={tld}
                    onClick={() => appendTLD(tld)}
                    aria-label={`Append .${tld} to domain search`}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      padding: '7px 16px',
                      background: 'rgba(27,48,91,0.3)', border: '1px solid rgba(91,148,210,0.18)',
                      borderRadius: '100px', cursor: 'pointer', transition: 'all .15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget.style.borderColor = 'rgba(91,148,210,0.45)'); (e.currentTarget.style.background = 'rgba(27,48,91,0.55)'); }}
                    onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(91,148,210,0.18)'); (e.currentTarget.style.background = 'rgba(27,48,91,0.3)'); }}
                  >
                     <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', color: col }}>
                       .{tld}
                     </span>
                     {p && (
                       <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '7px', color: 'rgba(255,255,255,0.28)', marginTop: '2px' }}>
                         {formatZAR(p.priceZAR)}/yr
                       </span>
                     )}
                     {/* TLD popularity indicator */}
                     <div style={{ 
                       position: 'relative', 
                       display: 'inline-block', 
                       marginLeft: '4px'
                     }}>
                       {/* Tooltip trigger */}
                       <span 
                         style={{ 
                           fontSize: '0px', 
                           lineHeight: '0', 
                           display: 'inline-block',
                           width: '10px',
                           height: '10px',
                           borderRadius: '50%',
                           background: getPopularityIndicator(p?.priceZAR ?? 0),
                           position: 'relative',
                           top: '-2px'
                         }}
                       >
                         {/* Tooltip */}
                         <span style={{
                           position: 'absolute',
                           left: '50%',
                           bottom: '120%',
                           transform: 'translateX(-50%)',
                           background: 'rgba(0,0,0,0.8)',
                           color: 'white',
                           fontSize: '9px',
                           padding: '2px 6px',
                           borderRadius: '3px',
                           whiteSpace: 'nowrap',
                           opacity: 0,
                           pointerEvents: 'none',
                           transition: 'opacity 0.2s',
                           zIndex: 10
                         }}>
                           {getTLDTooltip(tld)}
                         </span>
                       </span>
                     </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Idle: TLD price grid ── */}
          {showIdle && tldPrices.length > 0 && (
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: '20px', textAlign: 'center' }}>
                Popular extensions
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '10px' }}>
                {tldPrices.map(t => {
                  const cat = TLD_CATEGORY[t.tld];
                  const col = cat ? CATEGORY_COLOR[cat] : 'rgba(91,148,210,0.9)';
                  return (
                      <button
                        key={t.tld}
                        onClick={() => appendTLD(t.tld)}
                        aria-label={`Search for domain with .${t.tld} extension`}
                        style={{
                        padding: '20px 18px', background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px',
                        cursor: 'pointer', textAlign: 'left', transition: 'all .15s',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget.style.borderColor = 'rgba(91,148,210,0.22)');
                        (e.currentTarget.style.transform = 'translateY(-2px)');
                        (e.currentTarget.style.background = 'rgba(255,255,255,0.05)');
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)');
                        (e.currentTarget.style.transform = 'none');
                        (e.currentTarget.style.background = 'rgba(255,255,255,0.03)');
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '14px', fontWeight: 600, color: col }}>
                          .{t.tld}
                        </div>
                        {cat && (
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '6.5px', letterSpacing: '0.1em', color: col, background: col.replace(/[\d.]+\)$/, '0.1)'), border: `1px solid ${col.replace(/[\d.]+\)$/, '0.2)')}`, padding: '2px 6px', borderRadius: '100px' }}>
                            {cat}
                          </span>
                        )}
                      </div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '26px', color: '#fff', lineHeight: 1, marginBottom: '8px' }}>
                        {formatZAR(t.priceZAR)}/yr
                      </div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '7.5px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.45)' }}>
                        Register →
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Loading skeleton — 30 rows ── */}
          {loading && (
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(91,148,210,0.6)', animation: 'pulse 1s infinite' }} />
                Checking 30 extensions…
              </div>
              <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden' }}>
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '18px 1fr auto auto auto',
                    gap: '16px', alignItems: 'center', padding: '15px 28px',
                    borderBottom: i < 29 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                  }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', animation: `pulse 1.4s ${i * 0.04}s infinite` }} />
                    <div style={{ width: `${90 + (i % 7) * 18}px`, height: 13, borderRadius: 4, background: 'rgba(255,255,255,0.06)', animation: `pulse 1.4s ${i * 0.04}s infinite` }} />
                    <div style={{ width: 72, height: 20, borderRadius: 100, background: 'linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0.04) 75%)', backgroundSize: '400px 100%', animation: 'shimmer 1.5s infinite' }} />
                    <div style={{ width: 55, height: 20, borderRadius: 4, background: 'rgba(255,255,255,0.04)' }} />
                    <div style={{ width: 90, height: 32, borderRadius: 100, background: 'rgba(255,255,255,0.04)' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Search error ── */}
          {!loading && searched && searchError && (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>
                Unable to check domain availability
              </div>
              <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '20px', lineHeight: 1.6 }}>
                There was a network issue or server error. Please try again.
              </div>
              <button
                onClick={() => doSearch(searched)}
                style={{ padding: '10px 24px', background: '#1B305B', border: '1px solid rgba(91,148,210,0.3)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'white', cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#243d6e')}
                onMouseLeave={e => (e.currentTarget.style.background = '#1B305B')}
              >
                Retry Search
              </button>
            </div>
          )}

          {/* ── Results ── */}
          {!loading && searched && !searchError && results.length > 0 && (
            <div>
              {/* Results header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)' }}>
                  Results for <span style={{ color: 'rgba(91,148,210,0.85)' }}>{sldBase}</span>
                  <span style={{ color: 'rgba(255,255,255,0.18)' }}> · {results.length} extensions checked</span>
                </div>
                {available.length > 0 && (
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', color: 'rgba(80,200,120,0.85)', background: 'rgba(80,200,120,0.08)', border: '1px solid rgba(80,200,120,0.2)', padding: '3px 11px', borderRadius: '100px' }}>
                    {available.length} available
                  </span>
                )}
                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/domains?q=${encodeURIComponent(searched)}`)}
                  aria-label="Share search results"
                  style={{ padding: '3px 8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '8px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  🔗 Share
                </button>
              </div>

              {/* Variant strip when .com is taken */}
              {variants.length > 0 && (
                <div style={{ marginBottom: '24px', padding: '16px 22px', background: 'rgba(91,148,210,0.04)', border: '1px solid rgba(91,148,210,0.12)', borderRadius: '14px' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '8.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.5)', marginBottom: '12px' }}>
                    .com is taken — try a variation
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {variants.map(v => (
                      <button
                        key={v}
                        onClick={() => { setInput(v); doSearch(v); }}
                        aria-label={`Search for ${v}`}
                        style={{ padding: '7px 16px', background: 'rgba(27,48,91,0.45)', border: '1px solid rgba(91,148,210,0.22)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(91,148,210,0.9)', cursor: 'pointer', transition: 'all .15s' }}
                        onMouseEnter={e => { (e.currentTarget.style.borderColor = 'rgba(91,148,210,0.5)'); (e.currentTarget.style.background = 'rgba(27,48,91,0.7)'); }}
                        onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(91,148,210,0.22)'); (e.currentTarget.style.background = 'rgba(27,48,91,0.45)'); }}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}

               {/* All results in responsive grid */}
               <ScrollReveal delay={0} className="results-grid">
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
                   {[...available, ...taken].map(r => (
                     <ResultCard key={r.domainName} result={r} onRegister={() => router.push(`/domains/${encodeURIComponent(r.domainName)}`)} onRetry={() => doSearch(searched)} />
                   ))}
                 </div>
               </ScrollReveal>

            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function DomainsPage() {
  return (
    <Suspense fallback={<div style={{ background: '#07070A', minHeight: '100vh' }} />}>
      <DomainsPageContent />
    </Suspense>
  );
}

/* ─── Result card ─────────────────────────────────────────────────────────── */
function ResultCard({
  result, onRegister, onRetry,
}: {
  result:     AvailabilityResult;
  onRegister: () => void;
  onRetry:    () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { domainName, tld, status, priceZAR, renewalZAR, isPremium, errorMessage } = result;

  const cat      = TLD_CATEGORY[tld];
  const catColor = cat ? CATEGORY_COLOR[cat] : undefined;

  const theme = {
    available:   { dot: 'rgba(80,200,120,0.9)',   bg: 'rgba(80,200,120,0.04)',   border: 'rgba(80,200,120,0.14)',  label: 'Available',                   labelColor: 'rgba(80,200,120,0.85)'  },
    premium:     { dot: 'rgba(210,160,50,0.9)',   bg: 'rgba(210,160,50,0.04)',   border: 'rgba(210,160,50,0.18)',  label: 'Premium',                     labelColor: 'rgba(210,160,50,0.85)'  },
    taken:       { dot: 'rgba(220,80,80,0.75)',   bg: 'rgba(220,80,80,0.025)',   border: 'rgba(220,80,80,0.09)',   label: 'Registered',                  labelColor: 'rgba(220,80,80,0.75)'   },
    unsupported: { dot: 'rgba(255,255,255,0.15)', bg: 'rgba(255,255,255,0.01)',  border: 'rgba(255,255,255,0.05)', label: 'Not via Clive',               labelColor: 'rgba(255,255,255,0.25)' },
    error:       { dot: 'rgba(255,255,255,0.12)', bg: 'rgba(255,255,255,0.01)',  border: 'rgba(255,255,255,0.05)', label: 'Unavailable',                 labelColor: 'rgba(255,255,255,0.2)'  },
  }[status];

  const isClickable = status === 'unsupported' || status === 'error';

    return (
      <div style={{ borderRadius: '16px', border: `1px solid ${theme.border}`, background: theme.bg, overflow: 'hidden', transition: 'transform .15s, box-shadow .15s', padding: '20px', cursor: isClickable ? 'pointer' : 'default' }}
         onClick={() => isClickable && setExpanded(x => !x)}
         onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
         onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            background: theme.dot, 
            animation: 
              status === 'available' 
                ? 'dotPulse 2s ease-in-out infinite, availablePulse 3s ease-in-out infinite' 
                : status === 'available' 
                  ? 'dotPulse 2s ease-in-out infinite' 
                  : 'none' 
          }} />
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '16px', color: (status === 'taken' || status === 'unsupported' || status === 'error') ? 'rgba(255,255,255,0.38)' : '#fff' }}>
            {domainName}
          </div>
          {cat && catColor && (status === 'available' || status === 'premium') && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '7px', letterSpacing: '0.12em', textTransform: 'uppercase', color: catColor, background: catColor.replace(/[\d.]+\)$/, '0.1)'), border: `1px solid ${catColor.replace(/[\d.]+\)$/, '0.2)')`, padding: '2px 8px', borderRadius: '100px' }}>
              {cat}
            </span>
          )}
        </div>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.08em', color: theme.labelColor, background: theme.labelColor.replace(/[\d.]+\)$/, '0.09)'), border: `1px solid ${theme.labelColor.replace(/[\d.]+\)$/, '0.18)')`, padding: '4px 10px', borderRadius: '100px' }}>
          {isPremium && status === 'available' ? '⚠ Premium' : theme.label}
        </span>
      </div>

      {/* Price and CTA row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '24px', color: status === 'taken' ? 'rgba(255,255,255,0.2)' : '#fff' }}>
          {priceZAR ? (
            <>
              <span style={{ 
                textDecoration: comTaken && status === 'available' && tld !== 'com' ? 'line-through' : 'none',
                color: comTaken && status === 'available' && tld !== 'com' ? 'rgba(255,255,255,0.5)' : '#fff',
                marginRight: comTaken && status === 'available' && tld !== 'com' ? '6px' : 0
              }}>
                {formatZAR(priceZAR)}
              </span>
              {comTaken && status === 'available' && tld !== 'com' && (
                <>
                  <span style={{ 
                    fontSize: '14px', 
                    color: 'rgba(80,200,120,0.8)',
                    fontStyle: 'italic'
                  }}>
                    Save {formatZAR(Math.max(0, getComPrice() - priceZAR))}
                  </span>
                  <span style={{ 
                    fontSize: '10px', 
                    color: 'rgba(255,255,255,0.3)'
                  }}>
                    vs .com
                  </span>
                </>
              )}
              <span style={{ 
                fontSize: '10px', 
                color: 'rgba(255,255,255,0.2)', 
                marginLeft: '4px'
              }}>
                /yr
              </span>
            </>
          ) : ''}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(status === 'available' || status === 'premium') && (
            <>
              <button
                onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(domainName); }}
                aria-label={`Copy ${domainName} to clipboard`}
                style={{ padding: '8px 12px', background: 'transparent', border: '1px solid rgba(91,148,210,0.3)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.9)', cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(91,148,210,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                📋
              </button>
              <button
                onClick={e => { e.stopPropagation(); onRegister(); }}
                aria-label={`Register ${domainName}`}
                style={{ padding: '8px 18px', background: status === 'premium' ? 'transparent' : '#1B305B', border: status === 'premium' ? '1px solid rgba(210,160,50,0.4)' : '1px solid rgba(91,148,210,0.3)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: status === 'premium' ? 'rgba(210,160,50,0.9)' : 'white', cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#243d6e')}
                onMouseLeave={e => (e.currentTarget.style.background = status === 'premium' ? 'transparent' : '#1B305B')}
              >
                Register →
              </button>
            </>
          )}
          {status === 'taken' && (
            <a href={`mailto:domains@clive.dev?subject=Domain offer: ${domainName}`} style={{ padding: '8px 12px', fontFamily: "'DM Mono', monospace", fontSize: '8px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.18)', textDecoration: 'none', transition: 'color .15s' }} onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.42)')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.18)')}>
              Make offer
            </a>
          )}
          {status === 'error' && (
            <button onClick={e => { e.stopPropagation(); onRetry(); }} aria-label={`Retry checking ${domainName}`} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '8px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', cursor: 'pointer' }}>
              Retry
            </button>
          )}
          {status === 'unsupported' && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: 'rgba(255,255,255,0.18)' }}>
              {expanded ? '▲' : '▼'}
            </span>
          )}
        </div>
      </div>
          {cat && catColor && (status === 'available' || status === 'premium') && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '6.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: catColor, background: catColor.replace(/[\d.]+\)$/, '0.1)'), border: `1px solid ${catColor.replace(/[\d.]+\)$/, '0.2)')}`, padding: '2px 7px', borderRadius: '100px', flexShrink: 0 }}>
              {cat}
            </span>
          )}
        </div>

        {/* Status label */}
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9.5px', letterSpacing: '0.08em', color: theme.labelColor, background: theme.labelColor.replace(/[\d.]+\)$/, '0.09)'), border: `1px solid ${theme.labelColor.replace(/[\d.]+\)$/, '0.18)')}`, padding: '3px 9px', borderRadius: '100px', whiteSpace: 'nowrap' }}>
            {isPremium && status === 'available' ? '⚠ Premium' : theme.label}
          </span>
        </div>

        {/* Price */}
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '22px', color: status === 'taken' ? 'rgba(255,255,255,0.2)' : '#fff', textAlign: 'right', minWidth: '80px' }}>
          {priceZAR ? `${formatZAR(priceZAR)}/yr` : ''}
        </div>

        {/* CTA */}
        <div style={{ minWidth: '140px', textAlign: 'right', display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
          {(status === 'available' || status === 'premium') && (
            <>
              <button
                onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(domainName); }}
                aria-label={`Copy ${domainName} to clipboard`}
                style={{ padding: '8px 12px', background: 'transparent', border: '1px solid rgba(91,148,210,0.3)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.9)', cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(91,148,210,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                📋
              </button>
              <button
                onClick={e => { e.stopPropagation(); onRegister(); }}
                aria-label={`Register ${domainName}`}
                style={{ padding: '8px 18px', background: status === 'premium' ? 'transparent' : '#1B305B', border: status === 'premium' ? '1px solid rgba(210,160,50,0.4)' : '1px solid rgba(91,148,210,0.3)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: status === 'premium' ? 'rgba(210,160,50,0.9)' : 'white', cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#243d6e')}
                onMouseLeave={e => (e.currentTarget.style.background = status === 'premium' ? 'transparent' : '#1B305B')}
              >
                Register →
              </button>
            </>
          )}
          {status === 'taken' && (
            <a href={`mailto:domains@clive.dev?subject=Domain offer: ${domainName}`} style={{ fontFamily: "'DM Mono', monospace", fontSize: '8px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.18)', textDecoration: 'none', transition: 'color .15s' }} onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.42)')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.18)')}>
              Make an offer
            </a>
          )}
          {status === 'error' && (
            <button onClick={e => { e.stopPropagation(); onRetry(); }} aria-label={`Retry checking ${domainName}`} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '8px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', cursor: 'pointer' }}>
              Retry
            </button>
          )}
          {status === 'unsupported' && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: 'rgba(255,255,255,0.18)' }}>
              {expanded ? '▲' : '▼'}
            </span>
          )}
        </div>
      </div>

      {/* Renewal sub-line */}
      {(status === 'available' || status === 'premium') && renewalZAR && renewalZAR !== priceZAR && (
        <div style={{ padding: '0 22px 12px 52px', fontFamily: "'DM Mono', monospace", fontSize: '8px', color: 'rgba(255,255,255,0.18)' }}>
          Renews at {formatZAR(renewalZAR)}/yr
        </div>
      )}

      {/* Expansion panel */}
      {expanded && (
        <div style={{ padding: '0 22px 16px 52px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {status === 'unsupported' && (
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9.5px', lineHeight: 1.9, color: 'rgba(255,255,255,0.3)' }}>
              We cannot currently register .{tld} domains through Clive. Try{' '}
              <a href="https://www.namecheap.com" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(91,148,210,0.65)', textDecoration: 'none' }}>Namecheap</a>.
            </div>
          )}
          {status === 'error' && (
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9.5px', lineHeight: 1.9, color: 'rgba(255,255,255,0.3)' }}>
              {errorMessage || "Registry unreachable. This usually resolves in a moment."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
