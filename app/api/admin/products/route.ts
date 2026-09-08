import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin, brandIdFor, OEM_BRAND_ID } from '@/lib/admin'

// POST /api/admin/products – create a new product
export async function POST(request: NextRequest) {
  // Verified server-side on every call: these routes run on the service-role
  // key and bypass RLS, so a client-side guard alone would protect nothing.
  const denied = await requireAdmin(request)
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status })

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client not initialized' }, { status: 500 })
  }

  try {
    const body = await request.json()

    // Validation
    const required = ['sku', 'name', 'price', 'brand', 'categoryId', 'partNumber']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Check if SKU already exists
    const { data: existing } = await supabaseAdmin
      .from('parts')
      .select('sku')
      .eq('sku', body.sku)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'SKU already exists' }, { status: 409 })
    }

    // Prepare data for Supabase
    const partData = {
      sku: body.sku.trim(),
      name: body.name.trim(),
      description: body.description.trim(),
      price: parseFloat(body.price),
      compare_at_price: body.compareAtPrice ? parseFloat(body.compareAtPrice) : null,
      brand_id: brandIdFor(body.brand) ?? OEM_BRAND_ID,
      category_id: body.categoryId,
      oe_number: body.partNumber.trim(),
      oe_normalised: body.partNumber.replace(/\s+/g, '').toUpperCase(),
      oem_cross_ref: body.oemCrossReference?.trim() || null,
      weight_kg: body.weight ? parseFloat(body.weight.replace(/[^\d.]/g, '')) : null,
      material: body.material?.trim() || null,
      in_stock: body.inStock ?? true,
      stock_count: parseInt(body.stockCount) || 0,
      tags: body.tags || [],
    }

    const { data, error } = await supabaseAdmin
      .from('parts')
      .insert(partData)
      .select()
      .single()

    if (error) throw error

    const sku = data.sku

    // Save part_images
    if (Array.isArray(body.imageUrls) && body.imageUrls.length > 0) {
      const imageRows = body.imageUrls.map((url: string, i: number) => ({
        sku,
        url,
        alt_text: body.name,
        is_primary: i === 0,
        sort_order: i,
      }))
      const { error: imgErr } = await supabaseAdmin.from('part_images').insert(imageRows)
      if (imgErr) console.error('part_images insert error:', imgErr.message)
    }

    // Save part_fitment
    if (Array.isArray(body.fitment) && body.fitment.length > 0) {
      const fitmentRows = body.fitment.map((vehicleId: string) => ({ sku, vehicle_id: vehicleId }))
      const { error: fitErr } = await supabaseAdmin.from('part_fitment').insert(fitmentRows)
      if (fitErr) console.error('part_fitment insert error:', fitErr.message)
    }

    return NextResponse.json({ product: data }, { status: 201 })
  } catch (err: any) {
    console.error('API Error:', err)
    return NextResponse.json({ error: err.message || 'Invalid request' }, { status: 400 })
  }
}
