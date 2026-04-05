export const metadata = { title: 'Terms of Service — Clive', description: 'Clive terms of service.' };

const prose: React.CSSProperties = { fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.85, marginBottom: '20px' };
const h2style: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '28px', color: 'white', marginBottom: '12px', marginTop: '48px' };
const rule: React.CSSProperties = { height: '1px', background: 'rgba(255,255,255,0.07)', margin: '48px 0' };

export default function TermsPage() {
  return (
    <main style={{ background: '#07070A', minHeight: '100vh' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '140px 32px 100px' }}>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(91,148,210,0.7)', textTransform: 'uppercase', marginBottom: '16px' }}>Legal</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(44px,5vw,64px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.0, marginBottom: '16px' }}>Terms of Service</h1>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginBottom: '48px' }}>Last updated: April 2026</p>

        <h2 style={{ ...h2style, marginTop: 0 }}>1. Acceptance</h2>
        <p style={prose}>By creating an account or using any Clive service, you agree to these Terms of Service. If you do not agree, do not use the platform. These terms are governed by the laws of the Republic of South Africa.</p>

        <h2 style={h2style}>2. Services</h2>
        <p style={prose}>Clive provides access to developer APIs, a product marketplace, and a provider console. Features and pricing are subject to change with 30 days' notice. We will notify registered users by email of material changes.</p>

        <div style={rule} />

        <h2 style={{ ...h2style, marginTop: 0 }}>3. Provider terms</h2>
        <p style={prose}>By submitting a product for listing, providers agree to Clive's 12% platform fee on all paid subscription transactions. The provider receives 88% of all subscription revenue, paid monthly via Stripe. Clive retains the right to reject any product that does not meet the API Standards outlined at <a href="/docs/api" style={{ color: 'rgba(91,148,210,0.8)', textDecoration: 'none' }}>clive.dev/docs/api</a>. Providers are solely responsible for the reliability, accuracy, and legal compliance of their APIs.</p>

        <h2 style={h2style}>4. Consumer terms</h2>
        <p style={prose}>API access is for your own applications and internal use. Fair use applies — automated bulk requests designed to circumvent rate limits are prohibited. You may not reverse engineer, resell, or sublicense API access without written authorisation from Clive.</p>

        <h2 style={h2style}>5. Prohibited use</h2>
        <p style={prose}>You may not use Clive services for: scraping at scale, illegal surveillance, generating spam, attacks on infrastructure, or any activity prohibited under South African law including the Electronic Communications and Transactions Act.</p>

        <div style={rule} />

        <h2 style={{ ...h2style, marginTop: 0 }}>6. Limitation of liability</h2>
        <p style={prose}>To the maximum extent permitted by the South African Consumer Protection Act, Clive's total liability for any claim arising from use of the platform is limited to the amount you paid in the 30 days preceding the claim. We are not liable for indirect, consequential, or incidental damages.</p>

        <h2 style={h2style}>7. Governing law</h2>
        <p style={{ ...prose, marginBottom: 0 }}>These terms are governed by the laws of the Republic of South Africa. Disputes shall be subject to the jurisdiction of the courts of South Africa. For questions: <a href="mailto:legal@clive.dev" style={{ color: 'rgba(91,148,210,0.8)', textDecoration: 'none' }}>legal@clive.dev</a>.</p>
      </div>
    </main>
  );
}
