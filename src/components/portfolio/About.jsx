import React from 'react';
import { MapPin, Briefcase, Code2, Cpu, ShieldCheck, Compass, GitMerge, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';
import { getAboutData } from '@/data/aboutData';
import { useLang } from '@/lib/LanguageContext';

// Minimal pixelated AA logo
function PixelLogo() {
  const grid = [
    [0,1,1,0,0,0,1,1,0],
    [1,0,0,1,0,1,0,0,1],
    [1,1,1,1,0,1,1,1,1],
    [1,0,0,1,0,1,0,0,1],
    [1,0,0,1,0,1,0,0,1],
  ];
  return (
    <div className="flex flex-col gap-[3px]" style={{ lineHeight: 0 }}>
      {grid.map((row, ri) => (
        <div key={ri} className="flex gap-[3px]">
          {row.map((cell, ci) => (
            <div
              key={ci}
              className={`w-[6px] h-[6px] rounded-[1px] transition-colors duration-300 ${cell ? 'bg-primary' : 'bg-transparent'}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

const iconMap = {
  Briefcase: Briefcase,
  Code2: Code2,
  Cpu: Cpu,
};

export default function About() {
  const { lang, tr } = useLang();
  const data = getAboutData(lang);

  const manifestoPillars = [
    {
      icon: Compass,
      title: lang === 'fa' ? 'نظم بر دل آشوب داده‌ها' : 'Cosmic Order out of Chaos',
      desc: tr('manifesto_p1'),
    },
    {
      icon: ShieldCheck,
      title: lang === 'fa' ? 'سکوت استراتژیک و اتکا به کد' : 'Strategic Stoicism & OpSec',
      desc: tr('manifesto_p2'),
    },
    {
      icon: Zap,
      title: lang === 'fa' ? 'عاملیت حداکثری و مالکیت نتیجه' : 'Radical Ownership & High-Agency',
      desc: tr('manifesto_p3'),
    },
    {
      icon: GitMerge,
      title: lang === 'fa' ? 'معماری ارتباطات غیرهمگام' : 'Async-First Protocol',
      desc: tr('manifesto_p4'),
    },
  ];

  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-6xl mx-auto space-y-16">
        <SectionHeading title={data.title} subtitle={data.subtitle} />

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Avatar & Verification Monogram */}
          <AnimatedSection className="md:col-span-1 flex flex-col items-center text-center p-6 rounded-2xl glass border border-border/60">
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center mb-6 shadow-inner">
              <PixelLogo />
            </div>
            
            <h3 className="font-bold text-foreground text-lg mb-1">
              {lang === 'fa' ? 'ابوالفضل عباسی' : 'Abolfazl Abbasi'}
            </h3>
            
            <div className="flex items-center gap-2 text-muted-foreground mb-3 text-xs">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>{data.location}</span>
            </div>
            
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 text-xs">
              {data.remoteStatus}
            </Badge>
          </AnimatedSection>

          {/* Narrative & Philosophy */}
          <AnimatedSection delay={0.1} className="md:col-span-2 space-y-6">
            <p className="text-foreground/95 text-base sm:text-lg leading-relaxed font-medium">
              {data.bio}
            </p>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              {data.description}
            </p>

            {/* Core Competencies Badges */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {lang === 'fa' ? 'شایستگی‌های محوری معماری' : 'Core Architectural Capabilities'}
              </span>
              <div className="flex flex-wrap gap-2">
                {data.coreTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-primary/10 text-primary border border-primary/25 hover:bg-primary/20 transition-colors cursor-default text-xs py-1 px-3"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* 4 Pillars of the Manifesto */}
        <AnimatedSection delay={0.2} className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl font-bold text-foreground tracking-tight">
              {tr('about_manifesto_title')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {lang === 'fa'
                ? 'اصول رفتاری و استاندارد خدشه‌ناپذیر کیهان در تحویل سیستم‌های مهندسی'
                : 'Uncompromising operating protocol and execution principles of Keyhan Systems'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {manifestoPillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-card/60 border border-border/60 hover:border-primary/40 transition-all duration-300 space-y-2.5 flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      {p.title}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
