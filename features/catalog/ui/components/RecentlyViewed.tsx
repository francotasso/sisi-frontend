'use client'

import React from 'react'
import Link from 'next/link'
import SafeImage, { getFallbackImageUrl } from '@/shared/components/SafeImage'
import { useRecentlyViewed } from '@/shared/hooks/useRecentlyViewed'
import { useSelector } from 'react-redux'
import { RootState } from '@/shared/store'
import { RecentlyViewedItem } from '@/shared/hooks/useRecentlyViewed'
import { catalogService } from '@/features/catalog/services/catalogService'

const RecentItem = React.memo(function RecentItem({ item }: { item: RecentlyViewedItem }) {
  const inWishlist = useSelector((state: RootState) =>
    state.wishlist.items.some(w => w.id === item.id)
  )
  const imageUrl = item.image || getFallbackImageUrl(item.name)
  const discountPercentage = item.discountPrice
    ? Math.round((1 - item.discountPrice / item.price) * 100)
    : null

  return (
    <Link href={`/producto/${item.slug}`} className="recently-card">
      <div className="recently-card-image">
        {discountPercentage && <span className="offer-badge">-{discountPercentage}%</span>}
        <SafeImage
          src={imageUrl}
          alt={item.name}
          fallbackText={item.name}
          fill
          sizes="160px"
          className="recently-card-img"
        />
      </div>
      <div className="recently-card-info">
        <span className="recently-card-name">{item.name}</span>
        <div className="recently-card-price">
          {item.discountPrice && (
            <span className="recently-card-old-price">S/ {Number(item.price).toFixed(2)}</span>
          )}
          <span className="recently-card-discount-price">
            S/ {Number(item.discountPrice ?? item.price).toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  )
})

export default function RecentlyViewed() {
  const { items } = useRecentlyViewed()

  if (items.length === 0) return null

  return (
    <div className="recently-section">
      <h3 className="recently-title">Vistos recientemente</h3>
      <div className="recently-scroll">
        {items.map((item) => (
          <RecentItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
