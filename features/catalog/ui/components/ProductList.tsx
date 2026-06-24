'use client'

import { Product, SortOption } from '../../domain/types'
import ProductCard from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'
import { PRODUCTS_PER_PAGE } from '@/shared/utils/constants'

interface ProductListProps {
  products: Product[]
  loading?: boolean
  error?: string | null
  sort?: SortOption
  onSortChange?: (sort: SortOption) => void
  currentPage?: number
  totalPages?: number
  totalProducts?: number
  onPageChange?: (page: number) => void
}

export default function ProductList({ 
  products, 
  loading,
  error,
  sort, 
  onSortChange,
  currentPage = 1,
  totalPages = 1,
  totalProducts = 0,
  onPageChange
}: ProductListProps) {
  if (error) {
    return (
      <div className="empty-state" style={{ padding: '3rem 1rem' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)', opacity: 0.6 }}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h3>Error al cargar productos</h3>
        <p>{error}</p>
      </div>
    )
  }

  if (!loading && products.length === 0) {
    return (
      <div className="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
        <h3>No se encontraron productos</h3>
        <p>Intenta con otros filtros o términos de búsqueda</p>
      </div>
    )
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className="products-wrapper">
      {sort && onSortChange && (
        <div className="sort-bar">
          <span className="results-count">{totalProducts} productos</span>
          <div className="sort-select">
            <label>Ordenar por:</label>
            <select 
              value={sort} 
              onChange={(e) => onSortChange(e.target.value as SortOption)}
            >
              <option value="newest">Más recientes</option>
              <option value="price-low">Precio: menor a mayor</option>
              <option value="price-high">Precio: mayor a menor</option>
              <option value="name">Nombre: A-Z</option>
            </select>
          </div>
        </div>
      )}
      <div className="product-grid">
        {loading
          ? Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))
        }
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn"
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Anterior
          </button>
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <button
                key={index}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => onPageChange?.(page)}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="pagination-ellipsis">...</span>
            )
          ))}
          <button 
            className="pagination-btn"
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}