import { supabaseAdmin, supabase } from '@/lib/supabase'
import type { Part, PartBrand, Category } from '@/lib/types'

// Use the service-role client on the server so joins on part_images / part_fitment
// are not blocked by the anon-key's table-level permissions. Falls back to the
// public client only if the secret key is not configured.
const db = supabaseAdmin ?? supabase

function mapDbPart(row: any): Part {
  const images: string[] = (row.part_images ?? [])
    .slice()
    .sort((a: any, b: any) => {
      if (a.is_primary && !b.is_primary) return -1
      if (!a.is_primary && b.is_primary) return 1
      return (a.sort_order ?? 0) - (b.sort_order ?? 0)
    })
    .map((img: any) => img.url as string)

  return {
    sku: row.sku,
    name: row.name,
    description: row.description ?? '',
    price: parseFloat(row.price),
    compareAtPrice: row.compare_at_price ? parseFloat(row.compare_at_price) : undefined,
    brand: row.brand as PartBrand,
    category: row.categories?.name ?? '',
    categoryId: row.category_id,
    partNumber: row.part_number,
    oemCrossReference: row.oem_cross_ref ?? '',
    weight: row.weight_kg ? `${row.weight_kg} kg` : undefined,
    material: row.material ?? '',
    fitment: (row.part_fitment ?? []).map((f: any) => f.vehicle_id as string),
    images,
    inStock: row.in_stock,
    stockCount: row.stock_count,
    rating: parseFloat(row.rating ?? '0'),
    reviewCount: row.review_count ?? 0,
    tags: row.tags ?? [],
  }
}

function mapDbCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? '',
    icon: row.icon ?? '',
    parentId: row.parent_id ?? null,
    partCount: row.parts?.[0]?.count ?? 0,
  }
}

const PART_SELECT =
  '*, categories(name), part_images(url, is_primary, sort_order), part_fitment(vehicle_id)'

export const STORE_PAGE_SIZE = 12

export interface StoreFilters {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  inStockOnly?: boolean
  query?: string
  model?: string
  year?: string
  vehicleId?: string  // exact vehicle ID — highest priority fitment filter
  page?: number
}

export interface StorePartsResult {
  parts: Part[]
  total: number
}


/**
 * Expand a category id to itself plus its direct children.
 *
 * The taxonomy is two levels deep and parts always live on the leaves
 * (a disc is filed under "brake-rotors", never under "Brakes"). Filtering on
 * an exact category_id therefore returns nothing for any parent category,
 * which is not what a visitor clicking "Brakes" expects.
 */
async function categoryWithDescendants(categoryId: string): Promise<string[]> {
  const { data, error } = await db
    .from('categories')
    .select('id')
    .eq('parent_id', categoryId)

  if (error) {
    console.error('[categoryWithDescendants]', error.message)
    return [categoryId]
  }

  return [categoryId, ...(data ?? []).map((c: { id: string }) => c.id)]
}

export async function getStoreParts(filters: StoreFilters = {}): Promise<StorePartsResult> {
  const { category, brand, minPrice, maxPrice, inStockOnly, query, model, year, vehicleId, page = 1 } = filters
  const from = (page - 1) * STORE_PAGE_SIZE
  const to = from + STORE_PAGE_SIZE - 1

  // Resolve fitment filter to a list of SKUs first
  let skuFilter: string[] | null = null

  if (vehicleId) {
    // Exact vehicle — look up parts for that specific vehicle ID
    const { data: fitment } = await db
      .from('part_fitment')
      .select('sku')
      .eq('vehicle_id', vehicleId)

    skuFilter = [...new Set((fitment ?? []).map((f: { sku: string }) => f.sku))]
    if (skuFilter.length === 0) return { parts: [], total: 0 }
  } else if (model) {
    // Model (+ optional year) filter
    let vq = db.from('vehicles').select('id').ilike('model', `%${model}%`)
    if (year) vq = vq.eq('year', parseInt(year))

    const { data: vehicles } = await vq
    if (!vehicles || vehicles.length === 0) return { parts: [], total: 0 }

    const { data: fitment } = await db
      .from('part_fitment')
      .select('sku')
      .in('vehicle_id', vehicles.map((v: { id: string }) => v.id))

    skuFilter = [...new Set((fitment ?? []).map((f: { sku: string }) => f.sku))]
    if (skuFilter.length === 0) return { parts: [], total: 0 }
  }

  let q = db
    .from('parts')
    .select(PART_SELECT, { count: 'exact' })
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (category) {
    const categoryIds = await categoryWithDescendants(category)
    q = q.in('category_id', categoryIds)
  }
  if (brand) q = q.eq('brand', brand as PartBrand)
  if (minPrice !== undefined && minPrice > 0) q = q.gte('price', minPrice)
  if (maxPrice !== undefined && maxPrice !== Infinity) q = q.lte('price', maxPrice)
  if (inStockOnly) q = q.eq('in_stock', true)
  if (skuFilter !== null) q = q.in('sku', skuFilter)
  if (query) {
    q = q.or(
      `name.ilike.%${query}%,part_number.ilike.%${query}%,sku.ilike.%${query}%,description.ilike.%${query}%`,
    )
  }

  const { data, error, count } = await q
  if (error) {
    console.error('[getStoreParts]', error.message)
    return { parts: [], total: 0 }
  }

  return { parts: (data ?? []).map(mapDbPart), total: count ?? 0 }
}

/**
 * Set once we learn the database predates the `is_featured` column, so the
 * probe is attempted at most once per process instead of on every render.
 * Postgres reports a missing column as SQLSTATE 42703 (undefined_column).
 */
let featuredColumnMissing = false

export async function getFeaturedParts(limit = 4): Promise<Part[]> {
  // In-stock is preferred, not required: a catalogue whose parts are all on
  // backorder or awaiting a price should still show a populated shelf rather
  // than a blank band on the homepage.
  const base = () =>
    db.from('parts').select(PART_SELECT).eq('is_active', true)

  if (!featuredColumnMissing) {
    const { data, error } = await base()
      .eq('is_featured', true)
      .order('in_stock', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      if (error.code === '42703') {
        // Expected on a database that has not run migration-add-featured.sql.
        // Not a fault: note it once, then stop probing.
        featuredColumnMissing = true
        console.info(
          '[getFeaturedParts] parts.is_featured not present — falling back to ' +
            'newest-first. Run migration-add-featured.sql to curate the shelf.',
        )
      } else {
        console.error('[getFeaturedParts]', error.message)
      }
    } else if (data && data.length > 0) {
      return data.map(mapDbPart)
    }
  }

  // Fallback: in-stock first, then newest, so the shelf is never empty.
  const { data: fallback, error: fallbackError } = await base()
    .order('in_stock', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (fallbackError) {
    console.error('[getFeaturedParts:fallback]', fallbackError.message)
    return []
  }

  return (fallback ?? []).map(mapDbPart)
}

export async function getStorePartBySku(sku: string): Promise<Part | null> {
  const { data, error } = await db
    .from('parts')
    .select(PART_SELECT)
    .eq('sku', sku)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('[getStorePartBySku]', error.message)
    return null
  }

  return mapDbPart(data)
}

export async function getRelatedStoreParts(sku: string): Promise<Part[]> {
  // 1. Get related SKUs
  const { data: relatedData, error: relatedError } = await db
    .from('related_parts')
    .select('related_sku')
    .eq('sku', sku)

  if (relatedError || !relatedData || relatedData.length === 0) return []

  // 2. Fetch the corresponding parts
  const skus = relatedData.map((r: { related_sku: string }) => r.related_sku)
  const { data, error } = await db
    .from('parts')
    .select(PART_SELECT)
    .in('sku', skus)
    .eq('is_active', true)

  if (error) {
    console.error('[getRelatedStoreParts]', error.message)
    return []
  }

  return (data ?? []).map(mapDbPart)
}

export async function getReviewsForSku(sku: string) {
  const { data, error } = await db
    .from('reviews')
    .select('*')
    .eq('sku', sku)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[getReviewsForSku]', error.message)
    return []
  }

  return data || []
}

export interface CategoryQuery {
  /**
   * Return only top-level categories (Brakes, Engine, …) rather than the whole
   * tree. The taxonomy is two levels deep, so listing everything flat mixes
   * parents in with leaves like "Headlights" and reads as noise.
   */
  topLevelOnly?: boolean
  /** Return only the children of this category id. */
  parentId?: string
}

export async function getStoreCategories(
  query: CategoryQuery = {},
): Promise<Category[]> {
  let q = db
    .from('categories')
    .select('*, parts(count)')
    .eq('parts.is_active', true)
    .order('sort_order', { ascending: true })

  if (query.parentId) q = q.eq('parent_id', query.parentId)

  const { data, error } = await q

  if (error) {
    console.error('[getStoreCategories]', error.message)
    return []
  }

  const all = (data ?? []).map(mapDbCategory)

  if (query.parentId || !query.topLevelOnly) return all

  // Parts live on the leaves, so a parent's own count is always zero. Roll the
  // children's counts up, otherwise every tile on the homepage reads "0 parts".
  const rolledUp = new Map<string, number>()
  for (const cat of all) {
    const owner = cat.parentId ?? cat.id
    rolledUp.set(owner, (rolledUp.get(owner) ?? 0) + cat.partCount)
  }

  return all
    .filter((cat) => !cat.parentId)
    .map((cat) => ({ ...cat, partCount: rolledUp.get(cat.id) ?? 0 }))
}

export async function getStoreStats() {
  const [
    { count: totalParts },
    { data: vehicles },
  ] = await Promise.all([
    db.from('parts').select('*', { count: 'exact', head: true }).eq('is_active', true),
    db.from('vehicles').select('model'),
  ])

  const uniqueModels = new Set(vehicles?.map(v => v.model)).size

  return {
    totalParts: totalParts || 0,
    totalModels: uniqueModels || 0,
  }
}
