'use client'

import { ProductSpecs as ProductSpecsType } from '@/features/catalog/domain/types'

interface ProductSpecsProps {
  specs: ProductSpecsType
}

export default function ProductSpecs({ specs }: ProductSpecsProps) {
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
      <h2 className="specs-title">Detalles del Producto</h2>
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
  )
}
