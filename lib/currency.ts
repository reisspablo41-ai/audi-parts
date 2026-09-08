/**
 * Display currency for the storefront.
 *
 * IMPORTANT — this switches the SIGN, not the amount.
 *
 * Every price in the `parts` table is a USD figure, and checkout, the order
 * emails and the admin are all USD. What this module does is pick which symbol
 * a visitor sees in front of that number based on where they are: € across
 * Europe, £ in the UK, $ in the US / Canada / Australia and everywhere else.
 *
 * A euro is not a dollar, so `€541.67` on a part that costs $541.67 is a real
 * under-charge in the EU at today's rates. `rate` below is the hook for fixing
 * that: set a non-1 multiplier and `formatPrice` converts. It is deliberately
 * left at 1 everywhere because converting the display without also converting
 * what the customer is actually charged at checkout would be worse than not
 * converting at all.
 */

export type CurrencyCode = 'USD' | 'EUR' | 'GBP'

export interface Currency {
  code: CurrencyCode
  symbol: string
  /** Drives separators and symbol placement. All three put the symbol first. */
  locale: string
  /** Multiplier on the stored USD amount. See the note above before changing. */
  rate: number
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  USD: { code: 'USD', symbol: '$', locale: 'en-US', rate: 1 },
  EUR: { code: 'EUR', symbol: '€', locale: 'en-IE', rate: 1 },
  GBP: { code: 'GBP', symbol: '£', locale: 'en-GB', rate: 1 },
}

export const DEFAULT_CURRENCY: CurrencyCode = 'USD'

/** The UK and the Crown Dependencies, which use sterling rather than the euro. */
const GBP_COUNTRIES = new Set(['GB', 'UK', 'GG', 'JE', 'IM'])

/**
 * Europe, geographically — not the eurozone. A visitor in Sweden or Poland is
 * shown €, which is what was asked for; narrowing this to the 20 eurozone
 * members would leave most of the continent on $.
 */
const EUR_COUNTRIES = new Set([
  'AD', 'AL', 'AT', 'AX', 'BA', 'BE', 'BG', 'BY', 'CH', 'CY', 'CZ', 'DE', 'DK',
  'EE', 'ES', 'FI', 'FO', 'FR', 'GI', 'GR', 'HR', 'HU', 'IE', 'IS', 'IT', 'LI',
  'LT', 'LU', 'LV', 'MC', 'MD', 'ME', 'MK', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO',
  'RS', 'SE', 'SI', 'SK', 'SM', 'UA', 'VA', 'XK',
])

/**
 * Maps an ISO 3166-1 alpha-2 country to a display currency.
 *
 * The US, Canada, Australia and New Zealand all fall through to USD on
 * purpose: they want a `$`, and CAD/AUD/NZD would need real conversion to
 * mean anything. Everywhere unrecognised also lands on USD.
 */
export function currencyForCountry(country?: string | null): CurrencyCode {
  if (!country) return DEFAULT_CURRENCY
  const code = country.trim().toUpperCase()
  if (GBP_COUNTRIES.has(code)) return 'GBP'
  if (EUR_COUNTRIES.has(code)) return 'EUR'
  return DEFAULT_CURRENCY
}

/**
 * Last-resort guess from an `Accept-Language` header when no geo header is
 * present — locally, or behind a proxy that does not do IP lookup. Reads the
 * region subtag of the first tag that has one, so `en-GB,en;q=0.9` gives GB.
 */
export function currencyFromAcceptLanguage(header?: string | null): CurrencyCode {
  if (!header) return DEFAULT_CURRENCY
  for (const part of header.split(',')) {
    const tag = part.split(';')[0].trim()
    const region = tag.split('-')[1]
    if (region && region.length === 2) return currencyForCountry(region)
  }
  return DEFAULT_CURRENCY
}

/** `$541.67`, `€541.67`, `£541.67`. */
export function formatPrice(amount: number, code: CurrencyCode = DEFAULT_CURRENCY): string {
  const currency = CURRENCIES[code] ?? CURRENCIES[DEFAULT_CURRENCY]
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount * currency.rate)
}

/**
 * `$150` — a round threshold ("free delivery over $150") rather than a real
 * price, so the trailing `.00` is dropped.
 */
export function formatAmountShort(amount: number, code: CurrencyCode = DEFAULT_CURRENCY): string {
  const currency = CURRENCIES[code] ?? CURRENCIES[DEFAULT_CURRENCY]
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount * currency.rate)
}
