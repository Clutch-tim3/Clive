'use client';
import React from 'react';

interface SearchCoreIconProps {
  style?: React.CSSProperties;
  className?: string;
}

export function SearchCoreIcon({ style = {}, className = '' }: SearchCoreIconProps) {
  return (
    <svg 
      viewBox="0 0 130 130" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ ...style, overflow: 'visible' }}
      className={className}
    >
      <defs>
        <filter id="f-sc">
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
          `}
        </style>
      </defs>
      
      <circle cx="52" cy="52" r="34" fill="#07070A" stroke="#1B305B" strokeWidth="1.6" filter="url(#f-sc)"/>
      <circle cx="52" cy="52" r="34" fill="none" stroke="#1B305B" strokeWidth="6" opacity=".08" filter="url(#f-sc)"/>
      
      <ellipse cx="43" cy="44" rx="9" ry="6" fill="rgba(27,48,91,.22)" stroke="#1B305B" strokeWidth=".7" transform="rotate(-18 43 44)" opacity=".65"/>
      <ellipse cx="62" cy="56" rx="7" ry="4.5" fill="rgba(27,48,91,.16)" stroke="#1B305B" strokeWidth=".55" transform="rotate(12 62 56)" opacity=".55"/>
      <ellipse cx="45" cy="64" rx="6" ry="3.5" fill="rgba(27,48,91,.12)" stroke="#1B305B" strokeWidth=".45" opacity=".45"/>
      <ellipse cx="54" cy="37" rx="5" ry="3" fill="rgba(27,48,91,.1)" stroke="#1B305B" strokeWidth=".4" opacity=".4"/>
      
      <ellipse cx="52" cy="52" rx="34" ry="9" fill="none" stroke="#1B305B" strokeWidth=".5" opacity=".2"/>
      <ellipse cx="52" cy="43" rx="28" ry="6" fill="none" stroke="#1B305B" strokeWidth=".4" opacity=".15"/>
      <ellipse cx="52" cy="61" rx="28" ry="6" fill="none" stroke="#1B305B" strokeWidth=".4" opacity=".12"/>
      
      <circle cx="40" cy="46" r="2" fill="#5B94D2" filter="url(#f-sc)" style={{ animation: 'twinkle 1.8s ease-in-out 0s infinite' }}/>
      <circle cx="59" cy="42" r="2.5" fill="#5B94D2" filter="url(#f-sc)" style={{ animation: 'twinkle 2.2s ease-in-out .3s infinite' }}/>
      <circle cx="67" cy="55" r="1.8" fill="#3a6bb5" filter="url(#f-sc)" style={{ animation: 'twinkle 1.5s ease-in-out .6s infinite' }}/>
      <circle cx="48" cy="66" r="2.2" fill="#5B94D2" filter="url(#f-sc)" style={{ animation: 'twinkle 2s ease-in-out .9s infinite' }}/>
      <circle cx="36" cy="57" r="1.6" fill="#3a6bb5" filter="url(#f-sc)" style={{ animation: 'twinkle 2.5s ease-in-out 1.2s infinite' }}/>
      <circle cx="58" cy="63" r="2" fill="#5B94D2" filter="url(#f-sc)" style={{ animation: 'twinkle 1.7s ease-in-out .4s infinite' }}/>
      <circle cx="45" cy="36" r="1.4" fill="#5B94D2" filter="url(#f-sc)" style={{ animation: 'twinkle 2.8s ease-in-out .7s infinite' }}/>
      <circle cx="63" cy="47" r="1.6" fill="#3a6bb5" filter="url(#f-sc)" style={{ animation: 'twinkle 1.9s ease-in-out 1.5s infinite' }}/>
      <circle cx="55" cy="74" r="1.5" fill="#5B94D2" filter="url(#f-sc)" style={{ animation: 'twinkle 2.1s ease-in-out 1.8s infinite' }}/>
      <circle cx="33" cy="48" r="1.3" fill="#3a6bb5" filter="url(#f-sc)" style={{ animation: 'twinkle 2.4s ease-in-out 2s infinite' }}/>
      
      <circle cx="88" cy="88" r="16" fill="none" stroke="#1B305B" strokeWidth="2.2" filter="url(#f-sc)" style={{ animation: 'flicker 5s infinite' }}/>
      <circle cx="88" cy="88" r="10" fill="rgba(27,48,91,.1)"/>
      <line x1="99" y1="99" x2="113" y2="113" stroke="#1B305B" strokeWidth="4" strokeLinecap="round" filter="url(#f-sc)"/>
      
      <circle cx="86" cy="85" r="2" fill="#5B94D2" filter="url(#f-sc)" style={{ animation: 'twinkle 1.5s ease-in-out .2s infinite' }}/>
      <circle cx="91" cy="91" r="1.3" fill="#3a6bb5" filter="url(#f-sc)" style={{ animation: 'twinkle 2s ease-in-out 1s infinite' }}/>
    </svg>
  );
}
