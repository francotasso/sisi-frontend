import { productsRepository } from '../repositories/productsRepository'
import { Product, ProductsFilter, SortOption } from '../domain/types'
import { NEW_PRODUCT_DAYS } from '@/shared/utils/constants'

export class CatalogService {
  async getProducts(filter?: ProductsFilter, sort?: SortOption): Promise<Product[]> {
    let products = filter ? await productsRepository.filter(filter) : await productsRepository.getAll()

    if (filter?.isNew) {
      products = products.filter(p => this.isNewProduct(p))
    }

    if (sort) {
      products = this.sortProducts(products, sort)
    }

    return products
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return productsRepository.getById(id)
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return productsRepository.getBySlug(slug)
  }

  async getCategories(): Promise<string[]> {
    return productsRepository.getCategories()
  }

  async searchProducts(query: string): Promise<Product[]> {
    return productsRepository.search(query)
  }

  private sortProducts(products: Product[], sort: SortOption): Product[] {
    const sorted = [...products]

    const effectivePrice = (p: Product) => p.discountPrice ?? p.price

    switch (sort) {
      case 'price-low':
        return sorted.sort((a, b) => effectivePrice(a) - effectivePrice(b))
      case 'price-high':
        return sorted.sort((a, b) => effectivePrice(b) - effectivePrice(a))
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'newest':
      default:
        return sorted
    }
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
