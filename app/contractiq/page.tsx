import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ContractIQ — Contract Analysis & Risk Scoring API',
  description:
    'ContractIQ analyses contracts and scores risk across clauses, obligations, and termination terms. ' +
    'Upload a PDF or raw text and receive structured risk scores, flagged clauses, and a plain-English summary.',
  alternates: { canonical: '/products/contractiq' },
  robots: { index: false, follow: true },
};

export default function ContractIQRedirect() {
  redirect('/products/contractiq');
}
