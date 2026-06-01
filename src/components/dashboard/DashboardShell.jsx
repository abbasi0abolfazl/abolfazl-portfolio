import React, { useState } from 'react';
import { FileText, MessageSquare, LogOut, LayoutDashboard, Settings, Database } from 'lucide-react';
import BlogManager from './BlogManager';
import CommentManager from './CommentManager';
import SiteSettingsManager from './SiteSettingsManager';
import BackupManager from './BackupManager';

const tabs = [
  { id: 'blog', label: 'Blog Posts', icon: FileText },
  { id: 'comments', label: 'Comments', icon: MessageSquare },
  { id: 'settings', label: 'Site Settings', icon: Settings },
  { id: 'backup', label: 'Backup', icon: Database },
];

export default function DashboardShell({ onLogout }) {
  const [activeTab, setActiveTab] = useState('blog');

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border/50 bg-card/60 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground hidden sm:inline">CMS Dashboard</span>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-destructive text-sm transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'blog' && <BlogManager />}
        {activeTab === 'comments' && <CommentManager />}
        {activeTab === 'settings' && <SiteSettingsManager />}
        {activeTab === 'backup' && <BackupManager />}
      </div>
    </div>
  );
}