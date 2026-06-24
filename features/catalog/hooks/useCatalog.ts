'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Product, ProductsFilter, SortOption } from '../domain/types'
import { catalogService } from '../services/catalogService'

export interface CategoryOption {
  value: string
  label: string
  description?: string
}

interface UseCatalogResult {
  products: Product[]
  total: number
  categories: CategoryOption[]
  loading: boolean
  error: string | null
  fetchProducts: (filter?: ProductsFilter, sort?: SortOption, page?: number) => Promise<void>
  fetchAllProducts: (filter?: ProductsFilter, sort?: SortOption) => Promise<void>
  searchProducts: (query: string) => Promise<void>
  getProductById: (id: string) => Promise<Product | undefined>
  getCategorySlug: (name: string) => string | undefined
}

export function useCatalog(): UseCatalogResult {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const categoryLabelToSlug = useMemo(() => {
    return new Map(categories.map(c => [c.label, c.value]))
  }, [categories])

  const getCategorySlug = useCallback(
    (name: string): string | undefined => categoryLabelToSlug.get(name),
    [categoryLabelToSlug]
  )

  const fetchProducts = useCallback(async (filter?: ProductsFilter, sort?: SortOption, page?: number) => {
    setLoading(true)
    setError(null)
    try {
      const { products, total } = await catalogService.getProductsPaginated(filter, sort, page)
      setProducts(products)
      setTotal(total)
    } catch (err) {
      setError('Error al cargar los productos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAllProducts = useCallback(async (filter?: ProductsFilter, sort?: SortOption) => {
    setLoading(true)
    setError(null)
    try {
      const all = await catalogService.getAllProducts(filter, sort)
      setProducts(all)
      setTotal(all.length)
    } catch (err) {
      setError('Error al cargar los productos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const searchProducts = useCallback(async (query: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await catalogService.searchProducts(query)
      setProducts(data)
    } catch (err) {
      setError('Error al buscar productos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getProductById = useCallback(async (id: string) => {
    return catalogService.getProductById(id)
  }, [])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await catalogService.getCategories()
        const sorted = [...cats].sort((a, b) => {
          if (a.label === 'Otros') return 1
          if (b.label === 'Otros') return -1
          return 0
        })
        setCategories(sorted)
      } catch (err) {
        console.error('Error al cargar categorías:', err)
      }
    }
    loadCategories()
  }, [])

  return {
    products,
    total,
    categories,
    loading,
    error,
    fetchProducts,
    fetchAllProducts,
    searchProducts,
    getProductById,
    getCategorySlug,
  }
}