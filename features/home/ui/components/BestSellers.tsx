'use client'

import Link from 'next/link'
import ProductCard from '@/features/catalog/ui/components/ProductCard'
import { useCatalog } from '@/features/catalog/hooks/useCatalog'
import { useEffect, useMemo } from 'react'

export default function BestSellers() {
  const { products, loading, fetchProducts } = useCatalog()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const bestSellers = useMemo(() => {
    return products.filter(p => p.bestSeller).slice(0, 4)
  }, [products])

  if (loading && bestSellers.length === 0) {
    return (
      <section className="best-sellers-section">
        <div className="section-container">
          <h2 className="section-title">Los más vendidos</h2>
          <div className="loading-container">
            <div className="loading-spinner" />
          </div>
        </div>
      </section>
    )
  }

  if (bestSellers.length === 0) return null

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
        <div className="home-product-grid">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
