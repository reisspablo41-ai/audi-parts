'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { categories } from '@/lib/data'
import { useCart } from '@/lib/cart-store'
import { useCurrency } from '@/lib/currency-store'
import CartDrawer from './CartDrawer'
import SearchOverlay from './SearchOverlay'
import CategoryIcon from './CategoryIcon'
import { Wordmark } from './BrandMark'
import { motion, AnimatePresence, QUICK, EASE } from './motion'

const NAV_LINKS = [
  { label: 'Shop All Parts', href: '/shop' },
  // A blog nobody can navigate to from the header collects no traffic and no
  // internal link equity, which defeats the point of writing it.
  { label: 'Guides', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

function CartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11M10 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
    </svg>
  )
}

function CarIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 17H3a2 2 0 0 1-2-2v-4a2 2 0 0 1 .586-1.414l2-2A2 2 0 0 1 5 7h14a2 2 0 0 1 1.414.586l2 2A2 2 0 0 1 23 11v4a2 2 0 0 1-2 2h-2m-14 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" />
    </svg>
  )
}

function ChevronDown({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
      <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

/** Sliding underline shared by the desktop nav links. */
function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="group relative h-11 flex items-center px-4 text-[13px] font-medium text-audi-silver hover:text-white transition-colors"
    >
      {label}
      <span className="absolute left-4 right-4 bottom-2 h-px bg-audi-red origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </Link>
  )
}

export default function Header() {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { totalCount, toggleCart } = useCart()
  const { formatShort } = useCurrency()
  const [garageVehicle, setGarageVehicle] = useState<string | null>(null)
  const megaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem('garage_vehicle_label')
    if (stored) setGarageVehicle(stored)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Announcement bar */}
      <div className="bg-audi-anthracite text-audi-titanium text-[11px] tracking-wide py-2 text-center px-4">
        <span className="hidden sm:inline">Free delivery over {formatShort(150)}</span>
        <span className="hidden sm:inline mx-3 text-audi-steel">·</span>
        Genuine OEM &amp; vetted aftermarket
        <span className="mx-3 text-audi-steel">·</span>
        <span className="text-white">Fitment guaranteed by engine code</span>
      </div>

      {/* Main header */}
      <div className="bg-white border-b border-audi-fog">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-[68px] gap-4">
            <Link href="/" className="flex-shrink-0" aria-label="AudiParts Direct home">
              <Wordmark className="hidden sm:flex" />
              <Wordmark className="sm:hidden" compact />
            </Link>

            <div className="flex-1 max-w-xl hidden md:flex">
              <SearchOverlay onClose={() => {}} />
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {/* My Garage */}
              <Link
                href="/shop"
                className="hidden lg:flex items-center gap-2 text-[13px] font-medium text-audi-slate hover:text-audi-red hover:border-audi-titanium transition-colors border border-audi-fog rounded-md px-3 h-9"
              >
                <CarIcon />
                <span className="max-w-[140px] truncate">{garageVehicle ?? 'My Garage'}</span>
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                aria-label={`Cart, ${totalCount} item${totalCount === 1 ? '' : 's'}`}
                className="relative flex items-center justify-center w-10 h-10 rounded-md text-audi-slate hover:text-audi-red hover:bg-audi-mist transition-colors"
              >
                <CartIcon />
                <AnimatePresence>
                  {totalCount > 0 && (
                    <motion.span
                      key={totalCount}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                      className="absolute top-1 right-1 bg-audi-red text-white text-[10px] font-semibold rounded-full min-w-[17px] h-[17px] px-1 flex items-center justify-center technical"
                    >
                      {totalCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <button
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-md text-audi-slate hover:bg-audi-mist"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop navigation */}
      <nav className="bg-audi-graphite hidden md:block border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-11">
            <div ref={megaRef} className="relative">
              <button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                aria-expanded={megaMenuOpen}
                className="flex items-center gap-2 h-11 px-4 text-[13px] font-semibold text-white bg-audi-red hover:bg-audi-red-dark transition-colors"
              >
                <span>All Categories</span>
                <motion.span
                  animate={{ rotate: megaMenuOpen ? 180 : 0 }}
                  transition={QUICK}
                  className="flex"
                >
                  <ChevronDown />
                </motion.span>
              </button>

              <AnimatePresence>
                {megaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: EASE }}
                    className="absolute top-full left-0 w-[720px] bg-white shadow-2xl shadow-audi-anthracite/25 border-t-2 border-audi-red rounded-b-lg z-50 overflow-hidden"
                  >
                    <motion.div
                      className="p-5 grid grid-cols-3 gap-1"
                      initial="hidden"
                      animate="show"
                      variants={{ show: { transition: { staggerChildren: 0.03 } } }}
                    >
                      {categories.map((cat) => (
                        <motion.div
                          key={cat.id}
                          variants={{
                            hidden: { opacity: 0, y: 6 },
                            show: { opacity: 1, y: 0 },
                          }}
                        >
                          <Link
                            href={`/shop?category=${cat.id}`}
                            onClick={() => setMegaMenuOpen(false)}
                            className="flex items-start gap-3 p-3 rounded-md hover:bg-audi-mist transition-colors group h-full"
                          >
                            <span className="text-audi-steel group-hover:text-audi-red transition-colors mt-0.5">
                              <CategoryIcon categoryId={cat.id} fallback={cat.icon} className="w-5 h-5" />
                            </span>
                            <div className="min-w-0">
                              <p className="font-semibold text-audi-anthracite group-hover:text-audi-red transition-colors text-[13px]">
                                {cat.name}
                              </p>
                              <p className="text-xs text-audi-steel mt-0.5 line-clamp-2 leading-snug">
                                {cat.description}
                              </p>
                              <p className="text-[11px] technical text-audi-titanium mt-1.5">
                                {cat.partCount.toLocaleString()} parts
                              </p>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                    <div className="bg-audi-mist px-5 py-3 border-t border-audi-fog">
                      <Link
                        href="/shop"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-[13px] font-semibold text-audi-red hover:underline"
                      >
                        View the full catalogue →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}

            <div className="ml-auto flex items-center">
              <Link href="/shipping" className="h-11 flex items-center px-3 text-[12px] text-audi-titanium hover:text-white transition-colors">
                Shipping
              </Link>
              <Link href="/returns" className="h-11 flex items-center px-3 text-[12px] text-audi-titanium hover:text-white transition-colors">
                Returns
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="md:hidden bg-white border-b border-audi-fog shadow-lg overflow-hidden"
          >
            <div className="p-4">
              <SearchOverlay onClose={() => setMobileMenuOpen(false)} autoFocus />
            </div>
            <div className="px-4 pb-4">
              <p className="eyebrow text-audi-titanium mb-2">Categories</p>
              <div className="grid grid-cols-2 gap-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 py-2.5 px-2 rounded-md hover:bg-audi-mist text-[13px] text-audi-slate"
                  >
                    <CategoryIcon categoryId={cat.id} fallback={cat.icon} className="w-4 h-4 text-audi-steel" />
                    {cat.name}
                  </Link>
                ))}
              </div>
              <div className="border-t border-audi-fog pt-3 mt-3 space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 px-2 text-[13px] font-medium text-audi-slate hover:text-audi-red"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer />
    </header>
  )
}
