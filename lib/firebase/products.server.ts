import { adminDb } from './admin';
import { DocumentData } from 'firebase-admin/firestore';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: 'ml' | 'api' | 'ext' | 'app';
  listingType?: 'own' | 'partner';
  productType?: 'desktop_app';
  accentColor?: 'red';
  downloadUrls?: { windows?: string; macos?: string; linux?: string };
  tagline: string;
  description: string;
  pricing: {
    label: string;
    display: string;
    unit: string;
    tiers: Array<{
      name: string;
      price: string;
      calls: string;
    }>;
  };
  features: string[];
  endpoints: Array<{
    method: 'POST' | 'GET' | 'DEL' | 'LOCAL';
    path: string;
    description: string;
  }>;
  overview: {
    title: string;
    body: string[];
  };
  channels: string[];
  freeTier: string;
  licence?: string;
  isNew?: boolean;
  isRebuilt?: boolean;
  // Additional fields stored in Firestore
  status: string;
  providerId: string;
  providerName: string;
  isCliveProduct?: boolean;
  stats?: {
    totalSubscribers: number;
    monthlyRevenue: number;
    totalCalls: number;
    avgLatencyMs: number;
    uptimePct: number;
    errorRatePct: number;
  };
  createdAt: any;
  updatedAt: any;
}

export async function getLiveProducts(): Promise<Product[]> {
  const q = adminDb().collection('products').where('status', '==', 'live');
  const snap = await q.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const q = adminDb().collection('products').where('slug', '==', slug).limit(1);
  const snap = await q.get();
  if (snap.empty) return null;
  const data = snap.docs[0].data() as DocumentData;
  return { id: snap.docs[0].id, ...data } as Product;
}

export async function getProductById(id: string): Promise<Product | null> {
  const docRef = adminDb().collection('products').doc(id);
  const snap = await docRef.get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() } as Product;
}
