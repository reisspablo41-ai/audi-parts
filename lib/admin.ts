import { supabaseAdmin } from '@/lib/supabase'

/**
 * Supabase auth user IDs permitted to use the admin panel.
 *
 * Overridable with NEXT_PUBLIC_ADMIN_USER_IDS (comma-separated) so you can add
 * staff without a redeploy. A user ID is not a secret — the security comes from
 * verifying the caller's signed JWT server-side, not from hiding the id — so it
 * is safe for this to reach the browser, and the client guard needs it.
 */
export const ADMIN_USER_IDS: string[] = (
  process.env.NEXT_PUBLIC_ADMIN_USER_IDS ?? '79da52b4-8552-46a5-8634-7da648267d6c'
)
  .split(',')
  .map((id) => id.trim().toLowerCase())
  .filter(Boolean)

/** Cheap id comparison, safe on both client and server. */
export function isAdminUser(userId: string | null | undefined): boolean {
  if (!userId) return false
  return ADMIN_USER_IDS.includes(userId.toLowerCase())
}

export interface AdminAuthFailure {
  error: string
  status: number
}

/**
 * Server-side admin gate for route handlers.
 *
 * Returns `null` when the caller is a verified admin, or a failure object to
 * hand straight back as the response.
 *
 * This — not <AdminGuard> — is what actually protects the admin API. The guard
 * is a client component; anyone can `curl` these routes directly, and they run
 * on the service-role key which bypasses RLS entirely. The bearer token is
 * verified against Supabase on every call rather than trusted.
 */
export async function requireAdmin(request: Request): Promise<AdminAuthFailure | null> {
  if (!supabaseAdmin) {
    return { error: 'Supabase admin client not initialized', status: 500 }
  }

  const header = request.headers.get('authorization') ?? ''
  const token = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : ''

  if (!token) {
    return { error: 'Missing authorization token', status: 401 }
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token)

  if (error || !data?.user) {
    return { error: 'Invalid or expired session', status: 401 }
  }

  if (!isAdminUser(data.user.id)) {
    // Authenticated, but not an admin. 403 rather than 401 — retrying with the
    // same credentials will not help.
    return { error: 'Not authorized for admin access', status: 403 }
  }

  return null
}
