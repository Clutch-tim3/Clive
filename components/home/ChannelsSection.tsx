import Link from 'next/link';
import React from 'react';

const channels = [
  {
    number: '01',
    name: 'Clive Direct',
    description: 'Buy direct at the best price available, with bundle discounts on platform subscriptions.',
    href: '/',
    linkLabel: 'Learn more',
  },
  {
    number: '02',
    name: 'AWS Marketplace',
    description: 'Deploy ML models as SageMaker endpoints with consolidated AWS billing.',
    href: 'https://aws.amazon.com/marketplace',
    linkLabel: 'View listing',
  },
  {
    number: '03',
    name: 'RapidAPI',
    description: '13 developer APIs listed with a free test tier on every product.',
    href: 'https://rapidapi.com/clive',
    linkLabel: 'Browse APIs',
  },
];

export function ChannelsSection() {
  return (
    <section className="channels-sect">
      <div className="channels-inner">
        <div style={{ marginBottom: '56px' }}>
          <div className="sect-kicker">Channels</div>
          <h2 className="sect-h2" style={{ color: 'white' }}>Three ways<br />to get access.</h2>
          <p className="sect-sub" style={{ color: 'rgba(255,255,255,0.42)' }}>
            Buy direct, through AWS Marketplace, or via RapidAPI — every channel gives you the same fast endpoints.
          </p>
        </div>
        <div className="channels-grid">
          {channels.map((ch) => (
            <div key={ch.number} className="ch-card">
              <div className="ch-num">{ch.number}</div>
              <div className="ch-name">{ch.name}</div>
              <div className="ch-desc">{ch.description}</div>
              <Link href={ch.href} className="ch-link">
                {ch.linkLabel} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
