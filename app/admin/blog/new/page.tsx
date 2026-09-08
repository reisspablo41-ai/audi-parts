import type { Metadata } from 'next'
import Link from 'next/link'
import BlogForm from '@/components/admin/BlogForm'

export const metadata: Metadata = { title: 'New Post' }

export default function NewBlogPostPage() {
  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-audi-titanium hover:text-audi-anthracite transition-colors mb-2"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All posts
        </Link>
        <h1 className="text-2xl font-bold text-audi-anthracite">New post</h1>
        <p className="text-sm text-audi-steel font-medium">
          Saves as a draft unless you set the status to published.
        </p>
      </div>
      <BlogForm />
    </div>
  )
}
