import { supabaseAdmin } from '@/lib/supabase'
import { Part, Category, Order, OrderItem, OrderStatus } from '@/lib/types'

/**
 * Mappings between database snake_case and application camelCase.
 */
function mapPart(dbPart: any): Part {
  // Map images and sort them so that primary images come first
  const images = (dbPart.part_images || [])
    .sort((a: any, b: any) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
    .map((img: any) => img.url)

  return {
    sku: dbPart.sku,
    name: dbPart.name,
    description: dbPart.description || '',
    price: parseFloat(dbPart.price),
    compareAtPrice: dbPart.compare_at_price ? parseFloat(dbPart.compare_at_price) : undefined,
    // v2 stores the brand as an FK; fall back to the joined name.
    brand: dbPart.brands?.name ?? (dbPart.brand_id === 'genuine-audi' ? 'Genuine OEM' : 'Aftermarket'),
    category: dbPart.categories?.name || '', // Joined category name
    categoryId: dbPart.category_id,
    partNumber: dbPart.oe_number ?? dbPart.part_number ?? '',
    oemCrossReference: dbPart.oem_cross_ref || '',
    weight: dbPart.weight_kg ? `${dbPart.weight_kg} kg` : undefined,
    material: dbPart.material || '',
    // Previously hard-coded to []. The edit form's fitment checkboxes read
    // this, so they could never show a saved selection.
    fitment: (dbPart.part_fitment ?? []).map((f: { vehicle_id: string }) => f.vehicle_id),
    images: images,
    inStock: dbPart.in_stock,
    stockCount: dbPart.stock_count,
    rating: parseFloat(dbPart.rating || 0),
    reviewCount: dbPart.review_count || 0,
    tags: dbPart.tags || [],
  }
}

function mapCategory(dbCat: any): Category {
  return {
    id: dbCat.id,
    name: dbCat.name,
    slug: dbCat.slug,
    description: dbCat.description || '',
    icon: dbCat.icon || '🔧',
    partCount: dbCat.parts?.[0]?.count || 0,
  }
}

export async function getAdminStats() {
  if (!supabaseAdmin) throw new Error('Supabase admin client not initialized')

  const [
    { count: totalProducts },
    { count: inStock },
    { count: outOfStock },
    { count: totalCategories },
    { count: oemCount },
    { count: aftermarketCount },
  ] = await Promise.all([
    supabaseAdmin.from('parts').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('parts').select('*', { count: 'exact', head: true }).eq('in_stock', true),
    supabaseAdmin.from('parts').select('*', { count: 'exact', head: true }).eq('in_stock', false),
    supabaseAdmin.from('categories').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('parts').select('*', { count: 'exact', head: true }).eq('brand_id', 'genuine-audi'),
    supabaseAdmin.from('parts').select('*', { count: 'exact', head: true }).neq('brand_id', 'genuine-audi'),
  ])

  return {
    totalProducts: totalProducts || 0,
    inStock: inStock || 0,
    outOfStock: outOfStock || 0,
    totalCategories: totalCategories || 0,
    oemCount: oemCount || 0,
    aftermarketCount: aftermarketCount || 0,
  }
}

export async function getRecentProducts(limit = 6) {
  if (!supabaseAdmin) throw new Error('Supabase admin client not initialized')

  const { data, error } = await supabaseAdmin
    .from('parts')
    .select('*, categories(name), brands(name), part_images(url, is_primary), part_fitment(vehicle_id)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data || []).map(mapPart)
}

export async function getAdminProducts(options: { 
  query?: string, 
  categoryId?: string, 
  limit?: number 
} = {}) {
  if (!supabaseAdmin) throw new Error('Supabase admin client not initialized')

  let query = supabaseAdmin
    .from('parts')
    .select('*, categories(name), brands(name), part_images(url, is_primary), part_fitment(vehicle_id)')
    .order('created_at', { ascending: false })

  if (options.categoryId) {
    query = query.eq('category_id', options.categoryId)
  }

  if (options.query) {
    const q = `%${options.query}%`
    query = query.or(`name.ilike.${q},oe_number.ilike.${q},oe_normalised.ilike.${q},sku.ilike.${q},description.ilike.${q}`)
  }

  if (options.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) throw error
  return (data || []).map(mapPart)
}

export async function getAllCategories() {
  if (!supabaseAdmin) throw new Error('Supabase admin client not initialized')

  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*, parts(count)')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data || []).map(mapCategory)
}

export async function getPartBySku(sku: string) {
  if (!supabaseAdmin) throw new Error('Supabase admin client not initialized')

  const { data, error } = await supabaseAdmin
    .from('parts')
    .select('*, categories:category_id(name), part_images(url, is_primary)')
    .eq('sku', sku)
    .single()
    
  // If the above fails, let's try an even simpler select as fallback
  if (error && error.code !== 'PGRST116') {
    console.error('getPartBySku error:', error)
    const { data: simpleData, error: simpleError } = await supabaseAdmin
      .from('parts')
      .select('*')
      .eq('sku', sku)
      .single()
    
    if (simpleError) throw simpleError
    return simpleData ? mapPart(simpleData) : null
  }

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }
  return data ? mapPart(data) : null
}

export async function getCategoryById(id: string) {
  if (!supabaseAdmin) throw new Error('Supabase admin client not initialized')

  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*, parts(count)')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }
  return data ? mapCategory(data) : null
}

/**
 * Set once we learn the database has no `reviews` table, so the probe is
 * attempted at most once per process instead of on every render. PostgREST
 * reports an unknown relation as PGRST205.
 */
let reviewsTableMissing = false

export async function getAllReviews() {
  if (!supabaseAdmin) throw new Error('Supabase admin client not initialized')
  if (reviewsTableMissing) return []

  const { data, error } = await supabaseAdmin
    .from('reviews')
    .select('*, parts(name)')
    .order('created_at', { ascending: false })

  if (error) {
    if (error.code === 'PGRST205') {
      // Expected on a database that has not run the reviews section of
      // supabase-schema.sql. Not a fault: note it once, then stop probing.
      // The moderation table renders empty rather than failing the page.
      reviewsTableMissing = true
      console.info(
        '[getAllReviews] reviews table not present \u2014 showing an empty ' +
          'moderation list. Apply supabase-schema.sql to enable reviews.',
      )
      return []
    }
    throw error
  }

  return data || []
}


/**
 * Vehicles for the admin fitment picker, newest first within each model.
 * ProductForm previously used the 6-row static list in lib/data.ts, which did
 * not match a single id in the database.
 */
export async function getAllVehicles() {
  if (!supabaseAdmin) throw new Error('Supabase admin client not initialized')

  const { data, error } = await supabaseAdmin
    .from('vehicles')
    .select('id, year, generations(code, models(name))')
    .order('year', { ascending: false })

  if (error) throw error

  return (data ?? []).map((v: any) => ({
    id: v.id,
    year: v.year,
    make: 'Audi' as const,
    model: `${v.generations?.models?.name ?? ''} ${v.generations?.code ?? ''}`.trim(),
    engine: '',
  }))
}


/* ── Orders ─────────────────────────────────────────────────── */

function mapOrderItem(row: any): OrderItem {
  return {
    id: row.id,
    sku: row.sku,
    quantity: row.quantity,
    unitPrice: parseFloat(row.unit_price ?? '0'),
    totalPrice: parseFloat(row.total_price ?? '0'),
    // The snapshot is what the part was called when it was bought. Falling
    // back to the SKU is better than "Unknown" if an old row has no snapshot.
    name: row.part_snapshot?.name ?? row.sku,
  }
}

function mapOrder(row: any): Order {
  const items = (row.order_items ?? []).map(mapOrderItem)
  return {
    id: row.id,
    orderNumber: row.order_number,
    email: row.guest_email ?? '',
    status: row.status as OrderStatus,
    subtotal: parseFloat(row.subtotal ?? '0'),
    shippingCost: parseFloat(row.shipping_cost ?? '0'),
    tax: parseFloat(row.tax ?? '0'),
    discount: parseFloat(row.discount ?? '0'),
    total: parseFloat(row.total ?? '0'),
    currency: row.currency ?? 'USD',
    trackingNumber: row.tracking_number ?? null,
    carrier: row.carrier ?? null,
    notes: row.notes ?? null,
    placedAt: row.placed_at,
    items,
    itemCount: items.reduce((n: number, i: OrderItem) => n + i.quantity, 0),
  }
}

/**
 * Same treatment as reviews above: a database that has not run the orders
 * section of supabase-schema.sql reports PGRST205 rather than an empty table.
 * The admin renders an explanatory empty state instead of a 500, and stops
 * probing after the first miss.
 */
let ordersTableMissing = false

const ORDER_SELECT =
  '*, order_items(id, sku, quantity, unit_price, total_price, part_snapshot)'

export interface OrdersResult {
  orders: Order[]
  /** True when the orders table has not been created yet — not simply empty. */
  tableMissing: boolean
}

export async function getAllOrders(status?: string): Promise<OrdersResult> {
  if (!supabaseAdmin) throw new Error('Supabase admin client not initialized')
  if (ordersTableMissing) return { orders: [], tableMissing: true }

  let query = supabaseAdmin
    .from('orders')
    .select(ORDER_SELECT)
    .order('placed_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data, error } = await query

  if (error) {
    if (error.code === 'PGRST205') {
      ordersTableMissing = true
      console.info(
        '[getAllOrders] orders table not present — showing an empty order ' +
          'list. Apply supabase-schema.sql to enable orders. Checkout cannot ' +
          'record an order until it exists.',
      )
      return { orders: [], tableMissing: true }
    }
    throw error
  }

  return { orders: (data ?? []).map(mapOrder), tableMissing: false }
}

export async function getOrderById(id: number): Promise<Order | null> {
  if (!supabaseAdmin) throw new Error('Supabase admin client not initialized')
  if (ordersTableMissing) return null

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(ORDER_SELECT)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    if (error.code === 'PGRST205') {
      ordersTableMissing = true
      return null
    }
    throw error
  }

  return data ? mapOrder(data) : null
}
