import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, FileText, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner'; 
import ParticleBackground from './ParticleBackground';
import { personalInfo } from '@/data/personalInfo';

export default function Hero() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { firstName, lastName, titles, description, buttons } = personalInfo;

  useEffect(() => {
    const currentTitle = titles[titleIndex];
    let timeout;

    if (!isDeleting && text === currentTitle) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setTitleIndex((prev) => (prev + 1) % titles.length);
    } else {
      timeout = setTimeout(() => {
        setText(isDeleting
          ? currentTitle.substring(0, text.length - 1)
          : currentTitle.substring(0, text.length + 1)
        );
      }, isDeleting ? 30 : 60);
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
      
      toast.success('دانلود شروع شد!', {
        description: 'فایل رزومه در حال دانلود است...',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast.error('خطا در دانلود', {
        description: 'لطفاً دوباره تلاش کنید یا بعداً مراجعه کنید.',
        duration: 4000,
      });
    }
  };

  const handleButtonClick = (action) => {
    if (action === 'download') {
      downloadCV();
    } else {
      scrollToSection(action);
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleBackground />
      <div className="mesh-gradient absolute inset-0" />
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-4 tracking-tight"
          >
            {firstName}
          </motion.h1>

          <div className="h-10 mb-4">
            <span className="text-xl md:text-2xl text-primary font-medium">
              {text}
              <span className="animate-pulse">|</span>
            </span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground/80 mb-6 tracking-tight"
          >
            {lastName}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {description}
          </motion.p>

          <div className="flex flex-wrap justify-center gap-4">
            {/* دکمه View Projects */}
            <Button
              onClick={() => handleButtonClick(buttons.viewProjects.action)}
              variant="outline"
              className="border-2 border-primary/50 text-foreground bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-105 transition-all duration-300 px-6 py-2.5 rounded-full"
            >
              {buttons.viewProjects.text}
            </Button>

            {/* دکمه Download CV */}
            <Button
              variant="outline"
              onClick={() => handleButtonClick(buttons.downloadCV.action)}
              className="border-2 border-primary/50 text-foreground bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-105 transition-all duration-300 px-6 py-2.5 rounded-full"
            >
              <FileText className="w-4 h-4 mr-2" />
              {buttons.downloadCV.text}
            </Button>

            {/* دکمه Contact Me */}
            <Button
              variant="outline"
              onClick={() => handleButtonClick(buttons.contactMe.action)}
              className="border-2 border-primary/50 text-foreground bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-105 transition-all duration-300 px-6 py-2.5 rounded-full"
            >
              <Send className="w-4 h-4 mr-2" />
              {buttons.contactMe.text}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <button
            onClick={() => scrollToSection('about')}
            className="text-muted-foreground hover:text-primary transition-colors animate-bounce"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}