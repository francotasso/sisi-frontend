'use client'

import { useEffect, useRef, useState } from 'react'
import { Product } from '@/features/catalog/domain/types'
import { WHATSAPP_NUMBER } from '@/shared/utils/constants'

interface StickyProductBarProps {
  product: Product
}

export default function StickyProductBar({ product }: StickyProductBarProps) {
  const [visible, setVisible] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting)
      },
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  const displayPrice = product.discountPrice ?? product.price

  const sendWhatsAppOrder = () => {
    const message = `¡Hola! Me interesa:\n\n*${product.name}*\nSKU: ${product.sku}\nPrecio: S/ ${displayPrice}\nCantidad: 1\n\n¿Me confirmas disponibilidad?`
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank')
  }

  return (
    <>
      <div ref={sentinelRef} className="sticky-bar-sentinel" />
      <div className={`sticky-product-bar ${visible ? 'visible' : ''}`}>
        <div className="sticky-product-bar-inner">
          <div className="sticky-product-info">
            {product.image && (
              <img
                src={product.image}
                alt=""
                className="sticky-product-thumb"
                width={36}
                height={36}
              />
            )}
            <div className="sticky-product-text">
              <span className="sticky-product-name">{product.name}</span>
              <span className="sticky-product-price">S/ {displayPrice}</span>
            </div>
          </div>
          <div className="sticky-product-badges">
            <span className={`sticky-product-stock ${product.stock ? 'in-stock' : ''}`}>
              {product.stock ? 'En stock' : 'Agotado'}
            </span>
          </div>
          <button
            className="sticky-product-cta"
            onClick={sendWhatsAppOrder}
            disabled={!product.stock}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
            </svg>
            Comprar
          </button>
        </div>
      </div>
    </>
  )
}
