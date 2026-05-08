import { cn } from '@/lib/cn'

interface SectionTitleProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'left',
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        'space-y-3',
        align === 'center' ? 'mx-auto max-w-3xl text-center' : '',
      )}
    >
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold tracking-[-0.04em] text-stone-950 sm:text-4xl">
        {title}
      </h2>
      {description ? <p className="page-copy">{description}</p> : null}
    </div>
  )
}
