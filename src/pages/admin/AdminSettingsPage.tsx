import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AtSign,
  ExternalLink,
  MapPin,
  MessageCircle,
  Save,
  Store,
  Timer,
  TriangleAlert,
} from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { LoadingState } from '@/components/ui/LoadingState'
import { Textarea } from '@/components/ui/Textarea'
import { useAdminOutletData } from '@/hooks/useAdminShellData'
import { useStorefrontData } from '@/hooks/useStorefrontData'
import { formatCrudError, toNullableText } from '@/lib/admin'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { buildWhatsAppUrl, normalizeWhatsAppPhone } from '@/lib/whatsapp'
import {
  adminStoreSettingsSchema,
  type AdminStoreSettingsSchema,
} from '@/schemas/adminStoreSettings'
import type { StoreSettingsRow } from '@/types/database'

const defaultValues: AdminStoreSettingsSchema = {
  storeName: '',
  whatsappPhone: '',
  instagramUrl: '',
  address: '',
  openingHours: '',
  checkoutMessage: '',
}

function toFormValues(storeSettings: StoreSettingsRow | null): AdminStoreSettingsSchema {
  if (!storeSettings) {
    return defaultValues
  }

  return {
    storeName: storeSettings.store_name,
    whatsappPhone: storeSettings.whatsapp_phone,
    instagramUrl: storeSettings.instagram_url ?? '',
    address: storeSettings.address ?? '',
    openingHours: storeSettings.opening_hours ?? '',
    checkoutMessage: storeSettings.checkout_message ?? '',
  }
}

export function AdminSettingsPage() {
  const { loading, refresh, storeSettings } = useAdminOutletData()
  const { refresh: refreshStorefront } = useStorefrontData()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  const form = useForm<AdminStoreSettingsSchema>({
    resolver: zodResolver(adminStoreSettingsSchema),
    defaultValues,
  })

  useEffect(() => {
    form.reset(toFormValues(storeSettings))
  }, [form, storeSettings])

  const storeNameValue = useWatch({
    control: form.control,
    name: 'storeName',
    defaultValue: defaultValues.storeName,
  })
  const whatsappPhoneValue = useWatch({
    control: form.control,
    name: 'whatsappPhone',
    defaultValue: defaultValues.whatsappPhone,
  })
  const instagramUrlValue = useWatch({
    control: form.control,
    name: 'instagramUrl',
    defaultValue: defaultValues.instagramUrl,
  })
  const addressValue = useWatch({
    control: form.control,
    name: 'address',
    defaultValue: defaultValues.address,
  })
  const openingHoursValue = useWatch({
    control: form.control,
    name: 'openingHours',
    defaultValue: defaultValues.openingHours,
  })
  const checkoutMessageValue = useWatch({
    control: form.control,
    name: 'checkoutMessage',
    defaultValue: defaultValues.checkoutMessage,
  })

  const normalizedWhatsAppPhone = useMemo(
    () => normalizeWhatsAppPhone(whatsappPhoneValue ?? ''),
    [whatsappPhoneValue],
  )

  const previewStoreName = (storeNameValue ?? '').trim() || 'Comercio sin nombre'
  const previewWhatsAppUrl =
    !form.formState.errors.whatsappPhone && normalizedWhatsAppPhone.length >= 8
      ? buildWhatsAppUrl(
          normalizedWhatsAppPhone,
          `Hola ${previewStoreName}, quiero hacer una consulta.`,
        )
      : null
  const previewInstagramUrl = form.formState.errors.instagramUrl
    ? null
    : (instagramUrlValue ?? '').trim() || null

  if (loading) {
    return <LoadingState label="Cargando configuracion de la tienda..." />
  }

  async function handleSubmit(values: AdminStoreSettingsSchema) {
    if (!supabase || !isSupabaseConfigured) {
      setSubmitError('Configura Supabase para editar los datos de la tienda.')
      return
    }

    setSubmitError(null)
    setSubmitSuccess(null)

    const payload = {
      store_name: values.storeName.trim(),
      whatsapp_phone: normalizeWhatsAppPhone(values.whatsappPhone),
      instagram_url: toNullableText(values.instagramUrl ?? ''),
      address: toNullableText(values.address ?? ''),
      opening_hours: toNullableText(values.openingHours ?? ''),
      checkout_message: toNullableText(values.checkoutMessage ?? ''),
    }

    const existingSettingsResult = await supabase
      .from('store_settings')
      .select('id')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (existingSettingsResult.error) {
      setSubmitError(
        formatCrudError(
          existingSettingsResult.error.message,
          existingSettingsResult.error.code,
        ),
      )
      return
    }

    const currentSettingsId = existingSettingsResult.data?.id ?? null
    const result = currentSettingsId
      ? await supabase.from('store_settings').update(payload).eq('id', currentSettingsId)
      : await supabase.from('store_settings').insert(payload)

    if (result.error) {
      setSubmitError(formatCrudError(result.error.message, result.error.code))
      return
    }

    setSubmitSuccess(
      currentSettingsId
        ? 'Configuracion de la tienda actualizada correctamente.'
        : 'Configuracion de la tienda creada correctamente.',
    )
    form.reset({
      storeName: payload.store_name,
      whatsappPhone: payload.whatsapp_phone,
      instagramUrl: payload.instagram_url ?? '',
      address: payload.address ?? '',
      openingHours: payload.opening_hours ?? '',
      checkoutMessage: payload.checkout_message ?? '',
    })
    refresh()
    refreshStorefront()
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        eyebrow="Configuracion"
        title="Configuracion de la tienda"
        description="Actualiza WhatsApp, Instagram, direccion y horarios."
      />

      {!storeSettings ? (
        <div className="rounded-[22px] border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Falta cargar los datos principales de la tienda.
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

      <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <Card className="space-y-5 border border-white/10 bg-[#111111] p-4 text-white shadow-[0_24px_56px_rgba(0,0,0,0.22)] sm:p-6">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-white">
              {storeSettings ? 'Editar datos de la tienda' : 'Cargar datos de la tienda'}
            </p>
            <p className="text-sm leading-6 text-white/60">
              Estos datos se muestran en la tienda y en el pedido por WhatsApp.
            </p>
          </div>

          <form
            className="space-y-4 [&_label>span]:text-white [&_label>p]:text-white/54 [&_input]:border-white/10 [&_input]:bg-[#0d0d0d] [&_input]:text-white [&_input]:placeholder:text-white/32 [&_textarea]:border-white/10 [&_textarea]:bg-[#0d0d0d] [&_textarea]:text-white [&_textarea]:placeholder:text-white/32"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Nombre de la tienda"
                placeholder="City Calzado Urbano"
                autoComplete="organization"
                error={form.formState.errors.storeName?.message}
                {...form.register('storeName')}
              />

              <Input
                label="WhatsApp"
                placeholder="5491122334455"
                autoComplete="tel"
                hint="Se guarda solo con numeros."
                error={form.formState.errors.whatsappPhone?.message}
                {...form.register('whatsappPhone')}
              />
            </div>

            <Input
              label="Instagram"
              type="url"
              placeholder="https://instagram.com/tucomercio"
              autoComplete="url"
              error={form.formState.errors.instagramUrl?.message}
              {...form.register('instagramUrl')}
            />

            <Input
              label="Direccion"
              placeholder="Galeria Provincial, General Acha 172 Sur"
              error={form.formState.errors.address?.message}
              {...form.register('address')}
            />

            <Input
              label="Horarios"
              placeholder="Lunes a sabado de 10 a 19 hs"
              error={form.formState.errors.openingHours?.message}
              {...form.register('openingHours')}
            />

            <Textarea
              label="Mensaje de checkout"
              placeholder="Te confirmamos disponibilidad, retiro y pago por WhatsApp."
              hint={`${(checkoutMessageValue ?? '').trim().length}/300 caracteres.`}
              error={form.formState.errors.checkoutMessage?.message}
              {...form.register('checkoutMessage')}
            />

            <div className="flex flex-wrap gap-2.5">
              <Button
                type="submit"
                variant="secondary"
                disabled={form.formState.isSubmitting}
              >
                <Save className="h-4 w-4" />
                {form.formState.isSubmitting
                  ? 'Guardando...'
                  : storeSettings
                    ? 'Guardar cambios'
                    : 'Crear configuracion'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="text-white/72 hover:bg-white/8 hover:text-white"
                onClick={() => {
                  form.reset(toFormValues(storeSettings))
                  setSubmitError(null)
                  setSubmitSuccess(null)
                }}
              >
                Restablecer
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-5">
          <Card className="space-y-4 border border-white/10 bg-[#111111] p-4 text-white shadow-[0_24px_56px_rgba(0,0,0,0.22)] sm:p-6">
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-white">Vista rapida</p>
              <p className="text-sm leading-6 text-white/60">
                Sirve para revisar los datos antes de guardar.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/20 text-brand-strong">
                  <Store className="h-5 w-5" />
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.22em] text-white/40">
                  Tienda
                </p>
                <p className="mt-2 text-base font-semibold tracking-[-0.03em] text-white sm:text-lg">
                  {previewStoreName}
                </p>
              </div>

              <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/20 text-brand-strong">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.22em] text-white/40">
                  WhatsApp
                </p>
                <p className="mt-2 text-sm text-white">
                  {normalizedWhatsAppPhone || 'Sin numero valido todavia'}
                </p>
                {previewWhatsAppUrl ? (
                  <a
                    href={previewWhatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-success hover:text-emerald-700"
                  >
                    Abrir preview
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <p className="mt-3 text-sm text-white/54">Completa un numero valido.</p>
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-[20px] border border-white/10 bg-black/20 p-4 text-sm text-white/64">
                <AtSign className="mt-0.5 h-4 w-4 text-brand-strong" />
                <span>Instagram y WhatsApp se muestran en la tienda.</span>
              </div>
              <div className="flex items-start gap-3 rounded-[20px] border border-white/10 bg-black/20 p-4 text-sm text-white/64">
                <MapPin className="mt-0.5 h-4 w-4 text-brand-strong" />
                <span>Direccion y horarios aparecen en contacto.</span>
              </div>
              <div className="flex items-start gap-3 rounded-[20px] border border-white/10 bg-black/20 p-4 text-sm text-white/64">
                <Timer className="mt-0.5 h-4 w-4 text-brand-strong" />
                <span>Horarios ayudan a coordinar retiro.</span>
              </div>
              <div className="flex items-start gap-3 rounded-[20px] border border-white/10 bg-black/20 p-4 text-sm text-white/64">
                <TriangleAlert className="mt-0.5 h-4 w-4 text-brand-strong" />
                <span>El mensaje de checkout se suma al pedido.</span>
              </div>
            </div>
          </Card>

          <Card className="space-y-4 border border-white/10 bg-[#111111] p-4 text-white shadow-[0_24px_56px_rgba(0,0,0,0.22)] sm:p-6">
            <p className="text-sm font-medium text-white">Links y datos publicos</p>

            <div className="space-y-3 text-sm">
              <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                  Instagram
                </p>
                {previewInstagramUrl ? (
                  <a
                    href={previewInstagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-2 font-medium text-white hover:text-brand-strong"
                  >
                    {previewInstagramUrl}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <p className="mt-2 text-white/54">Sin link configurado.</p>
                )}
              </div>

              <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                  Direccion y horarios
                </p>
                <p className="mt-2 text-white">
                  {(addressValue ?? '').trim() || 'Direccion sin configurar'}
                </p>
                <p className="mt-1 text-white/54">
                  {(openingHoursValue ?? '').trim() || 'Horarios sin configurar'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
