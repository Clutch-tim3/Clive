import type { Metadata } from 'next';
import { SectionKicker } from '@/components/ui/SectionKicker';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: 'Documentation — API Reference, SDK & Guides',
  description:
    'Complete documentation for the Clive developer platform. ' +
    'API reference, SDK guide, authentication, webhooks, and tutorials ' +
    'for all Clive APIs.',
  alternates: { canonical: '/docs' },
};

export default function DocsPage() {
  return (
    <section className="pt-24 pb-18 px-14">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="mb-16">
            <SectionKicker>Documentation</SectionKicker>
            <h1 className="text-[clamp(48px,6vw,72px)] font-display font-light mb-4">
              Documentation
            </h1>
            <p className="text-base font-serif italic text-text2">
              Explore our API documentation, SDK guides, and tutorials.
            </p>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScrollReveal delay={0.1}>
            <div className="p-8 border border-border bg-white hover:bg-paper transition-colors">
              <h2 className="text-[24px] font-display mb-4">API Reference</h2>
              <p className="text-[13px] font-serif text-text2 mb-6">
                Detailed API documentation for all Clive products.
              </p>
              <a href="/docs/api" className="text-[11px] font-mono text-navy hover:text-ink transition-colors">
                View API reference →
              </a>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <div className="p-8 border border-border bg-white hover:bg-paper transition-colors">
              <h2 className="text-[24px] font-display mb-4">SDK Guides</h2>
              <p className="text-[13px] font-serif text-text2 mb-6">
                Get started with our SDKs for Python, TypeScript, and more.
              </p>
              <a href="/docs/sdk" className="text-[11px] font-mono text-navy hover:text-ink transition-colors">
                View SDK guides →
              </a>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.3}>
            <div className="p-8 border border-border bg-white hover:bg-paper transition-colors">
              <h2 className="text-[24px] font-display mb-4">Tutorials</h2>
              <p className="text-[13px] font-serif text-text2 mb-6">
                Step-by-step tutorials to help you build with Clive.
              </p>
              <a href="/docs/tutorials" className="text-[11px] font-mono text-navy hover:text-ink transition-colors">
                View tutorials →
              </a>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.4}>
            <div className="p-8 border border-border bg-white hover:bg-paper transition-colors">
              <h2 className="text-[24px] font-display mb-4">Changelog</h2>
              <p className="text-[13px] font-serif text-text2 mb-6">
                Stay up to date with the latest changes and features.
              </p>
              <a href="/docs/changelog" className="text-[11px] font-mono text-navy hover:text-ink transition-colors">
                View changelog →
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}