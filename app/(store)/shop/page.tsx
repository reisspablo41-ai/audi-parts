import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import PartCard from '@/components/PartCard'
import SidebarFilters from '@/components/SidebarFilters'
import FitmentBar from '@/components/FitmentBar'
import ShopPagination from '@/components/ShopPagination'
import { Stagger, StaggerItem } from '@/components/motion'
import { getStoreParts, getStoreCategories, STORE_PAGE_SIZE } from '@/lib/services/store-service'

export const metadata: Metadata = {
  title: 'Shop All Parts',
  description:
    'Browse the full catalogue of genuine OEM and vetted aftermarket Audi spare parts. Filter by category, brand, price, and availability.',
}

interface ShopPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const filters = await searchParams
  const category = typeof filters.category === 'string' ? filters.category : ''
  const brand = typeof filters.brand === 'string' ? filters.brand : ''
  const minPrice = typeof filters.minPrice === 'string' ? parseFloat(filters.minPrice) : 0
  const maxPrice = typeof filters.maxPrice === 'string' ? parseFloat(filters.maxPrice) : Infinity
  const inStockOnly = filters.inStock === '1'
  const query = typeof filters.q === 'string' ? filters.q : ''
  const model = typeof filters.model === 'string' ? filters.model : ''
  const year = typeof filters.year === 'string' ? filters.year : ''
  const vehicleId = typeof filters.vehicle === 'string' ? filters.vehicle : ''
  const page = typeof filters.page === 'string' ? Math.max(1, parseInt(filters.page) || 1) : 1

  const [{ parts: filtered, total }, categories] = await Promise.all([
    getStoreParts({ category, brand, minPrice, maxPrice, inStockOnly, query, model, year, vehicleId, page }),
    getStoreCategories({ topLevelOnly: true }),
  ])

  const totalPages = Math.ceil(total / STORE_PAGE_SIZE)
  const hasActiveFilters = Boolean(category || brand || minPrice || maxPrice !== Infinity || inStockOnly)

  const heading = query
    ? `Search results for “${query}”`
    : model
      ? `Parts for the Audi ${model}${year ? ` · ${year}` : ''}`
      : 'All Audi parts'

  return (
    <>
      <Suspense>
        <FitmentBar />
      </Suspense>

      {/* Page header */}
      <div className="border-b border-audi-fog bg-audi-mist">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <nav className="flex items-center gap-2 text-[11px] text-audi-titanium mb-3">
            <Link href="/" className="hover:text-audi-anthracite transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-audi-steel">Shop</span>
          </nav>
          <h1 className="text-2xl font-bold text-audi-anthracite">{heading}</h1>
          <p className="text-[13px] text-audi-steel mt-1.5">
            <span className="technical">{total}</span> part{total !== 1 ? 's' : ''} found
            {hasActiveFilters && ' · filters applied'}
            {totalPages > 1 && ` · page ${page} of ${totalPages}`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9">
        <div className="flex gap-10">
          {/* Sidebar */}
          <div className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-36">
              <Suspense>
                <SidebarFilters categories={categories} />
              </Suspense>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Mobile filters */}
            <div className="lg:hidden mb-5">
              <details className="border border-audi-fog rounded-md bg-white group">
                <summary className="px-4 py-3 font-semibold text-sm cursor-pointer select-none flex items-center justify-between">
                  <span>Filters {hasActiveFilters && <span className="text-audi-red">· active</span>}</span>
                  <svg
                    className="w-4 h-4 text-audi-titanium transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 pt-1 border-t border-audi-fog">
                  <Suspense>
                    <SidebarFilters categories={categories} />
                  </Suspense>
                </div>
              </details>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-audi-fog rounded-lg bg-audi-mist/40">
                <svg className="w-10 h-10 text-audi-titanium mb-5" fill="none" stroke="currentColor" strokeWidth={1.3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <h2 className="text-lg font-bold text-audi-anthracite">No parts found</h2>
                <p className="text-audi-steel mt-2 max-w-sm text-sm leading-relaxed">
                  Try widening your filters or search terms. If you know the OE part number or have
                  your VIN, our technicians can find it for you.
                </p>
                <Link
                  href="/contact"
                  className="mt-7 inline-flex items-center h-10 px-5 bg-audi-anthracite text-white font-semibold rounded-md text-sm hover:bg-audi-red transition-colors"
                >
                  Ask a technician
                </Link>
              </div>
            ) : (
              <>
                <Stagger className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5" gap={0.05}>
                  {filtered.map((part) => (
                    <StaggerItem key={part.sku} className="h-full">
                      <PartCard part={part} vehicleId={vehicleId || undefined} />
                    </StaggerItem>
                  ))}
                </Stagger>
                <Suspense>
                  <ShopPagination currentPage={page} totalPages={totalPages} />
                </Suspense>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
