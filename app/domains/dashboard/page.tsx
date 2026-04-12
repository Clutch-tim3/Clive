'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';

interface DomainRecord {
  id:           string;
  domainName:   string;
  tld:          string;
  status:       string;
  locked:       boolean;
  autoRenew:    boolean;
  privacyEnabled: boolean;
  nameservers:  string[];
  priceZAR:     number;
  expiresAt:    string | null;
  registeredAt: string | null;
}

interface DomainOrder {
  id:         string;
  domainName: string;
  tld:        string;
  status:     'pending' | 'processing' | 'fulfilled' | 'failed';
  priceZAR:   number;
  years:      number;
  orderedAt:  string | null;
}

function fmtZAR(cents: number): string {
  return `R${(cents / 100).toFixed(0)}`;
}

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function DomainsDashboard() {
  const router = useRouter();
  const [domains,    setDomains]    = useState<DomainRecord[]>([]);
  const [orders,     setOrders]     = useState<DomainOrder[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [authed,     setAuthed]     = useState<boolean | null>(null);
  const [renewModal, setRenewModal] = useState<DomainRecord | null>(null);
  const [renewYears, setRenewYears] = useState(1);
  const [renewing,   setRenewing]   = useState(false);
  const [renewError, setRenewError] = useState('');

  // Auth guard
  useEffect(() => {
    import('firebase/auth').then(({ onAuthStateChanged }) =>
      import('@/lib/firebase/client').then(({ auth }) => {
        onAuthStateChanged(auth, user => {
          if (!user) {
            router.replace('/auth?screen=signin&redirect=/domains/dashboard');
          } else {
            setAuthed(true);
          }
        });
      })
    );
  }, [router]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [domainsRes, ordersRes] = await Promise.all([
        fetch('/api/domains/list'),
        fetch('/api/domains/orders'),
      ]);
      const domainsData = await domainsRes.json() as { domains?: DomainRecord[] };
      const ordersData  = await ordersRes.json() as { orders?: DomainOrder[] };
      setDomains(domainsData.domains ?? []);
      // Only show non-fulfilled orders in the pending section
      setOrders((ordersData.orders ?? []).filter(o => o.status !== 'fulfilled'));
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (authed) load(); }, [authed, load]);

  const toggleAutoRenew = async (d: DomainRecord) => {
    const next = !d.autoRenew;
    setDomains(prev => prev.map(x => x.id === d.id ? { ...x, autoRenew: next } : x));
    try {
      await fetch(`/api/domains/${encodeURIComponent(d.domainName)}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoRenew: next }),
      });
    } catch {
      setDomains(prev => prev.map(x => x.id === d.id ? { ...x, autoRenew: !next } : x));
    }
  };

  const toggleLock = async (d: DomainRecord) => {
    const next = !d.locked;
    setDomains(prev => prev.map(x => x.id === d.id ? { ...x, locked: next } : x));
    try {
      await fetch(`/api/domains/${encodeURIComponent(d.domainName)}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locked: next }),
      });
    } catch {
      setDomains(prev => prev.map(x => x.id === d.id ? { ...x, locked: !next } : x));
    }
  };

  const handleRenew = async () => {
    if (!renewModal) return;
    setRenewing(true);
    setRenewError('');
    try {
      const res = await fetch(`/api/domains/${encodeURIComponent(renewModal.domainName)}/renew`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ years: renewYears }),
      });
      const data = await res.json() as { expiresAt?: string; error?: string };
      if (!res.ok) { setRenewError(data.error ?? 'Renewal failed.'); return; }
      setRenewModal(null);
      await load();
    } catch {
      setRenewError('Network error. Please try again.');
    } finally {
      setRenewing(false);
    }
  };

  const copyNameservers = (ns: string[]) => {
    navigator.clipboard.writeText(ns.join('\n'));
  };

  // Domains expiring within 30 days
  const expiring = domains.filter(d => {
    const days = daysUntil(d.expiresAt);
    return days !== null && days <= 30 && days >= 0;
  });

  const getStatusInfo = (d: DomainRecord) => {
    const days = daysUntil(d.expiresAt);
    if (d.status === 'expired' || (days !== null && days < 0)) {
      return { dot: 'rgba(255,100,100,0.8)', label: 'Expired' };
    }
    if (days !== null && days <= 30) {
      return { dot: 'rgba(255,180,0,0.85)', label: `Expiring in ${days}d` };
    }
    return { dot: 'rgba(80,200,120,0.85)', label: 'Active' };
  };

  if (!authed) return null; // redirect in progress

  return (
    <>
      <Nav />
      <div style={{ minHeight: '100vh', background: '#07070A', paddingTop: '64px' }}>
        <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(27,48,91,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(27,48,91,0.05) 1px,transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', top: '-100px', right: '-80px', width: '500px', height: '500px', background: 'rgba(27,48,91,0.14)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: '64px 32px' }}>

          {/* Topbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.6)', marginBottom: '8px' }}>
                Domains
              </div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '40px', color: '#fff', margin: 0 }}>
                My Domains
              </h1>
            </div>
            <a
              href="/domains"
              style={{ padding: '11px 24px', background: '#1B305B', border: '1.5px solid rgba(91,148,210,0.35)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'white', textDecoration: 'none', transition: 'background .2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#243d6e')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1B305B')}
            >
              Register new domain →
            </a>
          </div>

          {/* Expiry warning banner */}
          {expiring.length > 0 && (
            <div style={{ marginBottom: '28px', padding: '16px 20px', background: 'rgba(255,180,0,0.06)', border: '1px solid rgba(255,180,0,0.2)', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '18px' }}>⚠</span>
              <div style={{ flex: 1, fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,180,0,0.85)', lineHeight: 1.7 }}>
                {expiring.map(d => {
                  const days = daysUntil(d.expiresAt)!;
                  return <span key={d.id}><strong>{d.domainName}</strong> expires in {days} day{days !== 1 ? 's' : ''}. </span>;
                })}
                Renew now to avoid losing your domain.
              </div>
              <button
                onClick={() => { setRenewModal(expiring[0]); setRenewYears(1); }}
                style={{ padding: '8px 18px', background: 'transparent', border: '1px solid rgba(255,180,0,0.4)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,180,0,0.85)', cursor: 'pointer' }}
              >
                Renew →
              </button>
            </div>
          )}

          {/* Pending orders */}
          {!loading && orders.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '12px' }}>
                Pending Orders
              </div>
              <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
                {orders.map((o, i) => {
                  const statusMap: Record<string, { dot: string; label: string }> = {
                    pending:    { dot: 'rgba(255,180,0,0.85)',   label: 'Ordered — awaiting processing' },
                    processing: { dot: 'rgba(91,148,210,0.9)',   label: 'Being processed' },
                    failed:     { dot: 'rgba(255,100,100,0.8)',  label: 'Failed — contact support' },
                  };
                  const { dot, label } = statusMap[o.status] ?? { dot: 'rgba(255,255,255,0.3)', label: o.status };
                  return (
                    <div key={o.id} style={{
                      display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 20px',
                      borderBottom: i < orders.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      background: 'rgba(255,255,255,0.02)',
                    }}>
                      <div style={{ flex: 1, fontFamily: "'DM Mono', monospace", fontSize: '13px', color: '#fff' }}>{o.domainName}</div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{o.years}yr · {fmtZAR(o.priceZAR)}</div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: "'DM Mono', monospace", fontSize: '9px', color: dot }}>
                        <span style={{
                          width: 7, height: 7, borderRadius: '50%', background: dot, display: 'inline-block',
                          ...(o.status === 'processing' ? { animation: 'pulse 1.5s ease-in-out infinite' } : {}),
                        }} />
                        {label}
                      </div>
                    </div>
                  );
                })}
              </div>
              <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }`}</style>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ display: 'flex', gap: '24px', alignItems: 'center', padding: '18px 24px', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ flex: 1, height: 18, borderRadius: 4, background: 'rgba(255,255,255,0.07)' }} />
                  <div style={{ width: 80, height: 18, borderRadius: 100, background: 'rgba(255,255,255,0.05)' }} />
                  <div style={{ width: 100, height: 18, borderRadius: 4, background: 'rgba(255,255,255,0.05)' }} />
                  <div style={{ width: 60, height: 28, borderRadius: 100, background: 'rgba(255,255,255,0.07)' }} />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && domains.length === 0 && (
            <div style={{ textAlign: 'center', padding: '100px 32px', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🌐</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '32px', color: '#fff', marginBottom: '12px' }}>No domains yet.</div>
              <div style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '14px', color: 'rgba(255,255,255,0.3)', marginBottom: '32px', lineHeight: 1.7 }}>
                Your registered domains will appear here.
              </div>
              <a href="/domains" style={{ display: 'inline-block', padding: '12px 28px', background: '#1B305B', border: '1.5px solid rgba(91,148,210,0.35)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '10.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'white', textDecoration: 'none' }}>
                Search for a domain →
              </a>
            </div>
          )}

          {/* Domain table */}
          {!loading && domains.length > 0 && (
            <>
              {/* Column headers */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 130px 110px 90px auto', gap: '12px', padding: '8px 24px 10px', fontFamily: "'DM Mono', monospace", fontSize: '8px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>
                <span>Domain</span><span>Status</span><span>Registered</span><span>Expires</span><span>Auto-renew</span><span>Actions</span>
              </div>
              <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden' }}>
                {domains.map((d, i) => {
                  const { dot, label } = getStatusInfo(d);
                  return (
                    <div key={d.id} style={{
                      display: 'grid', gridTemplateColumns: '1fr 100px 130px 110px 90px auto',
                      gap: '12px', alignItems: 'center', padding: '16px 24px',
                      borderBottom: i < domains.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      background: 'rgba(255,255,255,0.02)',
                    }}>
                      {/* Domain name + lock icon */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: '#fff' }}>{d.domainName}</span>
                        {d.locked && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                          </svg>
                        )}
                      </div>

                      {/* Status */}
                      <div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: "'DM Mono', monospace", fontSize: '9px', color: dot }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, display: 'inline-block' }} />
                          {label}
                        </span>
                      </div>

                      {/* Registered */}
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>
                        {fmtDate(d.registeredAt)}
                      </div>

                      {/* Expires */}
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: daysUntil(d.expiresAt) !== null && daysUntil(d.expiresAt)! <= 30 ? 'rgba(255,180,0,0.8)' : 'rgba(255,255,255,0.35)' }}>
                        {fmtDate(d.expiresAt)}
                      </div>

                      {/* Auto-renew toggle */}
                      <div>
                        <button
                          onClick={() => toggleAutoRenew(d)}
                          style={{
                            width: '40px', height: '22px', borderRadius: '100px',
                            background: d.autoRenew ? 'rgba(91,148,210,0.5)' : 'rgba(255,255,255,0.1)',
                            border: d.autoRenew ? '1px solid rgba(91,148,210,0.5)' : '1px solid rgba(255,255,255,0.15)',
                            position: 'relative', cursor: 'pointer', transition: 'all .2s',
                          }}
                        >
                          <span style={{
                            position: 'absolute', top: '3px', left: d.autoRenew ? '20px' : '3px',
                            width: 14, height: 14, borderRadius: '50%',
                            background: 'white', transition: 'left .2s',
                          }} />
                        </button>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          onClick={() => { setRenewModal(d); setRenewYears(1); setRenewError(''); }}
                          style={{ padding: '6px 14px', background: 'transparent', border: '1px solid rgba(91,148,210,0.25)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '8.5px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.7)', cursor: 'pointer', transition: 'all .15s' }}
                          onMouseEnter={e => { (e.currentTarget.style.borderColor = 'rgba(91,148,210,0.5)'); (e.currentTarget.style.color = 'rgba(91,148,210,1)'); }}
                          onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(91,148,210,0.25)'); (e.currentTarget.style.color = 'rgba(91,148,210,0.7)'); }}
                        >
                          Renew
                        </button>
                        <a
                          href={`https://www.name.com/account/domain/${d.domainName}`}
                          target="_blank" rel="noopener noreferrer"
                          style={{ padding: '6px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '8.5px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'all .15s', whiteSpace: 'nowrap' }}
                          onMouseEnter={e => { (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'); (e.currentTarget.style.color = 'rgba(255,255,255,0.6)'); }}
                          onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'); (e.currentTarget.style.color = 'rgba(255,255,255,0.35)'); }}
                        >
                          Manage DNS ↗
                        </a>
                        <button
                          onClick={() => toggleLock(d)}
                          title={d.locked ? 'Unlock domain (allow transfers)' : 'Lock domain (prevent transfers)'}
                          style={{ padding: '6px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', transition: 'all .15s', lineHeight: 0 }}
                          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
                          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={d.locked ? 'rgba(91,148,210,0.7)' : 'rgba(255,255,255,0.3)'} strokeWidth="2">
                            {d.locked
                              ? <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>
                              : <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 019.9-1"/></>
                            }
                          </svg>
                        </button>
                        <button
                          onClick={() => copyNameservers(d.nameservers)}
                          title="Copy nameservers"
                          style={{ padding: '6px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', transition: 'all .15s', lineHeight: 0 }}
                          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
                          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─── Renew Modal ──────────────────────────────────────────────────── */}
      {renewModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setRenewModal(null); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div style={{ background: '#0C0C10', border: '1px solid rgba(255,255,255,0.1)', borderTop: '1.5px solid rgba(91,148,210,0.35)', borderRadius: '24px', padding: '36px', maxWidth: '420px', width: '90%', position: 'relative' }}>
            <button onClick={() => setRenewModal(null)} style={{ position: 'absolute', top: '14px', right: '14px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}>×</button>

            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.65)', marginBottom: '10px' }}>
              Renew Domain
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '30px', color: '#fff', margin: '0 0 24px' }}>
              {renewModal.domainName}
            </h2>

            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '10px' }}>
              Renewal period
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {[1, 2, 3, 5].map(y => (
                <button
                  key={y}
                  onClick={() => setRenewYears(y)}
                  style={{
                    padding: '8px 16px',
                    background: renewYears === y ? '#1B305B' : 'rgba(255,255,255,0.04)',
                    border: renewYears === y ? '1px solid rgba(91,148,210,0.4)' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '100px',
                    fontFamily: "'DM Mono', monospace", fontSize: '10px',
                    color: renewYears === y ? 'rgba(91,148,210,1)' : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer', transition: 'all .15s',
                  }}
                >
                  {y}yr
                </button>
              ))}
            </div>

            {renewError && (
              <div style={{ padding: '10px 14px', background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)', borderRadius: '8px', fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,130,130,0.9)', marginBottom: '16px' }}>
                {renewError}
              </div>
            )}

            <button
              onClick={handleRenew}
              disabled={renewing}
              style={{
                width: '100%', padding: '13px', background: renewing ? 'rgba(27,48,91,0.5)' : '#1B305B',
                border: '1.5px solid rgba(91,148,210,0.35)', borderRadius: '12px',
                fontFamily: "'DM Mono', monospace", fontSize: '10.5px', letterSpacing: '0.1em', textTransform: 'uppercase',
                color: renewing ? 'rgba(255,255,255,0.4)' : 'white',
                cursor: renewing ? 'default' : 'pointer',
              }}
            >
              {renewing ? 'Renewing…' : `Renew for ${renewYears} year${renewYears !== 1 ? 's' : ''} →`}
            </button>

            <div style={{ marginTop: '10px', fontFamily: "'DM Mono', monospace", fontSize: '8px', color: 'rgba(255,255,255,0.18)', textAlign: 'center' }}>
              Current renewal price fetched in real-time from Name.com
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
