'use client'

import { User } from 'lucide-react'

export default function About() {
  return (
    <section id="about" className="py-20 bg-[#1e293b]">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          About <span className="text-[#f59e0b]">Me</span>
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/3">
            <div className="relative">
              <div className="w-64 h-64 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-full mx-auto flex items-center justify-center text-6xl font-bold text-white shadow-xl">
                AA
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#f59e0b] text-[#0f172a] px-4 py-2 rounded-full font-bold">
                Open to Remote
              </div>
            </div>
          </div>

          <div className="md:w-2/3">
            <p className="text-lg text-gray-300 mb-6">
              AI Engineer with 3+ years of experience specializing in Natural Language Processing,
              Large Language Models, and Algorithmic Trading Systems. Passionate about building
              intelligent solutions that bridge the gap between cutting-edge research and practical applications.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#f59e0b]">3+</div>
                <div className="text-sm text-gray-400">Years Exp</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#f59e0b]">15+</div>
                <div className="text-sm text-gray-400">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#f59e0b]">8+</div>
                <div className="text-sm text-gray-400">Technologies</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {['Python', 'NLP', 'LLMs', 'RAG', 'Transformers', 'Docker'].map(skill => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
