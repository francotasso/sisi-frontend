export interface ProductSpecs {
  brand: string
  type: string
  shade?: string
  finish?: string
  size: string
  ingredients?: string
  spf?: string
  skinType?: string
  notes?: string
  benefits?: string
  includes?: string
}

export interface ProductFAQ {
  question: string
  answer: string
}

export interface Product {
  id: number
  sku: string
  slug: string
  name: string
  price: number
  discountPrice?: number
  category: string
  image: string
  images?: string[]
  description: string
  shortDescription: string
  stock: boolean
  stockCount?: number
  bestSeller?: boolean
  createdAt: string
  specs: ProductSpecs
  warranty?: string
  returnPolicy?: string
  faq: ProductFAQ[]
}

export interface ProductsFilter {
  category?: string
  inStock?: boolean
  search?: string
  isNew?: boolean
}

export type SortOption = 'newest' | 'price-low' | 'price-high' | 'name'
