import React from 'react';
import { Clock, Wrench, MessageSquare, TrendingUp, Eye } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';
import { useLang } from '@/lib/LanguageContext';

export default function Demos() {
  const { tr, lang } = useLang();

  const upcomingDemos = [
    {
      icon: MessageSquare,
      label: lang === 'fa' ? 'دستیار حقوقی و احکام RAG' : 'Legal Reasoning Chatbot',
      desc: lang === 'fa' ? 'RAG + ChromaDB + LangChain' : 'RAG + ChromaDB + LangChain'
    },
    {
      icon: TrendingUp,
      label: lang === 'fa' ? 'موتور معاملات الگوریتمی' : 'Algorithmic Trading Bot',
      desc: lang === 'fa' ? 'بک‌تست انجین + سیگنال‌های زنده' : 'Backtest engine + live signals'
    },
    {
      icon: Eye,
      label: lang === 'fa' ? 'تشخیص الگوی چارت با YOLO' : 'YOLO Chart Detector',
      desc: lang === 'fa' ? 'استنتاج بلادرنگ بینایی ماشین' : 'Real-time computer vision demo'
    },
  ];

  return (
    <section id="demos" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          title={tr('demos_title')}
          subtitle={tr('demos_subtitle')}
        />

        <AnimatedSection>
          {/* Status banner */}
          <div className="rounded-2xl border border-primary/20 bg-card/50 overflow-hidden shadow-sm">
            {/* Top status bar */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border/50 bg-primary/5">
              <Wrench className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {tr('demos_coming_soon_title')}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {tr('demos_coming_soon_desc')}
                </p>
              </div>
              <span className="ms-auto text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20">
                {tr('demos_badge')}
              </span>
            </div>

            {/* Preview cards */}
            <div className="p-6">
              <div className="grid gap-3 sm:grid-cols-3">
                {upcomingDemos.map((demo) => (
                  <div
                    key={demo.label}
                    className="flex flex-col gap-2 p-4 rounded-xl border border-border/40 bg-background/40 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <demo.icon className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">{demo.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground/70">{demo.desc}</p>
                    <span className="text-xs text-primary/70 mt-auto font-mono">
                      {lang === 'fa' ? 'در حال اتصال…' : 'In progress…'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom notice */}
            <div className="flex items-center gap-2 px-6 py-3 border-t border-border/50 bg-muted/20">
              <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground">
                {tr('demos_notice')}
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
