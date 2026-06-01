import React from 'react';
import { Github, GitFork, Star } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';

const languages = [
  { name: 'Python', percentage: 60, color: 'bg-blue-500' },
  { name: 'Jupyter', percentage: 20, color: 'bg-amber-500' },
  { name: 'JavaScript', percentage: 15, color: 'bg-yellow-400' },
  { name: 'Other', percentage: 5, color: 'bg-gray-500' },
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
                  <span className="w-20 text-sm text-foreground">{lang.name}</span>
                  <div className="flex-1 h-3 rounded-full bg-background/60 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${lang.color} transition-all duration-1000`}
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