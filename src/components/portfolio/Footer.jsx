import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Mail, Linkedin, Sparkles } from 'lucide-react';
import { personalInfo } from '@/data/personalInfo';
import { useLang } from '@/lib/LanguageContext';

const socialLinks = [
  { icon: Github, href: personalInfo.social.github, label: 'GitHub' },
  { icon: Mail, href: `mailto:${personalInfo.email}`, label: 'Email' },
  { icon: Linkedin, href: personalInfo.social.linkedin, label: 'LinkedIn' },
];

export default function Footer() {
  const { tr, lang } = useLang();

  return (
    <footer className="border-t border-border/50 py-10 px-4 bg-card/20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-start">
          <div className="flex items-center gap-2 text-sm text-foreground font-semibold">
            <span>{lang === 'fa' ? 'ابوالفضل عباسی' : 'Abolfazl Abbasi'}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-primary text-xs font-mono">
              {lang === 'fa' ? 'کیهان' : 'KEYHAN'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3 text-primary shrink-0" />
            <span>{tr('footer_moniker_quote')}</span>
          </div>
          <p className="text-[11px] text-muted-foreground/80 mt-1">
            © {new Date().getFullYear()} {tr('footer_rights')} {tr('footer_built_with')}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">{tr('nav_home')}</Link>
          <span className="text-border">•</span>
          <Link to="/#about" className="hover:text-primary transition-colors">{tr('nav_about')}</Link>
          <span className="text-border">•</span>
          <Link to="/#projects" className="hover:text-primary transition-colors">{tr('nav_projects')}</Link>
          <span className="text-border">•</span>
          <Link to="/blog" className="hover:text-primary transition-colors">{tr('nav_blog')}</Link>
          <span className="text-border">•</span>
          <Link to="/demos" className="hover:text-primary transition-colors">{tr('nav_demos')}</Link>
          <span className="text-border">•</span>
          <Link to="/links" className="hover:text-primary transition-colors">{tr('nav_links')}</Link>
          <span className="text-border">•</span>
          <Link to="/contact" className="hover:text-primary transition-colors">{tr('nav_contact')}</Link>
        </div>

        <div className="flex items-center gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-card border border-transparent hover:border-border/50"
              aria-label={link.label}
            >
              <link.icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
