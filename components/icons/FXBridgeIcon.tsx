'use client';
import React from 'react';

interface FXBridgeIconProps {
  style?: React.CSSProperties;
  className?: string;
}

export function FXBridgeIcon({ style = {}, className = '' }: FXBridgeIconProps) {
  return (
    <svg 
      viewBox="0 0 130 130" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ ...style, overflow: 'visible' }}
      className={className}
    >
      <defs>
        <filter id="f-fx">
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
            @keyframes spin-rev{from{transform:rotate(360deg)}to{transform:rotate(0deg)}}
            @keyframes data-move{0%{stroke-dashoffset:60}100%{stroke-dashoffset:0}}
            @keyframes ripple{0%{r:6;opacity:.7}100%{r:44;opacity:0}}
          `}
        </style>
      </defs>
      
      <circle cx="32" cy="65" r="26" fill="rgba(27,48,91,.1)" stroke="#1B305B" strokeWidth="1.6" filter="url(#f-fx)"/>
      <circle cx="32" cy="65" r="19" fill="rgba(27,48,91,.08)" stroke="#1B305B" strokeWidth=".7" opacity=".45"/>
      <circle cx="32" cy="65" r="26" fill="none" stroke="#1B305B" strokeWidth=".7" strokeDasharray="3 4" style={{ animation: 'spin 10s linear infinite' }} opacity=".4"/>
      <text x="24" y="70" fontFamily="Cormorant Garamond,serif" fontSize="20" fill="#1B305B" fontWeight="300" filter="url(#f-fx)">$</text>
      
      <circle cx="98" cy="65" r="26" fill="rgba(91,148,210,.08)" stroke="#5B94D2" strokeWidth="1.6" filter="url(#f-fx)"/>
      <circle cx="98" cy="65" r="19" fill="rgba(91,148,210,.06)" stroke="#5B94D2" strokeWidth=".7" opacity=".45"/>
      <circle cx="98" cy="65" r="26" fill="none" stroke="#1B305B" strokeWidth=".7" strokeDasharray="3 4" style={{ animation: 'spin-rev 10s linear infinite' }} opacity=".4"/>
      <text x="90" y="70" fontFamily="Cormorant Garamond,serif" fontSize="18" fill="#5B94D2" fontWeight="300" filter="url(#f-fx)">€</text>
      
      <path d="M60 57 L70 57" stroke="#1B305B" strokeWidth="2" strokeLinecap="round" filter="url(#f-fx)" style={{ animation: 'data-move 1.4s linear infinite' }}/>
      <polygon points="70,53 80,57 70,61" fill="#1B305B" filter="url(#f-fx)"/>
      
      <path d="M70 73 L60 73" stroke="#5B94D2" strokeWidth="2" strokeLinecap="round" filter="url(#f-fx)" style={{ animation: 'data-move 1.4s linear .5s infinite' }}/>
      <polygon points="60,69 50,73 60,77" fill="#5B94D2" filter="url(#f-fx)"/>
      
      <circle cx="65" cy="65" r="9" fill="none" stroke="#1B305B" strokeWidth=".6" opacity=".3" style={{ animation: 'ripple 2s ease-out infinite' }}/>
    </svg>
  );
}
