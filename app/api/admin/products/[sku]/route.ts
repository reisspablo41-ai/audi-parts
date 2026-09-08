import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin'

// PUT /api/admin/products/[sku] – update a product
export async function PUT(request: NextRequest, { params }: { params: Promise<{ sku: string }> }) {
  // Verified server-side on every call: these routes run on the service-role
  // key and bypass RLS, so a client-side guard alone would protect nothing.
  const denied = await requireAdmin(request)
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status })

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client not initialized' }, { status: 500 })
  }

  const { sku } = await params

  try {
    const body = await request.json()

    // Prepare data for Supabase update
    const partData = {
      name: body.name?.trim(),
      description: body.description?.trim(),
      price: body.price ? parseFloat(body.price) : undefined,
      compare_at_price: body.compareAtPrice !== undefined ? parseFloat(body.compareAtPrice) : undefined,
      brand_id: body.brand === 'Aftermarket' ? 'meyle' : 'genuine-audi',
      category_id: body.categoryId,
      oe_number: body.partNumber?.trim(),
      oe_normalised: body.partNumber?.replace(/\s+/g, '').toUpperCase(),
      oem_cross_ref: body.oemCrossReference !== undefined ? body.oemCrossReference?.trim() : undefined,
      weight_kg: body.weight ? parseFloat(body.weight.toString().replace(/[^\d.]/g, '')) : undefined,
      material: body.material !== undefined ? body.material?.trim() : undefined,
      in_stock: body.inStock,
      stock_count: body.stockCount !== undefined ? parseInt(body.stockCount) : undefined,
      tags: body.tags,
      updated_at: new Date().toISOString(),
    }

    // Remove undefined fields to avoid overwriting with null unless intended
    const cleanData = Object.fromEntries(
      Object.entries(partData).filter(([_, v]) => v !== undefined)
    )

    const { data, error } = await supabaseAdmin
      .from('parts')
      .update(cleanData)
      .eq('sku', sku)
      .select()
      .single()

    if (error) throw error

    // Replace part_images if new URLs were provided
    if (Array.isArray(body.imageUrls)) {
      await supabaseAdmin.from('part_images').delete().eq('sku', sku)
      if (body.imageUrls.length > 0) {
        const imageRows = body.imageUrls.map((url: string, i: number) => ({
          sku,
          url,
          alt_text: body.name,
          is_primary: i === 0,
          sort_order: i,
        }))
        const { error: imgErr } = await supabaseAdmin.from('part_images').insert(imageRows)
        if (imgErr) console.error('part_images update error:', imgErr.message)
      }
    }

    // Replace part_fitment if provided
    if (Array.isArray(body.fitment)) {
      await supabaseAdmin.from('part_fitment').delete().eq('sku', sku)
      if (body.fitment.length > 0) {
        const fitmentRows = body.fitment.map((vehicleId: string) => ({ sku, vehicle_id: vehicleId }))
        const { error: fitErr } = await supabaseAdmin.from('part_fitment').insert(fitmentRows)
        if (fitErr) console.error('part_fitment update error:', fitErr.message)
      }
    }

    return NextResponse.json({ product: data })
  } catch (err: any) {
    console.error('API Error:', err)
    return NextResponse.json({ error: err.message || 'Invalid request' }, { status: 400 })
  }
}

// DELETE /api/admin/products/[sku]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ sku: string }> }) {
  // Verified server-side on every call: these routes run on the service-role
  // key and bypass RLS, so a client-side guard alone would protect nothing.
  const denied = await requireAdmin(request)
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status })

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client not initialized' }, { status: 500 })
  }

  const { sku } = await params

  try {
    const { error } = await supabaseAdmin
      .from('parts')
      .delete()
      .eq('sku', sku)

    if (error) throw error

    return NextResponse.json({ message: `Product ${sku} deleted` })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Delete failed' }, { status: 400 })
  }
}
