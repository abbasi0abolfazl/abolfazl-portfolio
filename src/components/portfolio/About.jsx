import React from 'react';
import { MapPin, Briefcase, Code2, Cpu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';
import { aboutData } from '@/data/aboutData';

// Mapping icon names to components
const iconMap = {
  Briefcase: Briefcase,
  Code2: Code2,
  Cpu: Cpu,
};

export default function About() {
  const { title, subtitle, avatar, location, remoteStatus, bio, description, stats, coreTags } = aboutData;

  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title={title} subtitle={subtitle} />

        <div className="grid md:grid-cols-3 gap-8">
          {/* Avatar & Info */}
          <AnimatedSection className="md:col-span-1 flex flex-col items-center">
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center mb-6">
              <span className="text-5xl font-bold gradient-text">{avatar}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{location}</span>
            </div>
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20">
              {remoteStatus}
            </Badge>
          </AnimatedSection>

          {/* Bio & Stats */}
          <AnimatedSection delay={0.1} className="md:col-span-2">
            <p className="text-foreground/90 text-lg leading-relaxed mb-6">
              {bio}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {stats.map((stat) => {
                const IconComponent = iconMap[stat.icon];
                return (
                  <div key={stat.label} className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
                    {IconComponent && <IconComponent className="w-5 h-5 text-primary mx-auto mb-2" />}
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {coreTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-primary/5 text-primary border border-primary/20 hover:bg-primary/10 transition-colors cursor-default"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}