'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useCart } from '@/lib/cart-store'
import { motion, AnimatePresence, EASE } from './motion'

export default function CartDrawer() {
  const { state, toggleCart, removeItem, updateQuantity, subtotal, totalCount } = useCart()

  // Close on Escape, and lock body scroll while the drawer is open.
  useEffect(() => {
    if (!state.isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') toggleCart()
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [state.isOpen, toggleCart])

  return (
    <AnimatePresence>
      {state.isOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-audi-anthracite/55 backdrop-blur-[2px]"
            onClick={toggleCart}
          />

          <motion.aside
            role="dialog"
            aria-label="Shopping cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.38, ease: EASE }}
            className="absolute inset-y-0 right-0 w-screen max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-audi-fog flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-audi-anthracite">Your cart</h2>
                <p className="eyebrow text-audi-titanium mt-1">
                  {totalCount} {totalCount === 1 ? 'item' : 'items'}
                </p>
              </div>
              <button
                onClick={toggleCart}
                aria-label="Close cart"
                className="w-9 h-9 flex items-center justify-center rounded-md text-audi-steel hover:bg-audi-mist hover:text-audi-anthracite transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {state.items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-audi-mist flex items-center justify-center mb-5 text-audi-titanium">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-audi-anthracite">Your cart is empty</h3>
                  <p className="text-sm text-audi-steel mt-2 max-w-[240px] leading-relaxed">
                    Nothing added yet. Find your part by year and engine code to get started.
                  </p>
                  <button
                    onClick={toggleCart}
                    className="mt-6 text-audi-red font-semibold text-sm hover:underline"
                  >
                    Continue shopping →
                  </button>
                </div>
              ) : (
                <ul className="space-y-5">
                  <AnimatePresence initial={false}>
                    {state.items.map((item) => (
                      <motion.li
                        key={item.sku}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className="flex gap-4 group"
                      >
                        <div className="w-[72px] h-[72px] bg-audi-mist rounded-md flex-shrink-0 flex items-center justify-center border border-audi-fog overflow-hidden">
                          {item.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <svg className="w-6 h-6 text-audi-titanium" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="3.2" />
                              <path strokeLinecap="round" d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3" />
                            </svg>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-[13px] font-semibold text-audi-anthracite leading-snug line-clamp-2">
                              {item.name}
                            </h4>
                            <button
                              onClick={() => removeItem(item.sku)}
                              aria-label={`Remove ${item.name}`}
                              className="text-audi-titanium hover:text-audi-red transition-colors flex-shrink-0"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                          <p className="technical text-[10px] text-audi-titanium mt-1">{item.sku}</p>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-audi-fog rounded-md">
                              <button
                                onClick={() => updateQuantity(item.sku, Math.max(1, item.quantity - 1))}
                                aria-label="Decrease quantity"
                                className="w-8 h-8 text-audi-steel hover:text-audi-anthracite transition-colors"
                              >
                                −
                              </button>
                              <span className="w-8 text-center text-xs font-semibold technical">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                                aria-label="Increase quantity"
                                className="w-8 h-8 text-audi-steel hover:text-audi-anthracite transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-sm font-bold text-audi-anthracite technical">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="p-6 border-t border-audi-fog bg-audi-mist">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-audi-steel">Subtotal</span>
                  <motion.span
                    key={subtotal}
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: 1 }}
                    className="text-xl font-bold text-audi-anthracite technical"
                  >
                    ${subtotal.toFixed(2)}
                  </motion.span>
                </div>
                <p className="text-[11px] text-audi-titanium mb-5">
                  Shipping and taxes calculated at checkout.
                </p>
                <Link
                  href="/checkout"
                  onClick={toggleCart}
                  className="group w-full h-12 bg-audi-anthracite text-white flex items-center justify-center gap-2.5 rounded-md font-semibold text-sm hover:bg-audi-red transition-colors"
                >
                  Go to checkout
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
