'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, EASE } from './motion'

/**
 * Persistent banner showing which vehicle the catalogue is currently filtered
 * to. Reads the label the fitment picker wrote to localStorage.
 */
export default function FitmentBar() {
  const [vehicle, setVehicle] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('garage_vehicle_label')
    if (stored) setVehicle(stored)
  }, [])

  return (
    <AnimatePresence>
      {vehicle && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="bg-audi-anthracite text-white overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-sm min-w-0">
              <span className="w-4 h-4 bg-audi-success rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={3.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-audi-titanium truncate">
                Showing parts for <strong className="text-white font-semibold">{vehicle}</strong>
              </span>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <Link href="/" className="text-xs text-audi-silver hover:text-white transition-colors underline underline-offset-2">
                Change vehicle
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('garage_vehicle_label')
                  setVehicle(null)
                }}
                className="text-xs text-audi-titanium hover:text-white transition-colors"
              >
                Clear filter
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
