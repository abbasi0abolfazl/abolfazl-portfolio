import React, { useEffect } from 'react';
import Hero from '../components/portfolio/Hero';
import About from '../components/portfolio/About';
import Skills from '../components/portfolio/Skills';
import Experience from '../components/portfolio/Experience';
import Projects from '../components/portfolio/Projects';
import Demos from '../components/portfolio/Demos';
import GitHubStats from '../components/portfolio/GitHubStats';
import Education from '../components/portfolio/Education';
import Contact from '../components/portfolio/Contact';
import Seo from '../components/Seo';
import { homeSeo } from '@/lib/seoData';

export default function Home() {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 80);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <main>
      <Seo metadata={homeSeo()} />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Demos />
      <GitHubStats />
      <Education />
      <Contact />
    </main>
  );
}
