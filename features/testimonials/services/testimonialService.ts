import { get } from '@/shared/utils/api'
import type { ApiTestimonial } from '@/features/catalog/api/types'

export interface Testimonial {
  id: string
  name: string
  text: string
  rating: number
  avatar: string | null
}

function mapTestimonial(api: ApiTestimonial): Testimonial {
  return {
    id: api.id,
    name: api.name,
    text: api.text,
    rating: api.rating,
    avatar: api.avatar,
  }
}

export class TestimonialService {
  private pendingTestimonials: Promise<Testimonial[]> | null = null

  async getTestimonials(limit = 100): Promise<Testimonial[]> {
    if (this.pendingTestimonials) return this.pendingTestimonials
    this.pendingTestimonials = get<ApiTestimonial[]>(`/testimonials?skip=0&limit=${limit}`)
      .then(items => items.map(mapTestimonial))
      .finally(() => { this.pendingTestimonials = null })
    return this.pendingTestimonials
  }

  async getTestimonialById(id: string): Promise<Testimonial | undefined> {
    try {
      const api = await get<ApiTestimonial>(`/testimonials/${id}`)
      return mapTestimonial(api)
    } catch {
      return undefined
    }
  }
}

export const testimonialService = new TestimonialService()
