'use client'

import { useState, useEffect } from 'react'
import { AUDI_MODELS, AUDI_YEARS, ENGINE_OPTIONS } from '@/lib/data'
import type { Part } from '@/lib/types'
import { motion, AnimatePresence, EASE } from './motion'

interface FitmentCheckerProps {
  part: Part
}

const selectCls =
  'w-full h-10 px-2.5 border border-audi-fog rounded-md text-sm bg-white text-audi-anthracite ' +
  'focus:outline-none focus:border-audi-red focus:ring-2 focus:ring-audi-red/15 transition-colors ' +
  'disabled:opacity-45 disabled:cursor-not-allowed'

export default function FitmentChecker({ part }: FitmentCheckerProps) {
  const [year, setYear] = useState('')
  const [model, setModel] = useState('')
  const [engine, setEngine] = useState('')
  const [checked, setChecked] = useState(false)
  const [fits, setFits] = useState(false)

  const engines = model ? (ENGINE_OPTIONS[model] ?? []) : []

  // Restore whatever vehicle the visitor already selected elsewhere on the site.
  useEffect(() => {
    const label = localStorage.getItem('garage_vehicle_label')
    if (label) {
      const match = label.match(/^(\d{4}) Audi ([A-Za-z0-9\- ]+?)(?:\s+B\d)?(?:\s*\(.*\))?$/)
      if (match) {
        setYear(match[1])
        setModel(match[2].trim())
      }
    }
  }, [])

  function handleCheck(e: React.FormEvent) {
    e.preventDefault()
    if (!year || !model) return

    const modelLower = model.toLowerCase().replace(/\s+/g, '-')
    const engineCode = engine.match(/\(([^)]+)\)/)?.[1]?.toLowerCase() ?? ''
    const yearNum = parseInt(year)

    // Fitment IDs follow `<model>-<year>-<disp>-<enginecode>`. In production the
    // fitment table is queried directly; this is the offline heuristic.
    const fitResult = part.fitment.some((fid) => {
      const segments = fid.split('-')
      const fidModel = segments[0]
      const fidYear = parseInt(segments[1] ?? '0')
      const fidEngine = segments.slice(2).join('-')

      const modelMatch =
        modelLower.startsWith(fidModel) || fidModel.startsWith(modelLower.slice(0, 2))
      const yearMatch = Math.abs(fidYear - yearNum) <= 2
      const engineMatch = !engineCode || fidEngine.includes(engineCode.slice(0, 4))

      return modelMatch && yearMatch && engineMatch
    })

    setFits(fitResult)
    setChecked(true)

    if (fitResult) {
      localStorage.setItem('garage_vehicle_label', `${year} Audi ${model}`)
    }
  }

  function handleModelChange(val: string) {
    setModel(val)
    setEngine('')
    setChecked(false)
  }

  return (
    <div className="border border-audi-fog rounded-lg p-5 bg-audi-mist/50">
      <h3 className="text-[15px] font-bold text-audi-anthracite mb-1 flex items-center gap-2">
        <span className="w-1 h-4 bg-audi-red rounded-full" />
        Fitment checker
      </h3>
      <p className="text-[13px] text-audi-steel mb-4 leading-relaxed">
        Confirm this part fits your specific Audi — including the engine code — before ordering.
      </p>

      <form onSubmit={handleCheck} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="fc-year" className="block eyebrow text-audi-titanium mb-1.5">
              Year
            </label>
            <select
              id="fc-year"
              value={year}
              onChange={(e) => {
                setYear(e.target.value)
                setChecked(false)
              }}
              className={selectCls}
            >
              <option value="">Year</option>
              {AUDI_YEARS.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="fc-model" className="block eyebrow text-audi-titanium mb-1.5">
              Model
            </label>
            <select
              id="fc-model"
              value={model}
              onChange={(e) => handleModelChange(e.target.value)}
              disabled={!year}
              className={selectCls}
            >
              <option value="">Model</option>
              {AUDI_MODELS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="fc-engine" className="block eyebrow text-audi-titanium mb-1.5">
            Engine code (optional)
          </label>
          <select
            id="fc-engine"
            value={engine}
            onChange={(e) => {
              setEngine(e.target.value)
              setChecked(false)
            }}
            disabled={!model || engines.length === 0}
            className={selectCls}
          >
            <option value="">All engines</option>
            {engines.map((eng) => (
              <option key={eng} value={eng}>
                {eng}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!year || !model}
          className="w-full h-10 bg-audi-anthracite text-white text-sm font-semibold rounded-md hover:bg-audi-graphite transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check fitment
        </button>
      </form>

      {/* Result */}
      <AnimatePresence mode="wait">
        {checked && (
          <motion.div
            key={fits ? 'fits' : 'nofit'}
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div
              className={`mt-4 p-4 rounded-md flex items-start gap-3 border ${
                fits
                  ? 'bg-audi-success-soft border-audi-success/25'
                  : 'bg-audi-red-soft border-audi-red/20'
              }`}
            >
              <span
                className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white ${
                  fits ? 'bg-audi-success' : 'bg-audi-red'
                }`}
              >
                {fits ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </span>
              <div>
                <p
                  className={`font-semibold text-[13px] ${
                    fits ? 'text-audi-success' : 'text-audi-red-dark'
                  }`}
                >
                  {fits
                    ? `This part fits your ${year} Audi ${model}`
                    : `This part may not fit your ${year} Audi ${model}`}
                </p>
                <p className="text-xs mt-1 text-audi-steel leading-relaxed">
                  {fits
                    ? 'Fitment confirmed — safe to add to your cart.'
                    : 'Check the confirmed vehicle list below, or send us your VIN and we will identify the correct part.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmed fitment list */}
      {part.fitment.length > 0 && (
        <div className="mt-5">
          <p className="eyebrow text-audi-titanium mb-2">Confirmed fitment</p>
          <div className="space-y-1">
            {part.fitment.map((fid) => {
              const segments = fid.split('-')
              const modelCode = segments[0]
              const yearCode = segments[1]
              const engineCode = segments.slice(2).join(' ').toUpperCase()
              return (
                <div
                  key={fid}
                  className="flex items-center gap-2 text-xs text-audi-slate bg-white border border-audi-fog rounded px-2.5 py-2"
                >
                  <svg className="w-3.5 h-3.5 text-audi-success flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.4} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="technical uppercase">
                    {modelCode} {yearCode} · {engineCode}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
