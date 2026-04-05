export const metadata = { title: 'Status — Clive', description: 'Clive platform status and uptime.' };

const s = {
  kicker: { fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(91,148,210,0.7)', textTransform: 'uppercase' as const, marginBottom: '16px' },
  h1: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(44px,5vw,64px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.0, marginBottom: '24px' },
  h2: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '28px', color: '#fff', marginBottom: '16px', marginTop: '48px' },
  mono: { fontFamily: 'DM Mono, monospace' } as const,
  rule: { height: '1px', background: 'rgba(255,255,255,0.07)', margin: '40px 0' },
};

const services = [
  { name: 'API Gateway', latency: '18ms', uptime: '99.99%' },
  { name: 'Authentication', latency: '24ms', uptime: '100%' },
  { name: 'ZAR Intelligence', latency: '31ms', uptime: '99.97%' },
  { name: 'Tender Monitor', latency: '42ms', uptime: '99.95%' },
  { name: 'DocSeal', latency: '55ms', uptime: '99.98%' },
  { name: 'HackKit', latency: '12ms', uptime: '100%' },
  { name: 'ProxyNet', latency: '9ms', uptime: '100%' },
  { name: 'VerifyID', latency: '38ms', uptime: '99.96%' },
  { name: 'Webhook Delivery', latency: '14ms', uptime: '99.99%' },
  { name: 'Developer Dashboard', latency: '22ms', uptime: '100%' },
  { name: 'Provider Console', latency: '27ms', uptime: '100%' },
];

const incidents = [
  { date: 'Mar 28 2026', title: 'Resolved — Tender Monitor elevated latency', body: 'Between 14:12 and 15:44 UTC, Tender Monitor experienced elevated response times (p99 ~820ms) due to a database index rebuild. All requests were served; no data loss. Latency returned to normal at 15:44 UTC.', severity: 'minor' },
];

export default function StatusPage() {
  return (
    <main style={{ background: '#07070A', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '140px 32px 100px' }}>
        <p style={s.kicker}>Platform Status</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <h1 style={{ ...s.h1, marginBottom: 0 }}>All systems</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(80,200,120,0.1)', border: '1px solid rgba(80,200,120,0.25)', borderRadius: '100px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#50C878', boxShadow: '0 0 6px rgba(80,200,120,0.8)' }} />
            <span style={{ ...s.mono, fontSize: '10px', color: 'rgba(80,200,120,0.9)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Operational</span>
          </div>
        </div>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginBottom: '48px' }}>Last checked: April 4, 2026 — 09:00 UTC</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {services.map(svc => (
            <div key={svc.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: 'rgba(255,255,255,0.025)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#50C878', flexShrink: 0 }} />
                <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '14px', color: 'rgba(255,255,255,0.75)' }}>{svc.name}</span>
              </div>
              <div style={{ display: 'flex', gap: '32px' }}>
                <span style={{ ...s.mono, fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>{svc.latency} avg</span>
                <span style={{ ...s.mono, fontSize: '10px', color: 'rgba(80,200,120,0.7)', letterSpacing: '0.05em' }}>{svc.uptime} uptime</span>
              </div>
            </div>
          ))}
        </div>

        <div style={s.rule} />

        <h2 style={{ ...s.h2, marginTop: 0 }}>90-day uptime</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '48px' }}>
          {[
            { label: 'API Gateway', pct: 99.99 },
            { label: 'All services avg', pct: 99.98 },
            { label: 'Webhook delivery', pct: 99.99 },
          ].map(({ label, pct }) => (
            <div key={label} style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '36px', color: 'white', lineHeight: 1 }}>{pct}%</div>
              <div style={{ ...s.mono, fontSize: '9px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginTop: '6px', textTransform: 'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>

        <h2 style={{ ...s.h2, marginTop: 0 }}>Incident history</h2>
        {incidents.map(inc => (
          <div key={inc.title} style={{ padding: '20px 24px', background: 'rgba(255,180,0,0.05)', border: '1px solid rgba(255,180,0,0.15)', borderRadius: '12px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ ...s.mono, fontSize: '9px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.05em' }}>{inc.date}</span>
              <span style={{ padding: '2px 8px', background: 'rgba(255,180,0,0.1)', border: '1px solid rgba(255,180,0,0.2)', borderRadius: '4px', ...s.mono, fontSize: '8px', color: 'rgba(255,180,0,0.7)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Minor</span>
            </div>
            <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>{inc.title}</div>
            <div style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>{inc.body}</div>
          </div>
        ))}
        <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '13px', color: 'rgba(255,255,255,0.2)', marginTop: '16px' }}>No other incidents in the past 90 days.</p>
      </div>
    </main>
  );
}
