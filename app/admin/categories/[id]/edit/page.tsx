import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CategoryForm from '@/components/admin/CategoryForm'
import { getCategoryById } from '@/lib/services/admin-service'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const category = await getCategoryById(id)
  return { title: category ? `Edit – ${category.name}` : 'Edit Category' }
}

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params
  const category = await getCategoryById(id)
  if (!category) notFound()

  return (
    <div>
      <nav className="flex items-center gap-2 text-sm text-audi-titanium mb-6">
        <Link href="/admin/categories" className="hover:text-audi-slate transition-colors">
          Categories
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-audi-slate font-medium">{category.name}</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-audi-anthracite">Edit Category</h1>
        <p className="text-sm text-audi-steel mt-1">Update category details and organization.</p>
      </div>

      <CategoryForm mode="edit" initialData={category} />
    </div>
  )
}
