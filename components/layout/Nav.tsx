'use client';
import Link from 'next/link';
import React from 'react';
import { SearchBar } from '../ui/SearchBar';

export function Nav() {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 200,
      height: '64px',
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      alignItems: 'center',
      gap: '24px',
      padding: '0 48px',
      background: 'rgba(7,7,10,0.88)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>
      {/* Left — logo */}
      <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
        <img src="/logo.png" alt="Clive" style={{ height: '32px', width: 'auto', display: 'block' }} />
      </Link>

      {/* Center — nav links, truly centered in remaining space */}
      <div style={{ display: 'flex', gap: '28px', justifyContent: 'center', alignItems: 'center' }}>
        {[
          { href: '/products', label: 'Products' },
          { href: '/domains',  label: 'Domains'  },
          { href: '/',         label: 'Platform' },
          { href: '/pricing',  label: 'Pricing'  },
          { href: '/sell',     label: 'Sell'      },
          { href: '/docs',     label: 'Docs'      },
        ].map(({ href, label }) => (
          <Link
            key={label}
            href={href}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '10.5px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'color .2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'white'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)'; }}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Right — search + Console + auth buttons */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
        <SearchBar navMode />
        <Link
          href="/console"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '10.5px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(91,148,210,0.7)',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'color .2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(91,148,210,1)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(91,148,210,0.7)'; }}
        >
          Console
        </Link>
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
            whiteSpace: 'nowrap',
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
            whiteSpace: 'nowrap',
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
