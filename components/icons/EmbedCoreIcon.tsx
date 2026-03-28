'use client';
import React from 'react';

interface EmbedCoreIconProps {
  style?: React.CSSProperties;
  className?: string;
}

export function EmbedCoreIcon({ style = {}, className = '' }: EmbedCoreIconProps) {
  return (
    <svg 
      viewBox="0 0 130 130" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ ...style, overflow: 'visible' }}
      className={className}
    >
      <defs>
        <filter id="f-em">
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
            @keyframes dash{from{stroke-dashoffset:0}to{stroke-dashoffset:-500}}
            @keyframes dash-rev{from{stroke-dashoffset:0}to{stroke-dashoffset:500}}
            @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
            @keyframes spin-rev{from{transform:rotate(360deg)}to{transform:rotate(0deg)}}
            @keyframes ripple{0%{r:6;opacity:.7}100%{r:44;opacity:0}}
            @keyframes flicker{0%,18%,22%,25%,53%,57%,100%{opacity:1}19%,24%,54%{opacity:.4}20%{opacity:.2}}
          `}
        </style>
      </defs>
      
      <ellipse cx="65" cy="65" rx="46" ry="14" fill="none" stroke="#1B305B" strokeWidth=".9" strokeDasharray="4 3" style={{ animation: 'dash 5s linear infinite' }}/>
      <ellipse cx="65" cy="65" rx="14" ry="46" fill="none" stroke="#1B305B" strokeWidth=".7" strokeDasharray="3 4" opacity=".5" style={{ animation: 'dash-rev 7s linear infinite' }}/>
      <ellipse cx="65" cy="65" rx="37" ry="37" fill="none" stroke="#1B305B" strokeWidth=".6" strokeDasharray="2 5" opacity=".3" transform="rotate(45 65 65)" style={{ animation: 'dash 9s linear infinite' }}/>
      
      <circle cx="65" cy="65" r="20" fill="#07070A" stroke="#1B305B" strokeWidth="1.6" filter="url(#f-em)" style={{ animation: 'flicker 6s infinite' }}/>
      <circle cx="65" cy="65" r="20" fill="none" stroke="#5B94D2" strokeWidth=".5" opacity=".25"/>
      <circle cx="65" cy="65" r="13" fill="rgba(27,48,91,.15)"/>
      <ellipse cx="59" cy="58" rx="6" ry="3" fill="rgba(91,148,210,.08)" transform="rotate(-25 59 58)"/>
      
      <line x1="65" y1="65" x2="65" y2="43" stroke="#1B305B" strokeWidth=".7" strokeDasharray="2 2" opacity=".4"/>
      <line x1="65" y1="65" x2="84" y2="74" stroke="#1B305B" strokeWidth=".7" strokeDasharray="2 2" opacity=".4"/>
      <line x1="65" y1="65" x2="46" y2="74" stroke="#1B305B" strokeWidth=".7" strokeDasharray="2 2" opacity=".4"/>
      
      <g style={{ animation: 'spin 5s linear infinite;transform-origin:65px 65px' }}>
        <circle cx="111" cy="65" r="5.5" fill="#07070A" stroke="#5B94D2" strokeWidth="1.5" filter="url(#f-em)"/>
        <circle cx="19"  cy="65" r="4.5" fill="#07070A" stroke="#1B305B" strokeWidth="1.2" filter="url(#f-em)"/>
      </g>
      <g style={{ animation: 'spin-rev 7s linear infinite;transform-origin:65px 65px' }}>
        <circle cx="65" cy="19"  r="4.5" fill="#07070A" stroke="#1B305B" strokeWidth="1.2" filter="url(#f-em)"/>
        <circle cx="65" cy="111" r="5.5" fill="#07070A" stroke="#5B94D2" strokeWidth="1.5" filter="url(#f-em)"/>
      </g>
      
      <circle cx="65" cy="65" r="5" fill="none" stroke="#5B94D2" strokeWidth="1.2" style={{ animation: 'ripple 2.2s ease-out infinite' }}/>
      <circle cx="65" cy="65" r="5" fill="none" stroke="#1B305B" strokeWidth=".8" style={{ animation: 'ripple 2.2s ease-out .6s infinite' }}/>
    </svg>
  );
}
