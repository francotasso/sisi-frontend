import type { Metadata } from 'next'
import { WHATSAPP_NUMBER } from '@/shared/utils/constants'
import storeInfoData from '@/data/store-info.json'

function formatWhatsAppDisplay(num: string): string {
  const digits = num.replace(/\D/g, '')
  if (digits.length >= 11) {
    return `+${digits[0]} ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
  }
  return `+${digits.slice(0, 2)} ${digits.slice(2)}`
}

export const metadata: Metadata = {
  title: 'Contacto - Sisi',
  description: 'Contáctanos vía WhatsApp, teléfono o email. Conoce nuestros horarios y ubicación.',
  alternates: { canonical: '/contacto' },
}

const { hours, contact } = storeInfoData

export default function ContactoPage() {
  return (
    <div className="contacto-page">
      <h1 className="contacto-title">Contacto</h1>

      <div className="contacto-grid">
        <div className="contacto-card">
          <div className="contacto-card-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <h2>Horario</h2>
          </div>
          <div className="contacto-schedule-grid">
            {Object.entries(hours).map(([key, day]) => (
              <div key={key} className={`contacto-schedule-row ${!day.isOpen ? 'closed' : ''}`}>
                <span className="contacto-day">{day.day}</span>
                {day.isOpen ? (
                  <span className="contacto-hours">{day.hours}</span>
                ) : (
                  <span className="contacto-closed-badge">Cerrado</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="contacto-card">
          <div className="contacto-card-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <h2>Ubicación</h2>
          </div>
          <p className="contacto-address">{contact.address}</p>
          <a className="contacto-map-link" href={contact.addressMap} target="_blank" rel="noopener noreferrer">
            Ver en Google Maps
          </a>
        </div>

        <div className="contacto-card">
          <div className="contacto-card-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <h2>Contacto</h2>
          </div>
          <div className="contacto-list">
            <a className="contacto-item" href={`tel:${contact.phone}`}>
              <span className="contacto-label">Teléfono</span>
              <span>{contact.phone}</span>
            </a>
            <a className="contacto-item" href={`mailto:${contact.email}`}>
              <span className="contacto-label">Email</span>
              <span>{contact.email}</span>
            </a>
            <a className="contacto-item whatsapp" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
              <span className="contacto-label">WhatsApp</span>
              <span>{formatWhatsAppDisplay(WHATSAPP_NUMBER)}</span>
            </a>
          </div>
        </div>

        <div className="contacto-card">
          <div className="contacto-card-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            <h2>Redes Sociales</h2>
          </div>
          <div className="contacto-social">
            {Object.entries(storeInfoData.socialMedia).map(([key, social]) => (
              <a key={key} href={key === 'whatsapp' ? `https://wa.me/${WHATSAPP_NUMBER}` : social.url} target="_blank" className={`contacto-social-btn ${key}`} rel="noopener noreferrer">
                {social.handle}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
