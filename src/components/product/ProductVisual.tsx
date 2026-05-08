import { cn } from '@/lib/cn'

const gradientPresets = [
  'from-stone-950 via-stone-700 to-amber-100',
  'from-[#1d1510] via-[#7c5039] to-[#ecd7c2]',
  'from-emerald-950 via-teal-700 to-stone-100',
  'from-slate-900 via-stone-500 to-[#e6d4c1]',
]

interface ProductVisualProps {
  name: string
  categoryName?: string | null
  imageUrl?: string | null
  seed: string
  className?: string
}

function hashSeed(seed: string) {
  return Array.from(seed).reduce((total, character) => {
    return total + character.charCodeAt(0)
  }, 0)
}

export function ProductVisual({
  name,
  categoryName,
  imageUrl,
  seed,
  className,
}: ProductVisualProps) {
  if (imageUrl && /^(https?:\/\/|\/)/.test(imageUrl)) {
    return (
      <div className={cn('overflow-hidden rounded-[24px] bg-stone-100', className)}>
        <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
      </div>
    )
  }

  const gradient = gradientPresets[hashSeed(seed) % gradientPresets.length]
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  return (
    <div
      className={cn(
        'subtle-grid relative overflow-hidden rounded-[24px] bg-gradient-to-br text-white',
        gradient,
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_28%)]" />
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 text-[0.68rem] uppercase tracking-[0.22em] text-white/70">
        <span>{categoryName ?? 'Seleccion'}</span>
        <span>UrbanCity</span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl font-semibold tracking-[0.2em] text-white/90">
          {initials}
        </span>
      </div>
    </div>
  )
}
