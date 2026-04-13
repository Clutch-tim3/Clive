'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { SearchBar } from '../ui/SearchBar';

interface NavProps {
  /** True when the server detected a __session cookie on this page load. */
  initialAuthed?: boolean;
}

export function Nav({ initialAuthed = false }: NavProps) {
  const [authed, setAuthed] = useState(initialAuthed);
  const [initial, setInitial] = useState('?');
  const [signingOut, setSigningOut] = useState(false);

  // Fetch display name lazily (only needed for avatar letter — not auth gating)
  useEffect(() => {
    if (!initialAuthed) return;
    fetch('/api/auth/user')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          setAuthed(true);
          setInitial((d.displayName?.[0] ?? d.email?.[0] ?? '?').toUpperCase());
        }
      })
      .catch(() => {});
  }, [initialAuthed]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const { auth } = await import('@/lib/firebase/client');
      const { signOut } = await import('firebase/auth');
      await signOut(auth).catch(() => {});
      await fetch('/api/auth/signout', { method: 'POST' }).catch(() => {});
    } finally {
      window.location.href = '/';
    }
  };

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

      {/* Center — nav links */}
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

      {/* Right — search + auth-aware buttons */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
        <SearchBar navMode />

        {/* Console link — always visible */}
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

        {/* ── Logged in: Profile pill + Sign out ────────────────────── */}
        {authed && (
          <>
            <Link
              href="/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 16px 5px 6px',
                borderRadius: '100px',
                border: '1.5px solid rgba(91,148,210,0.3)',
                background: 'rgba(27,48,91,0.25)',
                textDecoration: 'none',
                transition: 'all .2s',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = 'rgba(91,148,210,0.6)';
                el.style.background = 'rgba(27,48,91,0.45)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = 'rgba(91,148,210,0.3)';
                el.style.background = 'rgba(27,48,91,0.25)';
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'rgba(27,48,91,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'DM Mono', monospace",
                fontSize: '10px',
                color: 'white',
                flexShrink: 0,
                border: '1px solid rgba(91,148,210,0.4)',
              }}>
                {initial}
              </div>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '10.5px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.65)',
                whiteSpace: 'nowrap',
              }}>
                Profile
              </span>
            </Link>

            <button
              onClick={handleSignOut}
              disabled={signingOut}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '10.5px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '9px 20px',
                borderRadius: '100px',
                border: '1.5px solid rgba(255,255,255,0.12)',
                background: 'transparent',
                color: signingOut ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.45)',
                cursor: signingOut ? 'default' : 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all .2s',
              }}
              onMouseEnter={e => {
                if (!signingOut) {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.borderColor = 'rgba(255,255,255,0.28)';
                  el.style.color = 'white';
                }
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = 'rgba(255,255,255,0.12)';
                el.style.color = signingOut ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.45)';
              }}
            >
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </>
        )}

        {/* ── Logged out: Sign in + Get started ─────────────────────── */}
        {!authed && (
          <>
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
          </>
        )}
      </div>
    </nav>
  );
}
