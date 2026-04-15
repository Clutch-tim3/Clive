import Link from 'next/link';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sell Your API — Become a Clive Provider',
  description:
    'List and monetise your API on the Clive marketplace. ' +
    'Reach South African and global developers. ' +
    'Keep 88% of every transaction. Free listing. 24-hour review.',
  keywords: [
    'sell API',
    'API monetisation',
    'list API marketplace',
    'developer API business',
    'API revenue South Africa',
    'become API provider',
  ],
  alternates: { canonical: '/sell' },
};

export default function SellPage() {
  return (
    <div style={{ background: '#07070A', color: 'white', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 48px 80px', position: 'relative', overflow: 'hidden', backgroundImage: 'linear-gradient(rgba(27,48,91,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(27,48,91,0.06) 1px,transparent 1px)', backgroundSize: '52px 52px' }}>
        {/* Background orbs */}
        <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(27,48,91,0.22)', filter: 'blur(90px)', right: '-200px', top: '-100px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(91,148,210,0.06)', filter: 'blur(70px)', left: '-100px', bottom: '-80px', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '760px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(27,48,91,0.4)', border: '1px solid rgba(91,148,210,0.2)', borderRadius: '100px', fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.8)', marginBottom: '32px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(91,148,210,0.8)' }} />
            Provider programme · Open now
          </div>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(48px,6vw,80px)', letterSpacing: '-0.03em', lineHeight: 1.0, color: 'white', marginBottom: '24px' }}>
            Turn your API into<br />a revenue stream.
          </h1>

          <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '18px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto 44px' }}>
            List your API on Clive and reach thousands of developers. We handle billing, keys, and usage tracking. You just build.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth?screen=signup" style={{ padding: '16px 36px', background: '#1B305B', border: '1px solid rgba(91,148,210,0.35)', borderTop: '1.5px solid rgba(91,148,210,0.55)', borderRadius: '100px', fontFamily: 'DM Mono, monospace', fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'white', textDecoration: 'none', boxShadow: '0 4px 24px rgba(27,48,91,0.5)', transition: 'all 0.2s', display: 'inline-block' }}>
              Start selling
            </Link>
            <Link href="/console" style={{ padding: '16px 36px', background: 'transparent', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: '100px', fontFamily: 'DM Mono, monospace', fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'all 0.2s', display: 'inline-block' }}>
              Open console →
            </Link>
          </div>

          <div style={{ marginTop: '22px', fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)' }}>
            Free to list · No upfront costs · Paid monthly via Stripe
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', padding: '40px 48px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '32px' }}>
          {[
            { value: '$124K+', label: 'Total provider payouts' },
            { value: '38', label: 'Active providers' },
            { value: '10K+', label: 'Developer subscribers' },
            { value: '80%', label: 'Revenue share to you' },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '42px', color: 'white', lineHeight: 1 }}>{value}</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginTop: '8px', textTransform: 'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '100px 48px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.6)', marginBottom: '16px' }}>How it works</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(36px,4vw,56px)', letterSpacing: '-0.025em', color: 'white' }}>
            List your first API in under 10 minutes.
          </h2>
        </div>

        <style>{`@media(max-width:768px){.sell-3col{grid-template-columns:1fr!important;}.sell-2col{grid-template-columns:1fr!important;}}`}</style>
        <div className="sell-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {[
            {
              num: '01',
              icon: 'define',
              title: 'Define your product',
              body: 'Add your API name, description, base URL, and endpoints. Paste an OpenAPI spec or add them manually. Takes about 3 minutes.',
            },
            {
              num: '02',
              icon: 'review',
              title: 'Set your pricing',
              body: 'Create free and paid tiers. Set call limits and monthly prices. We recommend a free tier — it drives 4× more conversions.',
            },
            {
              num: '03',
              icon: 'earn',
              title: 'Go live & earn',
              body: 'Submit for a 24-hour review. Once approved your API is listed on Clive. Payouts land in your Stripe account on the 15th.',
            },
          ].map(({ num, icon, title, body }) => (
            <div key={num} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '36px 32px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '24px', right: '28px', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.1)', letterSpacing: '0.1em' }}>{num}</div>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(27,48,91,0.5)', border: '1px solid rgba(91,148,210,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                {icon === 'define' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(91,148,210,0.8)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9 12h6M12 9v6"/></svg>}
                {icon === 'review' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(91,148,210,0.8)" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-5"/></svg>}
                {icon === 'earn' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(91,148,210,0.8)" strokeWidth="1.5"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>}
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: '22px', color: 'white', marginBottom: '12px' }}>{title}</h3>
              <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Revenue model */}
      <section style={{ padding: '80px 48px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="sell-2col" style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.6)', marginBottom: '16px' }}>Revenue model</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(32px,3.5vw,48px)', letterSpacing: '-0.025em', color: 'white', marginBottom: '20px', lineHeight: 1.1 }}>
              88% of every subscription goes to you.
            </h2>
            <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '15px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
              Clive takes a 12% platform fee to cover infrastructure, billing, discovery, and support. No setup fees, no monthly charges. You only pay when you earn.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { tier: 'Free tier', price: '$0', payout: '$0', calls: '500 calls/mo', note: 'Drives discovery' },
              { tier: 'Basic tier', price: '$9/mo', payout: '$7.92/mo', calls: '5,000 calls/mo', note: 'Per subscriber' },
              { tier: 'Pro tier', price: '$29/mo', payout: '$25.52/mo', calls: '50,000 calls/mo', note: 'Per subscriber' },
            ].map(({ tier, price, payout, calls, note }) => (
              <div key={tier} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>{tier}</div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{calls} · {note}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '22px', color: 'white' }}>{payout}</div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.25)' }}>you earn · {price} list price</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section style={{ padding: '100px 48px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(32px,4vw,52px)', letterSpacing: '-0.025em', color: 'white' }}>
            Everything you need to sell.
          </h2>
        </div>
        <div className="sell-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {[
            { icon: '🔑', title: 'API key management', body: 'Clive issues and rotates keys for every subscriber. Zero infrastructure work on your end.' },
            { icon: '📊', title: 'Usage analytics', body: 'Real-time call counts, latency percentiles, error rates, and top consumers — all in your console.' },
            { icon: '💳', title: 'Stripe payouts', body: 'Monthly payouts to your Stripe account. W-9 handling, tax docs, and payout history included.' },
            { icon: '🛡', title: 'Rate limiting', body: 'We enforce your tier limits automatically. Overages blocked or billed — your choice per tier.' },
            { icon: '📖', title: 'Auto documentation', body: 'A public API docs page is generated from your endpoint definitions. No extra work needed.' },
            { icon: '🔔', title: 'Subscriber alerts', body: 'Get notified for new subscribers, churn, usage spikes, and error rate anomalies.' },
          ].map(({ icon, title, body }) => (
            <div key={title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '28px 24px' }}>
              <div style={{ fontSize: '24px', marginBottom: '14px' }}>{icon}</div>
              <h3 style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', letterSpacing: '0.04em', color: 'white', marginBottom: '10px' }}>{title}</h3>
              <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '13px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.65 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '100px 48px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(27,48,91,0.06)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(27,48,91,0.25)', filter: 'blur(100px)', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(40px,5vw,68px)', letterSpacing: '-0.03em', color: 'white', marginBottom: '20px', lineHeight: 1.05 }}>
            Ready to list your<br />first API?
          </h2>
          <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '16px', color: 'rgba(255,255,255,0.4)', marginBottom: '44px', lineHeight: 1.65 }}>
            Join 38 providers already earning on Clive.<br />Free to list. No credit card required.
          </p>
          <Link href="/auth?screen=signup" style={{ display: 'inline-block', padding: '18px 48px', background: '#1B305B', border: '1px solid rgba(91,148,210,0.4)', borderTop: '1.5px solid rgba(91,148,210,0.6)', borderRadius: '100px', fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'white', textDecoration: 'none', boxShadow: '0 8px 32px rgba(27,48,91,0.6)', transition: 'all 0.2s' }}>
            List your API in 10 minutes →
          </Link>
          <div style={{ marginTop: '20px', fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.18)' }}>
            Questions? <a href="mailto:providers@clive.dev" style={{ color: 'rgba(91,148,210,0.55)', textDecoration: 'none' }}>providers@clive.dev</a>
          </div>
        </div>
      </section>

    </div>
  );
}
