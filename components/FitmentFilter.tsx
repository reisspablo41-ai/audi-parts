'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, EASE } from './motion'

interface Generation {
  /** Chassis code, e.g. B9 — how Audi owners actually identify their car. */
  code: string
  label: string
  years: number[]
  engines: { label: string; code: string; disp: string }[]
}

/**
 * The A4 is the house model. Generations run newest first so the years most
 * likely to be selected sit at the top of the dropdown.
 */
const A4_GENERATIONS: Generation[] = [
  {
    code: 'B9',
    label: 'B9 / B9.5',
    years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016],
    engines: [
      { label: '2.0 TFSI (EA888 Gen3)', code: 'ea888', disp: '20' },
      { label: '2.0 TDI (EA288)', code: 'ea288', disp: '20d' },
      { label: '3.0 TDI V6 (CRTD)', code: 'crtd', disp: '30d' },
    ],
  },
  {
    code: 'B8',
    label: 'B8 / B8.5',
    years: [2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008],
    engines: [
      { label: '1.8 TFSI (CABB)', code: 'cabb', disp: '18' },
      { label: '2.0 TFSI (CDNC)', code: 'cdnc', disp: '20' },
      { label: '3.2 FSI V6 (CALA)', code: 'cala', disp: '32' },
    ],
  },
  {
    code: 'B7',
    label: 'B7',
    years: [2007, 2006, 2005],
    engines: [
      { label: '2.0 TFSI (BWE)', code: 'bwe', disp: '20' },
      { label: '1.8 T (BFB)', code: 'bfb', disp: '18t' },
      { label: '3.2 FSI V6 (AUK)', code: 'auk', disp: '32' },
    ],
  },
  {
    code: 'B6',
    label: 'B6',
    years: [2004, 2003, 2002, 2001],
    engines: [
      { label: '1.8 T (AMB)', code: 'amb', disp: '18t' },
      { label: '2.0 FSI (ALT)', code: 'alt', disp: '20' },
      { label: '2.5 TDI V6 (BDG)', code: 'bdg', disp: '25d' },
    ],
  },
  {
    code: 'B5',
    label: 'B5',
    years: [2000, 1999, 1998, 1997, 1996, 1995],
    engines: [
      { label: '1.8 T (AEB)', code: 'aeb', disp: '18t' },
      { label: '2.8 V6 (AMX)', code: 'amx', disp: '28' },
      { label: '1.9 TDI (AFN)', code: 'afn', disp: '19d' },
    ],
  },
]

function generationForYear(year: string): Generation | undefined {
  const y = parseInt(year)
  return A4_GENERATIONS.find((g) => g.years.includes(y))
}

const selectCls =
  'w-full h-11 pl-3 pr-9 border border-audi-fog rounded-md text-sm bg-white text-audi-anthracite ' +
  'focus:outline-none focus:border-audi-red focus:ring-2 focus:ring-audi-red/15 transition-colors ' +
  'appearance-none cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed'

function SelectChevron() {
  return (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-audi-titanium"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

export default function FitmentFilter() {
  const router = useRouter()
  const [year, setYear] = useState('')
  const [engineCode, setEngineCode] = useState('')

  const generation = year ? generationForYear(year) : undefined
  const availableEngines = generation?.engines ?? []

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!year) return

    const params = new URLSearchParams()
    const selectedEngine = availableEngines.find((eng) => eng.code === engineCode)

    if (engineCode && selectedEngine) {
      params.set('vehicle', `a4-${year}-${selectedEngine.disp}-${engineCode}`)
    } else {
      params.set('model', 'A4')
      params.set('year', year)
    }

    const engineLabel = selectedEngine?.label ?? ''
    const label = engineLabel
      ? `${year} Audi A4 ${generation?.code ?? ''} (${engineLabel.match(/\((.+)\)/)?.[1] ?? engineLabel})`.replace(/\s+/g, ' ')
      : `${year} Audi A4 ${generation?.code ?? ''}`.trim()

    localStorage.setItem('garage_vehicle_label', label)
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.18 }}
      className="bg-white rounded-xl shadow-2xl shadow-audi-anthracite/40 border border-white/10 p-6 w-full max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1 h-4 bg-audi-red rounded-full" />
        <h2 className="text-lg font-bold text-audi-anthracite">Find parts for your A4</h2>
      </div>
      <p className="text-[13px] text-audi-steel mb-5 leading-relaxed">
        Pick your year and engine code — B5 through B9 — and we&apos;ll show only the parts
        confirmed to fit.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Year */}
        <div>
          <label htmlFor="fitment-year" className="block eyebrow text-audi-titanium mb-1.5">
            Year
          </label>
          <div className="relative">
            <select
              id="fitment-year"
              value={year}
              onChange={(e) => {
                setYear(e.target.value)
                setEngineCode('')
              }}
              className={selectCls}
            >
              <option value="">Select year</option>
              {A4_GENERATIONS.map((gen) => (
                <optgroup key={gen.code} label={`${gen.label} · ${gen.years.at(-1)}–${gen.years[0]}`}>
                  {gen.years.map((y) => (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <SelectChevron />
          </div>
        </div>

        {/* Model — fixed, display only */}
        <div>
          <label className="block eyebrow text-audi-titanium mb-1.5">Model</label>
          <div className="w-full h-11 px-3 border border-audi-fog rounded-md text-sm bg-audi-mist text-audi-anthracite flex items-center justify-between font-semibold">
            <span>Audi A4</span>
            <AnimatePresence mode="wait">
              {generation && (
                <motion.span
                  key={generation.code}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.18, ease: EASE }}
                  className="technical text-[11px] font-semibold text-audi-red bg-audi-red-soft border border-audi-red/15 rounded px-1.5 py-0.5"
                >
                  {generation.code}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Engine */}
        <div>
          <label htmlFor="fitment-engine" className="block eyebrow text-audi-titanium mb-1.5">
            Engine
          </label>
          <div className="relative">
            <select
              id="fitment-engine"
              value={engineCode}
              onChange={(e) => setEngineCode(e.target.value)}
              disabled={!year}
              className={selectCls}
            >
              <option value="">All engines</option>
              {availableEngines.map((eng) => (
                <option key={eng.code} value={eng.code}>
                  {eng.label}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={!year}
        whileHover={year ? { y: -2 } : undefined}
        whileTap={year ? { y: 0, scale: 0.99 } : undefined}
        transition={{ duration: 0.2, ease: EASE }}
        className="w-full h-12 bg-audi-anthracite text-white font-semibold rounded-md text-[15px] hover:bg-audi-graphite transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Search compatible parts
      </motion.button>

      <p className="text-center text-xs text-audi-titanium mt-3">
        Or{' '}
        <a href="/shop" className="text-audi-red hover:underline font-medium">
          browse the full catalogue
        </a>{' '}
        without filtering by vehicle
      </p>
    </motion.form>
  )
}
