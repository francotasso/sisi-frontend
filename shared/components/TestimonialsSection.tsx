'use client'

import { useState, useEffect, useRef } from 'react'
import { testimonialService, Testimonial } from '@/features/testimonials/services/testimonialService'
import { useSwipe } from '@/shared/hooks/useSwipe'

const GAP = 16

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="testimonial-stars" aria-label={`${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map(star => (
        <svg key={star} width="14" height="14" viewBox="0 0 24 24" fill={star <= rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(3)
  const [containerWidth, setContainerWidth] = useState(0)
  const [transitioning, setTransitioning] = useState(true)

  useEffect(() => {
    testimonialService.getTestimonials(8)
      .then(setTestimonials)
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 480) setVisibleCount(1)
      else if (window.innerWidth < 768) setVisibleCount(2)
      else setVisibleCount(3)
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
    if (testimonials.length > 0 && currentIndex < visibleCount) {
      setCurrentIndex(visibleCount)
    }
  }, [testimonials.length]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!loading && testimonials.length === 0) return null

  const showCarousel = testimonials.length > visibleCount
  const beforeClones = testimonials.slice(-visibleCount)
  const afterClones = testimonials.slice(0, visibleCount)
  const displayItems = [...beforeClones, ...testimonials, ...afterClones]
  const startOffset = visibleCount
  const resetEnd = startOffset + testimonials.length

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

  const totalPills = testimonials.length - visibleCount + 1
  const activePill = totalPills > 0 ? Math.min(currentIndex - startOffset, totalPills - 1) : 0

  const scrollToPill = (pillIndex: number) => {
    setCurrentIndex(startOffset + pillIndex)
  }

  return (
    <section className="testimonials-section">
      <div className="section-container">
        <div className="testimonials-header">
          <h2 className="section-title">Lo que dicen nuestros clientes</h2>
          <p className="section-subtitle">La opinión de quienes ya confiaron en nosotros</p>
        </div>

        <div className="carousel-wrapper">
          {showCarousel && (
            <button className="carousel-arrow" onClick={handlePrev} aria-label="Testimonio anterior">
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
              {displayItems.map((t, i) => (
                <article key={`${t.id}-${i}`} className="testimonial-card" role="group" aria-roledescription="slide" aria-label={`Testimonio ${((i - startOffset) % testimonials.length + testimonials.length) % testimonials.length + 1} de ${testimonials.length}`}>
                  <StarRating rating={t.rating} />
                  <blockquote className="testimonial-text">&ldquo;{t.text}&rdquo;</blockquote>
                  <div className="testimonial-author">
                    {t.avatar && <div className="testimonial-avatar" aria-hidden="true">{t.avatar}</div>}
                    <div>
                      <span className="testimonial-name">{t.name}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {showCarousel && (
            <button className="carousel-arrow" onClick={handleNext} aria-label="Siguiente testimonio">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>

        {showCarousel && testimonials.length > 0 && (
          <div className="carousel-pills">
            {Array.from({ length: totalPills }).map((_, i) => (
              <button
                key={i}
                className={`carousel-pill ${i === activePill ? 'active' : ''}`}
                onClick={() => scrollToPill(i)}
                aria-label={`Ir al testimonio ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
