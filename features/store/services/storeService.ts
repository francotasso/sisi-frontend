import { get } from '@/shared/utils/api'
import type { ApiStore, ApiStoreHour } from '@/features/catalog/api/types'

export interface StoreInfo {
  storeName: string
  description: string
  hours: Record<string, HourEntry>
  contact: {
    phone: string
    whatsapp: string
    email: string
    address: string
    addressMap: string
  }
  socialMedia: Record<string, SocialEntry>
}

export interface HourEntry {
  day: string
  hours: string
  isOpen: boolean
}

export interface SocialEntry {
  name: string
  handle: string
  url: string
}

const DAY_MAP: Record<string, string> = {
  Monday: 'monday',
  Tuesday: 'tuesday',
  Wednesday: 'wednesday',
  Thursday: 'thursday',
  Friday: 'friday',
  Saturday: 'saturday',
  Sunday: 'sunday',
}

const DAY_NAMES_ES: Record<string, string> = {
  Monday: 'Lunes',
  Tuesday: 'Martes',
  Wednesday: 'Miércoles',
  Thursday: 'Jueves',
  Friday: 'Viernes',
  Saturday: 'Sábado',
  Sunday: 'Domingo',
}

const PLATFORM_MAP: Record<string, string> = {
  Instagram: 'instagram',
  Facebook: 'facebook',
  TikTok: 'tiktok',
  Whatsapp: 'whatsapp',
}

function formatHours(openTime: string | null, closeTime: string | null): string {
  if (!openTime || !closeTime) return 'Cerrado'
  const format12 = (t: string) => {
    const [h, m] = t.split(':')
    const hh = parseInt(h, 10)
    const ampm = hh >= 12 ? 'PM' : 'AM'
    const h12 = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh
    return `${h12}:${m} ${ampm}`
  }
  return `${format12(openTime)} - ${format12(closeTime)}`
}

function mapHour(hour: ApiStoreHour): HourEntry {
  const key = DAY_MAP[hour.day] || hour.day.toLowerCase()
  return {
    day: DAY_NAMES_ES[hour.day] || hour.day,
    hours: formatHours(hour.open_time, hour.close_time),
    isOpen: !hour.is_closed,
  }
}

function mapSocial(platform: string, url: string): SocialEntry {
  const key = PLATFORM_MAP[platform] || platform.toLowerCase()
  const handle = url.split('/').pop() || url
  const name = platform
  return { name, handle: `@${handle}`, url }
}

export class StoreService {
  async getStoreInfo(): Promise<StoreInfo> {
    const api = await get<ApiStore>('/store')

    const hours: Record<string, HourEntry> = {}
    for (const h of api.hours) {
      const key = DAY_MAP[h.day] || h.day.toLowerCase()
      hours[key] = mapHour(h)
    }

    const socialMedia: Record<string, SocialEntry> = {}
    for (const s of api.social_media) {
      const key = PLATFORM_MAP[s.platform] || s.platform.toLowerCase()
      socialMedia[key] = mapSocial(s.platform, s.url)
    }

    return {
      storeName: api.store_name,
      description: api.description,
      hours,
      contact: {
        phone: api.contact.phone,
        whatsapp: api.contact.whatsapp,
        email: api.contact.email,
        address: api.contact.address,
        addressMap: api.contact.address_map,
      },
      socialMedia,
    }
  }

  async getStoreInfoBasic(): Promise<{ storeName: string; description: string; contact: StoreInfo['contact']; socialMedia: StoreInfo['socialMedia'] }> {
    const info = await this.getStoreInfo()
    return {
      storeName: info.storeName,
      description: info.description,
      contact: info.contact,
      socialMedia: info.socialMedia,
    }
  }
}

export const storeService = new StoreService()
