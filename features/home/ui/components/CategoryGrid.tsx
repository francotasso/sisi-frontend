import Link from 'next/link'

const categories = [
  {
    slug: 'Belleza',
    label: 'Belleza',
    desc: 'Maquillaje, skincare y fragancias',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop',
  },
  {
    slug: 'Tecnología',
    label: 'Tecnología',
    desc: 'Audífonos, cargadores y más',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=400&fit=crop',
  },
  {
    slug: 'Hogar',
    label: 'Hogar',
    desc: 'Decoración, organización y confort',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
  },
  {
    slug: 'Infantil',
    label: 'Infantil',
    desc: 'Juguetes educativos y divertidos',
    image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&h=400&fit=crop',
  },
  {
    slug: 'Otros',
    label: 'Otros',
    desc: 'Accesorios y más',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
  },
]

export default function CategoryGrid() {
  return (
    <section className="category-grid-section">
      <div className="section-container">
        <div className="section-header-centered">
          <span className="section-eyebrow">Explora</span>
          <h2 className="section-title">Nuestras categorías</h2>
        </div>
        <div className="category-grid">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/productos?category=${encodeURIComponent(cat.slug)}`}
              className="category-card"
              style={{ backgroundImage: `url(${cat.image})` }}
            >
              <h3 className="category-card-name">{cat.label}</h3>
              <p className="category-card-desc">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
