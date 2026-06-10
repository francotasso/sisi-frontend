export default function ProductCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img" />
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-line-sm" />
        <div className="skeleton-line skeleton-line-md" />
        <div className="skeleton-line skeleton-line-lg" />
        <div className="skeleton-price-row">
          <div className="skeleton-price" />
          <div className="skeleton-heart" />
        </div>
      </div>
    </div>
  )
}
