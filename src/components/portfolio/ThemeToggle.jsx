import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-5 h-5 transition-transform duration-300 hover:rotate-45 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5 transition-transform duration-300 hover:-rotate-12 text-slate-700" />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
