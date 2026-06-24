import { productsRepository } from '../repositories/productsRepository'
import { Product, ProductsFilter, SortOption } from '../domain/types'
import { NEW_PRODUCT_DAYS } from '@/shared/utils/constants'

function sortToApiSort(sort: SortOption): string | undefined {
  switch (sort) {
    case 'newest':
      return undefined
    case 'price-low':
      return 'price-low'
    case 'price-high':
      return 'price-high'
    case 'name':
      return 'name'
  }
}

export class CatalogService {
  async getProductsPaginated(
    filter?: ProductsFilter,
    sort?: SortOption,
    page?: number,
  ): Promise<{ products: Product[]; total: number }> {
    const apiSort = sort ? sortToApiSort(sort) : undefined

    let result: { products: Product[]; total: number }

    if (filter) {
      const filterWithSort: ProductsFilter = { ...filter, sortBy: apiSort }
      result = await productsRepository.filter(filterWithSort, apiSort, page)
    } else {
      result = await productsRepository.getAll(apiSort, page)
    }

    if (filter?.isNew) {
      result.products = result.products.filter(p => this.isNewProduct(p))
      result.total = result.products.length
    }

    return result
  }

  async getProducts(filter?: ProductsFilter, sort?: SortOption): Promise<Product[]> {
    const { products } = await this.getProductsPaginated(filter, sort)
    return products
  }

  async getAllProducts(filter?: ProductsFilter, sort?: SortOption): Promise<Product[]> {
    let page = 1
    const all: Product[] = []
    let total = 0
    do {
      const result = await this.getProductsPaginated(filter, sort, page)
      all.push(...result.products)
      total = result.total
      page++
    } while (all.length < total)
    return all
  }

  async getNewestProducts(limit = 4): Promise<Product[]> {
    return productsRepository.getNewest(limit)
  }

  async getBestSellersProducts(limit = 4): Promise<Product[]> {
    return productsRepository.getBestSellers(limit)
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return productsRepository.getById(id)
  }

  async getProductsBySlugs(slugs: string[]): Promise<Product[]> {
    return productsRepository.getBySlugs(slugs)
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return productsRepository.getBySlug(slug)
  }

  async getCategories(): Promise<{ value: string; label: string; description: string; image: string }[]> {
    return productsRepository.getCategories()
  }

  async searchProducts(query: string): Promise<Product[]> {
    return productsRepository.search(query)
  }

  isNewProduct(product: Product): boolean {
    const created = new Date(product.createdAt)
    const now = new Date()
    const diff = now.getTime() - created.getTime()
    return diff <= NEW_PRODUCT_DAYS * 24 * 60 * 60 * 1000
  }

  getDiscountPercentage(product: Product): number | null {
    if (!product.discountPrice || product.discountPrice >= product.price) return null
    return Math.round((1 - product.discountPrice / product.price) * 100)
  }

  isInStock(product: Product): boolean {
    return product.stock === true
  }
}

export const catalogService = new CatalogService()
