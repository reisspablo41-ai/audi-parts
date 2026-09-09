import { supabaseAdmin, supabase } from '@/lib/supabase'
import type { BlogPost, BlogStatus } from '@/lib/types'

const db = supabaseAdmin ?? supabase

function mapPost(row: any): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? '',
    body: row.body ?? '',
    coverImageUrl: row.cover_image_url ?? null,
    authorName: row.author_name ?? 'Audi Parts Sales',
    status: row.status as BlogStatus,
    // The SEO fields fall back to the editorial ones so a post is never
    // published with an empty <title> or meta description.
    metaTitle: row.meta_title || row.title,
    metaDescription: row.meta_description || row.excerpt || '',
    tags: row.tags ?? [],
    relatedSkus: row.related_skus ?? [],
    publishedAt: row.published_at ?? null,
    updatedAt: row.updated_at ?? row.created_at,
  }
}

/**
 * Same treatment as reviews and orders: a database that has not run
 * migration-blog.sql reports PGRST205 rather than an empty table. The blog
 * renders an empty state instead of a 500, and stops probing after the miss.
 */
let blogTableMissing = false

function isMissingTable(error: { code?: string }): boolean {
  if (error.code === 'PGRST205') {
    if (!blogTableMissing) {
      blogTableMissing = true
      console.info(
        '[blog-service] blog_posts table not present — the blog renders empty. ' +
          'Run migration-blog.sql to enable it.',
      )
    }
    return true
  }
  return false
}

const POST_SELECT =
  'id, slug, title, excerpt, body, cover_image_url, author_name, status, ' +
  'meta_title, meta_description, tags, related_skus, published_at, updated_at, created_at'

export interface BlogListResult {
  posts: BlogPost[]
  tableMissing: boolean
}

/**
 * Published posts, newest first — the public listing and the sitemap.
 *
 * Drafts are excluded here rather than filtered by the caller, so there is one
 * place that decides what the public and the crawlers can see.
 */
export async function getPublishedPosts(limit?: number): Promise<BlogListResult> {
  if (blogTableMissing) return { posts: [], tableMissing: true }

  let query = db
    .from('blog_posts')
    .select(POST_SELECT)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (limit) query = query.limit(limit)

  const { data, error } = await query

  if (error) {
    if (isMissingTable(error)) return { posts: [], tableMissing: true }
    throw error
  }

  return { posts: (data ?? []).map(mapPost), tableMissing: false }
}

/** A single published post by slug. Drafts return null to the public. */
export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  if (blogTableMissing) return null

  const { data, error } = await db
    .from('blog_posts')
    .select(POST_SELECT)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error) {
    if (isMissingTable(error)) return null
    throw error
  }

  return data ? mapPost(data) : null
}

/* ── Admin reads: drafts included ───────────────────────────── */

export async function getAllPosts(): Promise<BlogListResult> {
  if (!supabaseAdmin) throw new Error('Supabase admin client not initialized')
  if (blogTableMissing) return { posts: [], tableMissing: true }

  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select(POST_SELECT)
    .order('updated_at', { ascending: false })

  if (error) {
    if (isMissingTable(error)) return { posts: [], tableMissing: true }
    throw error
  }

  return { posts: (data ?? []).map(mapPost), tableMissing: false }
}

export async function getPostById(id: number): Promise<BlogPost | null> {
  if (!supabaseAdmin) throw new Error('Supabase admin client not initialized')
  if (blogTableMissing) return null

  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select(POST_SELECT)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    if (isMissingTable(error)) return null
    throw error
  }

  return data ? mapPost(data) : null
}
