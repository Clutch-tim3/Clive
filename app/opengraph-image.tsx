import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Clive — Developer API Marketplace';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#07070A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background orb */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'rgba(27,48,91,0.5)',
            filter: 'blur(120px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(27,48,91,0.3)',
            filter: 'blur(100px)',
          }}
        />

        {/* C glyph */}
        <div
          style={{
            fontSize: 120,
            fontWeight: 300,
            color: '#1B305B',
            lineHeight: 1,
            marginBottom: 8,
            filter:
              'drop-shadow(0 0 30px rgba(80,160,255,0.8)) drop-shadow(0 0 60px rgba(80,160,255,0.4))',
          }}
        >
          C
        </div>

        {/* Wordmark */}
        <div style={{ fontSize: 56, fontWeight: 300, color: 'white', marginBottom: 12 }}>
          CLIVE
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 22,
            color: 'rgba(255,255,255,0.45)',
            fontStyle: 'italic',
            marginBottom: 44,
          }}
        >
          Developer API Marketplace
        </div>

        {/* Chips */}
        <div style={{ display: 'flex', gap: 20 }}>
          {['Production-ready APIs', 'Free tier on every product', 'South Africa'].map(label => (
            <div
              key={label}
              style={{
                padding: '9px 22px',
                background: 'rgba(27,48,91,0.6)',
                border: '1px solid rgba(91,148,210,0.35)',
                borderRadius: 100,
                fontSize: 13,
                color: 'rgba(91,148,210,0.9)',
                fontFamily: 'monospace',
                letterSpacing: '0.08em',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
