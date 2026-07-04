const typeBadgeClasses = {
  agua: 'bg-blue-500 text-white',
  bicho: 'bg-emerald-800 text-white',
  fuego: 'bg-orange-500 text-white',
  normal: 'bg-slate-400 text-slate-900',
  planta: 'bg-emerald-500 text-white',
  veneno: 'bg-violet-600 text-white',
  volador: 'bg-sky-200 text-slate-900',
}

function getTypeBadgeClass(type, isBloqueado) {
  if (isBloqueado) {
    return 'bg-slate-200 text-slate-600'
  }

  const normalized = String(type).toLowerCase()
  return typeBadgeClasses[normalized] ?? 'bg-red-100 text-red-700'
}

function PokemonCard({ nombre, tipo, habilidad, evoluciones, imagen, altura, peso, isFavorito, isBloqueado, onToggleFavorito, onToggleBloqueado }) {
  return (
    <article className={`group overflow-hidden rounded-[32px] border-2 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.16)] transition duration-300 ${isBloqueado ? 'border-rose-200 bg-rose-50/90 text-slate-500 line-through shadow-none' : 'border-red-500/80 bg-white/95 hover:-translate-y-1 hover:shadow-2xl'}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-red-600/90">
            Pokémon
          </p>
          <h3 className={`text-3xl font-semibold tracking-tight ${isBloqueado ? 'text-slate-500' : 'text-slate-900'}`}>{nombre}</h3>
        </div>

        <div className="relative flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-100 via-white to-orange-100 shadow-[0_18px_40px_rgba(249,115,22,0.18)] sm:h-24 sm:w-24">
          {imagen ? (
            <img src={imagen} alt={nombre} className="h-24 w-24 object-contain" />
          ) : (
            <span className="text-4xl font-bold text-red-600">{nombre?.[0]?.toUpperCase() || 'P'}</span>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {Array.isArray(tipo)
          ? tipo.map((type) => (
              <span
                key={type}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold shadow-sm ${getTypeBadgeClass(type, isBloqueado)}`}
              >
                {type}
              </span>
            ))
          : (
            <span className={`rounded-full px-3 py-1.5 text-sm font-semibold shadow-sm ${getTypeBadgeClass(tipo, isBloqueado)}`}>{tipo}</span>
          )}
      </div>

      <div className="mt-6 rounded-[24px] bg-slate-50/90 p-5 text-sm leading-7 text-slate-600 shadow-sm">
        <p className="mb-3">
          <span className="font-semibold text-slate-900">Habilidad:</span> {habilidad}
        </p>
        <p className="mb-3">
          <span className="font-semibold text-slate-900">Evoluciones:</span> {evoluciones?.join(', ') || 'Ninguna'}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Altura:</span> {altura / 10} m ·{' '}
          <span className="font-semibold text-slate-900">Peso:</span> {peso / 10} kg
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={onToggleFavorito}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${isBloqueado ? 'border border-slate-300 bg-slate-100 text-slate-500' : isFavorito ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-300/30' : 'bg-white border border-slate-300 text-slate-700 hover:bg-amber-50'}`}
        >
          {isFavorito ? '⭐ Favorito' : '✨ Marcar favorito'}
        </button>
        <button
          type="button"
          onClick={onToggleBloqueado}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${isBloqueado ? 'bg-slate-300 text-slate-700' : 'bg-rose-100 text-rose-800 shadow-lg shadow-rose-100/60 hover:bg-rose-50'}`}
        >
          {isBloqueado ? '✅ Desbloquear' : '⛔ Bloquear'}
        </button>
      </div>
    </article>
  )
}

export default PokemonCard
