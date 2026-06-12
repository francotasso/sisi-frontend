import { get, getPaginated } from '@/shared/utils/api'
import type {
  ApiProductListItem,
  ApiProductDetail,
  ApiCategory,
} from '@/features/catalog/api/types'
import { mapProductListItem, mapProductDetail } from '@/features/catalog/services/productMapper'
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
    skip: 0,
    limit: 100,
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

export class ProductsRepository {
  async getAll(sort?: string): Promise<Product[]> {
    const params = { ...buildSortParams(sort), skip: 0, limit: 100 }
    const { items } = await getPaginated<ApiProductListItem>('/products', params)
    return enrichWithCategorySlug(items.map(mapProductListItem), await getCategorySlugMap())
  }

  async getBySlug(slug: string): Promise<Product | undefined> {
    try {
      const api = await get<ApiProductDetail>(`/products/${slug}`)
      const product = mapProductDetail(api)
      const map = await getCategorySlugMap()
      return enrichWithCategorySlug([product], map)[0]
    } catch {
      return undefined
    }
  }

  async getById(id: string): Promise<Product | undefined> {
    const { items } = await getPaginated<ApiProductListItem>('/products', { skip: 0, limit: 100 })
    const api = items.find(p => p.id === id)
    if (!api) return undefined
    const product = mapProductListItem(api)
    const map = await getCategorySlugMap()
    return enrichWithCategorySlug([product], map)[0]
  }

  async getByCategory(category: string): Promise<Product[]> {
    const { items } = await getPaginated<ApiProductListItem>('/products', { category, skip: 0, limit: 100 })
    return enrichWithCategorySlug(items.map(mapProductListItem), await getCategorySlugMap())
  }

  async search(query: string): Promise<Product[]> {
    const { items } = await getPaginated<ApiProductListItem>('/products', { search: query, skip: 0, limit: 100 })
    return enrichWithCategorySlug(items.map(mapProductListItem), await getCategorySlugMap())
  }

  async filter(filter: ProductsFilter, sort?: string): Promise<Product[]> {
    const params = { ...buildFilterParams(filter), ...buildSortParams(sort) }
    const { items } = await getPaginated<ApiProductListItem>('/products', params)
    return enrichWithCategorySlug(items.map(mapProductListItem), await getCategorySlugMap())
  }

  async getCategories(): Promise<{ value: string; label: string }[]> {
    const categories = await get<ApiCategory[]>('/categories')
    return categories.map(c => ({ value: c.slug, label: c.name }))
  }
}

export const productsRepository = new ProductsRepository()
