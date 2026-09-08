import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllOrders } from '@/lib/services/admin-service'
import { formatPrice } from '@/lib/currency'
import { ORDER_STATUSES, type Order } from '@/lib/types'
import OrderStatusBadge from '@/components/admin/OrderStatusBadge'

export const metadata: Metadata = { title: 'Orders' }

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const sp = await searchParams
  const status = typeof sp.status === 'string' && ORDER_STATUSES.includes(sp.status as never)
    ? sp.status
    : ''

  const { orders, tableMissing } = await getAllOrders(status || undefined)

  // Revenue deliberately excludes cancelled and refunded orders — counting
  // money that was handed back overstates the figure the operator acts on.
  const revenue = orders
    .filter((o) => o.status !== 'cancelled' && o.status !== 'refunded')
    .reduce((sum, o) => sum + o.total, 0)
  const awaiting = orders.filter((o) => o.status === 'pending').length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-audi-anthracite">Orders</h1>
          <p className="text-sm text-audi-steel font-medium">
            Every order placed through checkout, newest first.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Stat label="Orders" value={String(orders.length)} />
          <Stat label="Awaiting" value={String(awaiting)} accent={awaiting > 0} />
          <Stat label="Revenue" value={formatPrice(revenue, 'USD')} />
        </div>
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <FilterChip href="/admin/orders" label="All" active={!status} />
        {ORDER_STATUSES.map((s) => (
          <FilterChip
            key={s}
            href={`/admin/orders?status=${s}`}
            label={s}
            active={status === s}
          />
        ))}
      </div>

      {tableMissing ? (
        <MissingTableNotice />
      ) : (
        <div className="bg-white rounded-2xl border border-audi-fog overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-audi-mist border-b border-audi-fog">
                  <Th>Order</Th>
                  <Th>Customer</Th>
                  <Th>Items</Th>
                  <Th>Placed</Th>
                  <Th>Status</Th>
                  <Th align="right">Total</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-audi-mist">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="w-16 h-16 bg-audi-mist rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-audi-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <p className="font-bold text-audi-anthracite">
                        {status ? `No ${status} orders` : 'No orders yet'}
                      </p>
                      <p className="text-audi-titanium text-xs mt-1">
                        {status
                          ? 'Try a different status filter.'
                          : 'Orders placed through checkout will appear here.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => <OrderRow key={order.id} order={order} />)
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function OrderRow({ order }: { order: Order }) {
  const preview = order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')

  return (
    <tr className="hover:bg-audi-mist/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <Link
          href={`/admin/orders/${order.id}`}
          className="font-bold text-audi-anthracite hover:text-audi-red transition-colors technical"
        >
          {order.orderNumber}
        </Link>
      </td>
      <td className="px-6 py-4">
        <p className="text-audi-slate truncate max-w-[220px]">{order.email || '—'}</p>
      </td>
      <td className="px-6 py-4">
        <p className="font-semibold text-audi-anthracite">
          {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
        </p>
        {preview && (
          <p className="text-xs text-audi-titanium truncate max-w-[260px]" title={preview}>
            {preview}
          </p>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <p className="text-xs font-bold text-audi-titanium">
          {new Date(order.placedAt).toLocaleDateString()}
        </p>
        <p className="text-[11px] text-audi-silver">
          {new Date(order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </td>
      <td className="px-6 py-4">
        <OrderStatusBadge status={order.status} />
      </td>
      <td className="px-6 py-4 text-right whitespace-nowrap">
        <span className="font-bold text-audi-anthracite technical">
          {formatPrice(order.total, order.currency as never)}
        </span>
      </td>
    </tr>
  )
}

function Th({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return (
    <th
      className={`${align === 'right' ? 'text-right' : 'text-left'} px-6 py-4 text-xs font-bold text-audi-titanium uppercase tracking-widest`}
    >
      {children}
    </th>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`bg-white px-4 py-2 rounded-xl border shadow-sm ${accent ? 'border-amber-200' : 'border-audi-fog'}`}
    >
      <p className="text-[10px] font-bold text-audi-titanium uppercase tracking-widest">{label}</p>
      <p className={`text-lg font-bold ${accent ? 'text-amber-600' : 'text-audi-anthracite'}`}>
        {value}
      </p>
    </div>
  )
}

function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`h-8 px-3.5 inline-flex items-center rounded-lg text-xs font-bold capitalize transition-colors ${
        active
          ? 'bg-audi-anthracite text-white'
          : 'bg-white border border-audi-fog text-audi-steel hover:border-audi-silver hover:text-audi-anthracite'
      }`}
    >
      {label}
    </Link>
  )
}

/**
 * The orders table is defined in supabase-schema.sql but is not present on
 * every database. Saying so plainly beats an empty table, because the same
 * missing table is also why checkout cannot record an order.
 *
 * It points at migration-orders.sql rather than supabase-schema.sql: the
 * latter's CREATE TABLE statements have no IF NOT EXISTS, so re-running it
 * here fails on `parts` before it ever reaches the orders section.
 */
function MissingTableNotice() {
  return (
    <div className="bg-white rounded-2xl border border-amber-200 p-8">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div className="min-w-0">
          <h2 className="font-bold text-audi-anthracite">The orders table does not exist yet</h2>
          <p className="text-sm text-audi-steel mt-1.5 leading-relaxed">
            Run{' '}
            <code className="technical text-xs bg-audi-mist px-1.5 py-0.5 rounded">
              migration-orders.sql
            </code>{' '}
            in the Supabase SQL editor to create it. (Not{' '}
            <code className="technical text-xs bg-audi-mist px-1.5 py-0.5 rounded">
              supabase-schema.sql
            </code>{' '}
            — that one fails on tables this database already has.)
          </p>
          <p className="text-sm text-audi-steel mt-3 leading-relaxed">
            Until then <strong className="text-audi-anthracite">checkout cannot record an
            order</strong>: the insert fails and the customer is shown a generic
            &ldquo;Failed to process checkout&rdquo; message. The migration fixes both.
          </p>
        </div>
      </div>
    </div>
  )
}
