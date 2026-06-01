

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { ArrowLeft, Calendar, Clock, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import ReadingProgressBar from '../components/portfolio/ReadingProgressBar';
import BlogComments from '../components/portfolio/BlogComments';
import BlogLikeShare from '../components/portfolio/BlogLikeShare';
import TableOfContents from '../components/portfolio/blog/TableOfContents';
import MarkdownRenderer from '../components/portfolio/blog/MarkdownRenderer';
import { getReadingTime } from '@/lib/readingTime';
import { useLang } from '@/lib/LanguageContext';

export default function BlogPost() {
  const slug = window.location.pathname.split('/blog/')[1];
  const { tr } = useLang();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => db.entities.BlogPost.filter({ slug }),
  });

  const post = posts[0];
  const reading = post ? getReadingTime(post.content) : null;

  if (isLoading) {
    return (
      <main className="pt-24 pb-16 px-4 min-h-screen">
        <ReadingProgressBar />
        <div className="max-w-3xl mx-auto animate-pulse space-y-4">
          <div className="h-4 w-20 shimmer rounded" />
          <div className="h-8 w-4/5 shimmer rounded" />
          <div className="h-4 w-1/3 shimmer rounded" />
          <div className="mt-8 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`h-4 shimmer rounded ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog" className="text-primary hover:underline flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> {tr('blog_back')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 px-4 min-h-screen">
      <ReadingProgressBar />

      <div className="max-w-6xl mx-auto">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {tr('blog_back')}
        </Link>

        {/* Article header */}
        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-5">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              {format(new Date(post.created_date), 'MMMM d, yyyy')}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              {reading.label}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              {reading.wordCount.toLocaleString()} words
            </span>

          </div>

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-blue/10 text-blue border border-blue/25"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="h-px bg-border/50 mb-8" />

        {/* Two-column layout: TOC sidebar + article */}
        <div className="flex gap-10 items-start">
          {/* TOC (handles both desktop sidebar and mobile collapsible internally) */}
          <TableOfContents content={post.content} />

          {/* Article body */}
          <article className="flex-1 min-w-0">
            <MarkdownRenderer content={post.content} />

            <BlogLikeShare slug={slug} title={post.title} />
            <BlogComments slug={slug} />

            <div className="mt-12 pt-8 border-t border-border/50 flex items-center justify-between">
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> {tr('blog_back')}
              </Link>

            </div>
          </article>
        </div>
      </div>
    </main>
  );
}