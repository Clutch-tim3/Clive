export const metadata = { title: 'About — Clive', description: 'Clive is an API marketplace built by Donington Vale.' };

const s = {
  kicker: { fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(91,148,210,0.7)', textTransform: 'uppercase' as const, marginBottom: '16px' },
  h1: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(48px,6vw,72px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.0, marginBottom: '24px' },
  h2: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '36px', color: '#fff', marginBottom: '16px', marginTop: '56px' },
  body: { fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic' as const, fontSize: '16px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.85, marginBottom: '24px' },
  rule: { height: '1px', background: 'rgba(255,255,255,0.07)', margin: '48px 0' },
};

export default function AboutPage() {
  return (
    <main style={{ background: '#07070A', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '140px 32px 100px' }}>
        <p style={s.kicker}>About</p>
        <h1 style={s.h1}>Built for those<br />who build.</h1>
        <p style={s.body}>
          Clive is an API marketplace created by Donington Vale. We believe developers should spend time building products, not hunting for reliable, production-ready APIs. Clive gives you thirteen hand-engineered APIs — security, search, finance, documents, tenders — under one credential, one dashboard, one free tier.
        </p>
        <p style={{ ...s.body, marginBottom: 0 }}>
          Every product on Clive is built to production standards: documented, versioned, monitored, and supported. We obsess over latency, reliability, and developer experience so you don't have to.
        </p>
        <div style={s.rule} />
        <h2 style={{ ...s.h2, marginTop: 0 }}>A Donington Vale product.</h2>
        <p style={s.body}>
          Donington Vale is a South African technology company focused on developer infrastructure, government procurement intelligence, and financial tooling for the African market. We build software that works in the real world — including environments with inconsistent connectivity, complex regulatory requirements, and fast-moving markets.
        </p>
        <div style={s.rule} />
        <h2 style={{ ...s.h2, marginTop: 0 }}>The numbers.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginTop: '32px' }}>
          {[
            { value: '13', label: 'Production APIs' },
            { value: '10K+', label: 'Developers' },
            { value: '2026', label: 'Founded' },
          ].map(({ value, label }) => (
            <div key={label} style={{ padding: '28px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '48px', color: 'white', lineHeight: 1 }}>{value}</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginTop: '8px', textTransform: 'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
