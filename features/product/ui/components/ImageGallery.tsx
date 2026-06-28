'use client'

import { useState, useEffect, useRef } from 'react'
import SafeImage from '@/shared/components/SafeImage'
import { getOptimizedImageUrl } from '@/shared/utils/cloudinary'

interface ImageGalleryProps {
  images: string[]
  alt: string
  fallbackText: string
}

export default function ImageGallery({ images, alt, fallbackText }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  useEffect(() => {
    if (zoomOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [zoomOpen])

  if (images.length === 0) return null

  const currentImage = getOptimizedImageUrl(images[selectedIndex] || images[0], 800)
  const zoomImage = getOptimizedImageUrl(images[selectedIndex] || images[0], 1200)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setSelectedIndex(prev => prev < images.length - 1 ? prev + 1 : 0)
      } else {
        setSelectedIndex(prev => prev > 0 ? prev - 1 : images.length - 1)
      }
    }
  }

  return (
    <>
      <div
        className="product-detail-image"
        onClick={() => setZoomOpen(true)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <SafeImage
          src={currentImage}
          alt={alt}
          fallbackText={fallbackText}
          fill
          className="product-image-zoom"
          sizes="(max-width: 768px) 100vw, 450px"
        />
        <button className="gallery-zoom-btn" aria-label="Ampliar imagen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="11" y1="8" x2="11" y2="14"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </button>
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

      {zoomOpen && (
        <div className="gallery-zoom-overlay" onClick={() => setZoomOpen(false)}>
          <div className="gallery-zoom-modal" onClick={e => e.stopPropagation()}>
            <button className="gallery-zoom-close" onClick={() => setZoomOpen(false)} aria-label="Cerrar zoom">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <SafeImage
              src={zoomImage}
              alt={alt}
              fallbackText={fallbackText}
              fill
              className="gallery-zoom-image"
              sizes="90vw"
            />
            {images.length > 1 && (
              <div className="gallery-zoom-nav">
                <button
                  className="gallery-zoom-nav-btn"
                  onClick={() => setSelectedIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                  aria-label="Imagen anterior"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </button>
                <span className="gallery-zoom-counter">{selectedIndex + 1} / {images.length}</span>
                <button
                  className="gallery-zoom-nav-btn"
                  onClick={() => setSelectedIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                  aria-label="Imagen siguiente"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
