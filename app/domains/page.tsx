'use client';
import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';

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

function formatZAR(cents: number) {
  return `R${(cents / 100).toFixed(0)}`;
}

function DomainsPageContent() {
  const router = useRouter();
  const params = useSearchParams();

  const [input,      setInput]      = useState('');
  const [results,    setResults]    = useState<AvailabilityResult[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [searched,   setSearched]   = useState('');
  const [tldPrices,  setTldPrices]  = useState<TLDPrice[]>([]);
  const [priceError, setPriceError] = useState(false);

  useEffect(() => {
    fetch('/api/domains/tlds')
      .then(r => r.json())
      .then((d: { tlds?: TLDPrice[] }) => {
        if (d.tlds) setTldPrices(d.tlds.slice(0, 12));
        else setPriceError(true);
      })
      .catch(() => setPriceError(true));
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
        const STATUS_ORDER: Record<string, number> = { available: 0, premium: 1, taken: 2, unsupported: 3, error: 4 };
        const sorted = [...data.results].sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9));
        setResults(sorted);
      }
    } catch {
      // silently keep empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const q = params.get('q');
    if (q) { setInput(q); doSearch(q); }
  }, [params, doSearch]);

  const handleSearch = () => doSearch(input);

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
  const other          = results.filter(r => r.status === 'unsupported' || r.status === 'error');
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
      `}</style>
      <Nav />
      <div style={{ minHeight: '100vh', background: '#07070A', paddingTop: '64px' }}>

        {/* Grid mesh */}
        <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(27,48,91,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(27,48,91,0.05) 1px,transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', top: '-140px', right: '-100px', width: '700px', height: '700px', background: 'rgba(27,48,91,0.18)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', bottom: '-80px', left: '-80px', width: '500px', height: '500px', background: 'rgba(27,48,91,0.1)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '860px', margin: '0 auto', padding: '80px 32px 120px' }}>

          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.65)', marginBottom: '22px' }}>
              Domain Registration
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(52px,7vw,88px)', color: '#fff', lineHeight: 1.05, margin: '0 0 20px' }}>
              Find your domain.
            </h1>
            <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '16px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 40px' }}>
              30 extensions checked instantly. Smart suggestions based on your name.
            </p>

            {/* Search box */}
            <div style={{ position: 'relative', maxWidth: '680px', margin: '0 auto 20px' }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search for your domain name..."
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1.5px solid rgba(255,255,255,0.1)',
                  borderRadius: '100px', color: 'white',
                  fontFamily: "'DM Mono', monospace", fontSize: '13px',
                  padding: '18px 160px 18px 28px', outline: 'none',
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
              <button
                onClick={handleSearch}
                disabled={loading}
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

          {/* ── Results ── */}
          {!loading && searched && results.length > 0 && (
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

              {/* Available section */}
              {available.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(80,200,120,0.55)', marginBottom: '10px', paddingLeft: '4px' }}>
                    Available
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {available.map(r => (
                      <ResultRow key={r.domainName} result={r} onRegister={() => router.push(`/domains/${encodeURIComponent(r.domainName)}`)} onRetry={() => doSearch(searched)} />
                    ))}
                  </div>
                </div>
              )}

              {/* Taken section */}
              {taken.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(220,80,80,0.45)', marginBottom: '10px', paddingLeft: '4px', marginTop: available.length > 0 ? '20px' : 0 }}>
                    Registered
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {taken.map(r => (
                      <ResultRow key={r.domainName} result={r} onRegister={() => router.push(`/domains/${encodeURIComponent(r.domainName)}`)} onRetry={() => doSearch(searched)} />
                    ))}
                  </div>
                </div>
              )}

              {/* Other (errors/unsupported) — collapsed by default */}
              {other.length > 0 && (
                <details style={{ marginTop: '16px' }}>
                  <summary style={{ fontFamily: "'DM Mono', monospace", fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', paddingLeft: '4px', listStyle: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>↓ {other.length} unchecked or unsupported</span>
                  </summary>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                    {other.map(r => (
                      <ResultRow key={r.domainName} result={r} onRegister={() => router.push(`/domains/${encodeURIComponent(r.domainName)}`)} onRetry={() => doSearch(searched)} />
                    ))}
                  </div>
                </details>
              )}
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

/* ─── Result row ─────────────────────────────────────────────────────────── */
function ResultRow({
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
    <div style={{ borderRadius: '14px', border: `1px solid ${theme.border}`, background: theme.bg, overflow: 'hidden', transition: 'transform .15s' }}>
      <div
        style={{ display: 'grid', gridTemplateColumns: '14px 1fr auto auto auto', alignItems: 'center', gap: '14px', padding: '16px 22px', cursor: isClickable ? 'pointer' : 'default' }}
        onClick={() => isClickable && setExpanded(x => !x)}
      >
        {/* Status dot */}
        <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: theme.dot, animation: status === 'available' ? 'dotPulse 2s ease-in-out infinite' : 'none' }} />

        {/* Domain + category badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '14px', color: (status === 'taken' || status === 'unsupported' || status === 'error') ? 'rgba(255,255,255,0.38)' : '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {domainName}
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
        <div style={{ minWidth: '100px', textAlign: 'right' }}>
          {(status === 'available' || status === 'premium') && (
            <button
              onClick={e => { e.stopPropagation(); onRegister(); }}
              style={{ padding: '8px 18px', background: status === 'premium' ? 'transparent' : '#1B305B', border: status === 'premium' ? '1px solid rgba(210,160,50,0.4)' : '1px solid rgba(91,148,210,0.3)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: status === 'premium' ? 'rgba(210,160,50,0.9)' : 'white', cursor: 'pointer', transition: 'all .2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#243d6e')}
              onMouseLeave={e => (e.currentTarget.style.background = status === 'premium' ? 'transparent' : '#1B305B')}
            >
              Register →
            </button>
          )}
          {status === 'taken' && (
            <a href={`mailto:domains@clive.dev?subject=Domain offer: ${domainName}`} style={{ fontFamily: "'DM Mono', monospace", fontSize: '8px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.18)', textDecoration: 'none', transition: 'color .15s' }} onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.42)')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.18)')}>
              Make an offer
            </a>
          )}
          {status === 'error' && (
            <button onClick={e => { e.stopPropagation(); onRetry(); }} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '8px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', cursor: 'pointer' }}>
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
