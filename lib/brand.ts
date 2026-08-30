/**
 * Single source of truth for brand identity strings.
 *
 * Kept free of any server-only imports so pages, emails, and client
 * components can all read from it.
 */

export const BRAND_NAME = 'AudiParts Direct'
export const BRAND_DOMAIN = 'audipartsdirect.com'

/** Public-facing support address, shown on the contact page. */
export const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@audipartsdirect.com'

/** Brand accent, for contexts that cannot use Tailwind tokens (e.g. emails). */
export const BRAND_RED = '#a6192e'
export const BRAND_ANTHRACITE = '#101317'
