'use client'

interface ShadeSelectorProps {
  shade: string
}

const shadeColors: Record<string, string> = {
  'rose': '#E8A0B4',
  'rosado': '#E8A0B4',
  'pink': '#E8A0B4',
  'rosa': '#E8A0B4',
  'red': '#D42A2A',
  'rojo': '#D42A2A',
  'nude': '#D4B896',
  'beige': '#D4B896',
  'coral': '#E85D45',
  'berry': '#9C1B4B',
  'wine': '#722F37',
  'vino': '#722F37',
  'brown': '#8B5E3C',
  'marron': '#8B5E3C',
  'copper': '#C27A3E',
  'cobre': '#C27A3E',
  'gold': '#C9A84C',
  'dorado': '#C9A84C',
  'silver': '#A8A8A8',
  'plateado': '#A8A8A8',
  'clear': '#F5E6D0',
  'transparente': '#F5E6D0',
  'purple': '#8B5CF6',
  'morado': '#8B5CF6',
  'lila': '#C9A8E8',
  'peach': '#FAD1B0',
  'durazno': '#FAD1B0',
  'terracota': '#D4825A',
}

function getColorFromShade(shade: string): string {
  const key = Object.keys(shadeColors).find(k => shade.toLowerCase().includes(k))
  return key ? shadeColors[key] : '#D4B896'
}

function getContrastText(bg: string): string {
  const hex = bg.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.55 ? '#1a1a1a' : '#ffffff'
}

export default function ShadeSelector({ shade }: ShadeSelectorProps) {
  const bgColor = getColorFromShade(shade)
  const textColor = getContrastText(bgColor)

  return (
    <div className="shade-selector">
      <span className="shade-selector-label">Tonalidad:</span>
      <span
        className="shade-swatch"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {shade}
      </span>
    </div>
  )
}
