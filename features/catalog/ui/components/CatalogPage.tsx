'use client'

import { useState, useEffect, useMemo, useCallback, useRef, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import type { CategoryOption } from '../../hooks/useCatalog'
import ProductList from './ProductList'
import CategoryChips from './CategoryChips'
import CategoryChipsSkeleton from './CategoryChipsSkeleton'
import RecentlyViewed from './RecentlyViewed'
import { Product, SortOption } from '../../domain/types'
import { PRODUCTS_PER_PAGE } from '@/shared/utils/constants'
import { catalogService } from '../../services/catalogService'

type CatalogPageProps = {
  initialProducts: Product[]
  initialTotal: number
  currentPage: number
  initialSort: SortOption
  initialCategory: string
  initialSearch: string
  serverCategories: CategoryOption[]
  initialNovedades?: boolean
}

export default function CatalogPage({
  initialProducts,
  initialTotal,
  currentPage: initialPage,
  initialSort,
  initialCategory,
  initialSearch,
  serverCategories,
  initialNovedades = false,
}: CatalogPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const [products, setProducts] = useState(initialProducts)
  const [total, setTotal] = useState(initialTotal)
  const [sort, setSort] = useState<SortOption>(initialSort)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [showNovedades, setShowNovedades] = useState(initialNovedades)
  const [loading, setLoading] = useState(initialProducts.length === 0)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState(serverCategories)
  const [allProductsCache, setAllProductsCache] = useState<Product[] | null>(null)

  const catalogRef = useRef<HTMLDivElement>(null)

  // Fetch all products when novedades mode is on
  useEffect(() => {
    if (!showNovedades) return

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
  }, [showNovedades, allProductsCache, sort])

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

  const newCount = useMemo(() => {
    return (allProductsCache ?? products).filter(p => catalogService.isNewProduct(p)).length
  }, [allProductsCache, products])

  const displayedProducts = useMemo(() => {
    if (!showNovedades || !allProductsCache) return products

    let filtered = allProductsCache
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
  }, [products, showNovedades, allProductsCache, sort, selectedCategory])

  const totalPages = showNovedades && allProductsCache
    ? Math.ceil(displayedProducts.length / PRODUCTS_PER_PAGE)
    : Math.ceil(total / PRODUCTS_PER_PAGE)

  const paginatedProducts = showNovedades && allProductsCache
    ? displayedProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE)
    : products

  const handleNovedadesToggle = useCallback(() => {
    const next = !showNovedades
    setShowNovedades(next)
    if (!next) {
      setAllProductsCache(null)
    }
    setCurrentPage(1)
    setError(null)

    const params = new URLSearchParams()
    if (selectedCategory) params.set('category', selectedCategory)
    if (sort !== 'newest') params.set('sort', sort)
    if (next) params.set('novedades', 'true')
    startTransition(() => { router.push(`${pathname}?${params.toString()}`) })
  }, [showNovedades, selectedCategory, sort, pathname, router, startTransition])

  const handleCategoryChange = useCallback((category: string) => {
    if (showNovedades && allProductsCache) {
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
    startTransition(() => { router.push(`${pathname}?${params.toString()}`) })
  }, [showNovedades, allProductsCache, sort, pathname, router, startTransition])

  const handleSortChange = useCallback((newSort: SortOption) => {
    if (showNovedades && allProductsCache) {
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
    startTransition(() => { router.push(`${pathname}?${params.toString()}`) })
  }, [showNovedades, allProductsCache, selectedCategory, pathname, router, startTransition])

  const handlePageChange = useCallback((page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    if (showNovedades && allProductsCache) {
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
    startTransition(() => { router.push(`${pathname}?${params.toString()}`) })
  }, [showNovedades, allProductsCache, currentPage, totalPages, selectedCategory, sort, pathname, router, startTransition])

  const displayTotal = showNovedades && allProductsCache
    ? displayedProducts.length
    : total

  const categoryData = selectedCategory
    ? categories.find(c => c.value === selectedCategory) ?? null
    : null

  const defaultHeroImage = initialProducts[0]?.image
  const DEFAULT_HERO_GRADIENT = 'linear-gradient(135deg, #1B7A6C, #E85D45)'

  const defaultHeroDesc = useMemo(() => {
    const names = categories
      .map(c => c.label.toLowerCase())
      .filter(n => n !== 'otros')
    if (names.length === 0) return 'Los mejores productos importados seleccionados para ti'
    const last = names.pop()
    if (names.length === 0) return `Los mejores productos importados seleccionados para ti — ${last} y más`
    return `Los mejores productos importados seleccionados para ti — ${names.join(', ')} y ${last}`
  }, [categories])

  const heroBg = categoryData?.image
    ? `url(${categoryData.image})`
    : defaultHeroImage
      ? `url(${defaultHeroImage})`
      : DEFAULT_HERO_GRADIENT

  const heroLabel = categoryData?.label ?? 'Productos'
  const heroDesc = categoryData?.description ?? defaultHeroDesc

  return (
    <>
      {isPending && <div className="ssr-loading-bar" aria-hidden="true" />}
      <nav className="breadcrumb catalog-breadcrumb">
        <Link href="/" className="breadcrumb-item">Inicio</Link>
        <svg className="breadcrumb-separator" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        {categoryData ? (
          <>
            <Link href="/productos" className="breadcrumb-item">Productos</Link>
            <svg className="breadcrumb-separator" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            <span className="breadcrumb-current">{categoryData.label}</span>
          </>
        ) : (
          <span className="breadcrumb-current">Productos</span>
        )}
      </nav>

      <section className="catalog-hero has-bg" style={{ backgroundImage: heroBg }}>
        <h1 className="catalog-hero-title">{heroLabel}</h1>
        <p className="catalog-hero-desc">{heroDesc}</p>
      </section>

      <div className="catalog-controls">
        {loading && categories.length === 0
          ? <CategoryChipsSkeleton />
          : <CategoryChips
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
        }
        <button
          className={`novedades-toggle${showNovedades ? ' active' : ''}`}
          onClick={handleNovedadesToggle}
          aria-pressed={showNovedades}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16l-6.4 4.8L8 14l-6-4.8h7.6z"/>
          </svg>
          Solo novedades
          {newCount > 0 && <span className="novedades-count">{newCount}</span>}
        </button>
      </div>

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
