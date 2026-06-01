import React from 'react';
import { Moon } from 'lucide-react';

// Light mode is permanently removed. This component is kept for layout compatibility.
export default function ThemeToggle() {
  return (
    <div className="p-2 rounded-lg text-muted-foreground" title="Dark mode only">
      <Moon className="w-5 h-5" />
    </div>
  );
}