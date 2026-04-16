import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SearchCore — Full-Text, Semantic & Hybrid Search API',
  description:
    'SearchCore delivers full-text, semantic, and hybrid search in one deployable REST API. ' +
    'Ingest documents, query with natural language or keywords, and get ranked results — no infrastructure required.',
  alternates: { canonical: '/products/searchcore' },
  robots: { index: false, follow: true },
};

export default function SearchCoreRedirect() {
  redirect('/products/searchcore');
}
