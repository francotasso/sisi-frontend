'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import ProductCard from '@/features/catalog/ui/components/ProductCard'
import ProductCardSkeleton from '@/features/catalog/ui/components/ProductCardSkeleton'
import type { Product } from '@/features/catalog/domain/types'
import { catalogService } from '@/features/catalog/services/catalogService'
import { useSwipe } from '@/shared/hooks/useSwipe'

const GAP = 16

export default function BestSellers({ initialProducts = [] }: { initialProducts?: Product[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [loading, setLoading] = useState(initialProducts.length === 0)
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(initialProducts.length > 0 ? 4 : 0)
  const [visibleCount, setVisibleCount] = useState(4)
  const [containerWidth, setContainerWidth] = useState(0)
  const [transitioning, setTransitioning] = useState(true)

  useEffect(() => {
    if (initialProducts.length > 0) return
    let cancelled = false
    catalogService.getBestSellersProducts(8)
      .then(result => { if (!cancelled) setProducts(result) })
      .catch(() => { if (!cancelled) setProducts([]) })
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
    if (products.length > 0 && currentIndex < visibleCount) {
      setCurrentIndex(visibleCount)
    }
  }, [products.length]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!loading && products.length === 0) return null

  const showCarousel = products.length > visibleCount
  const beforeClones = products.slice(-visibleCount)
  const afterClones = products.slice(0, visibleCount)
  const displayItems = [...beforeClones, ...products, ...afterClones]
  const startOffset = visibleCount
  const resetEnd = startOffset + products.length

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

  const totalPills = products.length - visibleCount + 1
  const activePill = totalPills > 0 ? Math.min(currentIndex - startOffset, totalPills - 1) : 0

  const scrollToPill = (pillIndex: number) => {
    setCurrentIndex(startOffset + pillIndex)
  }

  return (
    <section className="best-sellers-section">
      <div className="section-container">
        <div className="section-header-row">
          <div>
            <span className="section-eyebrow">Favoritos del público</span>
            <h2 className="section-title">Los más vendidos</h2>
            <p className="section-subtitle">Los favoritos de nuestros clientes</p>
          </div>
          <Link href="/productos" className="section-link">
            Ver todos
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
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
                ? Array.from({ length: visibleCount }).map((_, i) => <ProductCardSkeleton key={i} />)
                : displayItems.map((product, i) => (
                    <ProductCard key={`${product.slug}-${i}`} product={product} />
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

        {showCarousel && !loading && products.length > 0 && (
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
