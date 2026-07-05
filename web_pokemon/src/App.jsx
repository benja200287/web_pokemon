import { useCallback, useEffect, useState } from 'react'
import PokemonCard from './components/PokemonCard.jsx'
import SearchBar from './components/SearchBar.jsx'
import FiltroporTipo from './components/FiltroporTipo.jsx'
import BotonVolverInicio from './components/BotonVolverInicio.jsx'
import { mapPokeApiToPokemon, fetchEvolutionNames } from './data/pokemon.js'
import { usePokemonFetch } from './data/usePokemon.js'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { usePokemonList } from './hooks/usePokemonList.js'

const API_BASE = 'https://pokeapi.co/api/v2'
const PAGE_LIMIT = 16
const TIPOS_DE_FILTRO = ['Acero', 'Hielo', 'Eléctrico', 'Roca', 'Tierra', 'Lucha', 'Hada', 'Psíquico', 'Dragón', 'Fantasma', 'Siniestro']

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activePokemon, setActivePokemon] = useState(null)
  const {
    fetchData: fetchListData,
    loading: listLoading,
  } = usePokemonFetch()
  const {
    fetchData: fetchSearchData,
    loading: searchLoading,
    error: searchError,
    setError: setSearchError,
  } = usePokemonFetch()
  const fetchPokemonData = useCallback(async (url) => {
    const response = await fetch(url)
    const data = await response.json()
    const speciesResponse = await fetch(data.species.url)
    const speciesData = await speciesResponse.json()
    const evoluciones = await fetchEvolutionNames(speciesData.evolution_chain.url)

    return mapPokeApiToPokemon(data, speciesData, evoluciones)
  }, [])

  const {
    pokemonList,
    tiposDisponibles,
    offset,
    hasMore,
    loadPokemons,
    addPokemon,
  } = usePokemonList({
    tiposBase: TIPOS_DE_FILTRO,
    fetchListData,
    fetchPokemonData,
    pageLimit: PAGE_LIMIT,
    apiBase: API_BASE,
  })
  const [tipoSeleccionado, setTipoSeleccionado] = useState('')
  const [favoritos, setFavoritos] = useLocalStorage('favoritos', [])
  const [bloqueados, setBloqueados] = useLocalStorage('bloqueados', [])
  const [vistaActiva, setVistaActiva] = useState('inicio')
  const [searchActive, setSearchActive] = useState(false)

  useEffect(() => {
    async function init() {
      await loadPokemons(0, false)
    }

    init()
  }, [loadPokemons])

  const getSelectedPokemons = (ids) => {
    const encontrados = pokemonList.filter((pokemon) => ids.includes(pokemon.id))

    if (activePokemon && ids.includes(activePokemon.id) && !encontrados.some((pokemon) => pokemon.id === activePokemon.id)) {
      return [activePokemon, ...encontrados]
    }

    return encontrados
  }

  const favoritosSeleccionados = getSelectedPokemons(favoritos).filter((p) => !bloqueados.includes(p.id))
  const bloqueadosSeleccionados = getSelectedPokemons(bloqueados).filter((p) => !favoritos.includes(p.id))

  const pokemonsFiltrados = pokemonList
    .filter((pokemon) => !bloqueados.includes(pokemon.id))
    .filter((pokemon) => !favoritos.includes(pokemon.id))
    .filter((pokemon) => {
      if (!tipoSeleccionado) {
        return true
      }

      const tipoBuscado = String(tipoSeleccionado).trim().toLowerCase()
      return pokemon.tipo.some((tipo) =>
        String(tipo).trim().toLowerCase() === tipoBuscado,
      )
    })

  function handleLoadMore() {
    loadPokemons(offset + PAGE_LIMIT, true)
  }

  function toggleFavorito(id) {
    setFavoritos((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )

    // If the favorite was added from a search result (activePokemon), ensure
    // the full pokemon object is present in the list.
    if (activePokemon && activePokemon.id === id) {
      addPokemon(activePokemon)
    }
  }

  function toggleBloqueado(id) {
    setBloqueados((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
    setFavoritos((current) => current.filter((item) => item !== id))

    // If the blocked was added from a search result (activePokemon), ensure
    // the full pokemon object is present in the list.
    if (activePokemon && activePokemon.id === id) {
      addPokemon(activePokemon)
    }
  }

  async function handleSearch() {
    if (!searchTerm.trim()) {
      return
    }

    setVistaActiva('inicio')
    setSearchActive(true)
    setSearchError('')
    setActivePokemon(null)

    const searchUrl = `${API_BASE}/pokemon/${searchTerm.trim().toLowerCase()}`
    const response = await fetchSearchData(searchUrl)

    if (!response) {
      setActivePokemon(null)
      setSearchError('Pokémon no encontrado. Prueba con un Pokémon que sea válido')
      return
    }

    try {
      const pokemon = await fetchPokemonData(searchUrl)
      setActivePokemon(pokemon)
    } catch {
      setActivePokemon(null)
      setSearchError('No se pudo obtener el pokémon. Intenta nuevamente.')
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  function handleSearchTermChange(value) {
    setSearchTerm(value)
    if (!value.trim()) {
      setSearchActive(false)
      setActivePokemon(null)
      setSearchError('')
    }
  }

  const showSearchResults = vistaActiva === 'inicio' && searchActive

  return (
    <main className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8 bg-[radial-gradient(circle_at_top_left,_rgba(254,243,199,0.9),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(191,219,254,0.9),_transparent_28%),#f8fafc]">
      <header className="relative flex flex-col items-center gap-8 overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/85 p-8 sm:p-10 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,_rgba(255,248,227,0.7),_transparent_35%)] before:pointer-events-none">
        <div className="relative z-10 flex w-full max-w-[880px] flex-col items-center gap-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-sm">
            MUNDO POKÉMON
          </span>
          <h1 className="text-[clamp(2rem,1.9rem+0.8vw,2.8rem)] font-extrabold leading-tight tracking-[-0.02em] text-slate-900 sm:text-[2.8rem] lg:text-[3rem]">
            Explora, selecciona y conoce distintos pokémons
          </h1>
          <p className="mx-auto max-w-[640px] text-slate-600 text-base leading-8 sm:text-lg sm:leading-9">
            Descubre tipos, habilidades, evoluciones, altura y peso de tus pokémons favoritos.
          </p>
          <SearchBar
            value={searchTerm}
            onChange={handleSearchTermChange}
            onSearch={handleSearch}
            onKeyDown={handleKeyDown}
          />
          
        </div>
      </header>

      <section className="mt-12">
        {vistaActiva === 'inicio' && (
          <section className="mt-12">
            <div className="mx-auto mb-8 grid max-w-2xl gap-4 text-center">
              <div>
                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                  {showSearchResults ? 'Resultado de búsqueda' : 'Pokémons'}
                </h2>
              </div>
              <p className="mx-auto max-w-xl text-base sm:text-lg text-slate-700 leading-8">
                {showSearchResults
                  ? 'Revisa el resultado de tu búsqueda.'
                  : 'Explora el mundo Pokémon: descubre tipos, habilidades, evoluciones, altura y peso. Marca tus favoritos y bloquea los que menos te gusten.'}
              </p>
            </div>

            {!showSearchResults && (
              <>
                <div className="mb-10 flex flex-col items-center">
                  <div className="w-full max-w-[420px]">
                    <FiltroporTipo
                      tipos={tiposDisponibles}
                      tipoSeleccionado={tipoSeleccionado}
                      onSelectTipo={setTipoSeleccionado}
                    />
                  </div>
                </div>

                <div className="mx-auto mb-7 grid max-w-2xl gap-4 rounded-[32px] border border-red-100 bg-red-50/80 px-8 py-6 text-center shadow-sm shadow-red-100">
                  <div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
                      Tus selecciones
                    </h2>
                  </div>
                  <p className="mx-auto max-w-xl text-base text-slate-700 leading-8">
                    Selecciona Favoritos o Bloqueados para ver esa vista aparte del inicio.
                  </p>
                </div>

                <div className="mx-auto flex w-full max-w-full flex-col gap-3 rounded-[24px] border border-slate-200/80 bg-white/90 p-3 shadow-sm sm:flex-row sm:items-center sm:justify-center sm:gap-4 sm:p-2">
                  <button
                    type="button"
                    onClick={() => setVistaActiva('inicio')}
                    className={`flex-1 rounded-[18px] px-4 py-3 text-sm font-semibold transition ${vistaActiva === 'inicio' ? 'bg-slate-900 text-white shadow-lg' : 'bg-transparent text-slate-600 hover:bg-slate-100'}`}
                  >
                    Inicio
                  </button>
                  <button
                    type="button"
                    onClick={() => setVistaActiva('favoritos')}
                    className={`flex-1 rounded-[18px] px-4 py-3 text-sm font-semibold transition ${vistaActiva === 'favoritos' ? 'bg-amber-400 text-slate-950 shadow-lg' : 'bg-transparent text-slate-600 hover:bg-slate-100'}`}
                  >
                    Favoritos ({favoritosSeleccionados.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setVistaActiva('bloqueados')}
                    className={`flex-1 rounded-[18px] px-4 py-3 text-sm font-semibold transition ${vistaActiva === 'bloqueados' ? 'bg-slate-700 text-white shadow-lg' : 'bg-transparent text-slate-600 hover:bg-slate-100'}`}
                  >
                    Bloqueados ({bloqueadosSeleccionados.length})
                  </button>
                </div>

                <div className="mx-auto mt-6 mb-8 max-w-[420px] text-center">
                  <div className="inline-flex rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-800 shadow-sm">
                    Pokémons cargados: <span className="font-black text-red-900">{pokemonList.length}</span>
                  </div>
                </div>
              </>
            )}

            {searchLoading && (
              <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4 text-sm font-semibold text-sky-700">
                Buscando pokémon...
              </div>
            )}
            {searchError && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                {searchError}
              </div>
            )}

            {showSearchResults ? (
              <div>
                <div className="mb-4 flex justify-end">
                  <BotonVolverInicio setVistaActiva={setVistaActiva} setSearchActive={setSearchActive} setActivePokemon={setActivePokemon}>
                    Volver al inicio
                  </BotonVolverInicio>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
                  {activePokemon && !bloqueados.includes(activePokemon.id) ? (
                    <PokemonCard
                      id={activePokemon.id}
                      nombre={activePokemon.nombre}
                      tipo={activePokemon.tipo}
                      habilidad={activePokemon.habilidad.join(', ')}
                      evoluciones={activePokemon.evoluciones}
                      imagen={activePokemon.imagen}
                      altura={activePokemon.altura}
                      peso={activePokemon.peso}
                      isFavorito={favoritos.includes(activePokemon.id)}
                      isBloqueado={bloqueados.includes(activePokemon.id)}
                      onToggleFavorito={() => toggleFavorito(activePokemon.id)}
                      onToggleBloqueado={() => toggleBloqueado(activePokemon.id)}
                    />
                  ) : null}
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
                  {listLoading && pokemonList.length === 0 ? (
                    <div className="col-span-full rounded-[18px] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                      Cargando pokémons...
                    </div>
                  ) : activePokemon && !bloqueados.includes(activePokemon.id) ? (
                    <PokemonCard
                      id={activePokemon.id}
                      nombre={activePokemon.nombre}
                      tipo={activePokemon.tipo}
                      habilidad={activePokemon.habilidad.join(', ')}
                      evoluciones={activePokemon.evoluciones}
                      imagen={activePokemon.imagen}
                      altura={activePokemon.altura}
                      peso={activePokemon.peso}
                      isFavorito={favoritos.includes(activePokemon.id)}
                      isBloqueado={bloqueados.includes(activePokemon.id)}
                      onToggleFavorito={() => toggleFavorito(activePokemon.id)}
                      onToggleBloqueado={() => toggleBloqueado(activePokemon.id)}
                    />
                  ) : (
                    pokemonsFiltrados.map((pokemon) => (
                      <PokemonCard
                        key={pokemon.id}
                        id={pokemon.id}
                        nombre={pokemon.nombre}
                        tipo={pokemon.tipo}
                        habilidad={pokemon.habilidad.join(', ')}
                        evoluciones={pokemon.evoluciones}
                        imagen={pokemon.imagen}
                        altura={pokemon.altura}
                        peso={pokemon.peso}
                        isFavorito={favoritos.includes(pokemon.id)}
                        isBloqueado={bloqueados.includes(pokemon.id)}
                        onToggleFavorito={() => toggleFavorito(pokemon.id)}
                        onToggleBloqueado={() => toggleBloqueado(pokemon.id)}
                      />
                    ))
                  )}
                </div>

                {!activePokemon && hasMore && (
                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      className={`rounded-full px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-red-500/15 transition ${listLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                      onClick={handleLoadMore}
                      disabled={listLoading}
                    >
                      {listLoading ? 'Cargando...' : 'Cargar más pokémons'}
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.75fr_0.95fr]">
          <div className="space-y-6">
              {vistaActiva === 'favoritos' && (
                      <div className="rounded-[28px] border border-amber-100 bg-amber-50/80 p-6 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-slate-900">Tu lista de favoritos</h3>
                            <p className="mt-2 text-sm text-slate-500">Revisa los pokémons que marcaste como favoritos.</p>
                          </div>
                          <BotonVolverInicio setVistaActiva={setVistaActiva}>
                            Volver al inicio
                          </BotonVolverInicio>
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                          <span className="inline-flex h-7 items-center rounded-full bg-red-600 px-3 text-sm font-semibold text-white">
                            {favoritosSeleccionados.length}
                          </span>
                        </div>
                        {favoritosSeleccionados.length === 0 ? (
                          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                            Aún no tienes pokémons favoritos.
                          </div>
                        ) : (
                          <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            {favoritosSeleccionados.map((pokemon) => (
                              <PokemonCard
                                key={pokemon.id}
                                id={pokemon.id}
                                nombre={pokemon.nombre}
                                tipo={pokemon.tipo}
                                habilidad={pokemon.habilidad.join(', ')}
                                evoluciones={pokemon.evoluciones}
                                imagen={pokemon.imagen}
                                altura={pokemon.altura}
                                peso={pokemon.peso}
                                isFavorito={true}
                                isBloqueado={bloqueados.includes(pokemon.id)}
                                onToggleFavorito={() => toggleFavorito(pokemon.id)}
                                onToggleBloqueado={() => toggleBloqueado(pokemon.id)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}

            {vistaActiva === 'bloqueados' && (
              <div className="rounded-[28px] border border-slate-300 bg-slate-50 p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">Tu lista de bloqueados</h3>
                    <p className="mt-2 text-sm text-slate-500">Revisa los pokémons que decidiste bloquear.</p>
                  </div>
                  <BotonVolverInicio setVistaActiva={setVistaActiva}>
                    Volver al inicio
                  </BotonVolverInicio>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <span className="inline-flex h-7 items-center rounded-full bg-red-600 px-3 text-sm font-semibold text-white">
                    {bloqueadosSeleccionados.length}
                  </span>
                </div>
                {bloqueadosSeleccionados.length === 0 ? (
                  <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                    No hay pokémons bloqueados.
                  </div>
                ) : (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {bloqueadosSeleccionados.map((pokemon) => (
                      <PokemonCard
                        key={pokemon.id}
                        id={pokemon.id}
                        nombre={pokemon.nombre}
                        tipo={pokemon.tipo}
                        habilidad={pokemon.habilidad.join(', ')}
                        evoluciones={pokemon.evoluciones}
                        imagen={pokemon.imagen}
                        altura={pokemon.altura}
                        peso={pokemon.peso}
                        isFavorito={favoritos.includes(pokemon.id)}
                        isBloqueado={true}
                        onToggleFavorito={() => toggleFavorito(pokemon.id)}
                        onToggleBloqueado={() => toggleBloqueado(pokemon.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          

        </div>
      </section>
      <footer className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
        <p>Pagina de pokémons creada por Benjamin Morales Yañez</p>
      </footer>
    </main>
  )
}

export default App
