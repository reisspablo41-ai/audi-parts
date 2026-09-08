import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublishedPosts } from '@/lib/services/blog-service'
import { absoluteUrl, SITE_NAME } from '@/lib/site'
import { Stagger, StaggerItem } from '@/components/motion'
import type { BlogPost } from '@/lib/types'

const TITLE = 'Audi Parts Guides & Technical Articles'
const DESCRIPTION =
  'Fitment guides, OE part number breakdowns, and repair write-ups for Audi owners. Written by the technicians who pick the parts.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl('/blog') },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/blog'),
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

export default async function BlogIndexPage() {
  const { posts, tableMissing } = await getPublishedPosts()

  return (
    <>
      {/* A CollectionPage + ItemList tells a crawler these are articles and in
          what order, which is what earns the multi-result treatment in search. */}
      {posts.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Blog',
              '@id': absoluteUrl('/blog'),
              name: TITLE,
              description: DESCRIPTION,
              url: absoluteUrl('/blog'),
              blogPost: posts.slice(0, 20).map((p) => ({
                '@type': 'BlogPosting',
                headline: p.title,
                url: absoluteUrl(`/blog/${p.slug}`),
                datePublished: p.publishedAt,
                author: { '@type': 'Organization', name: p.authorName },
              })),
            }),
          }}
        />
      )}

      <div className="border-b border-audi-fog bg-audi-mist">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="flex items-center gap-2 text-[11px] text-audi-titanium mb-3">
            <Link href="/" className="hover:text-audi-anthracite transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-audi-steel">Guides</span>
          </nav>
          <h1 className="text-3xl font-bold text-audi-anthracite">{TITLE}</h1>
          <p className="text-[15px] text-audi-steel mt-2 max-w-2xl leading-relaxed">
            {DESCRIPTION}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {posts.length === 0 ? (
          <div className="border border-dashed border-audi-fog rounded-lg bg-audi-mist/40 py-20 text-center">
            <h2 className="text-lg font-bold text-audi-anthracite">No articles yet</h2>
            <p className="text-audi-steel mt-2 text-sm">
              {tableMissing
                ? 'The blog is not set up on this database yet.'
                : 'The first guide is on its way. Check back shortly.'}
            </p>
          </div>
        ) : (
          <Stagger className="grid gap-5 sm:grid-cols-2" gap={0.05}>
            {posts.map((post) => (
              <StaggerItem key={post.slug} className="h-full">
                <PostCard post={post} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </>
  )
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col h-full border border-audi-fog rounded-lg bg-white overflow-hidden hover:border-audi-red transition-colors"
    >
      {post.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImageUrl}
          alt=""
          className="w-full aspect-[16/9] object-cover"
          loading="lazy"
        />
      )}
      <div className="p-5 flex flex-col flex-1">
        {post.tags.length > 0 && (
          <p className="eyebrow text-audi-red text-[10px] mb-2">{post.tags[0]}</p>
        )}
        <h2 className="text-lg font-bold text-audi-anthracite leading-snug group-hover:text-audi-red transition-colors">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-[13px] text-audi-steel mt-2 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        )}
        {post.publishedAt && (
          <time
            dateTime={post.publishedAt}
            className="text-[11px] text-audi-titanium mt-auto pt-4"
          >
            {new Date(post.publishedAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        )}
      </div>
    </Link>
  )
}
