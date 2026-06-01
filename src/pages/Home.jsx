import React from 'react';
import Hero from '../components/portfolio/Hero';
import About from '../components/portfolio/About';
import Skills from '../components/portfolio/Skills';
import Experience from '../components/portfolio/Experience';
import Projects from '../components/portfolio/Projects';
import GitHubStats from '../components/portfolio/GitHubStats';
import Education from '../components/portfolio/Education';
import Contact from '../components/portfolio/Contact';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <GitHubStats />
      <Education />
      <Contact />
    </main>
  );
}