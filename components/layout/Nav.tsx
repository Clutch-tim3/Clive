'use client';
import Link from 'next/link';
import React from 'react';

export function Nav() {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 200,
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 48px',
      background: 'rgba(7,7,10,0.88)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      transition: 'all .3s',
    }}>
      <Link href="/" style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '22px',
        fontWeight: 500,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'white',
        textDecoration: 'none',
      }}>
        <img src="/logo.png" alt="Clive" style={{ height: '32px', width: 'auto' }} />
      </Link>

      <div style={{
        display: 'flex',
        gap: '32px',
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
      }}>
        {[
          { href: '/products', label: 'Products', accent: false },
          { href: '/', label: 'Platform', accent: false },
          { href: '/pricing', label: 'Pricing', accent: false },
          { href: '/sell', label: 'Sell', accent: false },
          { href: '/docs', label: 'Docs', accent: false },
          { href: '/console', label: 'Console', accent: true },
        ].map(({ href, label, accent }) => (
          <Link
            key={label}
            href={href}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '10.5px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: accent ? 'rgba(91,148,210,0.7)' : 'rgba(255,255,255,0.45)',
              textDecoration: 'none',
              transition: 'color .2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.color = accent ? 'rgba(91,148,210,1)' : 'white';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.color = accent ? 'rgba(91,148,210,0.7)' : 'rgba(255,255,255,0.45)';
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Link
          href="/auth?screen=signin"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '10.5px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '9px 22px',
            borderRadius: '100px',
            border: '1.5px solid rgba(255,255,255,0.14)',
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.6)',
            textDecoration: 'none',
            transition: 'all .2s',
            backdropFilter: 'blur(12px)',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.borderColor = 'rgba(255,255,255,0.28)';
            el.style.color = 'white';
            el.style.background = 'rgba(255,255,255,0.1)';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.borderColor = 'rgba(255,255,255,0.14)';
            el.style.color = 'rgba(255,255,255,0.6)';
            el.style.background = 'rgba(255,255,255,0.06)';
          }}
        >
          Sign in
        </Link>
        <Link
          href="/auth?screen=signup"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '10.5px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '9px 22px',
            borderRadius: '100px',
            border: '1.5px solid var(--navy)',
            background: 'var(--navy)',
            color: 'white',
            textDecoration: 'none',
            transition: 'all .2s',
            boxShadow: '0 4px 16px rgba(27,48,91,0.35)',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = 'var(--navy2)';
            el.style.boxShadow = '0 6px 24px rgba(27,48,91,0.45)';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = 'var(--navy)';
            el.style.boxShadow = '0 4px 16px rgba(27,48,91,0.35)';
          }}
        >
          Get started
        </Link>
      </div>
    </nav>
  );
}
