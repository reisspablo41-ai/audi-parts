import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Returns Policy',
  description: 'AudiParts Direct returns and refund policy. 30-day returns on unused, uninstalled parts. Core charge and exchange information.',
}

const SECTIONS = [
  {
    id: 'eligibility',
    icon: '✅',
    title: 'Return Eligibility',
    content: [
      'Parts must be returned within 30 days of the delivery date.',
      'Items must be in their original, unopened packaging with all labels intact.',
      'Parts must be unused and uninstalled. Once a part has been installed on a vehicle, it is no longer eligible for a standard return.',
      'Electrical components (ECUs, sensors, alternators) are subject to a bench test fee if returned opened.',
      'Special-order items, including custom-cut gaskets and made-to-order components, are non-returnable unless the part was supplied in error or arrives defective.',
    ],
  },
  {
    id: 'process',
    icon: '📦',
    title: 'How to Return',
    content: [
      'Request an RMA (Return Merchandise Authorisation) number via our contact form or by email. Returns without an RMA number will be refused at our warehouse.',
      'Pack the part securely in appropriate packaging. We are not responsible for damage caused by inadequate packing during return transit.',
      'Write the RMA number clearly on the outside of the parcel.',
      'Use a tracked shipping service. We recommend insuring high-value returns. We are not responsible for returns lost in transit.',
      'Once received and inspected (typically 1–3 business days), refunds are issued within 5–7 business days to the original payment method.',
    ],
  },
  {
    id: 'core-charge',
    icon: '🔄',
    title: 'Core Charge & Exchange Parts',
    content: [
      'Remanufactured parts (alternators, starters, calipers) carry a refundable Core Charge that appears separately on your invoice.',
      'To receive the core refund, return the old, rebuildable part (your "core") in the packaging the new part arrived in within 30 days of purchase.',
      'The core must be the same part number and in rebuildable condition — not seized, cracked, burnt-out, or physically damaged beyond normal wear.',
      'Core refunds are processed within 7 business days of receiving the old unit.',
    ],
  },
  {
    id: 'defective',
    icon: '🛠️',
    title: 'Defective or Incorrect Parts',
    content: [
      'If you receive a part that is defective (manufacturing fault), or if we supplied the wrong part, we will cover return shipping and provide a full replacement or refund at no charge.',
      'Please photograph any defects before returning and include those images with your RMA request.',
      'Defect claims must be submitted within 14 days of delivery.',
      'Parts that fail due to incorrect installation, incompatible vehicles, or use outside OEM specifications are not covered under our defect policy.',
    ],
  },
  {
    id: 'exclusions',
    icon: '⚠️',
    title: 'Non-Returnable Items',
    content: [
      'Installed or used parts under any circumstances.',
      'Consumable items: fluids, lubricants, adhesives, bulbs, and fuses.',
      'Parts that have been cut, drilled, or modified.',
      'Parts without original packaging.',
      'Special-order and custom-manufactured components.',
      'Parts purchased more than 30 days ago.',
    ],
  },
]

export default function ReturnsPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="brushed-dark text-white py-14 relative overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-30" aria-hidden />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="eyebrow text-audi-red mb-3">Policy</p>
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">Returns &amp; refund policy</h1>
          <p className="text-audi-silver">
            Last updated: April 2026. We aim to make returns as straightforward as possible.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick summary */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: '📅', title: '30-Day Window', sub: 'Return within 30 days of delivery' },
            { icon: '📦', title: 'Original Packaging', sub: 'Must be unused & uninstalled' },
            { icon: '💳', title: 'Full Refund', sub: 'To original payment method' },
          ].map((item) => (
            <div key={item.title} className="bg-audi-mist rounded-lg p-5 text-center border border-audi-fog">
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="font-bold text-audi-anthracite text-sm">{item.title}</p>
              <p className="text-xs text-audi-steel mt-1">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* TOC */}
        <nav className="bg-audi-mist border border-audi-fog rounded-lg p-5 mb-10">
          <p className="text-xs font-semibold text-audi-slate uppercase tracking-wide mb-3">Contents</p>
          <ul className="space-y-1">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-sm text-audi-slate hover:text-audi-anthracite hover:underline">
                  {s.icon} {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sections */}
        <div className="space-y-10">
          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id}>
              <h2 className="text-xl font-bold text-audi-anthracite mb-4 flex items-center gap-2">
                <span>{section.icon}</span> {section.title}
              </h2>
              <ul className="space-y-2">
                {section.content.map((line, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-audi-steel leading-relaxed">
                    <span className="text-audi-silver mt-0.5 flex-shrink-0">—</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-audi-mist rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-audi-anthracite">Need to start a return?</p>
            <p className="text-sm text-audi-steel mt-1">Contact us and we will provide your RMA number within 4 hours.</p>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 inline-flex h-11 px-6 bg-audi-red text-white font-bold rounded-xl items-center hover:bg-audi-red-dark transition-colors text-sm"
          >
            Request RMA
          </Link>
        </div>
      </div>
    </div>
  )
}
