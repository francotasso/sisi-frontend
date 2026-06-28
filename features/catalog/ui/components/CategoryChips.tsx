'use client'

import { useMemo } from 'react'

export interface CategoryOption {
  value: string
  label: string
  description?: string
  image?: string
}

interface CategoryChipsProps {
  categories: CategoryOption[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const CATEGORY_ICONS: Record<string, string> = {
  belleza: '💄',
  maquillaje: '💋',
  skincare: '🧴',
  tecnología: '📱',
  hogar: '🏠',
  infantil: '🧸',
  electrohogar: '🔌',
  salud: '💊',
  otros: '📦',
}

function getCategoryIcon(label: string): string {
  const key = label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  for (const [k, icon] of Object.entries(CATEGORY_ICONS)) {
    if (key.includes(k)) return icon
  }
  return '📦'
}

export default function CategoryChips({ categories, selectedCategory, onCategoryChange }: CategoryChipsProps) {

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      if (a.label === 'Otros') return 1
      if (b.label === 'Otros') return -1
      return 0
    })
  }, [categories])

  return (
    <div className="category-chips">
      <button
        className={`category-chip${selectedCategory === '' ? ' active' : ''}`}
        onClick={() => onCategoryChange('')}
      >
        <span className="category-chip-icon">{'✨'}</span>
        <span className="category-chip-label">Todas</span>
      </button>
      {sortedCategories.map(cat => (
        <button
          key={cat.value}
          className={`category-chip${selectedCategory === cat.value ? ' active' : ''}`}
          onClick={() => onCategoryChange(cat.value)}
        >
          {cat.image ? (
            <img
              src={cat.image}
              alt=""
              className="category-chip-image"
              loading="lazy"
            />
          ) : (
            <span className="category-chip-icon">{getCategoryIcon(cat.label)}</span>
          )}
          <span className="category-chip-label">{cat.label}</span>
        </button>
      ))}
    </div>
  )
}
