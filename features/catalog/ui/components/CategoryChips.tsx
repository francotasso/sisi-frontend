'use client'

interface CategoryChipsProps {
  categories: string[]
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
          key={cat}
          className={`category-chip${selectedCategory === cat ? ' active' : ''}`}
          onClick={() => onCategoryChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
