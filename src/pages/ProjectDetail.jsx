import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, ExternalLink, Download, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { projects } from '@/data/projectsData';
import { useLang } from '@/lib/LanguageContext';

function Section({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-10"
    >
      <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
        <span className="w-1 h-5 rounded-full bg-primary inline-block" />
        {title}
      </h2>
      {children}
    </motion.div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tr } = useLang();
  const project = projects.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBackToProjects = () => {
    navigate('/');
    setTimeout(() => {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (!project) {
    return (
      <main className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Project Not Found</h1>
          <button onClick={handleBackToProjects} className="text-primary hover:underline flex items-center justify-center gap-2 mt-4">
            <ArrowLeft className="w-4 h-4" /> {tr('detail_back')}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 px-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <button
          onClick={handleBackToProjects}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {tr('detail_back')}
        </button>

        {/* Header - تگ type حذف شد */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className={`h-1.5 rounded-full bg-gradient-to-r ${project.color} mb-6`} />
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">{project.year}</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            {project.title}
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">{project.description}</p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-3 mb-12"
        >
          <a href={project.github} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="border-border/50 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all duration-200">
              <Github className="w-4 h-4 mr-1.5" /> {tr('detail_github')}
            </Button>
          </a>
          
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/80 transition-all duration-200">
                <ExternalLink className="w-4 h-4 mr-1.5" /> {tr('detail_demo')}
              </Button>
            </a>
          )}
          
          <Button size="sm" variant="outline" className="border-border/50 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all duration-200">
            <Download className="w-4 h-4 mr-1.5" /> {tr('detail_case_study')}
          </Button>
        </motion.div>

        <div className="h-px bg-border/40 mb-10" />

        {/* Overview */}
        <Section title={tr('detail_overview')}>
          <p className="text-muted-foreground leading-relaxed">{project.overview}</p>
        </Section>

        {/* My Role */}
        <Section title={tr('detail_role')}>
          <p className="text-muted-foreground leading-relaxed">{project.role}</p>
        </Section>

        {/* Technologies */}
        <Section title={tr('detail_tech')}>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-card border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors">
                {tag}
              </Badge>
            ))}
          </div>
        </Section>

        {/* Challenge */}
        <Section title={tr('detail_challenge')}>
          <p className="text-muted-foreground leading-relaxed">{project.challenge}</p>
        </Section>

        {/* Solution */}
        <Section title={tr('detail_solution')}>
          <p className="text-muted-foreground leading-relaxed">{project.solution}</p>
        </Section>

        {/* Results */}
        <Section title={tr('detail_results')}>
          <ul className="space-y-2">
            {project.results.map((r, i) => (
              <li key={i} className="flex items-start gap-2.5 text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </Section>

        {/* Code Snippet */}
        <Section title={tr('detail_snippet')}>
          <pre className="bg-card border border-border/50 rounded-xl p-5 overflow-x-auto text-sm font-mono text-muted-foreground leading-relaxed">
            <code>{project.codeSnippet}</code>
          </pre>
        </Section>

        {/* Lessons */}
        <Section title={tr('detail_lessons')}>
          <p className="text-muted-foreground leading-relaxed italic border-l-2 border-primary/40 pl-4">
            {project.lessons}
          </p>
        </Section>

        {/* Footer nav */}
        <div className="pt-8 border-t border-border/50 flex items-center justify-between">
          <button onClick={handleBackToProjects} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> {tr('detail_back')}
          </button>
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary/70 transition-colors flex items-center gap-1.5">
              <Github className="w-4 h-4" /> GitHub
            </a>
          )}
        </div>
      </div>
    </main>
  );
}