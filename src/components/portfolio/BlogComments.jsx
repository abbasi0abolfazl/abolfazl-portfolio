

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { MessageCircle, Send, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { toast } from 'sonner';

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
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ author_name: '', author_email: '', content: '' });
  const [submitted, setSubmitted] = useState(false);

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', slug],
    queryFn: () => db.entities.Comment.filter({ post_slug: slug, published: true }, 'created_date'),
  });

  const mutation = useMutation({
    mutationFn: (data) => db.entities.Comment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', slug] });
      setForm({ author_name: '', author_email: '', content: '' });
      setSubmitted(true);
    },
    onError: () => toast.error('Failed to submit comment. Please try again.'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.author_name.trim() || !form.content.trim()) {
      toast.error('Please fill in your name and comment.');
      return;
    }
    mutation.mutate({ ...form, post_slug: slug, published: false });
  };

  return (
    <section className="mt-14 pt-10 border-t border-border/50">
      <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-primary" />
        Comments
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
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="mb-8">
          {comments.map((c) => <CommentItem key={c.id} comment={c} />)}
        </div>
      )}

      {/* Comment form */}
      {submitted ? (
        <div className="p-5 rounded-xl bg-primary/5 border border-primary/20 text-center">
          <p className="text-primary font-medium mb-1">Thank you for your comment!</p>
          <p className="text-muted-foreground text-sm">It will appear after moderation review.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-3 text-xs text-primary hover:underline"
          >
            Leave another comment
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-xl bg-card/50 border border-border/50">
          <h3 className="text-sm font-medium text-foreground">Leave a Comment</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Name *</label>
              <Input
                value={form.author_name}
                onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))}
                placeholder="Your name"
                className="h-9 text-sm bg-background/60 border-border/50"
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Email (optional, not shown)</label>
              <Input
                type="email"
                value={form.author_email}
                onChange={(e) => setForm((f) => ({ ...f, author_email: e.target.value }))}
                placeholder="your@email.com"
                className="h-9 text-sm bg-background/60 border-border/50"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Comment *</label>
            <Textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="Share your thoughts…"
              className="min-h-[100px] text-sm bg-background/60 border-border/50 resize-none"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Comments are moderated before publishing.</p>
            <Button type="submit" size="sm" disabled={mutation.isPending} className="gap-2">
              <Send className="w-3.5 h-3.5" />
              {mutation.isPending ? 'Submitting…' : 'Submit'}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}