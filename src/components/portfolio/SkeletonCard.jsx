import React from 'react';

export function SkeletonBlogCard() {
  return (
    <div className="p-6 rounded-xl bg-card/50 border border-border/50 space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-3 w-20 rounded-full shimmer" />
        <div className="h-3 w-16 rounded-full shimmer" />
      </div>
      <div className="h-5 w-4/5 rounded shimmer" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded shimmer" />
        <div className="h-3 w-3/4 rounded shimmer" />
      </div>
      <div className="flex gap-2 pt-1">
        <div className="h-5 w-14 rounded-full shimmer" />
        <div className="h-5 w-14 rounded-full shimmer" />
      </div>
    </div>
  );
}

export function SkeletonProjectCard() {
  return (
    <div className="rounded-xl bg-background/60 border border-border/50 overflow-hidden">
      <div className="h-2 shimmer" />
      <div className="p-6 space-y-3">
        <div className="h-5 w-3/4 rounded shimmer" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded shimmer" />
          <div className="h-3 w-5/6 rounded shimmer" />
        </div>
        <div className="flex gap-2 pt-1">
          <div className="h-5 w-12 rounded-full shimmer" />
          <div className="h-5 w-16 rounded-full shimmer" />
          <div className="h-5 w-10 rounded-full shimmer" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-7 w-20 rounded shimmer" />
          <div className="h-7 w-20 rounded shimmer" />
        </div>
      </div>
    </div>
  );
}