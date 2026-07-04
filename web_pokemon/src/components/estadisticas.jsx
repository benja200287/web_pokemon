function Estadisticas({ total, favoritos, bloqueados, loading, error }) {
  if (loading) {
    return (
      <div className="mt-6 rounded-[24px] border border-slate-200/90 bg-white/90 p-6 text-center shadow-sm">
        <p className="text-sm font-semibold text-slate-700">Cargando estadísticas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-6 rounded-[24px] border border-rose-200/90 bg-rose-50/90 p-6 text-center shadow-sm">
        <p className="text-sm font-semibold text-rose-900">Error al cargar estadísticas</p>
        <p className="mt-2 text-sm text-rose-700">{error}</p>
      </div>
    )
  }

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-3">
      <article className="rounded-[24px] border border-slate-200/90 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Total</p>
        <p className="mt-4 text-4xl font-semibold text-slate-900">{total}</p>
        <p className="mt-2 text-sm text-slate-500">Pokémons cargados</p>
      </article>
      <article className="rounded-[24px] border border-amber-200/90 bg-amber-50/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">Favoritos</p>
        <p className="mt-4 text-4xl font-semibold text-amber-900">{favoritos}</p>
        <p className="mt-2 text-sm text-amber-700">Pokémons marcados como favoritos</p>
      </article>
      <article className="rounded-[24px] border border-rose-200/90 bg-rose-50/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-700">Bloqueados</p>
        <p className="mt-4 text-4xl font-semibold text-rose-900">{bloqueados}</p>
        <p className="mt-2 text-sm text-rose-700">Pokémons bloqueados</p>
      </article>
    </div>
  )
}

export default Estadisticas
