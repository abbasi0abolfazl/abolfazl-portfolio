import React from 'react';
import { Info, Lightbulb, AlertTriangle, XOctagon } from 'lucide-react';

const TYPES = {
  info:    { icon: Info,          bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    text: 'text-blue-400',    label: 'Note' },
  tip:     { icon: Lightbulb,     bg: 'bg-green-500/10',   border: 'border-green-500/30',   text: 'text-green-400',   label: 'Tip' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   text: 'text-amber-400',   label: 'Warning' },
  danger:  { icon: XOctagon,      bg: 'bg-red-500/10',     border: 'border-red-500/30',     text: 'text-red-400',     label: 'Danger' },
};

/**
 * Usage in markdown:
 * > [!info] This is an info callout
 * > [!tip] This is a tip
 * > [!warning] Be careful
 * > [!danger] Critical issue
 */
export default function Callout({ type = 'info', children }) {
  const cfg = TYPES[type] || TYPES.info;
  const Icon = cfg.icon;

  return (
    <div className={`my-5 flex gap-3 p-4 rounded-xl border ${cfg.bg} ${cfg.border}`}>
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${cfg.text}`} />
      <div className="flex-1 min-w-0">
        <span className={`text-xs font-bold uppercase tracking-wide ${cfg.text} block mb-1`}>{cfg.label}</span>
        <div className="text-sm text-foreground/80 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}