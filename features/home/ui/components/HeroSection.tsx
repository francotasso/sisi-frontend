import Link from 'next/link'
import SafeImage from '@/shared/components/SafeImage'
import { getOptimizedImageUrl } from '@/shared/utils/cloudinary'

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-inner">
        <div className="hero-text">
          <h1 className="hero-landing-title">
            Productos importados<br />
            <span className="hero-landing-accent">en tendencia</span>
          </h1>
          <p className="hero-landing-subtitle">
            Descubre los mejores productos seleccionados para ti — belleza, tecnología, hogar,
            infantil y más. Calidad y estilo al mejor precio.
          </p>
          <Link href="/productos" className="hero-cta-btn">
            Ver Productos
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
        <div className="hero-image-wrapper">
          <SafeImage
            src={getOptimizedImageUrl("https://media.admagazine.com/photos/67f56a136699e8d523ad8add/16:9/w_2560%2Cc_limit/Pernille%2520Lind%2520Studio-1.jpg", 600)}
            alt="Productos importados en tendencia"
            className="hero-landing-image"
            width={600}
            height={600}
            fallbackText="Sisi"
            priority
          />
        </div>
      </div>
    </section>
  )
}
