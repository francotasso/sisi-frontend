import productsData from '@/data/products.json'
import { Product, ProductsFilter } from '../domain/types'

export class ProductsRepository {
  private products: Product[] = productsData as unknown as Product[]

  async getAll(): Promise<Product[]> {
    return this.products
  }

  async getById(id: number): Promise<Product | undefined> {
    return this.products.find(p => p.id === id)
  }

  async getBySlug(slug: string): Promise<Product | undefined> {
    return this.products.find(p => p.slug === slug)
  }

  async getByCategory(category: string): Promise<Product[]> {
    return this.products.filter(p => p.category.toLowerCase() === category.toLowerCase())
  }

  async search(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase()
    return this.products.filter(
      p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    )
  }

  async filter(filter: ProductsFilter): Promise<Product[]> {
    let result = [...this.products]

    if (filter.category) {
      result = result.filter(p => p.category.toLowerCase() === filter.category?.toLowerCase())
    }

    if (filter.inStock) {
      result = result.filter(p => p.stock === true)
    }

    if (filter.search) {
      const lowerQuery = filter.search.toLowerCase()
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery)
      )
    }

    return result
  }

  async getCategories(): Promise<string[]> {
    const categories = Array.from(new Set(this.products.map(p => p.category)))
    categories.sort((a, b) => {
      if (a === 'Otros') return 1
      if (b === 'Otros') return -1
      return a.localeCompare(b)
    })
    return categories
  }
}

export const productsRepository = new ProductsRepository()
