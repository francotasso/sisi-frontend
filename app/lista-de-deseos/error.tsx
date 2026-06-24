'use client'

export default function WishlistError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="empty-state" style={{ padding: '3rem 1rem' }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)', opacity: 0.6 }}>
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <h3>Error al cargar tu lista</h3>
      <p>{error.message || 'No pudimos cargar tu lista de deseos. Intenta de nuevo.'}</p>
      <button
        onClick={reset}
        className="whatsapp-btn"
        style={{ width: 'auto', padding: '10px 24px', marginTop: '1rem' }}
      >
        Intentar de nuevo
      </button>
    </div>
  )
}
