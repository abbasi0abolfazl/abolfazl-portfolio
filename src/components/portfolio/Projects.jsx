import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Search, X, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';
import { projects } from '@/lib/projectsData';
import { useLang } from '@/lib/LanguageContext';

const TECH_FILTERS = ['Python', 'NLP', 'Computer Vision', 'Trading', 'RAG', 'LLM'];
const TYPE_FILTERS = ['Web App', 'API', 'Desktop App', 'Research'];
const YEAR_FILTERS = ['2023', '2024', '2025'];

function FilterPill({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 whitespace-nowrap
        ${active
          ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
          : 'border-border/50 text-muted-foreground hover:border-primary/40 hover:text-primary bg-background/50'
        }`}
    >
      {label}
      {count !== undefined && (
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold
          ${active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function ProjectsStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "AI Engineering Projects by Abolfazl Abbasi",
    "description": "Portfolio of AI, NLP, and machine learning projects",
    "itemListElement": projects.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "SoftwareApplication",
        "name": p.title,
        "description": p.description,
        "applicationCategory": p.type,
        "keywords": [...p.tags, ...p.tech].join(', '),
        "dateCreated": p.year,
        "author": { "@type": "Person", "name": "Abolfazl Abbasi" },
        "url": p.github,
      }
    }))
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

function useFilterParams() {
  const getParams = () => {
    const p = new URLSearchParams(window.location.search);
    return {
      tech: p.get('tech') ? p.get('tech').split(',') : [],
      type: p.get('type') ? p.get('type').split(',') : [],
      year: p.get('year') ? p.get('year').split(',') : [],
      q: p.get('q') || '',
      sort: p.get('sort') || 'default',
    };
  };

  const initial = getParams();
  const [activeTech, setActiveTechRaw] = useState(initial.tech);
  const [activeType, setActiveTypeRaw] = useState(initial.type);
  const [activeYear, setActiveYearRaw] = useState(initial.year);
  const [search, setSearchRaw] = useState(initial.q);
  const [sort, setSortRaw] = useState(initial.sort);

  const syncURL = (tech, type, year, q, s) => {
    const p = new URLSearchParams();
    if (tech.length) p.set('tech', tech.join(','));
    if (type.length) p.set('type', type.join(','));
    if (year.length) p.set('year', year.join(','));
    if (q) p.set('q', q);
    if (s !== 'default') p.set('sort', s);
    const qs = p.toString();
    window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
  };

  const setActiveTech = (fn) => setActiveTechRaw((prev) => { const next = typeof fn === 'function' ? fn(prev) : fn; syncURL(next, activeType, activeYear, search, sort); return next; });
  const setActiveType = (fn) => setActiveTypeRaw((prev) => { const next = typeof fn === 'function' ? fn(prev) : fn; syncURL(activeTech, next, activeYear, search, sort); return next; });
  const setActiveYear = (fn) => setActiveYearRaw((prev) => { const next = typeof fn === 'function' ? fn(prev) : fn; syncURL(activeTech, activeType, next, search, sort); return next; });
  const setSearch = (v) => { setSearchRaw(v); syncURL(activeTech, activeType, activeYear, v, sort); };
  const setSort = (v) => { setSortRaw(v); syncURL(activeTech, activeType, activeYear, search, v); };

  return { activeTech, setActiveTech, activeType, setActiveType, activeYear, setActiveYear, search, setSearch, sort, setSort };
}

export default function Projects() {
  const { activeTech, setActiveTech, activeType, setActiveType, activeYear, setActiveYear, search, setSearch, sort, setSort } = useFilterParams();
  const { tr } = useLang();

  const toggleFilter = (value, list, setList) => {
    setList((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]);
  };

  const clearAll = () => {
    setActiveTech([]);
    setActiveType([]);
    setActiveYear([]);
    setSearch('');
  };

  const hasFilters = activeTech.length > 0 || activeType.length > 0 || activeYear.length > 0 || search;

  const filtered = useMemo(() => {
    let result = projects.filter((p) => {
      if (activeTech.length && !activeTech.some((t) => p.tech.includes(t))) return false;
      if (activeType.length && !activeType.includes(p.type)) return false;
      if (activeYear.length && !activeYear.includes(p.year)) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    if (sort === 'name') result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'year-new') result = [...result].sort((a, b) => Number(b.year) - Number(a.year));
    if (sort === 'year-old') result = [...result].sort((a, b) => Number(a.year) - Number(b.year));
    return result;
  }, [activeTech, activeType, activeYear, search, sort]);

  return (
    <section id="projects" className="py-24 px-4 bg-card/30">
      <ProjectsStructuredData />
      <div className="max-w-6xl mx-auto">
        <SectionHeading title={tr('projects_title')} subtitle={tr('projects_subtitle')} />

        {/* Search + Sort */}
        <AnimatedSection className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tr('projects_search')}
              className="pl-9 bg-background/60 border-border/50 focus:border-primary/50 h-9 text-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-9 px-3 rounded-md border border-border/50 bg-background/60 text-sm text-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
          >
            <option value="default">{tr('projects_sort_default')}</option>
            <option value="name">{tr('projects_sort_name')}</option>
            <option value="year-new">{tr('projects_sort_newest')}</option>
            <option value="year-old">{tr('projects_sort_oldest')}</option>
          </select>
        </AnimatedSection>

        {/* Filter pills */}
        <AnimatedSection delay={0.05} className="space-y-3 mb-8">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground w-14 shrink-0">{tr('projects_filter_tech')}</span>
            <FilterPill label={tr('projects_filter_all')} count={projects.length} active={activeTech.length === 0} onClick={() => setActiveTech([])} />
            {TECH_FILTERS.map((t) => (
              <FilterPill key={t} label={t} count={projects.filter((p) => p.tech.includes(t)).length} active={activeTech.includes(t)} onClick={() => toggleFilter(t, activeTech, setActiveTech)} />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground w-14 shrink-0">{tr('projects_filter_type')}</span>
            {TYPE_FILTERS.map((t) => (
              <FilterPill key={t} label={t} count={projects.filter((p) => p.type === t).length} active={activeType.includes(t)} onClick={() => toggleFilter(t, activeType, setActiveType)} />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground w-14 shrink-0">{tr('projects_filter_year')}</span>
            {YEAR_FILTERS.map((y) => (
              <FilterPill key={y} label={y} count={projects.filter((p) => p.year === y).length} active={activeYear.includes(y)} onClick={() => toggleFilter(y, activeYear, setActiveYear)} />
            ))}
          </div>
          {hasFilters && (
            <div className="flex items-center gap-3 pt-1">
              <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                <X className="w-3.5 h-3.5" /> {tr('projects_clear')}
              </button>
              <span className="text-xs text-muted-foreground">
                {tr('projects_showing', { n: filtered.length, total: projects.length })}
              </span>
            </div>
          )}
        </AnimatedSection>

        {/* Project grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[200px]">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full text-center py-20"
              >
                <p className="text-muted-foreground text-lg mb-3">{tr('projects_no_match')}</p>
                <button onClick={clearAll} className="text-primary text-sm hover:underline">{tr('projects_clear')}</button>
              </motion.div>
            ) : (
              filtered.map((project, index) => (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
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

                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-card text-muted-foreground text-xs border border-border/50 hover:border-primary/30 hover:text-primary transition-colors cursor-default">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          <Button variant="outline" size="sm" className="border-border/50 hover:border-primary/30 hover:text-primary text-xs h-7 px-2.5">
                            <Github className="w-3.5 h-3.5 mr-1" /> {tr('projects_code')}
                          </Button>
                        </a>
                        <Link to={`/projects/${project.id}`}>
                          <Button size="sm" className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-xs h-7 px-2.5 border border-primary/20">
                            <ArrowRight className="w-3.5 h-3.5 mr-1" /> {tr('projects_view_details')}
                          </Button>
                        </Link>
                        <Badge variant="secondary" className="ml-auto text-[10px] bg-primary/5 text-primary border-primary/20 self-center">
                          {project.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}