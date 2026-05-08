export function LoadingState({ label = 'Cargando...' }: { label?: string }) {
  return (
    <div className="surface-card flex min-h-48 items-center justify-center p-10 text-center">
      <div className="space-y-3">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-stone-900/10 border-t-brand" />
        <p className="text-sm text-muted">{label}</p>
      </div>
    </div>
  )
}
