'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import SafeImage, { getFallbackImageUrl } from '@/shared/components/SafeImage'
import { getOptimizedImageUrl } from '@/shared/utils/cloudinary'
import { Product } from '../../domain/types'
import { useWishlistStore } from '@/features/wishlist/hooks/useWishlistStore'
import { catalogService } from '../../services/catalogService'

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const wishlistStore = useWishlistStore()
  const inWishlist = useMemo(() => wishlistStore.isInWishlist(product.slug), [wishlistStore.items, product.slug])
  const isNew = useMemo(() => catalogService.isNewProduct(product), [product.createdAt])

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inWishlist) {
      wishlistStore.removeFromWishlist(product.slug)
    } else {
      wishlistStore.addToWishlist(product.slug)
    }
  }

  const imageUrl = getOptimizedImageUrl(product.image || getFallbackImageUrl(product.name), 400)

  const isOutOfStock = product.stock === false

  return (
    <Link href={`/producto/${product.slug}`} className="card">
      <div className="image-container">
        <SafeImage
          src={imageUrl}
          alt={product.name}
          fallbackText={product.name}
          className="product-image"
          fill
          sizes="(max-width: 700px) 50vw, 25vw"
        />

        {isNew && <div className="new-badge">NUEVO</div>}
        {isOutOfStock && <div className="soldout-badge">Agotado</div>}
        {catalogService.getDiscountPercentage(product) && (
          <div className="offer-badge">-{catalogService.getDiscountPercentage(product)}%</div>
        )}
      </div>
      <div className="card-content">
        <span className="product-brand">{product.category}</span>
        <h3 className="product-title">{product.name}</h3>
        <div className="price-row">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {!isOutOfStock && <span className="card-stock-badge">En stock</span>}
            {product.discountPrice ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="product-price">S/ {product.discountPrice}</span>
                <span className="original-price">S/ {product.price}</span>
              </div>
            ) : (
              <span className="product-price">S/ {product.price}</span>
            )}
          </div>
          <button
            className={`wishlist-toggle-btn ${inWishlist ? 'in-wishlist' : ''}`}
            onClick={handleToggleWishlist}
            aria-label={inWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <svg className="heart-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
      </div>
    </Link>
  )
}

export default React.memo(ProductCard)
