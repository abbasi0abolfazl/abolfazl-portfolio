import React from 'react';
import { MapPin, Briefcase, Code2, Cpu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';

const stats = [
  { label: 'Years Exp', value: '3+', icon: Briefcase },
  { label: 'Projects', value: '15+', icon: Code2 },
  { label: 'Technologies', value: '8+', icon: Cpu },
];

const coreTags = [
  'Python', 'LLMs', 'NLP', 'RAG', 'BERT', 'HuggingFace',
  'LangChain', 'Computer Vision', 'Trading Bots', 'MongoDB'
];

export default function About() {
  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title="About Me" subtitle="Passionate about building intelligent systems" />

        <div className="grid md:grid-cols-3 gap-8">
          {/* Avatar & Info */}
          <AnimatedSection className="md:col-span-1 flex flex-col items-center">
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center mb-6">
              <span className="text-5xl font-bold gradient-text">AA</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Qom, Iran</span>
            </div>
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20">
              Open to Remote
            </Badge>
          </AnimatedSection>

          {/* Bio & Stats */}
          <AnimatedSection delay={0.1} className="md:col-span-2">
            <p className="text-foreground/90 text-lg leading-relaxed mb-6">
              AI Engineer specializing in Natural Language Processing and Large Language Model systems. 
              With 3+ years of experience building production-grade intelligent systems, I focus on 
              creating practical AI solutions — from legal document assistants using RAG to real-time 
              algorithmic trading bots with computer vision.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              I combine deep technical expertise in Python, transformer models, and modern ML pipelines 
              with a practical approach to solving real-world problems. Currently exploring the 
              intersection of financial markets and AI-driven automation.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
                  <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
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