import React from 'react';
import { Endpoint } from '@/lib/products';

interface EndpointListProps {
  endpoints: Endpoint[];
}

export function EndpointList({ endpoints }: EndpointListProps) {
  const methodColors = {
    POST: 'bg-black text-white border-black',
    GET: 'bg-navy text-white border-navy',
    DEL: 'bg-black3 text-white border-black3',
  };

  return (
    <div className="space-y-3">
      {endpoints.map((endpoint, index) => (
        <div
          key={index}
          className="flex items-center p-3 border border-border hover:bg-paper transition-colors rounded-lg shadow-sm hover:shadow-md"
        >
          <span
            className={`px-3 py-1 text-[10px] font-mono font-medium rounded-sm mr-4 ${
              methodColors[endpoint.method]
            }`}
          >
            {endpoint.method}
          </span>
          <span className="flex-1 text-[11px] font-mono text-ink border-r border-border pr-4 mr-4">
            {endpoint.path}
          </span>
          <span className="text-[12.5px] font-serif italic text-text2">
            {endpoint.description}
          </span>
        </div>
      ))}
    </div>
  );
}