'use client'

const projects = [
  {
    title: 'Social Botnet Intelligence',
    description: 'Modular scraping system for social media platforms with asynchronous processing.',
    technologies: ['Python', 'Selenium', 'Asyncio', 'Flask'],
    image: '/images/project1.jpg'
  },
  {
    title: 'Sentiment & Emotion Detection',
    description: 'BERT-based model for multi-class emotion classification with 8 emotion categories.',
    technologies: ['BERT', 'HuggingFace', 'ChatGPT API'],
    image: '/images/project2.jpg'
  },
  {
    title: 'Legal Reasoning Chatbot',
    description: 'Persian legal assistant using RAG architecture and vector search.',
    technologies: ['RAG', 'ChromaDB', 'LangChain', 'Streamlit'],
    image: '/images/project3.jpg'
  },
  {
    title: 'Chart Pattern Detector',
    description: 'YOLOv8-based computer vision system for trading chart pattern detection.',
    technologies: ['YOLOv8', 'Computer Vision', 'Trading'],
    image: '/images/project4.jpg'
  },
  {
    title: 'Automated Forex Trading Bot',
    description: 'Real-time trading bot with risk management and news-based controls.',
    technologies: ['MetaTrader', 'Redis', 'PostgreSQL'],
    image: '/images/project5.jpg'
  },
  {
    title: 'E-Commerce Chatbot',
    description: 'Intelligent shopping assistant with RAG and semantic search.',
    technologies: ['OpenAI API', 'RAG', 'Semantic Search'],
    image: '/images/project6.jpg'
  }
]

export default function Projects() {
  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Featured <span className="text-[#f59e0b]">Projects</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <div key={idx} className="project-card">
              <div className="w-full h-48 bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center text-white font-bold">
                {project.title.split(' ').slice(0, 2).join(' ')}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <div className="flex flex-wrap mb-4">
                  {project.technologies.map(tech => (
                    <span key={tech} className="skill-tag text-sm">{tech}</span>
                  ))}
                </div>
                <div className="flex space-x-4">
                  <a href="#" className="text-[#f59e0b] hover:underline">GitHub →</a>
                  <a href="#" className="text-[#f59e0b] hover:underline">Live Demo →</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
