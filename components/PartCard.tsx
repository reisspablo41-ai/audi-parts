'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Part } from '@/lib/types'
import { useCart } from '@/lib/cart-store'
import { useCurrency } from '@/lib/currency-store'
import CategoryIcon from './CategoryIcon'
import { motion, AnimatePresence, EASE, QUICK } from './motion'

interface PartCardProps {
  part: Part
  vehicleId?: string
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3 h-3 ${star <= Math.round(rating) ? 'text-amber-500' : 'text-audi-fog'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function PartCard({ part, vehicleId }: PartCardProps) {
  const { addItem } = useCart()
  const { format } = useCurrency()
  const [added, setAdded] = useState(false)

  const isFitment = vehicleId ? part.fitment.includes(vehicleId) : null
  // A part with no price is catalogued but not yet sellable — show it, and
  // route the visitor to a quote rather than a checkout for $0.00.
  const needsQuote = part.price <= 0
  const discount = part.compareAtPrice
    ? Math.round(((part.compareAtPrice - part.price) / part.compareAtPrice) * 100)
    : 0

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      sku: part.sku,
      name: part.name,
      price: part.price,
      quantity: 1,
      image: part.images?.[0],
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <Link href={`/product/${part.sku}`} className="group block h-full">
      <motion.article
        whileHover={{ y: -4 }}
        transition={QUICK}
        className="relative h-full bg-white border border-audi-fog rounded-lg overflow-hidden flex flex-col transition-shadow duration-300 group-hover:shadow-[0_16px_48px_-20px_rgba(16,19,23,0.4)] group-hover:border-audi-silver"
      >
        {/* Accent rule drawn on hover */}
        <span className="absolute inset-x-0 top-0 h-0.5 bg-audi-red z-10 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />

        {/* Image */}
        <div className="relative bg-audi-mist aspect-[4/3] flex items-center justify-center overflow-hidden">
          {part.images && part.images.length > 0 ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={part.images[0]}
              alt={part.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-audi-titanium">
              <CategoryIcon categoryId={part.categoryId} className="w-10 h-10" />
              <p className="technical text-[10px]">{part.partNumber}</p>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
            {discount > 0 && (
              <span className="bg-audi-red text-white text-[10px] font-semibold px-2 py-0.5 rounded technical">
                −{discount}%
              </span>
            )}
            {part.brand === 'Genuine OEM' && (
              <span className="bg-audi-anthracite/90 backdrop-blur-sm text-white text-[9px] font-semibold tracking-[0.12em] uppercase px-2 py-1 rounded">
                Genuine OEM
              </span>
            )}
            {/* Stock state is meaningless while a part is unpriced — showing
                "Backorder" next to "Price on request" reads as a broken card. */}
            {!part.inStock && !needsQuote && (
              <span className="bg-audi-steel text-white text-[9px] font-semibold tracking-[0.12em] uppercase px-2 py-1 rounded">
                Backorder
              </span>
            )}
          </div>

          {/* Fitment verdict for the selected garage vehicle */}
          {isFitment !== null && (
            <div className="absolute top-2.5 right-2.5">
              {isFitment ? (
                <span className="flex items-center gap-1 bg-audi-success text-white text-[10px] font-semibold px-2 py-1 rounded">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Fits
                </span>
              ) : (
                <span className="bg-audi-titanium text-white text-[10px] font-semibold px-2 py-1 rounded">
                  No fit
                </span>
              )}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          <p className="technical text-[10px] text-audi-titanium mb-1.5">{part.partNumber}</p>
          <h3 className="text-[14px] font-semibold text-audi-anthracite line-clamp-2 leading-snug group-hover:text-audi-red transition-colors">
            {part.name}
          </h3>

          <div className="flex items-center gap-2 mt-2">
            <StarRating rating={part.rating} />
            <span className="text-[11px] text-audi-titanium">({part.reviewCount})</span>
          </div>

          <div className="flex items-end justify-between mt-4 mb-3.5">
            <div className="flex items-baseline gap-2">
              {needsQuote ? (
                <span className="text-[15px] font-semibold text-audi-slate">
                  Price on request
                </span>
              ) : (
                <>
                  <span className="text-lg font-bold text-audi-anthracite technical">
                    {format(part.price)}
                  </span>
                  {part.compareAtPrice && (
                    <span className="text-[11px] text-audi-titanium line-through technical">
                      {format(part.compareAtPrice)}
                    </span>
                  )}
                </>
              )}
            </div>
            <span
              className={`text-[10px] font-medium ${
                needsQuote
                  ? 'text-audi-titanium'
                  : part.inStock
                    ? 'text-audi-success'
                    : 'text-audi-steel'
              }`}
            >
              {needsQuote
                ? 'Enquire'
                : part.inStock
                  ? `${part.stockCount} in stock`
                  : 'Out of stock'}
            </span>
          </div>

          {needsQuote ? (
            <span
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                window.location.href = `/contact?sku=${encodeURIComponent(part.sku)}`
              }}
              className="w-full mt-auto h-10 rounded-md text-[13px] font-semibold flex items-center justify-center gap-1.5 border border-audi-anthracite text-audi-anthracite hover:bg-audi-anthracite hover:text-white transition-colors"
            >
              Request a price
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          ) : (
          <button
            className={`relative w-full mt-auto h-10 rounded-md text-[13px] font-semibold overflow-hidden transition-colors ${
              part.inStock
                ? 'bg-audi-anthracite text-white hover:bg-audi-red'
                : 'bg-audi-mist text-audi-titanium cursor-not-allowed'
            }`}
            disabled={!part.inStock}
            onClick={handleAdd}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={added ? 'added' : 'idle'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="flex items-center justify-center gap-1.5 h-full"
              >
                {!part.inStock ? (
                  'Out of stock'
                ) : added ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Added to cart
                  </>
                ) : (
                  'Add to cart'
                )}
              </motion.span>
            </AnimatePresence>
          </button>
          )}
        </div>
      </motion.article>
    </Link>
  )
}
