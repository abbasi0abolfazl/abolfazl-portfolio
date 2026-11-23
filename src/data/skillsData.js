export const skillsData = {
  title: "Technical Skills",
  subtitle: "Technologies and tools I work with",
  categories: [
    {
      title: "Languages",
      titleFa: "زبان‌های برنامه‌نویسی اصلی",
      icon: "Code",
      skills: ["Python", "Rust", "JavaScript", "SQL", "Bash", "C++"]
    },
    {
      title: "NLP & Agentic AI",
      titleFa: "پردازش زبان طبیعی و ایجنت‌ها",
      icon: "Brain",
      skills: [
        "HuggingFace Transformers",
        "BERT Fine-tuning",
        "RAG Architecture",
        "ChromaDB & Vector Stores",
        "LangChain & LangGraph",
        "Voice Agents (ASR + TTS)",
        "Prompt Engineering"
      ]
    },
    {
      title: "Computer Vision",
      titleFa: "بینایی ماشین و پردازش تصویر",
      icon: "Eye",
      skills: [
        "YOLOv8",
        "OpenCV",
        "Object Detection",
        "Candlestick Chart Pattern Detection",
        "Dataset Annotation"
      ]
    },
    {
      title: "Data Engineering & Caching",
      titleFa: "مهندسی داده، پایگاه‌داده و کش",
      icon: "Database",
      skills: [
        "PostgreSQL / MariaDB",
        "DuckDB",
        "Redis",
        "MongoDB",
        "ETL Pipelines",
        "Event-Driven Web Crawlers"
      ]
    },
    {
      title: "DevOps & Production Infrastructure",
      titleFa: "زیرساخت، استقرار و DevOps",
      icon: "GitBranch",
      skills: [
        "Docker & Containerization",
        "Linux (systemd & security)",
        "GitLab CI/CD",
        "Cloudflare Workers & Edge",
        "Nextcloud",
        "Zero-Downtime Deployment"
      ]
    },
    {
      title: "Service Frameworks",
      titleFa: "فریم‌ورک‌های وب و سرویس‌دهی",
      icon: "TrendingUp",
      skills: [
        "FastAPI",
        "Flask",
        "Server-Sent Events (SSE)",
        "Streamlit & Gradio",
        "React 18 & Vite"
      ]
    },
    {
      title: "Quantitative & Telephony Domain",
      titleFa: "دانش تخصصی فایننس و سیستم‌های تلفنی",
      icon: "Globe",
      skills: [
        "Algorithmic Trading & Risk Engines",
        "MetaTrader / Forex Analytics",
        "Asterisk / Issabel VoIP Pipeline",
        "Call Analytics & Audio Processing"
      ]
    }
  ],

  en: {
    title: "Technical Arsenal & Stack",
    subtitle: "Disciplined tools, frameworks, and infrastructure powering production pipelines",
  },

  fa: {
    title: "جعبه‌ابزار و فناوری‌های مهندسی",
    subtitle: "ابزارها، فریم‌ورک‌ها و فناوری‌های استقرار در سیستم‌های مقیاس‌پذیر",
  }
};

export const getSkillsData = (lang = 'en') => ({
  title: skillsData[lang]?.title || skillsData.title,
  subtitle: skillsData[lang]?.subtitle || skillsData.subtitle,
  categories: skillsData.categories.map((c) => ({
    ...c,
    title: lang === 'fa' ? c.titleFa || c.title : c.title,
  })),
});

export default skillsData;
