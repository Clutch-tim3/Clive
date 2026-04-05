'use client';
export const dynamic = 'force-dynamic';

import React, { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px', padding: '14px 18px', fontFamily: "'Libre Baskerville', serif",
    fontSize: '14px', color: 'white', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '9.5px',
    letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', marginBottom: '8px',
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('loading');
    try {
      const { db } = await import('@/lib/firebase/client');
      const { collection, addDoc } = await import('firebase/firestore');
      await addDoc(collection(db, 'contactMessages'), {
        ...form,
        createdAt: new Date(),
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <main style={{ background: '#07070A', minHeight: '100vh' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '140px 32px 100px' }}>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(91,148,210,0.7)', textTransform: 'uppercase', marginBottom: '16px' }}>Contact</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(44px,5vw,64px)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.0, marginBottom: '16px' }}>
          Get in touch.
        </h1>
        <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '15px', color: 'rgba(255,255,255,0.4)', marginBottom: '48px', lineHeight: 1.75 }}>
          We respond to all enquiries within one business day.
        </p>

        <div style={{ display: 'flex', gap: '24px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {[
            { label: 'General & support', email: 'support@clive.dev' },
            { label: 'Provider enquiries', email: 'providers@clive.dev' },
          ].map(({ label, email }) => (
            <div key={label} style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '6px', textTransform: 'uppercase' }}>{label}</div>
              <a href={`mailto:${email}`} style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'rgba(91,148,210,0.8)', textDecoration: 'none' }}>{email}</a>
            </div>
          ))}
        </div>

        {status === 'success' ? (
          <div style={{ padding: '32px', background: 'rgba(80,200,120,0.07)', border: '1px solid rgba(80,200,120,0.2)', borderRadius: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>✓</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '28px', color: 'white', marginBottom: '8px' }}>Message sent.</div>
            <div style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>We'll be in touch within 24 hours.</div>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Name</label><input style={inputStyle} placeholder="Your name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required /></div>
              <div><label style={labelStyle}>Email</label><input style={inputStyle} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required /></div>
            </div>
            <div>
              <label style={labelStyle}>Subject</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}>
                <option value="">Select a subject</option>
                <option>General enquiry</option>
                <option>Support</option>
                <option>Partnership</option>
                <option>Press</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Message</label>
              <textarea style={{ ...inputStyle, minHeight: '140px', resize: 'vertical' }} placeholder="How can we help?" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required />
            </div>
            {status === 'error' && <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(220,80,80,0.9)' }}>↳ Something went wrong. Please email us directly.</div>}
            <button type="submit" disabled={status === 'loading'} style={{ padding: '16px', borderRadius: '100px', background: '#1B305B', border: '1px solid rgba(91,148,210,0.35)', borderTop: '1.5px solid rgba(91,148,210,0.55)', color: 'white', fontFamily: 'DM Mono, monospace', fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', cursor: status === 'loading' ? 'not-allowed' : 'pointer', opacity: status === 'loading' ? 0.6 : 1 }}>
              {status === 'loading' ? 'Sending…' : 'Send message'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}