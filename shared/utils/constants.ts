export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
export const WHATSAPP_COUNTRY_CODE = '51'
export const STORE_NAME = 'Sisi'
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const SEARCH_DEBOUNCE_MS = 400
export const PRODUCTS_PER_PAGE = 15
export const MAX_QUANTITY = 99

export const PRICE_RANGE = {
  MIN: 0,
  MAX: 200,
}

export const API_ROUTES = {
  PRODUCTS: '/api/products',
} as const

export const NEW_PRODUCT_DAYS = 14
