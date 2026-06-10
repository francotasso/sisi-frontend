import type { Metadata, Viewport } from 'next'
import { Sora, DM_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/shared/components/Providers'
import AppHeader from '@/shared/components/AppHeader'
import ScrollToTop from '@/shared/components/ScrollToTop'
import Footer from '@/shared/components/Footer'
import WhatsAppFloat from '@/shared/components/WhatsAppFloat'
import storeInfo from '@/data/store-info.json'
import { BASE_URL } from '@/shared/utils/constants'

const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#475569',
}

export const metadata: Metadata = {
  title: {
    default: 'Sisi - Productos importados en tendencia',
    template: '%s - Sisi',
  },
  description: 'Sisi — Productos importados en tendencia. Belleza, tecnología, hogar, infantil y más. Encuentra lo último en productos cuidadosamente seleccionados para ti.',
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Sisi - Productos importados en tendencia',
    description: 'Sisi — Productos importados en tendencia. Belleza, tecnología, hogar, infantil y más.',
    url: '/',
    siteName: 'Sisi',
    locale: 'es_PE',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: storeInfo.storeName,
  description: storeInfo.description,
  url: BASE_URL,
  telephone: storeInfo.contact.phone,
  email: storeInfo.contact.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Av. Larco 1234',
    addressLocality: 'Miraflores',
    addressRegion: 'Lima',
    addressCountry: 'PE',
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '09:00', closes: '20:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Tuesday', opens: '09:00', closes: '20:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Wednesday', opens: '09:00', closes: '20:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '09:00', closes: '20:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '09:00', closes: '20:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '10:00', closes: '18:00' },
  ],
  sameAs: [
    storeInfo.socialMedia.facebook.url,
    storeInfo.socialMedia.instagram.url,
    storeInfo.socialMedia.tiktok.url,
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${sora.variable} ${dmSans.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Providers>
          <AppHeader />
          <main>{children}</main>
          <ScrollToTop />
          <Footer />
          <WhatsAppFloat />
        </Providers>
      </body>
    </html>
  )
}
