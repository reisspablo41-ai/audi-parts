import type { OrderStatus } from '@/lib/types'

/**
 * Colour carries meaning here: amber needs attention, blue is in flight,
 * green is done, grey/red is closed. Keep them distinct at a glance in a
 * long table.
 */
const STYLES: Record<OrderStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-sky-50 text-sky-700 border-sky-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-audi-mist text-audi-steel border-audi-fog',
  refunded: 'bg-red-50 text-red-700 border-red-200',
}

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const style = STYLES[status] ?? STYLES.pending
  return (
    <span
      className={`inline-flex items-center h-6 px-2.5 rounded-full border text-[11px] font-bold uppercase tracking-wide ${style}`}
    >
      {status}
    </span>
  )
}
