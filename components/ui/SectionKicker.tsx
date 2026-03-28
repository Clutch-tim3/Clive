import React from 'react';

interface SectionKickerProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionKicker({ children, className = '' }: SectionKickerProps) {
  return (
    <div className={`flex items-center space-x-3 mb-4 ${className}`}>
      <div className="h-[2px] w-[28px] bg-navy" />
      <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-navy">
        {children}
      </span>
    </div>
  );
}