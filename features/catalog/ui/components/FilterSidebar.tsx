'use client'

import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { Product } from '@/features/catalog/domain/types'

interface FilterSidebarProps {
  products: Product[]
  onFilterChange: (filters: FilterState) => void
  initialFilters?: FilterState
}

export interface FilterState {
  categories: string[]
}

export default function FilterSidebar({ products, onFilterChange, initialFilters }: FilterSidebarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    categories: initialFilters?.categories ?? [],
  })
  const [draftFilters, setDraftFilters] = useState<FilterState>({
    categories: initialFilters?.categories ?? [],
  })
  const drawerRef = useRef<HTMLDivElement>(null)

  const availableCategories = useMemo(() => {
    const categorySet = new Set<string>()
    products.forEach(p => categorySet.add(p.category))
    return Array.from(categorySet).sort((a, b) => {
      if (a === 'Otros') return 1
      if (b === 'Otros') return -1
      return a.localeCompare(b)
    })
  }, [products])

  const applyFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
    onFilterChange(newFilters)
  }, [onFilterChange])

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    applyFilters({ categories: newCategories })
  }

  const toggleDraftCategory = (category: string) => {
    setDraftFilters(prev => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
      return { categories: newCategories }
    })
  }

  const clearFilters = () => {
    const clearedFilters: FilterState = { categories: [] }
    setFilters(clearedFilters)
    setDraftFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const openDrawer = () => {
    setDraftFilters({ ...filters })
    setDrawerOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
    document.body.style.overflow = ''
  }, [])

  const applyDrawerFilters = () => {
    setFilters(draftFilters)
    onFilterChange(draftFilters)
    closeDrawer()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDrawer()
      }
      if (e.key === 'Tab' && drawerOpen && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusableElements.length === 0) return
        const first = focusableElements[0]
        const last = focusableElements[focusableElements.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [drawerOpen, closeDrawer])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1
    })
    return counts
  }, [products])

  const hasActiveFilters = filters.categories.length > 0
  const draftHasActiveFilters = draftFilters.categories.length > 0

  const filterBody = (
    <div className="category-list-compact">
      {availableCategories.map(category => (
        <label key={category} className="category-item-compact">
          <input
            type="checkbox"
            checked={filters.categories.includes(category)}
            onChange={() => toggleCategory(category)}
          />
          <span className="category-name">{category}</span>
          <span className="category-count">({categoryCounts[category]})</span>
        </label>
      ))}
    </div>
  )

  const drawerFilterBody = (
    <div className="category-list-compact">
      {availableCategories.map(category => (
        <label key={category} className="category-item-compact">
          <input
            type="checkbox"
            checked={draftFilters.categories.includes(category)}
            onChange={() => toggleDraftCategory(category)}
          />
          <span className="category-name">{category}</span>
          <span className="category-count">({categoryCounts[category]})</span>
        </label>
      ))}
    </div>
  )

  return (
    <>
      <button className="filter-toggle-btn mobile-only" onClick={openDrawer} aria-label="Abrir filtros">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="21" x2="4" y2="14"/>
          <line x1="4" y1="10" x2="4" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12" y2="3"/>
          <line x1="20" y1="21" x2="20" y2="16"/>
          <line x1="20" y1="12" x2="20" y2="3"/>
          <line x1="1" y1="14" x2="7" y2="14"/>
          <line x1="9" y1="8" x2="15" y2="8"/>
          <line x1="17" y1="16" x2="23" y2="16"/>
        </svg>
        Categorías
        {hasActiveFilters && <span className="filter-badge">{filters.categories.length}</span>}
      </button>

      {drawerOpen && (
        <>
          <div className="filter-overlay" onClick={closeDrawer} aria-hidden="true" />
          <aside className="filter-drawer" ref={drawerRef} role="dialog" aria-modal="true" aria-label="Filtros de categoría">
            <div className="filter-drawer-header">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <h3>Categorías</h3>
                {draftHasActiveFilters && (
                  <button className="clear-filters-btn" onClick={() => setDraftFilters({ categories: [] })}>
                    Limpiar
                  </button>
                )}
              </div>
              <button className="filter-drawer-close" onClick={closeDrawer} aria-label="Cerrar filtros">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="filter-drawer-body">
              {drawerFilterBody}
            </div>
            <div className="filter-drawer-actions">
              <button className="filter-drawer-apply-btn" onClick={applyDrawerFilters}>
                Aplicar filtros
              </button>
            </div>
          </aside>
        </>
      )}

      <aside className="filter-sidebar">
        <div className="filter-header">
          <h3>Categorías</h3>
          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              Limpiar
            </button>
          )}
        </div>

        <div className="filter-content">
          {filterBody}
        </div>
      </aside>
    </>
  )
}
