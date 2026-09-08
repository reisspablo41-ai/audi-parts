import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/site'
import { getPublishedPosts } from '@/lib/services/blog-service'
import { getStoreCategories, getSitemapParts } from '@/lib/services/store-service'

/**
 * The sitemap is generated rather than static so new parts and new posts are
 * discoverable without a redeploy.
 *
 * `/admin` and `/checkout` are deliberately absent — they are noindex in
 * robots.ts and listing them would ask crawlers to fetch pages they must not
 * index.
 */
export const revalidate = 3600

const STATIC_ROUTES: Array<{
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}> = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/shop', changeFrequency: 'daily', priority: 0.9 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/about', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/shipping', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/returns', changeFrequency: 'yearly', priority: 0.3 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  // A sitemap that throws is worse than a short one: Search Console reports the
  // whole file as unreadable. Each source is allowed to fail on its own.
  const [posts, categories, parts] = await Promise.all([
    getPublishedPosts().then((r) => r.posts).catch(() => []),
    getStoreCategories({}).catch(() => []),
    getSitemapParts().catch(() => []),
  ])

  for (const post of posts) {
    entries.push({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  for (const category of categories) {
    entries.push({
      url: absoluteUrl(`/category/${category.id}`),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    })
  }

  for (const part of parts) {
    entries.push({
      url: absoluteUrl(`/product/${part.sku}`),
      lastModified: part.updatedAt ? new Date(part.updatedAt) : now,
      changeFrequency: 'weekly',
      priority: 0.6,
    })
  }

  return entries
}
