'use client';
import { useEffect } from 'react';

export function Cursor() {
  useEffect(() => {
    const cur = document.getElementById('cursor');
    if (!cur) return;

    const handleMouseMove = (e: MouseEvent) => {
      cur.style.left = e.clientX + 'px';
      cur.style.top  = e.clientY + 'px';
    };

    const interactiveSelector = 'a, button, .pc, .p-card, .filter-tab, .p-ftab, .nb-pill, .hk-chip, .ch-card, .price-card, .lg-info-card';

    const addHover = () => document.body.classList.add('hovering');
    const removeHover = () => document.body.classList.remove('hovering');

    document.querySelectorAll(interactiveSelector).forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.querySelectorAll(interactiveSelector).forEach(el => {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', removeHover);
      });
    };
  }, []);

  return (
    <div id="cursor" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999,
      pointerEvents: 'none',
      transform: 'translate(-50%, -50%)',
    }}>
      <div className="cur-ring" style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        border: '1.5px solid rgba(27,48,91,0.35)',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        transition: 'all .3s cubic-bezier(.34,1.56,.64,1)',
      }} />
      <div className="cur-dot" style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: 'rgba(91,148,210,0.8)',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        transition: 'all .15s',
      }} />
    </div>
  );
}
