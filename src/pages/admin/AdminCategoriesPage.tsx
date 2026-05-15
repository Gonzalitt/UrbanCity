import { useEffect, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Layers3, Pencil, Power, RefreshCw, Tag, Tags } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { AdminMetricCard } from '@/components/admin/AdminMetricCard'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { LoadingState } from '@/components/ui/LoadingState'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Textarea } from '@/components/ui/Textarea'
import { useAdminOutletData } from '@/hooks/useAdminShellData'
import { formatCrudError, resolveSlug, toNullableText } from '@/lib/admin'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import {
  adminCategorySchema,
  type AdminCategorySchema,
} from '@/schemas/adminCategory'
import type { CategoryRow } from '@/types/database'

interface CategoryListItem extends CategoryRow {
  productCount: number
}

const defaultValues: AdminCategorySchema = {
  name: '',
  slug: '',
  description: '',
}

export function AdminCategoriesPage() {
  const { counts, loading, refresh } = useAdminOutletData()
  const [categories, setCategories] = useState<CategoryListItem[]>([])
  const [listLoading, setListLoading] = useState(isSupabaseConfigured)
  const [pageError, setPageError] = useState<string | null>(
    isSupabaseConfigured ? null : 'Configura Supabase para administrar categorias.',
  )
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<CategoryListItem | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [busyCategoryId, setBusyCategoryId] = useState<string | null>(null)
  const categoryFormRef = useRef<HTMLDivElement | null>(null)
  const categoryListRef = useRef<HTMLDivElement | null>(null)

  const form = useForm<AdminCategorySchema>({
    resolver: zodResolver(adminCategorySchema),
    defaultValues,
  })

  useEffect(() => {
    form.reset(
      editingCategory
        ? {
            name: editingCategory.name,
            slug: editingCategory.slug,
            description: editingCategory.description ?? '',
          }
        : defaultValues,
    )
  }, [editingCategory, form])

  useEffect(() => {
    if (!supabase) {
      return
    }

    const client = supabase
    let ignore = false

    async function loadCategories() {
      setListLoading(true)
      setPageError(null)

      const [categoriesResult, productsResult] = await Promise.all([
        client
          .from('categories')
          .select('*')
          .order('created_at', { ascending: false }),
        client.from('products').select('category_id'),
      ])

      if (ignore) {
        return
      }

      if (categoriesResult.error || productsResult.error) {
        setPageError('No se pudieron cargar las categorias desde Supabase.')
        setListLoading(false)
        return
      }

      const productCountMap = new Map<string, number>()

      for (const product of productsResult.data ?? []) {
        if (!product.category_id) {
          continue
        }

        productCountMap.set(
          product.category_id,
          (productCountMap.get(product.category_id) ?? 0) + 1,
        )
      }

      setCategories(
        (categoriesResult.data ?? []).map((category) => ({
          ...category,
          productCount: productCountMap.get(category.id) ?? 0,
        })),
      )
      setListLoading(false)
    }

    void loadCategories()

    return () => {
      ignore = true
    }
  }, [reloadKey])

  if (loading || listLoading) {
    return <LoadingState label="Cargando categorias..." />
  }

  function scrollToCategoryForm() {
    requestAnimationFrame(() =>
      categoryFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    )
  }

  function scrollToCategoryList() {
    requestAnimationFrame(() =>
      categoryListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    )
  }

  function startNewCategory() {
    setEditingCategory(null)
    form.reset(defaultValues)
    setSubmitError(null)
    setSubmitSuccess(null)
    scrollToCategoryForm()
  }

  async function reloadPage() {
    setReloadKey((current) => current + 1)
    refresh()
  }

  async function handleSubmit(values: AdminCategorySchema) {
    if (!supabase) {
      setSubmitError('Configura Supabase para administrar categorias.')
      return
    }

    setSubmitError(null)
    setSubmitSuccess(null)

    const payload = {
      name: values.name.trim(),
      slug: resolveSlug(values.name, values.slug),
      description: toNullableText(values.description ?? ''),
    }

    const result = editingCategory
      ? await supabase
          .from('categories')
          .update(payload)
          .eq('id', editingCategory.id)
      : await supabase.from('categories').insert({
          ...payload,
          is_active: true,
        })

    if (result.error) {
      setSubmitError(formatCrudError(result.error.message, result.error.code))
      return
    }

    setSubmitSuccess(
      editingCategory
        ? `Categoria "${values.name.trim()}" actualizada correctamente.`
        : `Categoria "${values.name.trim()}" creada correctamente.`,
    )
    setEditingCategory(null)
    form.reset(defaultValues)
    await reloadPage()
  }

  async function toggleCategory(category: CategoryListItem) {
    if (!supabase) {
      return
    }

    setBusyCategoryId(category.id)
    setSubmitError(null)
    setSubmitSuccess(null)

    const { error } = await supabase
      .from('categories')
      .update({ is_active: !category.is_active })
      .eq('id', category.id)

    setBusyCategoryId(null)

    if (error) {
      setSubmitError(formatCrudError(error.message, error.code))
      return
    }

    setSubmitSuccess(
      category.is_active
        ? `Categoria "${category.name}" desactivada.`
        : `Categoria "${category.name}" activada nuevamente.`,
    )
    await reloadPage()
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        eyebrow="Categorias"
        title="Categorias"
        description="Organiza los productos por tipo o marca."
      />

      <Card className="flex flex-wrap gap-2 border border-white/10 bg-[#111111] p-4 text-white shadow-[0_24px_56px_rgba(0,0,0,0.22)] sm:p-5">
        <Button type="button" variant="secondary" onClick={startNewCategory}>
          Nueva categoria
        </Button>
        <Button type="button" variant="outline" onClick={scrollToCategoryList}>
          Ver listado
        </Button>
        <Button type="button" variant="ghost" className="text-white/72 hover:bg-white/8 hover:text-white" onClick={() => void reloadPage()}>
          <RefreshCw className="h-4 w-4" />
          Recargar
        </Button>
      </Card>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <AdminMetricCard
          title="Total"
          value={counts.categoriesTotal}
          description="Cargadas"
          icon={Tags}
        />
        <AdminMetricCard
          title="Activas"
          value={counts.categoriesActive}
          description="Visibles"
          icon={Tag}
        />
        <AdminMetricCard
          title="Inactivas"
          value={Math.max(counts.categoriesTotal - counts.categoriesActive, 0)}
          description="A revisar"
          icon={Layers3}
        />
      </div>

      {pageError ? (
        <div className="rounded-[22px] border border-rose-500/18 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {pageError}
        </div>
      ) : null}

      {submitError ? (
        <div className="rounded-[22px] border border-rose-500/18 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {submitError}
        </div>
      ) : null}

      {submitSuccess ? (
        <div className="rounded-[22px] border border-emerald-500/18 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {submitSuccess}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <Card
          ref={categoryFormRef}
          className="space-y-4 border border-white/10 bg-[#111111] p-4 text-white shadow-[0_24px_56px_rgba(0,0,0,0.22)] sm:p-6"
        >
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-white">
              {editingCategory ? 'Editar categoria' : 'Nueva categoria'}
            </p>
            <p className="text-sm leading-6 text-white/60">
              Si dejas el slug vacio, se genera automaticamente desde el nombre.
            </p>
          </div>

          <form
            className="space-y-4 [&_label>span]:text-white [&_label>p]:text-white/54 [&_input]:border-white/10 [&_input]:bg-[#0d0d0d] [&_input]:text-white [&_input]:placeholder:text-white/32 [&_textarea]:border-white/10 [&_textarea]:bg-[#0d0d0d] [&_textarea]:text-white [&_textarea]:placeholder:text-white/32"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <Input
              label="Nombre"
              placeholder="Ej: Sneakers, Urbanas o Accesorios"
              error={form.formState.errors.name?.message}
              {...form.register('name')}
            />

            <Input
              label="Slug"
              placeholder="sneakers"
              hint="Si queda vacio, se autogenera."
              error={form.formState.errors.slug?.message}
              {...form.register('slug')}
            />

            <Textarea
              label="Descripcion"
              placeholder="Breve referencia interna u orientativa."
              error={form.formState.errors.description?.message}
              {...form.register('description')}
            />

            <div className="flex flex-wrap gap-2.5">
              <Button
                type="submit"
                variant="secondary"
                disabled={form.formState.isSubmitting}
              >
                {editingCategory ? 'Guardar cambios' : 'Crear categoria'}
              </Button>

              {editingCategory ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-white/72 hover:bg-white/8 hover:text-white"
                  onClick={startNewCategory}
                >
                  Cancelar edicion
                </Button>
              ) : null}
            </div>
          </form>
        </Card>

        <Card
          ref={categoryListRef}
          className="space-y-4 border border-white/10 bg-[#111111] p-4 text-white shadow-[0_24px_56px_rgba(0,0,0,0.22)] sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-white">Listado</p>
              <p className="text-sm text-white/58">
                {categories.length} categoria{categories.length === 1 ? '' : 's'} cargadas.
              </p>
            </div>

            <Button type="button" variant="outline" onClick={() => void reloadPage()}>
              <RefreshCw className="h-4 w-4" />
              Recargar
            </Button>
          </div>

          <div className="space-y-3">
            {categories.length === 0 ? (
              <div className="rounded-[22px] border border-dashed border-white/12 bg-black/20 px-4 py-6 text-sm text-white/58">
                Todavia no hay categorias cargadas.
              </div>
            ) : null}

            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-[22px] border border-white/10 bg-black/20 p-3.5 sm:p-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold tracking-[-0.03em] text-white sm:text-lg">
                        {category.name}
                      </p>
                      <StatusBadge tone={category.is_active ? 'success' : 'muted'}>
                        {category.is_active ? 'Activa' : 'Inactiva'}
                      </StatusBadge>
                      <StatusBadge tone="muted">
                        {category.productCount} producto{category.productCount === 1 ? '' : 's'}
                      </StatusBadge>
                    </div>

                    <div className="grid gap-1 text-sm text-white/58 sm:grid-cols-2">
                      <p>Slug: {category.slug}</p>
                      <p>{category.description || 'Sin descripcion.'}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/12 text-white hover:border-white/20 hover:bg-white/8"
                      onClick={() => {
                        setEditingCategory(category)
                        setSubmitError(null)
                        setSubmitSuccess(null)
                        scrollToCategoryForm()
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="text-white/72 hover:bg-white/8 hover:text-white"
                      onClick={() => void toggleCategory(category)}
                      disabled={busyCategoryId === category.id}
                    >
                      <Power className="h-4 w-4" />
                      {category.is_active ? 'Desactivar' : 'Activar'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
