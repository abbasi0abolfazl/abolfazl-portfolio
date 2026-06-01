

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Eye, FileText, MessageSquare, Monitor, TrendingUp, Users } from 'lucide-react';
import AnimatedSection from '../components/portfolio/AnimatedSection';
import SectionHeading from '../components/portfolio/SectionHeading';

const mockPageViews = [
  { day: 'Mon', views: 42 }, { day: 'Tue', views: 78 }, { day: 'Wed', views: 55 },
  { day: 'Thu', views: 91 }, { day: 'Fri', views: 63 }, { day: 'Sat', views: 34 },
  { day: 'Sun', views: 28 },
];

const mockTopProjects = [
  { name: 'Legal Chatbot', views: 312 },
  { name: 'Forex Bot', views: 271 },
  { name: 'YOLOv8 Detector', views: 198 },
  { name: 'Sentiment AI', views: 154 },
  { name: 'E-Commerce Bot', views: 132 },
];

const mockDevices = [
  { name: 'Desktop', value: 58 },
  { name: 'Mobile', value: 35 },
  { name: 'Tablet', value: 7 },
];

const COLORS = ['hsl(38,92%,50%)', 'hsl(217,33%,50%)', 'hsl(160,60%,45%)'];

const tooltipStyle = {
  contentStyle: {
    background: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    fontSize: 12,
  },
  labelStyle: { color: 'hsl(var(--foreground))' },
};

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="p-5 rounded-xl bg-card/60 border border-border/50">
      <div className="p-2 rounded-lg bg-primary/10 w-fit mb-3">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      {sub && <p className="text-xs text-primary mt-1">{sub}</p>}
    </div>
  );
}

function PublishButton({ comment }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const publish = async () => {
    setLoading(true);
    await db.entities.Comment.update(comment.id, { published: true });
    queryClient.invalidateQueries({ queryKey: ['comments-analytics'] });
    queryClient.invalidateQueries({ queryKey: ['comments', comment.post_slug] });
    setLoading(false);
  };

  return (
    <button
      onClick={publish}
      disabled={loading}
      className="shrink-0 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
    >
      {loading ? '…' : 'Approve'}
    </button>
  );
}

export default function Analytics() {
  const { data: posts = [] } = useQuery({
    queryKey: ['blog-posts-analytics'],
    queryFn: () => db.entities.BlogPost.list(),
  });
  const { data: messages = [] } = useQuery({
    queryKey: ['messages-analytics'],
    queryFn: () => db.entities.ContactMessage.list(),
  });
  const { data: comments = [] } = useQuery({
    queryKey: ['comments-analytics'],
    queryFn: () => db.entities.Comment.list(),
  });

  const totalViews = mockPageViews.reduce((s, d) => s + d.views, 0);
  const topPosts = posts
    .slice(0, 5)
    .map((p, i) => ({ name: (p.title || '').substring(0, 22) + '…', views: 200 - i * 35 }));
  const pendingComments = comments.filter((c) => !c.published);

  return (
    <main className="pt-24 pb-16 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title="Analytics Dashboard" subtitle="Private overview of portfolio engagement" />

        {/* Stat cards */}
        <AnimatedSection className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Eye} label="Page Views (7d)" value={totalViews} sub="+12% vs last week" />
          <StatCard icon={FileText} label="Blog Posts" value={posts.length} sub={`${posts.filter((p) => p.published).length} published`} />
          <StatCard icon={MessageSquare} label="Comments" value={comments.length} sub={`${pendingComments.length} pending`} />
          <StatCard icon={Users} label="Contact Messages" value={messages.length} sub={`${messages.filter((m) => !m.read).length} unread`} />
        </AnimatedSection>

        {/* Charts row 1 */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <AnimatedSection delay={0.1} className="p-5 rounded-xl bg-card/60 border border-border/50">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Page Views (7 Days)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={mockPageViews}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="views" stroke="hsl(38,92%,50%)" strokeWidth={2} dot={{ fill: 'hsl(38,92%,50%)', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </AnimatedSection>

          <AnimatedSection delay={0.15} className="p-5 rounded-xl bg-card/60 border border-border/50">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-primary" /> Device Breakdown
            </h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={mockDevices} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {mockDevices.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {mockDevices.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="text-xs text-muted-foreground">{d.name}</span>
                    <span className="text-xs font-semibold text-foreground pl-3">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Charts row 2 */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <AnimatedSection delay={0.2} className="p-5 rounded-xl bg-card/60 border border-border/50">
            <h3 className="text-sm font-semibold text-foreground mb-4">Top Projects by Views</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mockTopProjects} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={100} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="views" fill="hsl(38,92%,50%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </AnimatedSection>

          <AnimatedSection delay={0.25} className="p-5 rounded-xl bg-card/60 border border-border/50">
            <h3 className="text-sm font-semibold text-foreground mb-4">Top Blog Posts by Views</h3>
            {topPosts.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={topPosts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={120} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="views" fill="hsl(160,60%,45%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                No blog posts yet
              </div>
            )}
          </AnimatedSection>
        </div>

        {/* Pending moderation */}
        {pendingComments.length > 0 && (
          <AnimatedSection delay={0.3} className="p-5 rounded-xl bg-card/60 border border-border/50">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Pending Moderation
              <span className="ml-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                {pendingComments.length}
              </span>
            </h3>
            <div className="space-y-3">
              {pendingComments.slice(0, 8).map((c) => (
                <div key={c.id} className="flex items-start justify-between gap-4 p-3 rounded-lg bg-background/50 border border-border/30">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{c.author_name}</span>
                      <span className="text-xs text-muted-foreground">on <em>{c.post_slug}</em></span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{c.content}</p>
                  </div>
                  <PublishButton comment={c} />
                </div>
              ))}
            </div>
          </AnimatedSection>
        )}
      </div>
    </main>
  );
}