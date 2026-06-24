'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { CategoryOption } from '../../hooks/useCatalog'
import ProductList from './ProductList'
import CategoryChips from './CategoryChips'
import CategoryChipsSkeleton from './CategoryChipsSkeleton'
import RecentlyViewed from './RecentlyViewed'
import { Product, SortOption } from '../../domain/types'
import { PRODUCTS_PER_PAGE } from '@/shared/utils/constants'
import { catalogService } from '../../services/catalogService'

type TabType = 'todos' | 'novedades'

type CatalogPageProps = {
  initialProducts: Product[]
  initialTotal: number
  currentPage: number
  initialSort: SortOption
  initialCategory: string
  initialSearch: string
  serverCategories: CategoryOption[]
}

export default function CatalogPage({
  initialProducts,
  initialTotal,
  currentPage: initialPage,
  initialSort,
  initialCategory,
  initialSearch,
  serverCategories,
}: CatalogPageProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [products, setProducts] = useState(initialProducts)
  const [total, setTotal] = useState(initialTotal)
  const [sort, setSort] = useState<SortOption>(initialSort)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [activeTab, setActiveTab] = useState<TabType>('todos')
  const [loading, setLoading] = useState(initialProducts.length === 0)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState(serverCategories)
  const [allProductsCache, setAllProductsCache] = useState<Product[] | null>(null)

  const catalogRef = useRef<HTMLDivElement>(null)

  // Fetch initial data on mount (no server-side data fetching)
  useEffect(() => {
    if (products.length > 0) return

    let cancelled = false
    const doFetch = async () => {
      setLoading(true)
      setError(null)
      try {
        const filter = selectedCategory ? { category: selectedCategory } : initialSearch ? { search: initialSearch } : undefined
        const [result, cats] = await Promise.all([
          catalogService.getProductsPaginated(filter, sort, currentPage),
          catalogService.getCategories(),
        ])
        if (!cancelled) {
          setProducts(result.products)
          setTotal(result.total)
          setCategories(cats)
        }
      } catch {
        if (!cancelled) setError('Error al cargar los productos')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    doFetch()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch all products when entering "novedades" tab
  useEffect(() => {
    if (activeTab !== 'novedades') return

    setSelectedCategory('')
    setCurrentPage(1)

    if (allProductsCache) {
      setProducts(allProductsCache)
      setTotal(allProductsCache.length)
      return
    }

    let cancelled = false
    const doFetch = async () => {
      setLoading(true)
      setError(null)
      try {
        const all = await catalogService.getAllProducts(undefined, sort)
        if (!cancelled) {
          setAllProductsCache(all)
          setProducts(all)
          setTotal(all.length)
        }
      } catch {
        if (!cancelled) setError('Error al cargar los productos')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    doFetch()
    return () => { cancelled = true }
  }, [activeTab, allProductsCache, sort])

  const newCount = useMemo(() => {
    return products.filter(p => catalogService.isNewProduct(p)).length
  }, [products])

  const displayedProducts = useMemo(() => {
    if (activeTab === 'todos') {
      return products
    }

    let filtered = products
    if (selectedCategory) {
      filtered = filtered.filter(p => (p.categorySlug ?? p.category) === selectedCategory)
    }
    filtered = filtered.filter(p => catalogService.isNewProduct(p))
    const sorted = [...filtered]
    switch (sort) {
      case 'price-low':
        sorted.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price))
        break
      case 'price-high':
        sorted.sort((a, b) => (b.discountPrice ?? a.price) - (a.discountPrice ?? a.price))
        break
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
    }
    return sorted
  }, [products, activeTab, sort, selectedCategory])

  const totalPages = activeTab === 'novedades'
    ? Math.ceil(displayedProducts.length / PRODUCTS_PER_PAGE)
    : Math.ceil(total / PRODUCTS_PER_PAGE)

  const paginatedProducts = activeTab === 'novedades'
    ? displayedProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE)
    : products

  const handleCategoryChange = useCallback((category: string) => {
    if (activeTab === 'novedades') {
      setSelectedCategory(category)
      setCurrentPage(1)
      return
    }
    setSelectedCategory(category)
    setCurrentPage(1)
    setLoading(true)
    setError(null)

    const filter = category ? { category } : undefined
    catalogService.getProductsPaginated(filter, sort, 1)
      .then(result => {
        setProducts(result.products)
        setTotal(result.total)
      })
      .catch(() => setError('Error al cargar los productos'))
      .finally(() => setLoading(false))

    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (sort !== 'newest') params.set('sort', sort)
    router.push(`${pathname}?${params.toString()}`)
  }, [activeTab, sort, pathname, router])

  const handleSortChange = useCallback((newSort: SortOption) => {
    if (activeTab === 'novedades') {
      setSort(newSort)
      setCurrentPage(1)
      return
    }
    setSort(newSort)
    setCurrentPage(1)
    setLoading(true)
    setError(null)

    const filter = selectedCategory ? { category: selectedCategory } : undefined
    catalogService.getProductsPaginated(filter, newSort, 1)
      .then(result => {
        setProducts(result.products)
        setTotal(result.total)
      })
      .catch(() => setError('Error al cargar los productos'))
      .finally(() => setLoading(false))

    const params = new URLSearchParams()
    if (selectedCategory) params.set('category', selectedCategory)
    if (newSort !== 'newest') params.set('sort', newSort)
    router.push(`${pathname}?${params.toString()}`)
  }, [activeTab, selectedCategory, pathname, router])

  const handlePageChange = useCallback((page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    if (activeTab === 'novedades') {
      setCurrentPage(page)
      catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    setCurrentPage(page)
    setLoading(true)
    setError(null)

    const filter = selectedCategory ? { category: selectedCategory } : undefined
    catalogService.getProductsPaginated(filter, sort, page)
      .then(result => {
        setProducts(result.products)
        setTotal(result.total)
      })
      .catch(() => setError('Error al cargar los productos'))
      .finally(() => setLoading(false))

    const params = new URLSearchParams()
    if (selectedCategory) params.set('category', selectedCategory)
    if (sort !== 'newest') params.set('sort', sort)
    if (page > 1) params.set('page', String(page))
    router.push(`${pathname}?${params.toString()}`)
  }, [activeTab, currentPage, totalPages, selectedCategory, sort, pathname, router])

  const handleTabChange = useCallback((tab: TabType) => {
    if (tab === activeTab) return
    if (tab === 'todos') {
      setAllProductsCache(null)
    }
    setActiveTab(tab)
    setCurrentPage(1)
    setError(null)
  }, [activeTab])

  const displayTotal = activeTab === 'novedades' ? displayedProducts.length : total

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
          Todos ({total > 0 ? total : '...'})
        </button>
        <button
          className={`tab-item ${activeTab === 'novedades' ? 'active' : ''}`}
          onClick={() => handleTabChange('novedades')}
        >
          Novedades ({newCount})
        </button>
      </div>

      {loading && categories.length === 0
        ? <CategoryChipsSkeleton />
        : <CategoryChips
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
      }

      <div className="catalog-layout">
        <div ref={catalogRef} className="catalog-main">
          <ProductList
            products={paginatedProducts}
            loading={loading}
            error={error}
            sort={sort}
            onSortChange={handleSortChange}
            currentPage={currentPage}
            totalPages={totalPages}
            totalProducts={displayTotal}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <RecentlyViewed />
    </>
  )
}
