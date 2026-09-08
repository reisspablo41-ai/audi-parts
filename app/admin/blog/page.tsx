import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/services/blog-service'
import { deletePost } from '@/app/actions/blog'
import type { BlogPost } from '@/lib/types'

export const metadata: Metadata = { title: 'Blog' }

export default async function AdminBlogPage() {
  const { posts, tableMissing } = await getAllPosts()

  const published = posts.filter((p) => p.status === 'published').length
  const drafts = posts.length - published

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-audi-anthracite">Blog</h1>
          <p className="text-sm text-audi-steel font-medium">
            Guides and technical articles. Published posts enter the sitemap automatically.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Stat label="Published" value={String(published)} />
          <Stat label="Drafts" value={String(drafts)} />
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 h-10 px-4 bg-audi-red text-white font-semibold rounded-lg text-sm hover:bg-audi-red-dark transition-colors whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New post
          </Link>
        </div>
      </div>

      {tableMissing ? (
        <MissingTableNotice />
      ) : (
        <div className="bg-white rounded-2xl border border-audi-fog overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-audi-mist border-b border-audi-fog">
                  <Th>Title</Th>
                  <Th>Status</Th>
                  <Th>Links</Th>
                  <Th>Updated</Th>
                  <Th align="right">Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-audi-mist">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <p className="font-bold text-audi-anthracite">No posts yet</p>
                      <p className="text-audi-titanium text-xs mt-1">
                        Write the first guide and it will appear on /blog and in the sitemap.
                      </p>
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => <PostRow key={post.id} post={post} />)
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function PostRow({ post }: { post: BlogPost }) {
  const isPublished = post.status === 'published'

  return (
    <tr className="hover:bg-audi-mist/50 transition-colors">
      <td className="px-6 py-4">
        <Link
          href={`/admin/blog/${post.id}/edit`}
          className="font-bold text-audi-anthracite hover:text-audi-red transition-colors"
        >
          {post.title}
        </Link>
        <p className="text-xs technical text-audi-titanium">/blog/{post.slug}</p>
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center h-6 px-2.5 rounded-full border text-[11px] font-bold uppercase tracking-wide ${
            isPublished
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {post.status}
        </span>
      </td>
      <td className="px-6 py-4">
        {/* Internal links are the reason a post has SEO value, so the count is
            worth surfacing next to the post rather than buried in the editor. */}
        <p className="text-audi-steel text-xs">
          {post.relatedSkus.length} part{post.relatedSkus.length !== 1 ? 's' : ''}
        </p>
        {post.tags.length > 0 && (
          <p className="text-[11px] text-audi-titanium truncate max-w-[160px]">
            {post.tags.join(', ')}
          </p>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <p className="text-xs font-bold text-audi-titanium">
          {new Date(post.updatedAt).toLocaleDateString()}
        </p>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          {isPublished && (
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              className="p-2 text-audi-titanium hover:text-audi-anthracite hover:bg-audi-fog rounded-lg transition-all"
              title="View live"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          )}
          <Link
            href={`/admin/blog/${post.id}/edit`}
            className="p-2 text-audi-titanium hover:text-audi-anthracite hover:bg-audi-fog rounded-lg transition-all"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          <form
            action={async () => {
              'use server'
              await deletePost(post.id, post.slug)
            }}
          >
            <button
              type="submit"
              className="p-2 text-audi-titanium hover:text-audi-red hover:bg-red-50 rounded-lg transition-all"
              title="Delete post"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </form>
        </div>
      </td>
    </tr>
  )
}

function Th({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return (
    <th
      className={`${align === 'right' ? 'text-right' : 'text-left'} px-6 py-4 text-xs font-bold text-audi-titanium uppercase tracking-widest`}
    >
      {children}
    </th>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white px-4 py-2 rounded-xl border border-audi-fog shadow-sm">
      <p className="text-[10px] font-bold text-audi-titanium uppercase tracking-widest">{label}</p>
      <p className="text-lg font-bold text-audi-anthracite">{value}</p>
    </div>
  )
}

function MissingTableNotice() {
  return (
    <div className="bg-white rounded-2xl border border-amber-200 p-8">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div className="min-w-0">
          <h2 className="font-bold text-audi-anthracite">The blog_posts table does not exist yet</h2>
          <p className="text-sm text-audi-steel mt-1.5 leading-relaxed">
            Run{' '}
            <code className="technical text-xs bg-audi-mist px-1.5 py-0.5 rounded">
              migration-blog.sql
            </code>{' '}
            in the Supabase SQL editor, then reload this page. Until then posts cannot be saved,
            and <code className="technical text-xs bg-audi-mist px-1.5 py-0.5 rounded">/blog</code>{' '}
            renders an empty state.
          </p>
        </div>
      </div>
    </div>
  )
}
