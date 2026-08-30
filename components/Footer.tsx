'use client'

import Link from 'next/link'
import { useState } from 'react'
import { submitNewsletter } from '@/app/actions/newsletter'
import { RingsMark } from './BrandMark'
import { motion, AnimatePresence, EASE } from './motion'

const CATEGORY_LINKS = [
  { label: 'Engine Components', href: '/shop?category=engine' },
  { label: 'Brakes & Discs', href: '/shop?category=brakes' },
  { label: 'Suspension & Steering', href: '/shop?category=suspension' },
  { label: 'Electrical & Sensors', href: '/shop?category=electrical' },
  { label: 'Cooling System', href: '/shop?category=cooling' },
  { label: 'Fuel System', href: '/shop?category=fuel' },
  { label: 'Transmission & quattro', href: '/shop?category=transmission' },
  { label: 'Body & Exterior', href: '/shop?category=body' },
]

/** A4 generations, the way owners search for them. */
const GENERATION_LINKS = [
  { label: 'A4 B9 · 2016–2024', model: 'A4', year: 2018 },
  { label: 'A4 B8.5 · 2013–2015', model: 'A4', year: 2014 },
  { label: 'A4 B8 · 2008–2012', model: 'A4', year: 2010 },
  { label: 'A4 B7 · 2005–2008', model: 'A4', year: 2006 },
  { label: 'A4 B6 · 2001–2005', model: 'A4', year: 2003 },
  { label: 'A4 B5 · 1995–2001', model: 'A4', year: 1998 },
]

const INFO_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Returns Policy', href: '/returns' },
  { label: 'Shipping Policy', href: '/shipping' },
  { label: 'Shop All Parts', href: '/shop' },
]

const TRUST_BADGES = [
  'SSL-secured payments',
  'OEM quality guaranteed',
  'Next-day dispatch available',
  'Hassle-free 30-day returns',
]

export default function Footer() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleNewsletter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    const result = await submitNewsletter(formData)
    setLoading(false)
    if (result.success) {
      setSuccess(true)
      form.reset()
    }
  }

  return (
    <footer className="bg-audi-anthracite text-audi-titanium">
      {/* Newsletter */}
      <div className="border-b border-white/8 relative overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-25" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white">
                {success ? "You're on the list" : 'Parts alerts and technical notes'}
              </h3>
              <p className="text-sm mt-1.5 max-w-md leading-relaxed">
                {success
                  ? "Thanks for subscribing — we'll be in touch when something relevant lands."
                  : 'Occasional emails on restocks, revised part numbers, and known-issue bulletins for the Audi range.'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!success && (
                <motion.form
                  key="newsletter"
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="flex gap-2 w-full md:w-auto"
                  onSubmit={handleNewsletter}
                >
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    required
                    placeholder="Your email address"
                    className="flex-1 md:w-72 h-11 px-4 rounded-md bg-white/5 border border-white/12 text-white placeholder:text-audi-steel text-sm focus:outline-none focus:border-audi-red focus:bg-white/8 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-11 px-6 bg-audi-red text-white font-semibold rounded-md text-sm hover:bg-audi-red-dark transition-colors whitespace-nowrap disabled:opacity-50"
                  >
                    {loading ? 'Subscribing…' : 'Subscribe'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <RingsMark className="h-4 w-auto text-white" />
              <span className="font-bold text-white text-[15px] tracking-tight">
                Audi<span className="text-audi-red">Parts</span>{' '}
                <span className="eyebrow text-audi-titanium text-[9px]">Direct</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Specialists in genuine OEM and vetted aftermarket spare parts for the full Audi range.
              Fitment guaranteed by year, model, and engine code.
            </p>
            <div className="flex gap-2 mt-5">
              {['FB', 'IG', 'YT', 'X'].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="w-8 h-8 rounded-md border border-white/12 flex items-center justify-center text-[10px] font-semibold hover:bg-audi-red hover:border-audi-red hover:text-white transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="eyebrow text-white mb-4">Shop by system</h4>
            <ul className="space-y-2.5">
              {CATEGORY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-white mb-4">A4 by generation</h4>
            <ul className="space-y-2.5">
              {GENERATION_LINKS.map((gen) => (
                <li key={gen.label}>
                  <Link
                    href={`/shop?model=${gen.model}&year=${gen.year}`}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {gen.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-white mb-4">Information</h4>
            <ul className="space-y-2.5">
              {INFO_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="eyebrow text-white mt-8 mb-3">Trust &amp; security</h4>
            <ul className="space-y-2">
              {TRUST_BADGES.map((badge) => (
                <li key={badge} className="text-xs flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 mt-px text-audi-red flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {badge}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-audi-steel">
          <p>© {new Date().getFullYear()} AudiParts Direct. All rights reserved.</p>
          <p className="text-center sm:text-right max-w-xl leading-relaxed">
            Audi® and quattro® are registered trademarks of AUDI AG. We are an independent parts
            retailer and are not affiliated with, authorised by, or endorsed by AUDI AG.
          </p>
        </div>
      </div>
    </footer>
  )
}
