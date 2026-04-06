'use client';
import React, { useState } from 'react';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';

const MOCK_TLDS: { tld: string; available: boolean; price: string | null }[] = [
  { tld: '.dev',   available: true,  price: 'R180/yr' },
  { tld: '.io',    available: true,  price: 'R580/yr' },
  { tld: '.co.za', available: true,  price: 'R120/yr' },
  { tld: '.app',   available: true,  price: 'R220/yr' },
  { tld: '.com',   available: false, price: null },
  { tld: '.net',   available: true,  price: 'R150/yr' },
  { tld: '.org',   available: true,  price: 'R160/yr' },
];

export default function DomainsPage() {
  const [input, setInput] = useState('');
  const [searched, setSearched] = useState('');
  const [modal, setModal] = useState<{ domain: string; price: string } | null>(null);

  const doSearch = () => {
    const raw = input.trim();
    if (!raw) return;
    const name = raw.replace(/\.[a-z.]+$/, '').toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!name) return;
    setSearched(name);
  };

  return (
    <>
      <Nav />
      <div style={{ minHeight: '100vh', background: '#07070A', paddingTop: '64px' }}>

        {/* Grid mesh */}
        <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(27,48,91,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(27,48,91,0.05) 1px,transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none', zIndex: 0 }} />

        {/* Orbs */}
        <div style={{ position: 'fixed', top: '-120px', right: '-80px', width: '600px', height: '600px', background: 'rgba(27,48,91,0.18)', borderRadius: '50%', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', bottom: '-100px', left: '-60px', width: '400px', height: '400px', background: 'rgba(27,48,91,0.1)', borderRadius: '50%', filter: 'blur(70px)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: '80px 48px' }}>

          {/* Hero */}
          <div style={{ marginBottom: '72px' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.65)', marginBottom: '20px' }}>
              Domain Marketplace
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(52px,6vw,88px)', color: '#fff', lineHeight: 1.05, margin: '0 0 18px' }}>
              Your API deserves<br />a real domain.
            </h1>
            <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '16px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: '520px', margin: '0 0 40px' }}>
              Search, register, and manage domains for your products.
              .dev, .io, .co.za, .app and more — right here.
            </p>

            {/* Search bar */}
            <div style={{ display: 'flex', maxWidth: '560px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '100px', overflow: 'hidden', marginBottom: '24px' }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doSearch()}
                placeholder="yourapiname.dev"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '16px 24px', fontFamily: "'DM Mono', monospace", fontSize: '14px', color: '#fff' }}
              />
              <button
                onClick={doSearch}
                style={{ padding: '16px 28px', background: '#1B305B', border: 'none', borderLeft: '1px solid rgba(91,148,210,0.3)', fontFamily: "'DM Mono', monospace", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'white', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#243d6e')}
                onMouseLeave={e => (e.currentTarget.style.background = '#1B305B')}
              >
                Search →
              </button>
            </div>

            {/* Popular TLDs */}
            {!searched && (
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.2)' }}>
                .dev · .io · .co.za · .app · .com
              </div>
            )}
          </div>

          {/* Results */}
          {searched && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>
                Results for <span style={{ color: 'rgba(91,148,210,0.8)' }}>{searched}</span>
              </div>
              <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden' }}>
                {MOCK_TLDS.map(({ tld, available, price }, i) => (
                  <div key={tld} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto auto',
                    alignItems: 'center',
                    gap: '24px',
                    padding: '18px 28px',
                    borderBottom: i < MOCK_TLDS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    opacity: available ? 1 : 0.4,
                    background: 'rgba(255,255,255,0.02)',
                  }}>
                    <div>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '17px', color: '#fff' }}>{searched}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '17px', color: 'rgba(91,148,210,0.85)' }}>{tld}</span>
                    </div>
                    <div>
                      {available
                        ? <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(80,200,120,0.9)', background: 'rgba(80,200,120,0.1)', border: '1px solid rgba(80,200,120,0.2)', padding: '4px 10px', borderRadius: '100px' }}>Available</span>
                        : <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '100px' }}>Taken</span>
                      }
                    </div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '20px', color: '#fff', minWidth: '80px', textAlign: 'right' }}>
                      {price ?? '—'}
                    </div>
                    <div>
                      {available && (
                        <button
                          onClick={() => setModal({ domain: `${searched}${tld}`, price: price! })}
                          style={{ padding: '9px 20px', background: '#1B305B', border: '1px solid rgba(91,148,210,0.3)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '9.5px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'white', cursor: 'pointer', transition: 'background 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#243d6e')}
                          onMouseLeave={e => (e.currentTarget.style.background = '#1B305B')}
                        >
                          Add to cart
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setModal(null); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div style={{ background: '#0C0C10', border: '1px solid rgba(255,255,255,0.1)', borderTop: '1.5px solid rgba(91,148,210,0.35)', borderRadius: '24px', padding: '40px', maxWidth: '480px', width: '90%', position: 'relative' }}>
            <button
              onClick={() => setModal(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}
            >×</button>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '9.5px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.65)', marginBottom: '14px' }}>
              Register domain
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '34px', color: '#fff', margin: '0 0 6px' }}>
              {modal.domain}
            </h2>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: '0 0 28px' }}>
              {modal.price} · Renews annually
            </p>
            <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '0 0 28px', lineHeight: 1.7 }}>
              Domain registration requires a connected payment method.
              Sign in or create an account to complete your purchase.
            </p>
            <a
              href="/auth?screen=signup"
              style={{ display: 'block', textAlign: 'center', padding: '13px 28px', background: '#1B305B', border: '1.5px solid rgba(91,148,210,0.35)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '10.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'white', textDecoration: 'none' }}
            >
              Sign in to register →
            </a>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
