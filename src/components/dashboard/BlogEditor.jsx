

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function BlogEditor({ post, onSave, onCancel }) {
  const isNew = !post?.id;
  const [form, setForm] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    cover_image: post?.cover_image || '',
    tags: post?.tags?.join(', ') || '',
    published: post?.published ?? false,
  });
  const [preview, setPreview] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const autoSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const save = useMutation({
    mutationFn: () => {
      const data = {
        ...form,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };
      return isNew
        ? db.entities.BlogPost.create(data)
        : db.entities.BlogPost.update(post.id, data);
    },
    onSuccess: onSave,
  });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-xl font-bold text-foreground flex-1">{isNew ? 'New Post' : 'Edit Post'}</h2>
        <button
          onClick={() => setPreview((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {preview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {preview ? 'Edit' : 'Preview'}
        </button>
        <button
          onClick={() => save.mutate()}
          disabled={save.isPending || !form.title || !form.slug}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          {save.isPending ? 'Saving…' : 'Save'}
        </button>
      </div>

      {preview ? (
        <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert
          prose-headings:text-foreground prose-p:text-muted-foreground
          prose-a:text-primary prose-strong:text-foreground
          prose-code:text-primary prose-code:bg-card prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-card prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl">
          <h1>{form.title || 'Untitled'}</h1>
          <ReactMarkdown>{form.content || '*No content yet…*'}</ReactMarkdown>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main fields */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Title *</label>
              <input
                value={form.title}
                onChange={(e) => { set('title', e.target.value); if (!post?.id) set('slug', autoSlug(e.target.value)); }}
                placeholder="Post title"
                className="w-full px-3 py-2.5 rounded-xl border border-border/50 bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => set('excerpt', e.target.value)}
                placeholder="Short summary shown in the blog list"
                rows={2}
                className="w-full px-3 py-2.5 rounded-xl border border-border/50 bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Content (Markdown) *</label>
              <textarea
                value={form.content}
                onChange={(e) => set('content', e.target.value)}
                placeholder="Write your post in Markdown…"
                rows={20}
                className="w-full px-3 py-2.5 rounded-xl border border-border/50 bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y font-mono"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Slug *</label>
              <input
                value={form.slug}
                onChange={(e) => set('slug', e.target.value)}
                placeholder="url-slug"
                className="w-full px-3 py-2.5 rounded-xl border border-border/50 bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Tags (comma separated)</label>
              <input
                value={form.tags}
                onChange={(e) => set('tags', e.target.value)}
                placeholder="NLP, Python, LLM"
                className="w-full px-3 py-2.5 rounded-xl border border-border/50 bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Cover Image URL</label>
              <input
                value={form.cover_image}
                onChange={(e) => set('cover_image', e.target.value)}
                placeholder="https://…"
                className="w-full px-3 py-2.5 rounded-xl border border-border/50 bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card cursor-pointer hover:border-primary/30 transition-colors">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => set('published', e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <div>
                <p className="text-sm font-medium text-foreground">Published</p>
                <p className="text-xs text-muted-foreground">Visible to all visitors</p>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}