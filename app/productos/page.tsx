import { Metadata } from 'next'
import CatalogPage from '@/features/catalog/ui/components/CatalogPage'

export const metadata: Metadata = {
  title: 'Productos - Sisi',
  description: 'Explora nuestro catálogo completo de productos importados. Belleza, tecnología, hogar, infantil y más.',
  alternates: { canonical: '/productos' },
  openGraph: {
    title: 'Productos - Sisi',
    description: 'Explora nuestro catálogo completo de productos importados.',
    url: '/productos',
  },
}

export default function ProductosPage() {
  return <CatalogPage />
}
