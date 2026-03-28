'use client';
import React from 'react';

interface FlowMapperIconProps {
  style?: React.CSSProperties;
  className?: string;
}

export function FlowMapperIcon({ style = {}, className = '' }: FlowMapperIconProps) {
  return (
    <svg 
      viewBox="0 0 130 130" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ ...style, overflow: 'visible' }}
      className={className}
    >
      <defs>
        <filter id="f-fm">
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
            @keyframes data-move{0%{stroke-dashoffset:60}100%{stroke-dashoffset:0}}
            @keyframes twinkle{0%,100%{opacity:.15;transform:scale(.6)}50%{opacity:1;transform:scale(1.3)}}
            @keyframes ripple{0%{r:6;opacity:.7}100%{r:44;opacity:0}}
          `}
        </style>
      </defs>
      
      <line x1="65" y1="22" x2="28" y2="60" stroke="#1B305B" strokeWidth="1.3" strokeDasharray="4 2" filter="url(#f-fm)" style={{ animation: 'data-move 2.2s linear 0s infinite' }}/>
      <line x1="65" y1="22" x2="102" y2="60" stroke="#1B305B" strokeWidth="1.3" strokeDasharray="4 2" filter="url(#f-fm)" style={{ animation: 'data-move 2.4s linear .3s infinite' }}/>
      <line x1="28"  y1="60" x2="14"  y2="100" stroke="#1B305B" strokeWidth="1.1" strokeDasharray="3 2" opacity=".65" style={{ animation: 'data-move 2s linear .5s infinite' }}/>
      <line x1="28"  y1="60" x2="44"  y2="100" stroke="#1B305B" strokeWidth="1.1" strokeDasharray="3 2" opacity=".65" style={{ animation: 'data-move 2.2s linear .2s infinite' }}/>
      <line x1="102" y1="60" x2="86"  y2="100" stroke="#1B305B" strokeWidth="1.1" strokeDasharray="3 2" opacity=".65" style={{ animation: 'data-move 2.1s linear .4s infinite' }}/>
      <line x1="102" y1="60" x2="116" y2="100" stroke="#1B305B" strokeWidth="1.1" strokeDasharray="3 2" opacity=".65" style={{ animation: 'data-move 2s linear .6s infinite' }}/>
      
      <circle cx="65"  cy="22"  r="12" fill="#07070A" stroke="#5B94D2" strokeWidth="2.2" filter="url(#f-fm)" style={{ animation: 'ripple 2.5s ease-out infinite' }}/>
      <circle cx="28"  cy="60"  r="9"  fill="#07070A" stroke="#1B305B" strokeWidth="1.7" filter="url(#f-fm)"/>
      <circle cx="102" cy="60"  r="9"  fill="#07070A" stroke="#1B305B" strokeWidth="1.7" filter="url(#f-fm)"/>
      <circle cx="14"  cy="100" r="7"  fill="#07070A" stroke="#1B305B" strokeWidth="1.4" filter="url(#f-fm)" style={{ animation: 'twinkle 2s ease-in-out 0s infinite' }}/>
      <circle cx="44"  cy="100" r="7"  fill="#07070A" stroke="#1B305B" strokeWidth="1.4" filter="url(#f-fm)" style={{ animation: 'twinkle 2s ease-in-out .5s infinite' }}/>
      <circle cx="86"  cy="100" r="7"  fill="#07070A" stroke="#1B305B" strokeWidth="1.4" filter="url(#f-fm)" style={{ animation: 'twinkle 2s ease-in-out .3s infinite' }}/>
      <circle cx="116" cy="100" r="7"  fill="#07070A" stroke="#5B94D2" strokeWidth="1.6" filter="url(#f-fm)" style={{ animation: 'twinkle 2s ease-in-out .8s infinite' }}/>
      
      <circle cx="65"  cy="22"  r="5"  fill="#5B94D2" opacity=".6"/>
      <circle cx="28"  cy="60"  r="4"  fill="#1B305B" opacity=".8"/>
      <circle cx="102" cy="60"  r="4"  fill="#1B305B" opacity=".8"/>
    </svg>
  );
}
