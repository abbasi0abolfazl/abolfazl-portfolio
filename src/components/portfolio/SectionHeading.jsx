import React from 'react';
import AnimatedSection from './AnimatedSection';

export default function SectionHeading({ title, subtitle }) {
  return (
    <AnimatedSection className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
        {title}
      </h2>
      <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-4" />
      {subtitle && (
        <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      )}
    </AnimatedSection>
  );
}