'use client';
import React from 'react';

interface ShieldKitIconProps {
  style?: React.CSSProperties;
  className?: string;
}

export function ShieldKitIcon({ style = {}, className = '' }: ShieldKitIconProps) {
  return (
    <svg 
      viewBox="0 0 130 130" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ ...style, overflow: 'visible' }}
      className={className}
    >
      <defs>
        <filter id="f-sh">
          <feGaussianBlur stdDeviation="2.5" result="b1"/>
          <feGaussianBlur stdDeviation="7" result="b2"/>
          <feMerge>
            <feMergeNode in="b2"/>
            <feMergeNode in="b1"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <clipPath id="sh-clip">
          <path d="M65 10 L104 26 L104 68 Q104 96 65 112 Q26 96 26 68 L26 26 Z"/>
        </clipPath>
        <style>
          {`
            @keyframes flicker{0%,18%,22%,25%,53%,57%,100%{opacity:1}19%,24%,54%{opacity:.4}20%{opacity:.2}}
            @keyframes scan{0%{transform:translateY(-200%)}100%{transform:translateY(600%)}}
          `}
        </style>
      </defs>
      
      <path d="M65 10 L104 26 L104 68 Q104 96 65 112 Q26 96 26 68 L26 26 Z" fill="rgba(27,48,91,.1)" stroke="#1B305B" strokeWidth="7" filter="url(#f-sh)" opacity=".3"/>
      
      <path d="M65 10 L104 26 L104 68 Q104 96 65 112 Q26 96 26 68 L26 26 Z" fill="#07070A" stroke="#1B305B" strokeWidth="1.8" filter="url(#f-sh)" style={{ animation: 'flicker 5s infinite' }}/>
      
      <path d="M65 20 L96 33 L96 66 Q96 88 65 102 Q34 88 34 66 L34 33 Z" fill="none" stroke="#1B305B" strokeWidth=".8" opacity=".35"/>
      
      <path d="M50 55 L58 51 L66 55 L66 63 L58 67 L50 63 Z" fill="none" stroke="#1B305B" strokeWidth=".8" opacity=".3"/>
      <path d="M66 55 L74 51 L82 55 L82 63 L74 67 L66 63 Z" fill="none" stroke="#1B305B" strokeWidth=".8" opacity=".2"/>
      
      <polyline points="46 65 57 76 82 52" fill="none" stroke="#5B94D2" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#f-sh)" style={{ animation: 'flicker 4s infinite' }}/>
      
      <rect x="26" y="0" width="78" height="5" rx="2" fill="rgba(91,148,210,.28)" clipPath="url(#sh-clip)" style={{ animation: 'scan 2.8s ease-in-out infinite' }}/>
      
      <line x1="26" y1="26" x2="35" y2="26" stroke="#5B94D2" strokeWidth="1.8" filter="url(#f-sh)"/>
      <line x1="26" y1="26" x2="26" y2="36" stroke="#5B94D2" strokeWidth="1.8" filter="url(#f-sh)"/>
      <line x1="104" y1="26" x2="95" y2="26" stroke="#5B94D2" strokeWidth="1.8" filter="url(#f-sh)"/>
      <line x1="104" y1="26" x2="104" y2="36" stroke="#5B94D2" strokeWidth="1.8" filter="url(#f-sh)"/>
    </svg>
  );
}
