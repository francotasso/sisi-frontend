'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Product } from '@/features/catalog/domain/types'
import { useWishlistStore } from '@/features/wishlist/hooks/useWishlistStore'
import { catalogService } from '@/features/catalog/services/catalogService'
import { WHATSAPP_NUMBER } from '@/shared/utils/constants'
import { useRecentlyViewed } from '@/shared/hooks/useRecentlyViewed'
import ProductSpecs from './ProductSpecs'
import ProductRelated from './ProductRelated'
import FaqAccordion from './FaqAccordion'
import ImageGallery from './ImageGallery'
import PaymentMethods from '@/shared/components/PaymentMethods'

interface ProductDetailClientProps {
  product: Product
  relatedProducts: Product[]
  currentProductCategory: string
}

export default function ProductDetailClient({
  product,
  relatedProducts,
  currentProductCategory,
}: ProductDetailClientProps) {
  const wishlistStore = useWishlistStore()
  const inWishlist = wishlistStore.isInWishlist(product.id)
  const { addRecentlyViewed } = useRecentlyViewed()

  useEffect(() => {
    addRecentlyViewed({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
    })
  }, [product.id, product.slug, product.name, product.image, product.price, addRecentlyViewed])

  const handleToggleWishlist = () => {
    if (inWishlist) {
      wishlistStore.removeFromWishlist(product.id)
    } else {
      wishlistStore.addToWishlist(product.id)
    }
  }

  const displayPrice = product.discountPrice ?? product.price

  const sendWhatsAppOrder = () => {
    const message = `¡Hola! Me interesa:\n\n*${product.name}*\nPrecio: S/ ${displayPrice}\n\n¿Me confirmas disponibilidad?`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank')
  }

  const shareWhatsApp = () => {
    const url = window.location.href
    const message = `¡Hola! Te recomiendo este producto:\n\n*${product.name}*\nPrecio: S/ ${displayPrice}\n\n${url}`
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encoded}`, '_blank')
  }

  const lowStock = product.stock && product.stockCount !== undefined && product.stockCount > 0 && product.stockCount <= 5

  return (
    <div className="product-detail-container">
        <nav className="breadcrumb">
          <Link href="/" className="breadcrumb-item">Inicio</Link>
          <svg className="breadcrumb-separator" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          <Link href={`/productos?category=${product.categorySlug ?? product.category}`} className="breadcrumb-item">{product.category}</Link>
          <svg className="breadcrumb-separator" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        <div className="product-detail-content">
          <ImageGallery
            images={product.images?.length ? product.images : [product.image]}
            alt={product.name}
            fallbackText={product.name}
          />

          <div className="product-detail-info">
            <div className="product-detail-badges">
              <span className={`product-detail-stock-badge ${product.stock ? 'inStock' : 'outOfStock'}`}>
                {product.stock ? '✓ En stock' : '✕ Agotado'}
              </span>
              <span className="product-detail-sku">SKU: {product.sku}</span>
              {lowStock && (
                <span className="low-stock-badge">Solo quedan {product.stockCount}</span>
              )}
            </div>

            <h1 className="product-detail-title">{product.name}</h1>

            <div className="price-section">
              {product.discountPrice ? (
                <div className="price-row-detail">
                  <span className="product-detail-price">S/ {product.discountPrice}</span>
                  <span className="original-price original-price-lg">S/ {product.price}</span>
                  {catalogService.getDiscountPercentage(product) && (
                    <span className="offer-badge-detail">-{catalogService.getDiscountPercentage(product)}%</span>
                  )}
                </div>
              ) : (
                <span className="product-detail-price">S/ {product.price}</span>
              )}
            </div>

            {product.discountPrice && (
              <div className="savings-badge">
                Ahorras S/ {(product.price - product.discountPrice).toFixed(2)}
              </div>
            )}

            <p className="product-detail-description">{product.description}</p>

            <div className="product-detail-actions">
              <button
                className="whatsapp-btn"
                onClick={sendWhatsAppOrder}
                disabled={!product.stock}
                aria-label={product.stock ? 'Comprar por WhatsApp' : 'Producto agotado'}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                </svg>
                Comprar por WhatsApp
              </button>

              <button
                className={`wishlist-btn-detail ${inWishlist ? 'in-wishlist' : ''}`}
                onClick={handleToggleWishlist}
                aria-label={inWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill={inWishlist ? 'currentColor' : 'none'}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {inWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              </button>

              <button
                className="share-btn-detail"
                onClick={shareWhatsApp}
                aria-label="Compartir por WhatsApp"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Compartir
              </button>
            </div>

            <PaymentMethods />

          </div>
        </div>

        {product.specs && <ProductSpecs specs={product.specs} />}

        <div className="info-section-detail">
          <div className="info-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span><strong>Garantía:</strong> {product.warranty || '30 días contra defectos de fabricación'}</span>
          </div>
          <div className="info-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            <span><strong>Devoluciones:</strong> {product.returnPolicy || '7 días para cambios por defecto de fábrica'}</span>
          </div>
        </div>

        {product.faq && product.faq.length > 0 && <FaqAccordion faqs={product.faq} />}

        <ProductRelated products={relatedProducts} currentProductSlug={product.slug} currentProductCategory={currentProductCategory} />
      </div>
  )
}
