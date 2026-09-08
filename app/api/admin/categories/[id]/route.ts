import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin'

// PUT /api/admin/categories/[id] – update a category
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Verified server-side on every call: these routes run on the service-role
  // key and bypass RLS, so a client-side guard alone would protect nothing.
  const denied = await requireAdmin(request)
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status })

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client not initialized' }, { status: 500 })
  }

  const { id } = await params

  try {
    const body = await request.json()

    const { data, error } = await supabaseAdmin
      .from('categories')
      .update({
        name: body.name,
        slug: body.slug,
        description: body.description,
        icon: body.icon,
        sort_order: body.sort_order,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ category: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 400 })
  }
}

// DELETE /api/admin/categories/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Verified server-side on every call: these routes run on the service-role
  // key and bypass RLS, so a client-side guard alone would protect nothing.
  const denied = await requireAdmin(request)
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status })

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client not initialized' }, { status: 500 })
  }

  const { id } = await params

  try {
    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: `Category ${id} deleted` })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Delete failed' }, { status: 400 })
  }
}
