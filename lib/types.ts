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
