import React, { useState, useEffect } from 'react';
import { Heart, Share2, Linkedin, Twitter, Link2, Check } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { getLikeCount, hasUserLiked, toggleLike } from '@/lib/localBlogService';

export default function BlogLikeShare({ slug, title }) {
  const { tr } = useLang();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLiked(hasUserLiked(slug));
    setCount(getLikeCount(slug));
  }, [slug]);

  const handleToggleLike = () => {
    const result = toggleLike(slug);
    setLiked(result.liked);
    setCount(result.count);
  };

  const url = window.location.href;

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareLinkedIn = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  const shareTwitter = () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');

  return (
    <div className="flex flex-wrap items-center gap-3 py-6 border-y border-border/50 my-8">
      {/* Like */}
      <button
        onClick={handleToggleLike}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200
          ${liked
            ? 'bg-red-500/10 border-red-500/30 text-red-500'
            : 'border-border/50 text-muted-foreground hover:border-red-500/30 hover:text-red-500'
          }`}
      >
        <Heart className={`w-4 h-4 ${liked ? 'fill-red-500' : ''}`} />
        {liked ? tr('blog_liked') : tr('blog_like')}
        {count > 0 && <span className="text-xs font-semibold">{count}</span>}
      </button>

      <span className="text-border/50 select-none">|</span>

      {/* Share label */}
      <span className="text-sm text-muted-foreground flex items-center gap-1.5">
        <Share2 className="w-4 h-4" /> {tr('blog_share')}:
      </span>

      {/* LinkedIn */}
      <button
        onClick={shareLinkedIn}
        className="p-2 rounded-full border border-border/50 text-muted-foreground hover:text-blue-500 hover:border-blue-500/30 transition-all"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </button>

      {/* Twitter / X */}
      <button
        onClick={shareTwitter}
        className="p-2 rounded-full border border-border/50 text-muted-foreground hover:text-sky-400 hover:border-sky-400/30 transition-all"
        title="Share on X (Twitter)"
      >
        <Twitter className="w-4 h-4" />
      </button>

      {/* Copy link */}
      <button
        onClick={copyLink}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs border transition-all duration-200
          ${copied
            ? 'bg-primary/10 border-primary/30 text-primary'
            : 'border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary'
          }`}
      >
        {copied ? <><Check className="w-3.5 h-3.5" /> {tr('blog_copied')}</> : <><Link2 className="w-3.5 h-3.5" /> {tr('blog_copy_link')}</>}
      </button>
    </div>
  );
}