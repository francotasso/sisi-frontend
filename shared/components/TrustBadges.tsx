interface TrustBadgesProps {
  variant?: 'footer' | 'inline'
}

const badges = [
  {
    icon: 'shield',
    label: 'Compra protegida',
    desc: 'Tus datos personales están seguros',
  },
  {
    icon: 'payment',
    label: 'Pago 100% seguro',
    desc: 'Transferencia, Yape, Plin, BCP, Interbank',
  },
  {
    icon: 'check',
    label: 'Productos originales',
    desc: 'Importados directo, garantizados',
  },
  {
    icon: 'truck',
    label: 'Envío a todo Perú',
    desc: '24-48h en Lima, 3-5 días a provincia',
  },
]

function BadgeIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'payment':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
          <rect x="1" y="4" width="22" height="16" rx="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
          <circle cx="8" cy="16" r="2" />
        </svg>
      )
    case 'check':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'truck':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
          <rect x="1" y="3" width="15" height="13" rx="2" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" strokeLinejoin="round" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      )
    default:
      return null
  }
}

export default function TrustBadges({ variant = 'footer' }: TrustBadgesProps) {
  return (
    <div className={`trust-badges trust-badges-${variant}`}>
      <h3 className="trust-badges-title">Compra con confianza</h3>
      <div className="trust-badges-grid">
        {badges.map(badge => (
          <div key={badge.icon} className="trust-badge-item">
            <div className="trust-badge-icon">
              <BadgeIcon icon={badge.icon} />
            </div>
            <div className="trust-badge-text">
              <span className="trust-badge-label">{badge.label}</span>
              <span className="trust-badge-desc">{badge.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
