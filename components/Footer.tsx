import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { HiMail } from 'react-icons/hi'

export default function Footer() {
  return (
    <footer className="py-8 border-t border-[#334155]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">
            © 2025 Abolfazl Abbasi. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="https://github.com/abbasi0abolfazl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f59e0b] hover:scale-110 transition"
            >
              <FaGithub className="w-5 h-5" />
            </a>
            <a
              href="mailto:a.abbasi5775@gmail.com"
              className="text-[#f59e0b] hover:scale-110 transition"
            >
              <HiMail className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-[#f59e0b] hover:scale-110 transition"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}