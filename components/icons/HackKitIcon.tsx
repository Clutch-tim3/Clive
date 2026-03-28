'use client';
import React from 'react';

interface HackKitIconProps {
  style?: React.CSSProperties;
  className?: string;
}

export function HackKitIcon({ style = {}, className = '' }: HackKitIconProps) {
  return (
    <svg 
      viewBox="0 0 130 130" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ ...style, overflow: 'visible' }}
      className={className}
    >
      <defs>
        <filter id="f-hk">
          <feGaussianBlur stdDeviation="2" result="b1"/>
          <feGaussianBlur stdDeviation="6" result="b2"/>
          <feMerge>
            <feMergeNode in="b2"/>
            <feMergeNode in="b1"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="f-hk-s">
          <feGaussianBlur stdDeviation="3.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id="term-clip">
          <rect x="13" y="38" width="104" height="82" rx="0"/>
        </clipPath>
        <style>
          {`
            @keyframes glitch{
              0%,89%,100%{transform:translate(0,0)}
              90%{transform:translate(-4px,1px)}
              92%{transform:translate(5px,-2px)}
              94%{transform:translate(-2px,3px)}
              96%{transform:translate(3px,-1px)}
              98%{transform:translate(0,0)}
            }
            @keyframes flicker{0%,18%,22%,25%,53%,57%,100%{opacity:1}19%,24%,54%{opacity:.4}20%{opacity:.2}}
            @keyframes drop{0%{transform:translateY(-90px);opacity:0}15%{opacity:1}85%{opacity:.7}100%{transform:translateY(90px);opacity:0}}
            @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
            @keyframes scan{0%{transform:translateY(-200%)}100%{transform:translateY(600%)}}
            @keyframes glitch-r{0%,89%,100%{transform:translate(0,0);opacity:0}90%,98%{opacity:.55}91%{transform:translate(-5px,0)}93%{transform:translate(4px,1px)}95%{transform:translate(-3px,-1px)}97%{transform:translate(2px,0)}}
            @keyframes glitch-b{0%,89%,100%{transform:translate(0,0);opacity:0}90%,98%{opacity:.45}91%{transform:translate(5px,0)}93%{transform:translate(-4px,-1px)}95%{transform:translate(3px,1px)}97%{transform:translate(-2px,0)}}
          `}
        </style>
      </defs>
      
      <rect x="13" y="13" width="104" height="104" rx="9" fill="rgba(27,48,91,.07)" stroke="#1B305B" strokeWidth="1.6" filter="url(#f-hk-s)" style={{ animation: 'flicker 6s infinite' }}/>
      
      <rect x="13" y="13" width="104" height="25" rx="9" fill="rgba(27,48,91,.12)"/>
      <rect x="13" y="29" width="104" height="9" fill="rgba(27,48,91,.07)"/>
      <circle cx="27" cy="25.5" r="4.5" fill="rgba(27,48,91,.3)" stroke="#1B305B" strokeWidth=".9"/>
      <circle cx="40" cy="25.5" r="4.5" fill="rgba(27,48,91,.2)" stroke="#1B305B" strokeWidth=".9"/>
      <circle cx="53" cy="25.5" r="4.5" fill="rgba(27,48,91,.15)" stroke="#1B305B" strokeWidth=".9"/>
      
      <g filter="url(#f-hk)" opacity=".18" transform="translate(70,44) scale(.55)">
        <ellipse cx="30" cy="22" rx="22" ry="20" fill="none" stroke="#1B305B" strokeWidth="3"/>
        <rect x="12" y="38" width="36" height="16" rx="4" fill="none" stroke="#1B305B" strokeWidth="3"/>
        <line x1="22" y1="38" x2="22" y2="54" stroke="#1B305B" strokeWidth="2.5"/>
        <line x1="31" y1="38" x2="31" y2="54" stroke="#1B305B" strokeWidth="2.5"/>
        <line x1="40" y1="38" x2="40" y2="54" stroke="#1B305B" strokeWidth="2.5"/>
        <ellipse cx="22" cy="24" rx="7" ry="8" fill="none" stroke="#1B305B" strokeWidth="2.5"/>
        <ellipse cx="40" cy="24" rx="7" ry="8" fill="none" stroke="#1B305B" strokeWidth="2.5"/>
      </g>
      
      <g clipPath="url(#term-clip)" filter="url(#f-hk)" style={{ animation: 'glitch 5s ease-in-out infinite' }}>
        <text x="22" y="56" fontFamily="DM Mono,monospace" fontSize="8" fill="#FFFFFF" style={{ animation: 'drop 2.1s ease-in 0s infinite' }}>1</text>
        <text x="22" y="68" fontFamily="DM Mono,monospace" fontSize="8" fill="#FFFFFF" opacity=".7" style={{ animation: 'drop 2.1s ease-in .4s infinite' }}>0</text>
        <text x="22" y="80" fontFamily="DM Mono,monospace" fontSize="8" fill="#FFFFFF" opacity=".45" style={{ animation: 'drop 2.1s ease-in .8s infinite' }}>1</text>
        <text x="36" y="51" fontFamily="DM Mono,monospace" fontSize="8" fill="#5B94D2" style={{ animation: 'drop 1.8s ease-in .3s infinite' }}>0</text>
        <text x="36" y="63" fontFamily="DM Mono,monospace" fontSize="8" fill="#FFFFFF" opacity=".8" style={{ animation: 'drop 1.8s ease-in .7s infinite' }}>1</text>
        <text x="36" y="75" fontFamily="DM Mono,monospace" fontSize="8" fill="#FFFFFF" opacity=".5" style={{ animation: 'drop 1.8s ease-in 1.1s infinite' }}>0</text>
        <text x="50" y="58" fontFamily="DM Mono,monospace" fontSize="8" fill="#FFFFFF" style={{ animation: 'drop 2.4s ease-in .2s infinite' }}>1</text>
        <text x="50" y="70" fontFamily="DM Mono,monospace" fontSize="8" fill="#5B94D2" opacity=".9" style={{ animation: 'drop 2.4s ease-in .6s infinite' }}>1</text>
        <text x="50" y="82" fontFamily="DM Mono,monospace" fontSize="8" fill="#FFFFFF" opacity=".5" style={{ animation: 'drop 2.4s ease-in 1s infinite' }}>0</text>
        <text x="64" y="46" fontFamily="DM Mono,monospace" fontSize="8" fill="#5B94D2" style={{ animation: 'drop 2s ease-in .5s infinite' }}>0</text>
        <text x="64" y="58" fontFamily="DM Mono,monospace" fontSize="8" fill="#FFFFFF" opacity=".75" style={{ animation: 'drop 2s ease-in .9s infinite' }}>1</text>
        <text x="64" y="70" fontFamily="DM Mono,monospace" fontSize="8" fill="#FFFFFF" opacity=".45" style={{ animation: 'drop 2s ease-in 1.3s infinite' }}>0</text>
        <text x="78" y="54" fontFamily="DM Mono,monospace" fontSize="8" fill="#FFFFFF" style={{ animation: 'drop 2.3s ease-in .1s infinite' }}>1</text>
        <text x="78" y="66" fontFamily="DM Mono,monospace" fontSize="8" fill="#FFFFFF" opacity=".7" style={{ animation: 'drop 2.3s ease-in .5s infinite' }}>0</text>
        <text x="78" y="78" fontFamily="DM Mono,monospace" fontSize="8" fill="#5B94D2" opacity=".55" style={{ animation: 'drop 2.3s ease-in .9s infinite' }}>1</text>
        <text x="92" y="50" fontFamily="DM Mono,monospace" fontSize="8" fill="#FFFFFF" style={{ animation: 'drop 2.8s ease-in .6s infinite' }}>0</text>
        <text x="92" y="62" fontFamily="DM Mono,monospace" fontSize="8" fill="#FFFFFF" opacity=".6" style={{ animation: 'drop 2.8s ease-in 1s infinite' }}>0</text>
        <text x="92" y="74" fontFamily="DM Mono,monospace" fontSize="8" fill="#FFFFFF" opacity=".4" style={{ animation: 'drop 2.8s ease-in 1.4s infinite' }}>1</text>
        <text x="106" y="55" fontFamily="DM Mono,monospace" fontSize="8" fill="#FFFFFF" style={{ animation: 'drop 2s ease-in .4s infinite' }}>1</text>
        <text x="106" y="67" fontFamily="DM Mono,monospace" fontSize="8" fill="#5B94D2" opacity=".8" style={{ animation: 'drop 2s ease-in .8s infinite' }}>0</text>
      </g>
      
      <text x="22" y="100" fontFamily="DM Mono,monospace" fontSize="8" fill="#FFFFFF" filter="url(#f-hk)" opacity=".8">&gt; _</text>
      <rect x="34" y="92" width="8" height="9" rx="1" fill="#FFFFFF" filter="url(#f-hk)" style={{ animation: 'blink 1s step-end infinite' }}/>
      
      <rect x="13" y="68" width="104" height="1.5" fill="rgba(27,48,91,.22)" style={{ animation: 'glitch-r 5s ease-in-out .3s infinite;opacity:0' }}/>
      <rect x="13" y="82" width="104" height="1.2" fill="rgba(91,148,210,.2)" style={{ animation: 'glitch-b 5s ease-in-out .7s infinite;opacity:0' }}/>
      
      <rect x="13" y="0" width="104" height="3" rx="1" fill="rgba(27,48,91,.25)" clipPath="url(#term-clip)" style={{ animation: 'scan 3.5s ease-in-out infinite' }}/>
    </svg>
  );
}
