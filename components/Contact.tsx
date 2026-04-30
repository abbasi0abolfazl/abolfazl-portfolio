'use client'

import { useState } from 'react'
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi'
import { FaGithub, FaLinkedin, FaFileAlt } from 'react-icons/fa'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Thank you for your message! I will get back to you soon.')
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <section id="contact" className="py-20 bg-[#1e293b]">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Let's <span className="text-[#f59e0b]">Connect</span>
        </h2>

        <p className="text-center text-xl text-gray-300 mb-12">
          "Let's build something intelligent together"
        </p>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-[#0f172a] p-8 rounded-xl">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 bg-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] text-white"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn-primary w-full">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-[#0f172a] p-6 rounded-xl">
                <div className="flex items-center space-x-4 mb-4">
                  <HiMail className="w-6 h-6 text-[#f59e0b]" />
                  <a href="mailto:a.abbasi5775@gmail.com" className="text-lg hover:text-[#f59e0b] transition">
                    a.abbasi5775@gmail.com
                  </a>
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <HiPhone className="w-6 h-6 text-[#f59e0b]" />
                  <a href="tel:+989334441301" className="text-lg hover:text-[#f59e0b] transition">
                    +98 933 444 1301
                  </a>
                </div>
                <div className="flex items-center space-x-4">
                  <HiLocationMarker className="w-6 h-6 text-[#f59e0b]" />
                  <span className="text-lg">Qom, Iran (Open to Remote)</span>
                </div>
              </div>

              <div className="bg-[#0f172a] p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <div className="flex flex-wrap gap-4">
                  <a href="https://github.com/abbasi0abolfazl" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-[#f59e0b] hover:underline">
                    <FaGithub className="w-5 h-5" />
                    <span>GitHub</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 text-[#f59e0b] hover:underline">
                    <FaLinkedin className="w-5 h-5" />
                    <span>LinkedIn</span>
                  </a>
                  <a href="/cv/abolfazl-abbasi-cv.pdf" className="flex items-center space-x-2 text-[#f59e0b] hover:underline">
                    <FaFileAlt className="w-5 h-5" />
                    <span>Download CV</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}