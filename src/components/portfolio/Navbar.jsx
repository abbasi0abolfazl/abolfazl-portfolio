import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import GlobalSearch from './GlobalSearch';
import { useLang } from '@/lib/LanguageContext';

// Minimal pixelated "AA" logo
function PixelLogo() {
  // Each row: 1=filled, 0=empty, pixel grid for "AA"
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
  const { tr } = useLang();

  const navLinks = [
    { key: 'nav_home', href: '/#home' },
    { key: 'nav_about', href: '/#about' },
    { key: 'nav_skills', href: '/#skills' },
    { key: 'nav_experience', href: '/#experience' },
    { key: 'nav_projects', href: '/#projects' },
    { key: 'nav_demos', href: '/demos' },
    { key: 'nav_blog', href: '/blog' },
    { key: 'nav_contact', href: '/#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleNavClick = (href) => {
    setIsOpen(false);
    if (href.startsWith('/#')) {
      const id = href.substring(2);
      if (location.pathname === '/') {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = href;
      }
    }
  };

  const NavItem = ({ link, mobile = false }) => {
    const label = tr(link.key);
    const cls = mobile
      ? 'text-left px-4 py-3 text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors'
      : 'px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/5';

    if (link.href.startsWith('/#')) {
      return (
        <button onClick={() => handleNavClick(link.href)} className={cls}>
          {label}
        </button>
      );
    }
    return (
      <Link to={link.href} className={cls}>
        {label}
      </Link>
    );
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg shadow-black/20' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <PixelLogo />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => <NavItem key={link.key} link={link} />)}
              <a
                href="https://github.com/abbasi0abolfazl"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <GlobalSearch />
              <ThemeToggle />
            </div>

            {/* Mobile controls */}
            <div className="md:hidden flex items-center gap-1">
              <GlobalSearch />
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-72 z-50 glass shadow-2xl shadow-black/40 pt-20 px-6"
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