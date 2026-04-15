import { ImageResponse } from 'next/og';

export const runtime = 'edge';
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
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 700,
            height: 700,
            borderRadius: '50%',
            background: 'rgba(27,48,91,0.35)',
            filter: 'blur(120px)',
          }}
        />
        <div
          style={{
            fontSize: 13,
            color: 'rgba(91,148,210,0.7)',
            fontFamily: 'monospace',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          Domain Registration · Clive
        </div>
        <div style={{ fontSize: 68, fontWeight: 300, color: 'white', marginBottom: 20 }}>
          Find your domain.
        </div>
        <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic', marginBottom: 44 }}>
          .com · .co.za · .net · .org · .io · .dev
        </div>
        <div
          style={{
            padding: '10px 28px',
            background: 'rgba(27,48,91,0.6)',
            border: '1px solid rgba(91,148,210,0.3)',
            borderRadius: 100,
            fontSize: 13,
            color: 'rgba(91,148,210,0.8)',
            fontFamily: 'monospace',
            letterSpacing: '0.08em',
          }}
        >
          Real-time availability · South African registrar
        </div>
      </div>
    ),
    { ...size },
  );
}
