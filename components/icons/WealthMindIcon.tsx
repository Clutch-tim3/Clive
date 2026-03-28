'use client';
import React from 'react';

interface WealthMindIconProps {
  style?: React.CSSProperties;
  className?: string;
}

export function WealthMindIcon({ style = {}, className = '' }: WealthMindIconProps) {
  return (
    <svg 
      viewBox="0 0 130 130" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ ...style, overflow: 'visible' }}
      className={className}
    >
      <defs>
        <filter id="f-wm">
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
            @keyframes twinkle{0%,100%{opacity:.15;transform:scale(.6)}50%{opacity:1;transform:scale(1.3)}}
            @keyframes flicker{0%,18%,22%,25%,53%,57%,100%{opacity:1}19%,24%,54%{opacity:.4}20%{opacity:.2}}
            @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
            @keyframes ripple{0%{r:6;opacity:.7}100%{r:44;opacity:0}}
          `}
        </style>
      </defs>
      
      <path d="M16 98 Q36 66 58 44 Q76 26 112 18 L112 98 Z" fill="rgba(27,48,91,.07)"/>
      
      <path d="M16 98 Q36 66 58 44 Q76 26 112 18" fill="none" stroke="#1B305B" strokeWidth="2.2" filter="url(#f-wm)" style={{ animation: 'flicker 4s infinite' }}/>
      
      <circle cx="36"  cy="66" r="5" fill="#07070A" stroke="#1B305B" strokeWidth="1.6" filter="url(#f-wm)" style={{ animation: 'twinkle 2s ease-in-out 0s infinite' }}/>
      <circle cx="58"  cy="44" r="5" fill="#07070A" stroke="#1B305B" strokeWidth="1.6" filter="url(#f-wm)" style={{ animation: 'twinkle 2s ease-in-out .4s infinite' }}/>
      <circle cx="80"  cy="30" r="5" fill="#07070A" stroke="#5B94D2" strokeWidth="1.8" filter="url(#f-wm)" style={{ animation: 'twinkle 2s ease-in-out .8s infinite' }}/>
      <circle cx="112" cy="18" r="6" fill="#07070A" stroke="#5B94D2" strokeWidth="2.2" filter="url(#f-wm)" style={{ animation: 'ripple 2s ease-out infinite' }}/>
      
      <circle cx="112" cy="18" r="13" fill="rgba(27,48,91,.18)" stroke="#5B94D2" strokeWidth="1.2" filter="url(#f-wm)"/>
      <text x="107" y="22" fontFamily="Cormorant Garamond,serif" fontSize="13" fill="#5B94D2" fontWeight="300" filter="url(#f-wm)">$</text>
      <circle cx="112" cy="18" r="17" fill="none" stroke="#1B305B" strokeWidth=".8" strokeDasharray="2 3" style={{ animation: 'spin 7s linear infinite' }}/>
      
      <line x1="16" y1="98"  x2="114" y2="98"  stroke="#1B305B" strokeWidth=".9" opacity=".3"/>
      <line x1="16" y1="18"  x2="16"  y2="100" stroke="#1B305B" strokeWidth=".9" opacity=".3"/>
    </svg>
  );
}
