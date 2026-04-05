export const metadata = { title: 'Privacy Policy — Clive', description: 'How Clive collects, uses, and protects your data.' };

const prose: React.CSSProperties = { fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.85, marginBottom: '20px' };
const h2style: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '28px', color: 'white', marginBottom: '12px', marginTop: '48px' };
const rule: React.CSSProperties = { height: '1px', background: 'rgba(255,255,255,0.07)', margin: '48px 0' };

export default function PrivacyPage() {
  return (
    <main style={{ background: '#07070A', minHeight: '100vh' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '140px 32px 100px' }}>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(91,148,210,0.7)', textTransform: 'uppercase', marginBottom: '16px' }}>Legal</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(44px,5vw,64px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.0, marginBottom: '16px' }}>Privacy Policy</h1>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginBottom: '48px' }}>Last updated: April 2026</p>

        <h2 style={{ ...h2style, marginTop: 0 }}>1. What we collect</h2>
        <p style={prose}>We collect your name and email address when you create an account. If you subscribe to a paid plan we collect payment information, which is processed by PayPal or Stitch — Clive never stores full card or bank account details. We also collect API usage logs (endpoint, timestamp, response code, latency) to operate the service and enforce rate limits.</p>

        <h2 style={h2style}>2. How we use it</h2>
        <p style={prose}>Your data is used to deliver the service, authenticate your sessions, enforce usage quotas, detect abuse, and generate aggregated analytics visible in your dashboard. We do not sell your data or use it for advertising.</p>

        <h2 style={h2style}>3. Third parties</h2>
        <p style={prose}>We share data only with Firebase (authentication and database), PayPal (payment processing), and Stitch (South African payment processing). No advertising networks, data brokers, or analytics resellers receive your data.</p>

        <div style={rule} />

        <h2 style={{ ...h2style, marginTop: 0 }}>4. Data retention</h2>
        <p style={prose}>API keys are hashed with bcrypt and never stored in plaintext. Usage logs are retained for 90 days then deleted. Personal data (name, email) is retained for the lifetime of your account. You may request deletion at any time.</p>

        <h2 style={h2style}>5. Your rights</h2>
        <p style={prose}>You have the right to access, correct, export, or delete your personal data. To exercise these rights, email <a href="mailto:privacy@clive.dev" style={{ color: 'rgba(91,148,210,0.8)', textDecoration: 'none' }}>privacy@clive.dev</a>. We will respond within 30 days.</p>

        <h2 style={h2style}>6. Contact</h2>
        <p style={{ ...prose, marginBottom: 0 }}>Data controller: Donington Vale (Pty) Ltd, South Africa. Privacy enquiries: <a href="mailto:privacy@clive.dev" style={{ color: 'rgba(91,148,210,0.8)', textDecoration: 'none' }}>privacy@clive.dev</a>.</p>
      </div>
    </main>
  );
}
