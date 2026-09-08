import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductForm from '@/components/admin/ProductForm'
import { getPartBySku, getAllCategories, getAllVehicles } from '@/lib/services/admin-service'

interface Props {
  params: Promise<{ sku: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sku: encodedSku } = await params
  const sku = decodeURIComponent(encodedSku)
  const part = await getPartBySku(sku)
  return { title: part ? `Edit – ${part.name}` : 'Edit Product' }
}

export default async function EditProductPage({ params }: Props) {
  const { sku: encodedSku } = await params
  const sku = decodeURIComponent(encodedSku)
  const [part, categories, vehicles] = await Promise.all([
    getPartBySku(sku), getAllCategories(), getAllVehicles(),
  ])

  if (!part) notFound()

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-audi-titanium mb-6">
        <Link href="/admin/products" className="hover:text-audi-slate transition-colors">
          Products
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-audi-slate font-medium truncate max-w-xs">{part.name}</span>
      </nav>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-audi-anthracite">Edit Product</h1>
          <p className="text-sm text-audi-steel mt-1 font-mono">{part.sku}</p>
        </div>
        <Link
          href={`/product/${part.sku}`}
          target="_blank"
          className="flex items-center gap-1.5 h-9 px-4 border border-audi-fog rounded-lg text-sm text-audi-steel hover:bg-audi-mist transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View on Store
        </Link>
      </div>

      <ProductForm mode="edit" initialData={part} categories={categories} vehicles={vehicles} />
    </div>
  )
}
