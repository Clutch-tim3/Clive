'use client';
import React from 'react';

interface TenderIQIconProps {
  style?: React.CSSProperties;
  className?: string;
}

export function TenderIQIcon({ style = {}, className = '' }: TenderIQIconProps) {
  return (
    <svg 
      viewBox="0 0 130 130" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ ...style, overflow: 'visible' }}
      className={className}
    >
      <defs>
        <filter id="f-td">
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
            @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
            @keyframes flicker{0%,18%,22%,25%,53%,57%,100%{opacity:1}19%,24%,54%{opacity:.4}20%{opacity:.2}}
            @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
          `}
        </style>
      </defs>
      
      <rect x="36" y="22" width="60" height="75" rx="5" fill="rgba(27,48,91,.06)" stroke="#1B305B" strokeWidth="1" opacity=".4" transform="translate(5,-3) rotate(4 66 59)"/>
      
      <rect x="36" y="22" width="60" height="75" rx="5" fill="rgba(27,48,91,.08)" stroke="#1B305B" strokeWidth="1.2" filter="url(#f-td)" style={{ animation: 'float 4s ease-in-out infinite' }}/>
      
      <polyline points="76,22 96,22 96,40" fill="none" stroke="#1B305B" strokeWidth="1.2"/>
      <polygon points="76,22 96,40 76,40" fill="rgba(27,48,91,.15)"/>
      
      <line x1="44" y1="50" x2="88" y2="50" stroke="#1B305B" strokeWidth="1.2" opacity=".5"/>
      <line x1="44" y1="58" x2="88" y2="58" stroke="#1B305B" strokeWidth="1" opacity=".35"/>
      <line x1="44" y1="66" x2="75" y2="66" stroke="#1B305B" strokeWidth="1" opacity=".35"/>
      <line x1="44" y1="74" x2="82" y2="74" stroke="#1B305B" strokeWidth="1" opacity=".3"/>
      
      <circle cx="82" cy="81" r="18" fill="#07070A" stroke="#1B305B" strokeWidth="1.5" filter="url(#f-td)" style={{ animation: 'flicker 5s infinite' }}/>
      <circle cx="82" cy="81" r="13" fill="none" stroke="#1B305B" strokeWidth=".7" opacity=".4"/>
      <circle cx="82" cy="81" r="20" fill="none" stroke="#1B305B" strokeWidth=".8" strokeDasharray="3 4" style={{ animation: 'spin 9s linear infinite' }}/>
      
      <polyline points="75,81 80,86 91,73" fill="none" stroke="#5B94D2" strokeWidth="2.5" strokeLinecap="round" filter="url(#f-td)"/>
    </svg>
  );
}
