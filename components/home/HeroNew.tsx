'use client';
import Link from 'next/link';
import React, { useEffect } from 'react';

export function HeroNew() {
  useEffect(() => {
    const canvas = document.getElementById('heroStars') as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let W: number, H: number;
    let stars: { x: number; y: number; r: number; alpha: number; speed: number; phase: number }[] = [];

    function resize() {
      W = canvas!.width  = canvas!.offsetWidth;
      H = canvas!.height = canvas!.offsetHeight;
    }

    function initStars() {
      stars = [];
      const count = Math.floor((W * H) / 6000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.4 + 0.2,
          alpha: Math.random(),
          speed: Math.random() * 0.008 + 0.003,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    let frame = 0;
    let animId: number;
    function draw() {
      ctx!.clearRect(0, 0, W, H);
      frame++;
      stars.forEach(s => {
        const a = 0.15 + 0.55 * (0.5 + 0.5 * Math.sin(s.phase + frame * s.speed));
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(91,148,210,${a.toFixed(2)})`;
        ctx!.fill();
      });
      animId = requestAnimationFrame(draw);
    }

    resize();
    initStars();
    draw();

    const onResize = () => { resize(); initStars(); };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="hero min-h-screen pt-32 pb-20 px-12 lg:px-14 relative overflow-hidden bg-black">
      <div className="hero-mesh absolute inset-0 pointer-events-none z-0"></div>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
      <canvas id="heroStars" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />

      <div className="hero-inner relative" style={{ display: 'block', maxWidth: '720px', zIndex: 1 }}>
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
          <Link href="/#products" className="btn-glow primary">
            Browse products
          </Link>
          <Link href="/docs" className="btn-glow ghost">
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
    </div>
  );
}
