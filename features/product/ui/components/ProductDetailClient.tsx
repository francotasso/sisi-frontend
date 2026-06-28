'use client'

import { useEffect, useState, useCallback } from 'react'
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
import TrustBadges from '@/shared/components/TrustBadges'
import RecentlyViewed from './RecentlyViewed'
import StickyProductBar from './StickyProductBar'
import ShadeSelector from './ShadeSelector'
import IngredientCards from './IngredientCards'
import RoutineCrossSell from './RoutineCrossSell'

interface ProductDetailClientProps {
  product: Product
  relatedProducts: Product[]
  currentProductCategory: string
  allProducts?: Product[]
}

const visualSpecKeys = ['type', 'finish', 'size', 'shade', 'spf', 'skinType'] as const

const specLabels: Record<string, string> = {
  type: 'Tipo',
  shade: 'Tonalidad',
  finish: 'Acabado',
  size: 'Tamaño',
  spf: 'Protección Solar',
  skinType: 'Tipo de piel',
}

export default function ProductDetailClient({
  product: initialProduct,
  relatedProducts,
  currentProductCategory,
  allProducts,
}: ProductDetailClientProps) {
  const product = initialProduct
  const [quantity, setQuantity] = useState(1)
  const [copied, setCopied] = useState(false)
  const wishlistStore = useWishlistStore()
  const inWishlist = wishlistStore.isInWishlist(product.slug)
  const { addRecentlyViewed, items: recentlyViewedItems } = useRecentlyViewed()

  useEffect(() => {
    addRecentlyViewed({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      discountPrice: product.discountPrice,
    })
  }, [product.id, product.slug, product.name, product.image, product.price, product.discountPrice, addRecentlyViewed])

  const handleToggleWishlist = () => {
    if (inWishlist) {
      wishlistStore.removeFromWishlist(product.slug)
    } else {
      wishlistStore.addToWishlist(product.slug)
    }
  }

  const displayPrice = product.discountPrice ?? product.price

  const sendWhatsAppOrder = () => {
    const message = `¡Hola! Me interesa:\n\n*${product.name}*\nSKU: ${product.sku}\nPrecio: S/ ${displayPrice}\nCantidad: ${quantity}\n\n¿Me confirmas disponibilidad?`
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank')
  }

  const handleShare = useCallback(async () => {
    const url = window.location.href
    const title = `${product.name} - Sisi`
    const text = `Mira este producto: ${product.name}`

    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ title, text, url })
        return
      } catch {
        // user cancelled or share API failed
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        return
      } catch {
        // clipboard failed
      }
    }

    const message = `¡Hola! Te recomiendo este producto:\n\n*${product.name}*\nSKU: ${product.sku}\nPrecio: S/ ${displayPrice}\n\n${url}`
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank')
  }, [product, displayPrice])

  const lowStock = product.stock && product.stockCount !== undefined && product.stockCount > 0 && product.stockCount <= 5

  const specPills = product.specs
    ? visualSpecKeys
        .map(key => ({ key, label: specLabels[key], value: product.specs[key as keyof typeof product.specs] }))
        .filter(s => s.value)
    : []

  return (
    <div className="product-detail-container">
        <StickyProductBar product={product} />
        <nav className="breadcrumb">
          <Link href="/productos" className="breadcrumb-item">Productos</Link>
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
              {catalogService.isNewProduct(product.createdAt) && (
                <span className="product-detail-stock-badge badge-new">Nuevo</span>
              )}
              {product.bestSeller && (
                <span className="product-detail-stock-badge badge-best-seller">Más vendido</span>
              )}
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

            {specPills.length > 0 && (
              <div className="spec-pills">
                {specPills.map(s => (
                  <span key={s.key} className="spec-pill">
                    <span className="spec-pill-label">{s.label}</span>
                    <span className="spec-pill-value">{String(s.value)}</span>
                  </span>
                ))}
              </div>
            )}

            {product.specs?.shade && (
              <ShadeSelector shade={product.specs.shade} />
            )}

            <p className="product-detail-description">{product.description}</p>

            <div className="product-detail-actions">
              <div className="qty-row">
                <span className="qty-label">Cantidad</span>
                <div className="qty-selector">
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Reducir cantidad"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(q => Math.min(99, q + 1))}
                    disabled={quantity >= 99}
                    aria-label="Aumentar cantidad"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </div>
              </div>

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

              <div className="product-detail-actions-secondary">
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
                  onClick={handleShare}
                  aria-label="Compartir producto"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                  {copied ? 'Enlace copiado' : 'Compartir'}
                </button>
              </div>
            </div>

            <TrustBadges variant="inline" />
            <PaymentMethods />

          </div>
        </div>

        {product.specs && <ProductSpecs specs={product.specs} />}

        {product.specs?.ingredients && (
          <IngredientCards ingredients={product.specs.ingredients} />
        )}

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

        {recentlyViewedItems.length > 0 && (
          <RecentlyViewed items={recentlyViewedItems} currentSlug={product.slug} />
        )}

        {allProducts && allProducts.length > 0 && (
          <RoutineCrossSell products={allProducts} currentCategory={currentProductCategory} />
        )}

        <div className="mobile-sticky-bar">
          <div className="mobile-sticky-bar-inner">
            <div className="mobile-sticky-price">
              {product.discountPrice ? (
                <>
                  <span className="mobile-sticky-current">S/ {product.discountPrice}</span>
                  <span className="mobile-sticky-original">S/ {product.price}</span>
                </>
              ) : (
                <span className="mobile-sticky-current">S/ {product.price}</span>
              )}
            </div>
            <div className="mobile-sticky-qty">
              <button className="sticky-qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1} aria-label="Reducir cantidad">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
              <span className="sticky-qty-value">{quantity}</span>
              <button className="sticky-qty-btn" onClick={() => setQuantity(q => Math.min(99, q + 1))} disabled={quantity >= 99} aria-label="Aumentar cantidad">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
            <button
              className="mobile-sticky-whatsapp"
              onClick={sendWhatsAppOrder}
              disabled={!product.stock}
              aria-label="Comprar por WhatsApp"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
              </svg>
              Comprar
            </button>
            <button
              className={`mobile-sticky-wishlist ${inWishlist ? 'active' : ''}`}
              onClick={handleToggleWishlist}
              aria-label={inWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill={inWishlist ? 'currentColor' : 'none'}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
  )
}
