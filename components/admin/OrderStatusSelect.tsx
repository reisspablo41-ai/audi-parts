'use client'

import { useState, useTransition } from 'react'
import { updateOrderStatus } from '@/app/actions/orders'
import { ORDER_STATUSES, type OrderStatus } from '@/lib/types'

/**
 * Changes an order's status in place.
 *
 * The select shows the new value immediately and rolls back if the write
 * fails, so the row never sits on a status the database did not accept.
 */
export default function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: number
  status: OrderStatus
}) {
  const [value, setValue] = useState<OrderStatus>(status)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function onChange(next: OrderStatus) {
    const previous = value
    setValue(next)
    setError(null)
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, next)
      if (!result.success) {
        setValue(previous)
        setError(result.error ?? 'Could not update status')
      }
    })
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <select
        value={value}
        disabled={pending}
        onChange={(e) => onChange(e.target.value as OrderStatus)}
        aria-label="Order status"
        className="h-9 pl-3 pr-8 rounded-lg border border-audi-fog bg-white text-sm font-semibold text-audi-anthracite capitalize hover:border-audi-silver focus:outline-none focus:border-audi-red disabled:opacity-50 transition-colors"
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s} className="capitalize">
            {s}
          </option>
        ))}
      </select>
      {error && <span className="text-[11px] font-medium text-audi-red">{error}</span>}
    </div>
  )
}
