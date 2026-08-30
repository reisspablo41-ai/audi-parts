'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Category } from '@/lib/types'

interface Props {
  initialQuery?: string
  initialCategory?: string
  categories: Category[]
}

export default function ProductListFilters({ 
  initialQuery = '', 
  initialCategory = '', 
  categories 
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)

  // Update URL with filters
  const applyFilters = useCallback((q: string, cat: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (q) params.set('q', q)
    else params.delete('q')
    
    if (cat) params.set('category', cat)
    else params.delete('category')

    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== initialQuery) {
        applyFilters(query, category)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [query, initialQuery, category, applyFilters])

  // Handle category change immediately
  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat)
    applyFilters(query, newCat)
  }

  const handleClear = () => {
    setQuery('')
    setCategory('')
    router.push(pathname)
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
      {/* Search Input Container */}
      <div className="relative flex-1 sm:flex-none">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-audi-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, SKU, part #..."
          className="h-10 pl-10 pr-10 border border-audi-fog rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-audi-red/20 focus:border-audi-red w-full sm:w-72 transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); applyFilters('', category); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-audi-titanium hover:text-audi-steel p-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Category Dropdown */}
      <div className="relative">
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="h-10 pl-4 pr-10 border border-audi-fog rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-audi-red/20 focus:border-audi-red w-full sm:w-48 appearance-none transition-all cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-audi-titanium pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Clear Button (Visible when filters active) */}
      {(query || category) && (
        <button
          onClick={handleClear}
          className="h-10 px-4 text-xs font-bold text-audi-steel hover:text-audi-red hover:bg-red-50 rounded-xl transition-all uppercase tracking-widest"
        >
          Clear
        </button>
      )}
    </div>
  )
}
