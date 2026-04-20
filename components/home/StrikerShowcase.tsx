'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

const CHIPS = ['Adaptive ML', 'Real-time EDR', 'Antibody Archive', 'MITRE ATT&CK', 'Ransomware defence', 'Zero-day heuristics'];

export function StrikerShowcase() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const W = 420, H = 420;
    canvas.width = W;
    canvas.height = H;
    const cx = W / 2, cy = H / 2, R = 170;
    let rotY = 0;
    const ROT_SPEED = 0.003;
    let raf: number;

    const CONTINENTS = [
      { col: 'rgba(180,20,20,0.75)', pts: [[70,-140],[60,-130],[55,-125],[50,-120],[40,-115],[30,-110],[25,-105],[20,-100],[15,-90],[10,-85],[15,-80],[25,-80],[30,-82],[35,-80],[40,-75],[45,-70],[50,-65],[55,-60],[60,-65],[65,-75],[70,-100],[72,-120],[70,-140]] },
      { col: 'rgba(180,20,20,0.75)', pts: [[10,-75],[5,-78],[0,-80],[-5,-81],[-10,-76],[-15,-75],[-20,-70],[-25,-65],[-30,-60],[-35,-58],[-40,-62],[-45,-65],[-50,-68],[-55,-67],[-55,-65],[-50,-60],[-45,-50],[-40,-50],[-35,-45],[-25,-43],[-15,-39],[-5,-35],[0,-50],[5,-60],[10,-75]] },
      { col: 'rgba(180,20,20,0.70)', pts: [[70,20],[65,25],[60,25],[55,24],[50,20],[45,15],[40,10],[38,15],[40,25],[45,28],[50,30],[55,28],[60,28],[65,30],[70,20]] },
      { col: 'rgba(180,20,20,0.72)', pts: [[35,10],[30,5],[20,-15],[10,-15],[5,-10],[0,10],[-5,15],[-10,25],[-20,30],[-30,25],[-35,20],[-35,35],[-25,35],[-10,40],[0,42],[10,43],[20,40],[30,35],[35,10]] },
      { col: 'rgba(180,20,20,0.72)', pts: [[70,40],[65,50],[60,60],[55,65],[50,70],[45,75],[40,80],[35,75],[30,70],[25,80],[20,85],[15,80],[10,78],[20,90],[25,95],[30,105],[25,110],[20,108],[15,100],[10,104],[5,100],[10,106],[15,110],[20,115],[25,120],[30,120],[35,130],[40,135],[45,140],[50,140],[55,135],[60,130],[65,120],[70,100],[72,70],[70,40]] },
      { col: 'rgba(180,20,20,0.70)', pts: [[-15,128],[-20,122],[-25,115],[-30,115],[-35,118],[-38,140],[-35,150],[-28,154],[-22,150],[-18,145],[-15,140],[-15,128]] },
    ] as { col: string; pts: [number, number][] }[];

    const ARCS: [number,number,number,number,number][] = [
      [-26,28,51,-1,0],[-26,28,37,-122,0.2],[51,-1,35,139,0.6],[40,-74,51,-1,0.4],[1,103,-26,28,0.1],[35,139,37,-122,0.8],[-34,151,1,103,0.3],
    ];

    const CITIES: [number,number][] = [[-26,28],[51,-1],[40,-74],[37,-122],[35,139],[1,103],[-34,151],[48,2],[28,77],[-23,-46]];
    const arcOffsets = ARCS.map(() => Math.random());

    function latLngTo3D(lat: number, lng: number) {
      const phi = (90 - lat) * Math.PI / 180;
      const theta = (lng + 180) * Math.PI / 180;
      return { x: -Math.sin(phi) * Math.cos(theta), y: Math.cos(phi), z: Math.sin(phi) * Math.sin(theta) };
    }

    function project(p3: { x: number; y: number; z: number }, ry: number) {
      const cosY = Math.cos(ry), sinY = Math.sin(ry);
      const rx = p3.x * cosY + p3.z * sinY;
      const rz = -p3.x * sinY + p3.z * cosY;
      if (rz < -0.1) return null;
      const scale = R / (R + rz * R * 0.3);
      return { x: cx + rx * R * scale, y: cy - p3.y * R * scale };
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      const grad = ctx.createRadialGradient(cx - 30, cy - 40, 10, cx, cy, R);
      grad.addColorStop(0, 'rgba(40,5,5,0.95)');
      grad.addColorStop(0.5, 'rgba(20,3,3,0.98)');
      grad.addColorStop(1, 'rgba(5,0,0,1)');
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();

      ctx.strokeStyle = 'rgba(180,20,20,0.12)'; ctx.lineWidth = 0.5;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath(); let first = true;
        for (let lng = -180; lng <= 180; lng += 5) {
          const p = project(latLngTo3D(lat, lng), rotY);
          if (!p) { first = true; continue; }
          if (first) { ctx.moveTo(p.x, p.y); first = false; } else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
      for (let lng = -180; lng < 180; lng += 30) {
        ctx.beginPath(); let first = true;
        for (let lat = -85; lat <= 85; lat += 5) {
          const p = project(latLngTo3D(lat, lng), rotY);
          if (!p) { first = true; continue; }
          if (first) { ctx.moveTo(p.x, p.y); first = false; } else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      CONTINENTS.forEach(cont => {
        ctx.beginPath(); let first = true;
        cont.pts.forEach(([lat, lng]) => {
          const p = project(latLngTo3D(lat, lng), rotY);
          if (!p) return;
          if (first) { ctx.moveTo(p.x, p.y); first = false; } else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath(); ctx.fillStyle = cont.col; ctx.fill();
        ctx.strokeStyle = 'rgba(220,80,80,0.4)'; ctx.lineWidth = 0.8; ctx.stroke();
      });

      ARCS.forEach((arc, i) => {
        const [lat1, lng1, lat2, lng2] = arc;
        const t = arcOffsets[i];
        const p1 = project(latLngTo3D(lat1, lng1), rotY);
        const p2 = project(latLngTo3D(lat2, lng2), rotY);
        if (!p1 || !p2) return;
        const mid3D = {
          x: (latLngTo3D(lat1, lng1).x + latLngTo3D(lat2, lng2).x) * 0.5,
          y: (latLngTo3D(lat1, lng1).y + latLngTo3D(lat2, lng2).y) * 0.5 + 0.4,
          z: (latLngTo3D(lat1, lng1).z + latLngTo3D(lat2, lng2).z) * 0.5,
        };
        const pm = project(mid3D, rotY);
        if (!pm) return;
        const grd = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        grd.addColorStop(0, 'rgba(220,80,80,0)');
        grd.addColorStop(0.4, 'rgba(220,80,80,0.7)');
        grd.addColorStop(1, 'rgba(220,80,80,0)');
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.quadraticCurveTo(pm.x, pm.y, p2.x, p2.y);
        ctx.strokeStyle = grd; ctx.lineWidth = 1.2; ctx.stroke();
        const dotX = (1-t)*(1-t)*p1.x + 2*(1-t)*t*pm.x + t*t*p2.x;
        const dotY = (1-t)*(1-t)*p1.y + 2*(1-t)*t*pm.y + t*t*p2.y;
        ctx.beginPath(); ctx.arc(dotX, dotY, 3, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,120,120,0.95)'; ctx.fill();
        ctx.beginPath(); ctx.arc(dotX, dotY, 5, 0, Math.PI * 2); ctx.fillStyle = 'rgba(220,80,80,0.3)'; ctx.fill();
        arcOffsets[i] = (arcOffsets[i] + 0.002) % 1;
      });

      CITIES.forEach(([lat, lng]) => {
        const p = project(latLngTo3D(lat, lng), rotY);
        if (!p) return;
        ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fillStyle = 'rgba(220,80,80,0.9)'; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fillStyle = 'rgba(220,80,80,0.2)'; ctx.fill();
      });

      const rimGrad = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R);
      rimGrad.addColorStop(0, 'transparent'); rimGrad.addColorStop(1, 'rgba(220,60,60,0.2)');
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = rimGrad; ctx.fill();

      const atmoGrad = ctx.createRadialGradient(cx, cy, R, cx, cy, R + 20);
      atmoGrad.addColorStop(0, 'rgba(180,20,20,0.18)'); atmoGrad.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(cx, cy, R + 20, 0, Math.PI * 2); ctx.fillStyle = atmoGrad; ctx.fill();

      rotY += ROT_SPEED;
      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section aria-label="Striker adaptive EDR desktop app" style={{
      background: '#07070A', position: 'relative', overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Red grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(180,20,20,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(180,20,20,0.04) 1px,transparent 1px)',
        backgroundSize: '52px 52px',
      }} />
      {/* Radial glow */}
      <div style={{
        position: 'absolute', zIndex: 0, pointerEvents: 'none',
        width: '900px', height: '900px', borderRadius: '50%',
        background: 'radial-gradient(circle,rgba(180,20,20,0.15) 0%,transparent 65%)',
        left: '-200px', top: '50%', transform: 'translateY(-50%)', filter: 'blur(80px)',
      }} />

      <div style={{
        maxWidth: '1300px', margin: '0 auto', padding: '96px 48px',
        display: 'grid', gridTemplateColumns: '1fr 520px', gap: '80px',
        alignItems: 'center', position: 'relative', zIndex: 2,
      }}>

        {/* LEFT */}
        <div>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            marginBottom: '20px', padding: '5px 14px 5px 5px',
            borderRadius: '100px', background: 'rgba(180,20,20,0.15)',
            border: '1px solid rgba(220,50,50,0.3)',
          }}>
            <div style={{
              width: '22px', height: '22px', borderRadius: '50%',
              background: 'rgba(180,20,20,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(220,80,80,0.9)' }} />
            </div>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '9.5px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(220,80,80,0.85)' }}>
              Desktop App · Windows · macOS · Linux
            </span>
          </div>

          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(220,80,80,0.5)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '24px', height: '1px', background: 'rgba(220,80,80,0.3)', display: 'inline-block' }} />
            Adaptive EDR
          </div>

          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, fontSize: 'clamp(48px,5.5vw,76px)', color: 'white', marginBottom: '20px', letterSpacing: '-0.03em', lineHeight: 1.0 }}>
            The shield that{' '}
            <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,rgba(220,80,80,0.95),rgba(160,20,20,0.8))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              learns.
            </em>
          </h2>

          <p style={{ fontFamily: "'Libre Baskerville',serif", fontStyle: 'italic', fontSize: '15px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.85, maxWidth: '460px', marginBottom: '36px' }}>
            Striker is an adaptive endpoint detection and response system inspired by the human immune system.
            It detects threats, understands them, neutralises them — then archives every attack as a permanent antibody.
            Every encounter makes it stronger.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '36px' }}>
            {CHIPS.map(label => (
              <span key={label} style={{
                fontFamily: "'DM Mono',monospace", fontSize: '9.5px', letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '6px 14px', borderRadius: '100px',
                background: 'rgba(180,20,20,0.1)', border: '1px solid rgba(220,50,50,0.25)', color: 'rgba(220,80,80,0.65)',
              }}>
                {label}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '32px' }}>
            <Link href="/products/striker" style={{
              padding: '13px 32px', borderRadius: '100px',
              fontFamily: "'DM Mono',monospace", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
              background: 'rgba(180,20,20,0.8)', color: 'white', textDecoration: 'none',
              border: '1px solid rgba(220,50,50,0.4)',
              boxShadow: '0 1px 0 rgba(220,80,80,0.2) inset, 0 8px 24px rgba(180,20,20,0.4)',
            }}>
              Download Striker →
            </Link>
            <Link href="/products/striker" style={{
              padding: '13px 32px', borderRadius: '100px',
              fontFamily: "'DM Mono',monospace", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.12)', background: 'transparent',
            }}>
              Learn more
            </Link>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px',
            borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(180,20,20,0.2)',
          }}>
            {[['72h', 'CTF challenge'], ['8', 'Attack modules'], ['∞', 'Adaptation']].map(([n, l]) => (
              <div key={l} style={{ padding: '16px', background: 'rgba(255,255,255,0.04)', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '28px', fontWeight: 300, color: 'white', lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '8.5px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(220,80,80,0.5)', marginTop: '3px' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Globe */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'relative', width: '420px', height: '420px', margin: '0 auto' }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />

            {/* Floating threat tags */}
            {[
              { cls: { top: '8%', right: '-8%' }, dot: 'rgba(220,80,80,0.9)', text: 'T1486 · Ransomware blocked' },
              { cls: { bottom: '22%', right: '-10%' }, dot: 'rgba(220,80,80,0.9)', text: 'T1071 · C2 beacon killed' },
              { cls: { top: '40%', left: '-8%' }, dot: 'rgba(255,150,0,0.9)', text: 'T1543 · Rootkit detected' },
              { cls: { bottom: '8%', left: '5%' }, dot: 'rgba(80,200,120,0.9)', text: 'Antibody archived' },
            ].map(({ cls, dot, text }) => (
              <div key={text} style={{
                position: 'absolute', ...cls,
                background: 'rgba(7,7,10,0.85)', backdropFilter: 'blur(16px)',
                border: '1px solid rgba(220,50,50,0.2)', borderTopColor: 'rgba(220,80,80,0.35)',
                padding: '6px 14px', borderRadius: '100px',
                fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '0.08em',
                whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.7)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
              }}>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', marginRight: '7px', verticalAlign: 'middle', background: dot }} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .striker-inner { grid-template-columns: 1fr !important; }
          .striker-globe-wrap { display: none; }
        }
      `}</style>
    </section>
  );
}
