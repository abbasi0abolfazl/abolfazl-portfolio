import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Github, Send, Linkedin, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';
import { personalInfo } from '@/data/personalInfo';
import { useLang } from '@/lib/LanguageContext';

export default function Contact() {
  const { tr, lang, dir } = useLang();
  const isRtl = dir === 'rtl';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const contactInfo = [
    { icon: Mail, label: personalInfo.email, href: `mailto:${personalInfo.email}` },
    { icon: Phone, label: personalInfo.phone, href: `tel:${personalInfo.phone}` },
    { icon: MapPin, label: lang === 'fa' ? personalInfo.fa.location : personalInfo.en.location, href: null },
  ];

  const socialLinks = [
    { icon: Github, label: 'GitHub', href: personalInfo.social.github },
    ...(personalInfo.social.linkedin
      ? [{ icon: Linkedin, label: 'LinkedIn', href: personalInfo.social.linkedin }]
      : []),
    { icon: Mail, label: 'Email', href: `mailto:${personalInfo.email}` },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(lang === 'fa' ? 'لطفاً تمامی فیلدهای الزامی را تکمیل کنید.' : 'Please fill in all fields');
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

      toast.success(tr('contact_success'));
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.warn('API relay failed, falling back to mail client:', err);
      const subject = encodeURIComponent(
        lang === 'fa' ? `تماس از پورتفولیو - ${form.name}` : `Portfolio contact from ${form.name}`
      );
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
      window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
      toast.info(lang === 'fa' ? 'در حال باز کردن نرم‌افزار ایمیل…' : 'Opening your email app as fallback…');
      setForm({ name: '', email: '', message: '' });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title={tr('contact_title')} subtitle={tr('contact_subtitle')} />

        {/* Dedicated Standalone Page Showcase Link */}
        <AnimatedSection className="mb-10">
          <div className="p-4 sm:p-5 rounded-2xl glass border border-primary/25 bg-card/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-start">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-sm font-semibold text-foreground">
                  {tr('contact_showcase_title')}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {tr('contact_showcase_desc')}
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shrink-0 transition-all shadow-md shadow-primary/10"
            >
              <span>{lang === 'fa' ? 'مشاهده صفحه اختصاصی تماس' : 'Open Contact Page'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <AnimatedSection>
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {lang === 'fa'
                  ? 'من همواره علاقه‌مند به بررسی فرصت‌های همکاری در پروژه‌های پیشرفته هوش مصنوعی، ممیزی معماری سیستم و سیستم‌های معاملاتی کمی هستم. برای گفتگو پیرامون پروژه‌ها می‌توانید پیام بگذارید.'
                  : "I'm always interested in hearing about new projects and high-impact engineering opportunities. Whether you have a system to build or an architecture to audit, feel free to reach out!"}
              </p>

              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                      <item.icon className="w-4 h-4" />
                    </div>
                    {item.href ? (
                      <a href={item.href} className="text-foreground hover:text-primary transition-colors text-sm font-medium" dir="ltr">
                        {item.label}
                      </a>
                    ) : (
                      <span className="text-foreground text-sm font-medium">{item.label}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  {lang === 'fa' ? 'درگاه‌های رسمی و شبکه‌ها' : 'Official Channels'}
                </h4>
                <div className="flex gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-card border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-200"
                      aria-label={link.label}
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
                placeholder={tr('contact_name')}
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
                placeholder={tr('contact_email')}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-card/50 border-border/50 focus:border-primary/50 h-12"
              />
              <Textarea
                name="message"
                aria-label="Your message"
                required
                placeholder={tr('contact_message')}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="bg-card/50 border-border/50 focus:border-primary/50 min-h-[150px] resize-y"
              />
              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-full font-medium shadow-md shadow-primary/10 transition-all"
              >
                {sending ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 me-2" />
                    {tr('contact_send')}
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
