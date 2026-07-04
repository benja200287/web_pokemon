import React from 'react'
import PokemonCard from './PokemonCard.jsx'

export default function SelectedList({ favoritosSeleccionados, bloqueadosSeleccionados, favoritos, bloqueados, toggleFavorito, toggleBloqueado, vistaActiva }) {
  return (
    <aside className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-sm lg:sticky lg:top-24">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Favoritos</p>
        </div>
      </div>

      {favoritosSeleccionados.length === 0 ? (
        <p className="mt-5 text-sm leading-6 text-slate-500">Marca pokémons como favoritos y aparecerán aquí.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {favoritosSeleccionados.map((pokemon) => (
            <div key={pokemon.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                {pokemon.imagen ? (
                  <img src={pokemon.imagen} alt={pokemon.nombre} className="h-14 w-14 rounded-2xl object-contain" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200 text-xl font-semibold text-slate-700">{pokemon.nombre?.[0]?.toUpperCase() || 'P'}</div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">{pokemon.nombre}</p>
                  <p className="truncate text-sm text-slate-500">{pokemon.tipo.join(', ')}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggleFavorito(pokemon.id)}
                  className="rounded-full bg-amber-400 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-500"
                >
                  Quitar
                </button>
                <button
                  type="button"
                  onClick={() => toggleBloqueado(pokemon.id)}
                  className="rounded-full border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  {bloqueados.includes(pokemon.id) ? 'Desbloquear' : 'Bloquear'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <h4 className="text-sm font-semibold text-slate-700">Bloqueados</h4>
        {bloqueadosSeleccionados.length > 0 && (
          <div className="mt-3 space-y-3">
            {bloqueadosSeleccionados.map((pokemon) => (
              <div key={pokemon.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3">
                <div className="flex items-center gap-3">
                  {pokemon.imagen ? (
                    <img src={pokemon.imagen} alt={pokemon.nombre} className="h-10 w-10 rounded-lg object-contain" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-lg font-semibold text-slate-700">{pokemon.nombre?.[0]?.toUpperCase() || 'P'}</div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{pokemon.nombre}</p>
                    <p className="text-xs text-slate-500">{pokemon.tipo.join(', ')}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleFavorito(pokemon.id)}
                    className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800"
                  >
                    {favoritos.includes(pokemon.id) ? 'Favorito' : 'Fav'}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleBloqueado(pokemon.id)}
                    className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700"
                  >
                    {bloqueados.includes(pokemon.id) ? 'Desbloq.' : 'Bloq.'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
