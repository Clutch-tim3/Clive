'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

export function HackKitSpotlight() {
  const terminalRef = useRef<HTMLDivElement>(null);

  // Terminal ticker
  useEffect(() => {
    const HKL = [
      { dir: '→', path: '/v1/recon/domain', status: '200 · 1.2s', sev: '' },
      { dir: '↳', path: '47 subdomains in CT logs', status: '', sev: '' },
      { dir: '↳', path: 'Cloud: AWS (us-east-1)', status: '', sev: '' },
      { dir: '↳', path: '3 attack vectors found', status: '', sev: 'CRITICAL' },
      { dir: '→', path: '/v1/enum/subdomains', status: '200 · 3.4s', sev: '' },
      { dir: '↳', path: 'staging.target.com → Heroku', status: '', sev: 'TAKEOVER' },
      { dir: '↳', path: 'admin.target.com → admin panel', status: '', sev: 'HIGH' },
      { dir: '→', path: '/v1/vuln/correlate', status: '200 · 0.8s', sev: '' },
      { dir: '↳', path: 'nginx/1.14.0 · CVE-2019-9511', status: '', sev: 'HIGH' },
      { dir: '↳', path: 'openssh/7.4 · CVE-2018-15473', status: '', sev: 'MED' },
      { dir: '→', path: '/v1/osint/credentials', status: '200 · 0.5s', sev: '' },
      { dir: '↳', path: 'j.smith@target.com — 3 breaches', status: '', sev: 'HIGH' },
      { dir: '→', path: '/v1/intel/synthesise', status: '200 · 4.1s', sev: '' },
      { dir: '↳', path: 'Risk score: 87/100', status: '', sev: 'CRITICAL' },
      { dir: '↳', path: '3 attack paths generated', status: '', sev: '' },
    ];

    let idx = 0;
    const sevColor: Record<string, string> = {
      CRITICAL: 'rgba(91,148,210,0.85)',
      TAKEOVER: 'rgba(91,148,210,0.85)',
      HIGH: 'rgba(91,148,210,0.6)',
      MED: 'rgba(255,255,255,0.35)',
    };

    const tick = () => {
      const term = terminalRef.current;
      if (!term) return;
      const entry = HKL[idx % HKL.length];
      idx++;

      const line = document.createElement('div');
      line.className = 'hk-line';
      line.style.opacity = '0';
      line.style.transition = 'opacity 0.2s';

      const isPost = entry.path.startsWith('/v1/');
      if (isPost) {
        line.innerHTML = `
          <span class="hk-m" style="color:rgba(91,148,210,0.65)">POST</span>
          <span style="color:rgba(255,255,255,0.6)">${entry.path}</span>
          <span style="color:rgba(27,48,91,0.55);margin-left:auto">${entry.status}</span>`;
      } else {
        const sc = entry.sev ? sevColor[entry.sev] || 'rgba(255,255,255,0.3)' : '';
        line.innerHTML = `
          <span class="hk-m" style="color:rgba(27,48,91,0.55)">${entry.dir}</span>
          <span style="color:rgba(255,255,255,0.42)">${entry.path}</span>
          ${entry.sev ? `<span style="color:${sc};margin-left:auto;font-size:9px">${entry.sev}</span>` : ''}`;
      }

      term.appendChild(line);
      requestAnimationFrame(() => { line.style.opacity = '1'; });

      if (term.children.length > 5) {
        const oldest = term.children[0] as HTMLElement;
        oldest.style.opacity = '0';
        setTimeout(() => { if (oldest.parentNode === term) term.removeChild(oldest); }, 200);
      }
    };

    const timer = setInterval(tick, 1700);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hackkit-section">
      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(27,48,91,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(27,48,91,0.06) 1px,transparent 1px)',
        backgroundSize: '52px 52px',
      }} />
      {/* Radial glow */}
      <div style={{
        position: 'absolute', zIndex: 0, pointerEvents: 'none',
        width: '800px', height: '800px', borderRadius: '50%',
        background: 'radial-gradient(circle,rgba(27,48,91,0.2) 0%,transparent 65%)',
        right: '-200px', top: '50%', transform: 'translateY(-50%)', filter: 'blur(60px)',
      }} />
      {/* Scan line */}
      <div className="hk-scan" style={{
        position: 'absolute', left: 0, right: 0, height: '1px', zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(90deg,transparent,rgba(91,148,210,0.45),transparent)',
        animation: 'scan 5s ease-in-out infinite',
        animationDelay: '1s',
      }} />

      <div className="hk-inner" style={{
        maxWidth: '1300px', margin: '0 auto', padding: '96px 48px',
        display: 'grid', gridTemplateColumns: '1fr 500px', gap: '80px',
        alignItems: 'center', position: 'relative', zIndex: 2,
      }}>
        {/* Left */}
        <div>
          <div className="hk-badge">
            <div className="hk-badge-pip"></div>
            <span>New Product — Just Launched</span>
          </div>

          <div className="hk-eyebrow">Offensive Security</div>

          <h2 className="hk-h2">
            The complete<br />
            <em>hacking kit</em><br />
            for professionals.
          </h2>

          <p className="hk-desc">
            Ten reconnaissance and intelligence capabilities in a single API.
            Domain recon, subdomain takeover detection, CVE correlation, OSINT,
            and AI-synthesised red team reports — for authorised security testing.
          </p>

          <div className="hk-chips">
            {['Domain Recon', 'Subdomain Enum', 'CVE Correlation', 'Credential OSINT', 'AI Synthesis', 'MITRE Mapped'].map(label => (
              <span key={label} className="hk-chip">{label}</span>
            ))}
          </div>

          <div className="hk-actions">
            <Link href="/products/hackkit" className="hk-btn primary">
              Explore HackKit
            </Link>
            <Link href="/docs/hackkit" className="hk-btn ghost">
              View documentation →
            </Link>
          </div>
        </div>

        {/* Right */}
        <div className="hk-visual">
          {/* Radar */}
          <div className="hk-radar">
            <svg viewBox="0 0 280 280">
              <circle cx="140" cy="140" r="120" fill="none" stroke="rgba(27,48,91,0.12)" strokeWidth="1" />
              <circle cx="140" cy="140" r="90"  fill="none" stroke="rgba(27,48,91,0.13)" strokeWidth="1" />
              <circle cx="140" cy="140" r="60"  fill="none" stroke="rgba(27,48,91,0.14)" strokeWidth="1" />
              <circle cx="140" cy="140" r="30"  fill="none" stroke="rgba(27,48,91,0.15)" strokeWidth="1" />
              <line x1="140" y1="20"  x2="140" y2="260" stroke="rgba(27,48,91,0.07)" strokeWidth="1" />
              <line x1="20"  y1="140" x2="260" y2="140" stroke="rgba(27,48,91,0.07)" strokeWidth="1" />
              <line x1="50"  y1="50"  x2="230" y2="230" stroke="rgba(27,48,91,0.10)" strokeWidth="1" />
              <line x1="230" y1="50"  x2="50"  y2="230" stroke="rgba(27,48,91,0.10)" strokeWidth="1" />
              <circle cx="190" cy="95"  r="3"   fill="rgba(27,48,91,0.6)" />
              <circle cx="100" cy="175" r="2"   fill="rgba(27,48,91,0.4)" />
              <circle cx="155" cy="58"  r="2.5" fill="rgba(27,48,91,0.5)" />
              <circle cx="210" cy="155" r="3.5" fill="rgba(27,48,91,0.7)" />
              <circle cx="75"  cy="105" r="4"   fill="rgba(27,48,91,0.8)" />
              <circle cx="75"  cy="105" r="7"   fill="none" stroke="rgba(27,48,91,0.4)" strokeWidth="1" />
              <circle cx="140" cy="140" r="4"   fill="rgba(27,48,91,0.7)" />
              <circle cx="140" cy="140" r="2"   fill="rgba(255,255,255,0.5)" />
              <g className="hk-radar-sweep">
                <defs>
                  <radialGradient id="radarG" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="100%" stopColor="rgba(91,148,210,0.28)" />
                  </radialGradient>
                </defs>
                <path d="M140,140 L140,20 A120,120 0 0,1 225,225 Z" fill="url(#radarG)" />
                <line x1="140" y1="140" x2="140" y2="20" stroke="rgba(91,148,210,0.5)" strokeWidth="1.2" />
              </g>
            </svg>

            {/* Threat tags */}
            <div className="hk-tag t1">
              <span className="hk-sev" style={{ background: 'rgba(27,48,91,0.8)' }}></span>
              <span style={{ color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>CRITICAL</span>
              <span style={{ color: 'rgba(91,148,210,0.6)', marginLeft: '6px' }}>Subdomain takeover</span>
            </div>
            <div className="hk-tag t2">
              <span className="hk-sev" style={{ background: 'rgba(91,148,210,0.7)' }}></span>
              <span style={{ color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>HIGH</span>
              <span style={{ color: 'rgba(91,148,210,0.5)', marginLeft: '6px' }}>CVE-2023-46604</span>
            </div>
            <div className="hk-tag t3">
              <span className="hk-sev" style={{ background: 'rgba(27,48,91,0.5)' }}></span>
              <span style={{ color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>MED</span>
              <span style={{ color: 'rgba(91,148,210,0.45)', marginLeft: '6px' }}>No DMARC policy</span>
            </div>
            <div className="hk-tag t4">
              <span className="hk-sev" style={{ background: 'rgba(27,48,91,0.3)' }}></span>
              <span style={{ color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>INFO</span>
              <span style={{ color: 'rgba(91,148,210,0.4)', marginLeft: '6px' }}>47 subdomains found</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="hk-stats">
            <div className="hk-stat">
              <div className="hk-stat-n">10</div>
              <div className="hk-stat-l">Endpoints</div>
            </div>
            <div className="hk-stat">
              <div className="hk-stat-n">14</div>
              <div className="hk-stat-l">MITRE tactics</div>
            </div>
            <div className="hk-stat">
              <div className="hk-stat-n">60%</div>
              <div className="hk-stat-l">Cost reduction</div>
            </div>
          </div>

          {/* Terminal */}
          <div className="hk-terminal">
            <div className="hk-terminal-bar">
              <div className="hk-tb-dot"></div>
              <div className="hk-tb-dot"></div>
              <div className="hk-tb-dot"></div>
              <span className="hk-tb-title">hackkit · live recon</span>
            </div>
            <div ref={terminalRef} className="hk-terminal-body"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
