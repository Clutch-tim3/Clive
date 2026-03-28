'use client';
import React from 'react';

interface ContractIQIconProps {
  style?: React.CSSProperties;
  className?: string;
}

export function ContractIQIcon({ style = {}, className = '' }: ContractIQIconProps) {
  return (
    <svg 
      viewBox="0 0 130 130" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ ...style, overflow: 'visible' }}
      className={className}
    >
      <defs>
        <filter id="f-cq">
          <feGaussianBlur stdDeviation="2" result="b1"/>
          <feGaussianBlur stdDeviation="6" result="b2"/>
          <feMerge>
            <feMergeNode in="b2"/>
            <feMergeNode in="b1"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <style>
          {`
            @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.15)}}
            @keyframes flicker{0%,18%,22%,25%,53%,57%,100%{opacity:1}19%,24%,54%{opacity:.4}20%{opacity:.2}}
          `}
        </style>
      </defs>
      
      <ellipse cx="65" cy="22" rx="40" ry="8" fill="rgba(27,48,91,.12)" stroke="#1B305B" strokeWidth="1.2" filter="url(#f-cq)"/>
      <rect x="25" y="22" width="80" height="82" rx="0" fill="rgba(27,48,91,.07)" stroke="#1B305B" strokeWidth="1.4" filter="url(#f-cq)"/>
      <ellipse cx="65" cy="104" rx="40" ry="8" fill="rgba(27,48,91,.12)" stroke="#1B305B" strokeWidth="1.2" filter="url(#f-cq)"/>
      
      <line x1="36" y1="38" x2="94" y2="38" stroke="#5B94D2" strokeWidth="1.6" opacity=".75" filter="url(#f-cq)"/>
      <line x1="36" y1="48" x2="94" y2="48" stroke="#1B305B" strokeWidth="1" opacity=".4"/>
      <line x1="36" y1="57" x2="94" y2="57" stroke="#1B305B" strokeWidth="1" opacity=".35"/>
      
      <rect x="36" y="63" width="58" height="9" rx="2" fill="rgba(27,48,91,.2)"/>
      <line x1="36" y1="68" x2="94" y2="68" stroke="#1B305B" strokeWidth="1" opacity=".35"/>
      <circle cx="96" cy="67" r="5.5" fill="rgba(27,48,91,.3)" stroke="#5B94D2" strokeWidth="1.2" filter="url(#f-cq)" style={{ animation: 'pulse 2s ease-in-out infinite' }}/>
      <text x="93.5" y="70" fontFamily="DM Mono,monospace" fontSize="7" fill="#5B94D2">!</text>
      
      <line x1="36" y1="78" x2="85" y2="78" stroke="#1B305B" strokeWidth="1" opacity=".3"/>
      
      <line x1="36" y1="92" x2="68" y2="92" stroke="#1B305B" strokeWidth=".8" strokeDasharray="2 2" opacity=".5"/>
      <path d="M36 92 Q44 87 50 92 Q56 97 62 92" fill="none" stroke="#5B94D2" strokeWidth="1.4" filter="url(#f-cq)" style={{ animation: 'flicker 6s infinite' }}/>
    </svg>
  );
}
