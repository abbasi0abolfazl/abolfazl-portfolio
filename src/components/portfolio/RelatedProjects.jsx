import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock } from 'lucide-react';

const STORAGE_KEY = 'recently_viewed_projects';
const MAX_RECENT = 5;

// Jaccard similarity between two tag arrays
function jaccard(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
}

export function trackProjectView(projectTitle) {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = [projectTitle, ...stored.filter((t) => t !== projectTitle)].slice(0, MAX_RECENT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

export default function RelatedProjects({ currentProject, allProjects }) {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setRecentlyViewed(stored.filter((t) => t !== currentProject.title));
    } catch {}
    trackProjectView(currentProject.title);
  }, [currentProject.title]);

  const related = allProjects
    .filter((p) => p.title !== currentProject.title)
    .map((p) => ({
      ...p,
      score: jaccard(
        [...currentProject.tags, ...currentProject.tech],
        [...p.tags, ...p.tech]
      ),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const recentProjects = allProjects.filter(
    (p) => recentlyViewed.includes(p.title) && p.title !== currentProject.title
  );

  if (related.length === 0) return null;

  return (
    <div className="mt-10 space-y-8">
      {/* Related */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-primary rounded-full inline-block" />
          You might also like
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {related.map((p) => (
            <div
              key={p.title}
              className="group p-4 rounded-xl bg-card/60 border border-border/50 hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className={`h-1 w-full rounded-full bg-gradient-to-r ${p.color} mb-3`} />
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors mb-1 leading-snug">
                {p.title}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {p.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px] bg-muted text-muted-foreground">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Viewed */}
      {recentProjects.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Recently Viewed
          </h3>
          <div className="flex flex-wrap gap-2">
            {recentProjects.map((p) => (
              <div
                key={p.title}
                className="px-3 py-1.5 rounded-lg bg-card/60 border border-border/40 hover:border-primary/30 text-sm text-muted-foreground hover:text-primary transition-colors cursor-default"
              >
                {p.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}