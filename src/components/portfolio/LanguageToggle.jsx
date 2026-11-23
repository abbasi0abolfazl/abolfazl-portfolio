import React from 'react';
import { Languages } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';

export default function LanguageToggle({ className = '', showLabel = false }) {
  const { lang, toggleLang, tr } = useLang();
  const isPersian = lang === 'fa';
  const targetLabel = isPersian ? 'EN' : 'FA';
  const tooltip = tr('lang_toggle_tooltip');

  return (
    <button
      type="button"
      onClick={toggleLang}
      className={`relative inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border/40 hover:border-primary/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
      aria-label={tooltip}
      title={tooltip}
    >
      <Languages className="w-4 h-4 text-primary shrink-0" />
      <span className="font-mono font-bold text-[11px] uppercase">{targetLabel}</span>
      {showLabel && (
        <span className="text-xs font-normal text-muted-foreground">
          {isPersian ? 'English' : 'فارسی'}
        </span>
      )}
    </button>
  );
}
