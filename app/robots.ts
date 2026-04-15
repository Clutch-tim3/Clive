import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/console',
          '/founder',
          '/dashboard/',
          '/api/',
          '/auth',
          '/domains/dashboard',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/console',
          '/founder',
          '/dashboard/',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://clive.dev/sitemap.xml',
    host: 'https://clive.dev',
  };
}
