import { MetadataRoute } from 'next'
import { catalogService } from '@/features/catalog/services/catalogService'
import { BASE_URL } from '@/shared/utils/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const products = await catalogService.getProducts()

  const productUrls = products.map((product) => ({
    url: `${BASE_URL}/product/${product.slug}`,
    lastModified: new Date(product.createdAt),
    changeFrequency: 'weekly' as const,
    priority: product.stock ? 0.8 : 0.5,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/productos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
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
    ...productUrls,
  ]
}
