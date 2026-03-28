'use client';
import React from 'react';

interface SaturnIconProps {
  style?: React.CSSProperties;
  className?: string;
}

export function SaturnIcon({ style = {}, className = '' }: SaturnIconProps) {
  return (
    <svg 
      viewBox="0 0 130 130" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ ...style, overflow: 'visible' }}
      className={className}
    >
      <defs>
        <filter id="f-sat">
          <feGaussianBlur stdDeviation="2.5" result="b1"/>
          <feGaussianBlur stdDeviation="7" result="b2"/>
          <feMerge>
            <feMergeNode in="b2"/>
            <feMergeNode in="b1"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="f-sat-soft">
          <feGaussianBlur stdDeviation="4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="ringGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(27,48,91,0)" />
          <stop offset="12%" stopColor="rgba(91,148,210,0.7)" />
          <stop offset="45%" stopColor="rgba(27,48,91,0.3)" />
          <stop offset="55%" stopColor="rgba(27,48,91,0.2)" />
          <stop offset="88%" stopColor="rgba(91,148,210,0.7)" />
          <stop offset="100%" stopColor="rgba(27,48,91,0)" />
        </linearGradient>
        <linearGradient id="ringGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(27,48,91,0)" />
          <stop offset="10%" stopColor="rgba(27,48,91,0.55)" />
          <stop offset="45%" stopColor="rgba(27,48,91,0.15)" />
          <stop offset="55%" stopColor="rgba(27,48,91,0.1)" />
          <stop offset="90%" stopColor="rgba(27,48,91,0.55)" />
          <stop offset="100%" stopColor="rgba(27,48,91,0)" />
        </linearGradient>
        <style>
          {`
            .ring-outer{stroke-dasharray:8 5;animation:ring-anim 12s linear infinite;}
            .ring-mid{stroke-dasharray:6 4;animation:ring-anim 9s linear infinite reverse;}
            .ring-inner{stroke-dasharray:4 6;animation:ring-anim 7s linear infinite;}
            @keyframes ring-anim{from{stroke-dashoffset:0}to{stroke-dashoffset:-300}}
            @keyframes glitch{
              0%,89%,100%{transform:translate(0,0)}
              90%{transform:translate(-4px,1px)}
              92%{transform:translate(5px,-2px)}
              94%{transform:translate(-2px,3px)}
              96%{transform:translate(3px,-1px)}
              98%{transform:translate(0,0)}
            }
            @keyframes glitch-r{0%,89%,100%{transform:translate(0,0);opacity:0}90%,98%{opacity:.55}91%{transform:translate(-5px,0)}93%{transform:translate(4px,1px)}95%{transform:translate(-3px,-1px)}97%{transform:translate(2px,0)}}
            @keyframes glitch-b{0%,89%,100%{transform:translate(0,0);opacity:0}90%,98%{opacity:.45}91%{transform:translate(5px,0)}93%{transform:translate(-4px,-1px)}95%{transform:translate(3px,1px)}97%{transform:translate(-2px,0)}}
            @keyframes flicker{0%,18%,22%,25%,53%,57%,100%{opacity:1}19%,24%,54%{opacity:.4}20%{opacity:.2}}
            @keyframes scan{0%{transform:translateY(-200%)}100%{transform:translateY(600%)}}
            @keyframes twinkle{0%,100%{opacity:.15;transform:scale(.6)}50%{opacity:1;transform:scale(1.3)}}
          `}
        </style>
      </defs>
      
      <g>
        <circle cx="10" cy="14" r=".8" fill="#3a6bb5" style={{ animation: 'twinkle 2.1s ease-in-out 0s infinite' }}/>
        <circle cx="118" cy="22" r=".6" fill="#5B94D2" style={{ animation: 'twinkle 3.2s ease-in-out .5s infinite' }}/>
        <circle cx="14" cy="98" r=".9" fill="#1B305B" style={{ animation: 'twinkle 2.7s ease-in-out 1s infinite' }}/>
        <circle cx="116" cy="104" r=".7" fill="#5B94D2" style={{ animation: 'twinkle 2.4s ease-in-out 1.5s infinite' }}/>
        <circle cx="108" cy="38" r=".6" fill="#1B305B" style={{ animation: 'twinkle 3.5s ease-in-out .3s infinite' }}/>
        <circle cx="22" cy="62" r=".5" fill="#5B94D2" style={{ animation: 'twinkle 2.6s ease-in-out 2s infinite' }}/>
        <circle cx="72" cy="8" r=".7" fill="#3a6bb5" style={{ animation: 'twinkle 2.9s ease-in-out .7s infinite' }}/>
      </g>
      
      <g style={{ animation: 'glitch 4s ease-in-out infinite' }}>
        <ellipse cx="65" cy="65" rx="56" ry="15" fill="none" stroke="#4a0000" strokeWidth="3" opacity="0" style={{ animation: 'glitch-r 4s ease-in-out infinite;filter:url(#f-sat-soft)' }}/>
        <ellipse cx="65" cy="65" rx="56" ry="15" fill="none" stroke="#00004a" strokeWidth="3" opacity="0" style={{ animation: 'glitch-b 4s ease-in-out 0.05s infinite;filter:url(#f-sat-soft)' }}/>
        
        <ellipse cx="65" cy="65" rx="56" ry="15" fill="none" stroke="url(#ringGrad1)" strokeWidth="2.8"
          strokeDasharray="9 2 14 1 6 3 11 2 4 4 8 1" filter="url(#f-sat)"
          style={{ animation: 'dash 3.5s linear infinite' }}
          opacity="0.9"/>
        
        <ellipse cx="65" cy="65" rx="48" ry="12.5" fill="none" stroke="url(#ringGrad2)" strokeWidth="1.8"
          strokeDasharray="5 4 10 2 3 5" opacity=".55"
          style={{ animation: 'dash-rev 5s linear infinite' }}/>
        
        <ellipse cx="65" cy="65" rx="41" ry="10" fill="none" stroke="rgba(27,48,91,0.5)" strokeWidth="1.4"
          strokeDasharray="3 6 7 2 2 5" opacity=".65"
          style={{ animation: 'dash 4s linear infinite' }}/>
        
        <line x1="18" y1="63" x2="10" y2="59" stroke="#1B305B" strokeWidth="2.5" filter="url(#f-sat)" opacity="0"
          style={{ animation: 'glitch-r 4s ease-in-out .2s infinite' }}/>
        <line x1="112" y1="67" x2="120" y2="71" stroke="#5B94D2" strokeWidth="2" filter="url(#f-sat)" opacity="0"
          style={{ animation: 'glitch-b 4s ease-in-out .35s infinite' }}/>
        <line x1="65" y1="50" x2="62" y2="43" stroke="#1B305B" strokeWidth="3" filter="url(#f-sat)" opacity="0"
          style={{ animation: 'glitch-r 4s ease-in-out .6s infinite' }}/>
        <line x1="65" y1="80" x2="67" y2="87" stroke="#5B94D2" strokeWidth="2" filter="url(#f-sat)" opacity="0"
          style={{ animation: 'glitch-b 4s ease-in-out .8s infinite' }}/>
      </g>
      
      <circle cx="65" cy="65" r="30" fill="#07070A"/>
      
      <g filter="url(#f-sat)">
        <circle cx="65" cy="65" r="30" fill="none" stroke="#1B305B" strokeWidth="8" opacity=".1"/>
        <circle cx="65" cy="65" r="30" fill="none" stroke="#1B305B" strokeWidth="10" opacity=".18"/>
        
        <circle cx="65" cy="65" r="30" fill="#07070A" stroke="#1B305B" strokeWidth="1.8"/>
        
        <ellipse cx="65" cy="58" rx="27" ry="5.5" fill="none" stroke="#1B305B" strokeWidth=".7" opacity=".2"/>
        <ellipse cx="65" cy="67" rx="29" ry="3" fill="none" stroke="#1B305B" strokeWidth=".5" opacity=".15"/>
        <ellipse cx="65" cy="76" rx="25" ry="5" fill="none" stroke="#1B305B" strokeWidth=".7" opacity=".18"/>
        
        <ellipse cx="65" cy="100" rx="28" ry="10" fill="rgba(27,48,91,0.08)" stroke="#5B94D2" strokeWidth=".8"/>
        <ellipse cx="65" cy="178" rx="28" ry="10" fill="rgba(27,48,91,0.06)" stroke="#5B94D2" strokeWidth=".8"/>
        
        <circle cx="208" cy="115" r="18" fill="radial-gradient" opacity="0"/>
        <path d="M200 110 Q218 100 232 108" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" strokeLinecap="round"/>
      </g>
      
      <g filter="url(#f-sat-soft)" opacity="0.9">
        <ellipse cx="65" cy="65" rx="56" ry="15" fill="none" stroke="url(#ringGrad1)" strokeWidth="2.5"
          strokeDasharray="8 5"
          style={{ animation: 'ring-anim 12s linear infinite' }}
          opacity="0.95"/>
        <ellipse cx="65" cy="65" rx="48" ry="32" fill="none" stroke="rgba(91,148,210,0.5)" strokeWidth="1.8"
          strokeDasharray="6 4"
          style={{ animation: 'ring-anim 9s linear infinite reverse' }}
          opacity="0.8"/>
        <ellipse cx="65" cy="65" rx="38" ry="27" fill="none" stroke="rgba(27,48,91,0.65)" strokeWidth="1.4"
          strokeDasharray="4 6"
          style={{ animation: 'ring-anim 7s linear infinite' }}
          opacity="0.7"/>
      </g>
      
      <circle cx="65" cy="65" r="29" fill="#07070A"/>
      
      <g filter="url(#f-sat)">
        <circle cx="65" cy="65" r="30" fill="none" stroke="#1B305B" strokeWidth="1.8"/>
      </g>
      
      <rect x="35" y="0" width="60" height="2.5" rx="1" fill="rgba(91,148,210,.18)" style={{ animation: 'scan 5s ease-in-out infinite' }}/>
    </svg>
  );
}
