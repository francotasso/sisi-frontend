'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import ProductCard from '@/features/catalog/ui/components/ProductCard'
import ProductCardSkeleton from '@/features/catalog/ui/components/ProductCardSkeleton'
import type { Product } from '@/features/catalog/domain/types'
import { catalogService } from '@/features/catalog/services/catalogService'
import InfiniteCarousel from '@/shared/components/InfiniteCarousel'

export default function BestSellers({ initialProducts = [] }: { initialProducts?: Product[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [loading, setLoading] = useState(initialProducts.length === 0)

  useEffect(() => {
    if (initialProducts.length > 0) return
    let cancelled = false
    catalogService.getBestSellersProducts(8)
      .then(result => { if (!cancelled) setProducts(result) })
      .catch(() => { if (!cancelled) setProducts([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

        <InfiniteCarousel
          items={products}
          loading={loading}
          skeletonCount={4}
          renderSkeleton={() => <ProductCardSkeleton />}
          renderItem={(product) => <ProductCard product={product} />}
        />
      </div>
    </section>
  )
}
