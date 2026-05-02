// scripts/seed-striker.ts
// Run with: npx ts-node scripts/seed-striker.ts
// Seeds the Striker product into Firestore so it appears in the marketplace.
// The in-code product definition already lives in lib/products.ts — this script
// populates the Firestore `products` collection used by the marketplace grid and
// acquire flow.

import { adminDb } from '../lib/firebase/admin';

async function seedStriker() {
  const db = adminDb();

  // Copy the authoritative product definition from lib/products.ts
  const product = {
    id:           'striker',
    slug:         'striker',
    name:         'Striker',
    category:     'app',            // 'ml' | 'api' | 'ext' | 'app'
    productType:  'desktop_app',    // triggers download modal instead of API-key flow
    accentColor:  'red',            // swaps navy → red theme on detail page
    isNew:        true,
    downloadUrls: {
      windows: 'https://storage.googleapis.com/clive-6d22e.appspot.com/striker/striker-win.exe',
      macos:   'https://storage.googleapis.com/clive-6d22e.appspot.com/striker/striker-mac.dmg',
      linux:   'https://storage.googleapis.com/clive-6d22e.appspot.com/striker/striker-linux.AppImage',
    },
    tagline:    'Adaptive endpoint protection that learns from every attack.',
    description:
      'Striker is an adaptive Endpoint Detection and Response (EDR) desktop application ' +
      'built on the Mahoraga engine. It monitors process activity, network traffic, file system ' +
      'events, and memory in real time — detecting threats before they cause damage. Unlike ' +
      'conventional antivirus, Striker archives every neutralised threat as a structured antibody ' +
      'and retrains its detection models nightly. Every attack makes it permanently smarter.',
    pricing: {
      label:   'Free tier available',
      display: 'Free',
      unit:    'Developer from R299/mo',
      tiers: [
        { name: 'Free',      calls: 'Real-time EDR · 100-entry archive',        price: 'R0',    highlight: false },
        { name: 'Developer', calls: 'Unlimited archive · nightly retraining',     price: 'R299/mo', highlight: true  },
        { name: 'Pro',       calls: 'Cloud sync · collective intelligence',      price: 'R799/mo', highlight: false },
      ],
    },
    features: [
      'Real-time process, network & file-system monitoring',
      'Automatic threat neutralisation on detection',
      'Antibody archive — every attack stored as structured intelligence',
      'Nightly local model retraining (adaptation loop)',
      'MITRE ATT&CK technique mapping on all detections',
    ],
    endpoints: [
      { method: 'LOCAL', path: 'Process Monitor',  description: 'Real-time process activity and anomaly detection' },
      { method: 'LOCAL', path: 'Network Sniffer',  description: 'Packet capture and C2 beacon detection' },
      { method: 'LOCAL', path: 'File Watcher',     description: 'Ransomware pattern and sensitive-file monitoring' },
      { method: 'LOCAL', path: 'Antibody Archive', description: 'SQLite + FAISS threat intelligence database' },
      { method: 'LOCAL', path: 'Adaptation Loop',  description: 'Nightly local model retraining on new threats' },
    ],
    overview: {
      title: 'Endpoint protection that grows stronger with every attack.',
      body: [
        'Striker is a desktop EDR application inspired by the human immune system. When it encounters a threat it does not merely block it — it dissects the attack, catalogues it, and uses it to improve its own detection models overnight.',
        'Every detected threat is stored in a local SQLite + FAISS antibody archive, enabling Striker to recognise variants and related techniques across future attacks. Collective intelligence mode (Pro tier) shares anonymised signatures with other Striker nodes, creating a federated threat network.',
        'Striker maps every detection to MITRE ATT&CK techniques, giving security teams structured intelligence for incident response and compliance reporting. No cloud dependency required — all analysis runs fully local.',
      ],
    },
    channels:    ['direct'],
    freeTier:    'Free — real-time detection, 100-entry archive',
    status:      'live',
    providerId:  'clive',
    providerName:'Donington Vale',
    isCliveProduct: true,
    createdAt:   new Date(),
    updatedAt:   new Date(),
  };

  await db.collection('products').doc('striker').set(product, { merge: true });
  console.log('Striker seeded to Firestore products collection.');
}

seedStriker().catch(console.error);
