'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AUDI_MODELS, AUDI_YEARS, ENGINE_OPTIONS } from '@/lib/data'
import { motion, AnimatePresence, EASE } from './motion'

interface Generation {
  /** Chassis code, e.g. B9 — how Audi owners actually identify their car. */
  code: string
  label: string
  years: number[]
  engines: { label: string; code: string; disp: string }[]
}

/**
 * The A4 is the house model, and the only one whose generation ladder is
 * enumerated to the chassis code. Picking an A4 year therefore narrows to an
 * exact vehicle ID (`a4-2018-20-ea888`); every other model filters on model and
 * year, which is all the fitment data supports for them.
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

/**
 * An engine the visitor can pick. `disp` is only present where we can resolve
 * the choice to an exact vehicle ID; without it the search falls back to
 * model + year.
 */
interface EngineOption {
  label: string
  value: string
  disp?: string
}

/**
 * Engines offered for a model. The A4 narrows by generation, so its list
 * depends on the year as well; every other model draws on the shared
 * ENGINE_OPTIONS table and is available as soon as the model is chosen.
 */
function enginesFor(model: string, year: string): EngineOption[] {
  if (!model) return []

  if (model === 'A4') {
    const generation = year ? generationForYear(year) : undefined
    // Before a year is picked there is no single generation to draw from, so
    // offer the full A4 engine range rather than an empty list.
    const source = generation ? generation.engines : A4_GENERATIONS.flatMap((g) => g.engines)
    const seen = new Set<string>()
    return source
      .filter((e) => !seen.has(e.code) && seen.add(e.code))
      .map((e) => ({ label: e.label, value: e.code, disp: e.disp }))
  }

  return (ENGINE_OPTIONS[model] ?? []).map((label) => ({ label, value: label }))
}

/** Years offered for a model — A4 grouped by chassis generation, others flat. */
function yearsFor(model: string): number[] {
  if (model === 'A4') return A4_GENERATIONS.flatMap((g) => g.years)
  return AUDI_YEARS
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
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [engineValue, setEngineValue] = useState('')

  const generation = model === 'A4' && year ? generationForYear(year) : undefined
  const availableEngines = enginesFor(model, year)
  const availableYears = yearsFor(model)

  // Model drives both of the selects below it, so changing it clears them.
  function handleModelChange(value: string) {
    setModel(value)
    setYear('')
    setEngineValue('')
  }

  // A4 engines are generation-specific: a year change can invalidate the
  // current pick, so drop any engine that is no longer offered.
  function handleYearChange(value: string) {
    setYear(value)
    if (engineValue && !enginesFor(model, value).some((e) => e.value === engineValue)) {
      setEngineValue('')
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!model) return

    const params = new URLSearchParams()
    const selectedEngine = availableEngines.find((eng) => eng.value === engineValue)

    // Vehicle IDs in the database are `{model slug}-{generation code}-{year}`,
    // e.g. `a4-b9-2018`. This previously built `a4-2018-20-ea888` from the
    // displacement and engine code, which matches no row, so picking an A4
    // with an engine returned nothing at all.
    //
    // Engine is not part of the identity: every vehicle row carries
    // engine_id 'unspecified', so the picker narrows the label shown to the
    // visitor, not the query. Fitment for a generation+year is as precise as
    // the data currently gets.
    if (model === 'A4' && year && generation) {
      params.set('vehicle', `a4-${generation.code.toLowerCase()}-${year}`)
    } else {
      params.set('model', model)
      if (year) params.set('year', year)
    }

    const engineLabel = selectedEngine?.label ?? ''
    const engineSuffix = engineLabel
      ? ` (${engineLabel.match(/\((.+)\)/)?.[1] ?? engineLabel})`
      : ''
    const label = `${year ? `${year} ` : ''}Audi ${model}${
      generation ? ` ${generation.code}` : ''
    }${engineSuffix}`.replace(/\s+/g, ' ').trim()

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
        <h2 className="text-lg font-bold text-audi-anthracite">Find parts for your Audi</h2>
      </div>
      <p className="text-[13px] text-audi-steel mb-5 leading-relaxed">
        Pick your model, year and engine code and we&apos;ll show only the parts confirmed to
        fit.
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
              value={model}
              onChange={(e) => handleModelChange(e.target.value)}
              className={selectCls}
            >
              <option value="">Select model</option>
              {AUDI_MODELS.map((m) => (
                <option key={m} value={m}>
                  Audi {m}
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
              onChange={(e) => handleYearChange(e.target.value)}
              disabled={!model}
              className={selectCls}
            >
              <option value="">{model ? 'All years' : 'Select model first'}</option>
              {model === 'A4'
                ? A4_GENERATIONS.map((gen) => (
                    <optgroup
                      key={gen.code}
                      label={`${gen.label} · ${gen.years.at(-1)}–${gen.years[0]}`}
                    >
                      {gen.years.map((y) => (
                        <option key={y} value={String(y)}>
                          {y}
                        </option>
                      ))}
                    </optgroup>
                  ))
                : availableYears.map((y) => (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
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
              value={engineValue}
              onChange={(e) => setEngineValue(e.target.value)}
              disabled={!model || availableEngines.length === 0}
              className={selectCls}
            >
              <option value="">All engines</option>
              {availableEngines.map((eng) => (
                <option key={eng.value} value={eng.value}>
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
        disabled={!model}
        whileHover={model ? { y: -2 } : undefined}
        whileTap={model ? { y: 0, scale: 0.99 } : undefined}
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
