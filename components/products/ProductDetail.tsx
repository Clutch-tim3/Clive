'use client';
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Product, AcquireTier, getAcquireTiers, products } from '@/lib/products';
import { ShimmerBlock } from '../ui/ShimmerBlock';
import { EndpointList } from '../ui/EndpointList';
import { PricingTiers } from '../ui/PricingTiers';

interface ProductDetailProps { product: Product; }
type AcqStatus = 'loading' | 'not_acquired' | 'acquired_free' | 'acquired_paid';
function fmt(cents: number) { return `R${(cents / 100).toFixed(0)}`; }

// ── Acquire Modal ─────────────────────────────────────────────────────────────
function AcquireModal({ product, onClose, onAcquired, initialTier }: {
  product: Product; onClose: () => void; onAcquired: (k: string) => void; initialTier?: AcquireTier;
}) {
  const tiers = getAcquireTiers(product.slug);
  const [sel,  setSel]  = useState<AcquireTier>(initialTier ?? tiers[0]);
  const [step, setStep] = useState<'tiers'|'payment'|'success'>('tiers');
  const [busy, setBusy] = useState(false);
  const [err,  setErr]  = useState('');
  const [key,  setKey]  = useState('');

  const acquireFree = async () => {
    setBusy(true); setErr('');
    try {
      const res  = await fetch('/api/subscriptions', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ productId: product.slug, tierId:'free' }) });
      const data = await res.json();
      if (res.status === 409 && data.apiKey) { setKey(data.apiKey); setStep('success'); onAcquired(data.apiKey); return; }
      if (!res.ok) { setErr(data.error ?? 'Acquisition failed.'); return; }
      setKey(data.apiKey); setStep('success'); onAcquired(data.apiKey);
    } catch { setErr('Network error. Please try again.'); }
    finally { setBusy(false); }
  };

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.72)', backdropFilter:'blur(4px)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <div style={{ width:'100%', maxWidth:'560px', background:'rgba(255,255,255,0.07)', backdropFilter:'blur(32px) saturate(180%)', borderTop:'1.5px solid rgba(255,255,255,0.22)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'20px', padding:'40px 44px', position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute', top:'18px', right:'22px', background:'none', border:'none', color:'rgba(255,255,255,0.3)', fontFamily:"'DM Mono',monospace", fontSize:'20px', cursor:'pointer', lineHeight:1 }}>×</button>

        {step === 'success' && (
          <div style={{ textAlign:'center' }}>
            <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:'rgba(80,200,120,0.15)', border:'1.5px solid rgba(80,200,120,0.5)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', fontSize:'24px', color:'rgba(80,200,120,0.9)' }}>✓</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'28px', color:'#fff', marginBottom:'8px' }}>You now have access to {product.name}.</div>
            <div style={{ fontFamily:"'Libre Baskerville',serif", fontStyle:'italic', fontSize:'13px', color:'rgba(255,255,255,0.4)', marginBottom:'20px' }}>Your API key is ready.</div>
            <div style={{ background:'rgba(0,0,0,0.4)', border:'1px solid rgba(91,148,210,0.25)', borderLeft:'3px solid rgba(91,148,210,0.6)', borderRadius:'0 8px 8px 0', padding:'12px 16px', fontFamily:"'DM Mono',monospace", fontSize:'11px', color:'rgba(91,148,210,0.85)', wordBreak:'break-all', marginBottom:'24px', textAlign:'left' }}>{key}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              <Link href="/dashboard/apis" style={{ display:'block', padding:'13px', background:'#1B305B', border:'1px solid rgba(91,148,210,0.35)', borderRadius:'10px', fontFamily:"'DM Mono',monospace", fontSize:'10.5px', letterSpacing:'0.1em', textTransform:'uppercase', color:'white', textDecoration:'none', textAlign:'center' }}>View in My APIs →</Link>
              <button onClick={onClose} style={{ padding:'12px', background:'transparent', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'10px', fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.4)', cursor:'pointer' }}>Close</button>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div>
            <button onClick={() => setStep('tiers')} style={{ background:'none', border:'none', fontFamily:"'DM Mono',monospace", fontSize:'9px', letterSpacing:'0.1em', color:'rgba(91,148,210,0.7)', cursor:'pointer', marginBottom:'24px', padding:0 }}>← Choose plan</button>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(91,148,210,0.65)', marginBottom:'20px' }}>Payment method</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'24px' }}>
              <button style={{ padding:'16px 20px', background:'rgba(254,196,57,0.1)', border:'1px solid rgba(254,196,57,0.3)', borderRadius:'12px', fontFamily:"'DM Mono',monospace", fontSize:'11px', color:'rgba(254,196,57,0.85)', cursor:'pointer' }}>PayPal</button>
              <button style={{ padding:'16px 20px', background:'rgba(91,148,210,0.08)', border:'1px solid rgba(91,148,210,0.3)', borderRadius:'12px', fontFamily:"'DM Mono',monospace", fontSize:'11px', color:'rgba(91,148,210,0.9)', cursor:'pointer' }}>🏦 South African bank (Stitch)</button>
            </div>
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', paddingTop:'16px', fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.35)', lineHeight:1.9 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}><span>{product.name}</span><span>{sel.name}</span></div>
              <div style={{ display:'flex', justifyContent:'space-between' }}><span>Monthly total</span><span style={{ color:'#fff' }}>{fmt(sel.priceZAR)}/mo</span></div>
            </div>
            <div style={{ marginTop:'12px', fontFamily:"'DM Mono',monospace", fontSize:'7.5px', color:'rgba(255,255,255,0.2)', textAlign:'center' }}>Secure payment · Billed monthly · Cancel anytime</div>
          </div>
        )}

        {step === 'tiers' && (
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'32px', color:'#fff', marginBottom:'4px' }}>Acquire {product.name}</div>
            <div style={{ fontFamily:"'Libre Baskerville',serif", fontStyle:'italic', fontSize:'14px', color:'rgba(255,255,255,0.38)', marginBottom:'24px' }}>Choose your plan.</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'24px' }}>
              {tiers.map(t => {
                const on = sel.id === t.id;
                return (
                  <div key={t.id} onClick={() => setSel(t)} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'16px 20px', background: on ? 'rgba(27,48,91,0.45)' : 'rgba(255,255,255,0.04)', border: on ? '1.5px solid rgba(91,148,210,0.45)' : '1px solid rgba(255,255,255,0.08)', borderRadius:'12px', cursor:'pointer', transition:'all .18s' }}>
                    <div style={{ width:'16px', height:'16px', borderRadius:'50%', border: on ? '2px solid rgba(91,148,210,0.9)' : '2px solid rgba(255,255,255,0.2)', background: on ? 'rgba(91,148,210,0.9)' : 'transparent', flexShrink:0, transition:'all .15s' }} />
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'2px' }}>
                        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:'11px', color:'#fff' }}>{t.name}</span>
                        {t.isFeatured && <span style={{ fontFamily:"'DM Mono',monospace", fontSize:'7.5px', letterSpacing:'0.1em', background:'rgba(91,148,210,0.15)', border:'1px solid rgba(91,148,210,0.35)', color:'rgba(91,148,210,0.85)', padding:'2px 7px', borderRadius:'100px' }}>RECOMMENDED</span>}
                      </div>
                      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', color:'rgba(255,255,255,0.35)' }}>
                        {typeof t.callsPerMonth === 'number' ? t.callsPerMonth.toLocaleString() : t.callsPerMonth} calls/month
                      </div>
                    </div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'22px', color:'#fff' }}>{t.priceZAR === 0 ? 'Free' : `${fmt(t.priceZAR)}/mo`}</div>
                  </div>
                );
              })}
            </div>
            {err && <div style={{ padding:'10px 14px', background:'rgba(255,80,80,0.08)', border:'1px solid rgba(255,80,80,0.2)', borderRadius:'8px', fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,130,130,0.9)', marginBottom:'16px' }}>{err}</div>}
            <button onClick={sel.priceZAR === 0 ? acquireFree : () => setStep('payment')} disabled={busy} style={{ width:'100%', padding:'14px', background: busy ? 'rgba(27,48,91,0.4)' : '#1B305B', border:'1.5px solid rgba(91,148,210,0.35)', borderRadius:'12px', fontFamily:"'DM Mono',monospace", fontSize:'10.5px', letterSpacing:'0.1em', textTransform:'uppercase', color: busy ? 'rgba(255,255,255,0.4)' : 'white', cursor: busy ? 'default' : 'pointer', transition:'background .2s', marginBottom:'10px' }}>
              {busy ? '···' : sel.priceZAR === 0 ? 'Acquire for free →' : 'Continue to payment →'}
            </button>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'8px', color:'rgba(255,255,255,0.22)', textAlign:'center' }}>
              {sel.priceZAR === 0 ? 'No credit card required. Cancel anytime.' : 'Billed monthly. Cancel anytime.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function ProductDetail({ product }: ProductDetailProps) {
  const router    = useRouter();
  const isPartner = product.listingType === 'partner';
  const [acqStatus, setAcqStatus] = useState<AcqStatus>('loading');
  const [showModal, setShowModal] = useState(false);
  const [modalTier, setModalTier] = useState<AcquireTier|undefined>(undefined);

  const catLabels = { ml:'ML Model', api:'Developer API', ext:'Chrome Extension', app:'Web Application' };
  const chanLabels: Record<string,string> = { direct:'Clive Direct', rapidapi:'RapidAPI', aws:'AWS Marketplace', gumroad:'Gumroad', 'chrome-store':'Chrome Web Store' };

  const checkStatus = useCallback(async () => {
    try {
      const res  = await fetch('/api/subscriptions');
      if (!res.ok) { setAcqStatus('not_acquired'); return; }
      const data = await res.json() as { subscriptions?: any[] };
      const sub  = data.subscriptions?.find((s: any) => s.productId === product.slug);
      if (!sub) setAcqStatus('not_acquired');
      else if (sub.priceZAR === 0) setAcqStatus('acquired_free');
      else setAcqStatus('acquired_paid');
    } catch { setAcqStatus('not_acquired'); }
  }, [product.slug]);

  useEffect(() => { checkStatus(); }, [checkStatus]);

  const openModal = (tier?: AcquireTier) => { setModalTier(tier); setShowModal(true); };

  const AcqBtn = () => {
    if (isPartner) return null;
    if (acqStatus === 'loading') return <div style={{ width:'140px', height:'44px', borderRadius:'100px', background:'rgba(255,255,255,0.05)' }} />;
    if (acqStatus === 'acquired_paid') return (
      <button onClick={() => router.push('/dashboard/apis')} style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'12px 24px', background:'rgba(80,200,120,0.12)', border:'1.5px solid rgba(80,200,120,0.4)', borderRadius:'100px', fontFamily:"'DM Mono',monospace", fontSize:'10px', letterSpacing:'0.1em', color:'rgba(80,200,120,0.9)', cursor:'pointer' }}>
        ✓ Active — View in My APIs
      </button>
    );
    if (acqStatus === 'acquired_free') return (
      <div style={{ display:'flex', gap:'10px', alignItems:'center', flexWrap:'wrap' }}>
        <button onClick={() => router.push('/dashboard/apis')} style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'12px 24px', background:'rgba(27,48,91,0.4)', border:'1.5px solid rgba(91,148,210,0.4)', borderRadius:'100px', fontFamily:"'DM Mono',monospace", fontSize:'10px', letterSpacing:'0.1em', color:'rgba(91,148,210,0.9)', cursor:'pointer' }}>
          ✓ Acquired — View in My APIs
        </button>
        <button onClick={() => openModal(getAcquireTiers(product.slug)[1])} style={{ padding:'11px 22px', background:'transparent', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'100px', fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.45)', cursor:'pointer' }}>
          Upgrade plan
        </button>
      </div>
    );
    return <button onClick={() => openModal()} className="side-cta" style={{ display:'inline-block', width:'auto', padding:'12px 28px', marginBottom:0, cursor:'pointer' }}>Acquire</button>;
  };

  return (
    <div className="detail-page">
      <div className="detail-mesh" /><div className="detail-scan" />

      <section style={{ padding:'96px 48px 72px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-7xl mx-auto" style={{ display:'grid', gridTemplateColumns:'1fr 420px', gap:'80px', alignItems:'start' }}>
          <div>
            <Link href="/#products" className="detail-back">← All products</Link>
            <div className="detail-cat">{catLabels[product.category]}</div>
            <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(54px,7vw,92px)', fontWeight:300, color:'white', marginBottom:'18px', letterSpacing:'-0.03em', lineHeight:1 }}>{product.name}</h1>
            <p style={{ fontSize:'17px', fontStyle:'italic', color:'rgba(255,255,255,0.45)', lineHeight:1.75, maxWidth:'500px', marginBottom:'36px', fontFamily:'Libre Baskerville,serif' }}>{product.tagline}</p>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
              <AcqBtn />
              {isPartner && <a href={`https://apilayer.com/marketplace/${product.slug}`} target="_blank" rel="noopener noreferrer" className="side-cta" style={{ display:'inline-block', width:'auto', padding:'12px 28px', marginBottom:0 }}>Get on APIlayer →</a>}
              <Link href="/docs" className="side-cta-ghost" style={{ display:'inline-block', width:'auto', padding:'11px 28px' }}>Documentation</Link>
            </div>
          </div>

          <div className="detail-side">
            <ShimmerBlock variant="lg-strong">
              <div style={{ padding:'40px' }}>
                <div style={{ fontFamily:'DM Mono,monospace', fontSize:'9.5px', color:'rgba(255,255,255,0.2)', marginBottom:'8px', letterSpacing:'0.12em', textTransform:'uppercase' }}>{product.pricing.label}</div>
                <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'62px', fontWeight:300, color:'white', lineHeight:1, marginBottom:'4px', letterSpacing:'-0.03em' }}>{product.pricing.display}</div>
                <div style={{ fontFamily:'DM Mono,monospace', fontSize:'10px', color:'rgba(255,255,255,0.25)', marginBottom:'28px' }}>{product.pricing.unit}</div>
                <hr style={{ borderColor:'rgba(255,255,255,0.08)', marginBottom:'28px' }} />
                <ul style={{ display:'flex', flexDirection:'column', gap:'12px', marginBottom:'28px', listStyle:'none', padding:0 }}>
                  {product.features.slice(0, 4).map((f, i) => (
                    <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:'12px' }}>
                      <span style={{ fontFamily:'DM Mono,monospace', fontSize:'11px', color:'rgba(91,148,210,0.65)', marginTop:'2px', flexShrink:0 }}>–</span>
                      <span style={{ fontSize:'12.5px', fontFamily:'Libre Baskerville,serif', color:'rgba(255,255,255,0.38)', lineHeight:1.6 }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                  {isPartner
                    ? <a href={`https://apilayer.com/marketplace/${product.slug}`} target="_blank" rel="noopener noreferrer" className="side-cta">Get on APIlayer →</a>
                    : <button onClick={() => acqStatus === 'acquired_free' || acqStatus === 'acquired_paid' ? router.push('/dashboard/apis') : openModal()} className="side-cta" style={{ cursor:'pointer', textAlign:'center' }}>
                        {acqStatus === 'acquired_free' || acqStatus === 'acquired_paid' ? '✓ View in My APIs' : 'Acquire'}
                      </button>
                  }
                  <Link href="/docs" className="side-cta-ghost">View documentation</Link>
                </div>
              </div>
            </ShimmerBlock>
          </div>
        </div>
      </section>

      <div style={{ maxWidth:'1300px', margin:'0 auto', padding:'80px 48px 120px', display:'grid', gridTemplateColumns:'1fr 420px', gap:'80px', alignItems:'start' }}>
        <div>
          {/* Overview */}
          <div style={{ marginBottom:'80px' }}>
            <div style={{ fontFamily:'DM Mono,monospace', fontSize:'9.5px', letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(91,148,210,0.65)', marginBottom:'24px', display:'flex', alignItems:'center', gap:'12px' }}>
              <span style={{ width:'18px', height:'1px', background:'rgba(91,148,210,0.5)', flexShrink:0 }} />Overview
            </div>
            <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'38px', fontWeight:300, color:'white', marginBottom:'20px', letterSpacing:'-0.02em' }}>{product.overview.title}</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              {product.overview.body.map((p, i) => <p key={i} style={{ fontSize:'14px', lineHeight:1.9, color:'rgba(255,255,255,0.5)', fontFamily:'Libre Baskerville,serif' }}>{p}</p>)}
            </div>
          </div>

          {/* Endpoints */}
          <div style={{ marginBottom:'80px' }}>
            <div style={{ fontFamily:'DM Mono,monospace', fontSize:'9.5px', letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(91,148,210,0.65)', marginBottom:'24px', display:'flex', alignItems:'center', gap:'12px' }}>
              <span style={{ width:'18px', height:'1px', background:'rgba(91,148,210,0.5)', flexShrink:0 }} />Endpoints / Capabilities
            </div>
            <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'38px', fontWeight:300, color:'white', marginBottom:'24px', letterSpacing:'-0.02em' }}>API endpoints</h2>
            <EndpointList endpoints={product.endpoints} />
          </div>

          {/* Pricing */}
          <div>
            <div style={{ fontFamily:'DM Mono,monospace', fontSize:'9.5px', letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(91,148,210,0.65)', marginBottom:'24px', display:'flex', alignItems:'center', gap:'12px' }}>
              <span style={{ width:'18px', height:'1px', background:'rgba(91,148,210,0.5)', flexShrink:0 }} />Pricing
            </div>
            <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'38px', fontWeight:300, color:'white', marginBottom:'24px', letterSpacing:'-0.02em' }}>Pricing tiers</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'32px' }}>
              {getAcquireTiers(product.slug).map(t => {
                const isFree  = t.priceZAR === 0;
                const isCurr  = (acqStatus === 'acquired_free' && t.id === 'free') || (acqStatus === 'acquired_paid' && !isFree);
                return (
                  <div key={t.id} style={{ display:'flex', alignItems:'center', gap:'16px', justifyContent:'space-between', padding:'18px 24px', background: t.isFeatured ? 'rgba(27,48,91,0.35)' : 'rgba(255,255,255,0.03)', border: t.isFeatured ? '1.5px solid rgba(91,148,210,0.3)' : '1px solid rgba(255,255,255,0.07)', borderRadius:'14px' }}>
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                        <span style={{ fontFamily:'DM Mono,monospace', fontSize:'11px', color:'#fff' }}>{t.name}</span>
                        {t.isFeatured && <span style={{ fontFamily:'DM Mono,monospace', fontSize:'7.5px', letterSpacing:'0.1em', background:'rgba(91,148,210,0.12)', border:'1px solid rgba(91,148,210,0.3)', color:'rgba(91,148,210,0.85)', padding:'2px 7px', borderRadius:'100px' }}>RECOMMENDED</span>}
                      </div>
                      <div style={{ fontFamily:'DM Mono,monospace', fontSize:'9px', color:'rgba(255,255,255,0.3)' }}>
                        {typeof t.callsPerMonth === 'number' ? t.callsPerMonth.toLocaleString() : t.callsPerMonth} calls/month · {t.rateLimit} req/min
                      </div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
                      <div style={{ fontFamily:'Cormorant Garamond,serif', fontWeight:300, fontSize:'28px', color:'#fff' }}>{isFree ? 'Free' : `${fmt(t.priceZAR)}/mo`}</div>
                      {!isPartner && (isCurr
                        ? <span style={{ fontFamily:'DM Mono,monospace', fontSize:'9px', color:'rgba(91,148,210,0.8)' }}>✓ Current</span>
                        : <button onClick={() => openModal(t)} style={{ padding:'8px 18px', background: isFree ? '#1B305B' : 'transparent', border: isFree ? '1px solid rgba(91,148,210,0.35)' : '1px solid rgba(255,255,255,0.15)', borderRadius:'100px', fontFamily:'DM Mono,monospace', fontSize:'9.5px', letterSpacing:'0.08em', color: isFree ? 'white' : 'rgba(255,255,255,0.6)', cursor:'pointer' }}>
                            {isFree ? 'Acquire free' : `Acquire — ${fmt(t.priceZAR)}/mo`}
                          </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <PricingTiers tiers={product.pricing.tiers} />
          </div>
        </div>

        {/* Related APIs */}
        {(() => {
          const related = products
            .filter(p => p.slug !== product.slug && p.category === product.category && p.listingType !== 'partner')
            .slice(0, 3);
          if (related.length === 0) return null;
          return (
            <section aria-label="Related APIs" style={{ marginTop: '80px', paddingTop: '64px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontFamily:'DM Mono,monospace', fontSize:'9.5px', letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(91,148,210,0.65)', marginBottom:'24px', display:'flex', alignItems:'center', gap:'12px' }}>
                <span style={{ width:'18px', height:'1px', background:'rgba(91,148,210,0.5)', flexShrink:0 }} />Related APIs
              </div>
              <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'32px', fontWeight:300, color:'white', marginBottom:'24px', letterSpacing:'-0.02em' }}>
                You might also like
              </h2>
              <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                {related.map(r => (
                  <Link key={r.slug} href={`/products/${r.slug}`} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px', textDecoration:'none', transition:'border-color 0.2s' }}>
                    <div>
                      <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'20px', fontWeight:300, color:'white', marginBottom:'4px' }}>{r.name}</div>
                      <div style={{ fontFamily:'Libre Baskerville,serif', fontStyle:'italic', fontSize:'12px', color:'rgba(255,255,255,0.35)', lineHeight:1.5, maxWidth:'420px' }}>{r.tagline}</div>
                    </div>
                    <span style={{ fontFamily:'DM Mono,monospace', fontSize:'10px', color:'rgba(91,148,210,0.65)', flexShrink:0, marginLeft:'16px' }}>→</span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })()}

        {/* Sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:'12px', position:'sticky', top:'88px' }}>
          <div className="meta-card-dark"><div style={{ fontFamily:'DM Mono,monospace', fontSize:'9px', letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(91,148,210,0.55)', marginBottom:'10px' }}>Category</div><div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'20px', fontWeight:300, color:'white' }}>{catLabels[product.category]}</div></div>
          <div className="meta-card-dark"><div style={{ fontFamily:'DM Mono,monospace', fontSize:'9px', letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(91,148,210,0.55)', marginBottom:'10px' }}>Available on</div><div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>{product.channels.map((c, i) => <div key={i} style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'20px', fontWeight:300, color:'white' }}>{chanLabels[c]}</div>)}</div></div>
          <div className="meta-card-dark"><div style={{ fontFamily:'DM Mono,monospace', fontSize:'9px', letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(91,148,210,0.55)', marginBottom:'10px' }}>Free tier</div><div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'20px', fontWeight:300, color:'white' }}>{product.freeTier}</div></div>
          <div className="meta-card-dark"><div style={{ fontFamily:'DM Mono,monospace', fontSize:'9px', letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(91,148,210,0.55)', marginBottom:'10px' }}>Authentication</div><div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'20px', fontWeight:300, color:'white' }}>API Key (Header)</div></div>
          {product.licence && <div className="meta-card-dark"><div style={{ fontFamily:'DM Mono,monospace', fontSize:'9px', letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(91,148,210,0.55)', marginBottom:'10px' }}>Data licence</div><div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'20px', fontWeight:300, color:'white' }}>{product.licence}</div></div>}
        </div>
      </div>

      {showModal && (
        <AcquireModal
          product={product}
          initialTier={modalTier}
          onClose={() => setShowModal(false)}
          onAcquired={() => { setShowModal(false); setAcqStatus('acquired_free'); }}
        />
      )}
    </div>
  );
}
