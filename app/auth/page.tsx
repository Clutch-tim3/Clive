'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
// Firebase is imported dynamically inside handlers to avoid SSR initialisation errors

/* ─── types ─────────────────────────────────────────────── */
type Screen = 'gate' | 'signin' | 'signup' | 'onboard';
type Lang = 'curl' | 'python' | 'node';
type UseCase = 'security' | 'search' | 'docs' | 'finance' | 'gov' | 'dev';

interface ApiDef { id: string; icon: string; name: string; tagline: string; free: string; price: string; }

/* ─── data ───────────────────────────────────────────────── */
const APIS: Record<string, ApiDef[]> = {
  security: [
    { id: 'hackkit', icon: '🛡', name: 'HackKit', tagline: 'Penetration testing recon API', free: '50 recon calls/month', price: '$29' },
    { id: 'shieldkit', icon: '🔒', name: 'ShieldKit', tagline: 'IP reputation & threat intelligence', free: 'Free tier available', price: '$49' },
  ],
  search: [
    { id: 'searchcore', icon: '🔍', name: 'SearchCore', tagline: 'Full-text & semantic search engine', free: 'Free tier available', price: '$49' },
    { id: 'embedcore', icon: '🧠', name: 'EmbedCore', tagline: '512-dimensional text embeddings', free: '500 calls/month', price: '$0.008/1M' },
  ],
  docs: [
    { id: 'contractiq', icon: '📄', name: 'ContractIQ', tagline: 'Contract analysis & risk scoring', free: 'Free tier available', price: '$29' },
    { id: 'meetingiq', icon: '🎙', name: 'MeetingIQ', tagline: 'Meeting transcription & summaries', free: 'Free tier available', price: '$19' },
  ],
  finance: [
    { id: 'fxbridge', icon: '💱', name: 'FXBridge', tagline: 'Real-time FX rates & conversion', free: 'Free tier available', price: '$9' },
    { id: 'wealthmind', icon: '💰', name: 'WealthMind', tagline: 'Personal finance intelligence', free: 'Free tier available', price: '$19' },
  ],
  gov: [
    { id: 'tenderiq', icon: '🏛', name: 'TenderIQ', tagline: 'SA government tender intelligence', free: 'Free tier available', price: '$29' },
  ],
  dev: [
    { id: 'devkit', icon: '⚙', name: 'DevKit', tagline: 'Developer utilities & validation', free: 'Free tier available', price: '$9' },
    { id: 'oracleiq', icon: '📊', name: 'OracleIQ', tagline: 'Prediction market intelligence', free: 'Free tier available', price: '$19' },
  ],
};

const SNIPS: Record<Lang, string> = {
  curl: `curl -X POST https://api.clive.dev/v1/{endpoint} \\
  -H "X-Clive-Key: clive_live_sk_abc123" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "example"}'`,
  python: `import requests

res = requests.post(
  "https://api.clive.dev/v1/{endpoint}",
  headers={"X-Clive-Key": "clive_live_sk_abc123"},
  json={"query": "example"}
)
print(res.json())`,
  node: `const res = await fetch(
  "https://api.clive.dev/v1/{endpoint}",
  { method: "POST",
    headers: { "X-Clive-Key": "clive_live_sk_abc123" },
    body: JSON.stringify({ query: "example" }) }
);
const data = await res.json();`,
};

const FAKE_KEY = 'clive_live_sk_t8xZpQmRbNvYcWdJkHuLeAoFiSg3';

/* ─── helpers ────────────────────────────────────────────── */
function validateEmail(e: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function pwStrength(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['rgba(255,255,255,0.08)', 'rgba(220,80,80,0.8)', 'rgba(210,150,50,0.8)', 'rgba(91,148,210,0.8)', 'rgba(80,200,120,0.8)'];

/* ─── SVG icons ──────────────────────────────────────────── */
const GoogleSVG = () => (
  <svg width="17" height="17" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);
const GitHubSVG = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);
const FacebookSVG = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.027 4.388 11.025 10.125 11.927V15.563H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796v8.437C19.612 23.098 24 18.1 24 12.073z"/>
  </svg>
);
const EyeOpenSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeClosedSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

/* ─── shared sub-components ──────────────────────────────── */
function OAuthRow({ onOAuth }: { onOAuth?: (provider: 'google' | 'github' | 'facebook') => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '22px' }}>
      {[
        { label: 'Google',   icon: <GoogleSVG />,   key: 'google'   as const },
        { label: 'GitHub',   icon: <GitHubSVG />,   key: 'github'   as const },
        { label: 'Facebook', icon: <FacebookSVG />, key: 'facebook' as const },
      ].map(({ label, icon, key }) => (
        <button key={label} className="auth-ob" onClick={() => onOAuth?.(key)}>
          {icon}{label}
        </button>
      ))}
    </div>
  );
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '22px 0', fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)' }}>
      <span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
      or continue with email
      <span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
    </div>
  );
}

function LoadingDots() {
  return (
    <div style={{ display: 'flex', gap: '5px', alignItems: 'center', justifyContent: 'center' }}>
      {[0, 1, 2].map(i => (
        <span key={i} className={`auth-dot auth-dot-${i + 1}`} />
      ))}
    </div>
  );
}

interface PrimaryBtnProps { onClick?: () => void; disabled?: boolean; loading?: boolean; children: React.ReactNode; }
function PrimaryBtn({ onClick, disabled, loading, children }: PrimaryBtnProps) {
  return (
    <button className="auth-bp" onClick={onClick} disabled={disabled || loading} style={{ marginBottom: '14px' }}>
      {loading ? <LoadingDots /> : children}
    </button>
  );
}

/* ─── left panel ─────────────────────────────────────────── */
function LeftPanel() {
  return (
    <div className="auth-lp">
      <div className="auth-orb auth-o1" />
      <div className="auth-orb auth-o2" />
      <div className="auth-orb auth-o3" />
      <div className="auth-scan" />
      <div className="auth-lp-mid">
        <span className="auth-cletter">C</span>
        <div className="auth-cbrand">
          <div className="auth-crule" />
          <div className="auth-ctxt">CLIVE</div>
        </div>
      </div>
      <div className="auth-lp-stats">
        <span className="auth-chip auth-chip1">13 APIs</span>
        <span className="auth-chip auth-chip2">10K+ Devs</span>
        <span className="auth-chip auth-chip3">Free tier</span>
      </div>
      <div className="auth-lp-testi">
        <div className="auth-tq">"The only API platform I've kept after my free trial."</div>
        <div className="auth-ta">— a developer, Cape Town</div>
      </div>
    </div>
  );
}

/* ─── gate screen ────────────────────────────────────────── */
function GateScreen({ onSignIn, onSignUp }: { onSignIn: () => void; onSignUp: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '52px', letterSpacing: '0.02em', color: '#fff', lineHeight: 1 }}>
        C<em style={{ fontStyle: 'normal', color: 'rgba(91,148,210,0.9)' }}>L</em>IVE
      </div>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9.5px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.6)', marginBottom: '40px', marginTop: '8px' }}>
        Developer Platform
      </div>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(34px,3.8vw,50px)', color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '14px' }}>
        Build faster with<br />intelligent APIs.
      </h1>
      <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.75, marginBottom: '38px' }}>
        Thirteen production-ready APIs. One credential.<br />Start building in under five minutes.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
        <button className="auth-bp" onClick={onSignUp}>Get started free</button>
        <button className="auth-bg" onClick={onSignIn}>Sign in</button>
      </div>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.18)', textAlign: 'center', marginTop: '10px' }}>
        No credit card required · Free tier on every API
      </div>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.07em', color: 'rgba(255,255,255,0.14)', textAlign: 'center', marginTop: '18px' }}>
        Trusted by developers at Standard Bank · Absa · FNB
      </div>
    </div>
  );
}

/* ─── sign in screen ─────────────────────────────────────── */
function SignInScreen({ onBack, onSignUp, onSuccess }: { onBack: () => void; onSignUp: () => void; onSuccess: (role?: string) => void }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [emailErr, setEmailErr] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [shakeEmail, setShakeEmail] = useState(false);
  const [shakePw, setShakePw] = useState(false);
  const [pwResetMsg, setPwResetMsg] = useState('');
  const [networkErr, setNetworkErr] = useState(false);
  const [remember, setRemember] = useState(false);

  const showNetworkErr = () => { setNetworkErr(true); setTimeout(() => setNetworkErr(false), 5000); };

  
    const handleOAuth = async (provider: 'google' | 'github' | 'facebook') => {
    try {
      const { auth, googleProvider, githubProvider, facebookProvider } = await import('@/lib/firebase/client');
      const { signInWithPopup } = await import('firebase/auth');
      const p = provider === 'google' ? googleProvider : provider === 'github' ? githubProvider : facebookProvider;
      const result = await signInWithPopup(auth, p);
      const sessionRes = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: await result.user.getIdToken() }),
      });
      const sessionData = sessionRes.ok ? await sessionRes.json().catch(() => ({})) : {};
      const role: string = sessionData.role ?? 'consumer';
      document.cookie = `__auth=${role === 'admin' ? 'admin' : '1'}; path=/; samesite=lax`;
      onSuccess(role);
    } catch (err: any) {
      if (err?.code === 'auth/popup-blocked') {
        try {
          const { auth: _a, googleProvider: gp, githubProvider: ghp, facebookProvider: fbp } = await import('@/lib/firebase/client');
          const { signInWithRedirect } = await import('firebase/auth');
          const fallback = provider === 'google' ? gp : provider === 'github' ? ghp : fbp;
          await signInWithRedirect(_a, fallback);
        } catch { /* redirect initiated */ }
      } else if (err?.code === 'auth/network-request-failed') showNetworkErr();
    }
  };

  const handleForgotPw = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email || !validateEmail(email)) { setPwResetMsg('error'); return; }
    try {
      const { auth: _auth } = await import('@/lib/firebase/client');
      const { sendPasswordResetEmail } = await import('firebase/auth');
      await sendPasswordResetEmail(_auth, email);
      setPwResetMsg('sent');
    } catch {
      setPwResetMsg('error');
    }
  };

  const submit = async () => {
    let ok = true;
    if (!validateEmail(email)) {
      setEmailErr('Please enter a valid email address');
      setShakeEmail(true); setTimeout(() => setShakeEmail(false), 400);
      ok = false;
    } else setEmailErr('');
    if (pw.length < 8) {
      setPwErr('Password must be at least 8 characters');
      setShakePw(true); setTimeout(() => setShakePw(false), 400);
      ok = false;
    } else setPwErr('');
    if (!ok) return;
    setLoading(true);
    try {
    
      const { auth: _auth } = await import('@/lib/firebase/client');
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const result = await signInWithEmailAndPassword(_auth, email.trim(), pw);
      const sessionRes = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: await result.user.getIdToken(), remember }),
      });
      const sessionData = await sessionRes.json().catch(() => ({}));
      if (!sessionRes.ok) {
        throw new Error(sessionData.error ?? 'Session creation failed. Please try again.');
      }
      const role: string = sessionData.role ?? 'consumer';
      document.cookie = `__auth=${role === 'admin' ? 'admin' : '1'}; path=/; samesite=lax${remember ? `; max-age=${7 * 24 * 60 * 60}` : ''}`;
      onSuccess(role);
    } catch (err: any) {
      setLoading(false);
      console.error('Sign-in error:', err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential')
        setPwErr('Incorrect password');
      else if (err.code === 'auth/user-not-found')
        setEmailErr('No account with this email');
      else if (err.code === 'auth/invalid-email')
        setEmailErr('Please enter a valid email address');
      else if (err.code === 'auth/network-request-failed')
        showNetworkErr();
      else if (err.code === 'auth/operation-not-allowed')
        setPwErr('Email/password sign-in is not enabled. Please contact support.');
      else
        setPwErr(`Sign-in failed: ${err.code || err.message || 'Unknown error'}`);
    }
  };

  return (
    <div>
      <button className="auth-back" onClick={onBack}>← Back</button>
      <h2 className="auth-hd">Welcome back.</h2>
      <p className="auth-sub">Sign in to your Clive workspace.</p>
      <OAuthRow onOAuth={handleOAuth} />
      <Divider />

      <div style={{ marginBottom: '20px' }}>
        <label className="auth-fl">Email address</label>
        <input
          className={`auth-fi${emailErr ? ' auth-fi-err' : email && validateEmail(email) ? ' auth-fi-ok' : ''}${shakeEmail ? ' auth-shake' : ''}`}
          type="email" placeholder="you@example.com" value={email}
          onChange={e => setEmail(e.target.value)}
          onBlur={() => { if (email && !validateEmail(email)) setEmailErr('Please enter a valid email address'); else setEmailErr(''); }}
        />
        {emailErr && <div className="auth-fe">↳ {emailErr}</div>}
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label className="auth-fl">Password</label>
        <div style={{ position: 'relative' }}>
          <input
            className={`auth-fi auth-pw-input${pwErr ? ' auth-fi-err' : pw.length >= 8 ? ' auth-fi-ok' : ''}${shakePw ? ' auth-shake' : ''}`}
            type={showPw ? 'text' : 'password'} placeholder="Your password" value={pw}
            onChange={e => setPw(e.target.value)}
          />
          <button className="auth-eye" type="button" onClick={() => setShowPw(s => !s)}>
            {showPw ? <EyeOpenSVG /> : <EyeClosedSVG />}
          </button>
        </div>
        {pwErr && <div className="auth-fe">↳ {pwErr}</div>}
      </div>

      <a href="#" className="auth-fgt" onClick={handleForgotPw}>Forgot password?</a>
      {pwResetMsg === 'sent' && <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(80,200,120,0.9)', marginTop: '-8px', marginBottom: '14px' }}>✓ Reset link sent — check your inbox.</div>}
      {pwResetMsg === 'error' && <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(220,80,80,0.9)', marginTop: '-8px', marginBottom: '14px' }}>↳ Enter your email address first.</div>}

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', cursor: 'pointer' }} onClick={() => setRemember(r => !r)}>
        <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: remember ? '1.5px solid rgba(91,148,210,0.8)' : '1.5px solid rgba(255,255,255,0.2)', background: remember ? 'rgba(91,148,210,0.2)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s', flexShrink: 0 }}>
          {remember && <span style={{ color: 'rgba(91,148,210,1)', fontSize: '10px', lineHeight: 1 }}>✓</span>}
        </div>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.4)', userSelect: 'none' }}>Remember this device</span>
      </div>

      <PrimaryBtn onClick={submit} loading={loading}>Sign in</PrimaryBtn>

      <div style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '13px', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
        Don't have an account?{' '}
        <a href="#" className="auth-sl" onClick={e => { e.preventDefault(); onSignUp(); }}>Get started free →</a>
      </div>
    </div>
  );
}

/* ─── sign up screen ─────────────────────────────────────── */
function SignUpScreen({ onBack, onSignIn, onSuccess }: { onBack: () => void; onSignIn: () => void; onSuccess: (role?: string) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [terms, setTerms] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [strength, setStrength] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [shakes, setShakes] = useState<Record<string, boolean>>({});

  const [signupNetworkErr, setSignupNetworkErr] = useState(false);
  const [genericErr, setGenericErr] = useState('');

  const shake = (field: string) => {
    setShakes(s => ({ ...s, [field]: true }));
    setTimeout(() => setShakes(s => ({ ...s, [field]: false })), 400);
  };

  const isValid = name.length >= 2 && validateEmail(email) && pw.length >= 8 && pw === confirm && terms;

  const handleOAuth = async (provider: 'google' | 'github' | 'facebook') => {
    try {
      const { auth, googleProvider, githubProvider, facebookProvider } = await import('@/lib/firebase/client');
      const { signInWithPopup } = await import('firebase/auth');
      const p = provider === 'google' ? googleProvider : provider === 'github' ? githubProvider : facebookProvider;
      const result = await signInWithPopup(auth, p);
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: await result.user.getIdToken() }),
      });
      const resData = res.ok ? await res.json().catch(() => ({})) : {};
      if (!res.ok) throw new Error('Session creation failed');
      const role: string = resData.role ?? 'consumer';
      document.cookie = `__auth=${role === 'admin' ? 'admin' : '1'}; path=/; samesite=lax`;
      onSuccess(role);
    } catch (err: any) {
      if (err?.code === 'auth/popup-blocked') {
        try {
          const { auth: _a, googleProvider: gp, githubProvider: ghp, facebookProvider: fbp } = await import('@/lib/firebase/client');
          const { signInWithRedirect } = await import('firebase/auth');
          const fallback = provider === 'google' ? gp : provider === 'github' ? ghp : fbp;
          await signInWithRedirect(_a, fallback);
        } catch { /* redirect initiated */ }
      } else if (err?.code === 'auth/network-request-failed') {
        setSignupNetworkErr(true);
        setTimeout(() => setSignupNetworkErr(false), 5000);
      } else if (err?.code && err.code !== 'auth/popup-closed-by-user') {
        setGenericErr(err.code);
      }
    }
  };

  const submit = async () => {
    setGenericErr('');
    const errs: Record<string, string> = {};
    if (name.length < 2) { errs.name = 'Please enter your name'; shake('name'); }
    if (!validateEmail(email)) { errs.email = 'Please enter a valid email address'; shake('email'); }
    if (pw.length < 8) { errs.pw = 'Password must be at least 8 characters'; shake('pw'); }
    if (pw !== confirm) { errs.confirm = 'Passwords do not match'; shake('confirm'); }
    if (!terms) { errs.terms = 'Please accept the terms'; }
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      const { auth: _fauth } = await import('@/lib/firebase/client');
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
      const result = await createUserWithEmailAndPassword(_fauth, email.trim(), pw);
      // Save display name to Firebase Auth profile
      await updateProfile(result.user, { displayName: name });
      // Force refresh token so displayName is in the JWT
      const idToken = await result.user.getIdToken(true);
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, name, remember }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? 'Session creation failed');
      }
      const role: string = data.role ?? 'consumer';
      document.cookie = `__auth=${role === 'admin' ? 'admin' : '1'}; path=/; samesite=lax${remember ? `; max-age=${7 * 24 * 60 * 60}` : ''}`;
      onSuccess(role);
    } catch (err: any) {
      setLoading(false);
      if (err.code === 'auth/email-already-in-use')
        setErrors(e => ({ ...e, email: 'An account with this email already exists' }));
      else if (err.code === 'auth/invalid-email')
        setErrors(e => ({ ...e, email: 'Please enter a valid email address' }));
      else if (err.code === 'auth/network-request-failed') {
        setSignupNetworkErr(true);
        setTimeout(() => setSignupNetworkErr(false), 5000);
      } else if (err.code === 'auth/operation-not-allowed') {
        setGenericErr('Email/password sign-up is not enabled. Contact support.');
      } else {
        setGenericErr(err.message ?? err.code ?? 'Something went wrong. Please try again.');
      }
    }
  };

  const segCols = Array.from({ length: 4 }, (_, i) => i < strength ? strengthColor[strength] : 'rgba(255,255,255,0.08)');

  return (
    <div>
      <button className="auth-back" onClick={onBack}>← Back</button>
      <h2 className="auth-hd">Create your account.</h2>
      <p className="auth-sub">Free tier included on every API. No credit card.</p>
      {signupNetworkErr && (
        <div style={{ background: 'rgba(220,80,80,0.1)', border: '1px solid rgba(220,80,80,0.3)', borderRadius: '10px', padding: '10px 16px', fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(220,80,80,0.9)', marginBottom: '16px' }}>
          ✗ Connection error — check your internet and try again.
        </div>
      )}
      {genericErr && (
        <div style={{ background: 'rgba(220,80,80,0.1)', border: '1px solid rgba(220,80,80,0.3)', borderRadius: '10px', padding: '10px 16px', fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(220,80,80,0.9)', marginBottom: '16px' }}>
          ✗ {genericErr}
        </div>
      )}
      <OAuthRow onOAuth={handleOAuth} />
      <Divider />

      {/* Name */}
      <div style={{ marginBottom: '20px' }}>
        <label className="auth-fl">Full name</label>
        <input className={`auth-fi${errors.name ? ' auth-fi-err' : name.length >= 2 ? ' auth-fi-ok' : ''}${shakes.name ? ' auth-shake' : ''}`}
          type="text" placeholder="Your full name" value={name}
          onChange={e => setName(e.target.value)} />
        {errors.name && <div className="auth-fe">↳ {errors.name}</div>}
      </div>

      {/* Email */}
      <div style={{ marginBottom: '20px' }}>
        <label className="auth-fl">Email address</label>
        <input className={`auth-fi${errors.email ? ' auth-fi-err' : validateEmail(email) ? ' auth-fi-ok' : ''}${shakes.email ? ' auth-shake' : ''}`}
          type="email" placeholder="you@example.com" value={email}
          onChange={e => setEmail(e.target.value)} />
        {errors.email && <div className="auth-fe">↳ {errors.email}</div>}
      </div>

      {/* Password */}
      <div style={{ marginBottom: '20px' }}>
        <label className="auth-fl">Password</label>
        <div style={{ position: 'relative' }}>
          <input className={`auth-fi auth-pw-input${errors.pw ? ' auth-fi-err' : pw.length >= 8 ? ' auth-fi-ok' : ''}${shakes.pw ? ' auth-shake' : ''}`}
            type={showPw ? 'text' : 'password'} placeholder="Min 8 characters" value={pw}
            onChange={e => { setPw(e.target.value); setStrength(pwStrength(e.target.value)); }} />
          <button className="auth-eye" type="button" onClick={() => setShowPw(s => !s)}>
            {showPw ? <EyeOpenSVG /> : <EyeClosedSVG />}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
          {segCols.map((col, i) => (
            <div key={i} style={{ flex: 1, height: '6px', borderRadius: '3px', background: col, transition: 'background 0.3s' }} />
          ))}
        </div>
        {pw.length > 0 && (
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', marginTop: '5px', color: strengthColor[strength] }}>
            {strengthLabel[strength]}
          </div>
        )}
        {errors.pw && <div className="auth-fe">↳ {errors.pw}</div>}
      </div>

      {/* Confirm */}
      <div style={{ marginBottom: '20px' }}>
        <label className="auth-fl">Confirm password</label>
        <div style={{ position: 'relative' }}>
          <input className={`auth-fi auth-pw-input${errors.confirm ? ' auth-fi-err' : confirm && pw === confirm ? ' auth-fi-ok' : confirm && pw !== confirm ? ' auth-fi-err' : ''}${shakes.confirm ? ' auth-shake' : ''}`}
            type="password" placeholder="Confirm your password" value={confirm}
            onChange={e => setConfirm(e.target.value)} />
          {confirm && pw === confirm && (
            <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(80,200,120,0.9)', fontSize: '13px' }}>✓</span>
          )}
        </div>
        {errors.confirm && <div className="auth-fe">↳ {errors.confirm}</div>}
      </div>

      {/* Terms */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
        <div
          onClick={() => setTerms(t => !t)}
          style={{ width: '18px', height: '18px', minWidth: '18px', border: `1.5px solid ${terms ? '#1B305B' : 'rgba(255,255,255,0.2)'}`, borderRadius: '5px', background: terms ? '#1B305B' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginTop: '2px', transition: 'all 0.2s' }}
        >
          {terms && <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </div>
        <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.55 }}>
          I agree to the <a href="/terms" className="auth-sl">Terms of Service</a> and <a href="/privacy" className="auth-sl">Privacy Policy</a>
        </div>
      </div>

      {/* Remember this device */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px', cursor: 'pointer' }} onClick={() => setRemember(r => !r)}>
        <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: remember ? '1.5px solid rgba(91,148,210,0.8)' : '1.5px solid rgba(255,255,255,0.2)', background: remember ? 'rgba(91,148,210,0.2)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s', flexShrink: 0 }}>
          {remember && <span style={{ color: 'rgba(91,148,210,1)', fontSize: '10px', lineHeight: 1 }}>✓</span>}
        </div>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.4)', userSelect: 'none' }}>Remember this device</span>
      </div>

      <PrimaryBtn onClick={submit} disabled={!isValid} loading={loading}>Create account</PrimaryBtn>

      <div style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '13px', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
        Already have an account?{' '}
        <a href="#" className="auth-sl" onClick={e => { e.preventDefault(); onSignIn(); }}>Sign in →</a>
      </div>
    </div>
  );
}

/* ─── onboard screen ─────────────────────────────────────── */
function OnboardScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(1);
  const [stepVisible, setStepVisible] = useState(true);
  const [selectedUse, setSelectedUse] = useState<UseCase | null>(null);
  const [selectedApi, setSelectedApi] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>('curl');
  const [keyRevealed, setKeyRevealed] = useState(false);
  const [keyCopied, setKeyCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const goStep = (n: number) => {
    setStepVisible(false);
    setTimeout(() => { setStep(n); setStepVisible(true); }, 260);
  };

  // Confetti on enter
  useEffect(() => {
    if (step !== 3 || !canvasRef.current) return;
    const cv = canvasRef.current;
    cv.width = cv.offsetWidth || 400;
    cv.height = 200;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const cols = ['rgba(91,148,210,0.9)', 'rgba(27,48,91,0.9)', 'rgba(255,255,255,0.75)', 'rgba(91,148,210,0.5)'];
    const pts = Array.from({ length: 12 }, () => ({
      x: cv.width / 2, y: 100,
      vx: (Math.random() - 0.5) * 9, vy: (Math.random() - 1) * 8,
      sz: 3 + Math.random() * 4, c: cols[Math.floor(Math.random() * cols.length)], life: 1,
    }));
    const t0 = performance.now();
    const draw = (now: number) => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      const t = (now - t0) / 900;
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.life = Math.max(0, 1 - t);
        ctx.globalAlpha = p.life; ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, p.sz, p.sz);
      });
      if (t < 1) requestAnimationFrame(draw); else ctx.clearRect(0, 0, cv.width, cv.height);
    };
    requestAnimationFrame(draw);
  }, [step]);

  const apis = selectedUse ? (APIS[selectedUse] || APIS.dev) : APIS.dev;
  const snippet = SNIPS[lang].replace(/\{endpoint\}/g, selectedApi || 'endpoint');

  const stepCircle = (n: number) => {
    if (n < step) return { bg: 'rgba(91,148,210,0.18)', border: 'rgba(91,148,210,0.35)', color: 'rgba(91,148,210,0.9)', label: '✓' };
    if (n === step) return { bg: '#1B305B', border: 'rgba(91,148,210,0.6)', color: '#fff', label: String(n) };
    return { bg: 'transparent', border: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.25)', label: String(n) };
  };

  const stepLabels = ['Use case', 'First product', 'Your key'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '40px' }}>
        {[1, 2, 3].map((n, i) => {
          const s = stepCircle(n);
          return (
            <React.Fragment key={n}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: s.bg, border: `1.5px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Mono, monospace', fontSize: '10px', color: s.color, transition: 'all 0.3s' }}>
                  {s.label}
                </div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', color: n <= step ? 'rgba(91,148,210,0.7)' : 'rgba(255,255,255,0.22)', whiteSpace: 'nowrap' }}>
                  {stepLabels[i]}
                </div>
              </div>
              {i < 2 && (
                <div style={{ flex: 1, paddingTop: '13px' }}>
                  <div style={{ height: '1.5px', width: '100%', background: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'rgba(91,148,210,0.6)', width: step > n ? '100%' : '0%', transition: 'width 0.35s ease' }} />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step content */}
      <div style={{ opacity: stepVisible ? 1 : 0, transform: stepVisible ? 'translateX(0)' : 'translateX(-30px)', transition: 'opacity 0.25s ease, transform 0.25s ease' }}>
        {/* Step 1 */}
        {step === 1 && (
          <div>
            <h2 className="auth-hd">What will you build?</h2>
            <p className="auth-sub">We'll recommend the right APIs for your project.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '11px', marginBottom: '26px' }}>
              {[
                { key: 'security', icon: '🛡', title: 'Security & Pentesting', sub: 'HackKit, ShieldKit' },
                { key: 'search', icon: '🔍', title: 'Search & Discovery', sub: 'SearchCore, EmbedCore' },
                { key: 'docs', icon: '📄', title: 'Documents & Contracts', sub: 'ContractIQ, MeetingIQ' },
                { key: 'finance', icon: '💰', title: 'Finance & FX', sub: 'FXBridge, WealthMind' },
                { key: 'gov', icon: '🏛', title: 'Government & Tenders', sub: 'TenderIQ' },
                { key: 'dev', icon: '⚙', title: 'Developer Utilities', sub: 'DevKit, OracleIQ' },
              ].map(({ key, icon, title, sub }) => (
                <div key={key} className={`auth-uc${selectedUse === key ? ' auth-uc-sel' : ''}`} onClick={() => setSelectedUse(key as UseCase)}>
                  <span style={{ fontSize: '20px', marginBottom: '9px', display: 'block' }}>{icon}</span>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10.5px', letterSpacing: '0.05em', color: '#fff', marginBottom: '3px' }}>{title}</div>
                  <div style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '11.5px', color: 'rgba(255,255,255,0.34)' }}>{sub}</div>
                </div>
              ))}
            </div>
            <PrimaryBtn onClick={() => goStep(2)} disabled={!selectedUse}>Continue →</PrimaryBtn>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <h2 className="auth-hd">Pick your first API.</h2>
            <p className="auth-sub">Recommended based on your use case. All include a free tier.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              {apis.map(api => (
                <div key={api.id} className={`auth-ac${selectedApi === api.id ? ' auth-ac-sel' : ''}`} onClick={() => setSelectedApi(api.id)}>
                  <div style={{ width: '44px', height: '44px', minWidth: '44px', borderRadius: '18px', background: 'rgba(27,48,91,0.5)', border: '1px solid rgba(91,148,210,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{api.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#fff', marginBottom: '3px' }}>{api.name}</div>
                    <div style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '12px', color: 'rgba(255,255,255,0.36)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{api.tagline}</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(91,148,210,0.65)', marginTop: '3px' }}>Free tier: {api.free}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '21px', color: '#fff' }}>{api.price}</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '8px', color: 'rgba(255,255,255,0.26)' }}>/ month</div>
                  </div>
                </div>
              ))}
            </div>
            <PrimaryBtn onClick={() => goStep(3)} disabled={!selectedApi}>Continue →</PrimaryBtn>
            <button className="auth-sbk" onClick={() => goStep(1)}>← Back</button>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <h2 className="auth-hd">You're ready to build.</h2>
            <p className="auth-sub">Here is your Clive API key. Keep it safe.</p>

            {/* Key box */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderLeft: '3px solid rgba(91,148,210,0.6)', borderRadius: '0 18px 18px 0', padding: '14px 18px', marginBottom: '22px' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'rgba(91,148,210,0.85)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {keyRevealed ? FAKE_KEY : 'clive_live_sk_••••••••••••••••••••••••'}
              </span>
              <button
                style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: keyCopied ? 'rgba(80,200,120,0.9)' : 'rgba(91,148,210,0.7)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', flexShrink: 0 }}
                onClick={() => {
                  if (!keyRevealed) { setKeyRevealed(true); }
                  else {
                    try { navigator.clipboard.writeText(FAKE_KEY); } catch {}
                    setKeyCopied(true);
                    setTimeout(() => setKeyCopied(false), 2000);
                  }
                }}>
                {!keyRevealed ? 'Reveal' : keyCopied ? 'Copied ✓' : 'Copy'}
              </button>
            </div>

            {/* Code block */}
            <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', marginBottom: '22px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {(['curl', 'python', 'node'] as Lang[]).map(l => (
                  <button key={l} onClick={() => setLang(l)} style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.1em', padding: '9px 16px', color: lang === l ? 'rgba(91,148,210,0.9)' : 'rgba(255,255,255,0.3)', background: 'none', border: 'none', borderBottom: `2px solid ${lang === l ? 'rgba(91,148,210,0.6)' : 'transparent'}`, cursor: 'pointer', transition: 'all 0.15s' }}>
                    {l}
                  </button>
                ))}
              </div>
              <pre style={{ padding: '20px', fontFamily: 'DM Mono, monospace', fontSize: '11px', lineHeight: 1.9, color: 'rgba(255,255,255,0.62)', overflowX: 'auto', whiteSpace: 'pre', margin: 0 }}>
                {snippet}
              </pre>
            </div>

            <PrimaryBtn onClick={onDone}>Open Dashboard →</PrimaryBtn>
            <button className="auth-bg" onClick={() => { window.location.href = '/docs'; }}>View documentation</button>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: '14px' }}>
              Need help? <a href="https://discord.gg/clive" target="_blank" rel="noreferrer" className="auth-help-link">Discord</a> · <a href="/docs" className="auth-help-link">Read the docs</a> · <a href="mailto:support@clive.dev" className="auth-help-link">Email support</a>
            </div>
            <canvas ref={canvasRef} style={{ position: 'relative', width: '100%', height: '80px', pointerEvents: 'none', marginTop: '16px' }} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── custom cursor ──────────────────────────────────────── */
function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const mx = useRef(0); const my = useRef(0);
  const rx = useRef(0); const ry = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mx.current = e.clientX; my.current = e.clientY; if (dotRef.current) { dotRef.current.style.left = e.clientX + 'px'; dotRef.current.style.top = e.clientY + 'px'; } };
    window.addEventListener('mousemove', onMove);
    let raf: number;
    const loop = () => { rx.current += (mx.current - rx.current) * 0.12; ry.current += (my.current - ry.current) * 0.12; if (ringRef.current) { ringRef.current.style.left = rx.current + 'px'; ringRef.current.style.top = ry.current + 'px'; } raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    const onEnter = () => document.body.classList.add('auth-hovering');
    const onLeave = () => document.body.classList.remove('auth-hovering');
    document.querySelectorAll('button,a,input,.auth-uc,.auth-ac').forEach(el => { el.addEventListener('mouseenter', onEnter); el.addEventListener('mouseleave', onLeave); });
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={ringRef} className="auth-cur-ring" />
      <div ref={dotRef} className="auth-cur-dot" />
    </>
  );
}

/* ─── main auth content ──────────────────────────────────── */
function AuthContent() {
  const searchParams = useSearchParams();
  const [screen, setScreen] = useState<Screen>('gate');
  const [visible, setVisible] = useState(true);
  const [networkErr, setNetworkErr] = useState(false);

  useEffect(() => {
    const s = searchParams.get('screen');
    if (s === 'signin') setScreen('signin');
    else if (s === 'signup') setScreen('signup');
  }, [searchParams]);

  const goTo = useCallback((next: Screen) => {
    setVisible(false);
    setTimeout(() => { setScreen(next); setVisible(true); }, 165);
  }, []);

  // Hard redirect so the __session cookie from the fetch response is
  // guaranteed to be present when the middleware checks the next request.
  // Admin users go to /founder, everyone else goes to /console.
  const handleSuccess = (role = 'consumer') => {
    window.location.href = role === 'admin' ? '/founder' : '/console';
  };

  const handleDone = () => { window.location.href = '/console'; };

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;}
        .auth-cur-ring{position:fixed;top:0;left:0;width:36px;height:36px;border-radius:50%;border:1.5px solid rgba(27,48,91,0.35);pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:width .25s cubic-bezier(.34,1.56,.64,1),height .25s cubic-bezier(.34,1.56,.64,1),border-color .25s;}
        .auth-cur-dot{position:fixed;top:0;left:0;width:6px;height:6px;border-radius:50%;background:rgba(91,148,210,0.8);pointer-events:none;z-index:9999;transform:translate(-50%,-50%);}
        body.auth-hovering .auth-cur-ring{width:52px;height:52px;border-color:rgba(91,148,210,0.5);}
        body.auth-hovering .auth-cur-dot{width:4px;height:4px;}
        @keyframes auth-orbFloat{0%,100%{transform:translate(0,0)}33%{transform:translate(18px,-14px)}66%{transform:translate(-10px,16px)}}
        @keyframes auth-scanKf{0%{top:-2px}100%{top:100%}}
        @keyframes auth-glowPulse{0%,100%{filter:drop-shadow(0 0 8px rgba(80,160,255,.9)) drop-shadow(0 0 22px rgba(80,160,255,.65)) drop-shadow(0 0 55px rgba(60,140,255,.14)) drop-shadow(0 0 110px rgba(40,120,255,.08))}50%{filter:drop-shadow(0 0 12px rgba(80,160,255,.98)) drop-shadow(0 0 30px rgba(80,160,255,.8)) drop-shadow(0 0 72px rgba(60,140,255,.3)) drop-shadow(0 0 140px rgba(40,120,255,.18))}}
        @keyframes auth-chipFloat{0%,100%{transform:translateY(0);opacity:.7}50%{transform:translateY(-6px);opacity:1}}
        @keyframes auth-dotPulse{0%,100%{opacity:.2}50%{opacity:1}}
        @keyframes auth-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
        @keyframes auth-ripple{0%{transform:scale(0);opacity:.35}100%{transform:scale(4.5);opacity:0}}
        .auth-lp{position:fixed;left:0;top:0;width:50vw;height:100vh;background:#07070A;overflow:hidden;z-index:1;background-image:linear-gradient(rgba(27,48,91,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(27,48,91,0.06) 1px,transparent 1px);background-size:52px 52px;}
        .auth-orb{position:absolute;border-radius:50%;pointer-events:none;}
        .auth-o1{width:560px;height:560px;background:rgba(27,48,91,0.28);filter:blur(80px);right:-150px;top:-80px;animation:auth-orbFloat 14s ease-in-out infinite;}
        .auth-o2{width:360px;height:360px;background:rgba(27,48,91,0.16);filter:blur(60px);left:-80px;bottom:-60px;animation:auth-orbFloat 11s ease-in-out 3s infinite;}
        .auth-o3{width:220px;height:220px;background:rgba(91,148,210,0.07);filter:blur(50px);left:40%;top:35%;animation:auth-orbFloat 9s ease-in-out 6s infinite;}
        .auth-scan{position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(91,148,210,0.35),transparent);animation:auth-scanKf 7s ease-in-out infinite;pointer-events:none;z-index:2;}
        .auth-lp-mid{position:absolute;top:50%;left:50%;transform:translate(-50%,-52%);text-align:center;z-index:3;}
        .auth-cletter{font-family:'Cormorant Garamond',serif;font-weight:300;font-size:clamp(180px,18vw,260px);color:#1B305B;line-height:1;display:block;animation:auth-glowPulse 4s ease-in-out infinite;}
        .auth-cbrand{display:flex;flex-direction:column;align-items:center;gap:8px;margin-top:6px;}
        .auth-crule{width:48px;height:1px;background:rgba(91,148,210,0.25);}
        .auth-ctxt{font-family:'DM Mono',monospace;font-size:11px;letter-spacing:0.28em;color:rgba(255,255,255,0.15);}
        .auth-lp-stats{position:absolute;bottom:80px;left:40px;display:flex;flex-direction:column;gap:10px;z-index:3;}
        .auth-chip{display:inline-flex;align-items:center;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.1em;color:rgba(91,148,210,0.75);background:rgba(27,48,91,0.35);border:1px solid rgba(91,148,210,0.2);border-radius:100px;padding:5px 14px;}
        .auth-chip1{animation:auth-chipFloat 3.5s ease-in-out infinite;}
        .auth-chip2{animation:auth-chipFloat 4s ease-in-out .6s infinite;}
        .auth-chip3{animation:auth-chipFloat 3.8s ease-in-out 1.2s infinite;}
        .auth-lp-testi{position:absolute;bottom:28px;left:40px;right:40px;z-index:3;}
        .auth-tq{font-family:'Libre Baskerville',serif;font-style:italic;font-size:12px;color:rgba(255,255,255,0.25);line-height:1.65;}
        .auth-ta{font-family:'DM Mono',monospace;font-size:9px;color:rgba(255,255,255,0.14);margin-top:6px;letter-spacing:0.06em;}
        .auth-hd{font-family:'Cormorant Garamond',serif;font-weight:300;font-size:clamp(34px,3.2vw,46px);letter-spacing:-0.02em;color:#fff;margin-bottom:8px;line-height:1.1;}
        .auth-sub{font-family:'Libre Baskerville',serif;font-style:italic;font-size:14px;color:rgba(255,255,255,0.4);margin-bottom:36px;line-height:1.6;}
        .auth-back{display:inline-flex;align-items:center;gap:7px;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.3);text-decoration:none;margin-bottom:36px;padding:7px 14px;border-radius:100px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.03);transition:all .2s;cursor:pointer;}
        .auth-back:hover{color:rgba(91,148,210,0.9);border-color:rgba(91,148,210,0.3);background:rgba(27,48,91,0.15);}
        .auth-fl{display:block;font-family:'DM Mono',monospace;font-size:9.5px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.38);margin-bottom:8px;}
        .auth-fi{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:18px;padding:14px 18px;font-family:'Libre Baskerville',serif;font-size:14px;color:#fff;outline:none;transition:all .2s;display:block;}
        .auth-fi::placeholder{color:rgba(255,255,255,0.2);}
        .auth-fi:focus{border-color:rgba(91,148,210,0.5);box-shadow:0 0 0 3px rgba(91,148,210,0.1);background:rgba(255,255,255,0.06);}
        .auth-fi-err{border-color:rgba(220,80,80,0.5)!important;background:rgba(220,80,80,0.04)!important;}
        .auth-fi-ok{border-color:rgba(80,200,120,0.45);}
        .auth-shake{animation:auth-shake .35s ease;}
        .auth-pw-input{padding-right:48px!important;}
        .auth-fe{font-family:'DM Mono',monospace;font-size:9px;color:rgba(220,80,80,0.9);margin-top:6px;}
        .auth-fgt{display:block;text-align:right;font-family:'DM Mono',monospace;font-size:9px;color:rgba(91,148,210,0.65);text-decoration:none;margin-top:-12px;margin-bottom:22px;}
        .auth-fgt:hover{color:rgba(91,148,210,1);text-decoration:underline;}
        .auth-sl{color:rgba(91,148,210,0.8);text-decoration:none;}
        .auth-sl:hover{color:rgba(91,148,210,1);text-decoration:underline;}
        .auth-bp{width:100%;padding:16px;border-radius:100px;font-family:'DM Mono',monospace;font-size:10.5px;letter-spacing:0.14em;text-transform:uppercase;color:#fff;background:#1B305B;border:1px solid rgba(91,148,210,0.35);border-top:1.5px solid rgba(91,148,210,0.55);box-shadow:0 4px 20px rgba(27,48,91,0.5);transition:all .22s;cursor:pointer;display:block;}
        .auth-bp:hover:not(:disabled){background:#142447;transform:translateY(-2px);box-shadow:0 8px 28px rgba(27,48,91,0.65);}
        .auth-bp:disabled{opacity:.4;cursor:default;}
        .auth-bg{width:100%;padding:14px;border-radius:100px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.58);background:transparent;border:1.5px solid rgba(255,255,255,0.12);transition:all .2s;cursor:pointer;display:block;margin-bottom:10px;}
        .auth-bg:hover{border-color:rgba(255,255,255,0.25);color:#fff;background:rgba(255,255,255,0.04);}
        .auth-ob{display:flex;align-items:center;justify-content:center;gap:8px;padding:12px 0;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-top:1.5px solid rgba(255,255,255,0.16);border-radius:18px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.06em;color:rgba(255,255,255,0.62);transition:all .2s;cursor:pointer;}
        .auth-ob:hover{background:rgba(255,255,255,0.09);transform:translateY(-1px);}
        .auth-eye{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;color:rgba(255,255,255,0.3);padding:4px;display:flex;align-items:center;cursor:pointer;transition:color .15s;}
        .auth-eye:hover{color:rgba(255,255,255,0.65);}
        .auth-dot{display:inline-block;width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,0.85);}
        .auth-dot-1{animation:auth-dotPulse .9s ease-in-out infinite;}
        .auth-dot-2{animation:auth-dotPulse .9s ease-in-out .15s infinite;}
        .auth-dot-3{animation:auth-dotPulse .9s ease-in-out .3s infinite;}
        .auth-uc{padding:20px 18px;border-radius:26px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.04);transition:all .2s;cursor:pointer;}
        .auth-uc:hover{background:rgba(255,255,255,0.07);border-color:rgba(255,255,255,0.14);transform:translateY(-2px);}
        .auth-uc-sel{background:rgba(27,48,91,0.45)!important;border:1.5px solid rgba(91,148,210,0.45)!important;border-top-color:rgba(91,148,210,0.65)!important;box-shadow:0 0 0 3px rgba(91,148,210,0.1);}
        .auth-ac{display:flex;align-items:center;gap:14px;padding:15px 18px;border-radius:26px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.04);transition:all .2s;cursor:pointer;}
        .auth-ac:hover{background:rgba(255,255,255,0.07);border-color:rgba(255,255,255,0.14);transform:translateY(-1px);}
        .auth-ac-sel{background:rgba(27,48,91,0.45)!important;border:1.5px solid rgba(91,148,210,0.45)!important;border-top-color:rgba(91,148,210,0.65)!important;box-shadow:0 0 0 3px rgba(91,148,210,0.1);}
        .auth-sbk{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.1em;color:rgba(255,255,255,0.26);background:none;border:none;padding:0;margin-top:8px;display:block;text-align:center;cursor:pointer;width:100%;transition:color .15s;}
        .auth-sbk:hover{color:rgba(255,255,255,0.6);}
        .auth-help-link{color:rgba(91,148,210,0.55);text-decoration:none;}
        .auth-help-link:hover{color:rgba(91,148,210,0.9);}
        @media(max-width:767px){
          .auth-lp{position:relative;width:100%;height:64px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
          .auth-o1,.auth-o2,.auth-o3,.auth-scan,.auth-lp-stats,.auth-lp-testi{display:none;}
          .auth-lp-mid{position:static;transform:none;display:flex;flex-direction:row;align-items:center;gap:12px;}
          .auth-cletter{font-size:36px;}
          .auth-cbrand,.auth-crule{display:none;}
          .auth-rp{margin-left:0!important;width:100%!important;}
          .auth-ob-grid{grid-template-columns:1fr!important;}
        }
        *{cursor:none!important;}
      `}</style>

      <Cursor />

      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#07070A' }}>
        <LeftPanel />

        {/* Right panel */}
        <div style={{ marginLeft: '50vw', width: '50vw', height: '100vh', background: '#0C0C10', overflowY: 'auto', overflowX: 'hidden', position: 'relative', zIndex: 2, scrollbarWidth: 'thin', scrollbarColor: 'rgba(91,148,210,0.2) transparent' }} className="auth-rp">
          <div
            style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              minHeight: '100vh', padding: '60px 72px',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
            }}
          >
            {networkErr && (
              <div style={{ background: 'rgba(220,80,80,0.1)', border: '1px solid rgba(220,80,80,0.3)', borderRadius: '10px', padding: '10px 16px', fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(220,80,80,0.9)', marginBottom: '20px' }}>
                ✗ Connection error — check your internet and try again.
              </div>
            )}
            {screen === 'gate' && <GateScreen onSignIn={() => goTo('signin')} onSignUp={() => goTo('signup')} />}
            {screen === 'signin' && <SignInScreen onBack={() => goTo('gate')} onSignUp={() => goTo('signup')} onSuccess={handleSuccess} />}
            {screen === 'signup' && <SignUpScreen onBack={() => goTo('gate')} onSignIn={() => goTo('signin')} onSuccess={handleSuccess} />}
            {screen === 'onboard' && <OnboardScreen onDone={handleDone} />}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── page export ────────────────────────────────────────── */
export default function AuthPage() {
  return (
    <Suspense>
      <AuthContent />
    </Suspense>
  );
}