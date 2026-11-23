import React from 'react';
import { GraduationCap, Calendar } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';
import { useLang } from '@/lib/LanguageContext';

export default function Education() {
  const { tr, lang } = useLang();

  const education = [
    {
      degree: lang === 'fa' ? 'کارشناسی مهندسی تکنولوژی نرم‌افزار' : 'B.S. Software Engineering',
      school: lang === 'fa' ? 'دانشکده فنی و حرفه‌ای قم (دانشگاه ملی مهارت)' : 'Technical Vocational College of Qom',
      period: lang === 'fa' ? '۱۴۰۳ – شهریور ۱۴۰۵' : '2024 – Sep 2026',
    },
    {
      degree: lang === 'fa' ? 'کاردانی پیوسته مهندسی نرم‌افزار کامپیوتر' : 'A.S. Software Engineering',
      school: lang === 'fa' ? 'دانشکده فنی و حرفه‌ای قم (دانشگاه ملی مهارت)' : 'Technical Vocational College of Qom',
      period: lang === 'fa' ? '۱۴۰۱ – ۱۴۰۳' : '2022 – 2024',
    },
  ];

  return (
    <section id="education" className="py-24 px-4 bg-card/30">
      <div className="max-w-4xl mx-auto">
        <SectionHeading title={tr('education_title')} subtitle={tr('education_subtitle')} />

        <div className="grid sm:grid-cols-2 gap-6">
          {education.map((edu, index) => (
            <AnimatedSection key={edu.degree} delay={index * 0.1}>
              <div className="p-6 rounded-xl bg-background/60 border border-border/50 hover:border-primary/20 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1 text-base">{edu.degree}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{edu.school}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{edu.period}</span>
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
