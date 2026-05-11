import cityLogo from '@/assets/city-logo.jpg'
import { AtSign, MapPin, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStorefrontData } from '@/hooks/useStorefrontData'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

export function SiteFooter() {
  const { storeSettings } = useStorefrontData()
  const hasWhatsApp = Boolean(storeSettings.whatsapp_phone)

  return (
    <footer className="mt-12 border-t border-white/10 bg-[#050505]">
      <div className="shell-container py-7">
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.8fr_1fr]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={cityLogo}
                alt="City Calzado Urbano"
                className="h-11 w-11 rounded-full border border-white/10 object-cover"
              />
              <div>
                <p className="text-base font-semibold tracking-[-0.03em] text-white">
                  {storeSettings.store_name || 'City Calzado Urbano'}
                </p>
                <p className="text-sm text-white/58">Sneakers y calzado urbano</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-white/42">
              Navegacion
            </p>
            <div className="grid gap-2 text-sm text-white/68">
              <Link to="/" className="hover:text-white">
                Inicio
              </Link>
              <Link to="/catalogo" className="hover:text-white">
                Catalogo
              </Link>
              <Link to="/contacto" className="hover:text-white">
                Contacto
              </Link>
              <Link to="/carrito" className="hover:text-white">
                Carrito
              </Link>
            </div>
          </div>

          <div className="space-y-3 text-sm text-white/68">
            <p className="text-xs uppercase tracking-[0.22em] text-white/42">
              Contacto
            </p>
            {hasWhatsApp ? (
              <a
                href={buildWhatsAppUrl(
                  storeSettings.whatsapp_phone,
                  'Hola, quiero hacer una consulta.',
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <MessageCircle className="h-4 w-4 text-brand-strong" />
                WhatsApp
              </a>
            ) : null}
            {storeSettings.instagram_url ? (
              <a
                href={storeSettings.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <AtSign className="h-4 w-4 text-brand-strong" />
                Instagram
              </a>
            ) : null}
            {storeSettings.address ? (
              <p className="inline-flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-strong" />
                <span>{storeSettings.address}</span>
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-4 text-xs text-white/52 sm:flex-row sm:items-center sm:justify-between">
          <p>Pedidos coordinados por WhatsApp | Disponibilidad sujeta a confirmacion</p>
          <p>City Calzado Urbano</p>
        </div>
      </div>
    </footer>
  )
}
