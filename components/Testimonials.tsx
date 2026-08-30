'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Testimonial } from '@/lib/types'
import { motion, AnimatePresence, EASE } from './motion'

interface TestimonialsProps {
  items: Testimonial[]
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-3.5 h-3.5 ${s <= rating ? 'text-amber-500' : 'text-audi-fog'}`}
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

const AUTOPLAY_MS = 7000

export default function Testimonials({ items }: TestimonialsProps) {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)
  const total = items.length

  const next = useCallback(() => {
    setDirection(1)
    setActive((a) => (a + 1) % total)
  }, [total])

  const prev = useCallback(() => {
    setDirection(-1)
    setActive((a) => (a - 1 + total) % total)
  }, [total])

  function goTo(index: number) {
    setDirection(index > active ? 1 : -1)
    setActive(index)
  }

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [paused, next])

  const featured = items[active]
  const sideItems = [-1, 0, 1].map((offset) => items[(active + offset + total) % total])

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Featured quote */}
        <div className="lg:col-span-2">
          <div className="relative bg-white rounded-lg border border-audi-fog shadow-sm p-8 md:p-10 overflow-hidden min-h-[340px] flex">
            {/* Progress bar — doubles as the autoplay indicator */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-audi-fog">
              <motion.div
                key={`${active}-${paused}`}
                className="h-full bg-audi-red"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: paused ? 0 : 1 }}
                transition={{ duration: paused ? 0 : AUTOPLAY_MS / 1000, ease: 'linear' }}
                style={{ transformOrigin: 'left' }}
              />
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={featured.id}
                custom={direction}
                initial={{ opacity: 0, x: direction * 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -28 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex flex-col justify-between w-full"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <Stars rating={featured.rating} />
                    <span className="eyebrow text-audi-titanium">{featured.date}</span>
                  </div>

                  <blockquote>
                    <p className="text-audi-slate text-[15px] md:text-base leading-relaxed">
                      &ldquo;{featured.quote}&rdquo;
                    </p>
                  </blockquote>

                  <div className="mt-6 inline-flex items-center gap-2 bg-audi-mist border border-audi-fog rounded-md px-3 py-1.5">
                    <svg className="w-3.5 h-3.5 text-audi-red" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="3.2" />
                      <path strokeLinecap="round" d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3" />
                    </svg>
                    <span className="text-xs font-medium text-audi-slate">{featured.partBought}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-6 mt-6 border-t border-audi-fog">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-[13px] flex-shrink-0"
                    style={{ backgroundColor: featured.avatarColor }}
                  >
                    {featured.avatarInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-audi-anthracite text-sm">{featured.author}</p>
                    <p className="text-xs text-audi-steel mt-0.5 truncate">
                      {featured.vehicle} · {featured.location}
                    </p>
                  </div>
                  <span className="ml-auto flex-shrink-0 flex items-center gap-1.5 bg-audi-success-soft border border-audi-success/20 text-audi-success text-[10px] font-semibold px-2.5 py-1 rounded">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Verified
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-5">
            <div className="flex gap-1.5">
              {items.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => goTo(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  aria-current={i === active}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === active ? 'w-7 bg-audi-red' : 'w-1.5 bg-audi-silver hover:bg-audi-titanium'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {[
                { onClick: prev, label: 'Previous testimonial', d: 'M15 19l-7-7 7-7' },
                { onClick: next, label: 'Next testimonial', d: 'M9 5l7 7-7 7' },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={btn.onClick}
                  aria-label={btn.label}
                  className="w-9 h-9 rounded-md border border-audi-fog bg-white flex items-center justify-center text-audi-steel hover:border-audi-anthracite hover:text-audi-anthracite transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={btn.d} />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Side rail */}
        <div className="hidden lg:flex flex-col gap-2.5">
          {sideItems.map((item, i) => {
            const isActive = i === 1
            return (
              <button
                key={item.id}
                onClick={() => goTo(items.findIndex((t) => t.id === item.id))}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                  isActive
                    ? 'border-audi-anthracite bg-white shadow-sm'
                    : 'border-audi-fog bg-white/60 hover:border-audi-silver hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-[11px] flex-shrink-0"
                    style={{ backgroundColor: item.avatarColor }}
                  >
                    {item.avatarInitials}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`font-semibold text-[13px] truncate ${
                        isActive ? 'text-audi-anthracite' : 'text-audi-slate'
                      }`}
                    >
                      {item.author}
                    </p>
                    <p className="text-[10px] text-audi-titanium truncate">{item.vehicle}</p>
                  </div>
                </div>
                <p className="text-xs text-audi-steel line-clamp-2 leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </button>
            )
          })}

          {/* Aggregate rating */}
          <div className="mt-1 bg-audi-anthracite rounded-lg p-5 text-center relative overflow-hidden">
            <div className="absolute inset-0 blueprint-grid opacity-25" aria-hidden />
            <div className="relative">
              <p className="text-3xl font-bold text-white technical">4.9</p>
              <div className="flex justify-center mt-2 mb-3">
                <Stars rating={5} />
              </div>
              <p className="text-[11px] text-audi-titanium">Average rating from</p>
              <p className="text-sm font-semibold text-white mt-0.5">2,400+ verified buyers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
