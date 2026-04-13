'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

type Tab = 'dashboard' | 'domain-orders' | 'api-subs' | 'users' | 'products' | 'analytics' | 'settings';

interface Stats {
  totalUsers: number;
  liveProducts: number;
  activeSubscriptions: number;
  totalRevenue: number;
  totalDomainOrders: number;
  pendingDomainOrders: number;
}

interface Order {
  id: string;
  userId: string;
  userEmail: string;
  domainName: string;
  tld: string;
  status: 'pending' | 'processing' | 'fulfilled' | 'failed';
  priceZAR: number;
  priceUSD: number;
  years: number;
  orderedAt: string | null;
  updatedAt: string | null;
  contact?: {
    firstName?: string; lastName?: string; phone?: string;
    address?: string; city?: string; state?: string;
  };
}

const CSS = `
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{height:100%;}
.founder-root{font-family:'Libre Baskerville',Georgia,serif;background:#07070A;color:#fff;-webkit-font-smoothing:antialiased;height:100vh;overflow:hidden;cursor:none;}
.founder-root *,.founder-root a,.founder-root button,.founder-root input,.founder-root textarea,.founder-root select,.founder-root label{cursor:none!important;}
#cr{position:fixed;top:0;left:0;width:32px;height:32px;border-radius:50%;border:1.5px solid rgba(27,48,91,0.4);pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:width .22s cubic-bezier(.34,1.56,.64,1),height .22s,border-color .22s;}
#cd{position:fixed;top:0;left:0;width:5px;height:5px;border-radius:50%;background:rgba(91,148,210,0.85);pointer-events:none;z-index:9999;transform:translate(-50%,-50%);}
.founder-root.hov #cr{width:46px;height:46px;border-color:rgba(91,148,210,0.55);}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:200% 50%}100%{background-position:-200% 50%}}
@keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}
@keyframes dotPulse{0%,100%{opacity:.2}50%{opacity:1}}
@keyframes goldPulse{0%,100%{box-shadow:0 0 0 0 rgba(210,170,60,0.3)}50%{box-shadow:0 0 0 6px rgba(210,170,60,0)}}
.layout{display:flex;height:100vh;overflow:hidden;}
.sidebar{width:224px;min-width:224px;height:100vh;background:#0C0C10;border-right:1px solid rgba(255,255,255,0.08);display:flex;flex-direction:column;z-index:10;overflow:hidden;}
.sb-logo{padding:22px 20px 18px;border-bottom:1px solid rgba(255,255,255,0.08);flex-shrink:0;}
.sb-logo-word{font-family:'Cormorant Garamond',serif;font-weight:300;font-size:22px;letter-spacing:0.08em;color:#fff;}
.sb-logo-word em{font-style:normal;color:rgba(91,148,210,0.9);}
.sb-logo-tag{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(210,170,60,0.7);margin-top:3px;display:flex;align-items:center;gap:6px;}
.sb-logo-tag::before{content:'';width:5px;height:5px;border-radius:50%;background:rgba(210,170,60,0.8);animation:pulse 2s infinite;}
.sb-nav{flex:1;overflow-y:auto;padding:12px 0;}
.sb-section{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.2);padding:14px 20px 6px;}
.sb-item{display:flex;align-items:center;gap:10px;padding:9px 20px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.06em;color:rgba(255,255,255,0.4);transition:all .18s;position:relative;width:100%;background:none;border:none;text-align:left;}
.sb-item:hover{color:rgba(255,255,255,0.8);background:rgba(255,255,255,0.04);}
.sb-item.active{color:rgba(91,148,210,0.9);background:rgba(27,48,91,0.2);}
.sb-item.active::before{content:'';position:absolute;left:0;top:25%;bottom:25%;width:2px;background:rgba(91,148,210,0.7);border-radius:0 2px 2px 0;}
.sb-icon{width:16px;height:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;opacity:.65;}
.sb-item.active .sb-icon{opacity:1;}
.sb-badge{margin-left:auto;font-family:'DM Mono',monospace;font-size:8px;padding:2px 7px;border-radius:100px;background:rgba(210,150,50,0.2);border:1px solid rgba(210,150,50,0.35);color:rgba(210,150,50,0.9);}
.sb-footer{padding:14px 20px;border-top:1px solid rgba(255,255,255,0.08);flex-shrink:0;}
.sb-user{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
.sb-avatar{width:30px;height:30px;border-radius:50%;background:rgba(210,170,60,0.2);border:1px solid rgba(210,170,60,0.4);display:flex;align-items:center;justify-content:center;font-family:'DM Mono',monospace;font-size:10px;color:rgba(210,170,60,0.9);animation:goldPulse 3s ease-in-out infinite;flex-shrink:0;}
.sb-uname{font-family:'DM Mono',monospace;font-size:10px;color:rgba(255,255,255,0.65);}
.sb-uemail{font-family:'DM Mono',monospace;font-size:8px;color:rgba(210,170,60,0.5);}
.sb-signout{display:flex;align-items:center;gap:8px;width:100%;padding:7px 0;background:none;border:none;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,80,80,0.45);transition:color .15s;}
.sb-signout:hover{color:rgba(255,80,80,0.8);}
.main{flex:1;height:100vh;overflow-y:auto;background:#07070A;display:flex;flex-direction:column;}
.main::-webkit-scrollbar{width:3px;}
.main::-webkit-scrollbar-thumb{background:rgba(91,148,210,0.15);border-radius:3px;}
.topbar{height:56px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between;padding:0 32px;flex-shrink:0;background:rgba(7,7,10,0.95);backdrop-filter:blur(12px);position:sticky;top:0;z-index:5;}
.topbar-title{font-family:'Cormorant Garamond',serif;font-weight:300;font-size:22px;color:#fff;}
.topbar-right{display:flex;align-items:center;gap:12px;}
.tb-btn{display:flex;align-items:center;gap:7px;padding:7px 16px;border-radius:100px;font-family:'DM Mono',monospace;font-size:9.5px;letter-spacing:0.1em;text-transform:uppercase;transition:all .18s;border:none;}
.tb-btn.gold{background:rgba(210,170,60,0.15);color:rgba(210,170,60,0.9);border:1px solid rgba(210,170,60,0.3);}
.page-content{padding:36px 32px;flex:1;animation:fadeUp .3s ease both;}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;}
.grid-4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:16px;}
.card-lg{background:#0C0C10;border:1px solid rgba(255,255,255,0.08);border-top:1.5px solid rgba(255,255,255,0.14);border-radius:24px;padding:28px 32px;position:relative;overflow:hidden;}
.stat-card{background:#0C0C10;border:1px solid rgba(255,255,255,0.08);border-top:1.5px solid rgba(255,255,255,0.14);border-radius:18px;padding:22px 24px;position:relative;overflow:hidden;transition:all .2s;}
.stat-card:hover{border-color:rgba(91,148,210,0.2);border-top-color:rgba(91,148,210,0.35);}
.stat-card::before{content:'';position:absolute;inset:0;background:linear-gradient(118deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.04) 45%,rgba(255,255,255,0.07) 50%,rgba(255,255,255,0.04) 55%,rgba(255,255,255,0) 100%);background-size:250% 100%;animation:shimmer 8s ease-in-out infinite;}
.stat-card>*{position:relative;z-index:1;}
.stat-card.urgent{border-top-color:rgba(210,150,50,0.6);border-color:rgba(210,150,50,0.25);}
.stat-label{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-bottom:10px;}
.stat-num{font-family:'Cormorant Garamond',serif;font-weight:300;font-size:42px;color:#fff;line-height:1;letter-spacing:-0.02em;}
.stat-num span{color:rgba(91,148,210,0.8);font-size:22px;}
.stat-num.urgent-n{color:rgba(210,150,50,0.9);}
.stat-sub{font-family:'DM Mono',monospace;font-size:9px;color:rgba(255,255,255,0.22);margin-top:6px;}
.sec-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
.sec-title{font-family:'Cormorant Garamond',serif;font-weight:300;font-size:22px;color:#fff;}
.sec-label{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(91,148,210,0.55);margin-bottom:6px;display:flex;align-items:center;gap:8px;}
.sec-label::before{content:'';width:14px;height:1px;background:rgba(91,148,210,0.4);}
.tbl{width:100%;border-collapse:collapse;}
.tbl th{font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.25);padding:10px 16px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.08);}
.tbl td{font-family:'DM Mono',monospace;font-size:10.5px;color:rgba(255,255,255,0.65);padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.04);}
.tbl tr:hover td{background:rgba(255,255,255,0.02);}
.tbl tr:last-child td{border-bottom:none;}
.tbl-main{font-family:'Libre Baskerville',serif;font-size:13px;color:#fff;}
.tbl-sub{font-family:'DM Mono',monospace;font-size:9px;color:rgba(255,255,255,0.25);margin-top:2px;}
.badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:100px;font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:0.06em;}
.badge-dot{width:5px;height:5px;border-radius:50%;}
.badge.live{background:rgba(80,200,120,0.1);border:1px solid rgba(80,200,120,0.25);color:rgba(80,200,120,0.9);}
.badge.live .badge-dot{background:rgba(80,200,120,0.9);animation:dotPulse 2s infinite;}
.badge.pending{background:rgba(210,150,50,0.1);border:1px solid rgba(210,150,50,0.25);color:rgba(210,150,50,0.9);}
.badge.pending .badge-dot{background:rgba(210,150,50,0.9);animation:dotPulse 1.5s infinite;}
.badge.processing{background:rgba(91,148,210,0.1);border:1px solid rgba(91,148,210,0.25);color:rgba(91,148,210,0.9);}
.badge.processing .badge-dot{background:rgba(91,148,210,0.9);animation:dotPulse 1s infinite;}
.badge.fulfilled{background:rgba(80,200,120,0.1);border:1px solid rgba(80,200,120,0.25);color:rgba(80,200,120,0.9);}
.badge.failed{background:rgba(220,80,80,0.1);border:1px solid rgba(220,80,80,0.2);color:rgba(220,80,80,0.8);}
.btn{padding:9px 20px;border-radius:100px;font-family:'DM Mono',monospace;font-size:9.5px;letter-spacing:0.12em;text-transform:uppercase;transition:all .2s;border:none;}
.btn.primary{background:#1B305B;color:#fff;border:1px solid rgba(91,148,210,0.35);border-top-color:rgba(91,148,210,0.55);}
.btn.gold-btn{background:rgba(210,170,60,0.18);color:rgba(210,170,60,0.9);border:1px solid rgba(210,170,60,0.3);}
.btn.gold-btn:hover{background:rgba(210,170,60,0.28);}
.btn.ghost{background:transparent;color:rgba(255,255,255,0.45);border:1px solid rgba(255,255,255,0.08);}
.btn.ghost:hover{border-color:rgba(255,255,255,0.2);color:#fff;}
.btn.sm{padding:5px 12px;font-size:8.5px;}
.act-btn{font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:0.06em;padding:4px 11px;border-radius:100px;border:1px solid rgba(255,255,255,0.08);background:transparent;color:rgba(255,255,255,0.4);transition:all .15s;}
.act-btn:hover{border-color:rgba(91,148,210,0.35);color:rgba(91,148,210,0.85);}
.act-btn.gold-act:hover{border-color:rgba(210,170,60,0.4);color:rgba(210,170,60,0.9);}
.filter-row{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;}
.filter-pill{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;padding:6px 14px;border-radius:100px;border:1px solid rgba(255,255,255,0.08);background:transparent;color:rgba(255,255,255,0.35);transition:all .15s;}
.filter-pill.active{background:rgba(27,48,91,0.4);border-color:rgba(91,148,210,0.3);color:rgba(91,148,210,0.85);}
.filter-pill:hover:not(.active){border-color:rgba(255,255,255,0.15);color:rgba(255,255,255,0.7);}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.72);backdrop-filter:blur(4px);z-index:500;display:flex;align-items:center;justify-content:center;}
.modal-card{background:#0C0C10;border:1px solid rgba(255,255,255,0.08);border-top:1.5px solid rgba(255,255,255,0.18);border-radius:24px;padding:36px 40px;width:100%;max-width:520px;position:relative;box-shadow:0 32px 80px rgba(0,0,0,0.7);}
.modal-close{position:absolute;top:18px;right:20px;background:none;border:none;color:rgba(255,255,255,0.3);font-size:18px;padding:4px;}
.modal-close:hover{color:rgba(255,255,255,0.7);}
.modal-title{font-family:'Cormorant Garamond',serif;font-weight:300;font-size:26px;color:#fff;margin-bottom:6px;}
.modal-sub{font-family:'Libre Baskerville',serif;font-style:italic;font-size:13px;color:rgba(255,255,255,0.38);margin-bottom:28px;line-height:1.6;}
.fl{display:block;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:8px;}
.fi{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:12px 16px;font-family:'DM Mono',monospace;font-size:11px;color:#fff;outline:none;transition:all .2s;margin-bottom:16px;}
.fi:focus{border-color:rgba(91,148,210,0.45);}
.fi.ta{min-height:80px;resize:vertical;font-family:'Libre Baskerville',serif;font-size:13px;line-height:1.7;}
.chart-wrap{height:140px;display:flex;align-items:flex-end;gap:6px;padding-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.06);}
.bar-col{flex:1;display:flex;flex-direction:column;align-items:center;}
.bar{width:100%;border-radius:4px 4px 0 0;background:rgba(27,48,91,0.6);border:1px solid rgba(91,148,210,0.2);border-bottom:none;}
.bar.highlight{background:rgba(27,48,91,0.85);border-color:rgba(91,148,210,0.45);}
.alert-banner{display:flex;align-items:center;gap:14px;padding:14px 20px;border-radius:12px;margin-bottom:24px;}
.alert-banner.warn{background:rgba(210,150,50,0.1);border:1px solid rgba(210,150,50,0.25);}
.alert-banner.info{background:rgba(91,148,210,0.08);border:1px solid rgba(91,148,210,0.2);}
.alert-text{font-family:'DM Mono',monospace;font-size:10px;color:rgba(255,255,255,0.65);line-height:1.6;}
.notif-toast{position:fixed;bottom:24px;right:24px;z-index:999;padding:12px 20px;border-radius:12px;background:#0C0C10;border:1px solid rgba(255,255,255,0.08);border-left:3px solid rgba(80,200,120,0.6);font-family:'DM Mono',monospace;font-size:10px;color:rgba(255,255,255,0.75);box-shadow:0 8px 32px rgba(0,0,0,0.5);}
.notif-toast.err{border-left-color:rgba(220,80,80,0.6);}
`;

const MONTHS = ['J','F','M','A','M','J','J','A','S','O','N','D'];

function Chart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <div className="chart-wrap">
      {data.map((v, i) => (
        <div key={i} className="bar-col">
          <div className={`bar${i === data.length - 1 ? ' highlight' : ''}`} style={{ height: `${Math.round((v / max) * 130)}px` }} />
        </div>
      ))}
    </div>
  );
}

function ChartLabels() {
  return (
    <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
      {MONTHS.map(m => (
        <div key={m} style={{ flex: 1, fontFamily: "'DM Mono',monospace", fontSize: 7.5, color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>{m}</div>
      ))}
    </div>
  );
}

function fmtZAR(cents: number) { return `R${(cents / 100).toFixed(0)}`; }
function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function fmtShort(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

export default function FounderPage() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const crRef = useRef<HTMLDivElement>(null);
  const cdRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ displayName?: string | null; email?: string | null } | null>(null);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [toast, setToast] = useState<{ msg: string; err?: boolean } | null>(null);

  // Fulfil modal
  const [fulfilOrder, setFulfilOrder] = useState<Order | null>(null);
  const [fulfilNcId, setFulfilNcId] = useState('');
  const [fulfilNotes, setFulfilNotes] = useState('');
  const [fulfilLoading, setFulfilLoading] = useState(false);

  // Detail modal
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  // Custom cursor
  useEffect(() => {
    const root = rootRef.current;
    const cr = crRef.current;
    const cd = cdRef.current;
    if (!cr || !cd || !root) return;
    const onMove = (e: MouseEvent) => {
      mouse.current.mx = e.clientX;
      mouse.current.my = e.clientY;
      cd.style.left = e.clientX + 'px';
      cd.style.top = e.clientY + 'px';
    };
    document.addEventListener('mousemove', onMove);
    let raf: number;
    const loop = () => {
      mouse.current.rx += (mouse.current.mx - mouse.current.rx) * 0.12;
      mouse.current.ry += (mouse.current.my - mouse.current.ry) * 0.12;
      cr.style.left = mouse.current.rx + 'px';
      cr.style.top = mouse.current.ry + 'px';
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const addHov = () => root.classList.add('hov');
    const remHov = () => root.classList.remove('hov');
    root.querySelectorAll('button,a,input,select,textarea').forEach(el => {
      el.addEventListener('mouseenter', addHov);
      el.addEventListener('mouseleave', remHov);
    });
    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [activeTab]);

  // Auth + data load
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, oRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/domain-orders'),
      ]);
      if (sRes.status === 401 || sRes.status === 403) { router.replace('/'); return; }
      setStats(await sRes.json());
      const od = await oRes.json() as { orders?: Order[] };
      setOrders(od.orders ?? []);
    } catch { router.replace('/'); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => {
    load();
    import('@/lib/firebase/client').then(({ auth }) =>
      import('firebase/auth').then(({ onAuthStateChanged }) => {
        onAuthStateChanged(auth, u => setUser(u ? { displayName: u.displayName, email: u.email } : null));
      })
    );
  }, [load]);

  const showToast = (msg: string, err = false) => {
    setToast({ msg, err });
    setTimeout(() => setToast(null), 3500);
  };

  // Poll for new domain orders every 60s while on domain-orders tab
  useEffect(() => {
    if (activeTab !== 'domain-orders') return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/admin/domain-orders');
        const data = await res.json() as { orders?: Order[] };
        const fresh = data.orders ?? [];
        setOrders(prev => {
          const prevPending = prev.filter(o => o.status === 'pending').length;
          const newPending = fresh.filter(o => o.status === 'pending').length;
          if (newPending > prevPending) {
            setToast({ msg: `${newPending - prevPending} new domain order(s) arrived!` });
            setTimeout(() => setToast(null), 3500);
          }
          return fresh;
        });
      } catch { /* ignore */ }
    }, 60_000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleSignOut = async () => {
    try {
      const { auth } = await import('@/lib/firebase/client');
      const { signOut } = await import('firebase/auth');
      await signOut(auth).catch(() => {});
    } catch { /* ignore */ }
    document.cookie = '__auth=; max-age=0; path=/; samesite=lax';
    window.location.href = '/api/auth/signout';
  };

  const updateStatus = async (orderId: string, status: string) => {
    const res = await fetch('/api/admin/domain-orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    });
    if (res.ok) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as Order['status'] } : o));
      showToast(`Status updated to ${status}`);
    }
  };

  const submitFulfilment = async () => {
    if (!fulfilOrder) return;
    if (!fulfilNcId.trim()) { showToast('Enter the Name.com order ID first.', true); return; }
    setFulfilLoading(true);
    const res = await fetch('/api/admin/domain-orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: fulfilOrder.id, status: 'fulfilled' }),
    });
    setFulfilLoading(false);
    if (res.ok) {
      setOrders(prev => prev.map(o => o.id === fulfilOrder.id ? { ...o, status: 'fulfilled' } : o));
      setFulfilOrder(null);
      showToast(`✓ ${fulfilOrder.domainName} marked as fulfilled.`);
    } else {
      showToast('Update failed. Try again.', true);
    }
  };

  const filteredOrders = orders.filter(o => statusFilter === 'all' || o.status === statusFilter);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const initials = (user?.displayName?.[0] ?? user?.email?.[0] ?? 'F').toUpperCase();
  const displayName = user?.displayName ?? user?.email?.split('@')[0] ?? 'Founder';

  const SbIcon = ({ children }: { children: React.ReactNode }) => (
    <span className="sb-icon">{children}</span>
  );

  const navItems: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
    { id: 'domain-orders', label: 'Domain Orders', badge: pendingCount, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> },
    { id: 'api-subs', label: 'API Subscriptions', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> },
    { id: 'users', label: 'Users', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
    { id: 'products', label: 'Products', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg> },
    { id: 'analytics', label: 'Analytics', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
    { id: 'settings', label: 'Settings', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
  ];

  const sections: Record<string, Tab[]> = {
    'Overview': ['dashboard'],
    'Orders': ['domain-orders', 'api-subs'],
    'Platform': ['users', 'products', 'analytics'],
    'System': ['settings'],
  };

  if (loading) return null;

  return (
    <div className="founder-root" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div id="cr" ref={crRef} />
      <div id="cd" ref={cdRef} />

      {/* Toast */}
      {toast && (
        <div className={`notif-toast${toast.err ? ' err' : ''}`}>{toast.msg}</div>
      )}

      {/* Fulfil Modal */}
      {fulfilOrder && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setFulfilOrder(null); }}>
          <div className="modal-card">
            <button className="modal-close" onClick={() => setFulfilOrder(null)}>×</button>
            <div className="modal-title">Fulfil Domain Order</div>
            <div className="modal-sub">Register &ldquo;{fulfilOrder.domainName}&rdquo; on name.com for {fulfilOrder.userEmail}, then enter the details below.</div>
            <label className="fl">Domain name</label>
            <input className="fi" readOnly value={fulfilOrder.domainName} />
            <label className="fl">Name.com Order ID</label>
            <input className="fi" placeholder="e.g. 123456789" value={fulfilNcId} onChange={e => setFulfilNcId(e.target.value)} />
            <label className="fl">Internal notes (optional)</label>
            <textarea className="fi ta" placeholder="Any notes about this registration..." value={fulfilNotes} onChange={e => setFulfilNotes(e.target.value)} />
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button className="btn gold-btn" style={{ flex: 1 }} onClick={submitFulfilment} disabled={fulfilLoading}>
                {fulfilLoading ? 'Saving…' : '✓ Mark as fulfilled'}
              </button>
              <button className="btn ghost" onClick={() => setFulfilOrder(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailOrder && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setDetailOrder(null); }}>
          <div className="modal-card">
            <button className="modal-close" onClick={() => setDetailOrder(null)}>×</button>
            <div className="modal-title">{detailOrder.domainName}</div>
            <div className="modal-sub">Order ID: {detailOrder.id}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', fontFamily: "'DM Mono',monospace", fontSize: 10.5, color: 'rgba(255,255,255,0.6)', lineHeight: 2 }}>
              <div><div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, marginBottom: 4 }}>USER</div>{detailOrder.userEmail}</div>
              <div><div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, marginBottom: 4 }}>NAME</div>{detailOrder.contact?.firstName} {detailOrder.contact?.lastName}</div>
              <div><div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, marginBottom: 4 }}>PHONE</div>{detailOrder.contact?.phone ?? '—'}</div>
              <div><div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, marginBottom: 4 }}>YEARS</div>{detailOrder.years} year{detailOrder.years > 1 ? 's' : ''}</div>
              <div style={{ gridColumn: '1/-1' }}><div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, marginBottom: 4 }}>ADDRESS</div>{detailOrder.contact?.address}, {detailOrder.contact?.city}, {detailOrder.contact?.state}</div>
              <div><div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, marginBottom: 4 }}>ORDERED</div>{fmtDate(detailOrder.orderedAt)}</div>
              <div><div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, marginBottom: 4 }}>STATUS</div>{detailOrder.status}</div>
            </div>
            <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
              <button className="btn gold-btn" style={{ flex: 1 }} onClick={() => { setDetailOrder(null); setFulfilOrder(detailOrder); setFulfilNcId(''); setFulfilNotes(''); }}>Fulfil order</button>
              <button className="btn ghost" onClick={() => setDetailOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="layout">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sb-logo">
            <div className="sb-logo-word">C<em>L</em>IVE</div>
            <div className="sb-logo-tag">Founder Access</div>
          </div>
          <nav className="sb-nav">
            {Object.entries(sections).map(([sectionLabel, tabs]) => (
              <React.Fragment key={sectionLabel}>
                <div className="sb-section">{sectionLabel}</div>
                {tabs.map(id => {
                  const item = navItems.find(n => n.id === id)!;
                  return (
                    <button key={id} className={`sb-item${activeTab === id ? ' active' : ''}`} onClick={() => setActiveTab(id)}>
                      <SbIcon>{item.icon}</SbIcon>
                      {item.label}
                      {item.badge ? <span className="sb-badge">{item.badge}</span> : null}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </nav>
          <div className="sb-footer">
            <div className="sb-user">
              <div className="sb-avatar">{initials}</div>
              <div>
                <div className="sb-uname">{displayName}</div>
                <div className="sb-uemail">Founder</div>
              </div>
            </div>
            <button className="sb-signout" onClick={handleSignOut}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign out
            </button>
          </div>
        </div>

        {/* Main */}
        <div className="main">

          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <>
              <div className="topbar">
                <div className="topbar-title">Dashboard</div>
                <div className="topbar-right">
                  {pendingCount > 0 && (
                    <button className="tb-btn gold" onClick={() => setActiveTab('domain-orders')}>⚡ Process orders</button>
                  )}
                </div>
              </div>
              <div className="page-content">
                {pendingCount > 0 && (
                  <div className="alert-banner warn">
                    <span style={{ fontSize: 18 }}>⏳</span>
                    <div className="alert-text">
                      <strong>{pendingCount} domain order{pendingCount > 1 ? 's' : ''}</strong> waiting to be processed. Register on Name.com and mark as fulfilled.
                      <button className="btn sm gold-btn" style={{ marginLeft: 12 }} onClick={() => setActiveTab('domain-orders')}>View orders →</button>
                    </div>
                  </div>
                )}
                <div className="grid-4" style={{ marginBottom: 24 }}>
                  <div className={`stat-card${pendingCount > 0 ? ' urgent' : ''}`}>
                    <div className="stat-label">Pending domain orders</div>
                    <div className={`stat-num${pendingCount > 0 ? ' urgent-n' : ''}`}>{stats?.pendingDomainOrders ?? 0}</div>
                    <div className="stat-sub">Awaiting your action</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Total users</div>
                    <div className="stat-num">{stats?.totalUsers ?? 0}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">API subscriptions</div>
                    <div className="stat-num">{stats?.activeSubscriptions ?? 0}</div>
                    <div className="stat-sub">Active</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Total domain orders</div>
                    <div className="stat-num">{stats?.totalDomainOrders ?? 0}</div>
                  </div>
                </div>
                <div className="grid-2" style={{ marginBottom: 24 }}>
                  <div className="card-lg">
                    <div className="sec-head">
                      <div>
                        <div className="sec-label">Needs action</div>
                        <div className="sec-title">Domain Orders</div>
                      </div>
                      <button className="btn ghost btn sm" onClick={() => setActiveTab('domain-orders')}>View all</button>
                    </div>
                    <table className="tbl">
                      <thead><tr><th>Domain</th><th>Ordered</th><th>Status</th><th></th></tr></thead>
                      <tbody>
                        {orders.slice(0, 4).map(o => (
                          <tr key={o.id}>
                            <td><div className="tbl-main">{o.domainName}</div></td>
                            <td><div className="tbl-sub">{fmtShort(o.orderedAt)}</div></td>
                            <td><span className={`badge ${o.status}`}><span className="badge-dot" />{o.status}</span></td>
                            <td><button className="act-btn gold-act" onClick={() => { setFulfilOrder(o); setFulfilNcId(''); setFulfilNotes(''); }}>Fulfil</button></td>
                          </tr>
                        ))}
                        {orders.length === 0 && <tr><td colSpan={4} style={{ color: 'rgba(255,255,255,0.2)', fontFamily: "'DM Mono',monospace", fontSize: 10, textAlign: 'center', padding: '24px 0' }}>No orders yet.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                  <div className="card-lg">
                    <div className="sec-head">
                      <div>
                        <div className="sec-label">Growth</div>
                        <div className="sec-title">User Signups</div>
                      </div>
                    </div>
                    <Chart data={[1,2,1,3,2,4,3,5,4,7,9,stats?.totalUsers ?? 14]} />
                    <ChartLabels />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Domain Orders */}
          {activeTab === 'domain-orders' && (
            <>
              <div className="topbar">
                <div className="topbar-title">Domain Orders</div>
                <div className="topbar-right">
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>EARLY ACCESS · FREE FOR USERS</span>
                </div>
              </div>
              <div className="page-content">
                <div className="alert-banner info" style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: 18 }}>ℹ</span>
                  <div className="alert-text">Register each domain manually on <strong>name.com</strong>, then click Fulfil to mark it complete.</div>
                </div>
                <div className="filter-row">
                  {['pending','processing','fulfilled','failed','all'].map(s => (
                    <button key={s} className={`filter-pill${statusFilter === s ? ' active' : ''}`} onClick={() => setStatusFilter(s)}>{s}</button>
                  ))}
                </div>
                <div className="card-lg">
                  <table className="tbl">
                    <thead><tr><th>Domain</th><th>User</th><th>Ordered</th><th>Yrs</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {filteredOrders.map(o => (
                        <tr key={o.id}>
                          <td><div className="tbl-main">{o.domainName}</div></td>
                          <td><div className="tbl-sub">{o.userEmail}</div></td>
                          <td><div className="tbl-sub">{fmtShort(o.orderedAt)}</div></td>
                          <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{o.years}yr</td>
                          <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 10.5 }}>{fmtZAR(o.priceZAR)}</td>
                          <td><span className={`badge ${o.status}`}><span className="badge-dot" />{o.status}</span></td>
                          <td>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button className="act-btn" onClick={() => setDetailOrder(o)}>View</button>
                              {o.status !== 'fulfilled' && (
                                <button className="act-btn gold-act" onClick={() => { setFulfilOrder(o); setFulfilNcId(''); setFulfilNotes(''); }}>Fulfil</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredOrders.length === 0 && (
                        <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.2)', fontFamily: "'DM Mono',monospace", fontSize: 10 }}>No orders with status &ldquo;{statusFilter}&rdquo;.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* API Subs */}
          {activeTab === 'api-subs' && (
            <>
              <div className="topbar"><div className="topbar-title">API Subscriptions</div></div>
              <div className="page-content">
                <div className="grid-3" style={{ marginBottom: 24 }}>
                  <div className="stat-card"><div className="stat-label">Total active</div><div className="stat-num">{stats?.activeSubscriptions ?? 0}</div></div>
                  <div className="stat-card"><div className="stat-label">Live products</div><div className="stat-num">{stats?.liveProducts ?? 0}</div></div>
                  <div className="stat-card"><div className="stat-label">Revenue (ZAR)</div><div className="stat-num" style={{ fontSize: 30 }}>{fmtZAR(stats?.totalRevenue ?? 0)}</div></div>
                </div>
                <div className="card-lg">
                  <p style={{ fontFamily: "'Libre Baskerville',serif", fontStyle: 'italic', fontSize: 13, color: 'rgba(255,255,255,0.3)', lineHeight: 1.7 }}>
                    Live subscription data loads from Firestore via the API. Detailed subscription analytics coming soon.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Users */}
          {activeTab === 'users' && (
            <>
              <div className="topbar"><div className="topbar-title">Users</div></div>
              <div className="page-content">
                <div className="grid-3" style={{ marginBottom: 24 }}>
                  <div className="stat-card"><div className="stat-label">Total registered</div><div className="stat-num">{stats?.totalUsers ?? 0}</div></div>
                  <div className="stat-card"><div className="stat-label">Live products</div><div className="stat-num">{stats?.liveProducts ?? 0}</div></div>
                  <div className="stat-card"><div className="stat-label">Active API subs</div><div className="stat-num">{stats?.activeSubscriptions ?? 0}</div></div>
                </div>
                <div className="card-lg">
                  <p style={{ fontFamily: "'Libre Baskerville',serif", fontStyle: 'italic', fontSize: 13, color: 'rgba(255,255,255,0.3)', lineHeight: 1.7 }}>
                    Detailed user management coming soon.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Products */}
          {activeTab === 'products' && (
            <>
              <div className="topbar"><div className="topbar-title">Products</div></div>
              <div className="page-content">
                <div className="card-lg">
                  <p style={{ fontFamily: "'Libre Baskerville',serif", fontStyle: 'italic', fontSize: 13, color: 'rgba(255,255,255,0.3)', lineHeight: 1.7 }}>
                    Product management coming soon.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Analytics */}
          {activeTab === 'analytics' && (
            <>
              <div className="topbar"><div className="topbar-title">Analytics</div></div>
              <div className="page-content">
                <div className="grid-4" style={{ marginBottom: 24 }}>
                  <div className="stat-card"><div className="stat-label">Domain orders</div><div className="stat-num">{stats?.totalDomainOrders ?? 0}</div></div>
                  <div className="stat-card"><div className="stat-label">Active subs</div><div className="stat-num">{stats?.activeSubscriptions ?? 0}</div></div>
                  <div className="stat-card"><div className="stat-label">Users</div><div className="stat-num">{stats?.totalUsers ?? 0}</div></div>
                  <div className="stat-card"><div className="stat-label">Revenue</div><div className="stat-num" style={{ fontSize: 28 }}>{fmtZAR(stats?.totalRevenue ?? 0)}</div></div>
                </div>
                <div className="card-lg">
                  <div className="sec-head"><div><div className="sec-label">Platform</div><div className="sec-title">API calls — last 12 months</div></div></div>
                  <Chart data={[800,1100,950,1400,1280,1650,1420,1900,1810,2400,2800,3400]} />
                  <ChartLabels />
                </div>
              </div>
            </>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <>
              <div className="topbar"><div className="topbar-title">Settings</div></div>
              <div className="page-content">
                <div className="card-lg" style={{ maxWidth: 600, marginBottom: 24 }}>
                  <div className="sec-label" style={{ marginBottom: 20 }}>Name.com credentials</div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderLeft: '3px solid rgba(91,148,210,0.5)', borderRadius: '0 12px 12px 0', padding: '14px 18px', marginBottom: 12 }}>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 6, letterSpacing: '0.12em', textTransform: 'uppercase' }}>NAMECOM_USERNAME</div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: 'rgba(91,148,210,0.8)' }}>Set in apphosting.yaml · Secret Manager</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderLeft: '3px solid rgba(91,148,210,0.5)', borderRadius: '0 12px 12px 0', padding: '14px 18px' }}>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 6, letterSpacing: '0.12em', textTransform: 'uppercase' }}>NAMECOM_API_TOKEN</div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: 'rgba(91,148,210,0.8)' }}>Set in apphosting.yaml · Secret Manager</div>
                  </div>
                </div>
                <div className="card-lg" style={{ maxWidth: 600 }}>
                  <div className="sec-label" style={{ marginBottom: 20 }}>Account</div>
                  <button className="btn" style={{ background: 'rgba(220,80,80,0.12)', color: 'rgba(220,80,80,0.85)', border: '1px solid rgba(220,80,80,0.2)' }} onClick={handleSignOut}>
                    Sign out of founder panel
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
