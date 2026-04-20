import React from 'react';
import { Endpoint } from '@/lib/products';

interface EndpointListProps {
  endpoints: Endpoint[];
}

export function EndpointList({ endpoints }: EndpointListProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {endpoints.map((endpoint, index) => (
        <div key={index} className="ep-item-dark">
          <span style={{
            padding: '18px 18px',
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            background: endpoint.method === 'GET' ? 'rgba(27,48,91,0.55)' : endpoint.method === 'LOCAL' ? 'rgba(180,20,20,0.25)' : 'rgba(0,0,0,0.35)',
            color: endpoint.method === 'GET' ? 'rgba(91,148,210,0.9)' : endpoint.method === 'LOCAL' ? 'rgba(220,80,80,0.85)' : 'rgba(255,255,255,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '68px',
            flexShrink: 0,
            borderRight: '1px solid rgba(255,255,255,0.07)',
          }}>
            {endpoint.method}
          </span>
          <span style={{
            padding: '18px 22px',
            fontFamily: 'DM Mono, monospace',
            fontSize: '11.5px',
            color: 'rgba(255,255,255,0.75)',
            borderRight: '1px solid rgba(255,255,255,0.07)',
            minWidth: '220px',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}>
            {endpoint.path}
          </span>
          <span style={{
            padding: '18px 22px',
            fontSize: '13px',
            fontFamily: 'Libre Baskerville, serif',
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.38)',
            display: 'flex',
            alignItems: 'center',
            flex: 1,
          }}>
            {endpoint.description}
          </span>
        </div>
      ))}
    </div>
  );
}
