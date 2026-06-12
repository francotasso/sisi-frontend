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
  async getProducts(filter?: ProductsFilter, sort?: SortOption): Promise<Product[]> {
    const apiSort = sort ? sortToApiSort(sort) : undefined

    let products: Product[]

    if (filter) {
      const filterWithSort: ProductsFilter = { ...filter, sortBy: apiSort }
      products = await productsRepository.filter(filterWithSort, apiSort)
    } else {
      products = await productsRepository.getAll(apiSort)
    }

    if (filter?.isNew) {
      products = products.filter(p => this.isNewProduct(p))
    }

    return products
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return productsRepository.getById(id)
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return productsRepository.getBySlug(slug)
  }

  async getCategories(): Promise<{ value: string; label: string }[]> {
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
