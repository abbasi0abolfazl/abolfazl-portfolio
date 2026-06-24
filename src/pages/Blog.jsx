import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Clock, BookOpen, Search, X, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import AnimatedSection from '../components/portfolio/AnimatedSection';
import { SkeletonBlogCard } from '../components/portfolio/SkeletonCard';
import { getAllPosts, getReadingTime } from '@/lib/blogUtils';
import { useDebounce } from '@/hooks/useDebounce';

function highlight(text, term) {
  if (!term || !text) return text;
  const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} className="bg-primary/25 text-foreground rounded px-0.5 not-italic">{part}</mark>
      : part
  );
}

export default function Blog() {
  const [rawSearch, setRawSearch] = useState('');
  const [activeTags, setActiveTags] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const search = useDebounce(rawSearch, 300);

  // بارگذاری پست‌ها
  useEffect(() => {
    getAllPosts().then(allPosts => {
      setPosts(allPosts);
      setIsLoading(false);
    }).catch(error => {
      console.error('Error loading posts:', error);
      setIsLoading(false);
    });
  }, []);

  // Build tag counts
  const tagCounts = useMemo(() => {
    const counts = {};
    posts.forEach((p) => {
      if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach((t) => { 
          counts[t] = (counts[t] || 0) + 1; 
        });
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const toggleTag = useCallback((tag) => {
    setActiveTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  }, []);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (activeTags.length && !activeTags.every((t) => p.tags?.includes(t))) return false;
      if (search) {
        const q = search.toLowerCase();
        const inTitle = p.title?.toLowerCase().includes(q);
        const inContent = p.content?.toLowerCase().includes(q);
        const inTags = p.tags?.some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inContent && !inTags) return false;
      }
      return true;
    });
  }, [posts, search, activeTags]);

  const hasFilters = rawSearch || activeTags.length > 0;

  return (
    <main className="pt-24 pb-16 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* عنوان Blog با فونت Inter (standard) */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 font-inter tracking-tight">
            Blog
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Thoughts on AI, NLP, and building intelligent systems
          </p>
        </div>

        {/* Search bar */}
        <AnimatedSection className="mb-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={rawSearch}
              onChange={(e) => setRawSearch(e.target.value)}
              placeholder="Search posts by title, content, or tag…"
              className="pl-9 pr-9 h-10 bg-card/60 border-border/50 focus:border-primary/50"
            />
            {rawSearch && (
              <button
                onClick={() => setRawSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </AnimatedSection>

        {/* Popular tags */}
        {tagCounts.length > 0 && (
          <AnimatedSection delay={0.05} className="mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Tag className="w-3 h-3" /> Popular tags:
              </span>
              {tagCounts.slice(0, 10).map(([tag, count]) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all
                    ${activeTags.includes(tag)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card/60 text-muted-foreground border-border/50 hover:border-primary/40 hover:text-primary'
                    }`}
                >
                  {tag}
                  <span className={`text-[10px] font-semibold ${activeTags.includes(tag) ? 'opacity-80' : 'text-muted-foreground'}`}>
                    {count}
                  </span>
                </button>
              ))}
              {activeTags.length > 0 && (
                <button
                  onClick={() => setActiveTags([])}
                  className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 ml-1"
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
          </AnimatedSection>
        )}

        {/* Results count */}
        {hasFilters && !isLoading && (
          <p className="text-xs text-muted-foreground mb-4">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Post list */}
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => <SkeletonBlogCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <AnimatedSection className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-2">
              {hasFilters ? 'No posts match your search.' : 'No blog posts yet. Check back soon!'}
            </p>
            {hasFilters && (
              <button
                onClick={() => { setRawSearch(''); setActiveTags([]); }}
                className="text-primary text-sm hover:underline"
              >
                Clear search
              </button>
            )}
          </AnimatedSection>
        ) : (
          <div className="space-y-6">
            {filtered.map((post, index) => {
              const reading = getReadingTime(post.content);
              return (
                <AnimatedSection key={post.slug} delay={index * 0.06}>
                  <Link to={`/blog/${post.slug}`}>
                    <article className="group p-6 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(new Date(post.date), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          {reading.label}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {reading.wordCount} words
                        </span>
                      </div>

                      {/* تایتل کارت با فونت Inter */}
                      <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2 font-inter tracking-tight">
                        {highlight(post.title, search)}
                      </h2>

                      {post.excerpt && (
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                          {highlight(post.excerpt, search)}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags?.map((tag) => (
                            <span
                              key={tag}
                              onClick={(e) => { e.preventDefault(); toggleTag(tag); }}
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide border cursor-pointer transition-all
                                ${activeTags.includes(tag)
                                  ? 'bg-blue/20 text-blue border-blue/50'
                                  : 'bg-blue/10 text-blue/80 border-blue/20 hover:bg-blue/15 hover:border-blue/40'
                                }`}
                            >
                              {highlight(tag, search)}
                            </span>
                          ))}
                        </div>
                        <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all whitespace-nowrap ml-4">
                          Read <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </article>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}