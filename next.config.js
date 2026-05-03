/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      // Security headers on all routes
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control',  value: 'on'                       },
          { key: 'X-Frame-Options',         value: 'SAMEORIGIN'               },
          { key: 'X-Content-Type-Options',  value: 'nosniff'                  },
          { key: 'Referrer-Policy',         value: 'origin-when-cross-origin' },
          {
            key:   'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // Cache Next.js static assets aggressively
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Cache generated OG images for 24 hours
      {
        source: '/og/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=3600' },
        ],
      },
      // Preserve strict headers for domain API routes
      {
        source: '/api/domains/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options',        value: 'DENY'    },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Canonical: www → non-www
      {
        source:      '/:path*',
        has:         [{ type: 'host', value: 'www.clive.dev' }],
        destination: 'https://clive.dev/:path*',
        permanent:   true,
      },
    ];
  },
}

module.exports = nextConfig
