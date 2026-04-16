import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FXBridge — Real-Time & Historical FX Rates API',
  description:
    'FXBridge provides real-time and historical foreign exchange rates for 170+ currency pairs. ' +
    'Includes ZAR conversion, time-series data, and currency metadata. ' +
    'Built for South African fintech and global financial applications.',
  alternates: { canonical: '/products/fxbridge' },
  robots: { index: false, follow: true },
};

export default function FXBridgeRedirect() {
  redirect('/products/fxbridge');
}
