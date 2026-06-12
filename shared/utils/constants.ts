export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '51934164201'
export const WHATSAPP_COUNTRY_CODE = '51'
export const STORE_NAME = 'Sisi'
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
  ?? 'https://sisi.pe'

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL) ?? 'http://localhost:8000/api/v1'

export const SEARCH_DEBOUNCE_MS = 400
export const PRODUCTS_PER_PAGE = 15
export const MAX_QUANTITY = 99

export const PRICE_RANGE = {
  MIN: 0,
  MAX: 200,
}

export const NEW_PRODUCT_DAYS = 14
