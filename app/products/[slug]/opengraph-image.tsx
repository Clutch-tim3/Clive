import { ImageResponse } from 'next/og';
import { getProductBySlug } from '@/lib/products';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);

  const name     = product?.name     ?? 'API';
  const tagline  = product?.tagline  ?? '';
  const category = product?.category ?? 'api';
  const freeTier = product?.freeTier ?? 'Free tier included';

  const categoryLabel: Record<string, string> = {
    api: 'Developer API',
    ml:  'ML Model',
    ext: 'Chrome Extension',
    app: 'Web Application',
  };

  return new ImageResponse(
    (
      <div
        style={{
          background: '#07070A',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '60px 80px',
          fontFamily: 'serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background orb */}
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'rgba(27,48,91,0.45)',
            filter: 'blur(100px)',
          }}
        />

        {/* Left: product info */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Category + domain */}
          <div
            style={{
              fontSize: 12,
              color: 'rgba(91,148,210,0.7)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: 'monospace',
              marginBottom: 20,
            }}
          >
            {categoryLabel[category] ?? category} · clive.dev
          </div>

          {/* Product name */}
          <div
            style={{
              fontSize: 76,
              fontWeight: 300,
              color: 'white',
              lineHeight: 1.05,
              marginBottom: 20,
            }}
          >
            {name}
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 22,
              color: 'rgba(255,255,255,0.5)',
              fontStyle: 'italic',
              lineHeight: 1.5,
              maxWidth: 560,
              marginBottom: 36,
            }}
          >
            {tagline}
          </div>

          {/* Free tier chip */}
          <div
            style={{
              display: 'flex',
              padding: '10px 24px',
              background: 'rgba(27,48,91,0.6)',
              border: '1px solid rgba(91,148,210,0.3)',
              borderRadius: 100,
              fontSize: 13,
              color: 'rgba(91,148,210,0.9)',
              fontFamily: 'monospace',
              width: 'fit-content',
            }}
          >
            {freeTier}
          </div>
        </div>

        {/* Right: icon box */}
        <div
          style={{
            width: 160,
            height: 160,
            background: 'rgba(27,48,91,0.5)',
            border: '1px solid rgba(91,148,210,0.3)',
            borderRadius: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 80,
            flexShrink: 0,
          }}
        >
          ⚡
        </div>
      </div>
    ),
    { ...size },
  );
}
