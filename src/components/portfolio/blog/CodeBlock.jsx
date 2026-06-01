import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, '');

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-5 rounded-xl overflow-hidden border border-border/50 bg-[hsl(222,47%,8%)]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[hsl(217,33%,14%)] border-b border-border/30">
        <span className="text-xs font-mono text-muted-foreground">
          {language || 'code'}
        </span>
        <button
          onClick={copy}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-all
            ${copied
              ? 'bg-green-500/20 text-green-400'
              : 'bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
        >
          {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
        </button>
      </div>
      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed">
          <code className="text-foreground font-mono whitespace-pre">{code}</code>
        </pre>
      </div>
    </div>
  );
}