'use client'

import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import ProductCard from '@/features/catalog/ui/components/ProductCard'
import ProductCardSkeleton from '@/features/catalog/ui/components/ProductCardSkeleton'
import type { Product } from '@/features/catalog/domain/types'
import { catalogService } from '@/features/catalog/services/catalogService'

type BestSellersProps = {
  initialProducts?: Product[]
}

export default function BestSellers({ initialProducts = [] }: BestSellersProps) {
  const [products, setProducts] = useState(initialProducts)
  const [loading, setLoading] = useState(initialProducts.length === 0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [totalPills, setTotalPills] = useState(1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const totalPillsRef = useRef(1)

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
    if (loading || products.length === 0) return
    const container = scrollRef.current
    if (!container) return
    const card = container.firstElementChild
    if (!card) return
    const containerWidth = container.clientWidth
    const cardWidth = (card as HTMLElement).offsetWidth
    const gap = 16
    const cardsPerView = Math.floor((containerWidth + gap) / (cardWidth + gap))
    const pills = Math.max(1, Math.ceil(products.length / cardsPerView))
    setTotalPills(pills)
    totalPillsRef.current = pills
  }, [loading, products])

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

  if (!loading && products.length === 0) return null

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
        <div ref={scrollRef} onScroll={handleScroll} className="home-product-scroll">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map(product => (
                <ProductCard key={product.slug} product={product} />
              ))
          }
        </div>
        {!loading && products.length > 0 && (
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
