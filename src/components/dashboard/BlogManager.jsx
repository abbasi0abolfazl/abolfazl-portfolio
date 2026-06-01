

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Plus, Pencil, Trash2, Eye, EyeOff, Search, X } from 'lucide-react';
import { format } from 'date-fns';
import BlogEditor from './BlogEditor';

export default function BlogManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null); // null = list, {} = new, post = edit
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['dashboard-posts'],
    queryFn: () => db.entities.BlogPost.list('-created_date'),
  });

  const togglePublish = useMutation({
    mutationFn: ({ id, published }) => db.entities.BlogPost.update(id, { published }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dashboard-posts'] }),
  });

  const deletePost = useMutation({
    mutationFn: (id) => db.entities.BlogPost.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['dashboard-posts'] }); setDeleteId(null); },
  });

  if (editing !== null) {
    return (
      <BlogEditor
        post={editing}
        onSave={() => { qc.invalidateQueries({ queryKey: ['dashboard-posts'] }); setEditing(null); }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  const filtered = posts.filter((p) =>
    !search || p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Blog Posts</h2>
        <button
          onClick={() => setEditing({})}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts…"
          className="w-full pl-9 pr-8 py-2 rounded-xl border border-border/50 bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 shimmer rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          {search ? 'No posts match your search.' : 'No posts yet. Create your first one!'}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((post) => (
            <div key={post.id} className="flex items-center gap-4 p-4 rounded-xl bg-card/60 border border-border/50 hover:border-primary/20 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground truncate">{post.title}</span>
                  <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium border
                    ${post.published
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-muted text-muted-foreground border-border/50'
                    }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {post.created_date ? format(new Date(post.created_date), 'MMM d, yyyy') : '—'}
                  {post.tags?.length > 0 && ` · ${post.tags.slice(0, 3).join(', ')}`}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => togglePublish.mutate({ id: post.id, published: !post.published })}
                  className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                  title={post.published ? 'Unpublish' : 'Publish'}
                >
                  {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setEditing(post)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(post.id)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-card border border-border/50 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-semibold text-foreground mb-2">Delete Post?</h3>
            <p className="text-sm text-muted-foreground mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 rounded-xl border border-border/50 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deletePost.mutate(deleteId)}
                className="flex-1 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}