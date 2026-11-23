import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { getComments, addComment } from '@/lib/localBlogService';
import { useLang } from '@/lib/LanguageContext';

function CommentItem({ comment }) {
  return (
    <div className="flex gap-3 py-4 border-b border-border/30 last:border-0">
      <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
        <User className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-sm font-medium text-foreground">{comment.author_name}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {format(new Date(comment.created_date), 'MMM d, yyyy')}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{comment.content}</p>
      </div>
    </div>
  );
}

export default function BlogComments({ slug }) {
  const { tr, lang } = useLang();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ author_name: '', author_email: '', content: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadComments = () => {
      const loadedComments = getComments(slug);
      setComments(loadedComments);
      setIsLoading(false);
    };
    loadComments();
  }, [slug]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.author_name.trim() || !form.content.trim()) {
      toast.error(lang === 'fa' ? 'لطفاً نام و متن نظر خود را وارد کنید.' : 'Please fill in your name and comment.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      addComment(slug, form);
      setForm({ author_name: '', author_email: '', content: '' });
      setSubmitted(true);
      const updatedComments = getComments(slug);
      setComments(updatedComments);
      toast.success(lang === 'fa' ? 'دیدگاه شما با موفقیت ثبت شد!' : 'Comment submitted successfully!');
    } catch {
      toast.error(lang === 'fa' ? 'خطا در ثبت دیدگاه' : 'Failed to submit comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-14 pt-10 border-t border-border/50">
      <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-primary" />
        {tr('blog_comments')}
        {comments.length > 0 && (
          <span className="text-sm font-normal text-muted-foreground">({comments.length})</span>
        )}
      </h2>

      {/* Comment list */}
      {isLoading ? (
        <div className="space-y-3 mb-8">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3 py-4">
              <div className="w-9 h-9 rounded-full shimmer shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 shimmer rounded" />
                <div className="h-3 w-full shimmer rounded" />
                <div className="h-3 w-2/3 shimmer rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-muted-foreground text-sm mb-8 py-4">
          {tr('blog_comments_none')}
        </p>
      ) : (
        <div className="mb-8">
          {comments.map((c) => <CommentItem key={c.id} comment={c} />)}
        </div>
      )}

      {/* Comment form */}
      {submitted ? (
        <div className="p-5 rounded-xl bg-primary/5 border border-primary/20 text-center">
          <p className="text-primary font-medium mb-1">
            {lang === 'fa' ? 'سپاس از ارسال دیدگاه شما!' : 'Thank you for your comment!'}
          </p>
          <p className="text-muted-foreground text-sm">
            {lang === 'fa' ? 'دیدگاه شما ثبت گردید.' : 'Your comment has been recorded.'}
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-3 text-xs text-primary hover:underline"
          >
            {lang === 'fa' ? 'ارسال دیدگاه دیگر' : 'Leave another comment'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-xl bg-card/50 border border-border/50">
          <h3 className="text-sm font-medium text-foreground">
            {lang === 'fa' ? 'ثبت دیدگاه جدید' : 'Leave a Comment'}
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                {lang === 'fa' ? 'نام *' : 'Name *'}
              </label>
              <Input
                value={form.author_name}
                onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))}
                placeholder={lang === 'fa' ? 'نام شما' : 'Your name'}
                className="h-9 text-sm bg-background/60 border-border/50"
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                {lang === 'fa' ? 'ایمیل (اختیاری، نمایش داده نمی‌شود)' : 'Email (optional, not shown)'}
              </label>
              <Input
                type="email"
                value={form.author_email}
                onChange={(e) => setForm((f) => ({ ...f, author_email: e.target.value }))}
                placeholder="your@email.com"
                className="h-9 text-sm bg-background/60 border-border/50 font-mono"
                dir="ltr"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {lang === 'fa' ? 'متن نظر *' : 'Comment *'}
            </label>
            <Textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder={lang === 'fa' ? 'دیدگاه، پرسش یا تحلیل خود را بنویسید…' : 'Share your thoughts…'}
              className="min-h-[100px] text-sm bg-background/60 border-border/50 resize-none"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {lang === 'fa' ? 'دیدگاه‌ها پس از تایید نمایش داده می‌شوند.' : 'Comments are reviewed before publishing.'}
            </p>
            <Button type="submit" size="sm" disabled={isSubmitting} className="gap-2">
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? (lang === 'fa' ? 'در حال ارسال…' : 'Submitting…') : (lang === 'fa' ? 'ارسال نظر' : 'Submit')}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
