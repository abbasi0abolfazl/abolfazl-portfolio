

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { CheckCircle, XCircle, Trash2, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function CommentManager() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState('pending'); // 'all' | 'pending' | 'approved'

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['dashboard-comments'],
    queryFn: () => db.entities.Comment.list('-created_date', 100),
  });

  const approve = useMutation({
    mutationFn: (id) => db.entities.Comment.update(id, { published: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dashboard-comments'] }),
  });

  const reject = useMutation({
    mutationFn: (id) => db.entities.Comment.update(id, { published: false }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dashboard-comments'] }),
  });

  const remove = useMutation({
    mutationFn: (id) => db.entities.Comment.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dashboard-comments'] }),
  });

  const filtered = comments.filter((c) => {
    if (filter === 'pending') return !c.published;
    if (filter === 'approved') return c.published;
    return true;
  });

  const pendingCount = comments.filter((c) => !c.published).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">
          Comments
          {pendingCount > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {pendingCount} pending
            </span>
          )}
        </h2>
        <div className="flex items-center gap-1 p-1 rounded-xl bg-card border border-border/50">
          {['all', 'pending', 'approved'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors
                ${filter === f ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 shimmer rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          No {filter === 'all' ? '' : filter} comments.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div key={c.id} className="flex gap-4 p-4 rounded-xl bg-card/60 border border-border/50 hover:border-primary/20 transition-colors">
              {/* Avatar */}
              <div className="shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {(c.author_name || '?')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm text-foreground">{c.author_name}</span>
                  <span className="text-xs text-muted-foreground">on <em className="text-primary not-italic">{c.post_slug}</em></span>
                  {c.created_date && (
                    <span className="text-xs text-muted-foreground">
                      · {formatDistanceToNow(new Date(c.created_date), { addSuffix: true })}
                    </span>
                  )}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium
                    ${c.published
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                    {c.published ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.content}</p>
              </div>
              <div className="flex items-start gap-1 shrink-0">
                {!c.published && (
                  <button
                    onClick={() => approve.mutate(c.id)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-green-400 hover:bg-green-500/5 transition-colors"
                    title="Approve"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                {c.published && (
                  <button
                    onClick={() => reject.mutate(c.id)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-amber-400 hover:bg-amber-500/5 transition-colors"
                    title="Unpublish"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => remove.mutate(c.id)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}