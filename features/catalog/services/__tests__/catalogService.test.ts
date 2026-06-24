import { describe, it, expect, vi, beforeEach } from 'vitest'
import { catalogService } from '../catalogService'
import { Product } from '../../domain/types'

const mockGetAll = vi.fn()
const mockFilter = vi.fn()

vi.mock('@/features/catalog/repositories/productsRepository', () => ({
  productsRepository: {
    getAll: (...args: unknown[]) => mockGetAll(...args),
    filter: (...args: unknown[]) => mockFilter(...args),
    getBySlug: vi.fn(),
    getById: vi.fn(),
    search: vi.fn(),
    getCategories: vi.fn(),
  },
}))

function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: '1',
    slug: 'test-product',
    name: 'Test Product',
    price: 100,
    category: 'Test Category',
    image: 'https://example.com/img.jpg',
    description: 'A test product description',
    shortDescription: 'Test description',
    stock: true,
    createdAt: new Date().toISOString(),
    specs: { brand: 'Test Brand', type: 'Test Type', size: '100ml' },
    faq: [],
    ...overrides,
  }
}

const productA = createProduct({ id: 'a', name: 'Alpha', price: 50, discountPrice: 40 })
const productB = createProduct({ id: 'b', name: 'Beta', price: 100 })
const productC = createProduct({ id: 'c', name: 'Gamma', price: 80, discountPrice: 60 })
const productD = createProduct({ id: 'd', name: 'Delta', price: 120, discountPrice: 90 })

const mockProducts = [productA, productB, productC, productD]

describe('CatalogService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getDiscountPercentage', () => {
    it('returns null when discountPrice is undefined', () => {
      const product = createProduct({ discountPrice: undefined })
      expect(catalogService.getDiscountPercentage(product)).toBeNull()
    })

    it('returns null when discountPrice is missing from the object', () => {
      const product = createProduct()
      delete (product as Record<string, unknown>).discountPrice
      expect(catalogService.getDiscountPercentage(product)).toBeNull()
    })

    it('returns correct percentage when discountPrice exists and is lower than price', () => {
      const product = createProduct({ price: 100, discountPrice: 75 })
      expect(catalogService.getDiscountPercentage(product)).toBe(25)
    })

    it('returns correct percentage for a non-round number discount', () => {
      const product = createProduct({ price: 119.9, discountPrice: 89.9 })
      expect(catalogService.getDiscountPercentage(product)).toBe(25)
    })

    it('returns null when discountPrice equals price (no actual discount)', () => {
      const product = createProduct({ price: 100, discountPrice: 100 })
      expect(catalogService.getDiscountPercentage(product)).toBeNull()
    })

    it('returns null when discountPrice is higher than price', () => {
      const product = createProduct({ price: 100, discountPrice: 120 })
      expect(catalogService.getDiscountPercentage(product)).toBeNull()
    })

    it('returns null when discountPrice is zero', () => {
      const product = createProduct({ price: 100, discountPrice: 0 })
      expect(catalogService.getDiscountPercentage(product)).toBeNull()
    })

    it('rounds percentage correctly for fractional discounts', () => {
      const product = createProduct({ price: 99, discountPrice: 66 })
      expect(catalogService.getDiscountPercentage(product)).toBe(33)
    })
  })

  describe('isNewProduct', () => {
    it('returns true for product created today', () => {
      const product = createProduct({ createdAt: new Date().toISOString() })
      expect(catalogService.isNewProduct(product)).toBe(true)
    })

    it('returns true for product created 13 days ago', () => {
      const date = new Date()
      date.setDate(date.getDate() - 13)
      const product = createProduct({ createdAt: date.toISOString() })
      expect(catalogService.isNewProduct(product)).toBe(true)
    })

    it('returns true for product created just under 14 days ago (boundary)', () => {
      const date = new Date(Date.now() - 13.99 * 24 * 60 * 60 * 1000)
      const product = createProduct({ createdAt: date.toISOString() })
      expect(catalogService.isNewProduct(product)).toBe(true)
    })

    it('returns false for product created 15 days ago', () => {
      const date = new Date()
      date.setDate(date.getDate() - 15)
      const product = createProduct({ createdAt: date.toISOString() })
      expect(catalogService.isNewProduct(product)).toBe(false)
    })

    it('returns false for product created 30 days ago', () => {
      const date = new Date()
      date.setDate(date.getDate() - 30)
      const product = createProduct({ createdAt: date.toISOString() })
      expect(catalogService.isNewProduct(product)).toBe(false)
    })
  })

  describe('getProducts delegation', () => {
    it('calls getAll when no filter is provided', async () => {
      mockGetAll.mockResolvedValue({ products: mockProducts, total: mockProducts.length })
      const result = await catalogService.getProducts()
      expect(mockGetAll).toHaveBeenCalled()
      expect(result).toEqual(mockProducts)
    })

    it('calls filter when category filter is provided', async () => {
      mockFilter.mockResolvedValue({ products: [productA], total: 1 })
      const result = await catalogService.getProducts({ category: 'Test Category' })
      expect(mockFilter).toHaveBeenCalled()
      expect(result).toEqual([productA])
    })

    it('filters by isNew after fetching', async () => {
      const oldProduct = createProduct({
        id: 'old',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      const newProduct = createProduct({
        id: 'new',
        createdAt: new Date().toISOString(),
      })
      mockFilter.mockResolvedValue({ products: [oldProduct, newProduct], total: 2 })
      const result = await catalogService.getProducts({ isNew: true })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('new')
    })
  })
})
