'use server'

import { resend, ADMIN_EMAIL, FROM_EMAIL } from '@/lib/resend'
import { OrderConfirmationEmail } from '@/components/emails/OrderConfirmation'
import { AdminNotificationEmail } from '@/components/emails/AdminNotification'
import { CartItem } from '@/lib/cart-store'
import { supabaseAdmin } from '@/lib/supabase'

export async function submitCheckoutForm(formData: FormData, items: CartItem[], subtotal: number) {
  try {
    if (!supabaseAdmin) throw new Error('Supabase Admin client not initialized')
    const supabase = supabaseAdmin

    const customerData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      zipCode: formData.get('zipCode') as string,
    }

    const shippingCost = subtotal > 150 ? 0 : 15
    const tax = subtotal * 0.08
    const total = subtotal + shippingCost + tax
    const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`

    // 1. Save to Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        guest_email: customerData.email,
        status: 'pending',
        subtotal,
        shipping_cost: shippingCost,
        tax,
        total,
        notes: `Shipping to: ${customerData.address}, ${customerData.city}, ${customerData.state} ${customerData.zipCode}. Phone: ${customerData.phone}`,
      })
      .select()
      .single()

    if (orderError) throw orderError

    // 2. Save Order Items
    const orderItems = items.map(item => ({
      order_id: order.id,
      sku: item.sku,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
      part_snapshot: { name: item.name, sku: item.sku }
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
    if (itemsError) throw itemsError

    // 3. Send Notification to Admin
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Order Request: ${orderNumber} from ${customerData.firstName}`,
      react: AdminNotificationEmail({ 
        formType: 'order', 
        data: { ...customerData, orderNumber, total, items: items.map(i => `${i.quantity}x ${i.name}`) } 
      }),
    })

    // 4. Send Confirmation to User
    await resend.emails.send({
      from: FROM_EMAIL,
      to: customerData.email,
      subject: `Order Confirmation - AudiParts Direct #${orderNumber}`,
      react: OrderConfirmationEmail({
        orderNumber,
        customerName: customerData.firstName,
        items,
        subtotal,
        shippingCost,
        total
      }),
    })

    return { success: true, orderNumber }
  } catch (error) {
    console.error('Checkout error:', error)
    return { success: false, error: 'Failed to process checkout' }
  }
}
