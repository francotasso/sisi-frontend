import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { renderWithProviders, createProduct } from '@/shared/test/testUtils'
import WishlistPage from '../WishlistPage'

const product3 = createProduct({
  id: '3',
  slug: 'perfume-floral-dulce',
  name: 'Perfume Floral Dulce',
  price: 119.9,
  discountPrice: 89.9,
  category: 'Belleza',
  image: 'https://example.com/perfume.jpg',
  stock: true,
})

const product4 = createProduct({
  id: '4',
  slug: 'crema-hidratante-facial',
  name: 'Crema Hidratante Facial',
  price: 58.9,
  category: 'Belleza',
  image: 'https://example.com/crema.jpg',
  stock: true,
})

const mockGetProductsBySlugs = vi.fn()
vi.mock('@/features/catalog/services/catalogService', () => ({
  catalogService: {
    getProducts: vi.fn(),
    getProductBySlug: vi.fn(),
    getProductById: vi.fn(),
    getProductsBySlugs: (...args: unknown[]) => mockGetProductsBySlugs(...args),
    isNewProduct: vi.fn(() => false),
    getDiscountPercentage: vi.fn((p: { discountPrice?: number; price: number }) => {
      if (!p.discountPrice || p.discountPrice >= p.price) return null
      return Math.round((1 - p.discountPrice / p.price) * 100)
    }),
    isInStock: vi.fn((p: { stock: boolean }) => p.stock === true),
  },
}))

// Mock next/navigation useSearchParams to simulate shareable link params
const mockUseSearchParams = vi.fn()
vi.mock('next/navigation', () => ({
  useSearchParams: (...args: unknown[]) => mockUseSearchParams(...args),
}))

// Mock next/link as a simple <a> tag
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: Record<string, unknown>) => (
    <a href={href as string} {...props}>{children}</a>
  ),
}))

// Mock next/image for SafeImage
vi.mock('next/image', () => ({
  default: ({ src, alt, className, width, height, ..._rest }: Record<string, unknown>) => {
    const imgProps: Record<string, unknown> = { src, alt }
    if (className) imgProps.className = className
    if (width) imgProps.width = width
    if (height) imgProps.height = height
    return <img {...imgProps} />
  },
}))

describe('WishlistPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseSearchParams.mockReturnValue(new URLSearchParams('items=perfume-floral-dulce'))
    mockGetProductsBySlugs.mockImplementation((_slugs: string[]) => Promise.resolve([product3]))
  })

  describe('product with discountPrice', () => {
    it('displays discountPrice, originalPrice and offer badge after loading', async () => {
      renderWithProviders(<WishlistPage />)

      await waitFor(() => {
        expect(screen.getAllByText(/S\/\s*89\.?9/).length).toBeGreaterThanOrEqual(1)
      })

      // Product 3: Perfume Floral Dulce, discountPrice 89.9, price 119.9
      const priceElements = screen.getAllByText(/S\/\s*89\.?9/)
      expect(priceElements.length).toBeGreaterThanOrEqual(1)

      // Original price should be visible too
      expect(screen.getByText('S/ 119.9')).toBeInTheDocument()

      // Offer badge with 25% discount: (1 - 89.9/119.9) * 100 ≈ 25
      expect(screen.getByText('-25%')).toBeInTheDocument()
    })

    it('shows product name and category in the wishlist item', async () => {
      renderWithProviders(<WishlistPage />)

      await waitFor(() => {
        expect(screen.getByText('Perfume Floral Dulce')).toBeInTheDocument()
      })
      expect(screen.getByText('Belleza')).toBeInTheDocument()
    })
  })

  describe('product without discountPrice', () => {
    beforeEach(() => {
      mockUseSearchParams.mockReturnValue(new URLSearchParams('items=crema-hidratante-facial'))
    })

    it('displays single price without offer badge after loading', async () => {
      mockGetProductsBySlugs.mockImplementation(() => Promise.resolve([product4]))
      renderWithProviders(<WishlistPage />)

      await waitFor(() => {
        expect(screen.getByText('S/ 58.9')).toBeInTheDocument()
      })

      // Product 4: Crema Hidratante Facial, price 58.9, no discountPrice

      // No offer badge should be present
      expect(screen.queryByText(/-?\d+%/)).not.toBeInTheDocument()
    })
  })

  describe('effectivePrice and totalPrice calculations', () => {
    it('shows original subtotal, discount and effective total for discounted product', async () => {
      renderWithProviders(<WishlistPage />)

      await waitFor(() => {
        expect(screen.getAllByText(/S\/\s*89\.?9/).length).toBeGreaterThanOrEqual(1)
      })

      // Item shows discount price S/ 89.9 (no trailing zero from JSON)
      expect(screen.getAllByText(/S\/\s*89\.?9/).length).toBeGreaterThanOrEqual(1)

      // Productos header shows original subtotal: S/ 119.90
      expect(screen.getByText('S/ 119.90')).toBeInTheDocument()

      // Descuentos header shows -S/ 30.00
      expect(screen.getByText('-S/ 30.00')).toBeInTheDocument()

      // Total shows effective total: S/ 89.90
      expect(screen.getByText('S/ 89.90')).toBeInTheDocument()
    })

    it('handles multiple items with mixed discount/no-discount', async () => {
      mockUseSearchParams.mockReturnValue(new URLSearchParams('items=perfume-floral-dulce,crema-hidratante-facial'))
      mockGetProductsBySlugs.mockImplementation(() => Promise.resolve([product3, product4]))
      renderWithProviders(<WishlistPage />)

      await waitFor(() => {
        expect(screen.getByText('S/ 58.9')).toBeInTheDocument()
      })

      // Product 4 price shows as S/ 58.9 (no trailing zero from JSON)

      // Productos header shows original subtotal: 119.9 + 58.9 = 178.80
      expect(screen.getByText('S/ 178.80')).toBeInTheDocument()

      // Total = 178.80 - 30.00 = 148.80
      expect(screen.getByText('S/ 148.80')).toBeInTheDocument()
    })
  })

  describe('WhatsApp messages', () => {
    it('individual WhatsApp message uses discountPrice when available', async () => {
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
      renderWithProviders(<WishlistPage />)

      await waitFor(() => {
        expect(screen.getByText('Comprar')).toBeInTheDocument()
      })

      // Find and click "Comprar" button for the individual item
      const buyButtons = screen.getAllByText('Comprar')
      expect(buyButtons.length).toBeGreaterThanOrEqual(1)

      fireEvent.click(buyButtons[0])

      expect(openSpy).toHaveBeenCalledTimes(1)
      const url = openSpy.mock.calls[0][0] as string
      const decodedMessage = decodeURIComponent(url)

      // Should use discountPrice 89.9
      expect(decodedMessage).toContain('S/ 89.9')

      openSpy.mockRestore()
    })

    it('consolidated WhatsApp message uses discountPrice in totals', async () => {
      mockUseSearchParams.mockReturnValue(new URLSearchParams('items=perfume-floral-dulce,crema-hidratante-facial'))
      mockGetProductsBySlugs.mockImplementation(() => Promise.resolve([product3, product4]))
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
      renderWithProviders(<WishlistPage />)

      await waitFor(() => {
        expect(screen.getByText('Pedir todo por WhatsApp')).toBeInTheDocument()
      })

      // Click "Pedir todo por WhatsApp"
      const orderAllBtn = screen.getByText('Pedir todo por WhatsApp')
      fireEvent.click(orderAllBtn)

      expect(openSpy).toHaveBeenCalledTimes(1)
      const url = openSpy.mock.calls[0][0] as string
      const decodedMessage = decodeURIComponent(url)

      // Should reference the correct prices
      expect(decodedMessage).toContain('Perfume Floral Dulce')
      expect(decodedMessage).toContain('Crema Hidratante Facial')
      // Total should be 89.9 + 58.9 = 148.8
      expect(decodedMessage).toContain('S/ 148.80')

      openSpy.mockRestore()
    })

    it('consolidated WhatsApp message with single discounted item', async () => {
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
      renderWithProviders(<WishlistPage />)

      await waitFor(() => {
        expect(screen.queryByText('Cargando...')).not.toBeInTheDocument()
      })

      const orderAllBtn = screen.getByText('Pedir todo por WhatsApp')
      fireEvent.click(orderAllBtn)

      expect(openSpy).toHaveBeenCalledTimes(1)
      const url = openSpy.mock.calls[0][0] as string
      const decodedMessage = decodeURIComponent(url)

      // Total should be 89.9
      expect(decodedMessage).toContain('S/ 89.90')

      openSpy.mockRestore()
    })
  })

  describe('empty state', () => {
    it('shows empty wishlist message when no items are shared', async () => {
      mockUseSearchParams.mockReturnValue(new URLSearchParams(''))
      renderWithProviders(<WishlistPage />)

      expect(screen.getByText('Tu wishlist está vacía')).toBeInTheDocument()
      expect(screen.getByText('Ver Productos')).toBeInTheDocument()
    })
  })

  describe('quantity display', () => {
    it('shows correct item count header with singular form', async () => {
      renderWithProviders(<WishlistPage />)

      await waitFor(() => {
        expect(screen.getByText(/Mi lista de deseos/)).toBeInTheDocument()
      })
    })
  })
})
