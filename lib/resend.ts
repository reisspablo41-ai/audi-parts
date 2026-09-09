import { Resend } from 'resend'
import { BRAND_DOMAIN, SUPPORT_EMAIL } from './brand'

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Both addresses default to the Audi Parts Sales brand domain and are
 * overridable by environment variable. FROM_EMAIL's domain must be verified in
 * Resend before any mail will actually send.
 */
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? SUPPORT_EMAIL
export const FROM_EMAIL = process.env.FROM_EMAIL ?? `orders@${BRAND_DOMAIN}`
