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
  ArrowLeft,
  Send,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Seo from '@/components/Seo';
import { linksSeo } from '@/lib/seoData';
import { personalInfo, getPersonalInfo } from '@/data/personalInfo';
import { useLang } from '@/lib/LanguageContext';

export default function LinksPage() {
  const { tr, lang, dir } = useLang();
  const isRtl = dir === 'rtl';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const currentInfo = getPersonalInfo(lang);

  const [copied, setCopied] = useState(false);

  const linksUrl = typeof window !== 'undefined' ? window.location.href : 'https://abolfazlabbasi.com/links';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(linksUrl);
      setCopied(true);
      toast.success(lang === 'fa' ? 'پیوند این صفحه کپی شد!' : 'Page link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error(lang === 'fa' ? 'خطا در کپی پیوند' : 'Failed to copy link.');
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
      toast.success(lang === 'fa' ? 'دانلود رزومه آغاز شد!' : 'Resume download started!');
    } catch {
      toast.error(lang === 'fa' ? 'خطا در دریافت فایل رزومه' : 'Failed to download resume file.');
    }
  };

  const linkCards = [
    {
      title: lang === 'fa' ? 'پورتفولیو و سیستم‌های اصلی' : 'Official Portfolio',
      description: lang === 'fa' ? 'سیستم‌های مهندسی، معماری پروژه‌ها و فلسفه عملیاتی کیهان.' : 'Selected AI projects, technical case studies, and engineering philosophy.',
      icon: Globe,
      to: '/',
      isInternal: true,
      badge: lang === 'fa' ? 'سایت اصلی' : 'Main Site',
    },
    {
      title: lang === 'fa' ? 'صفحه تماس و رله تلگرام' : 'Contact Page & Message Relay',
      description: lang === 'fa' ? 'اطلاعات تماس مستقیم، رله لحظه‌ای تلگرام و دانلود کارت vCard.' : 'Direct contact info, Telegram message relay, and vCard contact download.',
      icon: Send,
      to: '/contact',
      isInternal: true,
      badge: lang === 'fa' ? 'فعال و مستقیم' : 'Active Channel',
      featured: true,
    },
    {
      title: lang === 'fa' ? 'مخازن گیت‌هاب (کدهای بازتولیدپذیر)' : 'GitHub Repositories',
      description: lang === 'fa' ? 'سورس سیستم‌های هوش مصنوعی، خطوط لوله NLP و کدهای کوانت.' : 'Production AI systems, Persian NLP pipelines, and quantitative codebase.',
      icon: Github,
      href: personalInfo.social.github,
      isInternal: false,
    },
    {
      title: lang === 'fa' ? 'شبکه حرفه‌ای لینکدین' : 'LinkedIn Profile',
      description: lang === 'fa' ? 'ارتباط حرفه‌ای و مشاهده سوابق رسمی.' : 'Connect professionally and view full experience history.',
      icon: Linkedin,
      href: personalInfo.social.linkedin,
      isInternal: false,
    },
    {
      title: lang === 'fa' ? 'یادداشت‌های فنی و دست‌نوشته‌ها' : 'Technical Notes & Blog',
      description: lang === 'fa' ? 'تحلیل عمیق معماری‌های LLM، سیستم‌های صوتی و بازارها.' : 'In-depth engineering articles on LLMs, RAG, and market intelligence.',
      icon: BookOpen,
      to: '/blog',
      isInternal: true,
    },
    {
      title: lang === 'fa' ? 'دموهای تعاملی پروژه‌ها' : 'Interactive Project Demos',
      description: lang === 'fa' ? 'نمونه‌های زنده چت‌بات، بات معاملات و بینایی ماشین.' : 'Live case studies, quant workflows, and model evaluations.',
      icon: PlayCircle,
      to: '/demos',
      isInternal: true,
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4" dir={dir}>
      <Seo metadata={linksSeo()} />

      <div className="max-w-xl mx-auto space-y-8">
        {/* Profile & Monogram Banner */}
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
              {currentInfo.firstName} {currentInfo.lastName}
            </h1>
            <p className="text-xs sm:text-sm text-primary font-medium mt-1 font-mono">
              {currentInfo.titles[0]}
            </p>
          </div>

          {/* Banner */}
          <div className="p-4 sm:p-5 rounded-2xl glass border border-amber-500/30 bg-amber-500/5 relative overflow-hidden text-start">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 shrink-0 mt-0.5">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1 text-xs flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-foreground text-sm">
                    {tr('links_hub_title')}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                    {lang === 'fa' ? 'به‌روزرسانی' : 'Active'}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {tr('links_hub_desc')}
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
                    <ArrowIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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
            className="w-full p-4 rounded-xl border bg-card/80 border-border/80 hover:border-primary/40 hover:bg-card hover:scale-[1.01] transition-all duration-200 flex items-center justify-between gap-4 group text-start"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-2.5 rounded-xl shrink-0 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {tr('links_download_cv')}
                  </h2>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                    PDF
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{tr('links_cv_desc')}</p>
              </div>
            </div>

            <div className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
              <ArrowIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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
            <span>{copied ? tr('contact_copied_link') : tr('links_copy_btn')}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="rounded-xl border-border hover:bg-card gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Link to="/contact">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span>{tr('links_direct_contact')}</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
