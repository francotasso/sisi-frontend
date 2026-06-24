import { MetadataRoute } from 'next'
import { catalogService } from '@/features/catalog/services/catalogService'
import { BASE_URL } from '@/shared/utils/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: { slug: string; createdAt: string; stock: boolean }[] = []
  try {
    products = await catalogService.getAllProducts()
  } catch {
    /* if API is unavailable, return static pages only */
  }

  const productUrls = products.map((product) => ({
    url: `${BASE_URL}/producto/${product.slug}`,
    lastModified: new Date(product.createdAt),
    changeFrequency: 'weekly' as const,
    priority: product.stock ? 0.8 : 0.5,
  }))

  const listingPages = Array.from({ length: 10 }, (_, i) => ({
    url: i === 0 ? `${BASE_URL}/productos` : `${BASE_URL}/productos?page=${i + 1}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: i === 0 ? 0.9 : 0.7 - i * 0.05,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...listingPages,
    {
      url: `${BASE_URL}/lista-de-deseos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    ...productUrls,
  ]
}
