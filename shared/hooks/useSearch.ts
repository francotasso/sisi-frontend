import { useState, useEffect, useCallback } from 'react'
import type { Product } from '@/features/catalog/domain/types'
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

  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      setHasSearched(false)
      return
    }

    let cancelled = false

    const run = async () => {
      setLoading(true)
      setError(null)
      setHasSearched(true)

      try {
        const items = await catalogService.searchProducts(debouncedQuery)
        if (!cancelled) setResults(items)
      } catch {
        if (!cancelled) setError('Error al buscar productos')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()

    return () => { cancelled = true }
  }, [debouncedQuery])

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
