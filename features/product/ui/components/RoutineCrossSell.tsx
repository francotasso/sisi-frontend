'use client'

import Link from 'next/link'
import SafeImage, { getFallbackImageUrl } from '@/shared/components/SafeImage'
import { getOptimizedImageUrl } from '@/shared/utils/cloudinary'
import { Product } from '@/features/catalog/domain/types'

interface RoutineCrossSellProps {
  products: Product[]
  currentCategory: string
}

const complementaryCategories: Record<string, string[]> = {
  'Labiales': ['Labiales', 'Labial', 'Cuidado Labial'],
  'Bases': ['Bases', 'Base', 'Brochas', 'Esponjas', 'Accesorios'],
  'Sombras': ['Sombras', 'Sombra', 'Delineadores', 'Ojos'],
  'Skincare': ['Skincare', 'Serum', 'Hidratante', 'Limpieza'],
  'Cabello': ['Cabello', 'Tratamiento Capilar'],
  'Uñas': ['Uñas', 'Esmaltes', 'Cuidado de Uñas'],
}

export default function RoutineCrossSell({ products, currentCategory }: RoutineCrossSellProps) {
  const complementary = Object.entries(complementaryCategories).find(([key]) =>
    currentCategory.toLowerCase().includes(key.toLowerCase())
  )

  if (!complementary) return null

  const crossSellProducts = products
    .filter(p => {
      const cat = (p.categorySlug ?? p.category).toLowerCase()
      return complementary[1].some(c => cat.includes(c.toLowerCase()))
    })
    .slice(0, 4)

  if (crossSellProducts.length < 2) return null

  return (
    <div className="cross-sell-section">
      <h3 className="cross-sell-title">Completa tu rutina</h3>
      <p className="cross-sell-subtitle">Productos que combinan perfectamente</p>
      <div className="cross-sell-grid">
        {crossSellProducts.map((product) => (
          <Link
            key={product.slug}
            href={`/producto/${product.slug}`}
            className="cross-sell-card"
          >
            <div className="cross-sell-image">
              <SafeImage
                src={getOptimizedImageUrl(product.image || getFallbackImageUrl(product.name), 200)}
                alt={product.name}
                fallbackText={product.name}
                fill
                sizes="140px"
              />
            </div>
            <div className="cross-sell-info">
              <span className="cross-sell-category">{product.category}</span>
              <span className="cross-sell-name">{product.name}</span>
              <span className="cross-sell-price">S/ {product.discountPrice ?? product.price}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
