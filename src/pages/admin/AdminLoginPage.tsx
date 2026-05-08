import { Shield } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { SectionTitle } from '@/components/ui/SectionTitle'

export function AdminLoginPage() {
  return (
    <main className="shell-container py-10">
      <Card className="mx-auto max-w-2xl space-y-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-950 text-white">
          <Shield className="h-5 w-5" />
        </div>
        <SectionTitle
          eyebrow="Admin"
          title="Acceso admin listo para conectar con Supabase Auth."
          description="En la siguiente etapa se agrega login real, proteccion de rutas y CRUD de catalogo. El esquema contempla una tabla admin_users porque sin una fuente de autorizacion no se puede resolver RLS de forma seria."
        />
      </Card>
    </main>
  )
}
