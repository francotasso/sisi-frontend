'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import SafeImage, { getFallbackImageUrl } from './SafeImage'
import { useSearch, highlightMatch } from '@/shared/hooks/useSearch'

interface SearchDropdownProps {
  onSelect?: () => void
}

export default function SearchDropdown({ onSelect }: SearchDropdownProps) {
  const { query, setQuery, results, loading, hasSearched } = useSearch()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length > 0) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
    setSelectedIndex(-1)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = useCallback((slug: string) => {
    setIsOpen(false)
    setQuery('')
    onSelect?.()
    window.location.href = `/product/${slug}`
  }, [onSelect, setQuery])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return
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
        setIsOpen(false)
        break
    }
  }, [isOpen, results, selectedIndex, handleSelect])

  const showDropdown = isOpen && hasSearched && (results.length > 0 || (!loading && query.length > 0))

  return (
    <div className="search-dropdown" ref={dropdownRef}>
      <div className="search-bar">
        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          placeholder="Buscar..."
          autoComplete="off"
          aria-label="Buscar productos"
        />
        {loading && <span style={{ color: '#ccc', fontSize: '0.8rem' }}>...</span>}
      </div>

      {showDropdown && (
        <div className="search-results">
          {results.length > 0 ? (
            results.slice(0, 8).map((product, index) => {
              const imageUrl = product.image || getFallbackImageUrl(product.name)
              const nameParts = highlightMatch(product.name, query)

              return (
                <div
                  key={product.id}
                  className={`search-result-item ${selectedIndex === index ? 'highlighted' : ''}`}
                  onClick={() => handleSelect(product.slug)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <SafeImage
                    src={imageUrl}
                    alt={product.name}
                    fallbackText={product.name}
                    width={44}
                    height={44}
                    className="search-result-img"
                  />
                  <div className="search-result-info">
                    <div className="search-result-name">
                      {nameParts.map((part, i) =>
                        part.highlight ? <mark key={i}>{part.text}</mark> : <span key={i}>{part.text}</span>
                      )}
                    </div>
                    <div className="search-result-category">{product.category}</div>
                    <div className="search-result-price">
                      S/ {product.price}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="search-result-item" style={{ justifyContent: 'center', padding: '16px', opacity: 0.6 }}>
              <p style={{ fontSize: '0.85rem' }}>Sin resultados para &ldquo;{query}&rdquo;</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
