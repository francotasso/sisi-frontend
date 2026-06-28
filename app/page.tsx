import { Metadata } from 'next'
import HeroSection from '@/features/home/ui/components/HeroSection'
import CategoryGrid from '@/features/home/ui/components/CategoryGrid'
import BestSellers from '@/features/home/ui/components/BestSellers'
import NewArrivals from '@/features/home/ui/components/NewArrivals'
import BenefitsGrid from '@/features/home/ui/components/BenefitsGrid'
import TestimonialsSection from '@/shared/components/TestimonialsSection'
import GeneralFAQ from '@/shared/components/GeneralFAQ'
import { catalogService } from '@/features/catalog/services/catalogService'
import type { Product } from '@/features/catalog/domain/types'

export const metadata: Metadata = {
  title: 'Sisi — Productos importados en tendencia',
  description:
    'Descubre los mejores productos importados: belleza, tecnología, hogar, infantil y más. Envíos a todo Perú.',
  openGraph: {
    title: 'Sisi — Productos importados en tendencia',
    description: 'Descubre los mejores productos importados: belleza, tecnología, hogar, infantil y más.',
    url: '/',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sisi — Productos importados en tendencia',
    description: 'Descubre los mejores productos importados: belleza, tecnología, hogar, infantil y más.',
    images: ['/og-image.png'],
  },
}

export default async function HomePage() {
  let bestSellers: Product[] = []
  let newArrivals: Product[] = []
  let categories: { value: string; label: string; description: string; image: string }[] = []

  const results = await Promise.allSettled([
    catalogService.getBestSellersProducts(8),
    catalogService.getNewestProducts(8),
    catalogService.getCategories(),
  ])

  if (results[0].status === 'fulfilled') bestSellers = results[0].value
  if (results[1].status === 'fulfilled') newArrivals = results[1].value
  if (results[2].status === 'fulfilled') categories = results[2].value

  return (
    <>
      <HeroSection products={bestSellers} />
      <CategoryGrid initialCategories={categories} />
      <BestSellers initialProducts={bestSellers} />
      <NewArrivals initialProducts={newArrivals} />
      <GeneralFAQ />
      <TestimonialsSection />
      <BenefitsGrid />
    </>
  )
}
