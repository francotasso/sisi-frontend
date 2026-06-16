'use client'

import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'recently-viewed'
const MAX_RECENTLY_VIEWED = 6

export interface RecentlyViewedItem {
  id: string
  slug: string
  name: string
  image: string
  price: number
  discountPrice?: number
}

function readFromStorage(): RecentlyViewedItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeToStorage(items: RecentlyViewedItem[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* empty */
  }
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>([])

  useEffect(() => {
    setItems(readFromStorage())
  }, [])

  const addRecentlyViewed = useCallback((item: RecentlyViewedItem) => {
    setItems(prev => {
      const filtered = prev.filter(i => i.id !== item.id)
      const updated = [item, ...filtered].slice(0, MAX_RECENTLY_VIEWED)
      writeToStorage(updated)
      return updated
    })
  }, [])

  return { items, addRecentlyViewed }
}
