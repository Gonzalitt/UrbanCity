import { Card } from '@/components/ui/Card'
import { SectionTitle } from '@/components/ui/SectionTitle'

export function AdminDashboardPage() {
  return (
    <main className="shell-container py-10">
      <Card className="space-y-6">
        <SectionTitle
          eyebrow="Dashboard"
          title="Base del panel admin preparada."
          description="Todavia no hay autenticacion ni CRUD implementado. La ruta queda reservada para productos, categorias, pedidos y configuracion del comercio."
        />
      </Card>
    </main>
  )
}
