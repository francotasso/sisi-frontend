'use client'

import { useState, useEffect, Suspense, useMemo, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import SafeImage, { getFallbackImageUrl } from '@/shared/components/SafeImage'
import { getOptimizedImageUrl } from '@/shared/utils/cloudinary'
import { useWishlistStore } from '../../hooks/useWishlistStore'
import { catalogService } from '@/features/catalog/services/catalogService'
import { Product } from '@/features/catalog/domain/types'
import { WHATSAPP_NUMBER, MAX_QUANTITY } from '@/shared/utils/constants'
import PaymentMethods from '@/shared/components/PaymentMethods'

interface WishlistItemWithProduct extends Product {
  quantity: number
}

interface WishlistPageContentProps {
  sharedItemIds?: string[]
  initialProducts?: Product[]
}

function WishlistPageContent({ sharedItemIds, initialProducts = [] }: WishlistPageContentProps) {
  const wishlistStore = useWishlistStore()
  const [wishlistProducts, setWishlistProducts] = useState<WishlistItemWithProduct[]>(() => {
    if (sharedItemIds && sharedItemIds.length > 0 && initialProducts.length > 0) {
      return initialProducts.map(p => ({ ...p, quantity: 1 }))
    }
    return []
  })
  const [copiedLink, setCopiedLink] = useState(false)
  const itemsRef = useRef(wishlistStore.items)
  itemsRef.current = wishlistStore.items

  const itemsKey = useMemo(
    () => wishlistStore.items.map(i => i.id).join(','),
    [wishlistStore.items]
  )

  useEffect(() => {
    if (sharedItemIds && sharedItemIds.length > 0 && initialProducts.length > 0) return

    const items = itemsRef.current
    if ((!sharedItemIds || sharedItemIds.length === 0) && items.length === 0) {
      setWishlistProducts([])
      return
    }

    const loadProducts = async () => {
      try {
        let itemsToLoad: { id: string; quantity: number }[]

        if (sharedItemIds && sharedItemIds.length > 0) {
          itemsToLoad = sharedItemIds.map(id => ({ id, quantity: 1 }))
        } else {
          itemsToLoad = items
        }

        const products = await catalogService.getProductsBySlugs(
          itemsToLoad.map(i => i.id)
        )

        const wishlistItems = products.map(product => ({
          ...product,
          quantity: itemsToLoad.find(i => i.id === product.slug)?.quantity ?? 1,
        }))

        setWishlistProducts(wishlistItems)
      } catch (err) {
        console.error('[Wishlist] Error loading products:', err)
      }
    }

    loadProducts()
  }, [itemsKey, sharedItemIds])

  const handleQuantityChange = (productId: string, newQuantity: number, hasStock: boolean) => {
    if (!hasStock) return
    const clampedQuantity = Math.min(Math.max(1, newQuantity), MAX_QUANTITY)
    wishlistStore.updateQuantity(productId, clampedQuantity)

    setWishlistProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, quantity: clampedQuantity } : p
    ))
  }

  const effectivePrice = (p: WishlistItemWithProduct) => p.discountPrice ?? p.price

  const handleRemove = (productId: string) => {
    wishlistStore.removeFromWishlist(productId)
  }

  const sendItemWhatsApp = (item: WishlistItemWithProduct) => {
    const message = `¡Hola! Me interesa:\n\n*${item.name}*\nCantidad: ${item.quantity}\nPrecio: S/ ${(effectivePrice(item) * item.quantity).toFixed(2)}\n\n¿Me confirmas disponibilidad?`
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank')
  }

  const totalItems = wishlistProducts.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = wishlistProducts.reduce((sum, item) => sum + effectivePrice(item) * item.quantity, 0)

  const [expandedSections, setExpandedSections] = useState({ products: false, discounts: false })

  const discountedItems = useMemo(() => wishlistProducts.filter(p => p.discountPrice), [wishlistProducts])

  const originalSubtotal = useMemo(() =>
    wishlistProducts.reduce((sum, item) => sum + item.price * item.quantity, 0),
  [wishlistProducts])

  const totalDiscount = useMemo(() =>
    discountedItems.reduce((sum, item) => sum + (item.price - item.discountPrice!) * item.quantity, 0),
  [discountedItems])

  const effectiveTotal = originalSubtotal - totalDiscount

  const handleClearWishlist = () => {
    wishlistStore.clearWishlist()
  }

  const sendConsolidatedWhatsApp = () => {
    const items = wishlistProducts.map(item => {
      return `${item.name} x${item.quantity} - S/ ${(effectivePrice(item) * item.quantity).toFixed(2)}`
    }).join('\n')

    const message = `¡Hola! Quiero pedir:\n\n${items}\n\n_Total: S/ ${totalPrice.toFixed(2)}_\n\n¿Me confirmas disponibilidad?`
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank')
  }

  const shareWishlist = async () => {
    const itemIds = wishlistProducts.map(p => p.id).join(',')
    const shareUrl = `${window.location.origin}/lista-de-deseos?items=${itemIds}`

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 3000)
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 3000)
    }
  }

  const isShared = sharedItemIds && sharedItemIds.length > 0
  const hasItemsInStore = !isShared && wishlistStore.items.length > 0

  if (wishlistProducts.length === 0) {
    if (hasItemsInStore) return null

    return (
      <div className="wishlist-page">
        <div className="empty-wishlist">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <h3>Tu wishlist está vacía</h3>
          <p>Agrega productos que te encanten y luego pídelos por WhatsApp</p>
          <Link href="/productos" className="whatsapp-btn wishlist-back-btn">
            Ver Productos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
          <h1>Mi lista de deseos ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})</h1>
        <div className="wishlist-header-actions">
          <button onClick={shareWishlist} className="whatsapp-btn-outline wishlist-share-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            {copiedLink ? '¡Copiado!' : 'Compartir'}
          </button>
          {!isShared && (
            <button onClick={handleClearWishlist} className="whatsapp-btn-outline wishlist-clear-btn">
              Vaciar
            </button>
          )}
        </div>
      </div>

      <div className="wishlist-layout">
        <div className="wishlist-main">
          {wishlistProducts.map((item) => {
            const imageUrl = getOptimizedImageUrl(item.image || getFallbackImageUrl(item.name), 144)

            return (
              <div key={item.slug} className="wishlist-item">
                <Link href={`/producto/${item.slug}`}>
                  <SafeImage
                    src={imageUrl}
                    alt={item.name}
                    fallbackText={item.name}
                    className="wishlist-item-image"
                    width={72}
                    height={72}
                  />
                </Link>

                <div className="wishlist-item-info">
                <Link href={`/producto/${item.slug}`}>
                    <div className="wishlist-item-category">{item.category}</div>
                    <h3 className="wishlist-item-name">{item.name}</h3>
                  </Link>
                  <div className="wishlist-item-price">
                    {item.discountPrice ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>S/ {item.discountPrice}</span>
                        <span className="original-price">S/ {item.price}</span>
                        {catalogService.getDiscountPercentage(item) && (
                          <span className="offer-badge-detail" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>-{catalogService.getDiscountPercentage(item)}%</span>
                        )}
                      </div>
                    ) : (
                      `S/ ${item.price}`
                    )}
                  </div>
                  <span className={`wishlist-item-stock ${item.stock ? 'inStock' : 'outOfStock'}`}>
                    {item.stock ? 'En stock' : 'Agotado'}
                  </span>
                </div>

                <div className="wishlist-item-controls">
                  {!isShared && (
                    <div className="wishlist-item-qty">
                      <button
                        className="wishlist-qty-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.stock)}
                        disabled={item.quantity <= 1 || !item.stock}
                        aria-label={`Reducir cantidad de ${item.name}`}
                      >
                        −
                      </button>
                      <span className="wishlist-qty-value">{item.quantity}</span>
                      <button
                        className="wishlist-qty-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.stock)}
                        disabled={!item.stock}
                        aria-label={`Aumentar cantidad de ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  )}

                  {item.stock && (
                    <button
                      className="whatsapp-btn-small"
                      onClick={() => sendItemWhatsApp(item)}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                      </svg>
                      Comprar
                    </button>
                  )}

                  <button
                    className="wishlist-remove-btn"
                    onClick={() => handleRemove(item.id)}
                    aria-label={`Eliminar ${item.name} de la lista de deseos`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <aside className="wishlist-sidebar">
          <div className="wishlist-summary-card">
            <h2 className="summary-card-title">Resumen</h2>

            <div className="summary-collapsible">
              <button
                className="summary-collapsible-header"
                onClick={() => setExpandedSections(s => ({ ...s, products: !s.products }))}
                aria-expanded={expandedSections.products}
              >
                <svg className={`summary-arrow ${expandedSections.products ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
                <span className="summary-section-label">Productos ({wishlistProducts.length})</span>
                <span className="summary-section-total">S/ {originalSubtotal.toFixed(2)}</span>
              </button>
              {expandedSections.products && (
                <div className="summary-collapsible-body">
                  {wishlistProducts.map(item => (
                    <div key={item.slug} className="summary-product-item">
                      <span className="summary-product-name">{item.name} × {item.quantity}</span>
                      <span className="summary-product-subtotal">S/ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {discountedItems.length > 0 && (
              <div className="summary-collapsible">
                <button
                  className="summary-collapsible-header"
                  onClick={() => setExpandedSections(s => ({ ...s, discounts: !s.discounts }))}
                  aria-expanded={expandedSections.discounts}
                >
                  <svg className={`summary-arrow ${expandedSections.discounts ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                  <span className="summary-section-label">Descuentos ({discountedItems.length})</span>
                  <span className="summary-section-total discount">-S/ {totalDiscount.toFixed(2)}</span>
                </button>
                {expandedSections.discounts && (
                  <div className="summary-collapsible-body">
                    {discountedItems.map(item => {
                      const discount = (item.price - item.discountPrice!) * item.quantity
                      return (
                        <div key={item.slug} className="summary-discount-item">
                          <span className="summary-product-name">{item.name} × {item.quantity}</span>
                          <span className="summary-discount-amount">-S/ {discount.toFixed(2)}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {(discountedItems.length > 0 && expandedSections.discounts) || (!discountedItems.length && expandedSections.products) ? <hr className="summary-divider" /> : null}

            <div className="summary-total-row">
              <span className="summary-total-label">Total</span>
              <span className="summary-total-value">S/ {effectiveTotal.toFixed(2)}</span>
            </div>

            <div className="summary-actions">
              <button className="whatsapp-btn" onClick={sendConsolidatedWhatsApp}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                </svg>
                Pedir todo por WhatsApp
              </button>

              <Link href="/" className="whatsapp-btn-outline" style={{ width: '100%', textAlign: 'center' }}>
                Seguir comprando
              </Link>
            </div>

            <PaymentMethods compact />

          </div>
        </aside>
      </div>
    </div>
  )
}

export default function WishlistPage({ initialProducts = [] }: { initialProducts?: Product[] }) {
  return (
    <Suspense fallback={null}>
      <WishlistPageWrapper initialProducts={initialProducts} />
    </Suspense>
  )
}

function WishlistPageWrapper({ initialProducts = [] }: { initialProducts?: Product[] }) {
  const searchParams = useSearchParams()
  const itemsParam = searchParams.get('items')

  const sharedItemIds = useMemo(() => {
    return itemsParam
      ? itemsParam.split(',').map(id => id.trim()).filter(id => id.length > 0)
      : []
  }, [itemsParam])

  return <WishlistPageContent sharedItemIds={sharedItemIds} initialProducts={initialProducts} />
}
