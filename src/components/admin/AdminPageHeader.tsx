import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface AdminPageHeaderProps {
  eyebrow: string
  title: string
  description?: string
  actions?: ReactNode
  className?: string
  hideDescriptionOnMobile?: boolean
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
  hideDescriptionOnMobile = false,
}: AdminPageHeaderProps) {
  return (
    <section
      className={cn(
        'rounded-[24px] border border-white/10 bg-[#111111] p-4 text-white shadow-[0_24px_56px_rgba(0,0,0,0.22)] sm:p-6 lg:p-8',
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2 sm:space-y-3">
          <p className="eyebrow text-[0.62rem] tracking-[0.24em] text-brand-strong/78">
            {eyebrow}
          </p>
          <h1 className="text-xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p
              className={cn(
                'max-w-3xl text-sm leading-6 text-white/60 sm:text-base sm:leading-7',
                hideDescriptionOnMobile && 'hidden sm:block',
              )}
            >
              {description}
            </p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex flex-wrap gap-2 sm:gap-3 lg:justify-end">{actions}</div>
        ) : null}
      </div>
    </section>
  )
}
