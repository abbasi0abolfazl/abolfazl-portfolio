import React from 'react';
import { Code, Brain, MessageSquare, Database, GitBranch, TrendingUp } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';
import { skillsData } from '@/data/skillsData';

// Mapping icon names to components
const iconMap = {
  Code: Code,
  Brain: Brain,
  MessageSquare: MessageSquare,
  Database: Database,
  GitBranch: GitBranch,
  TrendingUp: TrendingUp,
};

export default function Skills() {
  const { title, subtitle, categories } = skillsData;

  return (
    <section id="skills" className="py-24 px-4 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title={title} subtitle={subtitle} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const IconComponent = iconMap[category.icon];
            return (
              <AnimatedSection key={category.title} delay={index * 0.08}>
                <div className="group p-6 rounded-xl bg-background/60 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                      {IconComponent && <IconComponent className="w-5 h-5" />}
                    </div>
                    <h3 className="font-semibold text-foreground">{category.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 text-sm rounded-full bg-card border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 hover:scale-105 transition-all duration-200 cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}