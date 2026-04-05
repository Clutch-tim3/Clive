export const metadata = { title: 'API Reference — Clive', description: 'Complete Clive API reference documentation.' };

const s = {
  kicker: { fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(91,148,210,0.7)', textTransform: 'uppercase' as const, marginBottom: '16px' },
  h1: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(44px,5vw,64px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.0, marginBottom: '24px' },
  h2: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '28px', color: '#fff', marginBottom: '16px', marginTop: '48px' },
  h3: { fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' as const, marginBottom: '10px', marginTop: '28px' },
  body: { fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic' as const, fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginBottom: '16px' },
  code: { fontFamily: 'DM Mono, monospace', fontSize: '12px', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px', color: 'rgba(91,148,210,0.9)' },
  rule: { height: '1px', background: 'rgba(255,255,255,0.07)', margin: '40px 0' },
};

const method = (m: string) => {
  const colors: Record<string, string> = { GET: 'rgba(80,200,120,0.8)', POST: 'rgba(91,148,210,0.8)', DELETE: 'rgba(220,80,80,0.7)', PATCH: 'rgba(255,180,0,0.8)' };
  return { fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.1em', padding: '3px 7px', borderRadius: '4px', color: colors[m], border: `1px solid ${colors[m]}`, flexShrink: 0 };
};

const endpoints = [
  { method: 'GET', path: '/v1/products', desc: 'List all products available on the marketplace. Returns name, slug, category, pricing tiers, and rate limit metadata.' },
  { method: 'GET', path: '/v1/products/:slug', desc: 'Retrieve full product details including endpoint list, authentication requirements, and example responses.' },
  { method: 'POST', path: '/v1/keys', desc: 'Issue a new API key for your account. Requires authentication. Returns a one-time plaintext key — store it securely.' },
  { method: 'GET', path: '/v1/keys', desc: 'List all active API keys on your account. Returns key metadata (prefix, created, last used) — never the plaintext key.' },
  { method: 'DELETE', path: '/v1/keys/:id', desc: 'Revoke an API key immediately. All requests using the revoked key will return 401 after revocation.' },
  { method: 'GET', path: '/v1/usage', desc: 'Retrieve usage statistics for your account. Supports ?from, ?to (ISO 8601), ?product, and ?endpoint query params.' },
  { method: 'GET', path: '/v1/webhooks', desc: 'List all registered webhook endpoints on your account.' },
  { method: 'POST', path: '/v1/webhooks', desc: 'Register a new webhook endpoint. Body: { url, events[], secret }. Returns webhook ID and signing key.' },
  { method: 'DELETE', path: '/v1/webhooks/:id', desc: 'Remove a webhook endpoint. Future events will not be delivered to this URL.' },
];

const errors = [
  { code: '400', title: 'Bad Request', desc: 'Missing or malformed parameters.' },
  { code: '401', title: 'Unauthorized', desc: 'Invalid, revoked, or missing API key.' },
  { code: '403', title: 'Forbidden', desc: 'Valid key but insufficient plan for this resource.' },
  { code: '429', title: 'Rate Limited', desc: 'Quota exceeded. Check Retry-After header.' },
  { code: '500', title: 'Internal Error', desc: 'Unexpected server error. Retry with exponential backoff.' },
];

export default function ApiReferencePage() {
  return (
    <main style={{ background: '#07070A', minHeight: '100vh' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '140px 32px 100px' }}>
        <p style={s.kicker}>Documentation</p>
        <h1 style={s.h1}>API Reference.</h1>
        <p style={{ ...s.body, fontSize: '15px', marginBottom: '48px' }}>
          All Clive APIs share a common gateway, authentication scheme, and response format. This page covers the management API — for product-specific endpoints, see the individual product pages.
        </p>

        <h2 style={{ ...s.h2, marginTop: 0 }}>Authentication</h2>
        <p style={s.body}>All requests must include your API key in the <span style={s.code}>Authorization</span> header:</p>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px 24px', marginBottom: '24px' }}>
          <code style={{ fontFamily: 'DM Mono, monospace', fontSize: '12.5px', color: 'rgba(91,148,210,0.85)' }}>
            Authorization: Bearer clive_live_sk_xxxxxxxxxxxxxxxx
          </code>
        </div>
        <p style={s.body}>Keys are issued per account. Each key carries the permissions of the plan it was issued under. Rotate keys from your dashboard at any time.</p>

        <div style={s.rule} />

        <h2 style={{ ...s.h2, marginTop: 0 }}>Base URL</h2>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px 24px', marginBottom: '24px' }}>
          <code style={{ fontFamily: 'DM Mono, monospace', fontSize: '12.5px', color: 'rgba(255,255,255,0.6)' }}>
            https://api.clive.dev
          </code>
        </div>
        <p style={s.body}>All responses are JSON. Dates are ISO 8601 UTC strings. Amounts are in the smallest currency unit (cents for USD, cents for ZAR).</p>

        <div style={s.rule} />

        <h2 style={{ ...s.h2, marginTop: 0 }}>Endpoints</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {endpoints.map(ep => (
            <div key={ep.path} style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.025)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={method(ep.method)}>{ep.method}</span>
                <code style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{ep.path}</code>
              </div>
              <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, margin: 0 }}>{ep.desc}</p>
            </div>
          ))}
        </div>

        <div style={s.rule} />

        <h2 style={{ ...s.h2, marginTop: 0 }}>Error codes</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {errors.map(e => (
            <div key={e.code} style={{ display: 'grid', gridTemplateColumns: '48px 180px 1fr', gap: '16px', alignItems: 'center', padding: '12px 20px', background: 'rgba(255,255,255,0.025)', borderRadius: '10px' }}>
              <code style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'rgba(220,80,80,0.7)' }}>{e.code}</code>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>{e.title}</span>
              <span style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>{e.desc}</span>
            </div>
          ))}
        </div>

        <div style={s.rule} />

        <h2 style={{ ...s.h2, marginTop: 0 }}>Rate limits</h2>
        <p style={s.body}>Rate limits are applied per API key. The current limit is returned in every response as <span style={s.code}>X-RateLimit-Limit</span>, <span style={s.code}>X-RateLimit-Remaining</span>, and <span style={s.code}>X-RateLimit-Reset</span> headers. On 429 errors, respect the <span style={s.code}>Retry-After</span> value.</p>

        <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '14px', color: 'rgba(255,255,255,0.3)', marginTop: '32px' }}>
          Questions? <a href="/contact" style={{ color: 'rgba(91,148,210,0.7)', textDecoration: 'none' }}>Contact support</a> or email <a href="mailto:support@clive.dev" style={{ color: 'rgba(91,148,210,0.7)', textDecoration: 'none' }}>support@clive.dev</a>.
        </p>
      </div>
    </main>
  );
}
