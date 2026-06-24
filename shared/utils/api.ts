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

const TIMEOUT_MS = 15000
const MAX_RETRIES = 1

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

    try {
      const res = await fetch(url, {
        cache: 'no-store',
        signal: controller.signal,
        headers: {
          ...(options?.method && options.method !== 'GET' ? { 'Content-Type': 'application/json' } : {}),
          ...options?.headers,
        },
        ...options,
      })

      clearTimeout(timeoutId)

      if (!res.ok) {
        throw new ApiError(res.status, `API error ${res.status}: ${res.statusText}`)
      }

      return res.json()
    } catch (err) {
      clearTimeout(timeoutId)

      if (attempt < MAX_RETRIES && (
        err instanceof TypeError ||
        (err instanceof ApiError && err.status >= 500)
      )) {
        continue
      }

      if (err instanceof ApiError) throw err
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new ApiError(0, 'La solicitud tardó demasiado. Intenta de nuevo.')
      }
      throw err
    }
  }

  throw new ApiError(0, 'Error de conexión después de reintentos.')
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
