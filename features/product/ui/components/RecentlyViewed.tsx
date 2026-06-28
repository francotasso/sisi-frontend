'use client'

import React from 'react'
import Link from 'next/link'
import SafeImage, { getFallbackImageUrl } from '@/shared/components/SafeImage'
import { getOptimizedImageUrl } from '@/shared/utils/cloudinary'
import { RecentlyViewedItem } from '@/shared/hooks/useRecentlyViewed'

interface RecentlyViewedProps {
  items: RecentlyViewedItem[]
  currentSlug: string
}

export default function RecentlyViewed({ items, currentSlug }: RecentlyViewedProps) {
  const filtered = items.filter(item => item.slug !== currentSlug).slice(0, 6)

  if (filtered.length === 0) return null

  return (
    <div className="recently-section">
      <h3 className="recently-title">Vistos Recientemente</h3>
      <div className="recently-scroll">
        {filtered.map((item) => (
          <Link
            key={item.slug}
            href={`/producto/${item.slug}`}
            className="recently-card"
          >
            <div className="recently-card-image">
              <SafeImage
                src={getOptimizedImageUrl(item.image || getFallbackImageUrl(item.name), 200)}
                alt={item.name}
                fallbackText={item.name}
                fill
                sizes="120px"
              />
            </div>
            <div className="recently-card-info">
              <span className="recently-card-name">{item.name}</span>
              <span className="recently-card-price">
                S/ {item.discountPrice ?? item.price}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
