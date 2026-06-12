import { useState, useEffect, useCallback, useMemo } from 'react'
import { Product } from '@/features/catalog/domain/types'
import { catalogService } from '@/features/catalog/services/catalogService'
import { useDebounce } from './useDebounce'
import { SEARCH_DEBOUNCE_MS } from '@/shared/utils/constants'

interface UseSearchResult {
  query: string
  setQuery: (query: string) => void
  results: Product[]
  loading: boolean
  error: string | null
  hasSearched: boolean
  clearSearch: () => void
}

export function useSearch(): UseSearchResult {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [allProducts, setAllProducts] = useState<Product[]>([])

  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await catalogService.getProducts()
        setAllProducts(products)
      } catch (err) {
        console.error('[Search] Error loading products:', err)
      }
    }
    loadProducts()
  }, [])

  const searchProducts = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setHasSearched(false)
      return
    }

    setLoading(true)
    setError(null)
    setHasSearched(true)

    const normalizedQuery = searchQuery.toLowerCase().trim()
    
        const filtered = allProducts.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(normalizedQuery)
      const categoryMatch = product.category.toLowerCase().includes(normalizedQuery)
      const brandMatch = product.specs.brand?.toLowerCase().includes(normalizedQuery)
      const descriptionMatch = product.description?.toLowerCase().includes(normalizedQuery)

      return nameMatch || categoryMatch || brandMatch || descriptionMatch
    })

    setResults(filtered)
    setLoading(false)
  }, [allProducts])

  useEffect(() => {
    searchProducts(debouncedQuery)
  }, [debouncedQuery, searchProducts])

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setHasSearched(false)
    setError(null)
  }, [])

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    hasSearched,
    clearSearch,
  }
}

export function highlightMatch(text: string, query: string): { text: string; highlight: boolean }[] {
  if (!query.trim()) {
    return [{ text, highlight: false }]
  }

  const normalizedQuery = query.toLowerCase().trim()
  const parts: { text: string; highlight: boolean }[] = []
  let lastIndex = 0

  const lowerText = text.toLowerCase()
  let index = lowerText.indexOf(normalizedQuery)

  while (index !== -1) {
    if (index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, index), highlight: false })
    }
    parts.push({ text: text.slice(index, index + normalizedQuery.length), highlight: true })
    lastIndex = index + normalizedQuery.length
    index = lowerText.indexOf(normalizedQuery, lastIndex)
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), highlight: false })
  }

  return parts.length > 0 ? parts : [{ text, highlight: false }]
}