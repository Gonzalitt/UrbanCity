import {
  CheckCircle2,
  Clock3,
  Package,
  ShoppingBag,
  Tags,
} from 'lucide-react'
import { AdminMetricCard } from '@/components/admin/AdminMetricCard'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Card } from '@/components/ui/Card'
import { LoadingState } from '@/components/ui/LoadingState'
import { useAuth } from '@/hooks/useAuth'
import { useAdminOutletData } from '@/hooks/useAdminShellData'

export function AdminDashboardPage() {
  const { adminUser, user } = useAuth()
  const { counts, loading, storeName } = useAdminOutletData()

  if (loading) {
    return <LoadingState label="Cargando resumen del panel..." />
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        eyebrow="Resumen"
        title={`Panel de ${storeName}`}
        description="Vista rapida del catalogo y los pedidos."
        hideDescriptionOnMobile
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <AdminMetricCard
          title="Productos"
          value={counts.productsTotal}
          description={`Activos: ${counts.productsActive}`}
          icon={Package}
        />
        <AdminMetricCard
          title="Categorias"
          value={counts.categoriesTotal}
          description={`Activas: ${counts.categoriesActive}`}
          icon={Tags}
        />
        <AdminMetricCard
          title="Pedidos"
          value={counts.ordersTotal}
          description={`Pendientes: ${counts.ordersPending}`}
          icon={ShoppingBag}
        />
        <AdminMetricCard
          title="Para retirar"
          value={counts.ordersReady}
          description={`Listos: ${counts.ordersReady}`}
          icon={CheckCircle2}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr] sm:gap-5">
        <Card className="border border-white/10 bg-[#111111] p-4 text-white shadow-[0_24px_56px_rgba(0,0,0,0.22)] sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <p className="text-sm font-medium text-white">Estado rapido de pedidos</p>
              <p className="mt-1 text-xs leading-5 text-white/60 sm:text-sm sm:leading-6">
                Lo esencial para priorizar el seguimiento.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {[
                ['Pendientes', counts.ordersPending],
                ['Confirmados', counts.ordersConfirmed],
                ['Listos', counts.ordersReady],
                ['Entregados', counts.ordersCompleted],
                ['Cancelados', counts.ordersCancelled],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[16px] border border-white/10 bg-black/20 p-3 sm:rounded-[22px] sm:p-4"
                >
                  <p className="text-[0.65rem] uppercase tracking-[0.18em] text-white/40">
                    {label}
                  </p>
                  <p className="mt-1.5 text-xl font-semibold tracking-[-0.03em] text-white sm:mt-2 sm:text-2xl">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="border border-white/10 bg-[#111111] p-4 text-white shadow-[0_24px_56px_rgba(0,0,0,0.22)] sm:p-6">
          <div className="grid gap-3 sm:gap-4">
            <div>
              <p className="text-sm font-medium text-white">Sesion activa</p>
            </div>

            <div className="rounded-[18px] border border-white/10 bg-black/20 p-3 sm:rounded-[22px] sm:p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                Email
              </p>
              <p className="mt-2 text-sm font-semibold text-white sm:text-lg">
                {user?.email ?? 'Sin email'}
              </p>
            </div>

            <div className="rounded-[18px] border border-white/10 bg-black/20 p-3 sm:rounded-[22px] sm:p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                Estado
              </p>
              <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-white sm:text-lg">
                <Clock3 className="h-4 w-4 text-brand-strong" />
                {adminUser?.is_active ? 'Admin activo' : 'Admin inactivo'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
