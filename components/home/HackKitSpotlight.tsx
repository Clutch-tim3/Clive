'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function HackKitSpotlight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  // Particle canvas initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
    }

    const particles: Particle[] = [];
    const particleCount = 20; // Reduced from 40 to 20 for better performance

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2, // Reduced speed
        vy: (Math.random() - 0.5) * 0.2, // Reduced speed
        radius: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.3 + 0.05
      });
    }

    // Animation loop with requestAnimationFrame cleanup
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(27, 48, 91, ${particle.alpha})`;
        ctx.fill();
      });

      // Draw connections between particles (optimized)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distanceSquared = dx * dx + dy * dy; // Avoid sqrt for performance

          if (distanceSquared < 8100) { // 90^2
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(27, 48, 91, ${(particles[i].alpha * particles[j].alpha) * 0.12})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Handle resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Terminal ticker - optimized
  useEffect(() => {
    const lines = [
      'POST  /v1/recon/domain          200 · 1.2s',
      '→     47 subdomains in CT logs',
      '→     Cloud: AWS (us-east-1)',
      '→     3 attack vectors found    CRITICAL',
      'POST  /v1/enum/subdomains       200 · 3.4s',
      '→     staging.target.com → Heroku  TAKEOVER',
      '→     admin.target.com → admin panel  HIGH',
      'POST  /v1/vuln/correlate        200 · 0.8s',
      '→     nginx/1.14.0 · CVE-2019-9511  HIGH',
      '→     openssh/7.4 · CVE-2018-15473  MED',
      'POST  /v1/osint/credentials     200 · 0.5s',
      '→     j.smith@target.com — 3 breaches  HIGH',
      'POST  /v1/intel/synthesise      200 · 4.1s',
      '→     Risk score: 87/100        CRITICAL',
      '→     3 attack paths generated'
    ];

    let idx = 0;
    const timer = setInterval(() => {
      const term = terminalRef.current;
      if (!term) return;

      const line = lines[idx % lines.length];
      idx++;

      // Create new line element - optimized
      const lineEl = document.createElement('div');
      lineEl.className = 'opacity-0 transition-opacity duration-200'; // Reduced duration
      lineEl.style.fontFamily = 'DM Mono, monospace';
      lineEl.style.fontSize = '10.5px';
      lineEl.style.lineHeight = '1.9';
      lineEl.style.color = 'rgba(255, 255, 255, 0.6)';

      // Parse and style the line - optimized
      if (line.startsWith('POST')) {
        const [method, path, status] = line.split(/\s{2,}/);
        lineEl.innerHTML = `
          <span style="color: rgba(27, 48, 91, 0.65)">${method}</span>
          <span style="color: rgba(255, 255, 255, 0.6)">  ${path}</span>
          <span style="color: rgba(27, 48, 91, 0.45)">  ${status}</span>
        `;
      } else if (line.startsWith('→')) {
        const [arrow, content, severity] = line.split(/\s{2,}/);
        let severityColor = 'rgba(27, 48, 91, 0.45)';
        
        if (severity) {
          if (severity === 'CRITICAL' || severity === 'TAKEOVER') {
            severityColor = 'rgba(91, 148, 210, 0.8)';
          } else if (severity === 'HIGH') {
            severityColor = 'rgba(91, 148, 210, 0.55)';
          } else if (severity === 'MED') {
            severityColor = 'rgba(255, 255, 255, 0.3)';
          }
        }

        lineEl.innerHTML = `
          <span style="color: rgba(27, 48, 91, 0.5)">${arrow}</span>
          <span style="color: rgba(255, 255, 255, 0.38)">  ${content}</span>
          ${severity ? `<span style="color: ${severityColor}">  ${severity}</span>` : ''}
        `;
      }

      // Append new line
      term.appendChild(lineEl);

      // Fade in - optimized
      setTimeout(() => {
        lineEl.classList.remove('opacity-0');
        lineEl.classList.add('opacity-100');
      }, 30);

      // Remove oldest line if more than 5 lines - optimized
      if (term.children.length > 5) {
        const oldestLine = term.children[0];
        oldestLine.classList.remove('opacity-100');
        oldestLine.classList.add('opacity-0');
        setTimeout(() => {
          if (oldestLine.parentNode === term) {
            term.removeChild(oldestLine);
          }
        }, 200);
      }
    }, 2000); // Increased interval for better performance

    const initial = setTimeout(() => {
      // First tick
    }, 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(initial);
    };
  }, []);

  return (
    <section className="hk-section relative bg-black py-22 px-14 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMGg0OHY0OEgweiIgZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjZmZmIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHN0cm9rZSB3aWR0aD0iMSIgc3Ryb2tlPSIjMTczMDViIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHN0cm9rZSB3aWR0aD0iMSIgc3Ryb2tlPSIjMTczMDViIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIG9mZnNldD0iMC4wNyI+PC9zdHJva2U+Cjx0ZXh0IHg9IjAiIHk9IjAiIGZvbnQtc2l6ZT0iMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0idXJsKCNwYXRoXzEpIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iU2Fucy1zZXJpZiI+PHA+PGZpbGUgb3BhY2l0eT0iMC4wNyIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjMTczMDViIi8+PGZpbGUgb3BhY2l0eT0iMC4wNyIgd2lkdGg9IjEiIGhlaWdodD0iNDgiIGZpbGU9InRyYW5zcGFyZW50Ii8+PC9wPjwvdGV4dD4KPC9zdmc+')]"></div>
      
      {/* Radial navy glow */}
      <div className="absolute inset-0 bg-gradient-radial from-navy/18 via-transparent to-transparent" style={{ background: 'radial-gradient(ellipse 80% 60% at 70% 50%, rgba(27, 48, 91, 0.18) 0%, transparent 70%)' }}></div>
      
      {/* Particle canvas */}
      <canvas ref={canvasRef} id="hk-canvas" className="absolute inset-0 z-0 opacity-55 pointer-events-none"></canvas>
      
      {/* Scan line */}
      <div className="hk-scan absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-navy/50 to-transparent animate-[scan-sweep_5s_ease-in-out_infinite] delay-1500"></div>
      
      {/* Main content */}
      <div className="hk-inner relative z-2 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        <motion.div 
          className="hk-left"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        >
          {/* New product badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-navy/40 bg-navy/5 mb-8">
            <div className="w-5.5 h-5.5 bg-navy rounded-sm flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            </div>
            <span className="text-[9.5px] font-mono uppercase tracking-[0.14em] text-navy/65">New Product — Just Launched</span>
          </div>
          
          {/* Eyebrow */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-7 h-0.5 bg-navy"></div>
            <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-navy/55">Offensive Security</span>
          </div>
          
          {/* Heading */}
          <h2 className="text-[clamp(52px,6vw,80px)] font-display font-light leading-tight mb-6">
            <div>The complete</div>
            <div className="italic bg-gradient-to-br from-[rgba(91,148,210,0.9)] to-[rgba(27,48,91,0.8)] bg-clip-text text-transparent">hacking kit</div>
            <div>for professionals.</div>
          </h2>
          
          {/* Subtitle */}
          <p className="text-base font-serif italic text-text2 mb-8 max-w-xl leading-relaxed">
            Ten reconnaissance and intelligence capabilities in a single API.
            Domain recon, subdomain takeover detection, CVE correlation, OSINT,
            and AI-synthesised red team reports — for authorised security testing.
          </p>
          
          {/* Capability chips */}
          <div className="flex flex-wrap gap-2 mb-10">
            {['Domain Recon', 'Subdomain Enum', 'CVE Correlation', 'Credential OSINT', 'AI Synthesis', 'MITRE Mapped'].map((label, index) => (
              <div 
                key={index}
                className="px-3 py-1.5 text-[9.5px] font-mono uppercase tracking-[0.14em] border border-navy/30 bg-navy/5 text-navy/65 hover:border-navy/60 hover:text-[rgba(91,148,210,0.9)] hover:bg-navy/14 transition-all cursor-pointer"
              >
                {label}
              </div>
            ))}
          </div>
          
            {/* CTA buttons */}
           <div className="flex items-center space-x-6">
             <Link 
               href="/products/hackkit" 
               className="lg-navy"
             >
               Explore HackKit
             </Link>
            <Link 
              href="/docs/hackkit" 
              className="flex items-center space-x-2 text-[11px] font-mono text-text2 hover:text-ink transition-colors"
            >
              <span>View documentation</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          className="hk-right"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        >
          {/* Radar SVG */}
          <div className="relative mb-6">
            <svg viewBox="0 0 280 280" className="w-full max-w-[320px] mx-auto aspect-square">
              {/* Concentric circles */}
              <circle cx="140" cy="140" r="120" fill="none" stroke="rgba(27,48,91,0.12)" strokeWidth="1" />
              <circle cx="140" cy="140" r="90" fill="none" stroke="rgba(27,48,91,0.13)" strokeWidth="1" />
              <circle cx="140" cy="140" r="60" fill="none" stroke="rgba(27,48,91,0.14)" strokeWidth="1" />
              <circle cx="140" cy="140" r="30" fill="none" stroke="rgba(27,48,91,0.15)" strokeWidth="1" />
              
              {/* Cross-hair lines */}
              <line x1="140" y1="20" x2="140" y2="260" stroke="rgba(27,48,91,0.07)" strokeWidth="1" />
              <line x1="20" y1="140" x2="260" y2="140" stroke="rgba(27,48,91,0.07)" strokeWidth="1" />
              <line x1="50" y1="50" x2="230" y2="230" stroke="rgba(27,48,91,0.10)" strokeWidth="1" />
              <line x1="230" y1="50" x2="50" y2="230" stroke="rgba(27,48,91,0.10)" strokeWidth="1" />
              
              {/* Target dots */}
              <circle cx="190" cy="95" r="3" fill="rgba(27,48,91,0.6)" />
              <circle cx="100" cy="175" r="2" fill="rgba(27,48,91,0.4)" />
              <circle cx="155" cy="58" r="2.5" fill="rgba(27,48,91,0.5)" />
              <circle cx="210" cy="155" r="3.5" fill="rgba(27,48,91,0.7)" />
              <circle cx="75" cy="105" r="4" fill="rgba(27,48,91,0.8)" />
              <circle cx="75" cy="105" r="7" fill="none" stroke="rgba(27,48,91,0.4)" strokeWidth="1" />
              
              {/* Centre dot */}
              <circle cx="140" cy="140" r="4" fill="rgba(27,48,91,0.7)" />
              <circle cx="140" cy="140" r="2" fill="rgba(255,255,255,0.5)" />
              
              {/* Pulse rings */}
              <circle cx="140" cy="140" r="20" fill="none" stroke="rgba(91,148,210,0.6)" strokeWidth="2" className="animate-[radar-pulse_2s_ease-out_infinite]" />
              <circle cx="140" cy="140" r="20" fill="none" stroke="rgba(91,148,210,0.6)" strokeWidth="2" className="animate-[radar-pulse_2s_ease-out_infinite_0.7s]" />
              
              {/* Sweep arm */}
              <g className="animate-[radar-spin_4s_linear_infinite]" style={{ transformOrigin: '50% 50%' }}>
                <defs>
                  <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="100%" stopColor="rgba(91,148,210,0.28)" />
                  </radialGradient>
                </defs>
                <path d="M140,140 L140,20 A120,120 0 0,1 225,225 Z" fill="url(#radarGradient)" />
                <line x1="140" y1="140" x2="140" y2="20" stroke="rgba(91,148,210,0.5)" strokeWidth="1.2" />
              </g>
            </svg>
            
            {/* Floating finding tags */}
            <div className="absolute top-[12%] right-[-22%] glass px-3.5 py-2 rounded-sm animate-[float-tag_3.2s_ease-in-out_infinite]">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-[rgba(27,48,91,0.8)] rounded-full"></div>
                <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-white/55">CRITICAL</span>
                <span className="text-[10px] font-mono text-navy/55">Subdomain takeover</span>
              </div>
            </div>
            
            <div className="absolute bottom-[28%] right-[-18%] glass px-3.5 py-2 rounded-sm animate-[float-tag_3.8s_ease-in-out_infinite_0.6s]">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-[rgba(91,148,210,0.7)] rounded-full"></div>
                <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-white/45">HIGH</span>
                <span className="text-[10px] font-mono text-navy/50">CVE-2023-46604</span>
              </div>
            </div>
            
            <div className="absolute top-[45%] left-[-16%] glass px-3.5 py-2 rounded-sm animate-[float-tag_4.4s_ease-in-out_infinite_1.1s]">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-[rgba(27,48,91,0.5)] rounded-full"></div>
                <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-white/38">MED</span>
                <span className="text-[10px] font-mono text-navy/45">No DMARC policy</span>
              </div>
            </div>
            
            <div className="absolute bottom-[10%] left-[-8%] glass px-3.5 py-2 rounded-sm animate-[float-tag_3.6s_ease-in-out_infinite_1.7s]">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-[rgba(27,48,91,0.3)] rounded-full"></div>
                <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-white/28">INFO</span>
                <span className="text-[10px] font-mono text-navy/40">47 subdomains found</span>
              </div>
            </div>
          </div>
          
          {/* Three-stat row */}
          <div className="grid grid-cols-3 gap-px border border-navy/20 mb-6">
            <div className="bg-navy/5 p-4 text-center border-r border-navy/20">
              <div className="text-[30px] font-display font-light text-white mb-1">10</div>
              <div className="text-[8.5px] font-mono uppercase tracking-[0.12em] text-navy/50">Endpoints</div>
            </div>
            <div className="bg-navy/5 p-4 text-center border-r border-navy/20">
              <div className="text-[30px] font-display font-light text-white mb-1">14</div>
              <div className="text-[8.5px] font-mono uppercase tracking-[0.12em] text-navy/50">MITRE tactics</div>
            </div>
            <div className="bg-navy/5 p-4 text-center">
              <div className="text-[30px] font-display font-light text-white mb-1">60%</div>
              <div className="text-[8.5px] font-mono uppercase tracking-[0.12em] text-navy/50">Cost reduction</div>
            </div>
          </div>
          
          {/* Live terminal */}
          <div className="bg-black/50 border border-navy/25 rounded-sm overflow-hidden">
            <div className="px-3.5 py-2 bg-navy/8 border-b border-navy/20 flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-navy/30 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-navy/30 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-navy/30 rounded-full"></div>
              <span className="text-[10px] font-mono text-navy/60">hackkit · live recon</span>
            </div>
            <div ref={terminalRef} className="px-3.5 py-3.5 h-[110px] overflow-hidden"></div>
          </div>
        </motion.div>
      </div>
      
      {/* Keyframe animations - optimized */}
      <style jsx>{`
        @keyframes scan-sweep {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(500%); }
        }
        
        @keyframes radar-pulse {
          0% { transform: scale(0); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        
        @keyframes radar-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes float-tag {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); } /* Reduced distance */
        }
        
        @keyframes pulse-orb {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(27, 48, 91, 0); }
          50% { transform: scale(1.06); box-shadow: 0 0 0 18px rgba(27, 48, 91, 0); }
        }
        
        /* GPU acceleration */
        .hk-scan {
          will-change: transform;
          backface-visibility: hidden;
        }
        
        .animate\\[radar-pulse\\],
        .animate\\[radar-spin\\],
        .animate\\[float-tag\\],
        .animate\\[pulse-orb\\] {
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
      `}</style>
    </section>
  );
}
