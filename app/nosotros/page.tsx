import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Conoce más sobre Sisi, tu tienda de productos importados en tendencia. Belleza, tecnología, hogar, infantil y más.',
  openGraph: {
    title: 'Nosotros - Sisi',
    description: 'Conoce más sobre Sisi, tu tienda de productos importados en tendencia.',
    url: '/nosotros',
    type: 'website',
  },
}

export default function NosotrosPage() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1 className="about-title">Nuestra Historia</h1>
        <p className="about-subtitle">
          Sisi nació de la pasión por traer lo mejor del mundo directamente a tu puerta.
        </p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>¿Quiénes Somos?</h2>
          <p>
            Somos un emprendimiento peruano dedicado a la importación y venta de productos
            seleccionados cuidadosamente de todo el mundo. Creemos que tener acceso a productos
            de calidad, modernos y en tendencia no debería ser complicado ni costoso.
          </p>
          <p>
            Cada producto que ofrecemos pasa por un proceso de selección riguroso: evaluamos
            calidad, precio, y sobre todo, que sea algo que realmente nos guste y que
            creemos que a ti también te encantará.
          </p>
        </section>

        <section className="about-section">
          <h2>Nuestra Misión</h2>
          <p>
            Llevar productos importados de calidad a todo el Perú, ofreciendo una experiencia
            de compra fácil, segura y con un trato personalizado. Queremos que comprar en Sisi
            se sienta como recibir un regalo de alguien que sabe lo que te gusta.
          </p>
        </section>

        <section className="about-section">
          <h2>¿Por qué comprar en Sisi?</h2>
          <div className="about-reasons">
            <div className="about-reason">
              <strong>Productos seleccionados</strong>
              <span>Elegimos cada producto pensando en ti, no traemos todo lo que encontramos.</span>
            </div>
            <div className="about-reason">
              <strong>Atención personalizada</strong>
              <span>Respondemos todas tus dudas por WhatsApp antes y después de tu compra.</span>
            </div>
            <div className="about-reason">
              <strong>Envíos a todo Perú</strong>
              <span>Llegamos a Lima y provincias con entregas rápidas y seguras.</span>
            </div>
            <div className="about-reason">
              <strong>Calidad garantizada</strong>
              <span>Si algo no te gusta, tienes 7 días para cambios por defecto de fábrica.</span>
            </div>
          </div>
        </section>

        <div className="about-cta">
          <p>¿Tienes alguna pregunta? ¡Escríbenos!</p>
          <Link href="/contacto" className="hero-cta-btn">
            Contáctanos
          </Link>
        </div>
      </div>
    </div>
  )
}
