import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown, FileText, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner'; 
import ParticleBackground from './ParticleBackground';
import { getPersonalInfo } from '@/data/personalInfo';
import { useLang } from '@/lib/LanguageContext';

export default function Hero() {
  const navigate = useNavigate();
  const { lang, tr } = useLang();
  const info = getPersonalInfo(lang);

  const [titleIndex, setTitleIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const titles = info.titles || [
    'AI Systems Engineer & Quant Developer',
    'Production LLM & Agentic Architect'
  ];

  // Reset typewriter when language changes
  useEffect(() => {
    setTitleIndex(0);
    setText('');
    setIsDeleting(false);
  }, [lang]);

  useEffect(() => {
    const currentTitle = titles[titleIndex] || titles[0];
    let timeout;

    if (!isDeleting && text === currentTitle) {
      timeout = setTimeout(() => setIsDeleting(true), 2400);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setTitleIndex((prev) => (prev + 1) % titles.length);
    } else {
      timeout = setTimeout(() => {
        setText(isDeleting
          ? currentTitle.substring(0, text.length - 1)
          : currentTitle.substring(0, text.length + 1)
        );
      }, isDeleting ? 25 : 55);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, titleIndex, titles]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const downloadCV = () => {
    try {
      const cvFileName = 'Abolfazl_Abbasi_CV.pdf';
      const cvUrl = `/${cvFileName}`;
      
      const link = document.createElement('a');
      link.href = cvUrl;
      link.download = cvFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(
        lang === 'fa' ? 'دانلود رزومه آغاز شد!' : 'Resume download started!',
        {
          description: lang === 'fa' ? 'فایل رزومه در حال دریافت است…' : 'Resume file is downloading...',
          duration: 3000,
        }
      );
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast.error(
        lang === 'fa' ? 'خطا در دریافت فایل رزومه' : 'Failed to download resume file.',
        {
          description: lang === 'fa' ? 'لطفاً دوباره تلاش کنید یا با ایمیل تماس بگیرید.' : 'Please try again or visit later.',
          duration: 4000,
        }
      );
    }
  };

  const handleButtonClick = (action) => {
    if (action === 'download') {
      downloadCV();
    } else if (action === 'contact') {
      navigate('/contact');
    } else {
      scrollToSection(action);
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
      <ParticleBackground />
      <div className="mesh-gradient absolute inset-0 pointer-events-none" />
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Brand Moniker Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-primary/10 text-primary border border-primary/25 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="font-bold">{info.moniker}</span>
            <span className="opacity-40">•</span>
            <span>{info.tagline}</span>
          </motion.div>

          {/* Name & Identity */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-bold text-foreground tracking-tight"
          >
            <span className="block text-4xl sm:text-6xl md:text-7xl font-extrabold">{info.firstName}</span>
            <span className="block text-3xl sm:text-5xl md:text-6xl text-foreground/85 mt-2">{info.lastName}</span>
            <span className="sr-only"> — {info.moniker}: {info.tagline}</span>
          </motion.h1>

          {/* Dynamic rotating typewriter title */}
          <div className="h-10 flex items-center justify-center">
            <span className="text-lg sm:text-xl md:text-2xl text-primary font-semibold tracking-wide">
              {text}
              <span className="animate-pulse ms-0.5">|</span>
            </span>
          </div>

          {/* Subtitle / Value proposition */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            {info.description}
          </motion.p>

          {/* Social Proof / Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-2 pb-2"
          >
            <div className="p-3 rounded-xl bg-card/60 border border-border/50 text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-foreground">{tr('stats_projects_num')}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{tr('stats_projects_label')}</div>
            </div>
            <div className="p-3 rounded-xl bg-card/60 border border-border/50 text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-foreground">{tr('stats_programs_num')}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{tr('stats_programs_label')}</div>
            </div>
            <div className="p-3 rounded-xl bg-card/60 border border-border/50 text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-foreground">{tr('stats_coaching_num')}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{tr('stats_coaching_label')}</div>
            </div>
            <div className="p-3 rounded-xl bg-card/60 border border-border/50 text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-foreground">{tr('stats_experience_num')}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{tr('stats_experience_label')}</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button
              onClick={() => handleButtonClick(info.buttons.viewProjects.action)}
              className="bg-primary/20 backdrop-blur-sm border border-primary/40 text-primary hover:bg-primary/30 hover:border-primary/60 hover:scale-105 transition-all duration-300 px-6 py-2.5 rounded-full font-semibold tracking-wide shadow-lg shadow-primary/10"
            >
              <CheckCircle2 className="w-4 h-4 me-2" />
              {info.buttons.viewProjects.text}
            </Button>

            <Button
              variant="outline"
              onClick={() => handleButtonClick(info.buttons.contactMe.action)}
              className="border border-border text-foreground/85 bg-card/60 backdrop-blur-sm hover:bg-card hover:text-foreground hover:border-primary/40 hover:scale-105 transition-all duration-300 px-6 py-2.5 rounded-full font-semibold tracking-wide shadow-sm"
            >
              <Send className="w-4 h-4 me-2" />
              {info.buttons.contactMe.text}
            </Button>

            <Button
              variant="outline"
              onClick={() => handleButtonClick(info.buttons.downloadCV.action)}
              className="border border-border text-foreground/85 bg-card/60 backdrop-blur-sm hover:bg-card hover:text-foreground hover:border-primary/40 hover:scale-105 transition-all duration-300 px-6 py-2.5 rounded-full font-medium tracking-wide shadow-sm"
            >
              <FileText className="w-4 h-4 me-2" />
              {info.buttons.downloadCV.text}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="pt-6"
        >
          <button
            onClick={() => scrollToSection('about')}
            className="text-muted-foreground hover:text-primary transition-colors animate-bounce p-2"
            aria-label="Scroll to About section"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
