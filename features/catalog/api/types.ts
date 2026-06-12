export interface ApiProductListItem {
  id: string
  name: string
  slug: string
  price: number
  discount_price?: number
  image: string
  short_description: string
  stock: boolean
  stock_count: number
  sku: string
  category_name: string
  category_slug?: string
  created_at: string
  updated_at: string
  best_seller?: boolean
}

export interface ApiProductSpecs {
  brand: string
  product_type: string
  shade: string | null
  finish: string | null
  size: string
  ingredients: string | null
  spf: string | null
  skin_type: string | null
  notes: string | null
  benefits: string | null
  includes: string | null
}

export interface ApiProductFAQ {
  question: string
  answer: string
}

export interface ApiProductDetail extends ApiProductListItem {
  description: string
  specs: ApiProductSpecs
  faqs: ApiProductFAQ[]
}

export interface ApiCategory {
  id: string
  name: string
  slug: string
}

export interface ApiStoreContact {
  phone: string
  whatsapp: string
  email: string
  address: string
  address_map: string
}

export interface ApiStoreHour {
  day: string
  open_time: string | null
  close_time: string | null
  is_closed: boolean
}

export interface ApiStoreSocialMedia {
  platform: string
  url: string
}

export interface ApiStore {
  store_name: string
  description: string
  contact: ApiStoreContact
  hours: ApiStoreHour[]
  social_media: ApiStoreSocialMedia[]
}

export interface ApiTestimonial {
  id: string
  name: string
  text: string
  rating: number
  avatar: string | null
}

export interface ApiPaginatedResponse<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}
