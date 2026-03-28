'use client';
import React from 'react';

interface MeetingIQIconProps {
  style?: React.CSSProperties;
  className?: string;
}

export function MeetingIQIcon({ style = {}, className = '' }: MeetingIQIconProps) {
  return (
    <svg 
      viewBox="0 0 130 130" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ ...style, overflow: 'visible' }}
      className={className}
    >
      <defs>
        <filter id="f-mq">
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
            @keyframes bar{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}
            @keyframes ripple{0%{r:6;opacity:.7}100%{r:44;opacity:0}}
            @keyframes flicker{0%,18%,22%,25%,53%,57%,100%{opacity:1}19%,24%,54%{opacity:.4}20%{opacity:.2}}
          `}
        </style>
      </defs>
      
      <rect x="53" y="14" width="24" height="42" rx="12" fill="rgba(27,48,91,.15)" stroke="#1B305B" strokeWidth="1.6" filter="url(#f-mq)"/>
      
      <line x1="53" y1="28" x2="77" y2="28" stroke="#1B305B" strokeWidth=".6" opacity=".3"/>
      <line x1="53" y1="35" x2="77" y2="35" stroke="#1B305B" strokeWidth=".6" opacity=".3"/>
      <line x1="53" y1="42" x2="77" y2="42" stroke="#1B305B" strokeWidth=".6" opacity=".25"/>
      
      <path d="M38 56 Q38 80 65 80 Q92 80 92 56" fill="none" stroke="#1B305B" strokeWidth="1.8" strokeLinecap="round" filter="url(#f-mq)" style={{ animation: 'flicker 4s infinite' }}/>
      <line x1="65" y1="80" x2="65" y2="94" stroke="#1B305B" strokeWidth="1.8" filter="url(#f-mq)"/>
      <line x1="50" y1="94" x2="80" y2="94" stroke="#1B305B" strokeWidth="1.8" filter="url(#f-mq)"/>
      
      <rect x="22" y="50" width="5" height="16" rx="2.5" fill="#1B305B" filter="url(#f-mq)" style={{ animation: 'bar 1.4s ease-in-out 0s infinite;transform-origin:24.5px 58px' }}/>
      <rect x="31" y="44" width="5" height="28" rx="2.5" fill="#1B305B" filter="url(#f-mq)" style={{ animation: 'bar 1.2s ease-in-out .18s infinite;transform-origin:33.5px 58px' }}/>
      <rect x="95" y="50" width="5" height="16" rx="2.5" fill="#1B305B" filter="url(#f-mq)" style={{ animation: 'bar 1.4s ease-in-out .3s infinite;transform-origin:97.5px 58px' }}/>
      <rect x="104" y="44" width="5" height="28" rx="2.5" fill="#1B305B" filter="url(#f-mq)" style={{ animation: 'bar 1.1s ease-in-out .1s infinite;transform-origin:106.5px 58px' }}/>
      
      <circle cx="65" cy="35" r="26" fill="none" stroke="#1B305B" strokeWidth=".6" strokeDasharray="3 5" opacity=".3" style={{ animation: 'ripple 2.2s ease-out 0s infinite' }}/>
      <circle cx="65" cy="35" r="36" fill="none" stroke="#1B305B" strokeWidth=".4" strokeDasharray="2 6" opacity=".15" style={{ animation: 'ripple 2.8s ease-out .6s infinite' }}/>
      
      <circle cx="40" cy="108" r="7" fill="rgba(27,48,91,.3)" stroke="#5B94D2" strokeWidth="1.2" filter="url(#f-mq)"/>
      <polyline points="37,108 39.5,110.5 45,105" fill="none" stroke="#5B94D2" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="52" y1="108" x2="90" y2="108" stroke="#1B305B" strokeWidth="1" opacity=".4"/>
    </svg>
  );
}
