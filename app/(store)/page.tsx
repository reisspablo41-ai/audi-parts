import type { Metadata } from 'next'
import Link from 'next/link'
import FitmentFilter from '@/components/FitmentFilter'
import PartCard from '@/components/PartCard'
import Testimonials from '@/components/Testimonials'
import CategoryIcon from '@/components/CategoryIcon'
import HeroCopy from '@/components/HeroCopy'
import HeroVideo from '@/components/HeroVideo'
import { Reveal, Stagger, StaggerItem } from '@/components/motion'
import { testimonials } from '@/lib/data'
import { getFeaturedParts, getFitmentOptions, getStoreCategories, getStoreStats } from '@/lib/services/store-service'

export const metadata: Metadata = {
  title: 'AudiParts Direct – Genuine & Aftermarket Audi Spare Parts',
  description:
    'Find exact-fit Audi spare parts by year, model, and engine code. Genuine OEM and vetted aftermarket options, with next-day shipping available.',
}

const WHY_ITEMS = [
  {
    title: 'Fitment by engine code',
    body: 'Every part is matched to your year, model, and engine code — not just the model name. If it does not fit, we make it right.',
  },
  {
    title: 'Next-day dispatch',
    body: 'Order before 2 PM and your parts leave the warehouse the same business day. International shipping on most lines.',
  },
  {
    title: 'Genuine or vetted',
    body: 'Genuine Audi parts sourced through authorised distributors, alongside aftermarket alternatives we have tested ourselves.',
  },
  {
    title: 'Technicians on hand',
    body: 'Qualified Audi technicians can identify the exact part from your VIN alone — including the right revision.',
  },
]

const ARROW = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

export default async function HomePage() {
  const [featuredParts, categories, stats, fitmentModels] = await Promise.all([
    getFeaturedParts(4),
    getStoreCategories({ topLevelOnly: true }),
    getStoreStats(),
    getFitmentOptions(),
  ])

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative bg-audi-anthracite overflow-hidden">
        <HeroVideo />
        {/* Metallic edge light along the top */}
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-audi-titanium/50 to-transparent z-10"
          aria-hidden
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <HeroCopy
              totalParts={stats.totalParts}
              totalModels={stats.totalModels}
            />
            <div>
              <FitmentFilter models={fitmentModels} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────── */}
      <section className="py-20 bg-audi-mist">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10">
            <p className="eyebrow text-audi-red mb-2">Catalogue</p>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-3xl font-bold text-audi-anthracite">Shop by category</h2>
              <p className="text-audi-steel text-sm max-w-md">
                Every component your Audi runs on, grouped the way a workshop thinks about it.
              </p>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <StaggerItem key={cat.id}>
                <Link
                  href={`/shop?category=${cat.id}`}
                  className="group relative block bg-white rounded-lg border border-audi-fog p-5 h-full overflow-hidden transition-all duration-300 hover:border-audi-titanium hover:shadow-[0_10px_40px_-16px_rgba(16,19,23,0.35)] hover:-translate-y-1"
                >
                  {/* Red rule that draws in on hover */}
                  <span className="absolute inset-x-0 top-0 h-0.5 bg-audi-red origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                  <span className="block text-audi-steel group-hover:text-audi-red transition-colors">
                    <CategoryIcon categoryId={cat.id} fallback={cat.icon} className="w-7 h-7" />
                  </span>
                  <h3 className="mt-4 font-semibold text-audi-anthracite text-[15px]">{cat.name}</h3>
                  <p className="technical text-[11px] text-audi-titanium mt-1">
                    {cat.partCount.toLocaleString()} parts
                  </p>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Featured parts ────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="eyebrow text-audi-red mb-2">Hand-picked</p>
              <h2 className="text-3xl font-bold text-audi-anthracite">Featured parts</h2>
              <p className="text-audi-steel mt-2 text-sm">
                Parts we have picked out across the catalogue — availability shown on each.
              </p>
            </div>
            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center gap-1.5 text-audi-red font-semibold text-sm hover:gap-2.5 transition-all"
            >
              View all parts
              {ARROW}
            </Link>
          </Reveal>

          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredParts.map((part) => (
              <StaggerItem key={part.sku} className="h-full">
                <PartCard part={part} />
              </StaggerItem>
            ))}
          </Stagger>

          <div className="mt-8 sm:hidden text-center">
            <Link href="/shop" className="text-audi-red font-semibold text-sm hover:underline">
              View all parts →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why us ────────────────────────────────────────── */}
      <section className="py-20 bg-audi-anthracite relative overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-25" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl mb-14">
            <p className="eyebrow text-audi-red mb-2">Why AudiParts Direct</p>
            <h2 className="text-3xl font-bold text-white">
              One reason to exist: the right part, first time.
            </h2>
            <p className="text-audi-titanium mt-3 leading-relaxed">
              A wrong part is not an inconvenience — it is a car on a lift, a bay out of action, and
              a week lost. Everything we do is arranged around not letting that happen.
            </p>
          </Reveal>

          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8 border border-white/8 rounded-lg overflow-hidden">
            {WHY_ITEMS.map((item, i) => (
              <StaggerItem key={item.title} className="bg-audi-anthracite p-7 group">
                <span className="technical text-[11px] text-audi-red">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-semibold text-white mt-3 mb-2">{item.title}</h3>
                <p className="text-sm text-audi-titanium leading-relaxed">{item.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────── */}
      <section className="py-20 bg-audi-mist">
        <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
          <span className="inline-flex items-center gap-2 bg-white border border-audi-fog text-audi-slate text-xs font-medium px-4 py-1.5 rounded-full mb-5">
            <span className="text-amber-500">★★★★★</span>
            Trusted by 2,400+ Audi owners worldwide
          </span>
          <h2 className="text-3xl font-bold text-audi-anthracite">What our customers say</h2>
          <p className="text-audi-steel mt-3 max-w-xl mx-auto text-sm leading-relaxed">
            Verified feedback from mechanics, enthusiasts, and everyday Audi owners who needed a
            specific part and found it here.
          </p>
        </Reveal>
        <Testimonials items={testimonials} />
      </section>

      {/* ── Closing CTA ───────────────────────────────────── */}
      <section className="relative bg-audi-graphite py-16 overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-20" aria-hidden />
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-audi-red/60 to-transparent"
          aria-hidden
        />
        <Reveal className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Not sure which part you need?</h2>
          <p className="text-audi-titanium text-base mb-8 leading-relaxed">
            Send us your VIN and our technicians will identify the exact part number and revision.
            Free, and with no obligation to buy.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 h-12 px-8 bg-audi-red text-white font-semibold rounded-md hover:bg-audi-red-dark transition-colors"
          >
            Get expert help
            {ARROW}
          </Link>
        </Reveal>
      </section>
    </>
  )
}
