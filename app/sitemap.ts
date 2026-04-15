import { MetadataRoute } from 'next';
import { products } from '@/lib/products';

const BASE = 'https://clive.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const productUrls: MetadataRoute.Sitemap = products.map(product => ({
    url: `${BASE}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    // Highest priority — main landing pages
    { url: BASE,                          lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0  },
    { url: `${BASE}/products`,            lastModified: new Date(), changeFrequency: 'daily',   priority: 0.95 },
    { url: `${BASE}/domains`,             lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9  },
    { url: `${BASE}/sell`,                lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },

    // Content / informational
    { url: `${BASE}/docs`,                lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8  },
    { url: `${BASE}/docs/api`,            lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.75 },
    { url: `${BASE}/docs/sdk`,            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7  },
    { url: `${BASE}/docs/tutorials`,      lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7  },

    // Company / legal
    { url: `${BASE}/about`,               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6  },
    { url: `${BASE}/contact`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5  },
    { url: `${BASE}/privacy`,             lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3  },
    { url: `${BASE}/terms`,               lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3  },
    { url: `${BASE}/changelog`,           lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.5  },
  ];

  return [...staticPages, ...productUrls];
}
