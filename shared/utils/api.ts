import { API_BASE_URL } from './constants'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!res.ok) {
    throw new ApiError(res.status, `API error ${res.status}: ${res.statusText}`)
  }

  return res.json()
}

export function get<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint)
}

export async function getPaginated<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<{ items: T[]; total: number }> {
  const query = new URLSearchParams()
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        query.set(key, String(value))
      }
    }
  }
  const qs = query.toString()
  const url = qs ? `${endpoint}?${qs}` : endpoint
  const data = await request<{ items: T[]; total: number; skip: number; limit: number }>(url)
  return { items: data.items, total: data.total }
}
