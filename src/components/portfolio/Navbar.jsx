import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/LanguageContext';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';

// Minimal pixelated "AA" logo
function PixelLogo() {
  const grid = [
    [0,1,1,0,0,0,1,1,0],
    [1,0,0,1,0,1,0,0,1],
    [1,1,1,1,0,1,1,1,1],
    [1,0,0,1,0,1,0,0,1],
    [1,0,0,1,0,1,0,0,1],
  ];
  return (
    <div className="flex flex-col gap-[2px]" style={{ lineHeight: 0 }}>
      {grid.map((row, ri) => (
        <div key={ri} className="flex gap-[2px]">
          {row.map((cell, ci) => (
            <div
              key={ci}
              className={`w-[4px] h-[4px] rounded-[1px] transition-colors duration-300 ${cell ? 'bg-primary group-hover:bg-blue-400' : 'bg-transparent'}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { tr, dir, lang } = useLang();
  const isRtl = dir === 'rtl';

  const navLinks = [
    { key: 'nav_home', href: '/#home' },
    { key: 'nav_about', href: '/#about' },
    { key: 'nav_skills', href: '/#skills' },
    { key: 'nav_experience', href: '/#experience' },
    { key: 'nav_projects', href: '/#projects' },
    { key: 'nav_blog', href: '/blog' },
    { key: 'nav_links', href: '/links' },
    { key: 'nav_contact', href: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (href) => {
    setIsOpen(false);
    
    if (href.startsWith('/#')) {
      const sectionId = href.substring(2);
      
      if (location.pathname === '/') {
        scrollToSection(sectionId);
      } else {
        navigate('/');
        setTimeout(() => {
          scrollToSection(sectionId);
        }, 100);
      }
    } else {
      navigate(href);
    }
  };

  const NavItem = ({ link, mobile = false }) => {
    const label = tr(link.key);
    const isActive = !link.href.startsWith('/#') && (
      location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href))
    );
    const cls = mobile
      ? `text-start px-4 py-3 rounded-lg transition-colors ${
          isActive
            ? 'text-primary bg-primary/10 font-medium'
            : 'text-foreground hover:text-primary hover:bg-primary/5'
        }`
      : `px-3 py-2 text-sm transition-colors rounded-md hover:bg-primary/5 ${
          isActive ? 'text-primary font-medium bg-primary/5' : 'text-muted-foreground hover:text-primary'
        }`;

    return (
      <button onClick={() => handleNavClick(link.href)} className={cls}>
        {label}
      </button>
    );
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg shadow-black/20' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Moniker */}
            <button onClick={() => handleNavClick('/#home')} className="flex items-center gap-3 group text-start">
              <PixelLogo />
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  {lang === 'fa' ? 'ابوالفضل عباسی' : 'Abolfazl Abbasi'}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {lang === 'fa' ? 'کیهان • سیستم‌های هوشمند' : 'KEYHAN • Systems'}
                </span>
              </div>
            </button>

            {/* Desktop Navigation & Actions */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => <NavItem key={link.key} link={link} />)}
              
              <div className="flex items-center gap-1.5 ms-2 ps-2 border-s border-border/50">
                <LanguageToggle />
                <ThemeToggle />
                <a
                  href="https://github.com/abbasi0abolfazl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-1.5">
              <LanguageToggle />
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: isRtl ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRtl ? '-100%' : '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className={`fixed inset-y-0 ${isRtl ? 'left-0' : 'right-0'} w-72 z-50 glass shadow-2xl shadow-black/40 pt-20 px-6 flex flex-col justify-between pb-8`}
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => <NavItem key={link.key} link={link} mobile />)}
              <a
                href="https://github.com/abbasi0abolfazl"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
            </div>

            <div className="pt-4 border-t border-border/40 flex items-center justify-between px-2">
              <span className="text-sm text-muted-foreground">{tr('nav_contact')}</span>
              <div className="flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/50"
          />
        )}
      </AnimatePresence>
    </>
  );
}
