'use server'

import { supabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { BLOG_STATUSES, type BlogStatus } from '@/lib/types'

export interface BlogPostInput {
  slug: string
  title: string
  excerpt: string
  body: string
  coverImageUrl: string
  authorName: string
  status: string
  metaTitle: string
  metaDescription: string
  /** Comma-separated in the form; split here. */
  tags: string
  relatedSkus: string
}

/** "a, b , ,c" -> ["a","b","c"] */
function splitList(value: string): string[] {
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}

function normaliseSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

function validate(input: BlogPostInput): string | null {
  if (!input.title.trim()) return 'Title is required'
  if (!normaliseSlug(input.slug || input.title)) return 'Slug is required'
  if (!BLOG_STATUSES.includes(input.status as BlogStatus)) {
    return `Unknown status: ${input.status}`
  }
  if (input.metaDescription.length > 200) {
    return 'Meta description should be 200 characters or fewer'
  }
  return null
}

function toRow(input: BlogPostInput) {
  return {
    slug: normaliseSlug(input.slug || input.title),
    title: input.title.trim(),
    excerpt: input.excerpt.trim(),
    body: input.body,
    cover_image_url: input.coverImageUrl.trim() || null,
    author_name: input.authorName.trim() || 'AudiParts Direct',
    status: input.status,
    meta_title: input.metaTitle.trim() || null,
    meta_description: input.metaDescription.trim() || null,
    tags: splitList(input.tags),
    related_skus: splitList(input.relatedSkus),
    updated_at: new Date().toISOString(),
  }
}

/** Revalidates every surface a post appears on, including the sitemap. */
function revalidatePost(slug: string) {
  revalidatePath('/blog')
  revalidatePath(`/blog/${slug}`)
  revalidatePath('/sitemap.xml')
  revalidatePath('/admin/blog')
}

export async function createPost(input: BlogPostInput) {
  if (!supabaseAdmin) return { success: false, error: 'Database connection error' }

  const invalid = validate(input)
  if (invalid) return { success: false, error: invalid }

  const row = toRow(input)

  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .insert({
      ...row,
      // Publishing stamps the date here so published_at is never null on a
      // live post — the sitemap's lastmod and article:published_time need it.
      published_at: row.status === 'published' ? new Date().toISOString() : null,
    })
    .select('id, slug')
    .single()

  if (error) {
    if (error.code === '23505') return { success: false, error: 'That slug is already taken' }
    console.error('Error creating post:', error)
    return { success: false, error: error.message }
  }

  revalidatePost(data.slug)
  return { success: true, id: data.id as number, slug: data.slug as string }
}

export async function updatePost(id: number, input: BlogPostInput) {
  if (!supabaseAdmin) return { success: false, error: 'Database connection error' }

  const invalid = validate(input)
  if (invalid) return { success: false, error: invalid }

  const row = toRow(input)

  const { data: existing } = await supabaseAdmin
    .from('blog_posts')
    .select('slug, published_at')
    .eq('id', id)
    .maybeSingle()

  // published_at is set on the first publish and then left alone — a later
  // edit must not rewrite the original publication date.
  const publishedAt =
    row.status === 'published'
      ? (existing?.published_at ?? new Date().toISOString())
      : existing?.published_at ?? null

  const { error } = await supabaseAdmin
    .from('blog_posts')
    .update({ ...row, published_at: publishedAt })
    .eq('id', id)

  if (error) {
    if (error.code === '23505') return { success: false, error: 'That slug is already taken' }
    console.error('Error updating post:', error)
    return { success: false, error: error.message }
  }

  // A changed slug leaves the old URL cached; clear both.
  if (existing?.slug && existing.slug !== row.slug) revalidatePost(existing.slug)
  revalidatePost(row.slug)
  return { success: true, id, slug: row.slug }
}

export async function deletePost(id: number, slug: string) {
  if (!supabaseAdmin) return { success: false, error: 'Database connection error' }

  const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', id)

  if (error) {
    console.error('Error deleting post:', error)
    return { success: false, error: error.message }
  }

  revalidatePost(slug)
  return { success: true }
}
