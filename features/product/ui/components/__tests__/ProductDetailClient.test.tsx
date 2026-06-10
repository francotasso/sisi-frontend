import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProviders, createTestStore, createProduct } from '@/shared/test/testUtils'
import ProductDetailClient from '../ProductDetailClient'

// Mock child components to focus only on price/badge/WhatsApp behavior
vi.mock('../ImageGallery', () => ({
  default: () => <div data-testid="mock-image-gallery" />,
}))

vi.mock('../ProductSpecs', () => ({
  default: () => <div data-testid="mock-product-specs" />,
}))

vi.mock('../ProductRelated', () => ({
  default: () => <div data-testid="mock-product-related" />,
}))

vi.mock('../FaqAccordion', () => ({
  default: () => <div data-testid="mock-faq-accordion" />,
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: Record<string, unknown>) => (
    <a href={href as string} {...props}>{children}</a>
  ),
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, className, width, height, ..._rest }: Record<string, unknown>) => {
    const imgProps: Record<string, unknown> = { src, alt }
    if (className) imgProps.className = className
    if (width) imgProps.width = width
    if (height) imgProps.height = height
    return <img {...imgProps} />
  },
}))

// Mock useRecentlyViewed
vi.mock('@/shared/hooks/useRecentlyViewed', () => ({
  useRecentlyViewed: () => ({
    addRecentlyViewed: vi.fn(),
    items: [],
  }),
}))

describe('ProductDetailClient', () => {
  const baseProps = {
    relatedProducts: [] as import('@/features/catalog/domain/types').Product[],
    currentProductCategory: 'Test Category',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('price section', () => {
    it('shows discountPrice, originalPrice and offer badge when product has discountPrice', () => {
      const product = createProduct({ price: 100, discountPrice: 75 })
      renderWithProviders(
        <ProductDetailClient product={product} {...baseProps} />
      )

      expect(screen.getByText('S/ 75')).toBeInTheDocument()
      expect(screen.getByText('S/ 100')).toBeInTheDocument()
      expect(screen.getByText('-25%')).toBeInTheDocument()
    })

    it('shows single price when product has no discountPrice', () => {
      const product = createProduct({ price: 100 })
      renderWithProviders(
        <ProductDetailClient product={product} {...baseProps} />
      )

      expect(screen.getByText('S/ 100')).toBeInTheDocument()
      expect(screen.queryByText('-25%')).not.toBeInTheDocument()
      // Only one price element
      const prices = screen.getAllByText(/S\/ \d+/)
      expect(prices).toHaveLength(1)
    })

    it('renders offer badge with offer-badge-detail class when discountPrice exists', () => {
      const product = createProduct({ price: 100, discountPrice: 75 })
      renderWithProviders(
        <ProductDetailClient product={product} {...baseProps} />
      )

      const badge = screen.getByText('-25%')
      expect(badge.className).toContain('offer-badge-detail')
    })

    it('shows correct discount percentage for non-round numbers', () => {
      const product = createProduct({ price: 119.9, discountPrice: 89.9 })
      renderWithProviders(
        <ProductDetailClient product={product} {...baseProps} />
      )

      expect(screen.getByText('-25%')).toBeInTheDocument()
    })
  })

  describe('WhatsApp message', () => {
    it('uses discountPrice in WhatsApp message when discountPrice is available', () => {
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
      const product = createProduct({ price: 100, discountPrice: 75, name: 'Test Product' })

      renderWithProviders(
        <ProductDetailClient product={product} {...baseProps} />
      )

      const whatsappBtn = screen.getByRole('button', { name: /comprar por whatsapp/i })
      fireEvent.click(whatsappBtn)

      expect(openSpy).toHaveBeenCalledTimes(1)
      const url = openSpy.mock.calls[0][0] as string
      expect(url).toContain('wa.me/51934164201')

      // Verify the message contains the discountPrice (75), not the original (100)
      const decodedMessage = decodeURIComponent(url)
      expect(decodedMessage).toContain('S/ 75')
      expect(decodedMessage).toContain('Test Product')

      openSpy.mockRestore()
    })

    it('uses regular price in WhatsApp message when discountPrice is not available', () => {
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
      const product = createProduct({ price: 100, name: 'Test Product' })

      renderWithProviders(
        <ProductDetailClient product={product} {...baseProps} />
      )

      const whatsappBtn = screen.getByRole('button', { name: /comprar por whatsapp/i })
      fireEvent.click(whatsappBtn)

      expect(openSpy).toHaveBeenCalledTimes(1)
      const url = openSpy.mock.calls[0][0] as string

      const decodedMessage = decodeURIComponent(url)
      expect(decodedMessage).toContain('S/ 100')
      expect(decodedMessage).toContain('Test Product')
      // Verify discountPrice (75) is NOT in the message
      expect(decodedMessage).not.toContain('S/ 75')

      openSpy.mockRestore()
    })

    it('opens WhatsApp in a new tab', () => {
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
      const product = createProduct({ price: 100, name: 'Test Product' })

      renderWithProviders(
        <ProductDetailClient product={product} {...baseProps} />
      )

      const whatsappBtn = screen.getByRole('button', { name: /comprar por whatsapp/i })
      fireEvent.click(whatsappBtn)

      expect(openSpy).toHaveBeenCalledWith(expect.any(String), '_blank')

      openSpy.mockRestore()
    })
  })

  describe('stock behavior', () => {
    it('disables WhatsApp button when product is out of stock', () => {
      const product = createProduct({ stock: false, price: 100 })
      renderWithProviders(
        <ProductDetailClient product={product} {...baseProps} />
      )

      const whatsappBtn = screen.getByRole('button', { name: /producto agotado/i })
      expect(whatsappBtn).toBeDisabled()
    })

    it('enables WhatsApp button when product is in stock', () => {
      const product = createProduct({ stock: true, price: 100 })
      renderWithProviders(
        <ProductDetailClient product={product} {...baseProps} />
      )

      const whatsappBtn = screen.getByRole('button', { name: /comprar por whatsapp/i })
      expect(whatsappBtn).not.toBeDisabled()
    })
  })

  describe('breadcrumb and basic info', () => {
    it('renders breadcrumb with product name', () => {
      const product = createProduct({ name: 'Premium Lipstick' })
      renderWithProviders(
        <ProductDetailClient product={product} {...baseProps} />
      )

      // Product name appears in both breadcrumb and h1 title
      const nameElements = screen.getAllByText('Premium Lipstick')
      expect(nameElements.length).toBeGreaterThanOrEqual(1)
      expect(nameElements[0]).toBeInTheDocument()
      expect(screen.getByText('Inicio')).toBeInTheDocument()
    })

    it('renders stock badge with correct text for in-stock product', () => {
      const product = createProduct({ stock: true })
      renderWithProviders(
        <ProductDetailClient product={product} {...baseProps} />
      )

      expect(screen.getByText('✓ En stock')).toBeInTheDocument()
    })

    it('renders stock badge with correct text for out-of-stock product', () => {
      const product = createProduct({ stock: false })
      renderWithProviders(
        <ProductDetailClient product={product} {...baseProps} />
      )

      expect(screen.getByText('✕ Agotado')).toBeInTheDocument()
    })
  })
})
