'use client'

import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react'
import { useSwipe } from '@/shared/hooks/useSwipe'

const GAP = 16

type InfiniteCarouselProps<T> = {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  gap?: number
  loading: boolean
  skeletonCount?: number
  renderSkeleton: (index: number) => ReactNode
  className?: string
}

export default function InfiniteCarousel<T extends unknown>({
  items,
  renderItem,
  gap = GAP,
  loading,
  skeletonCount = 4,
  renderSkeleton,
}: InfiniteCarouselProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(4)
  const [containerWidth, setContainerWidth] = useState(0)
  const [transitioning, setTransitioning] = useState(true)

  useEffect(() => {
    if (items.length > 0 && currentIndex < visibleCount) {
      setCurrentIndex(visibleCount)
    }
  }, [items.length, currentIndex, visibleCount])

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

  const cardStep = containerWidth ? (containerWidth + gap) / visibleCount : 0

  const showCarousel = items.length > visibleCount
  const beforeClones = items.slice(-visibleCount)
  const afterClones = items.slice(0, visibleCount)
  const displayItems = [...beforeClones, ...items, ...afterClones] as T[]
  const startOffset = visibleCount
  const resetEnd = startOffset + items.length

  const handleNext = useCallback(() => {
    setCurrentIndex(i => (i >= resetEnd - 1 ? resetEnd : i + 1))
  }, [resetEnd])

  const handlePrev = useCallback(() => {
    setCurrentIndex(i => (i <= startOffset ? startOffset - 1 : i - 1))
  }, [startOffset])

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

  const totalPills = items.length
  const activePill = totalPills > 0 ? Math.max(0, Math.min(currentIndex - startOffset, totalPills - 1)) : 0

  const scrollToPill = (pillIndex: number) => {
    setCurrentIndex(startOffset + pillIndex)
  }

  if (!loading && items.length === 0) return null

  return (
    <div>
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
            className="carousel-track"
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translateX(${-currentIndex * cardStep}px)`,
              transition: transitioning && cardStep > 0 ? 'transform 0.35s ease' : 'none',
            }}
          >
            {loading
              ? Array.from({ length: visibleCount }).map((_, i) => <div key={`skeleton-${i}`}>{renderSkeleton(i)}</div>)
              : displayItems.map((item, i) => (
                  <div key={i}>{renderItem(item, i)}</div>
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

      {showCarousel && !loading && items.length > 0 && (
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
  )
}
