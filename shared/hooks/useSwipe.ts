import { useEffect, useRef, type RefObject } from 'react'

const SWIPE_THRESHOLD = 40

export function useSwipe(
  ref: RefObject<HTMLDivElement | null>,
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
) {
  const leftRef = useRef(onSwipeLeft)
  const rightRef = useRef(onSwipeRight)
  leftRef.current = onSwipeLeft
  rightRef.current = onSwipeRight

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let startX = 0
    let startY = 0

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      const dx = endX - startX
      const dy = endY - startY

      if (Math.abs(dx) < SWIPE_THRESHOLD) return
      if (Math.abs(dy) > Math.abs(dx)) return

      if (dx > 0) rightRef.current()
      else leftRef.current()
    }

    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [ref])
}
