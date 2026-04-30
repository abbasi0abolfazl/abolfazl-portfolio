'use client'

import { FaGithub } from 'react-icons/fa'

export default function GitHubStats() {
  return (
    <section id="github" className="py-20 bg-[#1e293b]">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          GitHub <span className="text-[#f59e0b]">Activity</span>
        </h2>

        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0f172a] p-8 rounded-xl">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <a
                href="https://github.com/abbasi0abolfazl"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-[#f59e0b] hover:underline"
              >
                <FaGithub className="w-6 h-6" />
                <span className="text-xl">@abbasi0abolfazl</span>
              </a>
              <div className="flex space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#f59e0b]">15+</div>
                  <div className="text-sm text-gray-400">Repositories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#f59e0b]">8</div>
                  <div className="text-sm text-gray-400">Languages</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Python</span>
                  <span>60%</span>
                </div>
                <div className="w-full bg-[#334155] rounded-full h-2">
                  <div className="bg-[#f59e0b] h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Jupyter</span>
                  <span>20%</span>
                </div>
                <div className="w-full bg-[#334155] rounded-full h-2">
                  <div className="bg-[#f59e0b] h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>JavaScript</span>
                  <span>15%</span>
                </div>
                <div className="w-full bg-[#334155] rounded-full h-2">
                  <div className="bg-[#f59e0b] h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}