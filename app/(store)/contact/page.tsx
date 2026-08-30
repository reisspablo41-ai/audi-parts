import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import { Reveal } from '@/components/motion'
import { SUPPORT_EMAIL } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get expert help identifying your Audi spare part. Send us your VIN and engine code for the fastest, most accurate response.',
}

const CONTACT_METHODS = [
  {
    label: 'Email',
    value: SUPPORT_EMAIL,
    sub: 'Response within 4 business hours',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
  },
  {
    label: 'Live chat',
    value: 'Available on this site',
    sub: 'Mon–Sat, 9 AM – 5 PM EST',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    ),
  },
]

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="brushed-dark text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-30" aria-hidden />
        <Reveal className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="eyebrow text-audi-red mb-4">Support</p>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Talk to an Audi technician</h1>
          <p className="text-audi-silver/85 max-w-xl mx-auto leading-relaxed">
            Can&apos;t find the right part, or not sure which revision you need? Our qualified
            technicians will identify it for you. Send your VIN for the fastest, most accurate
            answer.
          </p>
        </Reveal>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact details */}
          <Reveal className="lg:col-span-2 space-y-6" direction="right">
            <div>
              <h2 className="text-base font-bold text-audi-anthracite mb-4">Get in touch</h2>
              <div className="space-y-3">
                {CONTACT_METHODS.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-3.5 p-4 bg-audi-mist rounded-lg border border-audi-fog"
                  >
                    <svg
                      className="w-5 h-5 text-audi-red flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      {item.icon}
                    </svg>
                    <div className="min-w-0">
                      <p className="eyebrow text-audi-titanium">{item.label}</p>
                      <p className="font-semibold text-audi-anthracite text-[13px] mt-1 break-words">
                        {item.value}
                      </p>
                      <p className="text-xs text-audi-steel mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-l-2 border-audi-red bg-audi-red-soft rounded-r-lg p-4">
              <p className="text-[13px] font-semibold text-audi-red-dark mb-1.5">
                Include your VIN — it settles everything
              </p>
              <p className="text-xs text-audi-steel leading-relaxed">
                Your Vehicle Identification Number tells us the exact build specification: trim,
                engine code, gearbox, and factory of manufacture. With it we can confirm the correct
                part and revision with no ambiguity at all.
              </p>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal className="lg:col-span-3" direction="left">
            <h2 className="text-base font-bold text-audi-anthracite mb-5">Send an enquiry</h2>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </div>
  )
}
