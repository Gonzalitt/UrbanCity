import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react'
import {
  demoCategories,
  demoProductImages,
  demoProducts,
  demoStoreSettings,
} from '@/data/demoStorefront'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import type {
  CategoryRow,
  ProductImageRow,
  ProductRow,
  StoreSettingsRow,
} from '@/types/database'
import type { StorefrontProduct } from '@/types/store'

interface StorefrontContextValue {
  categories: CategoryRow[]
  products: StorefrontProduct[]
  storeSettings: StoreSettingsRow
  source: 'demo' | 'supabase'
  loading: boolean
  error: string | null
}

const StorefrontContext = createContext<StorefrontContextValue | null>(null)

function hydrateProducts(
  products: ProductRow[],
  categories: CategoryRow[],
  images: ProductImageRow[],
) {
  return products.map<StorefrontProduct>((product) => {
    const productImages = images.filter((image) => image.product_id === product.id)

    return {
      ...product,
      category: categories.find((category) => category.id === product.category_id) ?? null,
      images: productImages,
      primaryImage: productImages[0] ?? null,
    }
  })
}

export function StorefrontDataProvider({ children }: PropsWithChildren) {
  const [value, setValue] = useState<StorefrontContextValue>({
    categories: [],
    products: [],
    storeSettings: demoStoreSettings,
    source: 'demo',
    loading: true,
    error: null,
  })

  useEffect(() => {
    let ignore = false

    async function loadStorefront() {
      if (!isSupabaseConfigured || !supabase) {
        if (!ignore) {
          setValue({
            categories: demoCategories,
            products: hydrateProducts(
              demoProducts,
              demoCategories,
              demoProductImages,
            ),
            storeSettings: demoStoreSettings,
            source: 'demo',
            loading: false,
            error: null,
          })
        }

        return
      }

      const [categoriesResult, productsResult, imagesResult, settingsResult] =
        await Promise.all([
          supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('name', { ascending: true }),
          supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .neq('availability', 'hidden')
            .order('featured', { ascending: false })
            .order('created_at', { ascending: false }),
          supabase
            .from('product_images')
            .select('*')
            .order('sort_order', { ascending: true }),
          supabase.from('store_settings').select('*').limit(1).maybeSingle(),
        ])

      if (ignore) {
        return
      }

      const error =
        categoriesResult.error ??
        productsResult.error ??
        imagesResult.error ??
        settingsResult.error

      if (error) {
        setValue({
          categories: [],
          products: [],
          storeSettings: demoStoreSettings,
          source: 'supabase',
          loading: false,
          error:
            'No se pudieron cargar los datos del storefront. Revisá la configuracion de Supabase y las politicas RLS.',
        })
        return
      }

      const categories = categoriesResult.data ?? []
      const products = productsResult.data ?? []
      const images = imagesResult.data ?? []
      const storeSettings = settingsResult.data ?? demoStoreSettings

      setValue({
        categories,
        products: hydrateProducts(products, categories, images),
        storeSettings,
        source: 'supabase',
        loading: false,
        error: null,
      })
    }

    loadStorefront()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <StorefrontContext.Provider value={value}>
      {children}
    </StorefrontContext.Provider>
  )
}

export function useStorefrontData() {
  const context = useContext(StorefrontContext)

  if (!context) {
    throw new Error('useStorefrontData debe usarse dentro de StorefrontDataProvider.')
  }

  return context
}
