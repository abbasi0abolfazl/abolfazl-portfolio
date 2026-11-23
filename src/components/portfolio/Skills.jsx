import React from 'react';
import { Code, Brain, Database, GitBranch, TrendingUp, Eye, Globe } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';
import { getSkillsData } from '@/data/skillsData';
import { useLang } from '@/lib/LanguageContext';

const iconMap = {
  Code,
  Brain,
  Database,
  GitBranch,
  TrendingUp,
  Eye,
  Globe,
};

export default function Skills() {
  const { lang } = useLang();
  const { title, subtitle, categories } = getSkillsData(lang);

  return (
    <section id="skills" className="py-24 px-4 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title={title} subtitle={subtitle} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const IconComponent = iconMap[category.icon];
            return (
              <AnimatedSection key={category.title} delay={index * 0.08}>
                <div className="group p-6 rounded-xl bg-background/60 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors shrink-0">
                      {IconComponent && <IconComponent className="w-5 h-5" />}
                    </div>
                    <h3 className="font-semibold text-foreground text-sm sm:text-base leading-snug">
                      {category.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 text-xs sm:text-sm rounded-full bg-card border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 hover:scale-105 transition-all duration-200 cursor-default"
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
