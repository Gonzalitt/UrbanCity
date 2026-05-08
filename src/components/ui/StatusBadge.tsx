import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type StatusTone = 'success' | 'warning' | 'danger' | 'muted'

const toneStyles: Record<StatusTone, string> = {
  success: 'border-emerald-600/15 bg-emerald-500/10 text-emerald-800',
  warning: 'border-amber-600/15 bg-amber-500/10 text-amber-900',
  danger: 'border-rose-600/15 bg-rose-500/10 text-rose-800',
  muted: 'border-stone-900/10 bg-stone-900/6 text-stone-700',
}

interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone
}

export function StatusBadge({
  tone = 'muted',
  className,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium',
        toneStyles[tone],
        className,
      )}
      {...props}
    />
  )
}
