import Link from 'next/link';
import React from 'react';

export function ReadyToBuildCTA() {
  return (
    <section className="rtb-sect">
      <div className="rtb-orb rtb-orb-1" />
      <div className="rtb-orb rtb-orb-2" />
      <div className="rtb-grid" />
      <div className="rtb-inner">
        <div className="rtb-kicker">
          <span className="rtb-kicker-line" />
          Get started today
          <span className="rtb-kicker-line" />
        </div>
        <h2 className="rtb-h2">Ready to build?</h2>
        <p className="rtb-sub">
          Every product ships with a free tier. No credit card. No minimum commitment. Start with one API and expand as you grow.
        </p>
        <div className="rtb-btns">
          <Link href="/#products" className="rtb-btn-primary">
            Browse products →
          </Link>
          <Link href="/docs" className="rtb-btn-ghost">
            View documentation
          </Link>
        </div>
        <div className="rtb-trust">
          <div className="rtb-trust-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="rgba(91,148,210,0.6)" strokeWidth="1.5"/>
              <path d="M8 12l3 3 5-5" stroke="rgba(91,148,210,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Free tier on every product
          </div>
          <div className="rtb-trust-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="rgba(91,148,210,0.6)" strokeWidth="1.5"/>
              <path d="M8 12l3 3 5-5" stroke="rgba(91,148,210,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            No credit card required
          </div>
          <div className="rtb-trust-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="rgba(91,148,210,0.6)" strokeWidth="1.5"/>
              <path d="M8 12l3 3 5-5" stroke="rgba(91,148,210,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Instant API key
          </div>
          <div className="rtb-trust-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="rgba(91,148,210,0.6)" strokeWidth="1.5"/>
              <path d="M8 12l3 3 5-5" stroke="rgba(91,148,210,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Cancel anytime
          </div>
        </div>
        <div className="rtb-marketplaces">
          <span className="rtb-mp-label">Also available on</span>
          <span className="rtb-mp-pill">AWS Marketplace</span>
          <span className="rtb-mp-pill">RapidAPI</span>
          <span className="rtb-mp-pill">Gumroad</span>
        </div>
      </div>
    </section>
  );
}
