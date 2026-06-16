

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, Cpu } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { projects, techFilters, typeFilters, yearFilters } from '@/data/projectsData';
import { getAllPosts } from '@/lib/blogUtils';
import { AnimatePresence, motion } from 'framer-motion';

function highlight(text, query) {
  if (!query || !text) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/30 text-primary rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const { data: posts = [] } = useQuery({
    queryKey: ['blog-posts-search'],
    queryFn: getAllPosts,
    staleTime: 60_000,
  });

  // keyboard shortcut: Ctrl/Cmd+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const q = query.trim().toLowerCase();

  const matchedPosts = q.length < 2 ? [] : posts.filter(
    (p) => p.title?.toLowerCase().includes(q) || p.excerpt?.toLowerCase().includes(q) || p.tags?.some((t) => t.toLowerCase().includes(q))
  ).slice(0, 4);

  const matchedProjects = q.length < 2 ? [] : projects.filter(
    (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q))
  ).slice(0, 4);

  const hasResults = matchedPosts.length > 0 || matchedProjects.length > 0;

  const go = (url) => {
    navigate(url);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/50 bg-muted/30 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all text-sm group"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline text-xs">Search…</span>
        <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-muted/60 border border-border/40 font-mono">⌘K</kbd>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <>
            {/* Mobile overlay */}
            <div className="fixed inset-0 z-[60] md:hidden bg-black/60" onClick={() => setOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-[340px] sm:w-[420px] rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/40 z-[70] overflow-hidden"
            >
              {/* Input */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search posts, projects…"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  autoComplete="off"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Results */}
              <div className="max-h-[400px] overflow-y-auto">
                {q.length < 2 && (
                  <p className="text-xs text-muted-foreground text-center py-6">Type at least 2 characters to search</p>
                )}

                {q.length >= 2 && !hasResults && (
                  <p className="text-xs text-muted-foreground text-center py-6">No results for "{query}"</p>
                )}

                {matchedPosts.length > 0 && (
                  <div className="p-2">
                    <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      <FileText className="w-3 h-3" /> Blog Posts
                    </div>
                    {matchedPosts.map((post) => (
                      <button
                        key={post.id}
                        onClick={() => go(`/blog/${post.slug}`)}
                        className="w-full text-left flex flex-col gap-0.5 px-3 py-2.5 rounded-xl hover:bg-primary/8 hover:bg-primary/10 transition-colors group"
                      >
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {highlight(post.title, query)}
                        </span>
                        {post.excerpt && (
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {highlight(post.excerpt, query)}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {matchedProjects.length > 0 && (
                  <div className="p-2">
                    {matchedPosts.length > 0 && <div className="h-px bg-border/40 mx-2 mb-2" />}
                    <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      <Cpu className="w-3 h-3" /> Projects
                    </div>
                    {matchedProjects.map((proj) => (
                      <button
                        key={proj.id}
                        onClick={() => go(`/projects/${proj.id}`)}
                        className="w-full text-left flex flex-col gap-0.5 px-3 py-2.5 rounded-xl hover:bg-primary/10 transition-colors group"
                      >
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {highlight(proj.title, query)}
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {highlight(proj.description, query)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {hasResults && (
                <div className="border-t border-border/40 px-4 py-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span>↵ select</span><span>esc close</span>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}