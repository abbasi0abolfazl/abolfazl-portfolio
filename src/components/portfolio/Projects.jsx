import React from 'react';
import { Link } from 'react-router-dom';
import { Github, ArrowRight, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { getLocalizedProjects } from '@/data/projectsData';
import { useLang } from '@/lib/LanguageContext';

export default function Projects() {
  const { tr, lang, dir } = useLang();
  const allProjects = getLocalizedProjects(lang);
  const featuredProjects = allProjects.filter((p) => p.featured !== false);
  const isRtl = dir === 'rtl';

  return (
    <section id="projects" className="py-24 px-4 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title={tr('projects_title')} subtitle={tr('projects_subtitle')} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="group h-full flex flex-col rounded-xl bg-background/60 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 overflow-hidden">
                <div className={`h-1.5 bg-gradient-to-r ${project.color}`} />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors leading-snug pe-2">
                      {project.title}
                    </h3>
                    <Badge variant="secondary" className="text-[10px] shrink-0 bg-muted text-muted-foreground border-border/50">
                      {project.year}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 flex-1 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs rounded-full bg-card border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap items-center mt-auto pt-2">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border/50 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all duration-200 text-xs h-8 px-2.5"
                        >
                          <Github className="w-3.5 h-3.5 me-1" />
                          <span>{tr('projects_code')}</span>
                        </Button>
                      </a>
                    )}
                    
                    <Link to={`/projects/${project.id}`}>
                      <Button
                        size="sm"
                        className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-xs h-8 px-3 border border-primary/20 flex items-center gap-1"
                      >
                        <span>{tr('projects_view_details')}</span>
                        {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                      </Button>
                    </Link>
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
