import { supabaseAdmin } from '@/lib/supabase'
import { Part, Category } from '@/lib/types'

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
    brand: dbPart.brand,
    category: dbPart.categories?.name || '', // Joined category name
    categoryId: dbPart.category_id,
    partNumber: dbPart.part_number,
    oemCrossReference: dbPart.oem_cross_ref || '',
    weight: dbPart.weight_kg ? `${dbPart.weight_kg} kg` : undefined,
    material: dbPart.material || '',
    fitment: [], // This would require a join with part_fitment if needed
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
    supabaseAdmin.from('parts').select('*', { count: 'exact', head: true }).eq('brand', 'Genuine OEM'),
    supabaseAdmin.from('parts').select('*', { count: 'exact', head: true }).eq('brand', 'Aftermarket'),
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
    .select('*, categories(name), part_images(url, is_primary)')
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
    .select('*, categories(name), part_images(url, is_primary)')
    .order('created_at', { ascending: false })

  if (options.categoryId) {
    query = query.eq('category_id', options.categoryId)
  }

  if (options.query) {
    const q = `%${options.query}%`
    query = query.or(`name.ilike.${q},part_number.ilike.${q},sku.ilike.${q},description.ilike.${q},oem_cross_ref.ilike.${q}`)
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
