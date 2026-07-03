import { useEffect, useState } from 'react'
import PokemonCard from './components/PokemonCard.jsx'
import SearchBar from './components/SearchBar.jsx'
import FiltroporTipo from './components/FiltroporTipo.jsx'
import { mapPokeApiToPokemon, fetchEvolutionNames } from './data/pokemon.js'

const API_BASE = 'https://pokeapi.co/api/v2'
const PAGE_LIMIT = 16

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [pokemonList, setPokemonList] = useState([])
  const [activePokemon, setActivePokemon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState('')
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [tiposDisponibles, setTiposDisponibles] = useState([])
  const [tipoSeleccionado, setTipoSeleccionado] = useState('')
  const [favoritos, setFavoritos] = useState([])
  const [bloqueados, setBloqueados] = useState([])

  useEffect(() => {
    loadPokemons(0, false)
  }, [])

  useEffect(() => {
    const savedFavoritos = localStorage.getItem('favoritos')
    const savedBloqueados = localStorage.getItem('bloqueados')

    if (savedFavoritos) {
      setFavoritos(JSON.parse(savedFavoritos))
    }
    if (savedBloqueados) {
      setBloqueados(JSON.parse(savedBloqueados))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('favoritos', JSON.stringify(favoritos))
  }, [favoritos])

  useEffect(() => {
    localStorage.setItem('bloqueados', JSON.stringify(bloqueados))
  }, [bloqueados])

  async function fetchPokemonData(url) {
    const response = await fetch(url)
    const data = await response.json()
    const speciesResponse = await fetch(data.species.url)
    const speciesData = await speciesResponse.json()
    const evoluciones = await fetchEvolutionNames(speciesData.evolution_chain.url)

    return mapPokeApiToPokemon(data, speciesData, evoluciones)
  }

  async function loadPokemons(nextOffset, append) {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${API_BASE}/pokemon?limit=${PAGE_LIMIT}&offset=${nextOffset}`,
      )
      const data = await response.json()
      const pokemons = await Promise.all(
        data.results.map(async (pokemon) => fetchPokemonData(pokemon.url)),
      )

      const siguienteLista = append ? [...pokemonList, ...pokemons] : pokemons
      const tipos = Array.from(
        new Set(siguienteLista.flatMap((pokemon) => pokemon.tipo)),
      ).sort()

      setPokemonList(siguienteLista)
      setTiposDisponibles(tipos)
      setOffset(nextOffset)
      setHasMore(Boolean(data.next))
    } catch (err) {
      setError('No se pudo cargar la lista de pokémons. Revisa tu conexión.')
    } finally {
      setLoading(false)
    }
  }

  const pokemonsFiltrados = tipoSeleccionado
    ? pokemonList.filter((pokemon) => pokemon.tipo.includes(tipoSeleccionado))
    : pokemonList

  function handleLoadMore() {
    loadPokemons(offset + PAGE_LIMIT, true)
  }

  function toggleFavorito(id) {
    setFavoritos((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  function toggleBloqueado(id) {
    setBloqueados((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
    setFavoritos((current) => current.filter((item) => item !== id))
  }

  async function handleSearch() {
    if (!searchTerm.trim()) {
      return
    }

    setSearchLoading(true)
    setError('')
    setActivePokemon(null)

    try {
      const response = await fetch(
        `${API_BASE}/pokemon/${searchTerm.trim().toLowerCase()}`,
      )
      if (!response.ok) {
        throw new Error('No encontrado')
      }
      const pokemon = await fetchPokemonData(response.url)
      setActivePokemon(pokemon)
    } catch (err) {
      setError('Pokémon no encontrado. Prueba con un Pokémon que sea válido')
    } finally {
      setSearchLoading(false)
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-12 bg-[radial-gradient(circle_at_top_left,_rgba(254,243,199,0.9),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(191,219,254,0.9),_transparent_28%),#f8fafc]">
      <header className="relative flex flex-col items-center gap-8 overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/85 p-10 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,_rgba(255,248,227,0.7),_transparent_35%)] before:pointer-events-none">
        <div className="relative z-10 flex w-full max-w-[880px] flex-col items-center gap-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
            Pokémon World
          </span>
          <h1 className="text-[clamp(2.3rem,2rem+1.4vw,3.4rem)] leading-tight text-slate-900">
            Explora, selecciona y conoce distintos pokémons
          </h1>
          <p className="max-w-[560px] text-slate-500 text-lg leading-8">
            Descubre tipos, habilidades, evoluciones, altura y peso de tus pokémons favoritos.
          </p>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
            onKeyDown={handleKeyDown}
          />
        </div>
      </header>

      <section className="mt-12">
        <div className="mx-auto mb-7 grid max-w-2xl gap-2 text-center">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">
              {activePokemon ? 'Resultado de búsqueda' : 'Pokémons'}
            </h2>
          </div>
          <p className="text-slate-500 leading-7">
            {activePokemon
              ? 'Revisa los datos del pokémon que encontraste.'
              : 'Explora el mundo Pokémon: descubre tipos, habilidades, evoluciones, altura y peso. Marca tus favoritos y bloquea los que menos te gusten.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}
        {searchLoading && (
          <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4 text-sm font-semibold text-sky-700">
            Buscando pokémon...
          </div>
        )}

        {!activePokemon && (
          <div className="mb-10 flex justify-center">
            <FiltroporTipo
              tipos={tiposDisponibles}
              tipoSeleccionado={tipoSeleccionado}
              onSelectTipo={setTipoSeleccionado}
            />
          </div>
        )}

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {loading ? (
            <div className="col-span-full rounded-[18px] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
              Cargando pokémons...
            </div>
          ) : activePokemon ? (
            <PokemonCard
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

        {!activePokemon && hasMore && !loading && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              className="rounded-full bg-red-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-red-500/15 transition hover:bg-red-700"
              onClick={handleLoadMore}
            >
              Cargar más pokémons
            </button>
          </div>
        )}
      </section>

      <footer className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
        <p>Página inicial para fanáticos de Pokémon.</p>
      </footer>
    </main>
  )
}

export default App
