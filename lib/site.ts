/**
 * Canonical origin for the site.
 *
 * Every absolute URL the crawlers see — canonical tags, Open Graph, the
 * sitemap, JSON-LD @id values — is built from this. Getting it wrong is worse
 * than omitting it: a canonical pointing at the wrong host tells Google to
 * index that host instead.
 *
 * Set NEXT_PUBLIC_SITE_URL in the environment (Vercel exposes the deployment
 * host as VERCEL_PROJECT_PRODUCTION_URL, used here as the fallback).
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel) return `https://${vercel.replace(/\/$/, '')}`

  return 'http://localhost:3000'
}

export const SITE_URL = resolveSiteUrl()

export const SITE_NAME = 'Audi Parts Sales'

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
