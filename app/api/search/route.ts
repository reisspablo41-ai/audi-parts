import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, supabase } from '@/lib/supabase'

const db = supabaseAdmin ?? supabase

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const { data, error } = await db
    .from('parts')
    .select(`
      sku, name, price, oe_number, category_id, in_stock,
      part_images ( url, is_primary, sort_order )
    `)
    .eq('is_active', true)
    .or(`name.ilike.%${q}%,oe_number.ilike.%${q}%,oe_normalised.ilike.%${q}%,sku.ilike.%${q}%`)
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) {
    return NextResponse.json({ results: [] }, { status: 500 })
  }

  const results = (data ?? []).map((row: any) => {
    const primaryImage = (row.part_images ?? [])
      .sort((a: any, b: any) => {
        if (a.is_primary && !b.is_primary) return -1
        if (!a.is_primary && b.is_primary) return 1
        return (a.sort_order ?? 0) - (b.sort_order ?? 0)
      })[0]?.url ?? null

    return {
      sku: row.sku,
      name: row.name,
      partNumber: row.oe_number,
      price: parseFloat(row.price),
      categoryId: row.category_id,
      inStock: row.in_stock,
      image: primaryImage,
    }
  })

  return NextResponse.json({ results })
}
