const benefits = [
  {
    title: 'Envío rápido',
    desc: 'Entregas en 24-48 horas a todo Lima y Perú',
    icon: 'shipping',
  },
  {
    title: 'Productos originales',
    desc: '100% garantizados, importados directo',
    icon: 'shield',
  },
  {
    title: 'Atención personalizada',
    desc: 'Te asesoramos vía WhatsApp en cada compra',
    icon: 'chat',
  },
  {
    title: 'Pago seguro',
    desc: 'Transferencia, Yape, Plin y más métodos',
    icon: 'payment',
  },
  {
    title: 'Devoluciones',
    desc: 'Satisfacción garantizada o te devolvemos',
    icon: 'return',
  },
]

function BenefitIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'shipping':
      return (
        <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
          <rect x="2" y="12" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <rect x="20" y="16" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M34 12V8h-6v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="30" r="3" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="30" cy="30" r="3" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 27v3m18-3v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case 'shield':
      return (
        <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
          <path d="M20 4L6 10v10c0 8 6 14 14 16 8-2 14-8 14-16V10L20 4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M14 20l4 4 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'chat':
      return (
        <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
          <path d="M4 6h32v20H12l-8 6V6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <line x1="12" y1="13" x2="28" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="12" y1="18" x2="24" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case 'payment':
      return (
        <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
          <rect x="2" y="8" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="1.8" />
          <line x1="2" y1="16" x2="38" y2="16" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="28" cy="24" r="3" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8 22h6m-6 4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case 'return':
      return (
        <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
          <path d="M8 16l-4 4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 20h22c4 0 8 3 8 8v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M32 16l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M34 20h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
  }
}

export default function BenefitsGrid() {
  return (
    <section className="benefits-section">
      <div className="section-container">
        <span className="benefits-eyebrow">Confianza</span>
        <h2 className="benefits-title">¿Por qué elegirnos?</h2>
        <div className="benefits-grid">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="benefit-card">
              <div className="benefit-card-icon">
                <BenefitIcon icon={benefit.icon} />
              </div>
              <h3 className="benefit-card-title">{benefit.title}</h3>
              <p className="benefit-card-desc">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
