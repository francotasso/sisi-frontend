'use client'

import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import { catalogService } from '@/features/catalog/services/catalogService'
import CategoryCardSkeleton from './CategoryCardSkeleton'

type CategoryGridProps = {
  initialCategories?: { value: string; label: string; description: string; image: string }[]
}

export default function CategoryGrid({ initialCategories = [] }: CategoryGridProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [loading, setLoading] = useState(initialCategories.length === 0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [totalPills, setTotalPills] = useState(1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const totalPillsRef = useRef(1)

  useEffect(() => {
    if (initialCategories.length > 0) return
    let cancelled = false
    catalogService.getCategories()
      .then(result => { if (!cancelled) setCategories(result) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (loading || categories.length === 0) return
    const container = scrollRef.current
    if (!container) return
    const card = container.querySelector<HTMLElement>('.category-card')
    if (!card) return
    const containerWidth = container.clientWidth
    const cardWidth = card.offsetWidth
    const gap = 16
    const cardsPerView = Math.floor((containerWidth + gap) / (cardWidth + gap))
    const pills = Math.max(1, Math.ceil(categories.length / cardsPerView))
    setTotalPills(pills)
    totalPillsRef.current = pills
  }, [loading, categories])

  const handleScroll = useCallback(() => {
    const container = scrollRef.current
    if (!container) return
    const maxScroll = container.scrollWidth - container.clientWidth
    if (maxScroll <= 0) {
      setActiveIndex(0)
      return
    }
    const ratio = container.scrollLeft / maxScroll
    const page = Math.round(ratio * (totalPillsRef.current - 1))
    setActiveIndex(Math.min(page, totalPillsRef.current - 1))
  }, [])

  const scrollTo = useCallback((page: number) => {
    const container = scrollRef.current
    if (!container) return
    const maxScroll = container.scrollWidth - container.clientWidth
    if (maxScroll <= 0) return
    container.scrollTo({
      left: (page / (totalPills - 1)) * maxScroll,
      behavior: 'smooth',
    })
  }, [totalPills])

  return (
    <section className="category-grid-section">
      <div className="section-container">
        <div className="section-header-centered">
          <span className="section-eyebrow">Explora</span>
          <h2 className="section-title">Nuestras categorías</h2>
        </div>
        <div ref={scrollRef} onScroll={handleScroll} className="category-scroll">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <CategoryCardSkeleton key={i} />)
            : categories.map(cat => {
                return (
                  <Link
                    key={cat.value}
                    href={`/productos?category=${encodeURIComponent(cat.value)}`}
                    className="category-card"
                    style={{ backgroundImage: `url(${cat.image})` }}
                  >
                    <h3 className="category-card-name">{cat.label}</h3>
                    <p className="category-card-desc">{cat.description}</p>
                  </Link>
                )
              })
          }
        </div>
        {!loading && categories.length > 0 && (
          <div className="carousel-pills">
            {Array.from({ length: totalPills }).map((_, i) => (
              <button
                key={i}
                className={`carousel-pill ${i === activeIndex ? 'active' : ''}`}
                onClick={() => scrollTo(i)}
                aria-label={`Ir a página ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
