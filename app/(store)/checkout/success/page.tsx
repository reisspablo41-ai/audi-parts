'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { motion, EASE } from '@/components/motion'

const NEXT_STEPS = [
  {
    title: 'Fitment verification',
    body: 'Our technicians cross-reference your order against your vehicle details — year, model, and engine code — to confirm compatibility before anything is picked.',
  },
  {
    title: 'Invoice',
    body: 'Once fitment is confirmed you will receive a final invoice with a secure payment link.',
  },
  {
    title: 'Dispatch',
    body: 'Parts are typically dispatched within 24 hours of payment clearing, with tracking sent by email.',
  },
]

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="w-20 h-20 bg-audi-success rounded-full flex items-center justify-center text-white mx-auto mb-8"
      >
        <motion.svg
          className="w-9 h-9"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          viewBox="0 0 24 24"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
        >
          <motion.path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </motion.svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-audi-anthracite mb-4">Order received</h1>
        <p className="text-lg text-audi-steel mb-10 leading-relaxed">
          We have your request{' '}
          <span className="technical font-semibold text-audi-anthracite">#{orderNumber}</span> and
          have sent a confirmation to your inbox.
        </p>

        <div className="bg-white p-7 rounded-lg border border-audi-fog text-left mb-10">
          <h2 className="font-bold text-audi-anthracite mb-5">What happens next</h2>
          <ul className="space-y-5">
            {NEXT_STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="technical text-[11px] text-audi-red flex-shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-sm font-semibold text-audi-anthracite">{step.title}</p>
                  <p className="text-sm text-audi-steel mt-1 leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="h-12 px-8 bg-audi-anthracite text-white rounded-md font-semibold text-sm flex items-center justify-center hover:bg-audi-red transition-colors"
          >
            Continue shopping
          </Link>
          <Link
            href="/contact"
            className="h-12 px-8 bg-white text-audi-anthracite border border-audi-fog rounded-md font-semibold text-sm flex items-center justify-center hover:border-audi-titanium transition-colors"
          >
            Contact support
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
