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

const PILL_TLDS = ['com', 'co.za', 'net', 'org', 'io', 'dev', 'app'];

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

  // Load TLD prices for idle state grid
  useEffect(() => {
    fetch('/api/domains/tlds')
      .then(r => r.json())
      .then((d: { tlds?: TLDPrice[] }) => {
        if (d.tlds) setTldPrices(d.tlds.slice(0, 8));
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
      if (data.results) setResults(data.results);
    } catch {
      // silently keep empty
    } finally {
      setLoading(false);
    }
  }, []);

  // Honour ?q= param on load
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

  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.9} }
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        @keyframes dotPulse { 0%,100%{transform:scale(1);opacity:.9} 50%{transform:scale(1.5);opacity:1} }
      `}</style>
      <Nav />
      <div style={{ minHeight: '100vh', background: '#07070A', paddingTop: '64px' }}>

        {/* Grid mesh */}
        <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(27,48,91,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(27,48,91,0.05) 1px,transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none', zIndex: 0 }} />

        {/* Orbs */}
        <div style={{ position: 'fixed', top: '-140px', right: '-100px', width: '700px', height: '700px', background: 'rgba(27,48,91,0.18)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', bottom: '-80px', left: '-80px', width: '500px', height: '500px', background: 'rgba(27,48,91,0.1)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', top: '40%', left: '30%', width: '300px', height: '300px', background: 'rgba(27,48,91,0.06)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '860px', margin: '0 auto', padding: '80px 32px' }}>

          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.65)', marginBottom: '22px' }}>
              Domain Registration
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(52px,7vw,88px)', color: '#fff', lineHeight: 1.05, margin: '0 0 20px' }}>
              Find your domain.
            </h1>
            <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '16px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 40px' }}>
              Register and manage domains directly from Clive.
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

            {/* TLD pills */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {PILL_TLDS.map(tld => {
                const p = tldPrices.find(t => t.tld === tld);
                return (
                  <button
                    key={tld}
                    onClick={() => appendTLD(tld)}
                    title={p ? `from ${formatZAR(p.priceZAR)}/yr` : ''}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      padding: '6px 14px',
                      background: 'rgba(27,48,91,0.35)', border: '1px solid rgba(91,148,210,0.2)',
                      borderRadius: '100px', cursor: 'pointer', transition: 'all .15s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget.style.borderColor = 'rgba(91,148,210,0.5)');
                      (e.currentTarget.style.background = 'rgba(27,48,91,0.6)');
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget.style.borderColor = 'rgba(91,148,210,0.2)');
                      (e.currentTarget.style.background = 'rgba(27,48,91,0.35)');
                    }}
                  >
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', color: 'rgba(91,148,210,0.85)' }}>
                      .{tld}
                    </span>
                    {p && (
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '7.5px', color: 'rgba(255,255,255,0.3)', marginTop: '1px' }}>
                        {formatZAR(p.priceZAR)}/yr
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Idle: TLD price grid */}
          {showIdle && tldPrices.length > 0 && (
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: '20px', textAlign: 'center' }}>
                Popular extensions
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '12px' }}>
                {tldPrices.map(t => (
                  <button
                    key={t.tld}
                    onClick={() => appendTLD(t.tld)}
                    style={{
                      padding: '20px', background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px',
                      cursor: 'pointer', textAlign: 'left', transition: 'all .15s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget.style.borderColor = 'rgba(91,148,210,0.25)');
                      (e.currentTarget.style.transform = 'translateY(-2px)');
                      (e.currentTarget.style.background = 'rgba(255,255,255,0.05)');
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)');
                      (e.currentTarget.style.transform = 'none');
                      (e.currentTarget.style.background = 'rgba(255,255,255,0.03)');
                    }}
                  >
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '14px', fontWeight: 600, color: 'rgba(91,148,210,0.9)', marginBottom: '8px' }}>
                      .{t.tld}
                    </div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '28px', color: '#fff', lineHeight: 1, marginBottom: '10px' }}>
                      {formatZAR(t.priceZAR)}/yr
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.5)' }}>
                      Register →
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', marginBottom: '20px' }}>
                Checking availability…
              </div>
              <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden' }}>
                {PILL_TLDS.map((tld, i) => (
                  <div key={tld} style={{
                    display: 'grid', gridTemplateColumns: '18px 1fr auto auto auto',
                    gap: '16px', alignItems: 'center', padding: '18px 28px',
                    borderBottom: i < PILL_TLDS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    background: 'rgba(255,255,255,0.02)',
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', animation: 'pulse 1.4s infinite' }} />
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '15px', color: 'rgba(255,255,255,0.25)' }}>
                      {searched.replace(/\.[a-z.]+$/, '')}<span style={{ color: 'rgba(91,148,210,0.4)' }}>.{tld}</span>
                    </div>
                    <div style={{ width: 80, height: 22, borderRadius: 100, background: 'linear-gradient(90deg,rgba(255,255,255,0.05) 25%,rgba(255,255,255,0.12) 50%,rgba(255,255,255,0.05) 75%)', backgroundSize: '400px 100%', animation: 'shimmer 1.5s infinite' }} />
                    <div style={{ width: 60, height: 22, borderRadius: 4, background: 'rgba(255,255,255,0.05)' }} />
                    <div style={{ width: 100, height: 34, borderRadius: 100, background: 'rgba(255,255,255,0.05)' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {!loading && searched && results.length > 0 && (
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>
                Results for <span style={{ color: 'rgba(91,148,210,0.8)' }}>{searched.replace(/\.[a-z.]+$/, '')}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {results.map(r => (
                  <ResultRow
                    key={r.domainName}
                    result={r}
                    onRegister={() => router.push(`/domains/${encodeURIComponent(r.domainName)}`)}
                    onRetry={() => doSearch(searched)}
                  />
                ))}
              </div>
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
    <Suspense fallback={<div>Loading...</div>}>
      <DomainsPageContent />
    </Suspense>
  );
}

/* ─── Result row component ───────────────────────────────────────────────── */
/* ─── Result row component ───────────────────────────────────────────────── */
function ResultRow({
  result, onRegister, onRetry,
}: {
  result:     AvailabilityResult;
  onRegister: () => void;
  onRetry:    () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { domainName, status, priceZAR, renewalZAR, isPremium, errorMessage } = result;

  const theme = {
    available:   { dot: 'rgba(80,200,120,0.9)',   bg: 'rgba(80,200,120,0.04)',   border: 'rgba(80,200,120,0.15)',   label: 'Available',                    labelColor: 'rgba(80,200,120,0.85)'  },
    premium:     { dot: 'rgba(210,160,50,0.9)',   bg: 'rgba(210,160,50,0.04)',   border: 'rgba(210,160,50,0.18)',   label: 'Premium domain',               labelColor: 'rgba(210,160,50,0.85)'  },
    taken:       { dot: 'rgba(220,80,80,0.8)',    bg: 'rgba(220,80,80,0.03)',    border: 'rgba(220,80,80,0.1)',     label: 'Registered',                   labelColor: 'rgba(220,80,80,0.8)'    },
    unsupported: { dot: 'rgba(210,150,50,0.85)',  bg: 'rgba(210,150,50,0.03)',   border: 'rgba(210,150,50,0.1)',    label: 'Not available through Clive',  labelColor: 'rgba(210,150,50,0.85)'  },
    error:       { dot: 'rgba(210,150,50,0.85)',  bg: 'rgba(255,255,255,0.02)',  border: 'rgba(255,255,255,0.07)',  label: 'Status unavailable',           labelColor: 'rgba(210,150,50,0.75)'  },
  }[status];

  const isClickable = status === 'unsupported' || status === 'error';

  return (
    <div style={{
      borderRadius: '16px', border: `1px solid ${theme.border}`,
      background: theme.bg, overflow: 'hidden', transition: 'transform .15s',
    }}>
      <div
        style={{
          display: 'grid', gridTemplateColumns: '18px 1fr auto auto auto',
          alignItems: 'center', gap: '16px', padding: '18px 24px',
          cursor: isClickable ? 'pointer' : 'default',
        }}
        onClick={() => isClickable && setExpanded(x => !x)}
      >
        {/* Status dot */}
        <div style={{
          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
          background: theme.dot,
          animation: status === 'available' ? 'dotPulse 2s ease-in-out infinite' : 'none',
        }} />

        {/* Domain name */}
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '15px', color: status === 'taken' || status === 'unsupported' ? 'rgba(255,255,255,0.45)' : '#fff' }}>
            {domainName}
          </div>
        </div>

        {/* Status label */}
        <div style={{ textAlign: 'right' }}>
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.1em',
            color: theme.labelColor,
            background: theme.labelColor.replace(/[\d.]+\)$/, '0.1)'),
            border: `1px solid ${theme.labelColor.replace(/[\d.]+\)$/, '0.2)')}`,
            padding: '4px 10px', borderRadius: '100px', whiteSpace: 'nowrap',
          }}>
            {isPremium && status === 'available' && '⚠ '}
            {theme.label}
          </span>
        </div>

        {/* Price */}
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '24px', color: '#fff', textAlign: 'right', minWidth: '90px' }}>
          {priceZAR ? `${formatZAR(priceZAR)}/yr` : ''}
        </div>

        {/* CTA */}
        <div style={{ minWidth: '110px', textAlign: 'right' }}>
          {(status === 'available' || status === 'premium') && (
            <button
              onClick={e => { e.stopPropagation(); onRegister(); }}
              style={{
                padding: '9px 20px',
                background: status === 'premium' ? 'transparent' : '#1B305B',
                border: status === 'premium' ? '1px solid rgba(210,160,50,0.4)' : '1px solid rgba(91,148,210,0.3)',
                borderRadius: '100px',
                fontFamily: "'DM Mono', monospace", fontSize: '9.5px', letterSpacing: '0.1em', textTransform: 'uppercase',
                color: status === 'premium' ? 'rgba(210,160,50,0.9)' : 'white',
                cursor: 'pointer', transition: 'all .2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#243d6e')}
              onMouseLeave={e => (e.currentTarget.style.background = status === 'premium' ? 'transparent' : '#1B305B')}
            >
              Register →
            </button>
          )}
          {status === 'taken' && (
            <a
              href={`mailto:domains@clive.dev?subject=Domain offer: ${domainName}`}
              style={{ fontFamily: "'DM Mono', monospace", fontSize: '8.5px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.2)', textDecoration: 'none', transition: 'color .15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
            >
              Make an offer
            </a>
          )}
          {status === 'error' && (
            <button
              onClick={e => { e.stopPropagation(); onRetry(); }}
              style={{ padding: '7px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '8.5px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
            >
              Retry
            </button>
          )}
          {status === 'unsupported' && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: 'rgba(255,255,255,0.2)' }}>
              {expanded ? '▲' : '▼'}
            </span>
          )}
        </div>
      </div>

      {/* Renewal price sub-line for available */}
      {(status === 'available' || status === 'premium') && renewalZAR && renewalZAR !== priceZAR && (
        <div style={{ padding: '0 24px 14px 62px', fontFamily: "'DM Mono', monospace", fontSize: '8.5px', color: 'rgba(255,255,255,0.2)' }}>
          Renews at {formatZAR(renewalZAR)}/yr
        </div>
      )}

      {/* Expansion panel */}
      {expanded && (
        <div style={{ padding: '0 24px 18px 62px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {status === 'unsupported' && (
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', lineHeight: 1.9, color: 'rgba(255,255,255,0.35)' }}>
              We currently support .com, .co.za, .net, .org, .io, .dev, .app, .store, .online, .tech, and .site registrations through Clive.
              Support for additional extensions is coming soon.{' '}
              If you need this extension today, we recommend{' '}
              <a href="https://www.namecheap.com" target="_blank" rel="noopener noreferrer"
                style={{ color: 'rgba(91,148,210,0.7)', textDecoration: 'none' }}>
                Namecheap
              </a>.
            </div>
          )}
          {status === 'error' && (
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', lineHeight: 1.9, color: 'rgba(255,255,255,0.35)' }}>
              {errorMessage || "We couldn't retrieve registry data right now. This usually resolves in a few moments."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
