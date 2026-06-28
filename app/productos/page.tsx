import { Metadata } from 'next'
import CatalogPage from '@/features/catalog/ui/components/CatalogPage'
import { catalogService } from '@/features/catalog/services/catalogService'
import type { Product, SortOption } from '@/features/catalog/domain/types'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)

  return {
    title: page > 1 ? `Productos - Página ${page} | Sisi` : 'Todos los productos | Sisi',
    description: page > 1
      ? `Explora nuestra colección de productos importados — Página ${page}`
      : 'Descubre todos nuestros productos importados: belleza, tecnología, hogar, infantil y más.',
    alternates: { canonical: page > 1 ? `/productos?page=${page}` : '/productos' },
    openGraph: {
      title: page > 1 ? `Productos - Página ${page} | Sisi` : 'Todos los productos | Sisi',
      description: 'Explora nuestro catálogo completo de productos importados.',
      url: page > 1 ? `/productos?page=${page}` : '/productos',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Productos - Sisi' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page > 1 ? `Productos - Página ${page} | Sisi` : 'Todos los productos | Sisi',
      description: 'Explora nuestro catálogo completo de productos importados.',
      images: ['/og-image.png'],
    },
  }
}

export default async function ProductosPage({ searchParams }: Props) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)
  const sort = (params.sort as SortOption) || 'newest'
  const search = (params.search as string) || ''
  const category = (params.category as string) || ''
  const novedades = params.novedades === 'true'

  const filter = category ? { category } : search ? { search } : undefined

  let initialProducts: Product[] = []
  let initialTotal = 0
  let serverCategories: { value: string; label: string; description: string; image: string }[] = []

  try {
    const [result, cats] = await Promise.all([
      catalogService.getProductsPaginated(filter, sort, page),
      catalogService.getCategories(),
    ])
    initialProducts = result.products
    initialTotal = result.total
    serverCategories = cats
  } catch {
    // CatalogPage shows error state
  }

  return (
    <CatalogPage
      initialProducts={initialProducts}
      initialTotal={initialTotal}
      currentPage={page}
      initialSort={sort}
      initialCategory={category}
      initialSearch={search}
      serverCategories={serverCategories}
      initialNovedades={novedades}
    />
  )
}
