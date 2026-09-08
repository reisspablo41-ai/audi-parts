'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ENGINE_OPTIONS } from '@/lib/data'
import type { FitmentModel } from '@/lib/services/store-service'
import { motion, AnimatePresence, EASE } from './motion'

interface FitmentFilterProps {
  /**
   * Models, generations and years read from the database by getFitmentOptions().
   * Every option here has vehicle rows behind it, so no selection can point at
   * a car that does not exist.
   */
  models: FitmentModel[]
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

export default function FitmentFilter({ models }: FitmentFilterProps) {
  const router = useRouter()
  const [modelName, setModelName] = useState('')
  const [year, setYear] = useState('')
  const [engine, setEngine] = useState('')

  const model = models.find((m) => m.name === modelName)
  // The generation is shown as a badge, and is derived from the year rather
  // than chosen: an owner knows their year, not always their chassis code.
  const generation = year ? model?.generations.find((g) => g.years.includes(Number(year))) : undefined
  // ENGINE_OPTIONS is keyed on the bare model ("A4"), while the database name
  // carries the make ("Audi A4"), so strip it before the lookup.
  const engines = modelName
    ? (ENGINE_OPTIONS[modelName.replace(/^(Audi|VW|Porsche)\s+/i, '')] ?? [])
    : []

  // Model drives the two selects below it, so changing it clears them.
  function handleModelChange(value: string) {
    setModelName(value)
    setYear('')
    setEngine('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!modelName) return

    // Always search by model (+ year). This used to build an exact vehicle ID
    // for the A4 from a generation table hardcoded in this component, which
    // disagreed with the database: ten of the thirty A4 years produced IDs like
    // `a4-b5-1998` for generations that have no rows, so the shop came back
    // empty however the engine was set. Model + year also unions the
    // generations that overlap in a changeover year, which an exact ID cannot.
    const params = new URLSearchParams()
    params.set('model', modelName)
    if (year) params.set('year', year)

    // Engine narrows the label the visitor sees, not the query: every vehicle
    // row carries engine_id 'unspecified', so there is no engine-level fitment
    // to filter on yet.
    const engineCode = engine.match(/\(([^)]+)\)/)?.[1] ?? ''
    const label = [year, modelName, generation?.code, engineCode && `(${engineCode})`]
      .filter(Boolean)
      .join(' ')

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
        <h2 className="text-lg font-bold text-audi-anthracite">Find parts for your car</h2>
      </div>
      <p className="text-[13px] text-audi-steel mb-5 leading-relaxed">
        Pick your model and year and we&apos;ll show only the parts confirmed to fit.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Model */}
        <div>
          <label htmlFor="fitment-model" className="block eyebrow text-audi-titanium mb-1.5">
            Model
          </label>
          <div className="relative">
            <select
              id="fitment-model"
              value={modelName}
              onChange={(e) => handleModelChange(e.target.value)}
              className={selectCls}
            >
              <option value="">Select model</option>
              {models.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </div>

        {/* Year */}
        <div>
          <label htmlFor="fitment-year" className="block eyebrow text-audi-titanium mb-1.5">
            <span className="inline-flex items-center gap-1.5">
              Year
              <AnimatePresence mode="wait">
                {generation && (
                  <motion.span
                    key={generation.code}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.18, ease: EASE }}
                    className="technical text-[11px] font-semibold text-audi-red bg-audi-red-soft border border-audi-red/15 rounded px-1.5 py-0.5 normal-case tracking-normal"
                  >
                    {generation.code}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </label>
          <div className="relative">
            <select
              id="fitment-year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              disabled={!model}
              className={selectCls}
            >
              <option value="">{model ? 'All years' : 'Select model first'}</option>
              {model?.generations.map((gen) => (
                <optgroup
                  key={gen.code}
                  label={`${gen.code} · ${gen.years.at(-1)}–${gen.years[0]}`}
                >
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

        {/* Engine */}
        <div>
          <label htmlFor="fitment-engine" className="block eyebrow text-audi-titanium mb-1.5">
            Engine
          </label>
          <div className="relative">
            <select
              id="fitment-engine"
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
              disabled={!modelName || engines.length === 0}
              className={selectCls}
            >
              <option value="">All engines</option>
              {engines.map((eng) => (
                <option key={eng} value={eng}>
                  {eng}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={!modelName}
        whileHover={modelName ? { y: -2 } : undefined}
        whileTap={modelName ? { y: 0, scale: 0.99 } : undefined}
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
