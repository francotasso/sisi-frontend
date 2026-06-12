'use client'

import React from 'react'
import Link from 'next/link'
import SafeImage, { getFallbackImageUrl } from '@/shared/components/SafeImage'
import { useRecentlyViewed } from '@/shared/hooks/useRecentlyViewed'
import { useSelector } from 'react-redux'
import { RootState } from '@/shared/store'
import { RecentlyViewedItem } from '@/shared/hooks/useRecentlyViewed'

const RecentItem = React.memo(function RecentItem({ item }: { item: RecentlyViewedItem }) {
  const inWishlist = useSelector((state: RootState) =>
    state.wishlist.items.some(w => w.id === item.id)
  )
  const imageUrl = item.image || getFallbackImageUrl(item.name)

  return (
    <Link href={`/producto/${item.slug}`} className="recently-card">
      <div className="recently-card-image">
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
        <span className="recently-card-price">S/ {item.price}</span>
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
