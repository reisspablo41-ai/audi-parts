'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createPost, updatePost, type BlogPostInput } from '@/app/actions/blog'
import { BLOG_STATUSES, type BlogPost } from '@/lib/types'

/** Mirrors normaliseSlug in app/actions/blog.ts; the server still has the say. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

const EMPTY: BlogPostInput = {
  slug: '',
  title: '',
  excerpt: '',
  body: '',
  coverImageUrl: '',
  authorName: 'AudiParts Direct',
  status: 'draft',
  metaTitle: '',
  metaDescription: '',
  tags: '',
  relatedSkus: '',
}

export default function BlogForm({ post }: { post?: BlogPost }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  // A slug the author has edited by hand is never overwritten by the title.
  const [slugTouched, setSlugTouched] = useState(Boolean(post))

  const [form, setForm] = useState<BlogPostInput>(
    post
      ? {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          body: post.body,
          coverImageUrl: post.coverImageUrl ?? '',
          authorName: post.authorName,
          status: post.status,
          metaTitle: post.metaTitle === post.title ? '' : post.metaTitle,
          metaDescription: post.metaDescription === post.excerpt ? '' : post.metaDescription,
          tags: post.tags.join(', '),
          relatedSkus: post.relatedSkus.join(', '),
        }
      : EMPTY,
  )

  function set<K extends keyof BlogPostInput>(key: K, value: BlogPostInput[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function onTitleChange(value: string) {
    setForm((f) => ({ ...f, title: value, slug: slugTouched ? f.slug : slugify(value) }))
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = post ? await updatePost(post.id, form) : await createPost(form)
      if (!result.success) {
        setError(result.error ?? 'Could not save the post')
        return
      }
      router.push('/admin/blog')
      router.refresh()
    })
  }

  const metaTitlePreview = form.metaTitle || form.title || 'Post title'
  const metaDescPreview = form.metaDescription || form.excerpt || 'No description set.'

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-4xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
          {error}
        </div>
      )}

      <Panel title="Content">
        <Field label="Title" required>
          <input
            value={form.title}
            onChange={(e) => onTitleChange(e.target.value)}
            required
            className={INPUT}
            placeholder="How to identify the right radiator for your Audi"
          />
        </Field>

        <Field label="Slug" required hint="The URL. Avoid changing it once published — inbound links and rankings are tied to it.">
          <div className="flex items-center gap-2">
            <span className="text-xs text-audi-titanium technical whitespace-nowrap">/blog/</span>
            <input
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true)
                set('slug', e.target.value)
              }}
              onBlur={(e) => set('slug', slugify(e.target.value))}
              required
              className={`${INPUT} technical`}
              placeholder="identify-the-right-audi-radiator"
            />
          </div>
        </Field>

        <Field label="Excerpt" hint="One or two sentences. Used on the listing card and as the search snippet fallback.">
          <textarea
            value={form.excerpt}
            onChange={(e) => set('excerpt', e.target.value)}
            rows={2}
            className={TEXTAREA}
          />
        </Field>

        <Field
          label="Body"
          hint="Markdown: # ## ### headings, - or 1. lists, > quote, **bold**, *italic*, `code`, [text](/shop). Internal links like /product/AUD-… are what make a post pull its weight."
        >
          <textarea
            value={form.body}
            onChange={(e) => set('body', e.target.value)}
            rows={18}
            className={`${TEXTAREA} font-mono text-[13px] leading-relaxed`}
          />
        </Field>
      </Panel>

      <Panel title="Search appearance">
        <Field label="Meta title" hint="Defaults to the title. Aim for under 60 characters.">
          <input
            value={form.metaTitle}
            onChange={(e) => set('metaTitle', e.target.value)}
            className={INPUT}
            placeholder={form.title || 'Defaults to the post title'}
          />
        </Field>

        <Field
          label="Meta description"
          hint={`Defaults to the excerpt. Aim for 150–160 characters. ${form.metaDescription.length}/200 used.`}
        >
          <textarea
            value={form.metaDescription}
            onChange={(e) => set('metaDescription', e.target.value)}
            rows={2}
            maxLength={200}
            className={TEXTAREA}
          />
        </Field>

        {/* Shows the author what the result actually looks like, which is the
            only way meta fields get written well. */}
        <div className="rounded-lg border border-audi-fog bg-audi-mist/50 p-4">
          <p className="text-[10px] font-bold text-audi-titanium uppercase tracking-widest mb-2">
            Search preview
          </p>
          <p className="text-[#1a0dab] text-[17px] leading-tight truncate">{metaTitlePreview}</p>
          <p className="text-[#006621] text-xs mt-0.5 technical truncate">
            /blog/{form.slug || 'your-slug'}
          </p>
          <p className="text-[13px] text-audi-steel mt-1 line-clamp-2">{metaDescPreview}</p>
        </div>
      </Panel>

      <Panel title="Metadata">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Author">
            <input
              value={form.authorName}
              onChange={(e) => set('authorName', e.target.value)}
              className={INPUT}
            />
          </Field>
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
              className={`${INPUT} capitalize`}
            >
              {BLOG_STATUSES.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Cover image URL" hint="Also used as the social share image.">
          <input
            value={form.coverImageUrl}
            onChange={(e) => set('coverImageUrl', e.target.value)}
            className={INPUT}
            placeholder="https://…"
          />
        </Field>

        <Field label="Tags" hint="Comma separated, e.g. Cooling, Fitment guide">
          <input
            value={form.tags}
            onChange={(e) => set('tags', e.target.value)}
            className={INPUT}
          />
        </Field>

        <Field
          label="Related SKUs"
          hint="Comma separated, e.g. AUD-4M0121251M, AUD-8W0121251AA. Rendered as product cards at the end of the post."
        >
          <input
            value={form.relatedSkus}
            onChange={(e) => set('relatedSkus', e.target.value)}
            className={`${INPUT} technical`}
          />
        </Field>
      </Panel>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="h-10 px-5 bg-audi-red text-white font-semibold rounded-lg text-sm hover:bg-audi-red-dark disabled:opacity-60 transition-colors"
        >
          {pending ? 'Saving…' : post ? 'Save changes' : 'Create post'}
        </button>
        <Link
          href="/admin/blog"
          className="h-10 px-5 inline-flex items-center border border-audi-fog rounded-lg text-sm text-audi-steel hover:bg-audi-mist transition-colors"
        >
          Cancel
        </Link>
        {post?.status === 'published' && (
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            className="ml-auto text-sm font-semibold text-audi-steel hover:text-audi-red transition-colors"
          >
            View live ↗
          </Link>
        )}
      </div>
    </form>
  )
}

const FIELD_BASE =
  'w-full px-3 rounded-lg border border-audi-fog bg-white text-sm text-audi-anthracite ' +
  'placeholder:text-audi-silver focus:outline-none focus:border-audi-red transition-colors'

const INPUT = `${FIELD_BASE} h-10`
/** Same look, but height comes from `rows` rather than a fixed h-10. */
const TEXTAREA = `${FIELD_BASE} py-2.5`

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-audi-fog">
      <div className="px-5 py-4 border-b border-audi-fog">
        <h2 className="font-bold text-audi-anthracite">{title}</h2>
      </div>
      <div className="px-5 py-5 space-y-4">{children}</div>
    </div>
  )
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-audi-slate mb-1.5">
        {label}
        {required && <span className="text-audi-red ml-0.5">*</span>}
      </span>
      {children}
      {hint && <span className="block text-[11px] text-audi-titanium mt-1.5">{hint}</span>}
    </label>
  )
}
