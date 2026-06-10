'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSelector, shallowEqual } from 'react-redux'
import { RootState } from '@/shared/store'
import { WHATSAPP_NUMBER } from '@/shared/utils/constants'
import SearchDropdown from './SearchDropdown'

export default function AppHeader() {
  const pathname = usePathname()
  const wishlistCount = useSelector(
    (state: RootState) => state.wishlist.items.reduce((sum, item) => sum + item.quantity, 0),
    shallowEqual
  )
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/productos', label: 'Productos' },
    { href: '/lista-de-deseos', label: 'Favoritos' },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/contacto', label: 'Contacto' },
  ]

  return (
    <>
      <header className="main-header">
        <div className="header-content">
          <div className="header-left">
            <Link href="/" className="logo-container" aria-label="Sisi - Inicio">
              <svg className="logo-icon" viewBox="0 0 40 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 36 C10 30 12 26 14 22 C14 18 12 16 14 14 L10 4 L16 10 C18 8 20 7 22 8 L26 3 L24 10 C26 12 26 14 24 16 C26 18 24 20 22 22 C22 28 24 32 24 36 L10 36 Z"/>
              </svg>
              <span className="logo-text">Sisi</span>
            </Link>

            <nav className="desktop-nav" aria-label="Navegación principal">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} className={`desktop-nav-link${isActive(link.href) ? ' active' : ''}`}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="header-right">
            <SearchDropdown />
            <Link href="/lista-de-deseos" className="wishlist-btn" aria-label={`Lista de deseos${wishlistCount > 0 ? ` (${wishlistCount} productos)` : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishlistCount > 0 && <span className="wishlist-counter">{wishlistCount}</span>}
            </Link>
            <button
              className="hamburger-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
            >
              <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
              <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
              <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
            </button>
          </div>
        </div>

        <div className="mobile-info-row">
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" className="info-btn" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
            </svg>
            <span>WhatsApp</span>
          </a>
        </div>
      </header>

      <div className={`mobile-menu-overlay${menuOpen ? ' open' : ''}`} onClick={closeMenu} />
      <div className={`mobile-menu-drawer${menuOpen ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="Menú de navegación">
        <div className="mobile-menu-header">
          <span className="logo-text">Sisi</span>
          <button className="close-btn" onClick={closeMenu} aria-label="Cerrar menú">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <nav className="mobile-menu-nav">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className={`mobile-nav-link${isActive(link.href) ? ' active' : ''}`} onClick={closeMenu}>
              {link.label}
            </Link>
          ))}
          <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                className="mobile-nav-link whatsapp"
                rel="noopener noreferrer"
                onClick={closeMenu}
              >
            WhatsApp
          </a>
        </nav>
      </div>
    </>
  )
}
