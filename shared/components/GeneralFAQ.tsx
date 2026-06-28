'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: '¿Cómo hago un pedido?',
    answer: 'Elige tus productos favoritos y agrégalos a tu lista de deseos. Luego, haz clic en "Pedir todo por WhatsApp" para enviarnos tu pedido. También puedes contactarnos directamente al WhatsApp para recibir asesoría personalizada.',
  },
  {
    question: '¿Cuáles son los métodos de pago?',
    answer: 'Aceptamos transferencias bancarias a BCP e Interbank, así como pagos por Yape y Plin. Te enviaremos los datos de la cuenta al confirmar tu pedido por WhatsApp.',
  },
  {
    question: '¿Cuánto tiempo tardan los envíos?',
    answer: 'En Lima Metropolitana, los envíos se realizan en 24 a 48 horas hábiles. Para provincia, el tiempo de entrega es de 3 a 5 días hábiles, dependiendo de la ubicación.',
  },
  {
    question: '¿Cuál es el costo de envío?',
    answer: 'El costo de envío varía según tu ubicación. Contáctanos por WhatsApp para darte un precio exacto. Para compras mayores a S/ 150, el envío es gratuito dentro de Lima Metropolitana.',
  },
  {
    question: '¿Puedo hacer cambios o devoluciones?',
    answer: 'Sí, aceptamos cambios dentro de los 7 días posteriores a la recepción del producto, siempre que esté en su empaque original y sin uso. Los productos tienen garantía de 30 días contra defectos de fabricación.',
  },
  {
    question: '¿Cómo sé si un producto está disponible?',
    answer: 'Cada producto muestra su disponibilidad en la página de detalle. Si ves "En stock", puedes pedirlo directamente. Si ves "Agotado", ese producto no está disponible temporalmente.',
  },
  {
    question: '¿Los productos son originales?',
    answer: 'Sí, todos nuestros productos son importados directamente y 100% originales. Trabajamos con proveedores verificados para garantizar la calidad de cada artículo.',
  },
  {
    question: '¿Puedo comprar al por mayor?',
    answer: 'Sí, ofrecemos precios especiales para compras al por mayor. Contáctanos por WhatsApp con los productos y cantidades que deseas y te haremos una cotización personalizada.',
  },
]

export default function GeneralFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="general-faq">
      <h2 className="general-faq-title">Preguntas Frecuentes</h2>
      <div className="general-faq-list">
        {faqItems.map((faq, index) => (
          <div key={index} className={`general-faq-item ${openIndex === index ? 'open' : ''}`}>
            <button
              className={`general-faq-question ${openIndex === index ? 'open' : ''}`}
              onClick={() => toggle(index)}
              aria-expanded={openIndex === index}
              aria-controls={`general-faq-answer-${index}`}
            >
              <span>{faq.question}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" width="16" height="16">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            {openIndex === index && (
              <div className="general-faq-answer" id={`general-faq-answer-${index}`}>{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
