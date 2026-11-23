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
    <div className="group relative my-5 rounded-xl overflow-hidden border border-slate-800 dark:border-border/50 bg-slate-950 dark:bg-[hsl(222,47%,8%)] shadow-md">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 dark:bg-[hsl(217,33%,14%)] border-b border-slate-800 dark:border-border/30">
        <span className="text-xs font-mono text-slate-400">
          {language || 'code'}
        </span>
        <button
          onClick={copy}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-all
            ${copied
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80'
            }`}
        >
          {copied ? <><Check className="w-3 h-3 text-emerald-400" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
        </button>
      </div>
      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed">
          <code className="text-slate-100 dark:text-slate-200 font-mono whitespace-pre">{code}</code>
        </pre>
      </div>
    </div>
  );
}