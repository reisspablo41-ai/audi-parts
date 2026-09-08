'use server'

import { supabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { ORDER_STATUSES, type OrderStatus } from '@/lib/types'

/**
 * Moves an order between the six states in the orders.status CHECK constraint.
 *
 * `shipped_at` and `delivered_at` are stamped here rather than left to the
 * operator, so the timeline on the order page is always consistent with the
 * status badge next to it.
 */
export async function updateOrderStatus(id: number, status: string) {
  if (!supabaseAdmin) {
    return { success: false, error: 'Database connection error' }
  }

  // Guard the value before it reaches Postgres: an unknown status would fail
  // the CHECK constraint with an opaque 23514 rather than a usable message.
  if (!ORDER_STATUSES.includes(status as OrderStatus)) {
    return { success: false, error: `Unknown order status: ${status}` }
  }

  const patch: Record<string, unknown> = { status, updated_at: new Date().toISOString() }
  if (status === 'shipped') patch.shipped_at = new Date().toISOString()
  if (status === 'delivered') patch.delivered_at = new Date().toISOString()

  const { error } = await supabaseAdmin.from('orders').update(patch).eq('id', id)

  if (error) {
    console.error('Error updating order status:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${id}`)
  return { success: true }
}
