export const aboutData = {
  // English Defaults
  title: "Engineering Identity",
  subtitle: "Architecting resilient autonomous systems at the intersection of AI and Quantitative Finance",
  avatar: "AA",
  location: "Iran (Worldwide Remote)",
  remoteStatus: "Open for High-Impact Projects",
  bio: "AI Systems Engineer and Quant Developer building NLP, LLM, computer vision, and market-data systems. Specialized in RAG pipelines, transformer fine-tuning, real-time data processing, DevOps, and quantitative trading.",
  description: "I work across data collection, AI/ML experimentation, backend engineering, deployment, and quantitative software systems. Focused on high-agency engineering where deterministic mathematical outcomes supersede claims.",
  stats: [
    { label: "Enterprise Projects", value: "9+", icon: "Briefcase" },
    { label: "Active Programs", value: "3+", icon: "Cpu" },
    { label: "Years AI & Quant", value: "3+", icon: "Code2" },
  ],
  coreTags: [
    "Python", "Rust", "LLMs & Agents", "RAG Pipelines", "Transformers",
    "Computer Vision", "Quantitative Trading", "Risk Engines", "Docker & CI/CD", "FastAPI"
  ],

  en: {
    title: "Engineering Identity",
    subtitle: "Architecting resilient autonomous systems at the intersection of AI and Quantitative Finance",
    avatar: "AA",
    location: "Iran (Worldwide Remote)",
    remoteStatus: "Open for High-Impact Projects",
    bio: "AI Systems Engineer and Quant Developer building NLP, LLM, computer vision, and market-data systems. Specialized in RAG pipelines, transformer fine-tuning, real-time data processing, DevOps, and quantitative trading.",
    description: "I architect systems end-to-end: from raw data extraction and noise elimination to high-performance inference and real-time execution. Focused on high-agency engineering where deterministic mathematical outcomes supersede claims.",
    stats: [
      { label: "Enterprise Systems", value: "9+", icon: "Briefcase" },
      { label: "Training Programs", value: "3+", icon: "Cpu" },
      { label: "Years AI & Quant", value: "3+", icon: "Code2" },
    ],
    coreTags: [
      "Python", "Rust", "LLMs & Agents", "RAG Pipelines", "Transformers",
      "Computer Vision", "Quantitative Trading", "Risk Engines", "Docker & CI/CD", "FastAPI"
    ],
  },

  fa: {
    title: "هویت و رویکرد مهندسی",
    subtitle: "معماری سیستم‌های خودکار و تاب‌آور در تلاقی هوش مصنوعی و بازارهای مالی",
    avatar: "AA",
    location: "ایران (همکاری ریموت در سطح بین‌المللی)",
    remoteStatus: "آماده پذیرش پروژه‌های شاخص",
    bio: "مهندس سیستم‌های هوش مصنوعی و توسعه‌دهنده سیستم‌های کوانت با تمرکز بر خطوط لوله LLM، پردازش متن و صوت، یادگیری عمیق، داده‌های مشتقه و سیستم‌های معاملاتی الگوریتمی.",
    description: 'رویکرد من مبتنی بر عاملیت حداکثری (High-Agency) است؛ از جمع‌آوری و پالایش دیتای نویزدار گرفته تا طراحی مدل‌های محاسباتی، معماری پایپ‌لاین‌های ناهمگام و استقرار پایدار در محیط‌های واقعی. جایی که خروجی‌های ملموس و کدهای بدون باگ، بالاتر از ادعاها قرار می‌گیرند.',
    stats: [
      { label: "سیستم‌های سازمانی", value: "۹+", icon: "Briefcase" },
      { label: "دوره‌های تخصصی", value: "۳+", icon: "Cpu" },
      { label: "سال هوش مصنوعی و کوانت", value: "۳+", icon: "Code2" },
    ],
    coreTags: [
      "پایتون (Python)", "راست (Rust)", "سیستم‌های ایجنتیک", "خطوط لوله RAG", "ترنسفورمرها",
      "بینایی ماشین (CV)", "معاملات الگوریتمی", "مدیریت ریسک", "داکر و CI/CD", "FastAPI"
    ],
  }
};

export const getAboutData = (lang = 'en') => aboutData[lang] || aboutData.en;

export default aboutData;
