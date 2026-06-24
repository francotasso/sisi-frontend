export function getOptimizedImageUrl(url: string, width: number): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  if (!cloudName) return url

  const match = url.match(
    new RegExp(`^(https?://res\\.cloudinary\\.com/${cloudName}/image/upload/)(.*)$`)
  )
  if (!match) return url

  const [, base, rest] = match
  return `${base}q_auto,f_auto,w_${width},c_fill/${rest}`
}
