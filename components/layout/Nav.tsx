'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { SearchBar } from '../ui/SearchBar';

export function Nav() {
  const [user, setUser] = useState<{ displayName?: string | null; email?: string | null } | null | undefined>(undefined);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    import('@/lib/firebase/client').then(({ auth }) =>
      import('firebase/auth').then(({ onAuthStateChanged }) => {
        unsub = onAuthStateChanged(auth, u => setUser(u ? { displayName: u.displayName, email: u.email } : null));
      })
    );
    return () => unsub?.();
  }, []);

  const handleSignOut = async () => {
    const { auth } = await import('@/lib/firebase/client');
    const { signOut } = await import('firebase/auth');
    await signOut(auth);
    await fetch('/api/auth/signout', { method: 'POST' }).catch(() => {});
    window.location.href = '/';
  };

  // undefined = still loading (avoid flash of wrong buttons)
  const authed = user !== undefined && user !== null;

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

        {/* Console link always visible */}
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

        {/* Logged-in: My APIs link + avatar + sign out */}
        {authed && (
          <>
            <Link
              href="/dashboard/apis"
              style={{ fontFamily:"'DM Mono',monospace", fontSize:'10.5px', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(91,148,210,0.7)', textDecoration:'none', whiteSpace:'nowrap', transition:'color .2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(91,148,210,1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(91,148,210,0.7)'; }}
            >
              My APIs
            </Link>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--navy)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'DM Mono', monospace",
              fontSize: '12px',
              color: 'white',
              flexShrink: 0,
              border: '1.5px solid rgba(91,148,210,0.35)',
            }}>
              {(user?.displayName?.[0] ?? user?.email?.[0] ?? '?').toUpperCase()}
            </div>
            <button
              onClick={handleSignOut}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '10.5px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '9px 22px',
                borderRadius: '100px',
                border: '1.5px solid rgba(255,255,255,0.14)',
                background: 'transparent',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all .2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = 'rgba(255,255,255,0.28)';
                el.style.color = 'white';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = 'rgba(255,255,255,0.14)';
                el.style.color = 'rgba(255,255,255,0.5)';
              }}
            >
              Sign out
            </button>
          </>
        )}

        {/* Logged-out: sign in + get started */}
        {user === null && (
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
