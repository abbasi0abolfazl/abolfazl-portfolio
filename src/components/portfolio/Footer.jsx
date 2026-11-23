import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Mail, Linkedin, Heart } from 'lucide-react';
import { personalInfo } from '@/data/personalInfo';

const socialLinks = [
  { icon: Github, href: personalInfo.social.github, label: 'GitHub' },
  { icon: Mail, href: `mailto:${personalInfo.email}`, label: 'Email' },
  { icon: Linkedin, href: personalInfo.social.linkedin, label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/50 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Abolfazl Abbasi. Built with
          <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-border">•</span>
          <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
          <span className="text-border">•</span>
          <Link to="/links" className="hover:text-primary transition-colors">Links</Link>
          <span className="text-border">•</span>
          <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <span className="text-border">•</span>
          <Link to="/demos" className="hover:text-primary transition-colors">Demos</Link>
        </div>

        <div className="flex items-center gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
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
