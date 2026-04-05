export const metadata = { title: 'Changelog — Clive', description: 'What\'s new in Clive.' };

const s = {
  kicker: { fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(91,148,210,0.7)', textTransform: 'uppercase' as const, marginBottom: '16px' },
  h1: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(44px,5vw,64px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.0, marginBottom: '24px' },
  tag: (color: string) => ({ fontFamily: 'DM Mono, monospace', fontSize: '8.5px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '3px 8px', borderRadius: '4px', color, border: `1px solid ${color}`, opacity: 0.85 }),
  body: { fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic' as const, fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8 },
};

const tagColors: Record<string, string> = {
  new: 'rgba(80,200,120,0.8)',
  improvement: 'rgba(91,148,210,0.8)',
  fix: 'rgba(220,150,80,0.8)',
  launch: 'rgba(180,120,220,0.8)',
};

const releases = [
  {
    version: 'v1.0.0',
    date: 'April 2026',
    headline: 'Public launch.',
    items: [
      { tag: 'launch', text: 'Clive is now open to all developers. Sign up and get 500 free API calls per month on every product.' },
      { tag: 'launch', text: 'Provider Console live — any developer can list and monetise their own API on the marketplace.' },
      { tag: 'new', text: 'Thirteen production APIs available at launch: ZAR Intelligence, Tender Monitor, DocSeal, HackKit, ProxyNet, VerifyID, and seven more.' },
      { tag: 'new', text: 'Stitch integration for South African bank payment processing. PayPal available for international providers.' },
      { tag: 'new', text: 'Webhook delivery system with retry logic, delivery logs, and per-endpoint signing keys.' },
      { tag: 'new', text: 'API Testing Sandbox — run live requests against any endpoint without leaving the dashboard.' },
      { tag: 'improvement', text: 'Unified credential system: one API key grants access to every product your account is subscribed to.' },
    ],
  },
  {
    version: 'v0.9.0',
    date: 'March 2026',
    headline: 'Private beta.',
    items: [
      { tag: 'new', text: 'Closed beta launched to 200 invited developers and 12 API providers.' },
      { tag: 'new', text: 'Dashboard analytics: usage charts, per-endpoint breakdown, error rate tracking.' },
      { tag: 'new', text: 'Developer onboarding wizard — first API key generated in under 60 seconds.' },
      { tag: 'improvement', text: 'Reduced API gateway latency by 40% via regional edge caching.' },
      { tag: 'fix', text: 'Fixed race condition in rate-limit enforcement that could allow brief over-quota requests.' },
      { tag: 'fix', text: 'Corrected currency formatting for ZAR amounts in invoice PDFs.' },
    ],
  },
  {
    version: 'v0.5.0',
    date: 'January 2026',
    headline: 'Internal alpha.',
    items: [
      { tag: 'new', text: 'First internal build of Clive with 4 prototype APIs and a basic developer portal.' },
      { tag: 'new', text: 'Core infrastructure: API gateway, key management, usage metering, and billing pipeline.' },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main style={{ background: '#07070A', minHeight: '100vh' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '140px 32px 100px' }}>
        <p style={s.kicker}>Changelog</p>
        <h1 style={s.h1}>What's new.</h1>
        <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '15px', color: 'rgba(255,255,255,0.35)', marginBottom: '64px', lineHeight: 1.75 }}>
          Every release, documented.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
          {releases.map((rel, i) => (
            <div key={rel.version} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '40px', alignItems: 'start' }}>
              <div style={{ position: 'sticky', top: '100px' }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', color: 'white', marginBottom: '4px' }}>{rel.version}</div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em' }}>{rel.date}</div>
              </div>
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '32px', color: 'white', marginBottom: '20px', marginTop: 0, lineHeight: 1 }}>{rel.headline}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {rel.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <span style={s.tag(tagColors[item.tag])}>{item.tag}</span>
                      <p style={{ ...s.body, marginBottom: 0, flex: 1 }}>{item.text}</p>
                    </div>
                  ))}
                </div>
                {i < releases.length - 1 && <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginTop: '48px' }} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
