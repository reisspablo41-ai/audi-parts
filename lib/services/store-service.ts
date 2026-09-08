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
    // v2 renamed this to oe_number. Reading row.part_number returned undefined
    // on every part, which is why part numbers rendered blank site-wide.
    partNumber: row.oe_number ?? row.part_number ?? '',
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

/** The single `tier: 'oem'` row in `brands`. */
const OEM_BRAND_ID = 'genuine-audi'

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

/** PostgREST's per-response row cap. */
const PAGE = 1000

/**
 * Read every row a query matches, not just the first page.
 *
 * PostgREST caps a response at 1000 rows and reports no error when it
 * truncates, so an unpaginated select quietly starts losing data the moment a
 * table outgrows the cap. `part_fitment` crossed it at ~7k rows: the fitment
 * picker below saw only the first 1000, which left most generations looking
 * like they had no parts and dropped every model except the A1 and A3 out of
 * the dropdown.
 *
 * Takes a factory rather than a query because each page needs a fresh builder.
 * Returns null on error, which every caller treats as "no data".
 */
async function allRows<T>(makeQuery: () => any, label: string): Promise<T[] | null> {
  const out: T[] = []
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await makeQuery().range(from, from + PAGE - 1)
    if (error) {
      console.error(`[${label}]`, error.message)
      return null
    }
    out.push(...((data ?? []) as T[]))
    if (!data || data.length < PAGE) return out
  }
}

/** One chassis generation of a model, e.g. the A4 B9. */
export interface FitmentGeneration {
  /** Chassis code as owners say it -- B9, 8V, C7. */
  code: string
  /** Years this generation actually has vehicle rows for, newest first. */
  years: number[]
}

export interface FitmentModel {
  /**
   * Full model name including the make, e.g. "Audi A4" or "VW Polo". The
   * catalogue carries shared-platform parts, so `models` spans Audi, VW and
   * Porsche -- prefixing "Audi" in the UI produced "Audi Porsche Taycan".
   */
  name: string
  generations: FitmentGeneration[]
  /** Every year across the model's generations, newest first. */
  years: number[]
}

/**
 * Models, generations and years for the homepage fitment picker.
 *
 * Read from the database rather than a table hardcoded in the component. The
 * hardcoded one listed A4 generations B5 and B6, which have no rows here at
 * all, so a third of the year dropdown pointed at vehicles that do not exist
 * and searching them could only ever return nothing.
 *
 * Years come from `vehicles`, not from generations.year_start/year_end, so the
 * picker can only offer a year that has a vehicle row behind it.
 */
export async function getFitmentOptions(): Promise<FitmentModel[]> {
  const [models, generations, vehicles, fitment] = await Promise.all([
    allRows<{ id: string; name: string }>(
      () => db.from('models').select('id, name, sort_order').order('sort_order'),
      'getFitmentOptions:models',
    ),
    allRows<{ id: string; model_id: string; code: string }>(
      () => db.from('generations').select('id, model_id, code'),
      'getFitmentOptions:generations',
    ),
    allRows<{ id: string; generation_id: string; year: number }>(
      () => db.from('vehicles').select('id, generation_id, year'),
      'getFitmentOptions:vehicles',
    ),
    // ~7k rows — this is the one that has to be paged.
    allRows<{ vehicle_id: string }>(
      () => db.from('part_fitment').select('vehicle_id'),
      'getFitmentOptions:fitment',
    ),
  ])

  if (!models || !generations || !vehicles || !fitment) return []

  // Vehicles that at least one part is confirmed to fit.
  const fittedVehicles = new Set((fitment as { vehicle_id: string }[]).map((f) => f.vehicle_id))
  // Generations reachable from those, so a model offering nothing can be dropped.
  const generationHasParts = new Set(
    (vehicles as { id: string; generation_id: string }[])
      .filter((v) => fittedVehicles.has(v.id))
      .map((v) => v.generation_id),
  )

  // generation id -> the years it actually has vehicles for
  const yearsByGeneration = new Map<string, Set<number>>()
  for (const v of vehicles as { id: string; generation_id: string; year: number }[]) {
    if (!yearsByGeneration.has(v.generation_id)) yearsByGeneration.set(v.generation_id, new Set())
    yearsByGeneration.get(v.generation_id)!.add(v.year)
  }

  const generationsByModel = new Map<string, (FitmentGeneration & { hasParts: boolean })[]>()
  for (const g of generations as { id: string; model_id: string; code: string }[]) {
    const years = [...(yearsByGeneration.get(g.id) ?? [])].sort((a, b) => b - a)
    if (years.length === 0) continue // a generation with no vehicles cannot be searched
    if (!generationsByModel.has(g.model_id)) generationsByModel.set(g.model_id, [])
    generationsByModel
      .get(g.model_id)!
      .push({ code: g.code, years, hasParts: generationHasParts.has(g.id) })
  }

  const out: FitmentModel[] = []
  for (const m of models as { id: string; name: string }[]) {
    const gens = generationsByModel.get(m.id)
    if (!gens || gens.length === 0) continue

    // A model no part is confirmed against is a dead end: every search on it
    // can only come back empty, so it is not worth offering.
    if (!gens.some((g) => g.hasParts)) continue

    // Newest generation first, matching how the year list reads.
    gens.sort((a, b) => (b.years[0] ?? 0) - (a.years[0] ?? 0))

    const years = [...new Set(gens.flatMap((g) => g.years))].sort((a, b) => b - a)
    out.push({ name: m.name, generations: gens, years })
  }

  return out
}

export async function getStoreParts(filters: StoreFilters = {}): Promise<StorePartsResult> {
  const { category, brand, minPrice, maxPrice, inStockOnly, query, model, year, vehicleId, page = 1 } = filters
  const from = (page - 1) * STORE_PAGE_SIZE
  const to = from + STORE_PAGE_SIZE - 1

  // Resolve fitment filter to a list of SKUs first
  let skuFilter: string[] | null = null

  if (vehicleId) {
    // Exact vehicle — look up parts for that specific vehicle ID
    const { data: fitment, error: fitmentError } = await db
      .from('part_fitment')
      .select('sku')
      .eq('vehicle_id', vehicleId)

    // Errors here used to be discarded, which turned a broken query into a
    // silent "no parts found" — indistinguishable from a genuine empty result.
    if (fitmentError) {
      console.error('[getStoreParts] fitment lookup failed:', fitmentError.message)
      return { parts: [], total: 0 }
    }

    skuFilter = [...new Set((fitment ?? []).map((f: { sku: string }) => f.sku))]
    if (skuFilter.length === 0) return { parts: [], total: 0 }
  } else if (model) {
    // `vehicles` has no `model` column — the model name lives two joins away,
    // in models via generations. Filtering on vehicles.model raised 42703 on
    // every search, and the discarded error made it look like zero matches.
    let vq = db
      .from('vehicles')
      .select('id, generations!inner(models!inner(name))')
      .ilike('generations.models.name', `%${model}%`)

    if (year) vq = vq.eq('year', parseInt(year))

    const { data: vehicles, error: vehicleError } = await vq
    if (vehicleError) {
      console.error('[getStoreParts] vehicle lookup failed:', vehicleError.message)
      return { parts: [], total: 0 }
    }
    if (!vehicles || vehicles.length === 0) return { parts: [], total: 0 }

    // Paged: a popular model spans ~40 vehicles and well over 1000 fitment
    // rows, and a truncated first page would silently drop parts from the
    // results rather than fail.
    const vehicleIds = vehicles.map((v: { id: string }) => v.id)
    const fitment = await allRows<{ sku: string }>(
      () => db.from('part_fitment').select('sku').in('vehicle_id', vehicleIds),
      'getStoreParts:fitment',
    )
    if (!fitment) return { parts: [], total: 0 }

    skuFilter = [...new Set(fitment.map((f) => f.sku))]
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
  // Same class of bug as the model filter above: `parts` has no `brand`
  // column, only `brand_id`. 'Genuine OEM' is the one OEM brand row; anything
  // else is aftermarket, expressed as "not that row" so new aftermarket
  // brands are picked up without another change here.
  if (brand === 'Genuine OEM') q = q.eq('brand_id', OEM_BRAND_ID)
  else if (brand) q = q.neq('brand_id', OEM_BRAND_ID)
  if (minPrice !== undefined && minPrice > 0) q = q.gte('price', minPrice)
  if (maxPrice !== undefined && maxPrice !== Infinity) q = q.lte('price', maxPrice)
  if (inStockOnly) q = q.eq('in_stock', true)
  if (skuFilter !== null) q = q.in('sku', skuFilter)
  if (query) {
    q = q.or(
      `name.ilike.%${query}%,oe_number.ilike.%${query}%,oe_normalised.ilike.%${query}%,`+
      `sku.ilike.%${query}%,description.ilike.%${query}%`,
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


/**
 * Every indexable part, as bare SKUs — for app/sitemap.ts.
 *
 * Deliberately not getStoreParts(): that is paginated to STORE_PAGE_SIZE and
 * joins images and fitment, none of which a sitemap needs. A sitemap that
 * silently listed only the first page would be worse than no sitemap.
 */
export async function getSitemapParts(): Promise<Array<{ sku: string; updatedAt: string | null }>> {
  const { data, error } = await db
    .from('parts')
    .select('sku, updated_at')
    .eq('is_active', true)
    .order('sku')

  if (error) throw error

  return (data ?? []).map((row: any) => ({
    sku: row.sku,
    updatedAt: row.updated_at ?? null,
  }))
}
