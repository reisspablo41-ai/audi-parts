'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Category } from '@/lib/types'

interface CategoryFormProps {
  initialData?: Partial<Category>
  mode: 'create' | 'edit'
}

interface FormState {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  sortOrder: string
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-audi-steel mb-1.5 uppercase tracking-wide">
        {label}{required && <span className="text-audi-red ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'w-full h-10 px-3 border border-audi-fog rounded-lg text-sm bg-white focus:outline-none focus:border-audi-red focus:ring-1 focus:ring-audi-red/20 transition-colors'
const textareaCls = 'w-full px-3 py-2.5 border border-audi-fog rounded-lg text-sm bg-white focus:outline-none focus:border-audi-red focus:ring-1 focus:ring-audi-red/20 transition-colors resize-none'

export default function CategoryForm({ initialData, mode }: CategoryFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState<FormState>({
    id: initialData?.id ?? '',
    name: initialData?.name ?? '',
    slug: initialData?.slug ?? '',
    description: initialData?.description ?? '',
    icon: initialData?.icon ?? '🔧',
    sortOrder: (initialData as any)?.sortOrder?.toString() ?? '0',
  })

  function set(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    if (!form.id.trim()) { setError('Category ID is required'); setSaving(false); return }
    if (!form.name.trim()) { setError('Category name is required'); setSaving(false); return }
    if (!form.slug.trim()) { setError('Slug is required'); setSaving(false); return }

    const payload = {
      id: form.id.trim(),
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      icon: form.icon.trim(),
      sort_order: parseInt(form.sortOrder) || 0,
    }

    const url = mode === 'edit'
      ? `/api/admin/categories/${form.id}`
      : '/api/admin/categories'
    const method = mode === 'edit' ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      setSaving(false)

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
        return
      }

      setSaved(true)
      setTimeout(() => router.push('/admin/categories'), 1000)
    } catch (err) {
      setSaving(false)
      setError('Connection failed. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="bg-white rounded-lg border border-audi-fog p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Category Name" required>
            <input
              value={form.name}
              onChange={(e) => {
                set('name', e.target.value)
                if (mode === 'create' && !form.id) {
                  const slug = e.target.value.toLowerCase().replace(/\s+/g, '-')
                  set('id', slug)
                  set('slug', slug)
                }
              }}
              placeholder="e.g. Engine Parts"
              className={inputCls}
            />
          </Field>

          <Field label="Icon / Emoji" required>
            <input
              value={form.icon}
              onChange={(e) => set('icon', e.target.value)}
              placeholder="🔧 or ⚙️"
              className={inputCls}
            />
          </Field>

          <Field label="Category ID (Key)" required>
            <input
              value={form.id}
              onChange={(e) => set('id', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder="engine"
              disabled={mode === 'edit'}
              className={`${inputCls} font-mono ${mode === 'edit' ? 'bg-audi-mist text-audi-titanium' : ''}`}
            />
          </Field>

          <Field label="URL Slug" required>
            <input
              value={form.slug}
              onChange={(e) => set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder="engine"
              className={`${inputCls} font-mono`}
            />
          </Field>

          <Field label="Sort Order">
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => set('sortOrder', e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            placeholder="A brief summary of what's in this category…"
            className={textareaCls}
          />
        </Field>
      </div>

      <div className="flex items-center justify-between bg-white border border-audi-fog p-4 rounded-lg">
        <div className="flex-1">
          {error && <p className="text-sm text-red-600 flex items-center gap-1.5"><span className="w-1 h-1 bg-red-600 rounded-full" /> {error}</p>}
          {saved && <p className="text-sm text-audi-success flex items-center gap-1.5"><span className="w-1 h-1 bg-audi-success rounded-full" /> Changes saved!</p>}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/categories')}
            className="h-10 px-5 border border-audi-fog rounded-lg text-sm font-semibold text-audi-steel hover:bg-audi-mist transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || saved}
            className="h-10 px-6 bg-audi-anthracite text-white font-bold rounded-lg text-sm hover:bg-black transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {saving ? 'Saving…' : mode === 'create' ? 'Create Category' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  )
}
