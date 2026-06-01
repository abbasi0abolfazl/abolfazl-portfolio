import React, { useState, useEffect } from 'react';
import { List, ChevronDown, ChevronUp } from 'lucide-react';

function extractHeadings(content) {
  const lines = content.split('\n');
  const headings = [];
  lines.forEach((line) => {
    const m = line.match(/^(#{1,3})\s+(.+)/);
    if (m) {
      const level = m[1].length;
      const text = m[2].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      headings.push({ level, text, id });
    }
  });
  return headings;
}

export default function TableOfContents({ content }) {
  const headings = extractHeadings(content);
  const [active, setActive] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [content]);

  if (headings.length < 2) return null;

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); setMobileOpen(false); }
  };

  const TocList = () => (
    <ul className="space-y-0.5">
      {headings.map(({ id, text, level }) => (
        <li key={id} style={{ paddingLeft: `${(level - 1) * 12}px` }}>
          <button
            onClick={() => scrollTo(id)}
            className={`text-left w-full text-xs py-1.5 px-2 rounded-lg transition-all duration-200 leading-snug
              ${active === id
                ? 'text-blue-400 bg-blue-500/10 font-semibold border-l-2 border-blue-400 pl-3 text-[13px]'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border-l-2 border-transparent pl-3'
              }`}
          >
            {text}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Desktop: always-visible sticky sidebar */}
      <aside className="hidden lg:block w-52 shrink-0">
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3 pb-2 border-b border-border/40">
            <List className="w-3 h-3" /> Contents
          </div>
          <TocList />
        </div>
      </aside>

      {/* Mobile: collapsible bar */}
      <div className="lg:hidden mb-6 rounded-xl border border-border/50 bg-card/60 overflow-hidden">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground"
        >
          <span className="flex items-center gap-2"><List className="w-4 h-4 text-primary" /> Contents</span>
          {mobileOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        {mobileOpen && (
          <div className="px-4 pb-3">
            <TocList />
          </div>
        )}
      </div>
    </>
  );
}