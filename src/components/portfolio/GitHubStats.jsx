import React, { useState, useEffect } from 'react';
import { Github, GitFork, Star, Users, Code2 } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';
import axios from 'axios';

const GITHUB_USERNAME = 'abbasi0abolfazl';

export default function GitHubStats() {
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGitHubData();
  }, []);

  const fetchGitHubData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // دریافت اطلاعات کاربر
      const userResponse = await axios.get(`https://api.github.com/users/${GITHUB_USERNAME}`);
      setUserData(userResponse.data);
      
      // دریافت repositories
      const reposResponse = await axios.get(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
      const allRepos = reposResponse.data;
      setRepos(allRepos);
      
      // محاسبه آمار زبان‌ها
      const languageStats = {};
      allRepos.forEach(repo => {
        if (repo.language) {
          languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
        }
      });
      
      // تبدیل به آرایه و مرتب‌سازی
      const total = Object.values(languageStats).reduce((a, b) => a + b, 0);
      const languageArray = Object.entries(languageStats)
        .map(([name, count]) => ({
          name,
          percentage: Math.round((count / total) * 100),
          color: getLanguageColor(name)
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5); // فقط 5 زبان اول
      
      setLanguages(languageArray);
      
    } catch (err) {
      console.error('Error fetching GitHub data:', err);
      setError('Unable to load GitHub data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // تابع تعیین رنگ برای هر زبان
  const getLanguageColor = (language) => {
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
      'Ruby': '#701516',
      'Swift': '#FFAC45',
      'Kotlin': '#A97BFF',
      'Shell': '#89E051',
      'SQL': '#E38C00',
    };
    return colors[language] || '#6B7280';
  };

  // محاسبه آمار کلی
  const totalStars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
  const totalForks = repos.reduce((acc, repo) => acc + (repo.forks_count || 0), 0);
  const totalRepos = repos.length;

  if (isLoading) {
    return (
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionHeading title="GitHub Activity" subtitle="My open source contributions and projects" />
          <div className="p-8 rounded-xl bg-card/50 border border-border/50">
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
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionHeading title="GitHub Activity" subtitle="My open source contributions and projects" />
          <div className="p-8 rounded-xl bg-card/50 border border-border/50">
            <div className="text-center py-12">
              <p className="text-muted-foreground">{error}</p>
              <button
                onClick={fetchGitHubData}
                className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeading title="GitHub Activity" subtitle="My open source contributions and projects" />

        <AnimatedSection>
          <div className="p-8 rounded-xl bg-card/50 border border-border/50">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
              >
                <Github className="w-8 h-8" />
                <div>
                  <div className="font-semibold text-lg">{GITHUB_USERNAME}</div>
                  <div className="text-sm text-muted-foreground">github.com/{GITHUB_USERNAME}</div>
                </div>
              </a>
              <div className="flex gap-6 sm:ml-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{totalRepos}+</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Code2 className="w-3 h-3" /> Repos
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{totalStars}+</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Star className="w-3 h-3" /> Stars
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{totalForks}+</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <GitFork className="w-3 h-3" /> Forks
                  </div>
                </div>
              </div>
            </div>

            {languages.length > 0 && (
              <>
                <h4 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                  Language Distribution
                </h4>
                <div className="space-y-4">
                  {languages.map((lang) => (
                    <div key={lang.name} className="flex items-center gap-4">
                      <div className="flex items-center gap-2 w-32">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: lang.color }}
                        />
                        <span className="text-sm text-foreground">{lang.name}</span>
                      </div>
                      <div className="flex-1 h-3 rounded-full bg-muted/30 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${lang.percentage}%`,
                            backgroundColor: lang.color
                          }}
                        />
                      </div>
                      <span className="w-10 text-sm text-muted-foreground text-right">{lang.percentage}%</span>
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