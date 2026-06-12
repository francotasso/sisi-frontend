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
  async getTestimonials(limit = 100): Promise<Testimonial[]> {
    const testimonials = await get<ApiTestimonial[]>(`/testimonials?skip=0&limit=${limit}`)
    return testimonials.map(mapTestimonial)
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
