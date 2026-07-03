import { useEffect, useState } from 'react'
import PokemonCard from './components/PokemonCard.jsx'
import SearchBar from './components/SearchBar.jsx'
import { mapPokeApiToPokemon, fetchEvolutionNames } from './data/pokemon.js'
import './App.css'

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

  useEffect(() => {
    loadPokemons(0, false)
  }, [])

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
      setPokemonList((current) => (append ? [...current, ...pokemons] : pokemons))
      setOffset(nextOffset)
      setHasMore(Boolean(data.next))
    } catch (err) {
      setError('No se pudo cargar la lista de pokémons. Revisa tu conexión.')
    } finally {
      setLoading(false)
    }
  }

  function handleLoadMore() {
    loadPokemons(offset + PAGE_LIMIT, true)
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
    <main className="app-shell">
      <header className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Pokémon World</span>
          <h1>Explora, selecciona y conoce distintos pokémons</h1>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
            onKeyDown={handleKeyDown}
          />
        </div>
      </header>

      <section className="featured-section">
        <div className="section-heading">
          <h2>{activePokemon ? 'Resultado de búsqueda' : 'Pokémons'}</h2>
          <p>
            {activePokemon
              ? 'Revisa los datos del pokémon que encontraste.'
              : 'Explora el mundo Pokémon: descubre tipos, habilidades, evoluciones, altura y peso. Marca tus favoritos y bloquea los que menos te gusten.'}
          </p>
        </div>

        {error && <div className="status-banner status-error">{error}</div>}
        {searchLoading && (
          <div className="status-banner status-loading">Buscando pokémon...</div>
        )}

        <div className="card-grid">
          {loading ? (
            <div className="loading-card">Cargando pokémons...</div>
          ) : activePokemon ? (
            <PokemonCard
              nombre={activePokemon.nombre}
              tipo={activePokemon.tipo}
              habilidad={activePokemon.habilidad.join(', ')}
              evoluciones={activePokemon.evoluciones}
              imagen={activePokemon.imagen}
              altura={activePokemon.altura}
              peso={activePokemon.peso}
            />
          ) : (
            pokemonList.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                nombre={pokemon.nombre}
                tipo={pokemon.tipo}
                habilidad={pokemon.habilidad.join(', ')}
                evoluciones={pokemon.evoluciones}
                imagen={pokemon.imagen}
                altura={pokemon.altura}
                peso={pokemon.peso}
              />
            ))
          )}
        </div>

        {!activePokemon && hasMore && !loading && (
          <div className="load-more-wrapper">
            <button type="button" className="load-more-button" onClick={handleLoadMore}>
              Cargar más pokémons
            </button>
          </div>
        )}
      </section>

      <footer className="page-footer">
        <p>Página inicial para fanáticos de Pokémon.</p>
      </footer>
    </main>
  )
}

export default App
