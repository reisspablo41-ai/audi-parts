'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CategoryIcon from './CategoryIcon'
import { motion, AnimatePresence, EASE } from './motion'

interface SearchResult {
  sku: string
  name: string
  partNumber: string
  price: number
  categoryId: string
  inStock: boolean
  image: string | null
}

interface Props {
  onClose: () => void
  /**
   * Take focus on mount. Off by default — the header renders this component
   * inline on every page, and grabbing focus there would scroll the viewport
   * and pop the mobile keyboard on load. The mobile menu opts in.
   */
  autoFocus?: boolean
}

export default function SearchOverlay({ onClose, autoFocus = false }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); setLoading(false); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.results ?? [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(val), 300)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    onClose()
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`)
  }

  const showDropdown = focused && (loading || query.length >= 2)

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            placeholder="Search by part number, name, or engine code…"
            className="w-full h-10 pl-4 pr-[76px] border border-audi-fog rounded-md text-sm text-audi-anthracite placeholder:text-audi-titanium focus:outline-none focus:border-audi-anthracite transition-colors bg-white"
          />
          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus() }}
              className="absolute right-11 top-0 h-10 w-8 flex items-center justify-center text-audi-titanium hover:text-audi-steel"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            className="absolute right-0 top-0 h-10 w-11 flex items-center justify-center bg-audi-anthracite text-white rounded-r-md hover:bg-audi-red transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </button>
        </div>
      </form>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-md shadow-2xl shadow-audi-anthracite/20 border border-audi-fog z-[100] overflow-hidden"
          >
          {loading ? (
            <div className="flex items-center gap-3 px-4 py-5 text-sm text-audi-titanium">
              <span className="w-4 h-4 border-2 border-audi-fog border-t-audi-red rounded-full animate-spin flex-shrink-0" />
              Searching…
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-5 text-sm text-audi-titanium text-center">
              No parts found for <span className="font-semibold text-audi-steel">&ldquo;{query}&rdquo;</span>
            </div>
          ) : (
            <>
              <ul>
                {results.map((result) => (
                  <li key={result.sku}>
                    <Link
                      href={`/product/${result.sku}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-audi-mist transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="w-12 h-12 rounded-lg bg-audi-fog flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {result.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={result.image} alt={result.name} className="w-full h-full object-cover" />
                        ) : (
                          <CategoryIcon categoryId={result.categoryId} className="w-5 h-5 text-audi-titanium" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-audi-anthracite truncate">{result.name}</p>
                        <p className="technical text-[10px] text-audi-titanium mt-0.5">{result.partNumber}</p>
                      </div>

                      {/* Price + stock */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-audi-anthracite technical">${result.price.toFixed(2)}</p>
                        <p className={`text-[10px] font-semibold mt-0.5 ${result.inStock ? 'text-audi-success' : 'text-audi-steel'}`}>
                          {result.inStock ? 'In Stock' : 'Out of Stock'}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="border-t border-audi-fog px-4 py-2.5">
                <Link
                  href={`/shop?q=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="flex items-center gap-1 text-sm font-semibold text-audi-red hover:underline"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                  See all results for &ldquo;{query}&rdquo;
                </Link>
              </div>
            </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
