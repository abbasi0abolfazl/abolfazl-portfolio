import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { Calendar, ArrowRight } from 'lucide-react'

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-bold text-center mb-6">
          My <span className="text-[#f59e0b]">Blog</span>
        </h1>
        <p className="text-xl text-center text-gray-300 mb-12 max-w-2xl mx-auto">
          Thoughts on AI, NLP, and software engineering
        </p>

        <div className="max-w-4xl mx-auto space-y-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <div className="bg-[#1e293b] rounded-xl p-6 hover:border-[#f59e0b] border border-[#334155] transition-all hover:transform hover:translate-x-2">
                <div className="flex items-center text-sm text-[#f59e0b] mb-2">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <h2 className="text-2xl font-bold mb-3 hover:text-[#f59e0b] transition">
                  {post.title}
                </h2>
                <p className="text-gray-400 mb-4">{post.excerpt}</p>
                <div className="flex items-center text-[#f59e0b] group">
                  Read more
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
