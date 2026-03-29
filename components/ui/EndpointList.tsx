import React from 'react';
import { Endpoint } from '@/lib/products';

interface EndpointListProps {
  endpoints: Endpoint[];
}

export function EndpointList({ endpoints }: EndpointListProps) {
  const methodColors: Record<string, { bg: string; color: string }> = {
    POST: { bg: '#07070A', color: 'white' },
    GET:  { bg: 'var(--navy)', color: 'white' },
    DEL:  { bg: 'var(--black3)', color: 'white' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {endpoints.map((endpoint, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: 'var(--r-md)',
            border: '1px solid var(--border)',
            background: 'var(--paper)',
            overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            transition: 'box-shadow 0.2s',
          }}
        >
          <span style={{
            padding: '18px 20px',
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            background: methodColors[endpoint.method]?.bg ?? '#07070A',
            color: methodColors[endpoint.method]?.color ?? 'white',
            flexShrink: 0,
          }}>
            {endpoint.method}
          </span>
          <span style={{
            padding: '18px 22px',
            fontFamily: 'DM Mono, monospace',
            fontSize: '11px',
            color: 'var(--ink)',
            borderRight: '1px solid var(--border)',
            flexShrink: 0,
          }}>
            {endpoint.path}
          </span>
          <span style={{
            padding: '18px 22px',
            fontSize: '12.5px',
            fontFamily: 'Libre Baskerville, serif',
            fontStyle: 'italic',
            color: 'var(--text2)',
          }}>
            {endpoint.description}
          </span>
        </div>
      ))}
    </div>
  );
}
