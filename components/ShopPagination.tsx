'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Props {
  currentPage: number
  totalPages: number
}

function pageWindow(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  if (current > 3) pages.push('…')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p)
  if (current < total - 2) pages.push('…')
  pages.push(total)
  return pages
}

export default function ShopPagination({ currentPage, totalPages }: Props) {
  const searchParams = useSearchParams()

  function buildUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (page <= 1) params.delete('page')
    else params.set('page', String(page))
    return `/shop?${params.toString()}`
  }

  if (totalPages <= 1) return null

  const btnBase = 'inline-flex items-center justify-center h-9 min-w-[2.25rem] px-2 rounded-md text-sm font-medium transition-colors'
  const btnActive = 'bg-audi-anthracite text-white'
  const btnIdle = 'text-audi-steel hover:bg-audi-mist hover:text-audi-anthracite'
  const btnDisabled = 'text-audi-silver pointer-events-none'

  return (
    <nav className="flex items-center justify-center gap-1 mt-10" aria-label="Pagination">
      <Link
        href={buildUrl(currentPage - 1)}
        aria-disabled={currentPage === 1}
        className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnIdle}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Link>

      {pageWindow(currentPage, totalPages).map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="px-1 text-audi-titanium text-sm select-none">…</span>
        ) : (
          <Link
            key={p}
            href={buildUrl(p)}
            aria-current={p === currentPage ? 'page' : undefined}
            className={`${btnBase} ${p === currentPage ? btnActive : btnIdle}`}
          >
            {p}
          </Link>
        )
      )}

      <Link
        href={buildUrl(currentPage + 1)}
        aria-disabled={currentPage === totalPages}
        className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnIdle}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </nav>
  )
}
