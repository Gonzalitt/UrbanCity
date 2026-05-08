import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="mx-auto max-w-2xl text-center">
      <div className="space-y-3">
        <p className="eyebrow">Sin resultados</p>
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-stone-950">
          {title}
        </h2>
        <p className="mx-auto max-w-xl text-sm leading-7 text-muted sm:text-base">
          {description}
        </p>
      </div>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </Card>
  )
}
