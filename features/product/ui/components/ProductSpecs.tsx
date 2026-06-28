'use client'

import { useState } from 'react'
import { ProductSpecs as ProductSpecsType } from '@/features/catalog/domain/types'

interface ProductSpecsProps {
  specs: ProductSpecsType
}

export default function ProductSpecs({ specs }: ProductSpecsProps) {
  const [open, setOpen] = useState(false)
  const specEntries = Object.entries(specs).filter(([key]) => key !== 'brand')

  const specLabels: Record<string, string> = {
    type: 'Tipo',
    shade: 'Tonalidad',
    finish: 'Acabado',
    size: 'Tamaño',
    ingredients: 'Ingredientes clave',
    spf: 'Protección Solar',
    skinType: 'Tipo de piel',
    notes: 'Notas olfativas',
    benefits: 'Beneficios',
    includes: 'Incluye',
  }

  return (
    <div className="specs-section">
      <button
        className="specs-mobile-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <h2 className="specs-title">Detalles del Producto</h2>
        <svg
          className={`specs-chevron ${open ? 'open' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          width="20"
          height="20"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className={`specs-grid-wrapper ${open ? 'open' : ''}`}>
        <div className="specs-grid">
          {specEntries.map(([key, value]) => {
            if (!value) return null
            return (
              <div key={key} className="spec-card">
                <span className="spec-label">{specLabels[key] || key}</span>
                <span className="spec-value">{String(value)}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
