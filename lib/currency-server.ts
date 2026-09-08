import { headers } from 'next/headers'
import {
  currencyForCountry,
  currencyFromAcceptLanguage,
  type CurrencyCode,
} from '@/lib/currency'

/**
 * Geo headers, in the order we trust them. Vercel and Cloudflare both stamp
 * the country onto the request before it reaches us, so no IP lookup and no
 * third-party call is needed. The generic names cover other proxies.
 */
const COUNTRY_HEADERS = [
  'x-vercel-ip-country',
  'cf-ipcountry',
  'x-geo-country',
  'x-country',
] as const

/**
 * The display currency for the current request.
 *
 * Calling this opts a route into dynamic rendering — it reads the incoming
 * request. That is already true of every page that lists parts; it is new for
 * the static marketing pages under (store), which now render per request.
 */
export async function getRequestCurrency(): Promise<CurrencyCode> {
  const h = await headers()

  for (const name of COUNTRY_HEADERS) {
    const country = h.get(name)
    // Cloudflare sends XX for anonymised clients and T1 for Tor exits.
    if (country && country !== 'XX' && country !== 'T1') {
      return currencyForCountry(country)
    }
  }

  // No geo header — local dev, or a host that does not do IP lookup.
  return currencyFromAcceptLanguage(h.get('accept-language'))
}
