'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearch, highlightMatch } from '@/shared/hooks/useSearch'
import SafeImage, { getFallbackImageUrl } from './SafeImage'
import { getOptimizedImageUrl } from '@/shared/utils/cloudinary'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { query, setQuery, results, loading, hasSearched } = useSearch()
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setQuery('')
      setSelectedIndex(-1)
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen, setQuery])

  useEffect(() => {
    setSelectedIndex(-1)
  }, [query])

  const handleSelect = useCallback((slug: string) => {
    onClose()
    window.location.href = `/producto/${slug}`
  }, [onClose])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex].slug)
        }
        break
      case 'Escape':
        onClose()
        break
    }
  }, [results, selectedIndex, handleSelect, onClose])

  if (!isOpen) return null

  const showResults = hasSearched && (results.length > 0 || (!loading && query.length > 0))

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Buscar productos">
        <div className="search-modal-header">
          <div className="search-modal-input-wrapper">
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar productos..."
              autoComplete="off"
              aria-label="Buscar productos"
            />
            {loading && <span className="search-modal-loading">...</span>}
          </div>
          <button className="search-modal-close" onClick={onClose} aria-label="Cerrar búsqueda">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {showResults && (
          <div className="search-modal-results">
            {results.length > 0 ? (
              results.slice(0, 12).map((product, index) => {
                const imageUrl = getOptimizedImageUrl(product.image || getFallbackImageUrl(product.name), 96)
                const nameParts = highlightMatch(product.name, query)

                return (
                  <div
                    key={product.slug}
                    className={`search-modal-item ${selectedIndex === index ? 'highlighted' : ''}`}
                    onClick={() => handleSelect(product.slug)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <SafeImage
                      src={imageUrl}
                      alt={product.name}
                      fallbackText={product.name}
                      width={48}
                      height={48}
                      className="search-modal-item-img"
                    />
                    <div className="search-modal-item-info">
                      <div className="search-modal-item-name">
                        {nameParts.map((part, i) =>
                          part.highlight ? <mark key={i}>{part.text}</mark> : <span key={i}>{part.text}</span>
                        )}
                      </div>
                      <div className="search-modal-item-category">{product.category}</div>
                      <div className="search-modal-item-price">
                        {product.discountPrice ? (
                          <>
                            <span className="search-result-old-price">S/ {product.price}</span>
                            <span className="search-result-discount-price">S/ {product.discountPrice}</span>
                          </>
                        ) : (
                          <span>S/ {product.price}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="search-modal-empty">
                <p>Sin resultados para &ldquo;{query}&rdquo;</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
