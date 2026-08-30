import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import PartCard from '@/components/PartCard'
import CategoryIcon from '@/components/CategoryIcon'
import { Stagger, StaggerItem } from '@/components/motion'
import SidebarFilters from '@/components/SidebarFilters'
import FitmentBar from '@/components/FitmentBar'
import { getCategoryById, getPartsByCategory, categories } from '@/lib/data'

interface CategoryPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { id } = await params
  const category = getCategoryById(id)
  if (!category) return {}
  return {
    title: `${category.name} Parts`,
    description: `Browse ${category.partCount} Audi ${category.name.toLowerCase()} components. ${category.description}`,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { id } = await params
  const filters = await searchParams

  const category = getCategoryById(id)
  if (!category) notFound()

  const brand = typeof filters.brand === 'string' ? filters.brand : ''
  const minPrice = typeof filters.minPrice === 'string' ? parseFloat(filters.minPrice) : 0
  const maxPrice = typeof filters.maxPrice === 'string' ? parseFloat(filters.maxPrice) : Infinity
  const inStockOnly = filters.inStock === '1'

  const categoryParts = getPartsByCategory(id).filter((p) => {
    if (brand && p.brand !== brand) return false
    if (p.price < minPrice) return false
    if (p.price > maxPrice) return false
    if (inStockOnly && !p.inStock) return false
    return true
  })

  return (
    <>
      <Suspense>
        <FitmentBar />
      </Suspense>

      {/* Category hero */}
      <div className="brushed-dark text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-30" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-audi-titanium mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-white">Shop</Link>
            <span>/</span>
            <span className="text-white font-medium">{category.name}</span>
          </nav>
          <div className="flex items-center gap-4">
            <CategoryIcon categoryId={category.id} fallback={category.icon} className="w-12 h-12 text-audi-red flex-shrink-0" />
            <div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <p className="text-audi-silver mt-1 max-w-xl text-sm">{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related categories */}
      <div className="bg-audi-mist border-b border-audi-fog">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                  cat.id === id
                    ? 'bg-audi-red text-white'
                    : 'bg-white border border-audi-fog text-audi-steel hover:border-audi-red hover:text-audi-red'
                }`}
              >
                <CategoryIcon categoryId={cat.id} fallback={cat.icon} className="w-3.5 h-3.5" /> {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-32">
              <Suspense>
                <SidebarFilters />
              </Suspense>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-audi-steel">
                {categoryParts.length} part{categoryParts.length !== 1 ? 's' : ''} in{' '}
                <strong className="text-audi-slate">{category.name}</strong>
              </p>
            </div>

            {categoryParts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <CategoryIcon categoryId={category.id} fallback={category.icon} className="w-10 h-10 mb-4 text-audi-titanium" />
                <h2 className="text-xl font-bold text-audi-anthracite">
                  No parts match your filters
                </h2>
                <p className="text-audi-steel mt-2">Try clearing some filters or browsing all categories.</p>
                <Link
                  href="/shop"
                  className="mt-6 inline-flex h-10 px-5 bg-audi-red text-white font-semibold rounded-lg text-sm items-center hover:bg-audi-red-dark transition-colors"
                >
                  Browse All Parts
                </Link>
              </div>
            ) : (
              <Stagger className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5" gap={0.05}>
                {categoryParts.map((part) => (
                  <StaggerItem key={part.sku} className="h-full">
                    <PartCard part={part} />
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
