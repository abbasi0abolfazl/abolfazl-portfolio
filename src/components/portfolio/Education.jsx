import React from 'react';
import { GraduationCap, Calendar } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';

const education = [
  {
    degree: 'B.S. Software Engineering',
    school: 'Technical Vocational College of Qom',
    period: '2024 – Present',
  },
  {
    degree: 'Associate Software Engineering',
    school: 'Technical Vocational College of Qom',
    period: '2022 – 2024',
  },
];

export default function Education() {
  return (
    <section id="education" className="py-24 px-4 bg-card/30">
      <div className="max-w-4xl mx-auto">
        <SectionHeading title="Education" subtitle="My academic background" />

        <div className="grid sm:grid-cols-2 gap-6">
          {education.map((edu, index) => (
            <AnimatedSection key={edu.degree} delay={index * 0.1}>
              <div className="p-6 rounded-xl bg-background/60 border border-border/50 hover:border-primary/20 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{edu.degree}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{edu.school}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 text-primary" />
                      {edu.period}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}