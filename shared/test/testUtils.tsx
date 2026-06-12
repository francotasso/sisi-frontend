import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import wishlistReducer from '@/shared/store/wishlistSlice'

export function createTestStore() {
  return configureStore({
    reducer: {
      wishlist: wishlistReducer,
    },
  })
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  store?: ReturnType<typeof createTestStore>
}

export function renderWithProviders(
  ui: ReactElement,
  { store = createTestStore(), ...renderOptions }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

/** Helper to create a minimal Product for tests */
export function createProduct(
  overrides: Partial<import('@/features/catalog/domain/types').Product> = {}
): import('@/features/catalog/domain/types').Product {
  return {
    id: '1',
    sku: 'SIS-001',
    slug: 'test-product',
    name: 'Test Product',
    price: 100,
    category: 'Test Category',
    image: 'https://example.com/img.jpg',
    description: 'A test product description',
    shortDescription: 'Test description',
    stock: true,
    stockCount: 15,
    createdAt: new Date().toISOString(),
    specs: { brand: 'Test Brand', type: 'Test Type', size: '100ml' },
    faq: [],
    ...overrides,
  }
}
