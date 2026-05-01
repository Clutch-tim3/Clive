import { adminDb } from './admin';
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  limit,
  DocumentData,
} from 'firebase-admin/firestore';

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
  const q = query(
    collection(adminDb(), 'products'),
    where('status', '==', 'live')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const q = query(
    collection(adminDb(), 'products'),
    where('slug', '==', slug),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const data = snap.docs[0].data() as DocumentData;
  return { id: snap.docs[0].id, ...data } as Product;
}

export async function getProductById(id: string): Promise<Product | null> {
  const docRef = doc(collection(adminDb(), 'products'), id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Product;
}
