import React from 'react';
import { Github, GitFork, Star } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';

const languages = [
  { name: 'Python', percentage: 60, color: '#3776AB', bgColor: 'bg-[#3776AB]' },
  { name: 'Jupyter', percentage: 20, color: '#F37626', bgColor: 'bg-[#F37626]' },
  { name: 'JavaScript', percentage: 15, color: '#F7DF1E', bgColor: 'bg-[#F7DF1E]' },
  { name: 'Other', percentage: 5, color: '#6B7280', bgColor: 'bg-[#6B7280]' },
];

export default function GitHubStats() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeading title="GitHub Activity" subtitle="My open source contributions and projects" />

        <AnimatedSection>
          <div className="p-8 rounded-xl bg-card/50 border border-border/50">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
              <a
                href="https://github.com/abbasi0abolfazl"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
              >
                <Github className="w-8 h-8" />
                <div>
                  <div className="font-semibold text-lg">abbasi0abolfazl</div>
                  <div className="text-sm text-muted-foreground">github.com/abbasi0abolfazl</div>
                </div>
              </a>
              <div className="flex gap-6 sm:ml-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">15+</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <GitFork className="w-3 h-3" /> Repos
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">500+</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Star className="w-3 h-3" /> Contributions
                  </div>
                </div>
              </div>
            </div>

            <h4 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Language Distribution</h4>
            <div className="space-y-4">
              {languages.map((lang) => (
                <div key={lang.name} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-24">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: lang.color }}
                    />
                    <span className="text-sm text-foreground">{lang.name}</span>
                  </div>
                  <div className="flex-1 h-3 rounded-full bg-muted/30 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${lang.bgColor}`}
                      style={{ width: `${lang.percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-sm text-muted-foreground text-right">{lang.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}