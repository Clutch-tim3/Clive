import React from 'react';

interface CodeBlockProps {
  filename?: string;
  children: React.ReactNode;
}

export function CodeBlock({ filename = 'code.py', children }: CodeBlockProps) {
  return (
    <div className="code-block">
      <div className="code-block-bar">
        <div className="code-block-dots">
          <span />
          <span />
          <span />
        </div>
        <span className="code-block-filename">{filename}</span>
      </div>
      <div className="code-block-body">
        <pre className="code-block-pre">
          {children}
        </pre>
      </div>
    </div>
  );
}
