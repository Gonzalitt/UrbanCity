import { AtSign, MapPin, MessageCircle, Timer } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { buttonStyles } from '@/components/ui/buttonStyles'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { useStorefrontData } from '@/hooks/useStorefrontData'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

export function ContactPage() {
  const { storeSettings } = useStorefrontData()
  const hasWhatsApp = Boolean(storeSettings.whatsapp_phone)
  const fallbackAddress =
    'Galer\u00eda Provincial, General Acha 172 Sur, San Juan, Argentina'
  const fallbackEmbedUrl =
    'https://www.google.com/maps?q=-31.5368791,-68.5240926&z=18&output=embed'
  const fallbackPlaceUrl =
    'https://www.google.com/maps/place/Galer%C3%ADa+Provincial/@-31.5318519,-68.5324635,14870m/data=!3m1!1e3!4m6!3m5!1s0x96816b81c8db64d1:0xf4ab9011369707b3!8m2!3d-31.5368791!4d-68.5240926!16s%2Fg%2F11h1b08m_y?entry=ttu&g_ep=EgoyMDI2MDUwNi4wIKXMDSoASAFQAw%3D%3D'
  const normalizedAddress = storeSettings.address?.trim()
  const address = normalizedAddress || fallbackAddress
  const embeddedMapUrl = fallbackEmbedUrl
  const openMapUrl = fallbackPlaceUrl

  return (
    <div className="space-y-8">
      <section className="surface-panel p-6 sm:p-8 lg:p-10">
        <SectionTitle
          eyebrow="Contacto"
          title={'Coordin\u00e1 tu pedido por WhatsApp'}
          description={
            'Consult\u00e1 disponibilidad, horarios y retiro directamente con el local.'
          }
          tone="light"
        />
      </section>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card className="space-y-3 border border-white/10 bg-[#151515]">
          <MapPin className="h-5 w-5 text-brand-strong" />
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">
            {'Direcci\u00f3n'}
          </h2>
          <p className="text-sm leading-7 text-white/68">{address}</p>
        </Card>
        <Card className="space-y-3 border border-white/10 bg-[#151515]">
          <Timer className="h-5 w-5 text-brand-strong" />
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">
            Horarios
          </h2>
          <p className="text-sm leading-7 text-white/68">
            {storeSettings.opening_hours ?? 'Horarios a completar.'}
          </p>
        </Card>
        <Card className="space-y-3 border border-white/10 bg-[#151515]">
          <MessageCircle className="h-5 w-5 text-brand-strong" />
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">
            WhatsApp
          </h2>
          <p className="text-sm leading-7 text-white/68">
            {'Consult\u00e1 talles, disponibilidad y retiro directo con el local.'}
          </p>
        </Card>
        <Card className="space-y-3 border border-white/10 bg-[#151515]">
          <AtSign className="h-5 w-5 text-brand-strong" />
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">
            Instagram
          </h2>
          <p className="text-sm leading-7 text-white/68">
            {'Mir\u00e1 nuevos ingresos y novedades de City Calzado Urbano.'}
          </p>
        </Card>
      </div>

      <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#111111]">
        <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:p-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-strong/76">
              {'D\u00f3nde encontrarnos'}
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white">
              {'Consult\u00e1 direcci\u00f3n y retiro antes de acercarte.'}
            </h2>
            <p className="text-sm leading-7 text-white/68">
              Escribinos por WhatsApp para confirmar disponibilidad y coordinar
              el retiro en el local.
            </p>
            <div className="space-y-3 text-sm text-white/72">
              <p>{address}</p>
              <a
                href={openMapUrl}
                target="_blank"
                rel="noreferrer"
                className={buttonStyles({ variant: 'outline' })}
              >
                <MapPin className="h-4 w-4" />
                Abrir en Google Maps
              </a>
            </div>
          </div>

          <div className="min-h-[320px] overflow-hidden rounded-[28px] border border-white/10">
            <iframe
              title="Ubicaci\u00f3n de City Calzado Urbano"
              src={embeddedMapUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[320px] w-full bg-[#0c0c0c]"
            />
          </div>
        </div>
      </section>

      <Card className="grid gap-6 border border-white/10 bg-[#151515] lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white">
            Hablemos por WhatsApp para confirmar tu pedido.
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-white/68">
            {'Consult\u00e1 disponibilidad, talle y retiro. El pago se coordina por'}
            {' '}
            WhatsApp directamente con el local.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {hasWhatsApp ? (
            <a
              href={buildWhatsAppUrl(
                storeSettings.whatsapp_phone,
                'Hola, quiero consultar disponibilidad y formas de retiro.',
              )}
              target="_blank"
              rel="noreferrer"
              className={buttonStyles({ variant: 'whatsapp' })}
            >
              <MessageCircle className="h-4 w-4" />
              Abrir WhatsApp
            </a>
          ) : null}
          {storeSettings.instagram_url ? (
            <a
              href={storeSettings.instagram_url}
              target="_blank"
              rel="noreferrer"
              className={buttonStyles({ variant: 'outline' })}
            >
              <AtSign className="h-4 w-4" />
              Ir a Instagram
            </a>
          ) : null}
        </div>
      </Card>
    </div>
  )
}
