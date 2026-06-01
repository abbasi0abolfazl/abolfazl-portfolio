

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Save, Check } from 'lucide-react';

const FIELDS = [
  { section: 'Contact Information', fields: [
    { key: 'email', label: 'Email', placeholder: 'you@example.com', type: 'text' },
    { key: 'phone', label: 'Phone', placeholder: '+1 234 567 8900', type: 'text' },
    { key: 'location', label: 'Location', placeholder: 'Tehran, Iran', type: 'text' },
  ]},
  { section: 'Social Links', fields: [
    { key: 'github_url', label: 'GitHub URL', placeholder: 'https://github.com/…', type: 'text' },
    { key: 'linkedin_url', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/…', type: 'text' },
  ]},
  { section: 'Site Text', fields: [
    { key: 'about_me', label: 'About Me', placeholder: 'Write a paragraph about yourself…', type: 'textarea' },
    { key: 'short_bio', label: 'Short Bio', placeholder: 'One-line headline bio…', type: 'text' },
  ]},
];

export default function SiteSettingsManager() {
  const qc = useQueryClient();
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);
  const [existingId, setExistingId] = useState(null);

  const { data = [] } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => db.entities.SiteSettings.filter({ key: 'main' }),
  });

  useEffect(() => {
    if (data[0]) {
      setExistingId(data[0].id);
      const { id, created_date, updated_date, created_by, key, ...rest } = data[0];
      setForm(rest);
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: () => existingId
      ? db.entities.SiteSettings.update(existingId, { key: 'main', ...form })
      : db.entities.SiteSettings.create({ key: 'main', ...form }),
    onSuccess: (result) => {
      if (!existingId) setExistingId(result.id);
      qc.invalidateQueries({ queryKey: ['site-settings'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Site Settings</h2>
        <button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
            ${saved
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
        >
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>

      <div className="space-y-8">
        {FIELDS.map(({ section, fields }) => (
          <div key={section}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{section}</h3>
            <div className="space-y-4 p-4 rounded-xl bg-card/60 border border-border/50">
              {fields.map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
                  {type === 'textarea' ? (
                    <textarea
                      value={form[key] || ''}
                      onChange={(e) => set(key, e.target.value)}
                      placeholder={placeholder}
                      rows={4}
                      className="w-full px-3 py-2.5 rounded-xl border border-border/50 bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                    />
                  ) : (
                    <input
                      value={form[key] || ''}
                      onChange={(e) => set(key, e.target.value)}
                      placeholder={placeholder}
                      className="w-full px-3 py-2.5 rounded-xl border border-border/50 bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}