import { useDeferredValue, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductFilters } from '@/components/product/ProductFilters'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingState } from '@/components/ui/LoadingState'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { useStorefrontData } from '@/hooks/useStorefrontData'

export function CatalogPage() {
  const { categories, products, loading } = useStorefrontData()
  const [searchValue, setSearchValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const deferredSearch = useDeferredValue(searchValue)

  if (loading) {
    return <LoadingState label="Cargando catalogo..." />
  }

  const normalizedSearch = deferredSearch.trim().toLowerCase()
  const visibleProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category?.slug === selectedCategory
    const matchesSearch =
      normalizedSearch.length === 0 ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.description?.toLowerCase().includes(normalizedSearch)

    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-8">
      <section className="surface-panel p-6 sm:p-8 lg:p-10">
        <SectionTitle
          eyebrow="Catalogo"
          title="Encontra tu proximo par"
          description="Filtra por categoria, revisa disponibilidad y hace tu pedido por WhatsApp."
          tone="light"
        />
      </section>

      <ProductFilters
        categories={categories}
        searchValue={searchValue}
        selectedCategory={selectedCategory}
        resultCount={visibleProducts.length}
        onSearchChange={setSearchValue}
        onCategoryChange={setSelectedCategory}
      />

      {visibleProducts.length === 0 ? (
        <EmptyState
          title="No encontramos productos con ese filtro"
          description="Proba limpiar la busqueda o cambiar de categoria para volver al catalogo completo."
          action={
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setSearchValue('')
                setSelectedCategory('all')
              }}
            >
              Limpiar filtros
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-2 text-sm text-white/62 sm:flex-row sm:items-center">
        <p>Consulta disponibilidad y coordina el pago por WhatsApp.</p>
        <Link to="/carrito" className="font-medium text-brand-strong">
          Ver carrito
        </Link>
      </div>
    </div>
  )
}
