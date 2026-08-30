import type { Metadata } from 'next'
import Link from 'next/link'
import ProductForm from '@/components/admin/ProductForm'

export const metadata: Metadata = { title: 'New Product' }

export default function NewProductPage() {
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
        <span className="text-audi-slate font-medium">New Product</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-audi-anthracite">Add New Product</h1>
        <p className="text-sm text-audi-steel mt-1">
          Fill in all required fields and upload images. The product will be live as soon as you save.
        </p>
      </div>

      <ProductForm mode="create" />
    </div>
  )
}
