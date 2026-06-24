import { get, getPaginated } from '@/shared/utils/api'
import type {
  ApiProductListItem,
  ApiProductDetail,
  ApiBatchProduct,
  ApiCategory,
} from '@/features/catalog/api/types'
import { mapProductListItem, mapProductDetail, mapBatchProduct } from '@/features/catalog/services/productMapper'
import type { Product, ProductsFilter } from '@/features/catalog/domain/types'

let categoryMapPromise: Promise<Map<string, string>> | null = null

async function getCategorySlugMap(): Promise<Map<string, string>> {
  if (!categoryMapPromise) {
    categoryMapPromise = get<ApiCategory[]>('/categories').then(
      cats => new Map(cats.map(c => [c.name, c.slug]))
    )
  }
  return categoryMapPromise
}

function enrichWithCategorySlug(products: Product[], map: Map<string, string>): Product[] {
  return products.map(p => ({
    ...p,
    categorySlug: p.categorySlug ?? map.get(p.category) ?? p.category,
  }))
}

function buildFilterParams(filter?: ProductsFilter): Record<string, string | number | boolean | undefined> {
  if (!filter) return {}

  return {
    category: filter.category || undefined,
    search: filter.search || undefined,
    stock: filter.inStock ? 'true' : undefined,
    price_min: filter.priceMin,
    price_max: filter.priceMax,
  }
}

function buildSortParams(sort?: string): { sort_by?: string; sort_order?: string } {
  switch (sort) {
    case 'price-low':
      return { sort_by: 'price', sort_order: 'asc' }
    case 'price-high':
      return { sort_by: 'price', sort_order: 'desc' }
    case 'name':
      return { sort_by: 'name', sort_order: 'asc' }
    case 'newest':
    default:
      return { sort_by: 'created_at', sort_order: 'desc' }
  }
}

const PAGE_SIZE = 15
const SLUG_CACHE_TTL = 60_000

export class ProductsRepository {
  private slugCache = new Map<string, { data: Product; ts: number }>()
  private pendingBySlug = new Map<string, Promise<Product | undefined>>()
  private pendingRequests = new Map<string, Promise<unknown>>()

  private async dedupFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const keyStr = JSON.stringify(key)
    const pending = this.pendingRequests.get(keyStr)
    if (pending) return pending as Promise<T>
    const promise = fetcher()
    this.pendingRequests.set(keyStr, promise as Promise<unknown>)
    try {
      return await promise
    } finally {
      this.pendingRequests.delete(keyStr)
    }
  }

  async getAll(sort?: string, page?: number): Promise<{ products: Product[]; total: number }> {
    const resolvedPage = page ?? 1
    const skip = (resolvedPage - 1) * PAGE_SIZE
    const params = { ...buildSortParams(sort), skip, limit: PAGE_SIZE }
    const { items, total } = await getPaginated<ApiProductListItem>('/products', params)
    const products = enrichWithCategorySlug(items.map(mapProductListItem), await getCategorySlugMap())
    return { products, total }
  }

  private pendingBySlugs = new Map<string, Promise<Product[]>>()

  async getBySlugs(slugs: string[]): Promise<Product[]> {
    if (slugs.length === 0) return []
    const key = [...new Set(slugs)].sort().join(',')

    const pending = this.pendingBySlugs.get(key)
    if (pending) return pending

    const promise = this._fetchBySlugs(key)
    this.pendingBySlugs.set(key, promise)
    try {
      return await promise
    } finally {
      this.pendingBySlugs.delete(key)
    }
  }

  private async _fetchBySlugs(slugStr: string): Promise<Product[]> {
    const items = await get<ApiBatchProduct[]>(`/products/batch?slugs=${slugStr}`)
    const map = await getCategorySlugMap()
    return enrichWithCategorySlug(items.map(mapBatchProduct), map)
  }

  async getBySlug(slug: string): Promise<Product | undefined> {
    const pending = this.pendingBySlug.get(slug)
    if (pending) return pending

    const cached = this.slugCache.get(slug)
    if (cached && Date.now() - cached.ts < SLUG_CACHE_TTL) {
      return cached.data
    }

    const promise = this._fetchBySlug(slug)
    this.pendingBySlug.set(slug, promise)
    try {
      return await promise
    } finally {
      this.pendingBySlug.delete(slug)
    }
  }

  private async _fetchBySlug(slug: string): Promise<Product | undefined> {
    try {
      const api = await get<ApiProductDetail>(`/products/${slug}`)
      const product = mapProductDetail(api)
      const map = await getCategorySlugMap()
      const enriched = enrichWithCategorySlug([product], map)[0]
      this.slugCache.set(slug, { data: enriched, ts: Date.now() })
      return enriched
    } catch {
      return undefined
    }
  }

  async getById(id: string): Promise<Product | undefined> {
    return this.getBySlug(id)
  }

  async getNewest(limit = 4): Promise<Product[]> {
    const items = await get<ApiProductListItem[]>(`/products/newest?limit=${limit}`)
    return enrichWithCategorySlug(items.map(mapProductListItem), await getCategorySlugMap())
  }

  async getBestSellers(limit = 4): Promise<Product[]> {
    const items = await get<ApiProductListItem[]>(`/products/best-sellers?limit=${limit}`)
    return enrichWithCategorySlug(items.map(mapProductListItem), await getCategorySlugMap())
  }

  async getByCategory(category: string): Promise<Product[]> {
    return this.dedupFetch(`byCategory:${category}`, async () => {
      const { items } = await getPaginated<ApiProductListItem>('/products', { category, skip: 0, limit: PAGE_SIZE })
      return enrichWithCategorySlug(items.map(mapProductListItem), await getCategorySlugMap())
    })
  }

  async search(query: string): Promise<Product[]> {
    return this.dedupFetch(`search:${query}`, async () => {
      const { items } = await getPaginated<ApiProductListItem>('/products', { search: query, skip: 0, limit: PAGE_SIZE })
      return enrichWithCategorySlug(items.map(mapProductListItem), await getCategorySlugMap())
    })
  }

  async filter(filter: ProductsFilter, sort?: string, page?: number): Promise<{ products: Product[]; total: number }> {
    const resolvedPage = page ?? 1
    const skip = (resolvedPage - 1) * PAGE_SIZE
    const params = { ...buildFilterParams(filter), ...buildSortParams(sort), skip, limit: PAGE_SIZE }
    const { items, total } = await getPaginated<ApiProductListItem>('/products', params)
    const products = enrichWithCategorySlug(items.map(mapProductListItem), await getCategorySlugMap())
    return { products, total }
  }

  async getCategories(): Promise<{ value: string; label: string; description: string; image: string }[]> {
    const categories = await get<ApiCategory[]>('/categories')
    return categories.map(c => ({ value: c.slug, label: c.name, description: c.short_description, image: c.image }))
  }
}

export const productsRepository = new ProductsRepository()
