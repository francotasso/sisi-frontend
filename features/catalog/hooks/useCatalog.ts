'use client'

import { useState, useEffect, useCallback } from 'react'
import { Product, ProductsFilter, SortOption } from '../domain/types'
import { catalogService } from '../services/catalogService'

interface UseCatalogResult {
  products: Product[]
  categories: string[]
  loading: boolean
  error: string | null
  fetchProducts: (filter?: ProductsFilter, sort?: SortOption) => Promise<void>
  searchProducts: (query: string) => Promise<void>
  getProductById: (id: number) => Promise<Product | undefined>
}

export function useCatalog(): UseCatalogResult {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async (filter?: ProductsFilter, sort?: SortOption) => {
    setLoading(true)
    setError(null)
    try {
      const data = await catalogService.getProducts(filter, sort)
      setProducts(data)
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

  const getProductById = useCallback(async (id: number) => {
    return catalogService.getProductById(id)
  }, [])

  useEffect(() => {
    const loadCategories = async () => {
      const cats = await catalogService.getCategories()
      setCategories(cats)
    }
    loadCategories()
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    categories,
    loading,
    error,
    fetchProducts,
    searchProducts,
    getProductById,
  }
}