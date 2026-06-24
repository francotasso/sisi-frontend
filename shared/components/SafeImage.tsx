'use client'

import Image from 'next/image'
import { useState, useMemo } from 'react'

export function getFallbackImageUrl(text: string): string {
  const encodedText = encodeURIComponent(text)
  return `https://placehold.co/400x400/e2e8f0/475569?text=${encodedText}`
}

interface SafeImageProps {
  src: string
  alt: string
  fallbackText?: string
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
  className?: string
  priority?: boolean
  style?: React.CSSProperties
  onClick?: () => void
  unoptimized?: boolean
}

export default function SafeImage({
  src,
  alt,
  fallbackText = 'Producto',
  fill = false,
  width,
  height,
  sizes,
  className = '',
  priority = false,
  style,
  onClick,
  unoptimized,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const isPlaceholder = imgSrc.startsWith('https://placehold.co/')
  const isCloudinary = imgSrc.includes('res.cloudinary.com')
  const shouldUnoptimized = unoptimized ?? isPlaceholder ?? isCloudinary

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(getFallbackImageUrl(fallbackText))
    }
  }

  const wrapperStyle = useMemo(() => ({
    ...style,
    position: 'relative' as const,
    width: '100%',
    height: '100%',
  }), [style])

  if (fill) {
    return (
      <div
        className={className}
        style={wrapperStyle}
      >
        <Image
          key={src}
          src={imgSrc}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectFit: 'cover' }}
          onError={handleError}
          unoptimized={shouldUnoptimized}
        />
      </div>
    )
  }

  return (
    <Image
      key={src}
      src={imgSrc}
      alt={alt}
      width={width || 400}
      height={height || 400}
      className={className}
      priority={priority}
      style={{ ...style, objectFit: 'cover' }}
      onError={handleError}
      unoptimized={shouldUnoptimized}
    />
  )
}
