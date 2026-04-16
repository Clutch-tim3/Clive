'use client';
import React, { useState } from 'react';

const faqs = [
  {
    q: 'What is Clive?',
    a: 'Clive is a South African developer API marketplace offering production-ready REST APIs for security, search, finance, government tenders, contract analysis, and more. Every API includes a free tier — no credit card required.',
  },
  {
    q: 'Is there a free tier on every API?',
    a: 'Yes. Every Clive API includes a permanent free tier, not a trial. You get free calls per month on every product, forever. No credit card required to get started.',
  },
  {
    q: 'How do I get an API key?',
    a: 'Create a free account, navigate to the API you want, and click Acquire. Your API key is issued instantly. All keys are scoped per product and sent via response header on first call.',
  },
  {
    q: 'Can I sell my own API on Clive?',
    a: 'Yes. The Provider Console lets any developer list their own API on the marketplace. Clive takes a 12% platform fee — providers keep 88% of every transaction. Products are reviewed within 24 hours. Free to list.',
  },
  {
    q: 'Does Clive offer domain registration?',
    a: 'Yes. Clive offers domain registration for .com, .co.za, .net, .org, .io, .dev, and more. Availability is checked in real time against the global domain registry.',
  },
  {
    q: 'Is Clive only for South African developers?',
    a: 'Clive is built in South Africa and focused on the African developer market, but the platform is open to developers globally. All APIs are accessible internationally.',
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" aria-label="Frequently asked questions" className="py-24 px-12 lg:px-14 border-t border-white/05" style={{ background: 'var(--black)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <span
            className="text-[10px] font-mono tracking-[0.22em] uppercase mb-4 block"
            style={{ color: 'rgba(91,148,210,0.7)' }}
          >
            FAQ
          </span>
          <h2 className="text-[clamp(32px,4vw,52px)] font-display font-light tracking-[-0.025em]" style={{ color: 'white' }}>
            Common questions.
          </h2>
        </div>

        <dl className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderTop: i === 0 ? '1px solid rgba(255,255,255,0.07)' : undefined }}>
              <dt>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  className="w-full flex justify-between items-center py-5 text-left gap-6"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <span className="font-serif italic text-[15px]" style={{ color: open === i ? 'white' : 'rgba(255,255,255,0.65)' }}>
                    {faq.q}
                  </span>
                  <span
                    className="font-mono text-[18px] flex-shrink-0 transition-transform"
                    style={{
                      color: 'rgba(91,148,210,0.7)',
                      transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    +
                  </span>
                </button>
              </dt>
              {open === i && (
                <dd className="pb-5" style={{ margin: 0 }}>
                  <p className="font-serif italic text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {faq.a}
                  </p>
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
