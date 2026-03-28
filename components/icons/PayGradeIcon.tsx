'use client';
import React from 'react';

interface PayGradeIconProps {
  style?: React.CSSProperties;
  className?: string;
}

export function PayGradeIcon({ style = {}, className = '' }: PayGradeIconProps) {
  return (
    <svg 
      viewBox="0 0 130 130" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ ...style, overflow: 'visible' }}
      className={className}
    >
      <defs>
        <filter id="f-pg">
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
            @keyframes flicker{0%,18%,22%,25%,53%,57%,100%{opacity:1}19%,24%,54%{opacity:.4}20%{opacity:.2}}
            @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
          `}
        </style>
      </defs>
      
      <rect x="16" y="14" width="98" height="54" rx="8" fill="rgba(27,48,91,.08)" stroke="#1B305B" strokeWidth="1.3" filter="url(#f-pg)"/>
      <rect x="24" y="22" width="36" height="9" rx="3" fill="rgba(27,48,91,.22)" stroke="#1B305B" strokeWidth=".6" opacity=".5"/>
      <line x1="24" y1="38" x2="106" y2="38" stroke="#1B305B" strokeWidth=".9" opacity=".3"/>
      <line x1="24" y1="46" x2="88"  y2="46" stroke="#1B305B" strokeWidth=".8" opacity=".24"/>
      <line x1="24" y1="54" x2="95"  y2="54" stroke="#1B305B" strokeWidth=".8" opacity=".22"/>
      
      <rect x="24" y="64" width="82" height="5" rx="2.5" fill="rgba(27,48,91,.18)" stroke="#1B305B" strokeWidth=".6"/>
      <rect x="24" y="64" width="82" height="5" rx="2.5" fill="none" stroke="#1B305B" strokeWidth=".5" opacity=".3"/>
      
      <rect x="46" y="61" width="2.5" height="11" rx="1.2" fill="#1B305B" filter="url(#f-pg)"/>
      <text x="38" y="78" fontFamily="DM Mono,monospace" fontSize="6.5" fill="#1B305B" opacity=".6">P25</text>
      
      <rect x="64" y="59" width="3.5" height="15" rx="1.5" fill="#5B94D2" filter="url(#f-pg)" style={{ animation: 'flicker 3s infinite' }}/>
      <text x="57" y="78" fontFamily="DM Mono,monospace" fontSize="6.5" fill="#5B94D2" filter="url(#f-pg)">MED</text>
      
      <rect x="84" y="61" width="2.5" height="11" rx="1.2" fill="#1B305B" filter="url(#f-pg)"/>
      <text x="78" y="78" fontFamily="DM Mono,monospace" fontSize="6.5" fill="#1B305B" opacity=".6">P75</text>
      
      <circle cx="90" cy="104" r="22" fill="rgba(27,48,91,.12)" stroke="#1B305B" strokeWidth="1.4" filter="url(#f-pg)"/>
      <circle cx="90" cy="104" r="15" fill="rgba(27,48,91,.09)" stroke="#5B94D2" strokeWidth=".7" opacity=".5"/>
      <text x="82" y="110" fontFamily="Cormorant Garamond,serif" fontSize="20" fill="#1B305B" fontWeight="300" filter="url(#f-pg)" style={{ animation: 'flicker 4s infinite' }}>$</text>
      <circle cx="90" cy="104" r="26" fill="none" stroke="#1B305B" strokeWidth=".7" strokeDasharray="3 4" style={{ animation: 'spin 9s linear infinite' }}/>
    </svg>
  );
}
