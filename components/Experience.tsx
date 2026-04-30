'use client'

const experiences = [
  {
    title: 'AI Engineer & Python Developer',
    company: 'Mahroyan Software Industry Co',
    period: 'Jul 2023 - Apr 2025',
    achievements: [
      'Developed modular scraping system for X, Facebook, and Instagram',
      'Fine-tuned BERT model for emotion classification with 8 emotions',
      'Built Persian Legal Assistant using RAG and Vector Search'
    ]
  },
  {
    title: 'AI & Trading Systems Developer',
    company: 'FintechPlus (Freelance)',
    period: '2024 - Present',
    achievements: [
      'Implemented YOLOv8 for chart pattern detection with 97% accuracy',
      'Developed real-time Forex trading bot with comprehensive risk management',
      'Created news-based trading suspension system using Redis/PostgreSQL'
    ]
  },
  {
    title: 'AI & Automation Developer',
    company: 'MaralBranding (Freelance)',
    period: '2023 - 2024',
    achievements: [
      'Built e-commerce chatbot with RAG implementation',
      'Created PyQt5 desktop application for Balad.ir data scraping',
      'Integrated semantic search for product recommendations'
    ]
  }
]

export default function Experience() {
  return (
    <section id="experience" className="py-20 bg-[#1e293b]">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Professional <span className="text-[#f59e0b]">Experience</span>
        </h2>

        <div className="max-w-3xl mx-auto">
          {experiences.map((exp, idx) => (
            <div key={idx} className="timeline-item">
              <h3 className="text-xl font-bold text-[#f59e0b]">{exp.title}</h3>
              <p className="text-sm text-gray-400 mb-2">
                {exp.company} | {exp.period}
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                {exp.achievements.map((achievement, i) => (
                  <li key={i}>{achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
