import cityLogo from '@/assets/city-logo.jpg'
import { AtSign, MessageCircle, ShoppingBag } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { useStorefrontData } from '@/hooks/useStorefrontData'
import { useCartStore } from '@/store/cartStore'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

const promoStripItems = [
  'NUEVOS INGRESOS',
  'CONSULTA TALLES',
  'RETIRO COORDINADO',
  'PEDIDOS POR WHATSAPP',
]

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catalogo' },
  { to: '/contacto', label: 'Contacto' },
]

export function SiteHeader() {
  const { storeSettings } = useStorefrontData()
  const hasWhatsApp = Boolean(storeSettings.whatsapp_phone)
  const itemCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  )

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050505]/94 backdrop-blur-xl">
      <div className="promo-strip-full border-b border-white/10 bg-[#111111] py-2 text-[#b6ff00]">
        <div className="promo-strip-track">
          {[...promoStripItems, ...promoStripItems].map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex items-center gap-5 px-5 text-[0.68rem] font-semibold uppercase tracking-[0.28em]"
            >
              {item}
              <span className="h-1.5 w-1.5 rounded-full bg-[#b6ff00]" />
            </span>
          ))}
        </div>
      </div>

      <div className="shell-container py-3 sm:py-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="min-w-0">
              <div className="flex items-center gap-3">
                <img
                  src={cityLogo}
                  alt="City Calzado Urbano"
                  className="h-11 w-11 rounded-full border border-white/10 object-cover shadow-[0_14px_34px_rgba(0,0,0,0.28)] sm:h-12 sm:w-12"
                />
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold tracking-[-0.03em] text-white sm:text-lg">
                    {storeSettings.store_name || 'City Calzado Urbano'}
                  </p>
                  <p className="truncate text-[0.7rem] uppercase tracking-[0.18em] text-white/46 sm:text-xs">
                    Sneakers y calzado urbano
                  </p>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              {storeSettings.instagram_url ? (
                <a
                  href={storeSettings.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 text-sm text-white/78 transition hover:bg-white/10 hover:text-white"
                >
                  <AtSign className="h-4 w-4" />
                  <span className="hidden sm:inline">Instagram</span>
                </a>
              ) : null}

              {hasWhatsApp ? (
                <a
                  href={buildWhatsAppUrl(
                    storeSettings.whatsapp_phone,
                    'Hola, quiero consultar talles y disponibilidad.',
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-[#151515] px-3 text-sm text-white/82 transition hover:bg-white/10 hover:text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              ) : null}

              <Link
                to="/carrito"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-[#151515] px-3 text-sm text-white transition hover:bg-white/10"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Carrito</span>
                <span className="rounded-full bg-brand-strong px-2 py-0.5 text-[0.68rem] font-semibold text-black">
                  {itemCount}
                </span>
              </Link>
            </div>
          </div>

          <nav className="flex items-center gap-5 overflow-x-auto pb-1 text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navLinks.map((link, index) => (
              <NavLink
                key={`${link.to}-${link.label}-${index}`}
                to={link.to}
                end
                className={({ isActive }) =>
                  cn(
                    'border-b-2 border-transparent pb-2 whitespace-nowrap text-white/70 transition hover:text-white',
                    isActive
                      ? 'border-brand-strong text-brand-strong'
                      : 'hover:border-white/10',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
