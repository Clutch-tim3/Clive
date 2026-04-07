'use client';
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';

interface AvailabilityResult {
  domainName:    string;
  tld:           string;
  status:        'available' | 'taken' | 'premium' | 'unsupported' | 'error';
  purchasable:   boolean;
  priceUSD?:     number;
  priceZAR?:     number;
  renewalUSD?:   number;
  renewalZAR?:   number;
  isPremium:     boolean;
}

const PERIOD_OPTIONS = [
  { label: '1 year',  years: 1 },
  { label: '2 years', years: 2 },
  { label: '3 years', years: 3 },
  { label: '5 years', years: 5 },
];

const PROVINCES = [
  { value: 'GP', label: 'Gauteng' },
  { value: 'WC', label: 'Western Cape' },
  { value: 'KZN', label: 'KwaZulu-Natal' },
  { value: 'EC', label: 'Eastern Cape' },
  { value: 'FS', label: 'Free State' },
  { value: 'LP', label: 'Limpopo' },
  { value: 'MP', label: 'Mpumalanga' },
  { value: 'NC', label: 'Northern Cape' },
  { value: 'NW', label: 'North West' },
];

const PRIVACY_PRICE_ZAR = 9900; // cents — R99

function formatZAR(cents: number): string {
  return `R${(cents / 100).toFixed(0)}`;
}

function fieldStyle(hasError?: boolean): React.CSSProperties {
  return {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${hasError ? 'rgba(255,100,100,0.5)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: '10px', color: '#fff',
    fontFamily: "'DM Mono', monospace", fontSize: '13px',
    padding: '12px 14px', outline: 'none', transition: 'border-color .15s',
  };
}

export default function DomainPurchasePage({ params }: { params: Promise<{ domain: string }> }) {
  const router = useRouter();
  const { domain } = use(params);
  const domainName = decodeURIComponent(domain);
  const isCoza = domainName.endsWith('.co.za');
  const tld = isCoza ? 'co.za' : (domainName.split('.').pop() ?? 'com');

  // Availability check on mount
  const [domainResult, setDomainResult] = useState<AvailabilityResult | null>(null);
  const [checkLoading, setCheckLoading] = useState(true);

  // Auth
  const [userEmail, setUserEmail] = useState('');
  const [loggedIn,  setLoggedIn]  = useState(false);

  // Form
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [phone,     setPhone]     = useState('');
  const [company,   setCompany]   = useState('');
  const [address,   setAddress]   = useState('');
  const [city,      setCity]      = useState('');
  const [province,  setProvince]  = useState('GP');
  const [zip,       setZip]       = useState('');
  const [years,     setYears]     = useState(1);
  const [privacy,   setPrivacy]   = useState(true);

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');
  const [errors,     setErrors]     = useState<Record<string, string>>({});

  useEffect(() => {
    // Check availability
    fetch(`/api/domains/check?q=${encodeURIComponent(domainName)}`)
      .then(r => r.json())
      .then((d: { results?: AvailabilityResult[] }) => {
        const match = d.results?.find(r => r.domainName === domainName);
        setDomainResult(match ?? null);
      })
      .catch(() => setDomainResult(null))
      .finally(() => setCheckLoading(false));

    // Auth
    import('firebase/auth').then(({ onAuthStateChanged }) =>
      import('@/lib/firebase/client').then(({ auth }) => {
        onAuthStateChanged(auth, user => {
          if (user) {
            setLoggedIn(true);
            setEmail(user.email ?? '');
            setUserEmail(user.email ?? '');
            const parts = (user.displayName ?? '').split(' ');
            setFirstName(parts[0] ?? '');
            setLastName(parts.slice(1).join(' '));
          }
        });
      })
    );
  }, [domainName]);

  const basePrice  = domainResult?.priceZAR ?? 0;
  const renewPrice = domainResult?.renewalZAR ?? 0;
  const privacyFee = (!isCoza && privacy) ? PRIVACY_PRICE_ZAR : 0;
  const total      = (basePrice * years) + privacyFee;

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = '↳ Required';
    if (!lastName.trim())  e.lastName  = '↳ Required';
    if (!phone.trim())     e.phone     = '↳ Required';
    if (!address.trim())   e.address   = '↳ Required';
    if (!city.trim())      e.city      = '↳ Required';
    if (phone && !/^\d{9,11}$/.test(phone.replace(/\s/g, '')))
      e.phone = '↳ Enter digits only, e.g. 821234567';
    if (address.trim().length < 5) e.address = '↳ Minimum 5 characters';
    return e;
  };

  const handleSubmit = async () => {
    if (!loggedIn) {
      router.push(`/auth?screen=signup&redirect=${encodeURIComponent(`/domains/${domain}`)}`);
      return;
    }
    const v = validate();
    if (Object.keys(v).length > 0) { setErrors(v); return; }
    setErrors({});
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/domains/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domainName, years,
          privacyEnabled: privacy && !isCoza,
          firstName: firstName.trim(),
          lastName:  lastName.trim(),
          email:     email || userEmail,
          phone:     phone.replace(/\s/g, ''),
          company:   company.trim() || undefined,
          address:   address.trim(),
          city:      city.trim(),
          state:     province,
          zip:       zip.trim(),
          country:   'ZA',
        }),
      });

      const data = await res.json() as { id?: string; error?: string; code?: string };
      if (!res.ok) {
        if (data.code === 'DOMAIN_TAKEN') {
          setError('This domain was just registered by someone else. Choose a different name.');
        } else {
          setError(data.error ?? 'Registration failed. Please try again.');
        }
        return;
      }

      router.push('/domains/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'rgba(91,148,210,0.45)';
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (checkLoading) {
    return (
      <>
        <Nav />
        <div style={{ minHeight: '100vh', background: '#07070A', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)' }}>
            Checking availability…
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ── Taken state ────────────────────────────────────────────────────────────
  if (domainResult && !domainResult.purchasable) {
    return (
      <>
        <Nav />
        <div style={{ minHeight: '100vh', background: '#07070A', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', maxWidth: '480px', padding: '0 32px' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.18em', color: 'rgba(255,100,100,0.7)', textTransform: 'uppercase', marginBottom: '16px' }}>
              Not Available
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '48px', color: '#fff', margin: '0 0 16px' }}>
              {domainName}
            </h1>
            <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '14px', color: 'rgba(255,255,255,0.35)', marginBottom: '32px', lineHeight: 1.7 }}>
              This domain is already registered. Try a different name or extension.
            </p>
            <a href="/domains" style={{ display: 'inline-block', padding: '12px 28px', background: '#1B305B', border: '1.5px solid rgba(91,148,210,0.35)', borderRadius: '100px', fontFamily: "'DM Mono', monospace", fontSize: '10.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'white', textDecoration: 'none' }}>
              ← Search again
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ── Purchase form ──────────────────────────────────────────────────────────
  return (
    <>
      <Nav />
      <div style={{ minHeight: '100vh', background: '#07070A', paddingTop: '64px' }}>
        <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(27,48,91,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(27,48,91,0.05) 1px,transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', top: '-100px', right: '-60px', width: '500px', height: '500px', background: 'rgba(27,48,91,0.16)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1040px', margin: '0 auto', padding: '56px 32px' }}>

          {/* Back */}
          <a href="/domains"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', marginBottom: '40px', transition: 'color .15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
          >
            ← Back to search
          </a>

          {/* Heading */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.65)', marginBottom: '12px' }}>
              Register domain
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(36px,5vw,64px)', color: '#fff', margin: '0 0 14px', lineHeight: 1.05 }}>
              {domainName}
            </h1>
            {domainResult?.isPremium && (
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', color: 'rgba(210,160,50,0.9)', background: 'rgba(210,160,50,0.1)', border: '1px solid rgba(210,160,50,0.25)', padding: '4px 12px', borderRadius: '100px', marginRight: '10px' }}>
                ⚠ Premium domain
              </span>
            )}
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', color: 'rgba(80,200,120,0.9)', background: 'rgba(80,200,120,0.1)', border: '1px solid rgba(80,200,120,0.2)', padding: '4px 12px', borderRadius: '100px' }}>
              Available
            </span>
          </div>

          {/* 2-column layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '48px', alignItems: 'start' }}>

            {/* LEFT — Form */}
            <div>
              {/* Auth warning */}
              {!loggedIn && (
                <div style={{ padding: '16px 20px', background: 'rgba(27,48,91,0.3)', border: '1px solid rgba(91,148,210,0.2)', borderRadius: '12px', marginBottom: '28px' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9.5px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.8)', marginBottom: '5px' }}>Sign in required</div>
                  <div style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                    Fill in your details below — we&apos;ll take you to sign in to complete the registration.
                  </div>
                </div>
              )}

              {/* Section label */}
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.65)', marginBottom: '8px' }}>
                Registrant details
              </div>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '8.5px', color: 'rgba(255,255,255,0.22)', lineHeight: 1.8, marginBottom: '24px' }}>
                These details are submitted to the domain registry and may be visible in WHOIS. Enable privacy protection below to hide them.
                {isCoza && ' Note: WHOIS privacy is not available for .co.za domains due to ZACR registry policy.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                {/* Name row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { label: 'First Name', val: firstName, set: setFirstName, key: 'firstName' },
                    { label: 'Last Name',  val: lastName,  set: setLastName,  key: 'lastName'  },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '8.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '5px' }}>{f.label} *</label>
                      <input type="text" value={f.val} onChange={e => f.set(e.target.value)} onFocus={onFocus} onBlur={onBlur} style={fieldStyle(!!errors[f.key])} />
                      {errors[f.key] && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '8.5px', color: 'rgba(255,100,100,0.8)', marginTop: '3px' }}>{errors[f.key]}</div>}
                    </div>
                  ))}
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '8.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '5px' }}>Email Address</label>
                  <input type="email" value={email} readOnly={loggedIn} onChange={e => setEmail(e.target.value)} onFocus={onFocus} onBlur={onBlur}
                    style={{ ...fieldStyle(), opacity: loggedIn ? 0.6 : 1, cursor: loggedIn ? 'not-allowed' : 'text' }} />
                </div>

                {/* Phone */}
                <div>
                  <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '8.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '5px' }}>Phone Number *</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} onFocus={onFocus} onBlur={onBlur} placeholder="82 123 4567" style={fieldStyle(!!errors.phone)} />
                  {errors.phone
                    ? <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '8.5px', color: 'rgba(255,100,100,0.8)', marginTop: '3px' }}>{errors.phone}</div>
                    : <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '8px', color: 'rgba(255,255,255,0.18)', marginTop: '3px' }}>South Africa number, no country code</div>
                  }
                </div>

                {/* Company (optional) */}
                <div>
                  <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '8.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '5px' }}>Company (optional)</label>
                  <input type="text" value={company} onChange={e => setCompany(e.target.value)} onFocus={onFocus} onBlur={onBlur} style={fieldStyle()} />
                </div>

                {/* Address */}
                <div>
                  <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '8.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '5px' }}>Address *</label>
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)} onFocus={onFocus} onBlur={onBlur} placeholder="123 Main Street" style={fieldStyle(!!errors.address)} />
                  {errors.address && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '8.5px', color: 'rgba(255,100,100,0.8)', marginTop: '3px' }}>{errors.address}</div>}
                </div>

                {/* City + Province */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '8.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '5px' }}>City *</label>
                    <input type="text" value={city} onChange={e => setCity(e.target.value)} onFocus={onFocus} onBlur={onBlur} style={fieldStyle(!!errors.city)} />
                    {errors.city && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '8.5px', color: 'rgba(255,100,100,0.8)', marginTop: '3px' }}>{errors.city}</div>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '8.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '5px' }}>Province</label>
                    <select value={province} onChange={e => setProvince(e.target.value)} onFocus={onFocus} onBlur={onBlur} style={{ ...fieldStyle(), appearance: 'none' as const }}>
                      {PROVINCES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Postal code */}
                <div style={{ maxWidth: '160px' }}>
                  <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '8.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '5px' }}>Postal Code</label>
                  <input type="text" value={zip} onChange={e => setZip(e.target.value)} onFocus={onFocus} onBlur={onBlur} placeholder="0000" style={fieldStyle()} />
                </div>

                {/* Privacy toggle */}
                {isCoza ? (
                  <div style={{ padding: '14px 16px', background: 'rgba(255,180,0,0.05)', border: '1px solid rgba(255,180,0,0.15)', borderRadius: '10px' }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,180,0,0.7)', marginBottom: '5px' }}>WHOIS Privacy Unavailable</div>
                    <div style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '12px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.7 }}>
                      WHOIS privacy is not available for .co.za domains due to ZACR registry policy. Your details will be visible in the public WHOIS.
                    </div>
                  </div>
                ) : (
                  <label style={{ display: 'flex', gap: '12px', cursor: 'pointer', padding: '14px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px' }}>
                    <input type="checkbox" checked={privacy} onChange={e => setPrivacy(e.target.checked)} style={{ marginTop: '2px', accentColor: 'rgba(91,148,210,0.9)', width: '14px', height: '14px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: '4px' }}>
                        WHOIS Privacy Protection &nbsp;<span style={{ color: 'rgba(91,148,210,0.6)' }}>+{formatZAR(PRIVACY_PRICE_ZAR)}/yr</span>
                      </div>
                      <div style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '12px', color: 'rgba(255,255,255,0.28)', lineHeight: 1.6 }}>
                        Hide your contact details from the public WHOIS database.
                      </div>
                    </div>
                  </label>
                )}

                {/* Registration period */}
                <div>
                  <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '8.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '10px' }}>Registration Period</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {PERIOD_OPTIONS.map(opt => (
                      <button
                        key={opt.years}
                        onClick={() => setYears(opt.years)}
                        style={{
                          padding: '8px 18px',
                          background: years === opt.years ? '#1B305B' : 'rgba(255,255,255,0.03)',
                          border: years === opt.years ? '1px solid rgba(91,148,210,0.4)' : '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '100px',
                          fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.08em',
                          color: years === opt.years ? 'rgba(91,148,210,1)' : 'rgba(255,255,255,0.4)',
                          cursor: 'pointer', transition: 'all .15s',
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — Order summary */}
            <div style={{ position: 'sticky', top: '88px' }}>
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderTop: '1.5px solid rgba(255,255,255,0.22)',
                borderRadius: '20px', padding: '28px',
              }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(91,148,210,0.65)', marginBottom: '20px' }}>
                  Order Summary
                </div>

                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '14px', color: '#fff', marginBottom: '4px' }}>{domainName}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>
                  {years} {years === 1 ? 'year' : 'years'}
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>
                    <span>Registration ({years}yr)</span>
                    <span>{basePrice ? formatZAR(basePrice * years) : '—'}</span>
                  </div>
                  {!isCoza && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'DM Mono', monospace", fontSize: '11px', color: privacy ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.2)' }}>
                      <span>WHOIS privacy</span>
                      <span>{privacy ? formatZAR(PRIVACY_PRICE_ZAR) : '—'}</span>
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: '16px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9.5px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>Total</span>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '36px', color: '#fff' }}>
                    {basePrice ? formatZAR(total) : '—'}
                  </span>
                </div>

                {renewPrice > 0 && (
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '8px', color: 'rgba(255,255,255,0.25)', marginTop: '8px', textAlign: 'right' }}>
                    Renewal price: {formatZAR(renewPrice)}/yr after first year
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div style={{ marginTop: '16px', padding: '12px 14px', background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.22)', borderRadius: '10px', fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(255,130,130,0.9)', lineHeight: 1.6 }}>
                    {error}
                  </div>
                )}

                {/* Register button */}
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    marginTop: '20px', width: '100%', padding: '14px',
                    background: submitting ? 'rgba(27,48,91,0.5)' : '#1B305B',
                    border: '1.5px solid rgba(91,148,210,0.35)', borderRadius: '12px',
                    fontFamily: "'DM Mono', monospace", fontSize: '10.5px', letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: submitting ? 'rgba(255,255,255,0.4)' : 'white',
                    cursor: submitting ? 'default' : 'pointer', transition: 'background .2s',
                  }}
                  onMouseEnter={e => { if (!submitting) (e.currentTarget.style.background = '#243d6e'); }}
                  onMouseLeave={e => (e.currentTarget.style.background = submitting ? 'rgba(27,48,91,0.5)' : '#1B305B')}
                >
                  {submitting ? 'Registering…' : loggedIn ? `Register ${domainName} →` : 'Sign in to register →'}
                </button>

                <div style={{ marginTop: '14px', fontFamily: "'DM Mono', monospace", fontSize: '7.5px', color: 'rgba(255,255,255,0.16)', lineHeight: 1.8, textAlign: 'center' }}>
                  By registering you agree to the{' '}
                  <a href="https://www.name.com/registration-agreement" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(91,148,210,0.4)', textDecoration: 'none' }}>Name.com Registration Agreement</a>
                  {' '}and Clive&apos;s Terms of Service.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
