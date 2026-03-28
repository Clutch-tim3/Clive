'use client';
import React from 'react';

interface DevKitIconProps {
  style?: React.CSSProperties;
  className?: string;
}

export function DevKitIcon({ style = {}, className = '' }: DevKitIconProps) {
  return (
    <svg 
      viewBox="0 0 130 130" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ ...style, overflow: 'visible' }}
      className={className}
    >
      <defs>
        <filter id="f-dk">
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
            @keyframes scan{0%{transform:translateY(-200%)}100%{transform:translateY(600%)}}
            @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
          `}
        </style>
      </defs>
      
      <rect x="13" y="16" width="104" height="98" rx="9" fill="rgba(27,48,91,.06)" stroke="#1B305B" strokeWidth="1.5" filter="url(#f-dk)"/>
      <rect x="13" y="16" width="104" height="26" rx="9" fill="rgba(27,48,91,.1)"/>
      <circle cx="28" cy="29" r="5" fill="rgba(27,48,91,.35)" stroke="#1B305B" strokeWidth=".9"/>
      <circle cx="42" cy="29" r="5" fill="rgba(27,48,91,.22)" stroke="#1B305B" strokeWidth=".9"/>
      <circle cx="56" cy="29" r="5" fill="rgba(27,48,91,.16)" stroke="#1B305B" strokeWidth=".9"/>
      
      <text x="19" y="68" fontFamily="DM Mono,monospace" fontSize="24" fill="#1B305B" fontWeight="400" filter="url(#f-dk)" style={{ animation: 'flicker 5s infinite' }}>JS</text>
      
      <text x="19" y="84" fontFamily="DM Mono,monospace" fontSize="8" fill="#5B94D2" filter="url(#f-dk)" opacity=".8">Functions</text>
      <text x="19" y="96" fontFamily="DM Mono,monospace" fontSize="8" fill="#1B305B" opacity=".5">Encrypt</text>
      <text x="19" y="107" fontFamily="DM Mono,monospace" fontSize="8" fill="#1B305B" opacity=".35">Encode</text>
      
      <rect x="19" y="111" width="8" height="9" rx="1.5" fill="#1B305B" filter="url(#f-dk)" style={{ animation: 'blink 1s step-end infinite' }}/>
      
      <rect x="13" y="0" width="104" height="3.5" rx="1.5" fill="rgba(91,148,210,.2)" style={{ animation: 'scan 4s ease-in-out infinite' }}/>
    </svg>
  );
}
