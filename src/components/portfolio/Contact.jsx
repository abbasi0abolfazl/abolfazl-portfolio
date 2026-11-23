

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Github, Send, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';
import { personalInfo } from '@/data/personalInfo';

const contactInfo = [
  { icon: Mail, label: personalInfo.email, href: `mailto:${personalInfo.email}` },
  { icon: Phone, label: personalInfo.phone, href: `tel:${personalInfo.phone}` },
  { icon: MapPin, label: personalInfo.location, href: null },
];

const socialLinks = [
  { icon: Github, label: 'GitHub', href: personalInfo.social.github },
  ...(personalInfo.social.linkedin
    ? [{ icon: Linkedin, label: 'LinkedIn', href: personalInfo.social.linkedin }]
    : []),
  { icon: Mail, label: 'Email', href: `mailto:${personalInfo.email}` },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields');
      return;
    }
    setSending(true);

    const apiUrl = import.meta.env.VITE_API_URL || 'https://api.abolfazlabbasi.com';

    try {
      const response = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to send message via relay service');
      }

      toast.success('Message sent successfully! I will get back to you shortly.');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.warn('API relay failed, falling back to mail client:', err);
      // Graceful fallback to mail client if Worker is offline or not yet configured
      const subject = encodeURIComponent(`Portfolio contact from ${form.name}`);
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
      window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
      toast.info('Opening your email app as fallback…');
      setForm({ name: '', email: '', message: '' });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title="Get In Touch" subtitle="Let's build something amazing together" />

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <AnimatedSection>
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                I'm always interested in hearing about new projects and opportunities. 
                Whether you have a question or just want to say hi, feel free to reach out!
              </p>

              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                      <item.icon className="w-4 h-4" />
                    </div>
                    {item.href ? (
                      <a href={item.href} className="text-foreground hover:text-primary transition-colors">
                        {item.label}
                      </a>
                    ) : (
                      <span className="text-foreground">{item.label}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Quick Links</h4>
                <div className="flex gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-card border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-200"
                    >
                      <link.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Contact Form */}
          <AnimatedSection delay={0.1}>
            <form onSubmit={handleSubmit} className="space-y-4" aria-label="Contact form">
              <Input
                name="name"
                aria-label="Your name"
                autoComplete="name"
                required
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-card/50 border-border/50 focus:border-primary/50 h-12"
              />
              <Input
                type="email"
                name="email"
                aria-label="Your email"
                autoComplete="email"
                required
                placeholder="Your Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-card/50 border-border/50 focus:border-primary/50 h-12"
              />
              <Textarea
                name="message"
                aria-label="Your message"
                required
                placeholder="Your Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="bg-card/50 border-border/50 focus:border-primary/50 min-h-[150px]"
              />
              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-full font-medium"
              >
                {sending ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
