'use client'

import { useState } from 'react'
import SafeImage from '@/shared/components/SafeImage'
import { getOptimizedImageUrl } from '@/shared/utils/cloudinary'

interface ImageGalleryProps {
  images: string[]
  alt: string
  fallbackText: string
}

export default function ImageGallery({ images, alt, fallbackText }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (images.length === 0) return null

  const currentImage = getOptimizedImageUrl(images[selectedIndex] || images[0], 800)

  return (
    <>
      <div className="product-detail-image">
        <SafeImage
          src={currentImage}
          alt={alt}
          fallbackText={fallbackText}
          fill
          className="product-image-zoom"
          sizes="(max-width: 768px) 100vw, 450px"
        />
      </div>
      {images.length > 1 && (
        <div className="gallery-thumbnails">
          {images.map((img, index) => (
            <button
              key={index}
              className={`gallery-thumb ${selectedIndex === index ? 'active' : ''}`}
              onClick={() => setSelectedIndex(index)}
              aria-label={`Ver imagen ${index + 1} de ${images.length}`}
            >
              <SafeImage
                src={getOptimizedImageUrl(img, 128)}
                alt={`${alt} - imagen ${index + 1}`}
                className="gallery-thumb-image"
                width={80}
                height={80}
              />
            </button>
          ))}
        </div>
      )}
    </>
  )
}
