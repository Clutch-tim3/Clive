import React from 'react';

interface CodeBlockProps {
  filename?: string;
  children: React.ReactNode;
}

export function CodeBlock({ filename = 'code.py', children }: CodeBlockProps) {
  return (
    <div className="bg-black/95 border border-white/06 rounded-sm overflow-hidden">
      <div className="flex items-center px-4 py-2 border-b border-white/05">
        <div className="flex items-center space-x-2 mr-4">
          <div className="w-2 h-2 rounded-full bg-white/15" />
          <div className="w-2 h-2 rounded-full bg-white/10" />
          <div className="w-2 h-2 rounded-full bg-white/07" />
        </div>
        <span className="text-[11px] font-mono text-white/20">{filename}</span>
      </div>
      <div className="p-4">
        <pre className="text-[12px] font-mono leading-6 text-white/90 overflow-x-auto">
          {children}
        </pre>
      </div>
    </div>
  );
}