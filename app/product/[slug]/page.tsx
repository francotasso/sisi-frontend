import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetailClient from '@/features/product/ui/components/ProductDetailClient'
import { catalogService } from '@/features/catalog/services/catalogService'
import { BASE_URL } from '@/shared/utils/constants'
import { Product } from '@/features/catalog/domain/types'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await catalogService.getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Producto no encontrado',
    }
  }

  return {
    title: product.name,
    description: product.shortDescription || product.description.slice(0, 160),
    alternates: {
      canonical: `/product/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} - Sisi`,
      description: product.shortDescription || product.description.slice(0, 160),
      images: product.image ? [{ url: product.image, alt: product.name }] : [],
      url: `/product/${product.slug}`,
      type: 'website',
    },
    other: {
      'product:price:amount': product.price.toString(),
      'product:price:currency': 'PEN',
      'product:availability': product.stock === true ? 'instock' : 'outofstock',
    },
  }
}

export async function generateStaticParams() {
  const products = await catalogService.getProducts()
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params

  const product = await catalogService.getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await catalogService.getProducts({ category: product.category })
  const relatedFiltered = relatedProducts.filter(p => p.slug !== slug).slice(0, 4)

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: product.category, item: `${BASE_URL}/?category=${encodeURIComponent(product.category)}` },
      { '@type': 'ListItem', position: 3, name: product.name },
    ],
  }

  const productJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'PEN',
      availability: product.stock === true ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${BASE_URL}/product/${product.slug}`,
    },
    brand: {
      '@type': 'Brand',
      name: product.specs.brand,
    },
  }

  const faqJsonLd = product.faq && product.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: product.faq.map((f: Product['faq'][number]) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  } : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <ProductDetailClient
      product={product}
      relatedProducts={relatedFiltered}
      currentProductCategory={product.category}
    />
    </>
  )
}
