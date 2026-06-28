'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { catalogService } from '@/features/catalog/services/catalogService'
import CategoryCardSkeleton from './CategoryCardSkeleton'
import InfiniteCarousel from '@/shared/components/InfiniteCarousel'

type CategoryGridProps = {
  initialCategories?: { value: string; label: string; description: string; image: string }[]
}

export default function CategoryGrid({ initialCategories = [] }: CategoryGridProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [loading, setLoading] = useState(initialCategories.length === 0)

  useEffect(() => {
    if (initialCategories.length > 0) return
    let cancelled = false
    catalogService.getCategories()
      .then(result => { if (!cancelled) setCategories(result) })
      .catch(() => { if (!cancelled) setCategories([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!loading && categories.length === 0) return null

  return (
    <section className="category-grid-section">
      <div className="section-container">
        <div className="section-header-centered">
          <span className="section-eyebrow">Explora</span>
          <h2 className="section-title">Nuestras categorías</h2>
        </div>

        <InfiniteCarousel
          items={categories}
          loading={loading}
          skeletonCount={4}
          renderSkeleton={() => <CategoryCardSkeleton />}
          renderItem={(cat) => (
            <Link
              href={`/productos?category=${encodeURIComponent(cat.value)}`}
              className="category-card"
              style={{ backgroundImage: `url(${cat.image})` }}
            >
              <h3 className="category-card-name">{cat.label}</h3>
              <p className="category-card-desc">{cat.description}</p>
            </Link>
          )}
        />
      </div>
    </section>
  )
}
