import type {
  ApiProductListItem,
  ApiProductDetail,
} from '@/features/catalog/api/types'
import type { Product, ProductFAQ } from '@/features/catalog/domain/types'

export function mapProductListItem(api: ApiProductListItem): Product {
  return {
    id: api.id,
    sku: api.sku,
    slug: api.slug,
    name: api.name,
    price: api.price,
    discountPrice: api.discount_price,
    category: api.category_name,
    categorySlug: api.category_slug,
    image: api.image,
    description: '',
    shortDescription: api.short_description,
    stock: api.stock,
    stockCount: api.stock_count,
    bestSeller: api.best_seller ?? false,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
    specs: {
      brand: '',
      type: '',
      size: '',
    },
    faq: [],
  }
}

export function mapProductDetail(api: ApiProductDetail): Product {
  return {
    id: api.id,
    sku: api.sku,
    slug: api.slug,
    name: api.name,
    price: api.price,
    discountPrice: api.discount_price,
    category: api.category_name,
    categorySlug: api.category_slug,
    image: api.image,
    description: api.description,
    shortDescription: api.short_description,
    stock: api.stock,
    stockCount: api.stock_count,
    bestSeller: api.best_seller ?? false,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
    specs: {
      brand: api.specs.brand,
      type: api.specs.product_type,
      shade: api.specs.shade ?? undefined,
      finish: api.specs.finish ?? undefined,
      size: api.specs.size,
      ingredients: api.specs.ingredients ?? undefined,
      spf: api.specs.spf ?? undefined,
      skinType: api.specs.skin_type ?? undefined,
      notes: api.specs.notes ?? undefined,
      benefits: api.specs.benefits ?? undefined,
      includes: api.specs.includes ?? undefined,
    },
    faq: api.faqs.map(mapFAQ),
  }
}

function mapFAQ(api: { question: string; answer: string }): ProductFAQ {
  return {
    question: api.question,
    answer: api.answer,
  }
}
