import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublishedPostBySlug, getPublishedPosts } from '@/lib/services/blog-service'
import { getStorePartBySku } from '@/lib/services/store-service'
import { absoluteUrl, SITE_NAME } from '@/lib/site'
import Markdown from '@/components/Markdown'
import PartCard from '@/components/PartCard'
import type { Part } from '@/lib/types'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)

  // A missing post must not emit a canonical or an OG card — it would advertise
  // a URL that returns 404.
  if (!post) return { title: 'Article not found', robots: 'noindex' }

  const url = absoluteUrl(`/blog/${post.slug}`)

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.metaTitle,
      description: post.metaDescription,
      siteName: SITE_NAME,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: [post.authorName],
      tags: post.tags,
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
    },
    twitter: {
      card: post.coverImageUrl ? 'summary_large_image' : 'summary',
      title: post.metaTitle,
      description: post.metaDescription,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)
  if (!post) notFound()

  // Internal links to real product pages are the point of the blog. A SKU that
  // no longer exists is skipped rather than rendered as a broken link.
  const relatedParts = (
    await Promise.all(post.relatedSkus.slice(0, 6).map((sku) => getStorePartBySku(sku)))
  ).filter((p): p is Part => Boolean(p))

  const url = absoluteUrl(`/blog/${post.slug}`)

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': url,
    headline: post.title,
    description: post.metaDescription,
    url,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Organization', name: post.authorName },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: absoluteUrl('/') },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(post.coverImageUrl ? { image: [post.coverImageUrl] } : {}),
    ...(post.tags.length ? { keywords: post.tags.join(', ') } : {}),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: absoluteUrl('/blog') },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="flex items-center gap-2 text-[11px] text-audi-titanium mb-5">
          <Link href="/" className="hover:text-audi-anthracite transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-audi-anthracite transition-colors">
            Guides
          </Link>
          <span>/</span>
          <span className="text-audi-steel truncate">{post.title}</span>
        </nav>

        <header className="pb-7 border-b border-audi-fog">
          {post.tags.length > 0 && (
            <p className="eyebrow text-audi-red text-[10px] mb-3">{post.tags.join(' · ')}</p>
          )}
          <h1 className="text-3xl lg:text-4xl font-bold text-audi-anthracite leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-[16px] text-audi-steel mt-3 leading-relaxed">{post.excerpt}</p>
          )}
          <div className="flex items-center gap-2 text-[12px] text-audi-titanium mt-5">
            <span className="font-medium text-audi-steel">{post.authorName}</span>
            {post.publishedAt && (
              <>
                <span>·</span>
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </>
            )}
          </div>
        </header>

        {post.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImageUrl}
            alt=""
            className="w-full rounded-lg mt-8 aspect-[16/9] object-cover"
          />
        )}

        <div className="mt-8">
          <Markdown content={post.body} />
        </div>

        {relatedParts.length > 0 && (
          <section className="mt-14 pt-8 border-t border-audi-fog">
            <h2 className="text-lg font-bold text-audi-anthracite mb-1">Parts in this guide</h2>
            <p className="text-[13px] text-audi-steel mb-5">
              Fitment guaranteed by engine code. Ask a technician if you are unsure.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              {relatedParts.map((part) => (
                <PartCard key={part.sku} part={part} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 pt-8 border-t border-audi-fog">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-audi-steel hover:text-audi-red transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            All guides
          </Link>
        </div>
      </article>
    </>
  )
}

/**
 * Pre-renders the published posts at build time so a crawler's first request
 * is not a cold database read.
 */
export async function generateStaticParams() {
  const { posts } = await getPublishedPosts()
  return posts.map((post) => ({ slug: post.slug }))
}
