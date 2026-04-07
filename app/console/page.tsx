'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// Firebase imported dynamically inside effects to avoid SSR initialisation errors

/* ─── types ─────────────────────────────────────────────── */
type Tab = 'dashboard' | 'add-product' | 'my-products' | 'testing' | 'analytics' | 'earnings' | 'domains';

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
}

interface PricingTier {
  name: string;
  price: string;
  calls: string;
}

/* ─── mock data ──────────────────────────────────────────── */
const mockProducts = [
  { id: 1, name: 'ShieldKit Pro', category: 'Security', calls: 14820, revenue: 2340, status: 'live' },
  { id: 2, name: 'FlowMapper API', category: 'Data', calls: 8540, revenue: 960, status: 'live' },
  { id: 3, name: 'VoicePost SDK', category: 'Media', calls: 3210, revenue: 480, status: 'review' },
];

const mockEarnings = [
  { month: 'Oct', amount: 1200 },
  { month: 'Nov', amount: 1850 },
  { month: 'Dec', amount: 2100 },
  { month: 'Jan', amount: 1720 },
  { month: 'Feb', amount: 2840 },
  { month: 'Mar', amount: 3120 },
  { month: 'Apr', amount: 2480 },
];

const CATEGORIES = ['AI / ML', 'Security', 'Data', 'Finance', 'Media', 'Productivity', 'Developer Tools', 'Utilities'];
const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

/* ─── sub-components ─────────────────────────────────────── */

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: '24px',
      flex: 1,
      minWidth: 0,
    }}>
      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em', marginBottom: '12px', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: '32px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: accent || 'white', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '8px' }}>{sub}</div>}
    </div>
  );
}

function EarningsChart() {
  const max = Math.max(...mockEarnings.map(e => e.amount));
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '28px' }}>
      <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Mono, monospace', marginBottom: '24px' }}>Revenue — last 7 months</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '120px' }}>
        {mockEarnings.map((e, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace' }}>${(e.amount / 1000).toFixed(1)}k</div>
            <div style={{
              width: '100%',
              height: `${(e.amount / max) * 100}%`,
              background: i === mockEarnings.length - 1
                ? 'linear-gradient(180deg, rgba(91,148,210,0.9) 0%, rgba(91,148,210,0.3) 100%)'
                : 'rgba(255,255,255,0.08)',
              borderRadius: '6px 6px 0 0',
              transition: 'all 0.3s',
            }} />
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace' }}>{e.month}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ data }: { data?: any }) {
  const earnings = data?.totalEarningsZAR != null
    ? `R${(data.totalEarningsZAR / 100).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`
    : '$3,120';
  const calls = data?.totalCalls != null
    ? `${(data.totalCalls / 1000).toFixed(1)}k`
    : '26.5k';
  const productCount = data?.productCount ?? '3';
  const subscriberCount = data?.subscriberCount ?? '148';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: 'white', fontWeight: 400, margin: 0 }}>Dashboard</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontSize: '14px' }}>Your provider overview for April 2026</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <StatCard label="Total Earnings" value={earnings} sub="+18% from last month" accent="rgba(91,148,210,1)" />
        <StatCard label="API Calls" value={calls} sub="This month" />
        <StatCard label="Active Products" value={String(productCount)} sub="Live products" />
        <StatCard label="Subscribers" value={String(subscriberCount)} sub="Active subscribers" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <EarningsChart />

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '28px' }}>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Mono, monospace', marginBottom: '20px' }}>Top products by calls</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mockProducts.map((p, i) => {
              const pct = Math.round((p.calls / 26570) * 100);
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{p.name}</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace' }}>{p.calls.toLocaleString()} calls</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'rgba(91,148,210,0.7)', borderRadius: '2px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '28px' }}>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Mono, monospace', marginBottom: '20px' }}>Recent activity</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            { event: 'New subscriber to ShieldKit Pro — Basic plan', time: '2 hours ago', type: 'sub' },
            { event: 'FlowMapper API · 500 error spike (resolved)', time: '5 hours ago', type: 'error' },
            { event: 'Payout processed — $2,840.00', time: '2 days ago', type: 'pay' },
            { event: 'VoicePost SDK submitted for review', time: '3 days ago', type: 'review' },
            { event: 'ShieldKit Pro · 10,000 calls milestone', time: '5 days ago', type: 'milestone' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: item.type === 'error' ? '#ff6b6b' : item.type === 'pay' ? '#5bc47a' : item.type === 'milestone' ? 'rgba(91,148,210,1)' : 'rgba(255,255,255,0.3)'
                }} />
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>{item.event}</span>
              </div>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap', marginLeft: '16px' }}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AddProduct() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [endpoints, setEndpoints] = useState<Endpoint[]>([{ method: 'GET', path: '/v1/', description: '' }]);
  const [tiers, setTiers] = useState<PricingTier[]>([
    { name: 'Free', price: '0', calls: '500' },
    { name: 'Basic', price: '9', calls: '5000' },
    { name: 'Pro', price: '29', calls: '50000' },
  ]);
  const [form, setForm] = useState({
    name: '', tagline: '', category: '', description: '',
    baseUrl: '', version: 'v1', auth: 'api-key',
  });

  const [submitError, setSubmitError] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setLogoFile(file);
    if (file) setLogoPreview(URL.createObjectURL(file));
    else setLogoPreview(null);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      // 1. Upload logo to Firebase Storage if provided
      let logoUrl: string | null = null;
      if (logoFile) {
        const { storage } = await import('@/lib/firebase/client');
        const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
        const ext = logoFile.name.split('.').pop();
        const path = `products/logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, logoFile);
        logoUrl = await getDownloadURL(storageRef);
      }

      // 2. Save product to Firestore via API
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:        form.name,
          tagline:     form.tagline,
          category:    form.category,
          description: form.description,
          baseUrl:     form.baseUrl,
          apiVersion:  form.version,
          authType:    form.auth,
          logoUrl,
          endpoints,
          tiers: tiers.map(t => ({
            ...t,
            priceZAR:      parseFloat(t.price) * 100,
            callsPerMonth: parseInt(t.calls),
          })),
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error || 'Submission failed — please try again');
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'Connection error — please try again');
    } finally {
      setSubmitting(false);
    }
  };

  const addEndpoint = () => setEndpoints(prev => [...prev, { method: 'GET', path: '/v1/', description: '' }]);
  const removeEndpoint = (i: number) => setEndpoints(prev => prev.filter((_, idx) => idx !== i));
  const updateEndpoint = (i: number, field: keyof Endpoint, value: string) => {
    setEndpoints(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));
  };
  const addTier = () => setTiers(prev => [...prev, { name: '', price: '', calls: '' }]);
  const removeTier = (i: number) => setTiers(prev => prev.filter((_, idx) => idx !== i));
  const updateTier = (i: number, field: keyof PricingTier, value: string) => {
    setTiers(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: value } : t));
  };

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: 'white',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'DM Mono, monospace',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: '8px',
    display: 'block',
  };

  const steps = ['Basics', 'Endpoints', 'Pricing', 'Review'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '760px' }}>
      <div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: 'white', fontWeight: 400, margin: 0 }}>Add a product</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontSize: '14px' }}>List your API on Clive and reach developers worldwide</p>
      </div>

      {/* Step indicator */}
      {!submitted && <div style={{ display: 'flex', gap: '0', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '4px', border: '1px solid rgba(255,255,255,0.07)' }}>
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i + 1)} style={{
            flex: 1, padding: '10px', borderRadius: '9px', border: 'none', cursor: 'pointer',
            background: step === i + 1 ? 'rgba(91,148,210,0.2)' : 'transparent',
            color: step === i + 1 ? 'rgba(91,148,210,1)' : 'rgba(255,255,255,0.35)',
            fontSize: '13px', fontFamily: 'DM Mono, monospace',
            transition: 'all 0.2s',
          }}>
            {i + 1}. {s}
          </button>
        ))}
      </div>}

      {/* Step 1: Basics */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Product name</label>
              <input style={inputStyle} placeholder="e.g. ShieldKit Pro" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Tagline</label>
            <input style={inputStyle} placeholder="One sentence that sells it" value={form.tagline} onChange={e => setForm(p => ({ ...p, tagline: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="What does your API do? Who is it for?" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Base URL</label>
              <input style={inputStyle} placeholder="https://api.yourproduct.com" value={form.baseUrl} onChange={e => setForm(p => ({ ...p, baseUrl: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Version</label>
              <input style={inputStyle} placeholder="v1" value={form.version} onChange={e => setForm(p => ({ ...p, version: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Auth type</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.auth} onChange={e => setForm(p => ({ ...p, auth: e.target.value }))}>
                <option value="api-key">API Key</option>
                <option value="oauth2">OAuth 2.0</option>
                <option value="bearer">Bearer Token</option>
                <option value="basic">Basic Auth</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleLogoChange} />
              <div style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Mono, monospace' }}>
                {logoFile ? 'Change logo' : 'Upload logo / icon'}
              </div>
              {logoPreview && (
                <img src={logoPreview} alt="Logo preview" style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.12)' }} />
              )}
              {logoFile && <span style={{ fontSize: '12px', color: 'rgba(91,148,210,0.8)', fontFamily: 'DM Mono, monospace' }}>{logoFile.name}</span>}
            </label>
          </div>
        </div>
      )}

      {/* Step 2: Endpoints */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0 }}>Define the endpoints users will call. You can add more later.</p>
          {endpoints.map((ep, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <select
                  value={ep.method}
                  onChange={e => updateEndpoint(i, 'method', e.target.value)}
                  style={{
                    ...inputStyle, width: '100px', flexShrink: 0,
                    color: ep.method === 'GET' ? '#5bc47a' : ep.method === 'POST' ? 'rgba(91,148,210,1)' : ep.method === 'DELETE' ? '#ff6b6b' : '#f4a942',
                    fontFamily: 'DM Mono, monospace', fontWeight: 500,
                  }}
                >
                  {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <input style={{ ...inputStyle, flex: 1 }} placeholder="/v1/endpoint" value={ep.path} onChange={e => updateEndpoint(i, 'path', e.target.value)} />
                {endpoints.length > 1 && (
                  <button onClick={() => removeEndpoint(i)} style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: '8px', color: '#ff6b6b', padding: '8px 12px', cursor: 'pointer', fontSize: '12px', flexShrink: 0 }}>
                    Remove
                  </button>
                )}
              </div>
              <input style={inputStyle} placeholder="Brief description of what this endpoint does" value={ep.description} onChange={e => updateEndpoint(i, 'description', e.target.value)} />
            </div>
          ))}
          <button onClick={addEndpoint} style={{ alignSelf: 'flex-start', background: 'rgba(91,148,210,0.1)', border: '1px solid rgba(91,148,210,0.2)', borderRadius: '10px', color: 'rgba(91,148,210,1)', padding: '10px 20px', cursor: 'pointer', fontSize: '13px', fontFamily: 'DM Mono, monospace' }}>
            + Add endpoint
          </button>

          <div style={{ marginTop: '8px', padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
            <label style={labelStyle}>Or paste OpenAPI / Swagger spec URL</label>
            <input style={inputStyle} placeholder="https://yourapi.com/openapi.json" />
          </div>
        </div>
      )}

      {/* Step 3: Pricing */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0 }}>Set pricing tiers. Clive takes a 20% platform fee.</p>
          {tiers.map((tier, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
                <div>
                  <label style={labelStyle}>Tier name</label>
                  <input style={inputStyle} placeholder="e.g. Free, Basic, Pro" value={tier.name} onChange={e => updateTier(i, 'name', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Price / month ($)</label>
                  <input style={inputStyle} type="number" placeholder="0" value={tier.price} onChange={e => updateTier(i, 'price', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Calls / month</label>
                  <input style={inputStyle} type="number" placeholder="500" value={tier.calls} onChange={e => updateTier(i, 'calls', e.target.value)} />
                </div>
                {tiers.length > 1 && (
                  <button onClick={() => removeTier(i)} style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: '8px', color: '#ff6b6b', padding: '12px', cursor: 'pointer', fontSize: '12px' }}>
                    ✕
                  </button>
                )}
              </div>
              {tier.price && tier.calls && (
                <div style={{ marginTop: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace' }}>
                  Your payout: ${(parseFloat(tier.price || '0') * 0.8).toFixed(2)}/mo per subscriber · {(parseInt(tier.calls || '0') / 1000).toFixed(1)}k calls
                </div>
              )}
            </div>
          ))}
          <button onClick={addTier} style={{ alignSelf: 'flex-start', background: 'rgba(91,148,210,0.1)', border: '1px solid rgba(91,148,210,0.2)', borderRadius: '10px', color: 'rgba(91,148,210,1)', padding: '10px 20px', cursor: 'pointer', fontSize: '13px', fontFamily: 'DM Mono, monospace' }}>
            + Add tier
          </button>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '28px' }}>
            <div style={{ fontSize: '20px', fontFamily: "'Cormorant Garamond', serif", color: 'white', marginBottom: '20px' }}>
              {form.name || 'Untitled Product'}
              {form.category && <span style={{ fontSize: '12px', marginLeft: '12px', padding: '4px 10px', background: 'rgba(91,148,210,0.15)', color: 'rgba(91,148,210,1)', borderRadius: '100px', fontFamily: 'DM Mono, monospace' }}>{form.category}</span>}
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>{form.description || 'No description provided.'}</p>

            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace', marginBottom: '12px' }}>ENDPOINTS ({endpoints.length})</div>
              {endpoints.map((ep, i) => (
                <div key={i} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', display: 'flex', gap: '12px', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', color: ep.method === 'GET' ? '#5bc47a' : 'rgba(91,148,210,1)', minWidth: '50px' }}>{ep.method}</span>
                  <span style={{ fontFamily: 'DM Mono, monospace' }}>{ep.path}</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)' }}>{ep.description}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace', marginBottom: '12px' }}>PRICING TIERS</div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {tiers.filter(t => t.name).map((t, i) => (
                  <div key={i} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', textAlign: 'center', minWidth: '100px' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace' }}>{t.name}</div>
                    <div style={{ fontSize: '20px', fontFamily: "'Cormorant Garamond', serif", color: 'white', margin: '4px 0' }}>${t.price}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>{parseInt(t.calls).toLocaleString()} calls/mo</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ padding: '16px 20px', background: 'rgba(91,148,210,0.07)', border: '1px solid rgba(91,148,210,0.15)', borderRadius: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
            By submitting, your product will go through a brief review (usually under 24 hours) before being listed on Clive. You agree to the provider terms.
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              padding: '16px 32px', background: submitting ? 'rgba(91,148,210,0.5)' : 'rgba(91,148,210,1)',
              border: 'none', borderRadius: '12px', color: 'white', fontSize: '13px',
              cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'DM Mono, monospace',
              letterSpacing: '0.1em', boxShadow: '0 0 24px rgba(91,148,210,0.3)', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
            {submitting ? (
              <><span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Submitting…</>
            ) : 'Submit for review →'}
          </button>
          {submitError && (
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'rgba(220,80,80,0.9)', fontFamily: 'DM Mono, monospace' }}>
              ✗ {submitError}
            </div>
          )}
        </div>
      )}

      {/* Submitted success screen */}
      {submitted && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '48px 0', gap: '20px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(91,196,122,0.12)', border: '1.5px solid rgba(91,196,122,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
            ✓
          </div>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', color: 'white', fontWeight: 300, margin: 0, marginBottom: '10px' }}>
              {form.name || 'Your product'} is under review.
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto' }}>
              Our team will review your submission and respond within 24 hours. You'll receive an email once it's approved and listed on Clive.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px 32px', width: '100%', maxWidth: '480px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Product', value: form.name || '—' },
                { label: 'Category', value: form.category || '—' },
                { label: 'Endpoints', value: `${endpoints.length} defined` },
                { label: 'Pricing tiers', value: `${tiers.filter(t => t.name).length} tiers` },
                { label: 'Status', value: 'In review', accent: '#f4a942' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace' }}>{row.label}</span>
                  <span style={{ fontSize: '13px', color: row.accent || 'rgba(255,255,255,0.7)' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '480px' }}>
            <button
              onClick={() => { setSubmitted(false); setStep(1); setForm({ name: '', tagline: '', category: '', description: '', baseUrl: '', version: 'v1', auth: 'api-key' }); setEndpoints([{ method: 'GET', path: '/v1/', description: '' }]); }}
              style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '12px', fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em' }}>
              Add another product
            </button>
            <button
              style={{ flex: 1, padding: '14px', background: 'var(--navy, #1B305B)', border: '1px solid rgba(91,148,210,0.35)', borderRadius: '12px', color: 'white', cursor: 'pointer', fontSize: '12px', fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em' }}>
              View my products →
            </button>
          </div>

          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', fontFamily: 'DM Mono, monospace' }}>
            Reference: <span style={{ color: 'rgba(91,148,210,0.6)' }}>CLV-{Math.random().toString(36).slice(2, 10).toUpperCase()}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      {!submitted && (
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px' }}>
          {step > 1
            ? <button onClick={() => setStep(s => s - 1)} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '13px' }}>← Back</button>
            : <span />
          }
          {step < 4 && (() => {
            const step1Incomplete = step === 1 && (!form.name.trim() || !form.category);
            return (
              <button
                onClick={() => { if (!step1Incomplete) setStep(s => s + 1); }}
                disabled={step1Incomplete}
                style={{ padding: '12px 24px', background: step1Incomplete ? 'rgba(255,255,255,0.05)' : 'rgba(91,148,210,0.15)', border: `1px solid ${step1Incomplete ? 'rgba(255,255,255,0.07)' : 'rgba(91,148,210,0.25)'}`, borderRadius: '10px', color: step1Incomplete ? 'rgba(255,255,255,0.25)' : 'rgba(91,148,210,1)', cursor: step1Incomplete ? 'not-allowed' : 'pointer', fontSize: '13px', fontFamily: 'DM Mono, monospace' }}>
                Continue →
              </button>
            );
          })()}
        </div>
      )}
    </div>
  );
}

function MyProducts({ onAddProduct }: { onAddProduct: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: 'white', fontWeight: 400, margin: 0 }}>My products</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontSize: '14px' }}>Manage, update, and monitor your listed APIs</p>
        </div>
        <button onClick={onAddProduct} style={{ padding: '10px 20px', background: 'rgba(91,148,210,0.12)', border: '1px solid rgba(91,148,210,0.25)', borderRadius: '10px', color: 'rgba(91,148,210,1)', cursor: 'pointer', fontSize: '12px', fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap' }}>
          + Add product
        </button>
      </div>

      {mockProducts.length === 0 ? (
        <div style={{ padding: '64px 32px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '16px' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>No products yet.</div>
          <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '14px', color: 'rgba(255,255,255,0.25)', marginBottom: '24px' }}>List your first API and start earning.</p>
          <button onClick={onAddProduct} style={{ padding: '12px 28px', background: 'rgba(91,148,210,0.12)', border: '1px solid rgba(91,148,210,0.25)', borderRadius: '10px', color: 'rgba(91,148,210,1)', cursor: 'pointer', fontSize: '12px', fontFamily: 'DM Mono, monospace' }}>
            Add your first product →
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mockProducts.map((p, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(91,148,210,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                {p.category === 'Security' ? '🛡️' : p.category === 'Data' ? '🔀' : '🎙️'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '15px', color: 'white', fontFamily: "'Cormorant Garamond', serif" }}>{p.name}</span>
                  <span style={{
                    fontSize: '10px', padding: '3px 9px', borderRadius: '100px', fontFamily: 'DM Mono, monospace',
                    background: p.status === 'live' ? 'rgba(91,196,122,0.12)' : 'rgba(244,169,66,0.12)',
                    color: p.status === 'live' ? '#5bc47a' : '#f4a942',
                    border: `1px solid ${p.status === 'live' ? 'rgba(91,196,122,0.2)' : 'rgba(244,169,66,0.2)'}`,
                  }}>
                    {p.status}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>{p.category}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '18px', fontFamily: "'Cormorant Garamond', serif", color: 'white' }}>${p.revenue.toLocaleString()}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace' }}>{p.calls.toLocaleString()} calls this mo</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={onAddProduct} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                <button onClick={() => window.open('/products/' + p.name.toLowerCase().replace(/ /g, '-'), '_blank')} style={{ padding: '8px 16px', background: 'rgba(91,148,210,0.1)', border: '1px solid rgba(91,148,210,0.2)', borderRadius: '8px', color: 'rgba(91,148,210,1)', cursor: 'pointer', fontSize: '12px' }}>View</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Testing() {
  const [selectedProduct, setSelectedProduct] = useState(mockProducts[0].name);
  const [selectedEndpoint, setSelectedEndpoint] = useState('GET /v1/scan');
  const [headers, setHeaders] = useState('{\n  "X-API-Key": "your-api-key-here"\n}');
  const [body, setBody] = useState('{\n  "url": "https://example.com",\n  "depth": 2\n}');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'headers' | 'body' | 'params'>('headers');
  const [copied, setCopied] = useState(false);

  const copyResponse = () => {
    if (!response) return;
    navigator.clipboard.writeText(response).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); });
  };

  const mockEndpoints = ['GET /v1/scan', 'POST /v1/analyze', 'GET /v1/report/{id}', 'DELETE /v1/report/{id}'];

  const runTest = () => {
    setLoading(true);
    setResponse('');
    setTimeout(() => {
      setLoading(false);
      setResponse(JSON.stringify({
        status: 200,
        data: {
          scan_id: "scn_a4f92b1c",
          url: "https://example.com",
          vulnerabilities: [],
          score: 98,
          scanned_at: new Date().toISOString(),
          duration_ms: 843
        }
      }, null, 2));
    }, 1200);
  };

  const tabBtn = (t: 'headers' | 'body' | 'params') => ({
    padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
    background: activeTab === t ? 'rgba(91,148,210,0.15)' : 'transparent',
    color: activeTab === t ? 'rgba(91,148,210,1)' : 'rgba(255,255,255,0.35)',
    fontSize: '12px', fontFamily: 'DM Mono, monospace',
  } as React.CSSProperties);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: 'white', fontWeight: 400, margin: 0 }}>API Testing</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontSize: '14px' }}>Test your endpoints before and after publishing</p>
      </div>

      {/* Product + Endpoint selector */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <select style={{ flex: '0 0 200px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', color: 'white', fontSize: '13px', fontFamily: 'DM Mono, monospace', outline: 'none' }} value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
          {mockProducts.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
        </select>
        <select style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', color: 'white', fontSize: '13px', fontFamily: 'DM Mono, monospace', outline: 'none' }} value={selectedEndpoint} onChange={e => setSelectedEndpoint(e.target.value)}>
          {mockEndpoints.map(ep => <option key={ep} value={ep}>{ep}</option>)}
        </select>
        <button onClick={runTest} disabled={loading} style={{
          padding: '12px 28px', background: loading ? 'rgba(91,148,210,0.3)' : 'rgba(91,148,210,1)',
          border: 'none', borderRadius: '10px', color: 'white', cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '13px', fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap',
          transition: 'all 0.2s',
        }}>
          {loading ? 'Running…' : 'Run test →'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Request panel */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '4px' }}>
            <button onClick={() => setActiveTab('headers')} style={tabBtn('headers')}>Headers</button>
            <button onClick={() => setActiveTab('body')} style={tabBtn('body')}>Body</button>
            <button onClick={() => setActiveTab('params')} style={tabBtn('params')}>Params</button>
          </div>
          <textarea
            value={activeTab === 'headers' ? headers : activeTab === 'body' ? body : '{\n  "limit": 10,\n  "offset": 0\n}'}
            onChange={e => activeTab === 'headers' ? setHeaders(e.target.value) : activeTab === 'body' ? setBody(e.target.value) : null}
            style={{
              width: '100%', minHeight: '280px', background: 'transparent', border: 'none', outline: 'none',
              padding: '20px', color: 'rgba(255,255,255,0.75)', fontSize: '13px',
              fontFamily: 'DM Mono, monospace', lineHeight: 1.6, resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Response panel */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Mono, monospace' }}>Response</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {response && (
                <span style={{ fontSize: '11px', padding: '3px 10px', background: 'rgba(91,196,122,0.12)', color: '#5bc47a', borderRadius: '100px', fontFamily: 'DM Mono, monospace', border: '1px solid rgba(91,196,122,0.2)' }}>
                  200 OK
                </span>
              )}
              {response && (
                <button onClick={copyResponse} style={{ fontSize: '10px', padding: '3px 10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: copied ? '#5bc47a' : 'rgba(255,255,255,0.3)', cursor: 'pointer', fontFamily: 'DM Mono, monospace' }}>
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
              {response && (
                <button onClick={() => setResponse('')} style={{ fontSize: '10px', padding: '3px 10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontFamily: 'DM Mono, monospace' }}>
                  Clear
                </button>
              )}
            </div>
          </div>
          <div style={{ padding: '20px', minHeight: '280px' }}>
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.3)', fontSize: '13px', fontFamily: 'DM Mono, monospace' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(91,148,210,0.8)', animation: 'pulse 1s infinite' }} />
                Sending request…
              </div>
            )}
            {response && !loading && (
              <pre style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontFamily: 'DM Mono, monospace', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {response}
              </pre>
            )}
            {!response && !loading && (
              <div style={{ color: 'rgba(255,255,255,0.15)', fontSize: '13px', fontFamily: 'DM Mono, monospace' }}>Hit "Run test" to see the response</div>
            )}
          </div>
        </div>
      </div>

      {/* Test history */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px' }}>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace', marginBottom: '14px' }}>RECENT TESTS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            { method: 'GET', path: '/v1/scan', status: 200, ms: 843, time: '3 min ago' },
            { method: 'POST', path: '/v1/analyze', status: 422, ms: 112, time: '12 min ago' },
            { method: 'GET', path: '/v1/report/scn_a4f92b1c', status: 200, ms: 234, time: '1 hour ago' },
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '10px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', minWidth: '44px', color: t.method === 'GET' ? '#5bc47a' : 'rgba(91,148,210,1)' }}>{t.method}</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'rgba(255,255,255,0.5)', flex: 1 }}>{t.path}</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: t.status === 200 ? '#5bc47a' : '#ff6b6b' }}>{t.status}</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>{t.ms}ms</span>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>{t.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Analytics() {
  const [analyticsPeriod, setAnalyticsPeriod] = useState('30d');
  const [analyticsProduct, setAnalyticsProduct] = useState('all');
  const selStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '9px 14px', color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontFamily: 'DM Mono, monospace', outline: 'none', cursor: 'pointer' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: 'white', fontWeight: 400, margin: 0 }}>Analytics</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontSize: '14px' }}>Usage, latency, and error tracking across your products</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select style={selStyle} value={analyticsProduct} onChange={e => setAnalyticsProduct(e.target.value)}>
            <option value="all">All products</option>
            {mockProducts.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
          <select style={selStyle} value={analyticsPeriod} onChange={e => setAnalyticsPeriod(e.target.value)}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <StatCard label="Total calls (30d)" value="26.5k" sub="+34% vs prev period" accent="rgba(91,148,210,1)" />
        <StatCard label="Avg latency" value="143ms" sub="p99: 890ms" />
        <StatCard label="Error rate" value="0.4%" sub="Down from 1.2%" />
        <StatCard label="Uptime" value="99.98%" sub="Last 90 days" />
      </div>

      {/* Calls over time */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '28px' }}>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Mono, monospace', marginBottom: '24px' }}>API calls — last 14 days</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '100px' }}>
          {[820, 1100, 940, 1350, 1820, 1640, 980, 2100, 2340, 1890, 2560, 2100, 1980, 2780].map((v, i) => {
            const max = 2780;
            const isToday = i === 13;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{
                  width: '100%', height: `${(v / max) * 100}%`,
                  background: isToday ? 'rgba(91,148,210,0.85)' : 'rgba(255,255,255,0.07)',
                  borderRadius: '4px 4px 0 0',
                }} />
                {i % 7 === 0 && <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', fontFamily: 'DM Mono, monospace' }}>D{i + 1}</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Status codes */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Mono, monospace', marginBottom: '20px' }}>Response codes</div>
          {[
            { code: '2xx Success', count: 24818, pct: 93.7, color: '#5bc47a' },
            { code: '4xx Client error', count: 1274, pct: 4.8, color: '#f4a942' },
            { code: '5xx Server error', count: 108, pct: 0.4, color: '#ff6b6b' },
            { code: '3xx Redirect', count: 300, pct: 1.1, color: 'rgba(91,148,210,1)' },
          ].map((r, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '12px', color: r.color }}>{r.code}</span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace' }}>{r.count.toLocaleString()}</span>
              </div>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
                <div style={{ height: '100%', width: `${r.pct}%`, background: r.color, borderRadius: '2px' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Top consumers */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Mono, monospace', marginBottom: '20px' }}>Top consumers</div>
          {[
            { user: 'acme-corp', calls: 8420, plan: 'Pro' },
            { user: 'devstudio-io', calls: 5180, plan: 'Pro' },
            { user: 'buildfast-hq', calls: 3240, plan: 'Basic' },
            { user: 'anon_9f2a1', calls: 1840, plan: 'Free' },
            { user: 'launchpad_x', calls: 1320, plan: 'Basic' },
          ].map((u, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Mono, monospace' }}>{u.user}</span>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', color: 'rgba(255,255,255,0.3)' }}>{u.plan}</span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Mono, monospace' }}>{u.calls.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Earnings() {
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState<'paypal' | 'stitch'>('paypal');
  const [payoutEmail, setPayoutEmail] = useState('');
  const [payoutSaved, setPayoutSaved] = useState(false);

  const savePayoutMethod = () => {
    if (!payoutEmail) return;
    setPayoutSaved(true);
    setTimeout(() => { setPayoutSaved(false); setShowPayoutModal(false); }, 1400);
  };

  const inputSt: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '11px 14px', color: 'white', fontSize: '13px', fontFamily: 'DM Mono, monospace', outline: 'none', width: '100%', boxSizing: 'border-box' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Payout method modal */}
      {showPayoutModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => { if (e.target === e.currentTarget) setShowPayoutModal(false); }}>
          <div style={{ background: '#0F0F14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '36px', width: '440px', maxWidth: '90vw' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '28px', color: 'white', margin: '0 0 8px' }}>Payout method</h3>
            <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginBottom: '28px' }}>Choose how you receive your earnings.</p>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              {(['paypal', 'stitch'] as const).map(m => (
                <button key={m} onClick={() => setPayoutMethod(m)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: payoutMethod === m ? '1px solid rgba(91,148,210,0.5)' : '1px solid rgba(255,255,255,0.08)', background: payoutMethod === m ? 'rgba(91,148,210,0.1)' : 'rgba(255,255,255,0.03)', color: payoutMethod === m ? 'rgba(91,148,210,1)' : 'rgba(255,255,255,0.45)', cursor: 'pointer', fontFamily: 'DM Mono, monospace', fontSize: '12px', letterSpacing: '0.08em' }}>
                  {m === 'paypal' ? 'PayPal' : 'Stitch (ZA)'}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '9.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>
                {payoutMethod === 'paypal' ? 'PayPal email' : 'Stitch account email'}
              </label>
              <input style={inputSt} type="email" placeholder={payoutMethod === 'paypal' ? 'you@paypal.com' : 'you@bank.co.za'} value={payoutEmail} onChange={e => setPayoutEmail(e.target.value)} />
            </div>

            {payoutMethod === 'stitch' && (
              <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginBottom: '20px', lineHeight: 1.6 }}>
                Stitch is available for South African providers. You will be redirected to authenticate your bank account.
              </p>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowPayoutModal(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '12px', fontFamily: 'DM Mono, monospace' }}>Cancel</button>
              <button onClick={savePayoutMethod} disabled={!payoutEmail} style={{ flex: 2, padding: '12px', background: payoutEmail ? 'rgba(91,148,210,1)' : 'rgba(91,148,210,0.3)', border: 'none', borderRadius: '10px', color: 'white', cursor: payoutEmail ? 'pointer' : 'not-allowed', fontSize: '12px', fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em' }}>
                {payoutSaved ? '✓ Saved' : 'Save payout method'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: 'white', fontWeight: 400, margin: 0 }}>Earnings</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontSize: '14px' }}>Payouts, breakdown, and payout settings</p>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <StatCard label="Available balance" value="$2,496.00" sub="Payout on Apr 15" accent="#5bc47a" />
        <StatCard label="This month" value="$3,120.00" sub="Before 20% platform fee" />
        <StatCard label="All-time earnings" value="$15,510.00" />
        <StatCard label="Next payout" value="Apr 15" sub="Auto via Stripe" />
      </div>

      <EarningsChart />

      {/* Payout history */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Mono, monospace', marginBottom: '20px' }}>Payout history</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            { date: 'Mar 15, 2026', amount: '$2,840.00', net: '$2,272.00', method: 'Stripe', status: 'paid' },
            { date: 'Feb 15, 2026', amount: '$2,100.00', net: '$1,680.00', method: 'Stripe', status: 'paid' },
            { date: 'Jan 15, 2026', amount: '$1,720.00', net: '$1,376.00', method: 'Stripe', status: 'paid' },
            { date: 'Dec 15, 2025', amount: '$2,100.00', net: '$1,680.00', method: 'Stripe', status: 'paid' },
          ].map((p, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', gap: '16px', alignItems: 'center', padding: '14px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{p.date}</span>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Mono, monospace' }}>{p.amount}</span>
              <span style={{ fontSize: '13px', color: 'white', fontFamily: 'DM Mono, monospace' }}>{p.net}</span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{p.method}</span>
              <span style={{ fontSize: '11px', padding: '3px 9px', background: 'rgba(91,196,122,0.1)', color: '#5bc47a', borderRadius: '100px', fontFamily: 'DM Mono, monospace', border: '1px solid rgba(91,196,122,0.2)', display: 'inline-block' }}>{p.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payout settings */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Mono, monospace', marginBottom: '20px' }}>Payout settings</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { label: 'Payout method', value: 'Stripe · **** 4242', editable: true },
            { label: 'Payout schedule', value: 'Monthly (15th)', editable: false },
            { label: 'Tax info', value: 'W-9 on file', editable: false },
            { label: 'Minimum payout', value: '$50.00', editable: false },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{s.label}</span>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontFamily: 'DM Mono, monospace' }}>{s.value}</span>
                {s.editable && <button onClick={() => setShowPayoutModal(true)} style={{ fontSize: '11px', padding: '4px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>Edit</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── my domains ────────────────────────────────────────── */
interface DomainRecord {
  id: string;
  fqdn: string;
  domainName: string;
  tld: string;
  registeredAt: string | null;
  expiresAt: string | null;
  status: string;
  priceZAR: number;
  registrarOrderId: string;
}

function MyDomains() {
  const [domains,  setDomains]  = useState<DomainRecord[]>([]);
  const [fetching, setFetching] = useState(true);
  const [renewingId, setRenewingId] = useState<string | null>(null);

  const load = async () => {
    setFetching(true);
    try {
      const res  = await fetch('/api/domains/list');
      const data = await res.json() as { domains?: DomainRecord[] };
      setDomains(data.domains ?? []);
    } catch { /* ignore */ }
    finally { setFetching(false); }
  };

  useEffect(() => { load(); }, []);

  const handleRenew = async (domainId: string) => {
    setRenewingId(domainId);
    try {
      await fetch('/api/domains/renew', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ domainId, years: 1 }),
      });
      await load();
    } catch { /* ignore */ }
    finally { setRenewingId(null); }
  };

  const fmt = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  const statusColor = (s: string) =>
    s === 'active' ? 'rgba(80,200,120,0.85)' : s === 'expired' ? 'rgba(255,100,100,0.8)' : 'rgba(255,180,0,0.8)';

  return (
    <div>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: 'white', fontWeight: 400, margin: '0 0 8px' }}>My Domains</h2>
      <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '13px', color: 'rgba(255,255,255,0.35)', margin: '0 0 32px' }}>Domains registered through Clive appear here.</p>

      {fetching ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ padding: '18px 24px', background: 'rgba(255,255,255,0.02)', display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div style={{ flex: 1, height: 18, borderRadius: 4, background: 'rgba(255,255,255,0.07)' }} />
              <div style={{ width: 90, height: 18, borderRadius: 4, background: 'rgba(255,255,255,0.05)' }} />
              <div style={{ width: 90, height: 18, borderRadius: 4, background: 'rgba(255,255,255,0.05)' }} />
              <div style={{ width: 64, height: 24, borderRadius: 100, background: 'rgba(255,255,255,0.07)' }} />
              <div style={{ width: 72, height: 32, borderRadius: 100, background: 'rgba(255,255,255,0.07)' }} />
            </div>
          ))}
        </div>
      ) : domains.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 32px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '24px' }}>
          <div style={{ fontSize: '40px', marginBottom: '18px' }}>🌐</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '30px', color: '#fff', marginBottom: '10px' }}>No domains yet.</div>
          <div style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '14px', color: 'rgba(255,255,255,0.35)', marginBottom: '28px' }}>
            Register a domain to give your API a professional home.
          </div>
          <a
            href="/domains"
            style={{ display: 'inline-block', padding: '12px 28px', background: '#1B305B', border: '1.5px solid rgba(91,148,210,0.35)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '10.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'white', textDecoration: 'none' }}
          >
            Search domains →
          </a>
        </div>
      ) : (
        <>
          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 130px 90px 100px', gap: '16px', padding: '8px 24px 12px', fontFamily: "'DM Mono', monospace", fontSize: '8.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>
            <span>Domain</span><span>Registered</span><span>Expires</span><span>Status</span><span></span>
          </div>
          <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden' }}>
            {domains.map((d, i) => (
              <div key={d.id} style={{ display: 'grid', gridTemplateColumns: '1fr 130px 130px 90px 100px', gap: '16px', alignItems: 'center', padding: '16px 24px', borderBottom: i < domains.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '14px', color: '#fff' }}>{d.domainName}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{fmt(d.registeredAt)}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{fmt(d.expiresAt)}</div>
                <div>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: statusColor(d.status), background: 'rgba(255,255,255,0.04)', border: `1px solid ${statusColor(d.status).replace('0.85', '0.2').replace('0.8', '0.2')}`, padding: '3px 8px', borderRadius: '100px' }}>
                    {d.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <button
                    disabled={renewingId === d.id}
                    onClick={() => handleRenew(d.id)}
                    style={{ padding: '7px 16px', background: 'transparent', border: '1px solid rgba(91,148,210,0.25)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: renewingId === d.id ? 'rgba(255,255,255,0.3)' : 'rgba(91,148,210,0.7)', cursor: renewingId === d.id ? 'default' : 'pointer', transition: 'all .15s' }}
                    onMouseEnter={e => { if (renewingId !== d.id) { (e.currentTarget.style.borderColor = 'rgba(91,148,210,0.5)'); (e.currentTarget.style.color = 'rgba(91,148,210,1)'); } }}
                    onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(91,148,210,0.25)'); (e.currentTarget.style.color = 'rgba(91,148,210,0.7)'); }}
                  >
                    {renewingId === d.id ? '…' : 'Renew'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <a href="/domains" style={{ fontFamily: "'DM Mono', monospace", fontSize: '9.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.6)', textDecoration: 'none' }}>
              Register another →
            </a>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── main console layout ────────────────────────────────── */

const NAV_ITEMS: { id: Tab; label: string; icon: string }[] = [
  { id: 'dashboard',   label: 'Dashboard',   icon: '⊞' },
  { id: 'my-products', label: 'My Products', icon: '◈' },
  { id: 'add-product', label: 'Add Product', icon: '+' },
  { id: 'domains',     label: 'My Domains',  icon: '🌐' },
  { id: 'testing',     label: 'Testing',     icon: '▷' },
  { id: 'analytics',   label: 'Analytics',   icon: '◎' },
  { id: 'earnings',    label: 'Earnings',    icon: '$' },
];

export default function ConsolePage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashData, setDashData] = useState<any>(null);
  const [userEmail, setUserEmail] = useState('your@email.com');

  useEffect(() => {
    fetch('/api/provider/dashboard')
      .then(r => r.json())
      .then(setDashData)
      .catch(() => {});

    // Load domain count for sidebar badge
    fetch('/api/domains/list')
      .then(r => r.json())
      .then((data: { domains?: any[] }) => {
        const count = data.domains?.length || 0;
        const badge = document.getElementById('domain-count-badge');
        if (badge) badge.textContent = String(count);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    import('@/lib/firebase/client').then(({ auth }) =>
      import('firebase/auth').then(({ onAuthStateChanged }) => {
        unsub = onAuthStateChanged(auth, user => {
          setUserEmail(user?.email || user?.displayName || 'your@email.com');
        });
      })
    );
    return () => unsub?.();
  }, []);

  const navigateTo = (tab: Tab) => { setActiveTab(tab); setSidebarOpen(false); };

  return (
    <div style={{ minHeight: '100vh', background: '#07070A', paddingTop: '64px', display: 'flex' }}>
      <style>{`
        .console-sidebar { display: flex; flex-direction: column; }
        .console-hamburger { display: none; }
        @media (max-width: 768px) {
          .console-sidebar { position: fixed; top: 64px; left: 0; bottom: 0; z-index: 50; background: #07070A; transform: translateX(-100%); transition: transform 0.25s; }
          .console-sidebar.open { transform: translateX(0); }
          .console-hamburger { display: flex; align-items: center; justify-content: center; }
          .console-overlay { display: block !important; }
        }
      `}</style>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="console-overlay" onClick={() => setSidebarOpen(false)} style={{ display: 'none', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />}

      {/* Mobile hamburger */}
      <button className="console-hamburger" onClick={() => setSidebarOpen(v => !v)} style={{ position: 'fixed', top: '72px', left: '16px', zIndex: 60, width: '40px', height: '40px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', cursor: 'pointer', fontSize: '16px' }}>
        ☰
      </button>

      {/* Sidebar */}
      <div className={`console-sidebar${sidebarOpen ? ' open' : ''}`} style={{
        width: '220px',
        flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.06)',
        padding: '32px 0',
        position: 'sticky',
        top: '64px',
        height: 'calc(100vh - 64px)',
        overflowY: 'auto',
      }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em', marginBottom: '6px' }}>PROVIDER CONSOLE</div>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>{userEmail}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', padding: '0 12px', gap: '2px' }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                background: activeTab === item.id ? 'rgba(91,148,210,0.12)' : 'transparent',
                color: activeTab === item.id ? 'rgba(91,148,210,1)' : 'rgba(255,255,255,0.45)',
                fontSize: '13px',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.15s',
                fontFamily: 'DM Mono, monospace',
              }}
            >
              <span style={{ fontSize: '14px', width: '18px', textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
              {item.label}
              {item.id === 'add-product' && (
                <span style={{ marginLeft: 'auto', fontSize: '10px', padding: '2px 7px', background: 'rgba(91,148,210,0.2)', color: 'rgba(91,148,210,0.8)', borderRadius: '100px' }}>new</span>
              )}
              {item.id === 'domains' && (
                <span id="domain-count-badge" style={{ marginLeft: 'auto', fontSize: '10px', padding: '2px 7px', background: 'rgba(91,148,210,0.2)', color: 'rgba(91,148,210,0.8)', borderRadius: '100px' }}>0</span>
              )}
            </button>
          ))}
        </div>

        <div style={{ position: 'absolute', bottom: '24px', left: '12px', right: '12px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', color: 'rgba(255,255,255,0.25)', fontSize: '12px', textDecoration: 'none', borderRadius: '10px', transition: 'color 0.15s' }}>
            ← Back to Clive
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '40px 48px', overflowY: 'auto', maxWidth: '1100px' }}>
        {activeTab === 'dashboard' && <Dashboard data={dashData} />}
        {activeTab === 'add-product' && <AddProduct />}
        {activeTab === 'my-products' && <MyProducts onAddProduct={() => navigateTo('add-product')} />}
        {activeTab === 'domains' && <MyDomains />}
        {activeTab === 'testing' && <Testing />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'earnings' && <Earnings />}
      </div>
    </div>
  );
}