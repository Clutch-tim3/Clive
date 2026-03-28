'use client';
import React from 'react';

interface VoicePostIconProps {
  style?: React.CSSProperties;
  className?: string;
}

export function VoicePostIcon({ style = {}, className = '' }: VoicePostIconProps) {
  return (
    <svg 
      viewBox="0 0 130 130" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ ...style, overflow: 'visible' }}
      className={className}
    >
      <defs>
        <filter id="f-vp">
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
            @keyframes bar{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}
            @keyframes flicker{0%,18%,22%,25%,53%,57%,100%{opacity:1}19%,24%,54%{opacity:.4}20%{opacity:.2}}
            @keyframes ripple{0%{r:6;opacity:.7}100%{r:44;opacity:0}}
          `}
        </style>
      </defs>
      
      <rect x="12" y="12" width="58" height="56" rx="8" fill="rgba(27,48,91,.1)" stroke="#1B305B" strokeWidth="1.3" filter="url(#f-vp)"/>
      <line x1="20" y1="28" x2="62" y2="28" stroke="#1B305B" strokeWidth="1.1" opacity=".4"/>
      <line x1="20" y1="36" x2="62" y2="36" stroke="#1B305B" strokeWidth=".9" opacity=".3"/>
      <line x1="20" y1="44" x2="52" y2="44" stroke="#1B305B" strokeWidth=".9" opacity=".28"/>
      
      <rect x="20" y="52" width="4" height="10" rx="2" fill="#5B94D2" filter="url(#f-vp)" style={{ animation: 'bar 1.3s ease-in-out 0s infinite;transform-origin:22px 57px' }}/>
      <rect x="27" y="48" width="4" height="18" rx="2" fill="#1B305B" filter="url(#f-vp)" style={{ animation: 'bar 1.1s ease-in-out .1s infinite;transform-origin:29px 57px' }}/>
      <rect x="34" y="44" width="4" height="26" rx="2" fill="#5B94D2" filter="url(#f-vp)" style={{ animation: 'bar 1.4s ease-in-out .2s infinite;transform-origin:36px 57px' }}/>
      <rect x="41" y="48" width="4" height="18" rx="2" fill="#1B305B" filter="url(#f-vp)" style={{ animation: 'bar 1.2s ease-in-out .15s infinite;transform-origin:43px 57px' }}/>
      <rect x="48" y="52" width="4" height="10" rx="2" fill="#5B94D2" filter="url(#f-vp)" style={{ animation: 'bar 1.3s ease-in-out .05s infinite;transform-origin:50px 57px' }}/>
      <rect x="55" y="49" width="4" height="16" rx="2" fill="#1B305B" filter="url(#f-vp)" style={{ animation: 'bar 1.2s ease-in-out .25s infinite;transform-origin:57px 57px' }}/>
      
      <rect x="83" y="18" width="20" height="36" rx="10" fill="rgba(27,48,91,.15)" stroke="#1B305B" strokeWidth="1.5" filter="url(#f-vp)"/>
      <path d="M74 54 Q74 72 93 72 Q112 72 112 54" fill="none" stroke="#1B305B" strokeWidth="1.8" strokeLinecap="round" filter="url(#f-vp)" style={{ animation: 'flicker 5s infinite' }}/>
      <line x1="93" y1="72" x2="93" y2="84" stroke="#1B305B" strokeWidth="1.8" filter="url(#f-vp)"/>
      <line x1="80" y1="84" x2="106" y2="84" stroke="#1B305B" strokeWidth="1.8" filter="url(#f-vp)"/>
      
      <circle cx="93" cy="36" r="30" fill="none" stroke="#1B305B" strokeWidth=".6" strokeDasharray="2 5" opacity=".28" style={{ animation: 'ripple 2.2s ease-out 0s infinite' }}/>
      <circle cx="93" cy="36" r="40" fill="none" stroke="#1B305B" strokeWidth=".4" strokeDasharray="2 6" opacity=".14" style={{ animation: 'ripple 2.8s ease-out .6s infinite' }}/>
      
      <rect x="12" y="80" width="32" height="32" rx="6" fill="rgba(27,48,91,.25)" stroke="#1B305B" strokeWidth="1" opacity=".5"/>
      <text x="19" y="102" fontFamily="DM Mono,monospace" fontSize="16" fill="#1B305B" filter="url(#f-vp)" opacity=".7" style={{ animation: 'flicker 7s infinite' }}>in</text>
    </svg>
  );
}
