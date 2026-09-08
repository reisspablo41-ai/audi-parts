export interface Vehicle {
  id: string
  year: number
  make: 'Audi'
  model: string
  engine: string
  trim?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  /** Icon key resolved by <CategoryIcon>; leaves inherit their parent's. */
  icon: string
  /** Null for top-level categories. */
  parentId?: string | null
  partCount: number
}

export type PartBrand = 'Genuine OEM' | 'Aftermarket'

export interface Part {
  sku: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  brand: PartBrand
  category: string
  categoryId: string
  partNumber: string
  oemCrossReference?: string
  weight?: string
  material?: string
  fitment: string[] // vehicle IDs
  images: string[]
  inStock: boolean
  stockCount: number
  rating: number
  reviewCount: number
  relatedSkus?: string[]
  tags?: string[]
  technicalDiagram?: string
}

export interface CartItem {
  sku: string
  quantity: number
  price: number
  name: string
  partNumber: string
  image?: string
}

export interface GarageVehicle extends Vehicle {
  nickname?: string
}

export interface Review {
  id: string
  sku: string
  author: string
  rating: number
  title: string
  body: string
  date: string
  verified: boolean
}

export interface FilterState {
  category: string
  brand: string
  minPrice: number
  maxPrice: number
  inStockOnly: boolean
}

export interface Testimonial {
  id: string
  author: string
  location: string
  vehicle: string
  rating: number
  quote: string
  partBought: string
  date: string
  avatarInitials: string
  avatarColor: string
}

/** The six states in the orders.status CHECK constraint (supabase-schema.sql). */
export const ORDER_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export interface OrderItem {
  id: number
  sku: string
  quantity: number
  unitPrice: number
  totalPrice: number
  /** Name and number captured at purchase time, so renames don't rewrite history. */
  name: string
}

export interface Order {
  id: number
  orderNumber: string
  email: string
  status: OrderStatus
  subtotal: number
  shippingCost: number
  tax: number
  discount: number
  total: number
  currency: string
  trackingNumber: string | null
  carrier: string | null
  /** Checkout writes the shipping address and phone here as free text. */
  notes: string | null
  placedAt: string
  items: OrderItem[]
  itemCount: number
}

export const BLOG_STATUSES = ['draft', 'published'] as const
export type BlogStatus = (typeof BLOG_STATUSES)[number]

export interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string
  /** Markdown — see components/Markdown.tsx for the supported subset. */
  body: string
  coverImageUrl: string | null
  authorName: string
  status: BlogStatus
  /** Falls back to `title` when unset. */
  metaTitle: string
  /** Falls back to `excerpt` when unset. */
  metaDescription: string
  tags: string[]
  /** SKUs this post links to, for internal linking to product pages. */
  relatedSkus: string[]
  publishedAt: string | null
  updatedAt: string
}
