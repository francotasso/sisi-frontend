'use client'

import { useState } from 'react'
import { ProductFAQ } from '@/features/catalog/domain/types'

interface FaqAccordionProps {
  faqs: ProductFAQ[]
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!faqs || faqs.length === 0) return null

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="faq-section">
      <h3 className="faq-title">Preguntas Frecuentes</h3>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${openIndex === index ? 'open' : ''}`}
          >
            <button
              className={`faq-question ${openIndex === index ? 'open' : ''}`}
              onClick={() => toggle(index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span>{faq.question}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            {openIndex === index && (
              <div className="faq-answer" id={`faq-answer-${index}`}>{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
