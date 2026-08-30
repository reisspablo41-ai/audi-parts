'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart-store'
import { Part } from '@/lib/types'
import { motion, AnimatePresence, EASE } from './motion'

export default function AddToCart({ part }: { part: Part }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [saved, setSaved] = useState(false)

  // Unpriced parts are catalogued but not sellable. Send the visitor to a
  // quote instead of letting them check out at $0.00.
  const needsQuote = part.price <= 0

  function handleAdd() {
    addItem({
      sku: part.sku,
      name: part.name,
      price: part.price,
      quantity,
      image: part.images?.[0],
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  if (needsQuote) {
    return (
      <div className="mb-6">
        <a
          href={`/contact?sku=${encodeURIComponent(part.sku)}`}
          className="group w-full h-12 rounded-md font-semibold text-sm flex items-center justify-center gap-2 bg-audi-anthracite text-white hover:bg-audi-red transition-colors"
        >
          Request a price for this part
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
        <p className="text-xs text-audi-steel mt-2.5 leading-relaxed">
          This part is in our catalogue but not yet priced online. Send us the
          part number and your VIN and we will confirm price, availability, and
          fitment.
        </p>
      </div>
    )
  }

  return (
    <div className="flex gap-2.5 mb-6">
      <div className="flex items-center border border-audi-fog rounded-md bg-white">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          aria-label="Decrease quantity"
          className="w-10 h-12 text-lg text-audi-steel hover:text-audi-anthracite transition-colors"
        >
          −
        </button>
        <span className="w-9 text-center text-sm font-semibold technical">{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          aria-label="Increase quantity"
          className="w-10 h-12 text-lg text-audi-steel hover:text-audi-anthracite transition-colors"
        >
          +
        </button>
      </div>

      <motion.button
        disabled={!part.inStock}
        onClick={handleAdd}
        whileHover={part.inStock ? { y: -2 } : undefined}
        whileTap={part.inStock ? { y: 0, scale: 0.99 } : undefined}
        transition={{ duration: 0.2, ease: EASE }}
        className={`relative flex-1 h-12 rounded-md font-semibold text-sm overflow-hidden transition-colors ${
          part.inStock
            ? 'bg-audi-red text-white hover:bg-audi-red-dark'
            : 'bg-audi-mist text-audi-titanium cursor-not-allowed'
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={added ? 'added' : 'idle'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="absolute inset-0 flex items-center justify-center gap-2"
          >
            {!part.inStock ? (
              'Out of stock'
            ) : added ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Added to cart
              </>
            ) : (
              'Add to cart'
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <button
        onClick={() => setSaved(!saved)}
        aria-label={saved ? 'Remove from saved parts' : 'Save this part'}
        aria-pressed={saved}
        className={`w-12 h-12 border rounded-md flex items-center justify-center transition-colors ${
          saved
            ? 'border-audi-red text-audi-red bg-audi-red-soft'
            : 'border-audi-fog text-audi-titanium hover:border-audi-titanium hover:text-audi-steel bg-white'
        }`}
      >
        <motion.svg
          className="w-5 h-5"
          fill={saved ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={1.6}
          viewBox="0 0 24 24"
          animate={saved ? { scale: [1, 1.25, 1] } : { scale: 1 }}
          transition={{ duration: 0.32, ease: EASE }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </motion.svg>
      </button>
    </div>
  )
}
