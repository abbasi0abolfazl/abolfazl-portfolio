'use client'

import { Code2, Brain, MessageSquare, Database, Cloud, TrendingUp } from 'lucide-react'

const skillCategories = [
  {
    title: 'Languages',
    icon: Code2,
    skills: ['Python (asyncio)', 'Pandas', 'NumPy']
  },
  {
    title: 'AI/ML',
    icon: Brain,
    skills: ['LLMs (HuggingFace)', 'Transformers', 'Fine-tuning', 'Prompt Engineering']
  },
  {
    title: 'NLP',
    icon: MessageSquare,
    skills: ['Text Classification', 'Semantic Search', 'RAG', 'Sentiment Analysis']
  },
  {
    title: 'Data',
    icon: Database,
    skills: ['MongoDB', 'Redis', 'PostgreSQL', 'Web Scraping']
  },
  {
    title: 'DevOps',
    icon: Cloud,
    skills: ['Git/GitHub', 'Docker', 'Linux']
  },
  {
    title: 'Trading',
    icon: TrendingUp,
    skills: ['MetaTrader', 'YOLOv8', 'Algorithmic Trading']
  }
]

export default function Skills() {
  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Technical <span className="text-[#f59e0b]">Skills</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, idx) => (
            <div key={idx} className="bg-[#1e293b] p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <category.icon className="w-6 h-6 text-[#f59e0b] mr-2" />
                <h3 className="text-xl font-semibold">{category.title}</h3>
              </div>
              <div className="flex flex-wrap">
                {category.skills.map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
