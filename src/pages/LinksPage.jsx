import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  Mail,
  Github,
  Linkedin,
  FileText,
  BookOpen,
  PlayCircle,
  Copy,
  Check,
  ExternalLink,
  Clock,
  ArrowRight,
  Send,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Seo from '@/components/Seo';
import { linksSeo } from '@/lib/seoData';
import { personalInfo } from '@/data/personalInfo';

export default function LinksPage() {
  const [copied, setCopied] = useState(false);

  const linksUrl = typeof window !== 'undefined' ? window.location.href : 'https://abolfazlabbasi.com/links';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(linksUrl);
      setCopied(true);
      toast.success('Page link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Failed to copy link.');
    }
  };

  const handleDownloadCV = () => {
    try {
      const cvFileName = 'Abolfazl_Abbasi_CV.pdf';
      const link = document.createElement('a');
      link.href = `/${cvFileName}`;
      link.download = cvFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Resume download started!');
    } catch {
      toast.error('Failed to download resume file.');
    }
  };

  const linkCards = [
    {
      title: 'Official Portfolio',
      description: 'Selected AI projects, technical case studies, and engineering philosophy.',
      icon: Globe,
      to: '/',
      isInternal: true,
      badge: 'Main Site',
    },
    {
      title: 'Contact Page & Message Relay',
      description: 'Direct contact info, Telegram message relay, and vCard contact download.',
      icon: Send,
      to: '/contact',
      isInternal: true,
      badge: 'New & Active',
      featured: true,
    },
    {
      title: 'GitHub Repositories',
      description: 'Production AI systems, Persian NLP pipelines, and quantitative codebase.',
      icon: Github,
      href: personalInfo.social.github,
      isInternal: false,
    },
    {
      title: 'LinkedIn Profile',
      description: 'Connect professionally and view full experience history.',
      icon: Linkedin,
      href: personalInfo.social.linkedin,
      isInternal: false,
    },
    {
      title: 'Technical Notes & Blog',
      description: 'In-depth engineering articles on LLMs, RAG, and market intelligence.',
      icon: BookOpen,
      to: '/blog',
      isInternal: true,
    },
    {
      title: 'Interactive Project Demos',
      description: 'Live case studies, quant workflows, and model evaluations.',
      icon: PlayCircle,
      to: '/demos',
      isInternal: true,
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4" dir="ltr">
      <Seo metadata={linksSeo()} />

      <div className="max-w-xl mx-auto space-y-8">
        {/* Profile & Coming Soon Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          {/* Avatar / Monogram */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary/20 via-primary/10 to-accent/20 border-2 border-primary/30 text-2xl font-bold text-primary shadow-xl shadow-primary/10">
            AA
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-sm text-primary font-medium mt-1">
              {personalInfo.titles[0]}
            </p>
          </div>

          {/* Coming Soon Notice Pill */}
          <div className="p-4 sm:p-5 rounded-2xl glass border border-amber-500/30 bg-amber-500/5 relative overflow-hidden text-left" dir="ltr">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 shrink-0 mt-0.5">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1 text-xs flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-foreground text-sm">Unified Links Hub in Progress</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                    Coming Soon
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  A centralized, interactive bio and links hub is currently being enhanced. All official channels, verified repositories, and direct communication routes below are fully active.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Links List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="space-y-3"
        >
          {linkCards.map((card, idx) => {
            const content = (
              <div
                className={`p-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-4 group ${
                  card.featured
                    ? 'glass border-primary/40 hover:border-primary shadow-md shadow-primary/5 hover:scale-[1.01]'
                    : 'bg-card/80 border-border/80 hover:border-primary/40 hover:bg-card hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                      card.featured
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                    }`}
                  >
                    <card.icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {card.title}
                      </h2>
                      {card.badge && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-primary/10 text-primary border border-primary/20 shrink-0">
                          {card.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{card.description}</p>
                  </div>
                </div>

                <div className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
                  {card.isInternal ? (
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  ) : (
                    <ExternalLink className="w-4 h-4" />
                  )}
                </div>
              </div>
            );

            return card.isInternal ? (
              <Link key={idx} to={card.to} className="block">
                {content}
              </Link>
            ) : (
              <a key={idx} href={card.href} target="_blank" rel="noopener noreferrer" className="block">
                {content}
              </a>
            );
          })}

          {/* Download CV Action Card */}
          <button
            onClick={handleDownloadCV}
            className="w-full p-4 rounded-xl border bg-card/80 border-border/80 hover:border-primary/40 hover:bg-card hover:scale-[1.01] transition-all duration-200 flex items-center justify-between gap-4 group text-left"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-2.5 rounded-xl shrink-0 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    Download Resume / CV (PDF)
                  </h2>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                    PDF
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">Curriculum Vitae with full engineering record.</p>
              </div>
            </div>

            <div className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </motion.div>

        {/* Footer actions */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="rounded-xl border-border hover:bg-card gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Page Link'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="rounded-xl border-border hover:bg-card gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Link to="/contact">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span>Direct Contact</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
