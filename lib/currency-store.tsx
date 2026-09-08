'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  formatAmountShort,
  formatPrice,
  type Currency,
  type CurrencyCode,
} from '@/lib/currency'

interface CurrencyContextValue {
  currency: Currency
  /** `$541.67` — always two decimals. For anything that is a real price. */
  format: (amount: number) => string
  /** `$150` — drops a trailing `.00`. For round thresholds. */
  formatShort: (amount: number) => string
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

/**
 * Carries the request's display currency to the client components that render
 * prices — the part cards, the cart drawer, search results, checkout.
 *
 * The code is resolved on the server (lib/currency-server.ts) and passed in,
 * so the first paint already has the right symbol. Detecting in the browser
 * instead would flash `$` before settling, which on a price reads as the
 * number having changed.
 */
export function CurrencyProvider({
  code,
  children,
}: {
  code: CurrencyCode
  children: ReactNode
}) {
  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency: CURRENCIES[code] ?? CURRENCIES[DEFAULT_CURRENCY],
      format: (amount: number) => formatPrice(amount, code),
      formatShort: (amount: number) => formatAmountShort(amount, code),
    }),
    [code],
  )

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

/**
 * Falls back to USD rather than throwing when used outside the provider, so a
 * component rendered in isolation (a test, the admin tree) still shows a price
 * instead of crashing.
 */
export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext)
  if (ctx) return ctx
  return {
    currency: CURRENCIES[DEFAULT_CURRENCY],
    format: (amount: number) => formatPrice(amount, DEFAULT_CURRENCY),
    formatShort: (amount: number) => formatAmountShort(amount, DEFAULT_CURRENCY),
  }
}
