import { useCallback, useState } from 'react'

const uniqueById = (pokemons) =>
  Array.from(new Map(pokemons.map((pokemon) => [pokemon.id, pokemon])).values())

const normalizeTipos = (pokemons, tiposBase) =>
  Array.from(
    new Set([
      ...pokemons.flatMap((pokemon) => pokemon.tipo.map((tipo) => String(tipo).trim())),
      ...tiposBase.map((tipo) => String(tipo).trim()),
    ]),
  ).sort()

export function usePokemonList({ initialList = [], tiposBase = [], fetchListData, fetchPokemonData, pageLimit = 16, apiBase = '' } = {}) {
  const [pokemonList, setPokemonList] = useState(uniqueById(initialList))
  const [tiposDisponibles, setTiposDisponibles] = useState(normalizeTipos(initialList, tiposBase))
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  const addPokemon = useCallback((pokemon) => {
    if (!pokemon || pokemon.id == null) return

    setPokemonList((current) => {
      const nuevaLista = uniqueById([...current, pokemon])
      setTiposDisponibles(normalizeTipos(nuevaLista, tiposBase))
      return nuevaLista
    })
  }, [tiposBase])

  const loadPokemons = useCallback(async (nextOffset, append = false) => {
    if (!fetchListData || !fetchPokemonData) {
      return
    }

    const response = await fetchListData(
      `${apiBase}/pokemon?limit=${pageLimit}&offset=${nextOffset}`,
    )

    if (!response) {
      return null
    }

    const pokemons = await Promise.all(
      response.results.map(async (pokemon) => fetchPokemonData(pokemon.url)),
    )

    setPokemonList((prevList) => {
      const siguienteLista = append ? [...prevList, ...pokemons] : pokemons
      const listaSinDuplicados = uniqueById(siguienteLista)
      const tipos = normalizeTipos(listaSinDuplicados, tiposBase)

      setTiposDisponibles(tipos)
      setOffset(nextOffset)
      setHasMore(Boolean(response.next))
      return listaSinDuplicados
    })

    return response
  }, [apiBase, fetchListData, fetchPokemonData, pageLimit, tiposBase])

  return {
    pokemonList,
    tiposDisponibles,
    offset,
    hasMore,
    loadPokemons,
    addPokemon,
  }
}
