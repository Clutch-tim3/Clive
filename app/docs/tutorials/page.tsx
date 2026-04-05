export const metadata = { title: 'Tutorials — Clive', description: 'Clive developer tutorials and guides.' };

const s = {
  kicker: { fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(91,148,210,0.7)', textTransform: 'uppercase' as const, marginBottom: '16px' },
  h1: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(44px,5vw,64px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.0, marginBottom: '24px' },
};

const tutorials = [
  {
    number: '01',
    title: 'Build a live currency converter with ZAR Intelligence',
    desc: 'Connect to the ZAR Intelligence API, display live exchange rates in a React app, and handle stale-cache fallbacks gracefully.',
    tags: ['React', 'Node.js', 'ZAR Intelligence'],
    time: '20 min',
  },
  {
    number: '02',
    title: 'Automate tender monitoring with email alerts',
    desc: 'Use the Tender Monitor API and GitHub Actions to scrape daily tender results, filter by keyword and province, and email a digest.',
    tags: ['Python', 'GitHub Actions', 'Tender Monitor'],
    time: '30 min',
  },
  {
    number: '03',
    title: 'Generate and verify signed documents with DocSeal',
    desc: 'Fill a PDF template, apply a digital signature via DocSeal, and verify the document integrity on the other side.',
    tags: ['Node.js', 'DocSeal', 'PDFs'],
    time: '25 min',
  },
];

export default function TutorialsPage() {
  return (
    <main style={{ background: '#07070A', minHeight: '100vh' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '140px 32px 100px' }}>
        <p style={s.kicker}>Documentation</p>
        <h1 style={s.h1}>Tutorials.</h1>
        <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '15px', color: 'rgba(255,255,255,0.4)', marginBottom: '64px', lineHeight: 1.75 }}>
          Step-by-step guides to help you integrate Clive APIs into real projects.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tutorials.map(t => (
            <div key={t.number} style={{ padding: '32px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '24px', right: '28px', fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em' }}>{t.time}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '48px', color: 'rgba(255,255,255,0.06)', lineHeight: 1, marginBottom: '16px', userSelect: 'none' }}>{t.number}</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '26px', color: 'white', marginBottom: '12px', marginTop: 0, lineHeight: 1.2 }}>{t.title}</h2>
              <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '13.5px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.75, marginBottom: '20px' }}>{t.desc}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {t.tags.map(tag => (
                  <span key={tag} style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.1em', padding: '3px 8px', borderRadius: '4px', color: 'rgba(91,148,210,0.7)', border: '1px solid rgba(91,148,210,0.2)', textTransform: 'uppercase' }}>{tag}</span>
                ))}
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '9px 18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', cursor: 'not-allowed', opacity: 0.5 }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9.5px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Coming soon</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '64px', padding: '32px', background: 'rgba(91,148,210,0.05)', border: '1px solid rgba(91,148,210,0.15)', borderRadius: '16px', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '26px', color: 'white', marginBottom: '10px', marginTop: 0 }}>More tutorials on the way.</p>
          <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '13.5px', color: 'rgba(255,255,255,0.35)', marginBottom: '20px', lineHeight: 1.7 }}>
            Suggest a topic or contribute a guide at <a href="mailto:support@clive.dev" style={{ color: 'rgba(91,148,210,0.7)', textDecoration: 'none' }}>support@clive.dev</a>.
          </p>
          <a href="/docs/api" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: '100px', background: '#1B305B', border: '1px solid rgba(91,148,210,0.35)', color: 'white', fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
            View API Reference
          </a>
        </div>
      </div>
    </main>
  );
}
