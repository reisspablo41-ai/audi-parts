import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getOrderById } from '@/lib/services/admin-service'
import { formatPrice } from '@/lib/currency'
import OrderStatusBadge from '@/components/admin/OrderStatusBadge'
import OrderStatusSelect from '@/components/admin/OrderStatusSelect'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const order = await getOrderById(Number(id))
  return { title: order ? `Order ${order.orderNumber}` : 'Order' }
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params
  const orderId = Number(id)
  if (!Number.isFinite(orderId)) notFound()

  const order = await getOrderById(orderId)
  if (!order) notFound()

  const money = (n: number) => formatPrice(n, order.currency as never)

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-audi-titanium hover:text-audi-anthracite transition-colors mb-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All orders
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-audi-anthracite technical">
              {order.orderNumber}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-sm text-audi-steel font-medium mt-1">
            Placed {new Date(order.placedAt).toLocaleString()}
          </p>
        </div>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Items */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-audi-fog overflow-hidden">
          <div className="px-5 py-4 border-b border-audi-fog">
            <h2 className="font-bold text-audi-anthracite">
              Items <span className="text-audi-titanium font-medium">({order.itemCount})</span>
            </h2>
          </div>

          {order.items.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-audi-titanium">
              This order has no line items recorded.
            </p>
          ) : (
            <table className="w-full text-sm">
              <tbody className="divide-y divide-audi-mist">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-4">
                      {/* The name is the purchase-time snapshot; the link goes
                          to the part as it exists now, which may differ. */}
                      <p className="font-bold text-audi-anthracite">{item.name}</p>
                      <Link
                        href={`/product/${item.sku}`}
                        target="_blank"
                        className="text-xs technical text-audi-titanium hover:text-audi-red transition-colors"
                      >
                        {item.sku}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap text-audi-steel">
                      {item.quantity} × {money(item.unitPrice)}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap font-bold text-audi-anthracite technical">
                      {money(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Totals */}
          <div className="border-t border-audi-fog bg-audi-mist/40 px-5 py-4 space-y-2">
            <TotalRow label="Subtotal" value={money(order.subtotal)} />
            <TotalRow
              label="Shipping"
              value={order.shippingCost === 0 ? 'Free' : money(order.shippingCost)}
            />
            <TotalRow label="Tax" value={money(order.tax)} />
            {order.discount > 0 && (
              <TotalRow label="Discount" value={`− ${money(order.discount)}`} />
            )}
            <div className="flex items-center justify-between pt-2 border-t border-audi-fog">
              <span className="font-bold text-audi-anthracite">Total</span>
              <span className="text-lg font-bold text-audi-anthracite technical">
                {money(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Customer + shipping */}
        <div className="space-y-5">
          <Panel title="Customer">
            {order.email ? (
              <a
                href={`mailto:${order.email}`}
                className="text-sm font-semibold text-audi-anthracite hover:text-audi-red transition-colors break-all"
              >
                {order.email}
              </a>
            ) : (
              <p className="text-sm text-audi-titanium">No email recorded</p>
            )}
          </Panel>

          <Panel title="Shipping">
            {/* Checkout writes the address and phone into notes as free text
                rather than into the addresses table, so it is rendered as-is. */}
            {order.notes ? (
              <p className="text-sm text-audi-slate leading-relaxed whitespace-pre-line">
                {order.notes}
              </p>
            ) : (
              <p className="text-sm text-audi-titanium">No shipping details recorded</p>
            )}

            {(order.carrier || order.trackingNumber) && (
              <div className="mt-4 pt-4 border-t border-audi-fog space-y-1">
                {order.carrier && (
                  <p className="text-sm text-audi-slate">
                    <span className="text-audi-titanium">Carrier:</span> {order.carrier}
                  </p>
                )}
                {order.trackingNumber && (
                  <p className="text-sm text-audi-slate">
                    <span className="text-audi-titanium">Tracking:</span>{' '}
                    <span className="technical">{order.trackingNumber}</span>
                  </p>
                )}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  )
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-audi-steel">{label}</span>
      <span className="font-semibold text-audi-slate technical">{value}</span>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-audi-fog">
      <div className="px-5 py-4 border-b border-audi-fog">
        <h2 className="font-bold text-audi-anthracite">{title}</h2>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  )
}
