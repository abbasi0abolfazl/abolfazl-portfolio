import React from 'react';
import { Building2, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';
import { getExperienceData } from '@/data/experienceData';
import { useLang } from '@/lib/LanguageContext';

export default function Experience() {
  const { lang } = useLang();
  const { title, subtitle, experiences } = getExperienceData(lang);

  return (
    <section id="experience" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeading title={title} subtitle={subtitle} />

        <div className="relative">
          {/* Timeline line using logical start */}
          <div className="absolute start-4 md:start-8 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <AnimatedSection key={exp.company} delay={index * 0.1}>
                <div className="relative ps-12 md:ps-20">
                  {/* Timeline dot using logical start */}
                  <div className="absolute start-2.5 md:start-6.5 top-2 w-3 h-3 rounded-full bg-primary border-4 border-background animate-pulse-glow" />

                  <div className="p-6 rounded-xl bg-card/50 border border-border/50 hover:border-primary/20 transition-all duration-300 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="w-4 h-4 text-primary shrink-0" />
                          <h3 className="font-semibold text-foreground text-base sm:text-lg">{exp.company}</h3>
                        </div>
                        <p className="text-primary font-medium text-sm sm:text-base">{exp.role}</p>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                        {exp.type}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{exp.period}</span>
                    </div>

                    <ul className="space-y-2 pt-1">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
