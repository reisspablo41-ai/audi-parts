import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/site'

/**
 * The admin panel is already `noindex, nofollow` via its layout metadata, but
 * that only helps once a crawler has fetched the page. Disallowing it here
 * keeps them out in the first place.
 *
 * Checkout and its success page are excluded for the same reason: they are
 * per-visitor, have no search value, and success URLs carry an order number.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/', '/api/', '/checkout', '/checkout/'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/').replace(/\/$/, ''),
  }
}
