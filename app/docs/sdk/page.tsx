export const metadata = { title: 'SDK & Webhooks — Clive', description: 'Clive SDK documentation and webhook integration guide.' };

const s = {
  kicker: { fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(91,148,210,0.7)', textTransform: 'uppercase' as const, marginBottom: '16px' },
  h1: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(44px,5vw,64px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.0, marginBottom: '24px' },
  h2: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '28px', color: '#fff', marginBottom: '16px', marginTop: '48px' },
  body: { fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic' as const, fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginBottom: '16px' },
  codeBlock: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px 24px', marginBottom: '24px', overflowX: 'auto' as const },
  pre: { fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'rgba(91,148,210,0.85)', margin: 0, lineHeight: 1.7 },
  rule: { height: '1px', background: 'rgba(255,255,255,0.07)', margin: '40px 0' },
  inline: { fontFamily: 'DM Mono, monospace', fontSize: '12px', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px', color: 'rgba(91,148,210,0.9)' },
};

const events = [
  { name: 'api.request.completed', desc: 'Fired after every successful API call. Includes product, endpoint, latency, and response code.' },
  { name: 'api.key.created', desc: 'A new API key was issued on your account.' },
  { name: 'api.key.revoked', desc: 'An API key was revoked.' },
  { name: 'subscription.created', desc: 'A new subscription was started (consumer or provider payout).' },
  { name: 'subscription.cancelled', desc: 'A subscription was cancelled.' },
  { name: 'usage.quota_warning', desc: 'Usage has reached 80% of the monthly quota for a product.' },
  { name: 'usage.quota_exceeded', desc: 'Monthly quota exceeded. Requests are now being rejected with 429.' },
  { name: 'payout.completed', desc: 'Provider payout was sent. Includes amount, currency, and reference.' },
];

export default function SdkPage() {
  return (
    <main style={{ background: '#07070A', minHeight: '100vh' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '140px 32px 100px' }}>
        <p style={s.kicker}>Documentation</p>
        <h1 style={s.h1}>SDK & Webhooks.</h1>
        <p style={{ ...s.body, fontSize: '15px', marginBottom: '48px' }}>
          Official SDKs and webhook integration guide. The Node.js SDK is in active development. Until release, use the REST API directly — it's straightforward.
        </p>

        <h2 style={{ ...s.h2, marginTop: 0 }}>Node.js SDK</h2>
        <p style={s.body}>Install via npm:</p>
        <div style={s.codeBlock}>
          <pre style={s.pre}>npm install @clive/sdk</pre>
        </div>
        <p style={s.body}>Quick start:</p>
        <div style={s.codeBlock}>
          <pre style={s.pre}>{`import { Clive } from '@clive/sdk';

const clive = new Clive({ apiKey: process.env.CLIVE_API_KEY });

// Call any product endpoint
const result = await clive.products.zarIntelligence.rate({
  from: 'USD',
  to: 'ZAR',
});

console.log(result.rate); // 18.42`}</pre>
        </div>
        <p style={s.body}>The SDK handles authentication headers, retry logic with exponential backoff, and rate-limit detection automatically.</p>

        <div style={s.rule} />

        <h2 style={{ ...s.h2, marginTop: 0 }}>Python SDK</h2>
        <p style={s.body}>Install via pip:</p>
        <div style={s.codeBlock}>
          <pre style={s.pre}>pip install clive-python</pre>
        </div>
        <div style={s.codeBlock}>
          <pre style={s.pre}>{`from clive import Clive

client = Clive(api_key=os.environ["CLIVE_API_KEY"])

result = client.products.tender_monitor.search(
    keyword="construction",
    province="Gauteng",
)

for tender in result.tenders:
    print(tender.title, tender.closing_date)`}</pre>
        </div>

        <div style={s.rule} />

        <h2 style={{ ...s.h2, marginTop: 0 }}>Webhooks</h2>
        <p style={s.body}>Register a webhook endpoint and Clive will POST events to your URL in real time. Useful for triggering workflows on quota warnings, payout completions, or key rotations.</p>

        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '12px' }}>Register an endpoint</p>
        <div style={s.codeBlock}>
          <pre style={s.pre}>{`POST https://api.clive.dev/v1/webhooks
Authorization: Bearer clive_live_sk_xxx

{
  "url": "https://your-app.com/webhooks/clive",
  "events": ["usage.quota_warning", "payout.completed"],
  "secret": "whsec_your_signing_secret"
}`}</pre>
        </div>

        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '12px' }}>Verify signatures</p>
        <p style={s.body}>Every webhook request includes a <span style={s.inline}>Clive-Signature</span> header. Verify it to confirm the payload came from Clive:</p>
        <div style={s.codeBlock}>
          <pre style={s.pre}>{`import crypto from 'crypto';

function verifyWebhook(payload: string, signature: string, secret: string) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}`}</pre>
        </div>

        <h2 style={s.h2}>Event types</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {events.map(ev => (
            <div key={ev.name} style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.025)', borderRadius: '10px' }}>
              <code style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(91,148,210,0.8)', display: 'block', marginBottom: '6px' }}>{ev.name}</code>
              <span style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{ev.desc}</span>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '14px', color: 'rgba(255,255,255,0.3)', marginTop: '40px' }}>
          SDK issues or questions? <a href="mailto:support@clive.dev" style={{ color: 'rgba(91,148,210,0.7)', textDecoration: 'none' }}>support@clive.dev</a>
        </p>
      </div>
    </main>
  );
}
