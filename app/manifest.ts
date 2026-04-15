import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Clive — Developer API Marketplace',
    short_name: 'Clive',
    description: 'South African developer API marketplace',
    start_url: '/',
    display: 'standalone',
    background_color: '#07070A',
    theme_color: '#07070A',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    categories: ['developer tools', 'utilities', 'business'],
    lang: 'en-ZA',
  };
}
