

import React, { useState, useRef } from 'react';

import { Download, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function BackupManager() {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState(null); // 'success' | 'error' | null
  const [importMsg, setImportMsg] = useState('');
  const fileRef = useRef();

  const handleExport = async () => {
    setExporting(true);
    const [posts, comments, messages, settings] = await Promise.all([
      db.entities.BlogPost.list(),
      db.entities.Comment.list(),
      db.entities.ContactMessage.list(),
      db.entities.SiteSettings.list(),
    ]);
    const backup = {
      exported_at: new Date().toISOString(),
      version: 1,
      data: { blog_posts: posts, comments, contact_messages: messages, site_settings: settings },
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportStatus(null);
    const text = await file.text();
    const backup = JSON.parse(text);
    const { data } = backup;
    let created = 0;
    if (data.blog_posts?.length) {
      for (const p of data.blog_posts) {
        const { id, created_date, updated_date, created_by, ...rest } = p;
        await db.entities.BlogPost.create(rest);
        created++;
      }
    }
    if (data.comments?.length) {
      for (const c of data.comments) {
        const { id, created_date, updated_date, created_by, ...rest } = c;
        await db.entities.Comment.create(rest);
        created++;
      }
    }
    if (data.site_settings?.length) {
      for (const s of data.site_settings) {
        const { id, created_date, updated_date, created_by, ...rest } = s;
        await db.entities.SiteSettings.create(rest);
        created++;
      }
    }
    setImporting(false);
    setImportStatus('success');
    setImportMsg(`Restored ${created} records successfully.`);
    e.target.value = '';
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-foreground mb-6">Backup & Restore</h2>

      {/* Export */}
      <div className="p-5 rounded-2xl bg-card/60 border border-border/50 mb-4">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Download className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">Export Backup</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Download all blog posts, comments, contact messages, and site settings as a single JSON file.
            </p>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {exporting ? 'Exporting…' : 'Download Backup'}
            </button>
          </div>
        </div>
      </div>

      {/* Import */}
      <div className="p-5 rounded-2xl bg-card/60 border border-border/50">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10">
            <Upload className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">Restore from Backup</h3>
            <p className="text-sm text-muted-foreground mb-1">
              Upload a previously downloaded JSON backup file. This <strong className="text-foreground">appends</strong> records — it does not delete existing data.
            </p>
            <p className="text-xs text-amber-400 mb-4">⚠ Restoring may create duplicate entries if records already exist.</p>

            <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={importing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-500/30 text-amber-400 text-sm font-medium hover:bg-amber-500/10 transition-colors disabled:opacity-60"
            >
              {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {importing ? 'Restoring…' : 'Choose Backup File'}
            </button>

            {importStatus && (
              <div className={`mt-3 flex items-center gap-2 text-sm px-3 py-2 rounded-lg
                ${importStatus === 'success'
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-destructive/10 text-destructive border border-destructive/20'
                }`}>
                {importStatus === 'success'
                  ? <CheckCircle className="w-4 h-4" />
                  : <AlertCircle className="w-4 h-4" />}
                {importMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}