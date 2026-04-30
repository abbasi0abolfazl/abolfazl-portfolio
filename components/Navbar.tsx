'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'
import { HiMenu, HiX } from 'react-icons/hi'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#about', label: 'About' },
    { href: '/#skills', label: 'Skills' },
    { href: '/#experience', label: 'Experience' },
    { href: '/#projects', label: 'Projects' },
    { href: '/blog', label: 'Blog' },
    { href: '/#contact', label: 'Contact' },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0f172a]/90 backdrop-blur-sm border-b border-[#334155]">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#f59e0b]">
            AA
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[#f59e0b] transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-[#f59e0b]"
          >
            {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>

          {/* GitHub Link Desktop */}
          <a
            href="https://github.com/abbasi0abolfazl"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:block text-[#f59e0b] hover:scale-110 transition"
          >
            <FaGithub className="w-5 h-5" />
          </a>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-[#334155]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-2 hover:text-[#f59e0b] transition"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/abbasi0abolfazl"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2 hover:text-[#f59e0b] transition"
            >
              GitHub
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}