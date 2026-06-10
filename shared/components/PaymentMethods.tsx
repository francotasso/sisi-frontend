'use client'

import { useState, useCallback } from 'react'

interface PaymentMethodsProps {
  compact?: boolean
}

const accounts = [
  { id: 'bcp', bank: 'BCP', logo: '/images/payment/bcp.svg', width: 45, number: '194-12345678-0-00' },
  { id: 'interbank', bank: 'Interbank', logo: '/images/payment/interbank.svg', width: 70, number: '123-4567890123' },
]

export default function PaymentMethods({ compact }: PaymentMethodsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = useCallback(async (id: string, number: string) => {
    try {
      await navigator.clipboard.writeText(number)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // fallback para navegadores sin clipboard API
      const textarea = document.createElement('textarea')
      textarea.value = number
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }, [])

  return (
    <div className="payment-methods">
      {!compact && <p className="payment-methods-title">Medios de pago</p>}
      <div className="payment-methods-row">
        <span className="payment-method-item">
          <img src="/images/payment/yape.svg" alt="Yape" width="20" height="20" className="payment-method-icon" />
          Yape
        </span>
        <span className="payment-method-item">
          <img src="/images/payment/plin.svg" alt="Plin" width="20" height="20" className="payment-method-icon" />
          Plin
        </span>
        <span className="payment-method-item">
          <img src="/images/payment/bcp.svg" alt="BCP" width="45" height="20" className="payment-method-icon" />

        </span>
        <span className="payment-method-item">
          <img src="/images/payment/interbank.svg" alt="Interbank" width="70" height="20" className="payment-method-icon" />

        </span>
      </div>
      <p className="payment-methods-note">
        Paga con Yape, Plin o transferencia bancaria directa a BCP e Interbank
      </p>

      <div className="payment-accounts">
        {accounts.map(acc => (
          <div key={acc.id} className={`payment-account-row ${copiedId === acc.id ? 'copied' : ''}`}>
            <div className="payment-account-info">
              <img src={acc.logo} alt={acc.bank} width={acc.width} height="20" className="payment-account-logo" />
              <span className="payment-account-number">{acc.number}</span>
              <span className="payment-account-holder">Titular: Franco Tasso</span>
            </div>
            <button
              className={`copy-btn ${copiedId === acc.id ? 'copied' : ''}`}
              onClick={() => handleCopy(acc.id, acc.number)}
              aria-label={copiedId === acc.id ? 'Copiado' : `Copiar número de ${acc.bank}`}
            >
              {copiedId === acc.id ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
