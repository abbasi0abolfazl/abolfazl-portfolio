import React from 'react';
import { Github, Mail, Linkedin, Heart } from 'lucide-react';

const socialLinks = [
  { icon: Github, href: 'https://github.com/abbasi0abolfazl', label: 'GitHub' },
  { icon: Mail, href: 'mailto:a.abbasi5775@gmail.com', label: 'Email' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/50 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Abolfazl Abbasi. Built with
          <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
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