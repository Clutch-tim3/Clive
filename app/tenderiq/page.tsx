import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TenderIQ — South African Government Tender Intelligence API',
  description:
    'TenderIQ delivers structured South African government tender data from CC BY 4.0 licensed ' +
    'procurement sources. Search, filter, and monitor tenders by department, province, value, and keyword.',
  alternates: { canonical: '/products/tenderiq' },
  robots: { index: false, follow: true },
};

export default function TenderIQRedirect() {
  redirect('/products/tenderiq');
}
