'use client';
import React from 'react';

interface FilterBarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { value: 'all', label: 'All' },
  { value: 'api', label: 'Developer APIs' },
  { value: 'ml', label: 'ML Models' },
  { value: 'ext', label: 'Extensions' },
  { value: 'app', label: 'Web Apps' },
];

export function FilterBar({ activeCategory, onCategoryChange }: FilterBarProps) {
  return (
    <div className="filter-bar flex gap-2 flex-wrap mb-12">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={`filter-tab px-5 py-2.5 text-[10px] font-mono tracking-[0.14em] uppercase border-[1.5px] border-border transition-all rounded-[100px] ${
            activeCategory === category.value
              ? 'active bg-navy text-white border-navy shadow-[0_4px_16px_rgba(27,48,91,0.25)]'
              : 'bg-transparent text-text3 hover:border-navy hover:text-navy'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}