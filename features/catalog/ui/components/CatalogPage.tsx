'use client'

import { useState, useEffect, Suspense, useMemo, useCallback, useRef } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCatalog, type CategoryOption } from '../../hooks/useCatalog'
import ProductList from './ProductList'
import CategoryChips from './CategoryChips'
import RecentlyViewed from './RecentlyViewed'
import { SortOption } from '../../domain/types'
import { PRODUCTS_PER_PAGE } from '@/shared/utils/constants'
import { catalogService } from '../../services/catalogService'

type TabType = 'todos' | 'novedades'

function resolveCategoryParam(
  param: string | null,
  categories: CategoryOption[]
): string {
  if (!param) return ''
  const cat = categories.find(c => c.value === param || c.label === param)
  return cat?.value ?? param
}

function CatalogContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const categoryParam = searchParams.get('category')
  const searchParam = searchParams.get('search')

  const { products: allProducts, loading, error, fetchProducts, categories } = useCatalog()
  const [sort, setSort] = useState<SortOption>('newest')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState<TabType>('todos')
  const lastFetchKey = useRef('')

  useEffect(() => {
    setCurrentPage(1)
    const resolved = resolveCategoryParam(categoryParam, categories)
    const fetchKey = resolved || searchParam || '__all__'

    if (fetchKey === lastFetchKey.current) return
    lastFetchKey.current = fetchKey

    if (resolved) {
      setSelectedCategory(resolved)
      fetchProducts({ category: resolved }, sort)
    } else if (searchParam) {
      setSelectedCategory('')
      fetchProducts({ search: searchParam }, sort)
    } else {
      setSelectedCategory('')
      fetchProducts(undefined, sort)
    }
  }, [categoryParam, searchParam, sort, fetchProducts, categories])

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return allProducts
    return allProducts.filter(p => (p.categorySlug ?? p.category) === selectedCategory)
  }, [allProducts, selectedCategory])

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts]
    const effectivePrice = (p: typeof filteredProducts[number]) => p.discountPrice ?? p.price
    switch (sort) {
      case 'price-low':
        return sorted.sort((a, b) => effectivePrice(a) - effectivePrice(b))
      case 'price-high':
        return sorted.sort((a, b) => effectivePrice(b) - effectivePrice(a))
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'newest':
      default:
        return sorted
    }
  }, [filteredProducts, sort])

  const { displayedProducts, newCount } = useMemo(() => {
    const novedades = sortedProducts.filter(p => catalogService.isNewProduct(p))
    return {
      displayedProducts: activeTab === 'novedades' ? novedades : sortedProducts,
      newCount: novedades.length,
    }
  }, [sortedProducts, activeTab])

  const totalPages = Math.ceil(displayedProducts.length / PRODUCTS_PER_PAGE)
  const paginatedProducts = displayedProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE)

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
    const params = new URLSearchParams(searchParams.toString())
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }, [searchParams, pathname, router])

  const handleSortChange = useCallback((newSort: SortOption) => {
    setSort(newSort)
    setCurrentPage(1)
    if (selectedCategory) {
      fetchProducts({ category: selectedCategory }, newSort)
    } else {
      fetchProducts(undefined, newSort)
    }
  }, [selectedCategory, fetchProducts])

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }, [totalPages])

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }, [])

  return (
    <>
      <section className="hero-section">
        <h1 className="hero-title">Productos en tendencia</h1>
        <p className="hero-subtitle">Los mejores productos importados seleccionados para ti — belleza, tecnología, hogar, infantil y más</p>
      </section>

      <div className="tab-bar">
        <button
          className={`tab-item ${activeTab === 'todos' ? 'active' : ''}`}
          onClick={() => handleTabChange('todos')}
        >
          Todos ({sortedProducts.length})
        </button>
        <button
          className={`tab-item ${activeTab === 'novedades' ? 'active' : ''}`}
          onClick={() => handleTabChange('novedades')}
        >
          Novedades ({newCount})
        </button>
      </div>

      <CategoryChips
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <div className="catalog-layout">
        <div className="catalog-main">
          <ProductList
            products={paginatedProducts}
            loading={loading}
            error={error}
            sort={sort}
            onSortChange={handleSortChange}
            currentPage={currentPage}
            totalPages={totalPages}
            totalProducts={displayedProducts.length}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <RecentlyViewed />
    </>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando productos...</p>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  )
}
