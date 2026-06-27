import React from 'react';
import { Clock, Wrench, MessageSquare, TrendingUp, Eye } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';

const upcomingDemos = [
  { icon: MessageSquare, label: 'Legal Reasoning Chatbot', desc: 'RAG + ChromaDB + LangChain' },
  { icon: TrendingUp, label: 'Algorithmic Trading Bot', desc: 'Backtest engine + live signals' },
  { icon: Eye, label: 'YOLO Object Detector', desc: 'Real-time computer vision demo' },
];

export default function Demos() {
  return (
    <section id="demos" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          title="Live Demos"
          subtitle="Interactive demonstrations of my key projects"
        />

        <AnimatedSection>
          {/* Coming-soon banner */}
          <div className="rounded-2xl border border-primary/20 bg-card/50 overflow-hidden">
            {/* Top status bar */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border/50 bg-primary/5">
              <Wrench className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                 Coming soon
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Live demos are currently under construction
                </p>
              </div>
              <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20">
                Coming Soon
              </span>
            </div>

            {/* Preview cards */}
            <div className="p-6">
              <p className="text-sm text-muted-foreground mb-5">
                More interactive demos are{' '}
                <span className="text-primary font-medium">coming soon</span>
                {' '}— including research insights and additional AI tools.
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                {upcomingDemos.map((demo) => (
                  <div
                    key={demo.label}
                    className="flex flex-col gap-2 p-4 rounded-xl border border-border/40 bg-background/40 opacity-60"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <demo.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{demo.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground/70">{demo.desc}</p>
                    <span className="text-xs text-primary/60 mt-auto">In progress…</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom notice */}
            <div className="flex items-center gap-2 px-6 py-3 border-t border-border/50 bg-muted/20">
              <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground">
                Demos will be available once the backend services are deployed.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
