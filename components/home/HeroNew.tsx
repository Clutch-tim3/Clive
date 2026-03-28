'use client';
import Link from 'next/link';
import React, { useEffect } from 'react';

function buildSaturn(container: HTMLElement) {
  const W = 480, H = 260;
  const cx = W / 2, cy = H / 2 + 10;
  const pr = 68; // planet radius
  const rx1 = 148, ry1 = 28; // main ring
  const rx2 = 120, ry2 = 22;
  const rx3 = 180, ry3 = 34;

  const stars = Array.from({ length: 55 }, (_, i) => {
    const x = Math.round(Math.random() * W);
    const y = Math.round(Math.random() * H);
    const r = (Math.random() * 1.2 + 0.4).toFixed(1);
    const delay = (Math.random() * 4).toFixed(1);
    const dur = (2.5 + Math.random() * 3).toFixed(1);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,255,255,${(0.15 + Math.random() * 0.55).toFixed(2)})" style="animation:star-twinkle ${dur}s ease-in-out ${delay}s infinite"/>`;
  }).join('');

  const ringStyle = 'fill:none;stroke-dasharray:6 3;animation:dash-flow 3s linear infinite';
  const ringFront = (rx: number, ry: number, col: string, sd: string) =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" style="${ringStyle};stroke:${col};stroke-width:1.2;animation-delay:${sd}"/>`;

  const svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
<defs>
  <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <style>
    @keyframes star-twinkle{0%,100%{opacity:.2;transform:scale(.7)}50%{opacity:1;transform:scale(1.3)}}
    @keyframes dash-flow{to{stroke-dashoffset:-18}}
  </style>
</defs>
${stars}
<ellipse cx="${cx}" cy="${cy}" rx="${rx3}" ry="${ry3}" fill="none" stroke="rgba(27,48,91,0.55)" stroke-width="1.5" stroke-dasharray="6 3" style="animation:dash-flow 4s linear infinite"/>
<ellipse cx="${cx}" cy="${cy}" rx="${rx1}" ry="${ry1}" fill="none" stroke="rgba(91,148,210,0.45)" stroke-width="1.4" stroke-dasharray="6 3" style="animation:dash-flow 3s linear infinite"/>
<ellipse cx="${cx}" cy="${cy}" rx="${rx2}" ry="${ry2}" fill="none" stroke="rgba(27,48,91,0.7)" stroke-width="1.2" stroke-dasharray="4 4" style="animation:dash-flow 3.5s linear infinite reverse"/>
<circle cx="${cx}" cy="${cy}" r="${pr}" fill="#07070A" stroke="rgba(27,48,91,0.9)" stroke-width="1.5" filter="url(#glow)"/>
<ellipse cx="${cx}" cy="${cy - 18}" rx="${pr * 0.85}" ry="${pr * 0.18}" fill="none" stroke="rgba(27,48,91,0.35)" stroke-width="1"/>
<ellipse cx="${cx}" cy="${cy}" rx="${pr * 0.85}" ry="${pr * 0.12}" fill="none" stroke="rgba(27,48,91,0.25)" stroke-width="1"/>
<ellipse cx="${cx}" cy="${cy + 18}" rx="${pr * 0.8}" ry="${pr * 0.15}" fill="none" stroke="rgba(27,48,91,0.2)" stroke-width="1"/>
<path d="M ${cx - rx3} ${cy} A ${rx3} ${ry3} 0 0 1 ${cx + rx3} ${cy}" fill="#07070A"/>
<ellipse cx="${cx}" cy="${cy}" rx="${rx3}" ry="${ry3}" fill="none" stroke="rgba(27,48,91,0.55)" stroke-width="1.5" stroke-dasharray="6 3" style="animation:dash-flow 4s linear infinite" clip-path="inset(0 0 50% 0)"/>
<ellipse cx="${cx}" cy="${cy}" rx="${rx1}" ry="${ry1}" fill="none" stroke="rgba(91,148,210,0.45)" stroke-width="1.4" stroke-dasharray="6 3" style="animation:dash-flow 3s linear infinite" clip-path="inset(0 0 50% 0)"/>
<ellipse cx="${cx}" cy="${cy}" rx="${rx2}" ry="${ry2}" fill="none" stroke="rgba(27,48,91,0.7)" stroke-width="1.2" stroke-dasharray="4 4" style="animation:dash-flow 3.5s linear infinite reverse" clip-path="inset(0 0 50% 0)"/>
<circle cx="${cx}" cy="${cy}" r="${pr}" fill="#07070A" stroke="rgba(27,48,91,0.9)" stroke-width="1.5"/>
</svg>`;

  container.innerHTML = svg;
}

export function HeroNew() {
  useEffect(() => {
    const wrap = document.getElementById('saturnWrap');
    if (wrap) buildSaturn(wrap);
  }, []);

  return (
    <div className="hero min-h-screen pt-32 pb-20 px-12 lg:px-14 relative overflow-hidden bg-black">
      <div className="hero-mesh absolute inset-0 pointer-events-none z-0"></div>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <div className="hero-inner max-w-7xl mx-auto w-full relative" style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: '80px', alignItems: 'center', zIndex: 1 }}>
        {/* Left: headline + CTAs */}
        <div>
          <div className="hero-kicker flex items-center gap-2.5 mb-6">
            <div className="kicker-dot w-4.5 h-4.5 rounded-full bg-navy flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(91,148,210,0.9)', animation: 'badge-live 2s infinite' }}></div>
            </div>
            <span className="text-[10px] font-mono tracking-[0.24em] uppercase" style={{ color: 'rgba(91,148,210,0.8)' }}>
              Developer Platform · 24+ Products
            </span>
          </div>
          <h1 className="hero-h1 font-display mb-6" style={{ fontSize: 'clamp(56px,7.5vw,104px)', color: 'white', letterSpacing: '-0.03em' }}>
            Build<br />with<br />
            <em><span className="neon-word">precision.</span></em>
          </h1>
          <p className="font-serif italic leading-relaxed mb-11 max-w-xl" style={{ fontSize: '17px', color: 'rgba(255,255,255,0.42)' }}>
            APIs, machine learning models, Chrome extensions, and security tools — every product engineered for developers who demand more.
          </p>
          <div className="hero-actions flex gap-3 flex-wrap mb-13">
            <Link
              href="/#products"
              className="btn-glow primary"
            >
              Browse products
            </Link>
            <Link
              href="/docs"
              className="btn-glow ghost"
            >
              Read the docs
            </Link>
          </div>
          <div className="hero-trust flex gap-5 flex-wrap">
            <span className="trust-item">24+ Products</span>
            <span className="trust-sep">·</span>
            <span className="trust-item">3 Marketplaces</span>
            <span className="trust-sep">·</span>
            <span className="trust-item">AWS Marketplace</span>
            <span className="trust-sep">·</span>
            <span className="trust-item">RapidAPI</span>
          </div>
        </div>

        {/* Right: floating glass card */}
        <div className="hero-card">
          <div className="hero-card-top">
            <div id="saturnWrap"></div>
            <div className="hero-card-tag">
              <span className="live-dot"></span>
              Live · v1.0
            </div>
          </div>
          <div className="hero-card-body">
            <div className="hero-card-title">Clive Platform · v1.0</div>
            <div className="hero-card-sub">24 products. One credential. Sub-15ms latency.</div>
            <div className="hero-card-metrics">
              <div className="hcm">
                <div className="hcm-val">24<em>+</em></div>
                <div className="hcm-lbl">Products</div>
              </div>
              <div className="hcm">
                <div className="hcm-val">15<em>ms</em></div>
                <div className="hcm-lbl">p50 latency</div>
              </div>
              <div className="hcm">
                <div className="hcm-val">60<em>%</em></div>
                <div className="hcm-lbl">Below market</div>
              </div>
            </div>
            <Link href="/#products" className="hero-card-cta">
              Browse all products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
