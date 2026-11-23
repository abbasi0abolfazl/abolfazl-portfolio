import React from 'react';
import { Github, GitFork, Star, Code2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';
import axios from 'axios';
import { useLang } from '@/lib/LanguageContext';

const GITHUB_USERNAME = 'abbasi0abolfazl';

async function fetchGitHubData() {
  const reposResponse = await axios.get(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
    { timeout: 8000 }
  );
  return reposResponse.data;
}

export default function GitHubStats() {
  const { tr, dir } = useLang();
  const isRtl = dir === 'rtl';

  const {
    data: repos = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['github-repos', GITHUB_USERNAME],
    queryFn: fetchGitHubData,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    retry: 1,
  });

  // Calculate language stats
  const languageStats = {};
  repos.forEach((repo) => {
    if (repo.language) {
      languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
    }
  });
  const totalLangs = Object.values(languageStats).reduce((a, b) => a + b, 0) || 1;
  const languages = Object.entries(languageStats)
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / totalLangs) * 100),
      color: getLanguageColor(name),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  function getLanguageColor(language) {
    const colors = {
      'Python': '#3776AB',
      'JavaScript': '#F7DF1E',
      'TypeScript': '#3178C6',
      'Java': '#B07219',
      'Go': '#00ADD8',
      'Rust': '#DEA584',
      'Jupyter Notebook': '#F37626',
      'HTML': '#E34F26',
      'CSS': '#563D7C',
      'C++': '#00599C',
      'C#': '#239120',
      'PHP': '#4F5B93',
      'Shell': '#89E051',
      'SQL': '#E38C00',
    };
    return colors[language] || '#6B7280';
  }

  const totalStars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
  const totalForks = repos.reduce((acc, repo) => acc + (repo.forks_count || 0), 0);
  const totalRepos = repos.length;

  if (isLoading) {
    return (
      <section className="py-24 px-4" style={{ minHeight: '500px' }}>
        <div className="max-w-4xl mx-auto">
          <SectionHeading title={tr('github_title')} subtitle={tr('github_subtitle')} />
          <div className="p-8 rounded-xl bg-card/50 border border-border/50" style={{ minHeight: '300px' }}>
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 px-4" style={{ minHeight: '500px' }}>
        <div className="max-w-4xl mx-auto">
          <SectionHeading title={tr('github_title')} subtitle={tr('github_subtitle')} />
          <div className="p-8 rounded-xl bg-card/50 border border-border/50" style={{ minHeight: '300px' }}>
            <div className="text-center py-12">
              <p className="text-muted-foreground">{tr('github_error')}</p>
              <button
                onClick={() => refetch()}
                className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
              >
                {tr('github_retry')}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4" style={{ minHeight: '500px' }}>
      <div className="max-w-4xl mx-auto">
        <SectionHeading title={tr('github_title')} subtitle={tr('github_subtitle')} />

        <AnimatedSection>
          <div className="p-8 rounded-xl bg-card/50 border border-border/50">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors text-start"
              >
                <Github className="w-8 h-8 shrink-0" />
                <div>
                  <div className="font-semibold text-lg">{GITHUB_USERNAME}</div>
                  <div className="text-sm text-muted-foreground font-mono" dir="ltr">github.com/{GITHUB_USERNAME}</div>
                </div>
              </a>
              <div className="flex gap-6 sm:ms-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{totalRepos}+</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Code2 className="w-3 h-3" /> {tr('github_repos')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{totalStars}+</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Star className="w-3 h-3" /> {tr('github_stars')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{totalForks}+</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <GitFork className="w-3 h-3" /> {tr('github_forks')}
                  </div>
                </div>
              </div>
            </div>

            {languages.length > 0 && (
              <>
                <h4 className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                  {tr('github_distribution')}
                </h4>
                <div className="space-y-4">
                  {languages.map((lang) => (
                    <div key={lang.name} className="flex items-center gap-4">
                      <div className="flex items-center gap-2 w-36 shrink-0">
                        <div 
                          className="w-3 h-3 rounded-full shrink-0" 
                          style={{ backgroundColor: lang.color }}
                        />
                        <span className="text-sm text-foreground truncate font-mono text-xs">{lang.name}</span>
                      </div>
                      <div className="flex-1 h-2.5 rounded-full bg-muted/40 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${lang.percentage}%`,
                            backgroundColor: lang.color
                          }}
                        />
                      </div>
                      <span className={`w-12 text-xs text-muted-foreground font-mono ${isRtl ? 'text-start' : 'text-end'}`}>
                        {lang.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
