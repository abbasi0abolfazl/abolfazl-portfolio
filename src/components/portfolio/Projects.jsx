import React from 'react';
import { Link } from 'react-router-dom';
import { Github, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';
import { projects } from '@/data/projectsData';
import { useLang } from '@/lib/LanguageContext';

export default function Projects() {
  const { tr } = useLang();
  
  // فقط پروژه‌های featured را نشان بده
  const featuredProjects = projects.filter(p => p.featured !== false);

  return (
    <section id="projects" className="py-24 px-4 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title={tr('projects_title')} subtitle={tr('projects_subtitle')} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="group h-full flex flex-col rounded-xl bg-background/60 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 overflow-hidden">
                <div className={`h-1.5 bg-gradient-to-r ${project.color}`} />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors leading-snug pr-2">
                      {project.title}
                    </h3>
                    <Badge variant="secondary" className="text-[10px] shrink-0 bg-muted text-muted-foreground border-border/50">
                      {project.year}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 flex-1 leading-relaxed">
                    {project.description}
                  </p>

                  {/* تگ‌های معمولی */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 text-sm rounded-full bg-card border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 hover:scale-105 transition-all duration-200 cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 flex-wrap items-center justify-between">
                    <div className="flex gap-2">
                      {/* دکمه Code - GitHub با hover رنگی مناسب */}
                      <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-border/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 text-xs h-7 px-2.5"
                        >
                          <Github className="w-3.5 h-3.5 mr-1" /> {tr('projects_code')}
                        </Button>
                      </a>
                      <Link to={`/projects/${project.id}`}>
                        <Button size="sm" className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-xs h-7 px-2.5 border border-primary/20">
                          <ArrowRight className="w-3.5 h-3.5 mr-1" /> {tr('projects_view_details')}
                        </Button>
                      </Link>
                    </div>
                    
                    {/* تگ type */}
                    <span className="px-2 py-1 text-[10px] rounded-full bg-card border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-200 cursor-default">
                      {project.type}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}