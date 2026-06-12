'use client'

import { useState, useMemo, useEffect } from 'react'
import { testimonialService, Testimonial } from '@/features/testimonials/services/testimonialService'

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
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    testimonialService.getTestimonials().then(setTestimonials).catch(() => {})
  }, [])

  const visible = useMemo(() => {
    if (testimonials.length === 0) return []
    const items = [...testimonials]
    const result = []
    for (let i = 0; i < 3; i++) {
      result.push(items[(activeIndex + i) % items.length])
    }
    return result
  }, [activeIndex, testimonials])

  const next = () => setActiveIndex(i => (i + 1) % testimonials.length)
  const prev = () => setActiveIndex(i => (i - 1 + testimonials.length) % testimonials.length)

  if (testimonials.length === 0) return null

  return (
    <section className="testimonials-section">
      <div className="section-container">
        <div className="testimonials-header">
          <h2 className="section-title">Lo que dicen nuestros clientes</h2>
          <p className="section-subtitle">La opinión de quienes ya confiaron en nosotros</p>
        </div>

        <div className="testimonials-carousel" role="region" aria-label="Testimonios de clientes" aria-roledescription="carousel">
          <button className="testimonial-nav testimonial-nav-prev" onClick={prev} aria-label="Testimonio anterior">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          <div className="testimonials-grid">
            {visible.map((t, i) => (
              <article key={t.id} className="testimonial-card" role="group" aria-roledescription="slide" aria-label={`Testimonio ${activeIndex + i + 1} de ${testimonials.length}`}>
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

          <button className="testimonial-nav testimonial-nav-next" onClick={next} aria-label="Siguiente testimonio">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <div className="testimonial-dots" role="tablist" aria-label="Seleccionar testimonio">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`testimonial-dot${i === activeIndex ? ' active' : ''}`}
              onClick={() => setActiveIndex(i)}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Ir al testimonio ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
