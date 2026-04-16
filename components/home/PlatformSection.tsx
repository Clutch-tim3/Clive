import Link from 'next/link';
import React from 'react';
import { CodeBlock } from '../ui/CodeBlock';
import { SectionKicker } from '../ui/SectionKicker';
import { ScrollReveal } from '../ui/ScrollReveal';

export function PlatformSection() {
  return (
    <section id="platform" aria-label="Clive developer platform features" className="bg-black py-25 px-4 sm:px-8 lg:px-14">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-25 items-center">
        <ScrollReveal>
          <div className="text-white">
            <SectionKicker className="text-navy/65">
              Platform
            </SectionKicker>
            <h2 className="text-[clamp(32px,4vw,48px)] font-display font-light mb-4">
              One platform. <br />
              Every tool.
            </h2>
            <p className="text-base font-serif italic text-white/38 mb-8 max-w-xl">
              A single integration point for all Clive products. 
              One API key, one dashboard, one invoice.
            </p>
            <Link 
              href="/docs" 
              className="lg-navy"
            >
              Get started for free
            </Link>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4 pb-4 border-b border-white/05 lg">
                <span className="text-[18px] font-mono text-navy/65 mt-1">01</span>
                <div>
                  <div className="text-[19px] font-display mb-1">Unified API keys</div>
                  <div className="text-[12.5px] font-serif text-white/30">
                    One credential scoped across every product.
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 pb-4 border-b border-white/05 lg">
                <span className="text-[18px] font-mono text-navy/65 mt-1">02</span>
                <div>
                  <div className="text-[19px] font-display mb-1">Usage dashboard</div>
                  <div className="text-[12.5px] font-serif text-white/30">
                    Real-time call volumes, latency percentiles, error rates.
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 pb-4 border-b border-white/05 lg">
                <span className="text-[18px] font-mono text-navy/65 mt-1">03</span>
                <div>
                  <div className="text-[19px] font-display mb-1">Bundle billing</div>
                  <div className="text-[12.5px] font-serif text-white/30">
                    Single consolidated invoice across all product subscriptions.
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 lg">
                <span className="text-[18px] font-mono text-navy/65 mt-1">04</span>
                <div>
                  <div className="text-[19px] font-display mb-1">SDK in all major languages</div>
                  <div className="text-[12.5px] font-serif text-white/30">
                    Python, TypeScript, Go, Ruby — typed responses, retry logic.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
        
        <ScrollReveal variant="slideInRight" delay={1}>
          <CodeBlock filename="quickstart.py">
{`# pip install clive-sdk
import clive
# One client, all products
client = clive.Client("ck_live_...")
# Generate text embeddings
vecs = client.embedcore.embed(["search query from user"])
# Scan an incoming payload
risk = client.shieldkit.scan_payload(
  payload=user_input, context="web"
)
if risk.score > 60:
  block_request(risk.indicators)
# Hybrid search across your index
results = client.searchcore.search(
  index="products", query=user_query,
  mode="hybrid", facets=["category", "price"]
)`}
          </CodeBlock>
        </ScrollReveal>
      </div>
    </section>
  );
}