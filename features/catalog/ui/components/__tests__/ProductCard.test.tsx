import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders, createProduct } from '@/shared/test/testUtils'
import ProductCard from '../ProductCard'

// Mock next/link as a simple <a> tag
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: Record<string, unknown>) => (
    <a href={href as string} {...props}>{children}</a>
  ),
}))

// Mock next/image for SafeImage component
vi.mock('next/image', () => ({
  default: ({ src, alt, className, width, height, style, ..._rest }: Record<string, unknown>) => {
    const imgProps: Record<string, unknown> = { src, alt }
    if (className) imgProps.className = className
    if (width) imgProps.width = width
    if (height) imgProps.height = height
    if (style) imgProps.style = style
    return <img {...imgProps} />
  },
}))

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('price display', () => {
    it('renders discountPrice and originalPrice when product has discountPrice', () => {
      const product = createProduct({ price: 100, discountPrice: 75 })
      renderWithProviders(<ProductCard product={product} />)

      expect(screen.getByText('S/ 75')).toBeInTheDocument()
      expect(screen.getByText('S/ 100')).toBeInTheDocument()
    })

    it('renders single price when product has no discountPrice field', () => {
      const product = createProduct({ price: 100 })
      delete (product as Record<string, unknown>).discountPrice
      renderWithProviders(<ProductCard product={product} />)

      expect(screen.getByText('S/ 100')).toBeInTheDocument()
      // Only one price element should exist
      const prices = screen.getAllByText(/S\/ \d+/)
      expect(prices).toHaveLength(1)
    })

    it('renders single price when discountPrice is undefined', () => {
      const product = createProduct({ price: 100, discountPrice: undefined })
      renderWithProviders(<ProductCard product={product} />)

      expect(screen.getByText('S/ 100')).toBeInTheDocument()
    })

    it('renders originalPrice with original-price class when discountPrice exists', () => {
      const product = createProduct({ price: 100, discountPrice: 75 })
      renderWithProviders(<ProductCard product={product} />)

      const originalPrice = screen.getByText('S/ 100')
      expect(originalPrice.className).toContain('original-price')
    })

    it('renders discountPrice with product-price class', () => {
      const product = createProduct({ price: 100, discountPrice: 75 })
      renderWithProviders(<ProductCard product={product} />)

      const discountPrice = screen.getByText('S/ 75')
      expect(discountPrice.className).toContain('product-price')
    })
  })

  describe('offer badge', () => {
    it('shows offer-badge with correct percentage when discountPrice exists', () => {
      const product = createProduct({ price: 100, discountPrice: 75 })
      renderWithProviders(<ProductCard product={product} />)

      const badge = screen.getByText('-25%')
      expect(badge).toBeInTheDocument()
      expect(badge.className).toContain('offer-badge')
    })

    it('does NOT show any offer badge when discountPrice is undefined', () => {
      const product = createProduct({ price: 100 })
      renderWithProviders(<ProductCard product={product} />)

      expect(screen.queryByText(/-?\d+%/)).not.toBeInTheDocument()
    })

    it('does NOT show offer badge when discountPrice equals price', () => {
      const product = createProduct({ price: 100, discountPrice: 100 })
      renderWithProviders(<ProductCard product={product} />)

      expect(screen.queryByText(/-?\d+%/)).not.toBeInTheDocument()
    })

    it('shows correct percentage for non-round discount', () => {
      const product = createProduct({ price: 119.9, discountPrice: 89.9 })
      renderWithProviders(<ProductCard product={product} />)

      // (1 - 89.9/119.9)*100 ≈ 25.02 -> rounds to 25
      expect(screen.getByText('-25%')).toBeInTheDocument()
    })
  })

  describe('basic rendering', () => {
    it('renders product name and category', () => {
      const product = createProduct({ name: 'Test Lipstick', category: 'Belleza' })
      renderWithProviders(<ProductCard product={product} />)

      expect(screen.getByText('Test Lipstick')).toBeInTheDocument()
      expect(screen.getByText('Belleza')).toBeInTheDocument()
    })

    it('renders stock badge when product is in stock', () => {
      const product = createProduct({ stock: true })
      renderWithProviders(<ProductCard product={product} />)

      expect(screen.getByText('En stock')).toBeInTheDocument()
    })

    it('renders soldout badge and no stock badge when product is out of stock', () => {
      const product = createProduct({ stock: false })
      renderWithProviders(<ProductCard product={product} />)

      expect(screen.getByText('Agotado')).toBeInTheDocument()
      expect(screen.queryByText('En stock')).not.toBeInTheDocument()
    })

    it('links to the product detail page', () => {
      const product = createProduct({ slug: 'test-lipstick' })
      renderWithProviders(<ProductCard product={product} />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/product/test-lipstick')
    })
  })
})
