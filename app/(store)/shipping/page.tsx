import type { Metadata } from 'next'
import Link from 'next/link'
import { formatPrice, formatAmountShort } from '@/lib/currency'
import { getRequestCurrency } from '@/lib/currency-server'

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'AudiParts Direct shipping information. Next-day, standard, and international delivery options for Audi spare parts.',
}

interface ShippingOption {
  name: string
  /** Bare amount — the symbol is chosen per request from the visitor's region. */
  price: number
  /** Renders the price as "From $39.95" rather than a firm figure. */
  from?: boolean
  /** Order value above which this option is free, if any. */
  freeOver?: number
  time: string
  icon: string
  description: string
}

const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    name: 'Standard Shipping',
    price: 9.95,
    time: '3–5 Business Days',
    freeOver: 150,
    icon: '📦',
    description:
      'Delivered by your regional carrier. Tracking provided at time of dispatch. Available for all in-stock items.',
  },
  {
    name: 'Express (Next-Day)',
    price: 24.95,
    time: 'Next Business Day',
    icon: '⚡',
    description:
      'Order before 2 PM Mon–Fri. Delivered the following business day. Not available for oversized items (engines, gearboxes, large body panels).',
  },
  {
    name: 'International Economy',
    price: 39.95,
    from: true,
    time: '7–14 Business Days',
    icon: '🌏',
    description:
      'Available to most countries worldwide. Duties, taxes, and import fees are the responsibility of the recipient. We declare all items accurately — we do not falsify customs documentation.',
  },
  {
    name: 'International Express',
    price: 79.95,
    from: true,
    time: '3–5 Business Days',
    icon: '✈️',
    description:
      'Priority international delivery via express courier. Tracking to final delivery. Subject to local customs processing times.',
  },
]

const HEAVY_ITEMS = [
  'Engines and long-block assemblies',
  'S tronic and multitronic gearboxes, quattro transfer cases',
  'Radiators, intercoolers, and condenser packs',
  'Body panels — bonnets, door skins, tailgates, Singleframe grille assemblies',
  'Exhaust systems, downpipes, and catalytic converters',
  'Adaptive air suspension struts and complete strut assemblies',
]

export default async function ShippingPage() {
  const currency = await getRequestCurrency()

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="brushed-dark text-white py-14 relative overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-30" aria-hidden />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="eyebrow text-audi-red mb-3">Policy</p>
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">Shipping policy</h1>
          <p className="text-audi-silver">
            Last updated: April 2026. All times are business-day estimates from the date of dispatch.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

        {/* Shipping options grid */}
        <section>
          <h2 className="text-xl font-bold text-audi-anthracite mb-6">Delivery Options</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {SHIPPING_OPTIONS.map((opt) => (
              <div key={opt.name} className="border-2 border-audi-fog rounded-lg p-5 hover:border-audi-red transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <p className="font-bold text-audi-anthracite text-sm">{opt.name}</p>
                      <p className="text-xs text-audi-steel">{opt.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-audi-anthracite">
                      {opt.from ? 'From ' : ''}{formatPrice(opt.price, currency)}
                    </p>
                    {opt.freeOver && (
                      <p className="text-xs text-audi-success font-medium">
                        Free on orders over {formatAmountShort(opt.freeOver, currency)}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-audi-steel leading-relaxed">{opt.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Dispatch times */}
        <section>
          <h2 className="text-xl font-bold text-audi-anthracite mb-4">Order & Dispatch Times</h2>
          <div className="bg-audi-mist rounded-lg p-6 border border-audi-fog">
            <ul className="space-y-3 text-sm text-audi-slate">
              <li className="flex items-start gap-3">
                <span className="text-audi-success mt-0.5">✓</span>
                <span><strong>Same-day dispatch:</strong> In-stock orders placed before 2:00 PM (EST), Monday to Friday.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-audi-success mt-0.5">✓</span>
                <span><strong>Next business day dispatch:</strong> Orders placed after 2:00 PM, or on Saturday/Sunday.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 mt-0.5">!</span>
                <span><strong>Back-ordered items:</strong> If any item in your order is on back-order, we will contact you by email within 24 hours with an estimated lead time.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-audi-titanium mt-0.5">ℹ</span>
                <span><strong>Public holidays:</strong> Our warehouse is closed on public holidays. Orders placed on these days will dispatch the next business day.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Heavy items */}
        <section>
          <h2 className="text-xl font-bold text-audi-anthracite mb-4">Oversized & Heavy Items</h2>
          <p className="text-sm text-audi-steel mb-4">
            The following product types are classified as oversized or heavy freight and may attract
            a handling surcharge. Next-day express is not available for these items. Delivery
            estimates for heavy freight are 5–10 business days domestically.
          </p>
          <ul className="space-y-2">
            {HEAVY_ITEMS.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-audi-slate">
                <span className="text-audi-titanium">—</span> {item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-audi-steel mt-4">
            Heavy freight requires a delivery address where someone can sign for the shipment.
            Liftgate/tailgate delivery is available on request for an additional fee. Contact us
            before ordering if you need special delivery arrangements.
          </p>
        </section>

        {/* International */}
        <section>
          <h2 className="text-xl font-bold text-audi-anthracite mb-4">International Shipping Notes</h2>
          <div className="bg-audi-mist border-l-2 border-audi-red rounded-r-lg p-5 space-y-3 text-sm text-audi-steel">
            <p>
              <strong>Import duties and taxes:</strong> International customers are responsible for
              all import duties, taxes, and customs clearance fees levied by their country.
              These are not included in our shipping charges and will be collected by the carrier
              or customs authority at delivery.
            </p>
            <p>
              <strong>Restricted items:</strong> Certain parts (airbags, aerosols, lithium batteries)
              are prohibited for air freight on international routes. We will notify you if any item
              in your order cannot be shipped internationally.
            </p>
            <p>
              <strong>Transit times:</strong> International estimates are in addition to local
              customs processing time, which varies by country and is outside our control.
            </p>
          </div>
        </section>

        {/* Tracking */}
        <section>
          <h2 className="text-xl font-bold text-audi-anthracite mb-4">Tracking Your Order</h2>
          <p className="text-sm text-audi-steel leading-relaxed">
            A tracking number and carrier link will be emailed to you as soon as your order is
            dispatched. If you have not received a dispatch notification within 2 business days
            of placing your order, please check your spam folder first, then contact us.
          </p>
        </section>

        {/* Questions */}
        <div className="bg-audi-mist rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-audi-anthracite">Questions about your shipment?</p>
            <p className="text-sm text-audi-steel mt-1">
              We respond to all shipping inquiries within 4 business hours.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 inline-flex h-11 px-6 bg-audi-red text-white font-bold rounded-xl items-center hover:bg-audi-red-dark transition-colors text-sm"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
