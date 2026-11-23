import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Send,
  Copy,
  Check,
  Share2,
  Download,
  MessageCircle,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Seo from '@/components/Seo';
import { contactSeo } from '@/lib/seoData';
import { personalInfo } from '@/data/personalInfo';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const contactUrl = typeof window !== 'undefined' ? window.location.href : 'https://abolfazlabbasi.com/contact';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(contactUrl);
      setCopiedLink(true);
      toast.success('Contact page link copied to clipboard!', {
        description: 'You can now share it with others.',
      });
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      toast.error('Failed to copy. Please copy the link manually.');
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopiedEmail(true);
      toast.success('Email address copied to clipboard!', {
        description: personalInfo.email,
      });
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      toast.error('Failed to copy email address.');
    }
  };

  const handleDownloadVCard = () => {
    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Abbasi;Abolfazl;;;',
      'FN:Abolfazl Abbasi',
      'ORG:AI Systems & Quantitative Engineering',
      'TITLE:AI Systems Engineer & Quant Developer',
      `EMAIL;type=INTERNET;type=WORK;type=pref:${personalInfo.email}`,
      `TEL;type=CELL;type=VOICE;type=pref:${personalInfo.phone}`,
      'URL:https://abolfazlabbasi.com',
      'URL;type=Contact:https://abolfazlabbasi.com/contact',
      `URL;type=GitHub:${personalInfo.social.github}`,
      `URL;type=LinkedIn:${personalInfo.social.linkedin}`,
      'NOTE:AI Systems Engineer and Quant Developer building production LLM, RAG, and algorithmic trading systems.',
      'END:VCARD',
    ].join('\r\n');

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Abolfazl_Abbasi_Contact.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    toast.success('Contact card (vCard) downloaded!', {
      description: 'You can add it directly to your phone contacts.',
    });
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Abolfazl Abbasi | Contact & Connect',
          text: 'Get in touch with Abolfazl Abbasi — AI Systems Engineer & Quant Developer.',
          url: contactUrl,
        });
        toast.success('Shared successfully!');
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
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
          subject: form.subject.trim() || undefined,
          message: form.message.trim(),
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to send message via server');
      }

      setSubmitted(true);
      toast.success('Your message has been sent successfully!', {
        description: 'I will get back to you shortly.',
      });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.warn('Worker relay failed, using mail client fallback:', err);
      const subject = encodeURIComponent(
        form.subject ? `[Portfolio] ${form.subject}` : `Portfolio Contact from ${form.name}`
      );
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
      window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
      toast.info('Opening your email client to send message directly.');
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4" dir="ltr">
      <Seo metadata={contactSeo()} />

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Contact</span>
        </div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Available for Projects &amp; Remote Consulting
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Get in <span className="gradient-text">Touch</span>
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Whether you are looking to discuss production AI systems, quantitative engineering architectures,
            consulting, or potential collaborations — feel free to reach out directly or share this page.
          </p>
        </motion.div>

        {/* Showcase & Sharing Hub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 sm:p-8 rounded-2xl glass border border-border/80 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 text-left" dir="ltr">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Contact &amp; Connect Showcase</h2>
              </div>
              <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                Share my verified contact profile and engineering credentials with colleagues, hiring managers, or your network,
                or save them directly to your device contacts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              <Button
                variant="outline"
                onClick={handleCopyLink}
                className="flex-1 sm:flex-none border-border bg-card/60 hover:bg-card hover:text-primary transition-all rounded-xl gap-2 h-11"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied!' : 'Copy Page Link'}</span>
              </Button>

              <Button
                variant="outline"
                onClick={handleDownloadVCard}
                className="flex-1 sm:flex-none border-border bg-card/60 hover:bg-card hover:text-primary transition-all rounded-xl gap-2 h-11"
                title="Download contact card (vCard) to your device"
              >
                <Download className="w-4 h-4" />
                <span>Save Contact (vCard)</span>
              </Button>

              <Button
                onClick={handleNativeShare}
                className="flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-xl gap-2 h-11"
              >
                <Share2 className="w-4 h-4" />
                <span>Quick Share</span>
              </Button>
            </div>
          </div>

          {/* Social direct share links */}
          <div className="mt-6 pt-6 border-t border-border/50 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
            <span className="font-medium">Direct share via:</span>
            <div className="flex items-center gap-2">
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(contactUrl)}&text=${encodeURIComponent('Contact Abolfazl Abbasi — AI Systems Engineer & Quant Developer')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-card border border-border/60 hover:border-primary/40 hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
                Telegram
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Connect with Abolfazl Abbasi:\n' + contactUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-card border border-border/60 hover:border-primary/40 hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                WhatsApp
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(contactUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-card border border-border/60 hover:border-primary/40 hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-500" />
                LinkedIn
              </a>
            </div>
          </div>
        </motion.div>

        {/* Main Grid: Direct Channels + Interactive Contact Form */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Direct Channels Column (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5 space-y-4"
          >
            {/* Abolfazl Identity Card */}
            <div className="p-6 rounded-2xl glass border border-border/70 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-lg text-primary">
                  AA
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">{personalInfo.firstName} {personalInfo.lastName}</h3>
                  <p className="text-xs text-muted-foreground">{personalInfo.titles[0]}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Building production LLM systems, advanced retrieval (RAG) architectures, financial market intelligence platforms, and quantitative pipelines.
              </p>
            </div>

            {/* Email Card */}
            <div className="p-4 rounded-xl bg-card border border-border/70 hover:border-primary/30 transition-all flex items-center justify-between gap-3 group">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {personalInfo.email}
                  </a>
                </div>
              </div>
              <button
                onClick={handleCopyEmail}
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                title="Copy email address"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Phone Card */}
            <div className="p-4 rounded-xl bg-card border border-border/70 hover:border-primary/30 transition-all flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone / WhatsApp / Telegram</p>
                  <a
                    href={`tel:${personalInfo.phone}`}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                    dir="ltr"
                  >
                    {personalInfo.phone}
                  </a>
                </div>
              </div>
              <a
                href={`tel:${personalInfo.phone}`}
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                title="Direct call"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Location Card */}
            <div className="p-4 rounded-xl bg-card border border-border/70 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Location &amp; Availability</p>
                <p className="text-sm font-medium text-foreground">{personalInfo.location}</p>
              </div>
            </div>

            {/* Social Links Row */}
            <div className="p-4 rounded-xl bg-card border border-border/70 space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Social &amp; Professional Profiles</p>
              <div className="flex items-center gap-3 pt-1">
                <a
                  href={personalInfo.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-lg bg-background border border-border hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center gap-2 text-xs font-medium text-foreground"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
                <a
                  href={personalInfo.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-lg bg-background border border-border hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center gap-2 text-xs font-medium text-foreground"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </div>
            </div>
          </motion.div>

          {/* Interactive Contact Form Column (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="p-6 sm:p-8 rounded-2xl glass border border-border/70 shadow-lg space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">Send a Direct Message</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Messages are relayed directly to Telegram and email for instant notification.
                </p>
              </div>

              {submitted && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-sm space-y-1">
                    <p className="font-semibold text-foreground">Message received successfully!</p>
                    <p className="text-muted-foreground text-xs">
                      Thank you for reaching out. I will review your inquiry and get back to you shortly. Feel free to send another message if needed.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-medium text-muted-foreground">
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="Your Name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="bg-card/70 border-border focus:border-primary h-12 rounded-xl text-foreground"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      required
                      placeholder="your.email@domain.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="bg-card/70 border-border focus:border-primary h-12 rounded-xl text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-xs font-medium text-muted-foreground">
                    Subject / Inquiry Type (Optional)
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="e.g., AI System Consulting / Project Collaboration"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="bg-card/70 border-border focus:border-primary h-12 rounded-xl text-foreground"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-medium text-muted-foreground">
                    Message <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    placeholder="Describe your inquiry, project scope, or ideas..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="bg-card/70 border-border focus:border-primary min-h-[160px] rounded-xl text-foreground resize-y"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-xl font-semibold transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      <span>Sending message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
