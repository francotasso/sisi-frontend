'use client'

import React from 'react'
import Link from 'next/link'
import SafeImage, { getFallbackImageUrl } from '@/shared/components/SafeImage'
import { Product } from '@/features/catalog/domain/types'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/shared/store'
import { addToWishlist, removeFromWishlist } from '@/shared/store/wishlistSlice'

interface RelatedItemProps {
  product: Product
}

const RelatedItem = React.memo(function RelatedItem({ product }: RelatedItemProps) {
  const dispatch = useDispatch()
  const inWishlist = useSelector((state: RootState) =>
    state.wishlist.items.some(w => w.id === product.id)
  )
  const imageUrl = product.image || getFallbackImageUrl(product.name)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inWishlist) {
      dispatch(removeFromWishlist(product.id))
    } else {
      dispatch(addToWishlist(product.id))
    }
  }

  return (
    <Link href={`/producto/${product.slug}`} className="related-card">
      <div className="related-image">
        <SafeImage 
          src={imageUrl} 
          alt={product.name}
          fallbackText={product.name}
          fill
          sizes="150px"
          className="related-img"
        />
      </div>
      <div className="related-info">
        <span className="product-brand">{product.category}</span>
        <h4 className="related-name">{product.name}</h4>
        <div className="related-bottom">
          <span className="related-price">S/ {product.price}</span>
          <button 
            className={`related-wishlist ${inWishlist ? 'active' : ''}`}
            onClick={handleToggle}
            aria-label={inWishlist ? `Quitar ${product.name} de favoritos` : `Agregar ${product.name} a favoritos`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
      </div>
    </Link>
  )
})

interface ProductRelatedProps {
  products: Product[]
  currentProductSlug: string
  currentProductCategory: string
}

export default function ProductRelated({ products, currentProductSlug, currentProductCategory }: ProductRelatedProps) {
  const relatedProducts = products
    .filter(p => (p.categorySlug ?? p.category) === currentProductCategory && p.slug !== currentProductSlug)
    .slice(0, 4)

  if (relatedProducts.length === 0) return null

  return (
    <div className="related-section">
      <h3 className="related-title">Productos Relacionados</h3>
      <div className="related-grid">
        {relatedProducts.map((product) => (
          <RelatedItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}