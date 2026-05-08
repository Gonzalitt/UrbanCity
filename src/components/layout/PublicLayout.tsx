import { MessageCircle } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { buttonStyles } from '@/components/ui/buttonStyles'
import { useStorefrontData } from '@/hooks/useStorefrontData'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

export function PublicLayout() {
  const { storeSettings } = useStorefrontData()

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="shell-container py-6 sm:py-8">
        <Outlet />
      </main>
      <SiteFooter />

      <a
        href={buildWhatsAppUrl(
          storeSettings.whatsapp_phone,
          'Hola, quiero hacer una consulta sobre un producto.',
        )}
        target="_blank"
        rel="noreferrer"
        className={buttonStyles({
          variant: 'whatsapp',
          className:
            'fixed right-4 bottom-4 z-20 h-14 w-14 rounded-full p-0 shadow-[0_20px_30px_rgba(22,130,93,0.25)] sm:right-6 sm:bottom-6',
        })}
        aria-label="Abrir WhatsApp"
      >
        <MessageCircle className="h-5 w-5" />
      </a>
    </div>
  )
}
