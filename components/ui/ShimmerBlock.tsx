'use client';
import React, { useEffect, useRef, useState } from 'react';

interface ShimmerBlockProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'default' | 'slow' | 'fast';
  isDark?: boolean;
  variant?: 'lg' | 'lg-strong' | 'lg-navy' | 'water' | 'default';
}

export function ShimmerBlock({
  children,
  className = '',
  animation = 'default',
  isDark = true,
  variant = 'water',
}: ShimmerBlockProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const animationClass = {
    default: 'animate-shimmer',
    slow: 'animate-shimmer-slow',
    fast: 'animate-shimmer-fast',
  }[animation];

  const baseClass = isDark ? 'bg-black' : 'bg-white';

  if (variant === 'default') {
    return (
      <div
        ref={ref}
        className={`relative overflow-hidden border border-black/5 ${baseClass} ${className} rounded-lg shadow-md`}
      >
        <div className={`absolute inset-0 shimmer-layer pointer-events-none ${isVisible ? animationClass : ''}`} />
        <div className="relative z-10">{children}</div>
      </div>
    );
  } else if (variant === 'water') {
    return (
      <div
        ref={ref}
        className={`lg ${className}`}
      >
        <div className="relative z-10">{children}</div>
      </div>
    );
  } else {
    return (
      <div
        ref={ref}
        className={`${variant} ${className}`}
      >
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
}