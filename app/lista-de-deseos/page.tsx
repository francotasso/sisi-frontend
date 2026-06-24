import { Metadata } from 'next'
import WishlistPage from '@/features/wishlist/ui/components/WishlistPage'
import { catalogService } from '@/features/catalog/services/catalogService'
import type { Product } from '@/features/catalog/domain/types'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const metadata: Metadata = {
  title: 'Mi lista de deseos - Sisi',
  description: 'Tu lista de deseos con los productos de belleza que te encantan.',
  alternates: {
    canonical: '/lista-de-deseos',
  },
  openGraph: {
    title: 'Mi lista de deseos - Sisi',
    description: 'Tu lista de deseos con los productos de belleza que te encantan.',
    url: '/lista-de-deseos',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Mi lista de deseos - Sisi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mi lista de deseos - Sisi',
    description: 'Tu lista de deseos con los productos de belleza que te encantan.',
    images: ['/og-image.png'],
  },
}

export default async function Wishlist({ searchParams }: Props) {
  const params = await searchParams
  const itemsParam = params.items as string | undefined

  let initialProducts: Product[] = []

  if (itemsParam) {
    const slugs = itemsParam.split(',').map(s => s.trim()).filter(Boolean)
    if (slugs.length > 0) {
      try {
        initialProducts = await catalogService.getProductsBySlugs(slugs)
      } catch {
        // Fallback a fetch cliente
      }
    }
  }

  return <WishlistPage initialProducts={initialProducts} />
}
