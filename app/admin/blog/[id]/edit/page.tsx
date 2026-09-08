import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import BlogForm from '@/components/admin/BlogForm'
import { getPostById } from '@/lib/services/blog-service'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const post = await getPostById(Number(id))
  return { title: post ? `Edit – ${post.title}` : 'Edit Post' }
}

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params
  const postId = Number(id)
  if (!Number.isFinite(postId)) notFound()

  const post = await getPostById(postId)
  if (!post) notFound()

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
        <h1 className="text-2xl font-bold text-audi-anthracite">Edit post</h1>
        <p className="text-sm text-audi-steel font-medium technical">/blog/{post.slug}</p>
      </div>
      <BlogForm post={post} />
    </div>
  )
}
