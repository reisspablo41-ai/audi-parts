'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { categories as fallbackCategories } from '@/lib/data'
import { Category } from '@/lib/types'
import CategoryIcon from './CategoryIcon'

interface SidebarFiltersProps {
  categories?: Category[]
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <h3 className="eyebrow text-audi-titanium mb-3">{title}</h3>
      {children}
    </div>
  )
}

export default function SidebarFilters({ categories = fallbackCategories }: SidebarFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeCategory = searchParams.get('category') ?? ''
  const activeBrand = searchParams.get('brand') ?? ''
  const activeMin = searchParams.get('minPrice') ?? ''
  const activeMax = searchParams.get('maxPrice') ?? ''
  const activeStock = searchParams.get('inStock') === '1'

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    // A filter change always returns the visitor to the first page of results.
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  function toggleStock() {
    const params = new URLSearchParams(searchParams.toString())
    if (activeStock) params.delete('inStock')
    else params.set('inStock', '1')
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  function clearAll() {
    const params = new URLSearchParams(searchParams.toString())
    for (const key of ['category', 'brand', 'minPrice', 'maxPrice', 'inStock', 'page']) {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const hasFilters = activeCategory || activeBrand || activeMin || activeMax || activeStock

  const priceInputCls =
    'w-full h-9 pl-6 pr-2 border border-audi-fog rounded-md text-sm bg-white ' +
    'focus:outline-none focus:border-audi-red focus:ring-2 focus:ring-audi-red/15 transition-colors'

  return (
    <aside className="w-full">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-audi-fog">
        <h2 className="text-sm font-bold text-audi-anthracite">Filters</h2>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-audi-red hover:underline font-medium">
            Clear all
          </button>
        )}
      </div>

      <Section title="Category">
        <div className="space-y-0.5">
          <button
            onClick={() => updateParam('category', '')}
            className={`w-full text-left px-2.5 py-2 rounded-md text-[13px] transition-colors ${
              !activeCategory
                ? 'bg-audi-anthracite text-white font-medium'
                : 'text-audi-slate hover:bg-audi-mist'
            }`}
          >
            All categories
          </button>
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => updateParam('category', cat.id)}
                className={`w-full text-left px-2.5 py-2 rounded-md text-[13px] transition-colors flex items-center justify-between gap-2 ${
                  isActive
                    ? 'bg-audi-anthracite text-white font-medium'
                    : 'text-audi-slate hover:bg-audi-mist'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <CategoryIcon
                    categoryId={cat.id}
                    fallback={cat.icon}
                    className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-audi-titanium'}`}
                  />
                  <span className="truncate">{cat.name}</span>
                </span>
                <span
                  className={`technical text-[10px] flex-shrink-0 ${
                    isActive ? 'text-white/60' : 'text-audi-titanium'
                  }`}
                >
                  {cat.partCount}
                </span>
              </button>
            )
          })}
        </div>
      </Section>

      <Section title="Brand">
        <div className="space-y-2">
          {['', 'Genuine OEM', 'Aftermarket'].map((brand) => (
            <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="brand"
                checked={activeBrand === brand}
                onChange={() => updateParam('brand', brand)}
                className="accent-audi-red"
              />
              <span className="text-[13px] text-audi-slate group-hover:text-audi-anthracite transition-colors">
                {brand || 'All brands'}
              </span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Price range">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-audi-titanium text-sm">$</span>
            <input
              type="number"
              placeholder="Min"
              aria-label="Minimum price"
              value={activeMin}
              onChange={(e) => updateParam('minPrice', e.target.value)}
              className={priceInputCls}
              min={0}
            />
          </div>
          <span className="text-audi-titanium text-sm">–</span>
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-audi-titanium text-sm">$</span>
            <input
              type="number"
              placeholder="Max"
              aria-label="Maximum price"
              value={activeMax}
              onChange={(e) => updateParam('maxPrice', e.target.value)}
              className={priceInputCls}
              min={0}
            />
          </div>
        </div>
      </Section>

      <Section title="Availability">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={activeStock}
            onChange={toggleStock}
            className="w-4 h-4 accent-audi-red rounded"
          />
          <span className="text-[13px] text-audi-slate">In stock only</span>
        </label>
      </Section>
    </aside>
  )
}
