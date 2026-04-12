'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Nav } from '@/components/layout/Nav';

interface AdminStats {
  totalUsers:          number;
  liveProducts:        number;
  activeSubscriptions: number;
  totalRevenue:        number;
  totalCommission:     number;
  totalDomainOrders:   number;
  pendingDomainOrders: number;
}

interface DomainOrder {
  id:         string;
  userId:     string;
  userEmail:  string;
  domainName: string;
  tld:        string;
  status:     'pending' | 'processing' | 'fulfilled' | 'failed';
  priceZAR:   number;
  priceUSD:   number;
  years:      number;
  orderedAt:  string | null;
  updatedAt:  string | null;
}

const STATUS_OPTIONS = ['pending', 'processing', 'fulfilled', 'failed'] as const;

const STATUS_STYLE: Record<string, { dot: string; label: string }> = {
  pending:    { dot: 'rgba(255,180,0,0.85)',  label: 'Pending'    },
  processing: { dot: 'rgba(91,148,210,0.9)',  label: 'Processing' },
  fulfilled:  { dot: 'rgba(80,200,120,0.85)', label: 'Fulfilled'  },
  failed:     { dot: 'rgba(255,100,100,0.8)', label: 'Failed'     },
};

function fmtZAR(cents: number): string {
  return `R${(cents / 100).toFixed(0)}`;
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function FounderPage() {
  const router = useRouter();

  const [stats,         setStats]         = useState<AdminStats | null>(null);
  const [orders,        setOrders]        = useState<DomainOrder[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [unauthorized,  setUnauthorized]  = useState(false);
  const [updating,      setUpdating]      = useState<string | null>(null);
  const [statusFilter,  setStatusFilter]  = useState<string>('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/domain-orders'),
      ]);

      if (statsRes.status === 401 || statsRes.status === 403) {
        setUnauthorized(true);
        return;
      }

      const statsData  = await statsRes.json() as AdminStats;
      const ordersData = await ordersRes.json() as { orders?: DomainOrder[] };
      setStats(statsData);
      setOrders(ordersData.orders ?? []);
    } catch {
      setUnauthorized(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (unauthorized) router.replace('/');
  }, [unauthorized, router]);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      const res = await fetch('/api/admin/domain-orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as DomainOrder['status'] } : o));
      }
    } finally {
      setUpdating(null);
    }
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(o => o.status === statusFilter);

  if (unauthorized || loading) return null;

  const statCards = [
    { label: 'Total Users',        value: stats?.totalUsers ?? 0,          color: 'rgba(91,148,210,0.8)'  },
    { label: 'Active API Subs',    value: stats?.activeSubscriptions ?? 0, color: 'rgba(80,200,120,0.8)'  },
    { label: 'Domain Orders',      value: stats?.totalDomainOrders ?? 0,   color: 'rgba(210,160,50,0.8)'  },
    { label: 'Pending Orders',     value: stats?.pendingDomainOrders ?? 0, color: 'rgba(255,140,0,0.85)'  },
    { label: 'Live Products',      value: stats?.liveProducts ?? 0,        color: 'rgba(255,255,255,0.5)' },
    { label: 'Revenue (ZAR)',      value: fmtZAR(stats?.totalRevenue ?? 0), color: 'rgba(80,200,120,0.9)' },
  ];

  return (
    <>
      <Nav />
      <div style={{ minHeight: '100vh', background: '#07070A', paddingTop: '64px' }}>
        <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(27,48,91,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(27,48,91,0.05) 1px,transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '56px 32px' }}>

          {/* Header */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.6)', marginBottom: '8px' }}>
              Internal
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '48px', color: '#fff', margin: 0 }}>
              Founder Panel
            </h1>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '48px' }}>
            {statCards.map(({ label, value, color }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px 22px' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '10px' }}>
                  {label}
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '34px', color, lineHeight: 1 }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Domain Orders */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                Domain Orders
              </h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['all', ...STATUS_OPTIONS].map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    style={{
                      padding: '6px 14px',
                      background: statusFilter === s ? '#1B305B' : 'transparent',
                      border: statusFilter === s ? '1px solid rgba(91,148,210,0.4)' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '100px',
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '8.5px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: statusFilter === s ? 'rgba(91,148,210,1)' : 'rgba(255,255,255,0.35)',
                      cursor: 'pointer',
                      transition: 'all .15s',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 32px', border: '1px dashed rgba(255,255,255,0.07)', borderRadius: '20px', fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>
                No orders found.
              </div>
            ) : (
              <>
                {/* Column headers */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.6fr 90px 50px 140px 110px 130px', gap: '12px', padding: '8px 20px 8px', fontFamily: "'DM Mono', monospace", fontSize: '7.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>
                  <span>Domain</span><span>User</span><span>Price</span><span>Yrs</span><span>Ordered</span><span>Status</span><span>Action</span>
                </div>
                <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden' }}>
                  {filteredOrders.map((o, i) => {
                    const { dot, label } = STATUS_STYLE[o.status] ?? { dot: 'rgba(255,255,255,0.3)', label: o.status };
                    return (
                      <div
                        key={o.id}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1.4fr 1.6fr 90px 50px 140px 110px 130px',
                          gap: '12px',
                          alignItems: 'center',
                          padding: '14px 20px',
                          borderBottom: i < filteredOrders.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                          background: 'rgba(255,255,255,0.02)',
                        }}
                      >
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {o.domainName}
                        </div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {o.userEmail}
                        </div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>
                          {fmtZAR(o.priceZAR)}
                        </div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>
                          {o.years}
                        </div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>
                          {fmtDate(o.orderedAt)}
                        </div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{
                            width: 7, height: 7, borderRadius: '50%', background: dot, display: 'inline-block', flexShrink: 0,
                            ...(o.status === 'processing' ? { animation: 'pulse 1.5s ease-in-out infinite' } : {}),
                          }} />
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: dot }}>{label}</span>
                        </div>
                        <div>
                          <select
                            value={o.status}
                            disabled={updating === o.id}
                            onChange={e => updateStatus(o.id, e.target.value)}
                            style={{
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.12)',
                              borderRadius: '8px',
                              fontFamily: "'DM Mono', monospace",
                              fontSize: '9px',
                              color: 'rgba(255,255,255,0.6)',
                              padding: '6px 10px',
                              cursor: 'pointer',
                              outline: 'none',
                              width: '100%',
                              opacity: updating === o.id ? 0.5 : 1,
                            }}
                          >
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }`}</style>
        </div>
      </div>
    </>
  );
}
