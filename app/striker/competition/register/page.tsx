'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CompetitionRegistrationPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    experience: '',
    specialization: '',
    linkedin: '',
    github: '',
    motivation: '',
    agreeToRules: false,
    agreeToLiability: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.experience) newErrors.experience = 'Experience level is required';
    if (!formData.agreeToRules) newErrors.agreeToRules = 'You must agree to the competition rules';
    if (!formData.agreeToLiability) newErrors.agreeToLiability = 'You must accept the liability waiver';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (submitted) {
    return (
      <main style={{ background:'#07070A', color:'#fff', fontFamily:"'Libre Baskerville',Georgia,serif", minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ maxWidth:'600px', padding:'48px', textAlign:'center' }}>
          <div style={{ fontSize:'64px', marginBottom:'24px' }}>🎯</div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'48px', marginBottom:'16px' }}>
            Registration Submitted
          </h1>
          <p style={{ fontSize:'16px', color:'rgba(255,255,255,0.7)', lineHeight:1.6, marginBottom:'32px' }}>
            Thank you for registering for the Break the Shield competition.
            You will receive a confirmation email with your sandbox access details within 24 hours.
          </p>
          <Link href="/striker" style={{
            display:'inline-block', padding:'16px 32px', borderRadius:'100px',
            background:'rgba(220,80,80,0.9)', color:'#fff',
            border:'1px solid rgba(220,80,80,0.4)',
            fontFamily:"'DM Mono',monospace", fontSize:'11px',
            letterSpacing:'0.14em', textTransform:'uppercase', textDecoration:'none',
            transition:'all 0.25s ease',
          }}>
            Return to Striker →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background:'#07070A', color:'#fff', fontFamily:"'Libre Baskerville',Georgia,serif" }}>
      <div style={{ maxWidth:'800px', margin:'0 auto', padding:'100px 48px' }}>
        <div style={{ textAlign:'center', marginBottom:'48px' }}>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'clamp(42px,5vw,72px)', letterSpacing:'-0.03em', lineHeight:1.0, marginBottom:'16px' }}>
            Join the Competition
          </h1>
          <p style={{ fontStyle:'italic', fontSize:'15px', color:'rgba(255,255,255,0.4)', lineHeight:1.85, maxWidth:'580px', margin:'0 auto' }}>
            Register for the Break the Shield competition. Prove your skills against Striker&apos;s adaptive defenses
            and compete for cash prizes while helping improve the security landscape.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'24px', padding:'48px' }}>

          {/* Personal Information */}
          <div style={{ marginBottom:'40px' }}>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'24px', color:'#fff', marginBottom:'24px' }}>
              Personal Information
            </h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'20px' }}>
              <div>
                <label style={{ display:'block', fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.7)', marginBottom:'8px', letterSpacing:'0.1em', textTransform:'uppercase' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  style={{
                    width:'100%', padding:'12px 16px', borderRadius:'8px',
                    background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
                    color:'#fff', fontFamily:"'DM Mono',monospace", fontSize:'11px',
                    outline:'none', transition:'border-color 0.2s'
                  }}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <div style={{ color:'rgba(220,80,80,0.9)', fontSize:'9px', marginTop:'4px' }}>{errors.fullName}</div>}
              </div>
              <div>
                <label style={{ display:'block', fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.7)', marginBottom:'8px', letterSpacing:'0.1em', textTransform:'uppercase' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    width:'100%', padding:'12px 16px', borderRadius:'8px',
                    background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
                    color:'#fff', fontFamily:"'DM Mono',monospace", fontSize:'11px',
                    outline:'none', transition:'border-color 0.2s'
                  }}
                  placeholder="your.email@example.com"
                />
                {errors.email && <div style={{ color:'rgba(220,80,80,0.9)', fontSize:'9px', marginTop:'4px' }}>{errors.email}</div>}
              </div>
            </div>
          </div>

          {/* Experience & Background */}
          <div style={{ marginBottom:'40px' }}>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'24px', color:'#fff', marginBottom:'24px' }}>
              Experience & Background
            </h3>
            <div style={{ marginBottom:'20px' }}>
              <label style={{ display:'block', fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.7)', marginBottom:'8px', letterSpacing:'0.1em', textTransform:'uppercase' }}>
                Experience Level *
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                style={{
                  width:'100%', padding:'12px 16px', borderRadius:'8px',
                  background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
                  color:'#fff', fontFamily:"'DM Mono',monospace", fontSize:'11px',
                  outline:'none', transition:'border-color 0.2s'
                }}
              >
                <option value="">Select your experience level</option>
                <option value="beginner">Beginner (0-2 years)</option>
                <option value="intermediate">Intermediate (2-5 years)</option>
                <option value="advanced">Advanced (5-10 years)</option>
                <option value="expert">Expert (10+ years)</option>
              </select>
              {errors.experience && <div style={{ color:'rgba(220,80,80,0.9)', fontSize:'9px', marginTop:'4px' }}>{errors.experience}</div>}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'20px' }}>
              <div>
                <label style={{ display:'block', fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.7)', marginBottom:'8px', letterSpacing:'0.1em', textTransform:'uppercase' }}>
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  style={{
                    width:'100%', padding:'12px 16px', borderRadius:'8px',
                    background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
                    color:'#fff', fontFamily:"'DM Mono',monospace", fontSize:'11px',
                    outline:'none', transition:'border-color 0.2s'
                  }}
                  placeholder="e.g., Red Team, Malware Analysis"
                />
              </div>
              <div>
                <label style={{ display:'block', fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.7)', marginBottom:'8px', letterSpacing:'0.1em', textTransform:'uppercase' }}>
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  style={{
                    width:'100%', padding:'12px 16px', borderRadius:'8px',
                    background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
                    color:'#fff', fontFamily:"'DM Mono',monospace", fontSize:'11px',
                    outline:'none', transition:'border-color 0.2s'
                  }}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>
            <div style={{ marginBottom:'20px' }}>
              <label style={{ display:'block', fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.7)', marginBottom:'8px', letterSpacing:'0.1em', textTransform:'uppercase' }}>
                GitHub Profile
              </label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                style={{
                  width:'100%', padding:'12px 16px', borderRadius:'8px',
                  background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
                  color:'#fff', fontFamily:"'DM Mono',monospace", fontSize:'11px',
                  outline:'none', transition:'border-color 0.2s'
                }}
                placeholder="https://github.com/yourusername"
              />
            </div>
            <div>
              <label style={{ display:'block', fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.7)', marginBottom:'8px', letterSpacing:'0.1em', textTransform:'uppercase' }}>
                Motivation & Background
              </label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleInputChange}
                rows={4}
                style={{
                  width:'100%', padding:'12px 16px', borderRadius:'8px',
                  background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
                  color:'#fff', fontFamily:"'DM Mono',monospace", fontSize:'11px',
                  outline:'none', transition:'border-color 0.2s', resize:'vertical'
                }}
                placeholder="Tell us about your background and what motivates you to participate..."
              />
            </div>
          </div>

          {/* Agreements */}
          <div style={{ marginBottom:'40px' }}>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'24px', color:'#fff', marginBottom:'24px' }}>
              Agreements
            </h3>
            <div style={{ marginBottom:'16px' }}>
              <label style={{ display:'flex', alignItems:'flex-start', gap:'12px', cursor:'pointer' }}>
                <input
                  type="checkbox"
                  name="agreeToRules"
                  checked={formData.agreeToRules}
                  onChange={handleInputChange}
                  style={{ marginTop:'2px', accentColor:'rgba(220,80,80,0.9)' }}
                />
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.7)', lineHeight:1.5 }}>
                  I have read and agree to the <Link href="/striker#competition" style={{ color:'rgba(91,148,210,0.7)', textDecoration:'underline' }}>competition rules and regulations</Link> *
                </div>
              </label>
              {errors.agreeToRules && <div style={{ color:'rgba(220,80,80,0.9)', fontSize:'9px', marginTop:'4px' }}>{errors.agreeToRules}</div>}
            </div>
            <div>
              <label style={{ display:'flex', alignItems:'flex-start', gap:'12px', cursor:'pointer' }}>
                <input
                  type="checkbox"
                  name="agreeToLiability"
                  checked={formData.agreeToLiability}
                  onChange={handleInputChange}
                  style={{ marginTop:'2px', accentColor:'rgba(220,80,80,0.9)' }}
                />
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.7)', lineHeight:1.5 }}>
                  I accept the liability waiver and understand the risks involved in participating in this competition *
                </div>
              </label>
              {errors.agreeToLiability && <div style={{ color:'rgba(220,80,80,0.9)', fontSize:'9px', marginTop:'4px' }}>{errors.agreeToLiability}</div>}
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ textAlign:'center' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding:'16px 48px', borderRadius:'100px',
                background: isSubmitting ? 'rgba(220,80,80,0.5)' : 'rgba(220,80,80,0.9)',
                color:'#fff', border:'1px solid rgba(220,80,80,0.4)',
                fontFamily:"'DM Mono',monospace", fontSize:'11px',
                letterSpacing:'0.14em', textTransform:'uppercase',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition:'all 0.25s ease',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Register for Competition →'}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}