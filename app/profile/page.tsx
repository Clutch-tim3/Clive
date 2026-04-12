'use client';
import React, { useEffect, useState } from 'react';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

interface UserInfo {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserInfo | null | undefined>(undefined);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    import('@/lib/firebase/client').then(({ auth }) =>
      import('firebase/auth').then(({ onAuthStateChanged }) => {
        unsub = onAuthStateChanged(auth, u => {
          if (u) {
            setUser({ uid: u.uid, displayName: u.displayName, email: u.email, photoURL: u.photoURL });
          } else {
            setUser(null);
          }
        });
      })
    );
    return () => unsub?.();
  }, []);

  // Redirect unauthenticated users
  useEffect(() => {
    if (user === null) {
      window.location.href = '/auth?screen=signin';
    }
  }, [user]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const { auth } = await import('@/lib/firebase/client');
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
      await fetch('/api/auth/signout', { method: 'POST' }).catch(() => {});
      window.location.href = '/';
    } catch {
      setSigningOut(false);
    }
  };

  const initial = (user?.displayName?.[0] ?? user?.email?.[0] ?? '?').toUpperCase();

  return (
    <>
      <Nav />
      <div style={{
        minHeight: '100vh',
        background: '#07070A',
        paddingTop: '64px',
      }}>
        <div style={{
          maxWidth: '640px',
          margin: '0 auto',
          padding: '64px 32px 96px',
        }}>

          {/* Header */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '9px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(91,148,210,0.6)',
              marginBottom: '12px',
            }}>
              Account
            </div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: '42px',
              color: '#fff',
              margin: 0,
              lineHeight: 1.1,
            }}>
              Your Profile
            </h1>
          </div>

          {user === undefined ? (
            <div style={{ color: 'rgba(255,255,255,0.2)', fontFamily: "'DM Mono', monospace", fontSize: '11px' }}>
              Loading…
            </div>
          ) : user ? (
            <>
              {/* Identity card */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '28px 32px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(27,48,91,0.8)',
                  border: '2px solid rgba(91,148,210,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '22px',
                  color: 'white',
                  flexShrink: 0,
                }}>
                  {initial}
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Libre Baskerville', serif",
                    fontSize: '18px',
                    color: 'white',
                    marginBottom: '4px',
                  }}>
                    {user.displayName ?? 'No display name'}
                  </div>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.35)',
                  }}>
                    {user.email}
                  </div>
                </div>
              </div>

              {/* Quick links */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '16px',
              }}>
                <div style={{
                  padding: '14px 32px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '9px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.25)',
                }}>
                  Quick links
                </div>
                {[
                  { href: '/console',      label: 'Console',      desc: 'Build & manage your APIs' },
                  { href: '/dashboard/apis', label: 'My APIs',    desc: 'APIs you\'ve subscribed to' },
                  { href: '/domains/dashboard', label: 'My Domains', desc: 'Domain orders & management' },
                ].map(({ href, label, desc }) => (
                  <Link
                    key={href}
                    href={href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 32px',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      textDecoration: 'none',
                      transition: 'background .15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
                  >
                    <div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '2px' }}>
                        {label}
                      </div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9.5px', color: 'rgba(255,255,255,0.25)' }}>
                        {desc}
                      </div>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>→</span>
                  </Link>
                ))}
              </div>

              {/* Sign out */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '14px 32px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '9px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.25)',
                }}>
                  Session
                </div>
                <div style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>
                      Signed in as
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>
                      {user.email}
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '10.5px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      padding: '10px 24px',
                      borderRadius: '100px',
                      border: '1.5px solid rgba(220,80,80,0.3)',
                      background: 'rgba(220,80,80,0.07)',
                      color: signingOut ? 'rgba(220,80,80,0.3)' : 'rgba(220,80,80,0.7)',
                      cursor: signingOut ? 'default' : 'pointer',
                      transition: 'all .2s',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => {
                      if (!signingOut) {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.borderColor = 'rgba(220,80,80,0.6)';
                        el.style.background = 'rgba(220,80,80,0.14)';
                        el.style.color = 'rgba(220,80,80,1)';
                      }
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.borderColor = 'rgba(220,80,80,0.3)';
                      el.style.background = 'rgba(220,80,80,0.07)';
                      el.style.color = signingOut ? 'rgba(220,80,80,0.3)' : 'rgba(220,80,80,0.7)';
                    }}
                  >
                    {signingOut ? 'Signing out…' : 'Sign out'}
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
      <Footer />
    </>
  );
}
