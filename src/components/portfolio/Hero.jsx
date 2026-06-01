import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, FileText, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ParticleBackground from './ParticleBackground';

const titles = [
  'AI Engineer & NLP Specialist',
  'LLM Systems Developer',
  'Financial Bot Developer',
  'Machine Learning Engineer',
];

export default function Hero() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

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
  }, [text, isDeleting, titleIndex]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
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
          {/* <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center"
          >
            <span className="text-3xl font-bold gradient-text">AA</span>
          </motion.div> */}

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-4 tracking-tight">
            Abolfazl Abbasi
          </h1>

          <div className="h-10 mb-6">
            <span className="text-xl md:text-2xl text-primary font-medium">
              {text}
              <span className="animate-pulse">|</span>
            </span>
          </div>

          <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Building intelligent systems with LLMs, NLP, and Algorithmic Trading
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => scrollToSection('projects')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 font-medium rounded-full"
            >
              View Projects
            </Button>
            <Button
              variant="outline"
              className="border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary/50 px-6 py-2.5 rounded-full"
            >
              <FileText className="w-4 h-4 mr-2" />
              Download CV
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToSection('contact')}
              className="border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary/50 px-6 py-2.5 rounded-full"
            >
              <Send className="w-4 h-4 mr-2" />
              Contact Me
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