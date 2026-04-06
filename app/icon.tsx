import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#07070A',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
        }}
      >
        <span
          style={{
            fontFamily: 'serif',
            fontSize: '22px',
            color: '#5B94D2',
            fontWeight: '300',
            letterSpacing: '-1px',
          }}
        >
          C
        </span>
      </div>
    ),
    { ...size },
  );
}
