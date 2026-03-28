'use client';
import React from 'react';

interface TalentPulseIconProps {
  style?: React.CSSProperties;
  className?: string;
}

export function TalentPulseIcon({ style = {}, className = '' }: TalentPulseIconProps) {
  return (
    <svg 
      viewBox="0 0 130 130" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ ...style, overflow: 'visible' }}
      className={className}
    >
      <defs>
        <filter id="f-tp">
          <feGaussianBlur stdDeviation="2.2" result="b1"/>
          <feGaussianBlur stdDeviation="6" result="b2"/>
          <feMerge>
            <feMergeNode in="b2"/>
            <feMergeNode in="b1"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <style>
          {`
            @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
            @keyframes twinkle{0%,100%{opacity:.15;transform:scale(.6)}50%{opacity:1;transform:scale(1.3)}}
            @keyframes flicker{0%,18%,22%,25%,53%,57%,100%{opacity:1}19%,24%,54%{opacity:.4}20%{opacity:.2}}
            @keyframes ripple{0%{r:6;opacity:.7}100%{r:44;opacity:0}}
          `}
        </style>
      </defs>
      
      <circle cx="65" cy="30" r="18" fill="rgba(27,48,91,.12)" stroke="#1B305B" strokeWidth="1.5" filter="url(#f-tp)"/>
      
      <path d="M30 82 Q30 60 65 60 Q100 60 100 82" fill="rgba(27,48,91,.09)" stroke="#1B305B" strokeWidth="1.5" strokeLinecap="round" filter="url(#f-tp)"/>
      
      <circle cx="65" cy="30" r="25" fill="none" stroke="#1B305B" strokeWidth=".8" strokeDasharray="2 4" style={{ animation: 'spin 8s linear infinite' }}/>
      
      <circle cx="88" cy="16" r="5.5" fill="#07070A" stroke="#5B94D2" strokeWidth="1.5" filter="url(#f-tp)" style={{ animation: 'twinkle 2s ease-in-out infinite' }}/>
      <text x="85.5" y="20" fontFamily="DM Mono,monospace" fontSize="7" fill="#5B94D2" filter="url(#f-tp)">↑</text>
      
      <polyline points="12,105 28,105 35,90 42,118 50,80 56,108 65,105 75,105 81,96 88,112 95,92 104,105 118,105"
        fill="none" stroke="#1B305B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        filter="url(#f-tp)" style={{ animation: 'flicker 3s ease-in-out infinite' }}/>
      
      <circle cx="65" cy="105" r="4" fill="#5B94D2" filter="url(#f-tp)" style={{ animation: 'ripple 1.8s ease-out infinite' }}/>
    </svg>
  );
}
