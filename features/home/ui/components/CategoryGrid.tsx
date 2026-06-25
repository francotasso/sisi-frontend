'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { catalogService } from '@/features/catalog/services/catalogService'
import CategoryCardSkeleton from './CategoryCardSkeleton'
import { useSwipe } from '@/shared/hooks/useSwipe'

const GAP = 16

type CategoryGridProps = {
  initialCategories?: { value: string; label: string; description: string; image: string }[]
}

export default function CategoryGrid({ initialCategories = [] }: CategoryGridProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [loading, setLoading] = useState(initialCategories.length === 0)
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(initialCategories.length > 0 ? 4 : 0)
  const [visibleCount, setVisibleCount] = useState(4)
  const [containerWidth, setContainerWidth] = useState(0)
  const [transitioning, setTransitioning] = useState(true)

  useEffect(() => {
    if (initialCategories.length > 0) return
    let cancelled = false
    catalogService.getCategories()
      .then(result => { if (!cancelled) setCategories(result) })
      .catch(() => { if (!cancelled) setCategories([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const check = () => {
      setVisibleCount(window.innerWidth < 768 ? 2 : 4)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const measure = () => setContainerWidth(container.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    return () => ro.disconnect()
  }, [])

  const cardStep = containerWidth ? (containerWidth + GAP) / visibleCount : 0

  useEffect(() => {
    if (categories.length > 0 && currentIndex < visibleCount) {
      setCurrentIndex(visibleCount)
    }
  }, [categories.length]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!loading && categories.length === 0) return null

  const showCarousel = categories.length > visibleCount
  const beforeClones = categories.slice(-visibleCount)
  const afterClones = categories.slice(0, visibleCount)
  const displayItems = [...beforeClones, ...categories, ...afterClones]
  const startOffset = visibleCount
  const resetEnd = startOffset + categories.length

  const handleNext = () => {
    setCurrentIndex(i => (i >= resetEnd - 1 ? resetEnd : i + 1))
  }

  const handlePrev = () => {
    setCurrentIndex(i => (i <= startOffset ? startOffset - 1 : i - 1))
  }

  const handleTransitionEnd = () => {
    if (currentIndex >= resetEnd) {
      setTransitioning(false)
      setCurrentIndex(startOffset)
    } else if (currentIndex < startOffset) {
      setTransitioning(false)
      setCurrentIndex(resetEnd - 1)
    }
  }

  useEffect(() => {
    if (!transitioning) {
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitioning(true)
        })
      })
      return () => cancelAnimationFrame(id)
    }
  }, [transitioning])

  useSwipe(containerRef, handleNext, handlePrev)

  const totalPills = categories.length - visibleCount + 1
  const activePill = totalPills > 0 ? Math.min(currentIndex - startOffset, totalPills - 1) : 0

  const scrollToPill = (pillIndex: number) => {
    setCurrentIndex(startOffset + pillIndex)
  }

  return (
    <section className="category-grid-section">
      <div className="section-container">
        <div className="section-header-centered">
          <span className="section-eyebrow">Explora</span>
          <h2 className="section-title">Nuestras categorías</h2>
        </div>

        <div className="carousel-wrapper">
          {showCarousel && (
            <button className="carousel-arrow" onClick={handlePrev} aria-label="Anterior">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          <div ref={containerRef} className="carousel-container">
            <div
              ref={trackRef}
              className="carousel-track"
              onTransitionEnd={handleTransitionEnd}
              style={{
                transform: `translateX(${-currentIndex * cardStep}px)`,
                transition: transitioning && cardStep > 0 ? 'transform 0.35s ease' : 'none',
              }}
            >
              {loading
                ? Array.from({ length: visibleCount }).map((_, i) => <CategoryCardSkeleton key={i} />)
                : displayItems.map((cat, i) => (
                    <Link
                      key={`${cat.value}-${i}`}
                      href={`/productos?category=${encodeURIComponent(cat.value)}`}
                      className="category-card"
                      style={{ backgroundImage: `url(${cat.image})` }}
                    >
                      <h3 className="category-card-name">{cat.label}</h3>
                      <p className="category-card-desc">{cat.description}</p>
                    </Link>
                  ))
              }
            </div>
          </div>

          {showCarousel && (
            <button className="carousel-arrow" onClick={handleNext} aria-label="Siguiente">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>

        {showCarousel && !loading && categories.length > 0 && (
          <div className="carousel-pills">
            {Array.from({ length: totalPills }).map((_, i) => (
              <button
                key={i}
                className={`carousel-pill ${i === activePill ? 'active' : ''}`}
                onClick={() => scrollToPill(i)}
                aria-label={`Ir a página ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
