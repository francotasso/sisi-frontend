'use client'

export interface CategoryOption {
  value: string
  label: string
}

interface CategoryChipsProps {
  categories: CategoryOption[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export default function CategoryChips({ categories, selectedCategory, onCategoryChange }: CategoryChipsProps) {

  return (
    <div className="category-chips">
      <button
        className={`category-chip${selectedCategory === '' ? ' active' : ''}`}
        onClick={() => onCategoryChange('')}
      >
        Todas
      </button>
      {categories.map(cat => (
        <button
          key={cat.value}
          className={`category-chip${selectedCategory === cat.value ? ' active' : ''}`}
          onClick={() => onCategoryChange(cat.value)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
