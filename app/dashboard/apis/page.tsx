'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { getProductBySlug } from '@/lib/products';

interface Sub {
  id:          string;
  productId:   string;
  productName: string;
  productSlug: string;
  tierName:    string;
  priceZAR:    number;
  apiKey:      string;
  callsUsed:   number;
  callsLimit:  number | string;
  rateLimit:   number;
  acquiredAt:  string;
}

const LANGS = ['curl', 'Python', 'Node'] as const;
type Lang = typeof LANGS[number];

function maskKey(k: string) {
  const parts = k.split('_');
  if (parts.length < 3) return `${k.slice(0, 12)}••••••••••••••••`;
  return `${parts[0]}_${parts[1]}_${'•'.repeat(32)}`;
}

function snippet(lang: Lang, slug: string, apiKey: string, path: string) {
  const url  = `https://api.clive.dev/v1/${slug}${path}`;
  const body = JSON.stringify({ query: 'example' });
  if (lang === 'curl') return `curl -X POST ${url} \\\n  -H "X-Clive-Key: ${apiKey}" \\\n  -H "Content-Type: application/json" \\\n  -d '${body}'`;
  if (lang === 'Python') return `import requests\n\nres = requests.post(\n  "${url}",\n  headers={"X-Clive-Key": "${apiKey}"},\n  json={"query": "example"}\n)\nprint(res.json())`;
  return `const res = await fetch("${url}", {\n  method: "POST",\n  headers: {\n    "X-Clive-Key": "${apiKey}",\n    "Content-Type": "application/json"\n  },\n  body: JSON.stringify({ query: "example" })\n});\nconst data = await res.json();`;
}

function usagePct(used: number, limit: number | string): number {
  if (typeof limit !== 'number' || limit === 0) return 0;
  return Math.min((used / limit) * 100, 100);
}

function usageColor(pct: number) {
  if (pct > 90) return 'rgba(255,80,80,0.9)';
  if (pct > 70) return 'rgba(255,180,0,0.85)';
  return 'rgba(80,200,120,0.9)';
}

// ── Per-product panel ─────────────────────────────────────────────────────────
function ProductPanel({ sub }: { sub: Sub }) {
  const [revealed,   setRevealed]   = useState(false);
  const [copied,     setCopied]     = useState<string>('');
  const [lang,       setLang]       = useState<Lang>('curl');
  const [regen,      setRegen]      = useState(false);
  const [liveKey,    setLiveKey]    = useState(sub.apiKey);
  const [confirming, setConfirming] = useState(false);

  const product  = getProductBySlug(sub.productSlug ?? sub.productId);
  const firstPath = product?.endpoints?.[0]?.path ?? '/endpoint';
  const pct      = usagePct(sub.callsUsed, sub.callsLimit);
  const baseUrl  = `https://api.clive.dev/v1/${sub.productSlug ?? sub.productId}`;

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleRegen = async () => {
    if (!confirming) { setConfirming(true); return; }
    setRegen(true);
    try {
      const res  = await fetch(`/api/subscriptions/${sub.id}/regenerate-key`, { method: 'POST' });
      const data = await res.json();
      if (data.apiKey) setLiveKey(data.apiKey);
    } finally { setRegen(false); setConfirming(false); }
  };

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: '5px 12px',
    background: active ? 'rgba(27,48,91,0.6)' : 'transparent',
    border: active ? '1px solid rgba(91,148,210,0.4)' : '1px solid rgba(255,255,255,0.08)',
    borderRadius: '6px',
    fontFamily: "'DM Mono', monospace",
    fontSize: '9.5px',
    color: active ? 'rgba(91,148,210,0.9)' : 'rgba(255,255,255,0.35)',
    cursor: 'pointer',
    transition: 'all .15s',
  });

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '40px' }}>

        {/* LEFT — API Key */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.65)', marginBottom: '16px' }}>API Key</div>

          <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(91,148,210,0.2)', borderLeft: '3px solid rgba(91,148,210,0.5)', borderRadius: '0 8px 8px 0', padding: '12px 14px', fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'rgba(91,148,210,0.8)', wordBreak: 'break-all', marginBottom: '10px', minHeight: '44px' }}>
            {revealed ? liveKey : maskKey(liveKey)}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button onClick={() => setRevealed(r => !r)} style={btnStyle(revealed)}>{revealed ? 'Hide' : 'Reveal'}</button>
            <button onClick={() => copy(liveKey, 'key')} style={btnStyle(false)}>{copied === 'key' ? 'Copied ✓' : 'Copy'}</button>
            <button onClick={handleRegen} disabled={regen} style={{ ...btnStyle(false), color: confirming ? 'rgba(255,100,100,0.8)' : 'rgba(255,255,255,0.25)', borderColor: confirming ? 'rgba(255,100,100,0.3)' : undefined }}>
              {regen ? '···' : confirming ? 'Confirm regen' : 'Regenerate'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '8px', color: 'rgba(255,255,255,0.25)', marginBottom: '4px' }}>BASE URL</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <code style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.55)', flex: 1, wordBreak: 'break-all' }}>{baseUrl}</code>
                <button onClick={() => copy(baseUrl, 'url')} style={btnStyle(false)}>{copied === 'url' ? '✓' : 'Copy'}</button>
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '8px', color: 'rgba(255,255,255,0.25)', marginBottom: '4px' }}>AUTH HEADER</div>
              <code style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.4)', wordBreak: 'break-all' }}>X-Clive-Key: {revealed ? liveKey : maskKey(liveKey)}</code>
            </div>
          </div>

          <div style={{ marginTop: '16px', padding: '10px 14px', background: 'rgba(27,48,91,0.3)', border: '1px solid rgba(91,148,210,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: 'rgba(91,148,210,0.7)' }}>
              {sub.tierName} plan · {typeof sub.callsLimit === 'number' ? sub.callsLimit.toLocaleString() : sub.callsLimit} calls/mo
            </span>
            <Link href={`/products/${sub.productSlug ?? sub.productId}`} style={{ fontFamily: "'DM Mono', monospace", fontSize: '8.5px', color: 'rgba(91,148,210,0.5)', textDecoration: 'none' }}>Upgrade →</Link>
          </div>
        </div>

        {/* CENTER — Usage */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.65)', marginBottom: '16px' }}>Usage this month</div>

          <div style={{ marginBottom: '8px' }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '52px', color: '#fff', lineHeight: 1 }}>{sub.callsUsed.toLocaleString()}</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginLeft: '6px' }}>/ {typeof sub.callsLimit === 'number' ? sub.callsLimit.toLocaleString() : sub.callsLimit} calls</span>
          </div>

          <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', marginBottom: '20px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: usageColor(pct), borderRadius: '3px', transition: 'width .4s' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Calls today',      value: '—' },
              { label: 'Calls this week',  value: '—' },
              { label: 'Avg latency',      value: '—' },
              { label: 'Error rate',       value: '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '7.5px', color: 'rgba(255,255,255,0.25)', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{value}</div>
              </div>
            ))}
          </div>

          {pct > 80 && typeof sub.callsLimit === 'number' && (
            <div style={{ marginTop: '16px', padding: '12px 14px', background: 'rgba(255,180,0,0.06)', border: '1px solid rgba(255,180,0,0.2)', borderRadius: '8px', fontFamily: "'DM Mono', monospace", fontSize: '9px', color: 'rgba(255,180,0,0.8)', lineHeight: 1.7 }}>
              You&apos;ve used {Math.round(pct)}% of your free calls.{' '}
              <Link href={`/products/${sub.productSlug ?? sub.productId}`} style={{ color: 'rgba(91,148,210,0.7)', textDecoration: 'none' }}>Upgrade →</Link>
            </div>
          )}
        </div>

        {/* RIGHT — Quick start */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.65)', marginBottom: '16px' }}>Quick start</div>

          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
            {LANGS.map(l => <button key={l} onClick={() => setLang(l)} style={btnStyle(lang === l)}>{l}</button>)}
          </div>

          <div style={{ position: 'relative', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '16px', marginBottom: '8px' }}>
            <button
              onClick={() => copy(snippet(lang, sub.productSlug ?? sub.productId, liveKey, firstPath), 'snippet')}
              style={{ position: 'absolute', top: '10px', right: '10px', padding: '4px 10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontFamily: "'DM Mono', monospace", fontSize: '8px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
            >
              {copied === 'snippet' ? 'Copied ✓' : 'Copy'}
            </button>
            <pre style={{ margin: 0, fontFamily: "'DM Mono', monospace", fontSize: '10.5px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.85, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {snippet(lang, sub.productSlug ?? sub.productId, revealed ? liveKey : maskKey(liveKey), firstPath)}
            </pre>
          </div>
        </div>
      </div>

      {/* Endpoints */}
      {product?.endpoints && product.endpoints.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.65)', marginBottom: '14px' }}>Endpoints</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {product.endpoints.map((ep, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: ep.method === 'GET' ? 'rgba(80,200,120,0.8)' : ep.method === 'DEL' ? 'rgba(255,80,80,0.8)' : 'rgba(91,148,210,0.8)', background: ep.method === 'GET' ? 'rgba(80,200,120,0.1)' : ep.method === 'DEL' ? 'rgba(255,80,80,0.1)' : 'rgba(91,148,210,0.1)', border: `1px solid ${ep.method === 'GET' ? 'rgba(80,200,120,0.2)' : ep.method === 'DEL' ? 'rgba(255,80,80,0.2)' : 'rgba(91,148,210,0.2)'}`, padding: '3px 8px', borderRadius: '4px', flexShrink: 0 }}>{ep.method}</span>
                <code style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.5)', flex: 1 }}>{ep.path}</code>
                <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '12px', color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>{ep.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Docs link */}
      <Link href={`/docs/api/${sub.productSlug ?? sub.productId}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', textDecoration: 'none' }}>
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(91,148,210,0.7)', marginBottom: '3px' }}>{sub.productName} Documentation</div>
          <div style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>Endpoints, parameters, and example requests.</div>
        </div>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>→</span>
      </Link>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MyAPIsPage() {
  const router = useRouter();
  const [subs,       setSubs]       = useState<Sub[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setActiveTab]  = useState(0);

  const loadSubs = useCallback(async () => {
    try {
      const res  = await fetch('/api/subscriptions');
      if (res.status === 401) { router.push('/auth?screen=signin&redirect=/dashboard/apis'); return; }
      const data = await res.json() as { subscriptions?: Sub[] };
      setSubs(data.subscriptions ?? []);
    } catch {
      setSubs([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { loadSubs(); }, [loadSubs]);

  return (
    <>
      <Nav />
      <div style={{ minHeight: '100vh', background: '#07070A', paddingTop: '64px' }}>
        <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(27,48,91,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(27,48,91,0.05) 1px,transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', top: '-140px', right: '-100px', width: '600px', height: '600px', background: 'rgba(27,48,91,0.15)', borderRadius: '50%', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: '64px 32px 120px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' }}>
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(36px,5vw,56px)', color: '#fff', margin: '0 0 8px', lineHeight: 1.05 }}>My APIs</h1>
              <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '14px', color: 'rgba(255,255,255,0.35)', margin: 0 }}>Your acquired products and API keys.</p>
            </div>
            <Link href="/products" style={{ padding: '10px 22px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '9.5px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Browse APIs →
            </Link>
          </div>

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.25)' }}>
              Loading…
            </div>
          )}

          {/* Empty state */}
          {!loading && subs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚡</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '36px', color: '#fff', marginBottom: '12px' }}>No APIs acquired yet.</h2>
              <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '14px', color: 'rgba(255,255,255,0.35)', marginBottom: '32px', lineHeight: 1.7 }}>
                Acquire your first API to get your key and start building.
              </p>
              <Link href="/products" style={{ display: 'inline-block', padding: '13px 32px', background: '#1B305B', border: '1.5px solid rgba(91,148,210,0.35)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '10.5px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'white', textDecoration: 'none' }}>
                Browse APIs →
              </Link>
            </div>
          )}

          {/* Tabs + panel */}
          {!loading && subs.length > 0 && (
            <>
              {subs.length > 1 && (
                <div style={{ display: 'flex', gap: '4px', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '0' }}>
                  {subs.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveTab(i)}
                      style={{
                        padding: '10px 20px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === i ? '2px solid rgba(91,148,210,0.8)' : '2px solid transparent',
                        fontFamily: "'DM Mono', monospace",
                        fontSize: '10px',
                        letterSpacing: '0.1em',
                        color: activeTab === i ? 'rgba(91,148,210,0.9)' : 'rgba(255,255,255,0.35)',
                        cursor: 'pointer',
                        transition: 'all .15s',
                        marginBottom: '-1px',
                      }}
                    >
                      {s.productName}
                    </button>
                  ))}
                </div>
              )}

              {subs[activeTab] && (
                <>
                  <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '32px', color: '#fff', margin: '0 0 4px' }}>{subs[activeTab].productName}</h2>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: 'rgba(91,148,210,0.65)', background: 'rgba(27,48,91,0.35)', border: '1px solid rgba(91,148,210,0.2)', padding: '3px 10px', borderRadius: '100px' }}>
                      {subs[activeTab].tierName} plan
                    </span>
                  </div>
                  <ProductPanel key={subs[activeTab].id} sub={subs[activeTab]} />
                </>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
