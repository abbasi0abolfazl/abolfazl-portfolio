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
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Seo from '@/components/Seo';
import { contactSeo } from '@/lib/seoData';
import { personalInfo, getPersonalInfo } from '@/data/personalInfo';
import { useLang } from '@/lib/LanguageContext';

export default function ContactPage() {
  const { tr, lang, dir } = useLang();
  const isRtl = dir === 'rtl';
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;
  const currentInfo = getPersonalInfo(lang);

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
      toast.success(
        lang === 'fa' ? 'لینک صفحه تماس کپی شد!' : 'Contact page link copied to clipboard!',
        {
          description: lang === 'fa' ? 'می‌توانید آن را با دیگران به اشتراک بگذارید.' : 'You can now share it with others.',
        }
      );
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      toast.error(lang === 'fa' ? 'خطا در کپی پیوند' : 'Failed to copy. Please copy the link manually.');
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopiedEmail(true);
      toast.success(
        lang === 'fa' ? 'نشانی ایمیل کپی شد!' : 'Email address copied to clipboard!',
        {
          description: personalInfo.email,
        }
      );
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      toast.error(lang === 'fa' ? 'خطا در کپی ایمیل' : 'Failed to copy email address.');
    }
  };

  const handleDownloadVCard = () => {
    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Abbasi;Abolfazl;;;',
      'FN:Abolfazl Abbasi',
      'ORG:AI Systems & Quantitative Engineering (Keyhan)',
      'TITLE:AI Systems Engineer & Quant Developer',
      `EMAIL;type=INTERNET;type=WORK;type=pref:${personalInfo.email}`,
      `TEL;type=CELL;type=VOICE;type=pref:${personalInfo.phone}`,
      'URL:https://abolfazlabbasi.com',
      'URL;type=Contact:https://abolfazlabbasi.com/contact',
      `URL;type=GitHub:${personalInfo.social.github}`,
      `URL;type=LinkedIn:${personalInfo.social.linkedin}`,
      'NOTE:AI Systems Engineer and Quant Developer building production LLM, RAG, audio AI, and algorithmic trading systems.',
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

    toast.success(
      lang === 'fa' ? 'شناسنامه تماس (vCard) دانلود شد!' : 'Contact card (vCard) downloaded!',
      {
        description: lang === 'fa' ? 'می‌توانید آن را مستقیماً به مخاطبین گوشی خود اضافه کنید.' : 'You can add it directly to your phone contacts.',
      }
    );
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: lang === 'fa' ? 'ابوالفضل عباسی | شناسنامه تماس و ارتباط' : 'Abolfazl Abbasi | Contact & Connect',
          text: lang === 'fa' ? 'ارتباط مستقیم با ابوالفضل عباسی — مهندس سیستم‌های هوش مصنوعی و کوانت' : 'Get in touch with Abolfazl Abbasi — AI Systems Engineer & Quant Developer.',
          url: contactUrl,
        });
        toast.success(lang === 'fa' ? 'با موفقیت به اشتراک گذاشته شد!' : 'Shared successfully!');
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
      toast.error(lang === 'fa' ? 'لطفاً تمامی فیلدهای الزامی را تکمیل کنید.' : 'Please fill in all required fields.');
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
      toast.success(
        lang === 'fa' ? 'پیام شما با موفقیت ارسال شد!' : 'Your message has been sent successfully!',
        {
          description: lang === 'fa' ? 'پیام شما فوراً به تلگرام و ایمیل رله گردید و به زودی پاسخ داده خواهد شد.' : 'I will get back to you shortly.',
        }
      );
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.warn('Worker relay failed, using mail client fallback:', err);
      const subject = encodeURIComponent(
        form.subject ? `[Portfolio] ${form.subject}` : `Portfolio Contact from ${form.name}`
      );
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
      window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
      toast.info(lang === 'fa' ? 'در حال باز کردن نرم‌افزار ایمیل جهت ارسال مستقیم…' : 'Opening your email client to send message directly.');
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4" dir={dir}>
      <Seo metadata={contactSeo()} />

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
            <BackArrow className="w-4 h-4" />
            <span>{tr('nav_home')}</span>
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{tr('nav_contact')}</span>
        </div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{tr('contact_badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            {lang === 'fa' ? (
              <>پل‌های <span className="gradient-text">ارتباط مستقیم</span></>
            ) : (
              <>Get in <span className="gradient-text">Touch</span></>
            )}
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {tr('contact_subtitle')}
          </p>
        </motion.div>

        {/* Showcase & Sharing Hub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 sm:p-8 rounded-2xl glass border border-border/80 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 end-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none -me-20 -mt-20" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 text-start">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  {tr('contact_showcase_title')}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                {tr('contact_showcase_desc')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              <Button
                variant="outline"
                onClick={handleCopyLink}
                className="flex-1 sm:flex-none border-border bg-card/60 hover:bg-card hover:text-primary transition-all rounded-xl gap-2 h-11 text-xs sm:text-sm"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? tr('contact_copied_link') : tr('contact_copy_link')}</span>
              </Button>

              <Button
                variant="outline"
                onClick={handleDownloadVCard}
                className="flex-1 sm:flex-none border-border bg-card/60 hover:bg-card hover:text-primary transition-all rounded-xl gap-2 h-11 text-xs sm:text-sm"
                title={tr('contact_save_vcard')}
              >
                <Download className="w-4 h-4" />
                <span>{tr('contact_save_vcard')}</span>
              </Button>

              <Button
                onClick={handleNativeShare}
                className="flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-xl gap-2 h-11 text-xs sm:text-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>{tr('contact_quick_share')}</span>
              </Button>
            </div>
          </div>

          {/* Social direct share links */}
          <div className="mt-6 pt-6 border-t border-border/50 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
            <span className="font-semibold">{tr('contact_direct_via')}</span>
            <div className="flex items-center gap-2">
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(contactUrl)}&text=${encodeURIComponent(lang === 'fa' ? 'ارتباط مستقیم با ابوالفضل عباسی — مهندس سیستم‌های هوش مصنوعی و کوانت' : 'Contact Abolfazl Abbasi — AI Systems Engineer & Quant Developer')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-card border border-border/60 hover:border-primary/40 hover:text-primary transition-colors flex items-center gap-1.5 font-medium"
              >
                <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
                Telegram
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent((lang === 'fa' ? 'ارتباط با ابوالفضل عباسی:\n' : 'Connect with Abolfazl Abbasi:\n') + contactUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-card border border-border/60 hover:border-primary/40 hover:text-primary transition-colors flex items-center gap-1.5 font-medium"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                WhatsApp
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(contactUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-card border border-border/60 hover:border-primary/40 hover:text-primary transition-colors flex items-center gap-1.5 font-medium"
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
            initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5 space-y-4"
          >
            {/* Abolfazl Identity Card */}
            <div className="p-6 rounded-2xl glass border border-border/70 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-lg text-primary shrink-0">
                  AA
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">
                    {currentInfo.firstName} {currentInfo.lastName}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {currentInfo.titles[0]}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {currentInfo.description}
              </p>
            </div>

            {/* Email Card */}
            <div className="p-4 rounded-xl bg-card border border-border/70 hover:border-primary/30 transition-all flex items-center justify-between gap-3 group">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{lang === 'fa' ? 'ایمیل مستقیم' : 'Direct Email'}</p>
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors font-mono"
                    dir="ltr"
                  >
                    {personalInfo.email}
                  </a>
                </div>
              </div>
              <button
                onClick={handleCopyEmail}
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                title={lang === 'fa' ? 'کپی ایمیل' : 'Copy email address'}
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Phone Card */}
            <div className="p-4 rounded-xl bg-card border border-border/70 hover:border-primary/30 transition-all flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{lang === 'fa' ? 'تماس / تلگرام / واتس‌اپ' : 'Phone / WhatsApp / Telegram'}</p>
                  <a
                    href={`tel:${personalInfo.phone}`}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors font-mono"
                    dir="ltr"
                  >
                    {personalInfo.phone}
                  </a>
                </div>
              </div>
              <a
                href={`tel:${personalInfo.phone}`}
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                title={lang === 'fa' ? 'تماس مستقیم' : 'Direct call'}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Location Card */}
            <div className="p-4 rounded-xl bg-card border border-border/70 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{lang === 'fa' ? 'موقعیت و در دسترس بودن' : 'Location & Availability'}</p>
                <p className="text-sm font-medium text-foreground">{currentInfo.location}</p>
              </div>
            </div>

            {/* Social Links Row */}
            <div className="p-4 rounded-xl bg-card border border-border/70 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {lang === 'fa' ? 'شبکه‌ها و مخازن عمومی' : 'Social & Professional Profiles'}
              </p>
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
            initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="p-6 sm:p-8 rounded-2xl glass border border-border/70 shadow-lg space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {tr('contact_form_heading')}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {tr('contact_form_sub')}
                </p>
              </div>

              {submitted && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-sm space-y-1">
                    <p className="font-semibold text-foreground">
                      {lang === 'fa' ? 'پیام شما دریافت شد!' : 'Message received successfully!'}
                    </p>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {lang === 'fa'
                        ? 'سپاس از پیام شما. پیام فوراً رله شد و در اسرع وقت پاسخ داده خواهد شد.'
                        : 'Thank you for reaching out. I will review your inquiry and get back to you shortly.'}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-medium text-muted-foreground">
                      {tr('contact_name')} <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder={tr('contact_name')}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="bg-card/70 border-border focus:border-primary h-12 rounded-xl text-foreground"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                      {tr('contact_email')} <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      required
                      placeholder="your.email@domain.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="bg-card/70 border-border focus:border-primary h-12 rounded-xl text-foreground font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-xs font-medium text-muted-foreground">
                    {tr('contact_subject')}
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder={lang === 'fa' ? 'مثال: مشاوره معماری سیستم هوش مصنوعی / همکاری فنی' : 'e.g., AI System Consulting / Technical Architecture'}
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="bg-card/70 border-border focus:border-primary h-12 rounded-xl text-foreground"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-medium text-muted-foreground">
                    {tr('contact_message')} <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    placeholder={lang === 'fa' ? 'شرح نیازمندی، ابعاد پروژه یا پرسش خود را مطرح بفرمایید…' : 'Describe your inquiry, project scope, or architecture requirements...'}
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
                      <span>{tr('contact_sending')}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{tr('contact_send')}</span>
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
