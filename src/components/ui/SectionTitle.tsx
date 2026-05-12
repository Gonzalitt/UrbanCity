import { cn } from '@/lib/cn'

interface SectionTitleProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
  compactMobile?: boolean
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'dark',
  compactMobile = false,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        compactMobile ? 'space-y-2 sm:space-y-3' : 'space-y-3',
        align === 'center' ? 'mx-auto max-w-3xl text-center' : '',
      )}
    >
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2
        className={cn(
          compactMobile
            ? 'text-2xl font-semibold tracking-[-0.04em] sm:text-4xl'
            : 'text-3xl font-semibold tracking-[-0.04em] sm:text-4xl',
          tone === 'light' ? 'text-white' : 'text-stone-950',
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            compactMobile
              ? 'max-w-2xl text-sm leading-6 sm:text-base sm:leading-7'
              : 'max-w-2xl text-sm leading-7 sm:text-base',
            tone === 'light' ? 'text-white/72' : 'text-stone-600',
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
