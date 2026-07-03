function PokemonCard({ nombre, tipo, habilidad, evoluciones, imagen, altura, peso, isFavorito, isBloqueado, onToggleFavorito, onToggleBloqueado }) {
  return (
    <article className={`group rounded-[28px] border p-6 shadow-sm transition duration-300 ${isBloqueado ? 'border-rose-200 bg-rose-50/80 text-slate-500 line-through shadow-none' : 'border-slate-200/80 bg-white/90 hover:-translate-y-1 hover:shadow-2xl'}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-red-600/90">
            Pokémon
          </p>
          <h3 className={`text-2xl font-semibold ${isBloqueado ? 'text-slate-500' : 'text-slate-900'}`}>{nombre}</h3>
        </div>

        <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br from-red-50 via-white to-red-100 shadow-inner shadow-red-500/10">
          {imagen ? (
            <img src={imagen} alt={nombre} className="h-full w-full object-contain" />
          ) : (
            <span className="text-3xl font-bold text-red-600">{nombre?.[0]?.toUpperCase() || 'P'}</span>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {Array.isArray(tipo)
          ? tipo.map((type) => (
              <span
                key={type}
                className={`rounded-full px-3 py-1 text-sm font-semibold shadow-sm ${isBloqueado ? 'bg-slate-200 text-slate-600' : 'bg-red-100 text-red-700'}`}
              >
                {type}
              </span>
            ))
          : (
            <span className={`rounded-full px-3 py-1 text-sm font-semibold shadow-sm ${isBloqueado ? 'bg-slate-200 text-slate-600' : 'bg-red-100 text-red-700'}`}>{tipo}</span>
          )}
      </div>

      <div className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
        <p>
          <span className="font-semibold text-slate-900">Habilidad:</span> {habilidad}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Evoluciones:</span> {evoluciones?.join(', ') || 'Ninguna'}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Altura:</span> {altura / 10} m ·{' '}
          <span className="font-semibold text-slate-900">Peso:</span> {peso / 10} kg
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onToggleFavorito}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isBloqueado ? 'border border-slate-300 bg-slate-100 text-slate-500' : isFavorito ? 'bg-amber-400 text-slate-950 shadow-sm' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
        >
          {isFavorito ? 'Favorito' : 'Marcar favorito'}
        </button>
        <button
          type="button"
          onClick={onToggleBloqueado}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isBloqueado ? 'bg-slate-300 text-slate-700' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
        >
          {isBloqueado ? 'Desbloquear' : 'Bloquear'}
        </button>
      </div>
    </article>
  )
}

export default PokemonCard
