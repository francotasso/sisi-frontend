import { Metadata } from 'next'
import WishlistPage from '@/features/wishlist/ui/components/WishlistPage'

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
  },
}

export default function Wishlist() {
  return <WishlistPage />
}
