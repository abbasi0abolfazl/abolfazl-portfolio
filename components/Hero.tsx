'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Hero() {
  const [text, setText] = useState('')
  const fullText = 'AI Engineer & NLP Specialist'
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText(prev => prev + fullText[index])
        setIndex(prev => prev + 1)
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [index])

  return (
    <section
      id="home"
      className="gradient-mesh min-h-screen flex items-center justify-center relative pt-20"
    >
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Abolfazl <span className="text-[#f59e0b]">Abbasi</span>
        </h1>
        <div className="text-2xl md:text-4xl text-[#f59e0b] mb-6">
          {text}
          <span className="animate-pulse">|</span>
        </div>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Building intelligent systems with LLMs, NLP, and Algorithmic Trading
        </p>
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
          <a href="#projects" className="btn-primary inline-block">
            View Projects
          </a>
          <a href="/cv/abolfazl-abbasi-cv.pdf" className="btn-secondary inline-block">
            Download CV
          </a>
          <a href="#contact" className="btn-secondary inline-block">
            Contact Me
          </a>
        </div>
        <div className="mt-8 rtl text-[#f59e0b] opacity-75 text-lg">
          ساخت سیستم‌های هوشمند با یادگیری عمیق و پردازش زبان طبیعی
        </div>
      </div>
    </section>
  )
}
