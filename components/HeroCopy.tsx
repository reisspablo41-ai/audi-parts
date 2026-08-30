'use client'

import Link from 'next/link'
import { motion, CountUp, EASE } from './motion'

interface HeroCopyProps {
  totalParts: number
  totalModels: number
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

/**
 * The left-hand hero column. Split out of the server-rendered homepage so the
 * headline can animate in on mount without turning the whole page into a
 * client component.
 */
export default function HeroCopy({ totalParts, totalModels }: HeroCopyProps) {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div
        variants={item}
        className="inline-flex items-center gap-2.5 border border-audi-red/30 bg-audi-red/10 rounded-full pl-2.5 pr-4 py-1.5 mb-7"
      >
        <span className="relative flex w-1.5 h-1.5">
          <span className="absolute inline-flex w-full h-full rounded-full bg-audi-red opacity-70 animate-ping" />
          <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-audi-red" />
        </span>
        <span className="text-audi-silver text-[12px] font-medium tracking-wide">
          Fitment guaranteed by engine code
        </span>
      </motion.div>

      <motion.h1
        variants={item}
        className="text-4xl lg:text-5xl xl:text-[3.75rem] font-bold text-white leading-[1.04]"
      >
        The right part,
        <br />
        <span className="text-audi-titanium">first time.</span>
      </motion.h1>

      <motion.p
        variants={item}
        className="mt-6 text-[17px] text-audi-silver/85 leading-relaxed max-w-lg"
      >
        Genuine OEM and vetted aftermarket spare parts for the full Audi range. Search by year,
        model, and engine code — right down to the part revision.
      </motion.p>

      <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
        <Link
          href="/shop"
          className="group inline-flex items-center gap-2 h-12 px-6 bg-audi-red text-white font-semibold rounded-md hover:bg-audi-red-dark transition-colors"
        >
          Browse all parts
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center h-12 px-6 border border-audi-steel text-audi-silver font-medium rounded-md hover:border-audi-titanium hover:text-white transition-colors"
        >
          Talk to a technician
        </Link>
      </motion.div>

      <motion.div
        variants={item}
        className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8"
      >
        {[
          { value: totalParts, suffix: '+', label: 'Parts in stock' },
          { value: totalModels, suffix: '', label: 'Audi lines covered' },
          { value: 99.2, suffix: '%', label: 'Fitment accuracy', decimals: 1 },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="text-2xl lg:text-[1.75rem] font-bold text-white technical">
              <CountUp value={stat.value} suffix={stat.suffix} decimals={stat.decimals ?? 0} />
            </p>
            <p className="text-[11px] text-audi-titanium mt-1.5 leading-tight">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}
