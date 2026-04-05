export const metadata = { title: 'Security — Clive', description: 'Clive security policy and responsible disclosure.' };

const prose: React.CSSProperties = { fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.85, marginBottom: '20px' };
const h2style: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '28px', color: 'white', marginBottom: '12px', marginTop: '48px' };
const rule: React.CSSProperties = { height: '1px', background: 'rgba(255,255,255,0.07)', margin: '48px 0' };

const practices = [
  { label: 'Encryption in transit', detail: 'TLS 1.3 enforced on all endpoints. HTTP redirects to HTTPS. HSTS preloaded.' },
  { label: 'Encryption at rest', detail: 'All database fields containing personal data encrypted using AES-256.' },
  { label: 'API key storage', detail: 'Keys hashed with bcrypt (cost 12) on issue. Plaintext never stored or logged.' },
  { label: 'Authentication', detail: 'Firebase Authentication with email/password. Passwords never handled by Clive servers.' },
  { label: 'Rate limiting', detail: 'Per-key rate limits enforced at gateway layer. Burst limits prevent credential stuffing.' },
  { label: 'Dependency scanning', detail: 'Automated vulnerability scanning on all npm and system dependencies on every deploy.' },
];

export default function SecurityPage() {
  return (
    <main style={{ background: '#07070A', minHeight: '100vh' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '140px 32px 100px' }}>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(91,148,210,0.7)', textTransform: 'uppercase', marginBottom: '16px' }}>Security</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(44px,5vw,64px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.0, marginBottom: '40px' }}>Security policy.</h1>

        <h2 style={{ ...h2style, marginTop: 0 }}>Responsible disclosure</h2>
        <p style={prose}>If you discover a security vulnerability in Clive, please disclose it responsibly. Email full details to <a href="mailto:security@clive.dev" style={{ color: 'rgba(91,148,210,0.8)', textDecoration: 'none' }}>security@clive.dev</a> with a description of the issue, steps to reproduce, and your assessment of impact. Do not publish or share the vulnerability until we have had reasonable time to respond and patch.</p>
        <p style={prose}>We commit to: acknowledging your report within 2 business days, providing a status update within 7 days, and notifying you when the issue is resolved. We do not operate a paid bug bounty programme at this time, but we recognise responsible reporters publicly with their consent.</p>

        <div style={rule} />

        <h2 style={{ ...h2style, marginTop: 0 }}>Security practices</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '32px' }}>
          {practices.map(p => (
            <div key={p.label} style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.025)', borderRadius: '10px' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9.5px', letterSpacing: '0.1em', color: 'rgba(91,148,210,0.7)', textTransform: 'uppercase', marginBottom: '6px' }}>{p.label}</div>
              <div style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '13.5px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>{p.detail}</div>
            </div>
          ))}
        </div>

        <div style={rule} />

        <h2 style={{ ...h2style, marginTop: 0 }}>Scope</h2>
        <p style={prose}>In-scope for disclosure: clive.dev and all subdomains, API gateway endpoints, developer dashboard, provider console. Out of scope: social engineering attacks, physical attacks, third-party services (Firebase, PayPal, Stitch), denial of service attacks.</p>

        <h2 style={h2style}>What not to do</h2>
        <p style={prose}>Do not attempt to access, modify, or delete data belonging to other users. Do not perform automated scanning at scale against production systems. Do not disrupt service availability. Testing should be limited to your own account and test environments.</p>

        <h2 style={h2style}>Contact</h2>
        <p style={{ ...prose, marginBottom: 0 }}>Security reports: <a href="mailto:security@clive.dev" style={{ color: 'rgba(91,148,210,0.8)', textDecoration: 'none' }}>security@clive.dev</a>. For non-security issues: <a href="/contact" style={{ color: 'rgba(91,148,210,0.8)', textDecoration: 'none' }}>Contact page</a>.</p>
      </div>
    </main>
  );
}
