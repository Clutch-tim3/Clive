'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { fadeUp, slideInRight } from '@/lib/animations';

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: 'fadeUp' | 'slideInRight';
  delay?: number;
  threshold?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  threshold = 0.08,
  className,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  const variants = variant === 'slideInRight' ? slideInRight : fadeUp;

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
}