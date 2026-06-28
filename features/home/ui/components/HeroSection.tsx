import Link from 'next/link'
import SafeImage from '@/shared/components/SafeImage'
import { getOptimizedImageUrl } from '@/shared/utils/cloudinary'
import type { Product } from '@/features/catalog/domain/types'

interface HeroSectionProps {
  products?: Product[]
}

export default function HeroSection({ products = [] }: HeroSectionProps) {
  const displayProducts = products.slice(0, 4)
  const mainProduct = displayProducts[0]
  const sideProducts = displayProducts.slice(1, 3)
  const accentProduct = displayProducts[3]

  return (
    <section className="hero-section landing">
      <div className="hero-inner-landing">
        <div className="hero-text-landing">
          <span className="hero-badge">Nueva colección</span>
          <h1 className="hero-landing-title">
            Productos importados<br />
            <span className="hero-landing-accent">en tendencia</span>
          </h1>
          <p className="hero-landing-subtitle">
            Descubre los mejores productos seleccionados para ti — belleza, tecnología, hogar,
            infantil y más. Calidad y estilo al mejor precio.
          </p>
          <div className="hero-actions">
            <Link href="/productos" className="hero-cta-btn">
              Ver Productos
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link href="/productos?category=Novedades" className="hero-cta-btn-outline">
              Novedades
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">32+</span>
              <span className="hero-stat-label">Productos</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">5</span>
              <span className="hero-stat-label">Categorías</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">Envío</span>
              <span className="hero-stat-label">a todo Perú</span>
            </div>
          </div>
        </div>
        <div className="hero-media-landing">
          {mainProduct && (
            <div className="hero-image-main">
              <Link href={`/producto/${mainProduct.slug}`}>
                <SafeImage
                  src={getOptimizedImageUrl(mainProduct.image, 600)}
                  alt={mainProduct.name}
                  className="hero-landing-image"
                  width={600}
                  height={600}
                  fallbackText={mainProduct.name}
                  priority
                />
                <span className="hero-product-label">{mainProduct.name}</span>
              </Link>
            </div>
          )}
          <div className="hero-image-side">
            {sideProducts.map(p => (
              <Link key={p.slug} href={`/producto/${p.slug}`} className="hero-image-small">
                <SafeImage
                  src={getOptimizedImageUrl(p.image, 300)}
                  alt={p.name}
                  className="hero-landing-image"
                  width={200}
                  height={200}
                  fallbackText={p.name}
                  priority
                />
              </Link>
            ))}
          </div>
          {accentProduct && (
            <div className="hero-image-accent">
              <Link href={`/producto/${accentProduct.slug}`}>
                <SafeImage
                  src={getOptimizedImageUrl(accentProduct.image, 300)}
                  alt={accentProduct.name}
                  className="hero-landing-image"
                  width={200}
                  height={200}
                  fallbackText={accentProduct.name}
                  priority
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
