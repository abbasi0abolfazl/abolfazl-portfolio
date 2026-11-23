export const personalInfo = {
  // English Defaults
  firstName: "Abolfazl",
  lastName: "Abbasi",
  moniker: "KEYHAN",
  tagline: "Engineering Cosmic Order out of Algorithmic Chaos",
  subtagline: "Proof of Work, not claims.",
  titles: [
    "AI Systems Engineer & Quant Developer",
    "Production LLM & Agentic Architect",
    "Quantitative Systems & Risk Engineer"
  ],
  description: "Engineering production-grade AI systems, real-time voice pipelines, and quantitative market infrastructure with mathematical precision.",
  email: "contact@abolfazlabbasi.com",
  phone: "+989334441301",
  location: "Iran (Open to Remote Worldwide)",
  website: "https://abolfazlabbasi.com",
  social: {
    github: "https://github.com/abbasi0abolfazl",
    linkedin: "https://www.linkedin.com/in/abbasi-abolfazl/",
  },
  buttons: {
    viewProjects: {
      text: "Explore Systems",
      action: "projects"
    },
    downloadCV: {
      text: "Download CV",
      action: "download"
    },
    contactMe: {
      text: "Consultation & Inquiries",
      action: "contact"
    }
  },

  // Structured bilingual dictionary
  en: {
    firstName: "Abolfazl",
    lastName: "Abbasi",
    moniker: "KEYHAN",
    tagline: "Engineering Cosmic Order out of Algorithmic Chaos",
    subtagline: "Proof of Work, not claims.",
    titles: [
      "AI Systems Engineer & Quant Developer",
      "Production LLM & Agentic Architect",
      "Quantitative Systems & Risk Engineer"
    ],
    description: "Engineering production-grade AI systems, real-time voice pipelines, and quantitative market infrastructure with mathematical precision.",
    location: "Iran (Open to Remote Worldwide)",
    buttons: {
      viewProjects: {
        text: "Explore Systems",
        action: "projects"
      },
      downloadCV: {
        text: "Download CV",
        action: "download"
      },
      contactMe: {
        text: "Consultation & Inquiries",
        action: "contact"
      }
    }
  },

  fa: {
    firstName: "ابوالفضل",
    lastName: "عباسی",
    moniker: "کیهان",
    tagline: "معماری نظم از دل آشوب",
    subtagline: "Proof of Work، نه حرف.",
    titles: [
      "مهندس سیستم‌های هوش مصنوعی و کوانت",
      "معمار ایجنت‌های هوشمند و خطوط لوله LLM",
      "توسعه‌دهنده سیستم‌های مالی الگوریتمی و مدیریت ریسک"
    ],
    description: "معماری و ساخت سیستم‌های پروداکشن هوش مصنوعی، ایجنت‌های صوتی بلادرنگ، خطوط پردازش زبان طبیعی فارسی و زیرساخت‌های تحلیل بازارهای مالی با دقت ریاضیاتی.",
    location: "ایران (همکاری ریموت در سطح بین‌المللی)",
    buttons: {
      viewProjects: {
        text: "مشاهده سیستم‌ها",
        action: "projects"
      },
      downloadCV: {
        text: "دریافت رزومه (PDF)",
        action: "download"
      },
      contactMe: {
        text: "درخواست مشاوره و همکاری",
        action: "contact"
      }
    }
  }
};

export const getPersonalInfo = (lang = 'en') => personalInfo[lang] || personalInfo.en;

export default personalInfo;
