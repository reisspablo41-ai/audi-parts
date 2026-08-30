import type { Metadata } from 'next'
import Link from 'next/link'
import { Reveal, Stagger, StaggerItem, CountUp } from '@/components/motion'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'AudiParts Direct — specialists in genuine OEM and vetted aftermarket Audi spare parts, with fitment verified down to the engine code.',
}

const TEAM_VALUES = [
  {
    title: 'Technical expertise',
    body: "Our team includes certified Audi technicians with decades of hands-on workshop experience. We do not guess — every part number is verified against Audi's official ETKA catalogue before it is listed.",
  },
  {
    title: 'Fitment accuracy',
    body: 'Fitment errors are the single biggest frustration for DIYers and professionals alike. Our database cross-references VIN, year, model, engine code, and build variant to eliminate the guesswork.',
  },
  {
    title: 'Trusted sourcing',
    body: 'Genuine Audi parts are sourced exclusively through authorised distributors. Our aftermarket range is quality-verified before listing — no grey-market or low-grade substitutes.',
  },
  {
    title: 'Fast fulfilment',
    body: 'Our warehouse runs Monday to Saturday. Orders placed before 2 PM on a business day ship the same day, because a car on a lift is lost income or lost time.',
  },
]

const STATS = [
  { value: 35000, suffix: '+', label: 'Parts in catalogue' },
  { value: 99.2, suffix: '%', decimals: 1, label: 'Fitment accuracy rate' },
  { value: 15, suffix: '', label: 'Audi model lines' },
  { value: 30, suffix: ' days', label: 'Returns window' },
]

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="brushed-dark text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-30" aria-hidden />
        <Reveal className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="eyebrow text-audi-red mb-4">About us</p>
          <h1 className="text-4xl lg:text-5xl font-bold mb-5 leading-tight">
            Audi parts specialists
          </h1>
          <p className="text-audi-silver/85 text-lg leading-relaxed max-w-2xl mx-auto">
            We built AudiParts Direct because we were tired of ordering the wrong part. Every
            component in our catalogue is verified for fitment before it goes live.
          </p>
        </Reveal>
      </div>

      {/* Story */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <Reveal>
            <p className="eyebrow text-audi-red mb-3">Our story</p>
            <h2 className="text-2xl font-bold text-audi-anthracite mb-5">
              Built by people who got sent the wrong part once too often
            </h2>
            <div className="space-y-4 text-audi-steel text-[15px] leading-relaxed">
              <p>
                AudiParts Direct was founded by a team of automotive professionals who grew tired of
                online suppliers listing components with no meaningful fitment data. Ordering a
                water pump module only to find it is the pre-revision housing for a different engine
                code is not merely inconvenient — it costs a workshop real money and a real day.
              </p>
              <p>
                So we built the resource we wished existed: a platform dedicated entirely to Audi,
                where every listing is matched to a specific year, model, and engine code — and to
                the correct part revision — before it is published.
              </p>
              <p>
                Today we stock over 35,000 individual components covering three decades of Audi
                production, from the B5 A4 through to the current Q8 and e-tron GT. Whether you are
                rebuilding a weekend project or keeping a fleet on the road, we exist to get you the
                right part, fast.
              </p>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-2 gap-3">
            {STATS.map((stat) => (
              <StaggerItem
                key={stat.label}
                className="bg-audi-mist rounded-lg p-6 text-center border border-audi-fog"
              >
                <p className="text-3xl font-bold text-audi-anthracite technical">
                  <CountUp value={stat.value} suffix={stat.suffix} decimals={stat.decimals ?? 0} />
                </p>
                <p className="text-xs text-audi-steel mt-2 leading-tight">{stat.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-audi-mist">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12">
            <p className="eyebrow text-audi-red mb-3">Principles</p>
            <h2 className="text-3xl font-bold text-audi-anthracite">What we stand for</h2>
          </Reveal>
          <Stagger className="grid sm:grid-cols-2 gap-4">
            {TEAM_VALUES.map((val, i) => (
              <StaggerItem
                key={val.title}
                className="bg-white rounded-lg p-7 border border-audi-fog group hover:border-audi-titanium transition-colors"
              >
                <span className="technical text-[11px] text-audi-red">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-semibold text-audi-anthracite mt-3 mb-2.5">{val.title}</h3>
                <p className="text-sm text-audi-steel leading-relaxed">{val.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Trademark disclaimer */}
      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="border-l-2 border-audi-titanium bg-audi-mist rounded-r-lg p-6">
          <p className="eyebrow text-audi-steel mb-2">Disclaimer</p>
          <p className="text-sm text-audi-steel leading-relaxed">
            AudiParts Direct is an independent spare parts retailer. We are not affiliated with,
            authorised by, or endorsed by AUDI AG. Audi®, quattro®, TFSI®, TDI®, and the model
            designations A3, A4, A5, A6, A7, A8, Q3, Q5, Q7, Q8, TT and R8 are registered trademarks
            of AUDI AG. Genuine OEM part numbers are cited for compatibility reference only.
          </p>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="relative bg-audi-graphite py-16 text-center overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-20" aria-hidden />
        <Reveal className="relative max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to find your part?</h2>
          <p className="text-audi-titanium mb-8">
            Use the fitment checker and get the right component the first time.
          </p>
          <Link
            href="/shop"
            className="inline-flex h-12 px-8 bg-audi-red text-white font-semibold rounded-md items-center hover:bg-audi-red-dark transition-colors"
          >
            Shop now
          </Link>
        </Reveal>
      </section>
    </div>
  )
}
