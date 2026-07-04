const typeTranslations = {
  normal: 'Normal',
  fighting: 'Lucha',
  flying: 'Volador',
  poison: 'Veneno',
  ground: 'Tierra',
  rock: 'Roca',
  bug: 'Bicho',
  ghost: 'Fantasma',
  steel: 'Acero',
  fire: 'Fuego',
  water: 'Agua',
  grass: 'Planta',
  electric: 'Eléctrico',
  psychic: 'Psíquico',
  ice: 'Hielo',
  dragon: 'Dragón',
  dark: 'Siniestro',
  fairy: 'Hada',
  unknown: 'Desconocido',
  shadow: 'Sombra',
}

export const pokemonTemplate = {
  id: null,
  nombre: '',
  tipo: [],
  habilidad: [],
  evoluciones: [],
  imagen: '',
  altura: 0,
  peso: 0,
}

function traducirTipo(tipo) {
  return typeTranslations[tipo] ?? tipo
}

function extraerNombreEspanol(nombres) {
  return (
    nombres?.find((item) => item.language?.name === 'es')?.name ||
    nombres?.[0]?.name ||
    ''
  )
}

async function getSpanishAbilityName(url) {
  const response = await fetch(url)
  const data = await response.json()
  return (
    extraerNombreEspanol(data.names) ||
    data.name ||
    'Desconocida'
  )
}

export async function mapPokeApiToPokemon(apiData, speciesData, evolutionNames) {
  const nombreEspanol = extraerNombreEspanol(speciesData.names) || apiData.name

  const habilidad = await Promise.all(
    apiData.abilities.map(async (item) =>
      getSpanishAbilityName(item.ability.url),
    ),
  )

  return {
    id: apiData.id,
    nombre: nombreEspanol,
    imagen:
      apiData.sprites.other['official-artwork'].front_default ||
      apiData.sprites.front_default ||
      '',
    tipo: apiData.types
      .map((item) => traducirTipo(item.type.name))
      .map((tipo) => String(tipo).trim())
      .filter(Boolean),
    habilidad,
    altura: apiData.height,
    peso: apiData.weight,
    evoluciones: evolutionNames,
  }
}

async function getSpanishSpeciesName(speciesUrl) {
  const response = await fetch(speciesUrl)
  const data = await response.json()
  return extraerNombreEspanol(data.names) || data.name
}

export async function fetchEvolutionNames(chainUrl) {
  const response = await fetch(chainUrl)
  const data = await response.json()

  const names = []
  async function collectEvolution(node) {
    if (!node) return
    names.push(await getSpanishSpeciesName(node.species.url))
    if (node.evolves_to?.length) {
      await collectEvolution(node.evolves_to[0])
    }
  }

  await collectEvolution(data.chain)
  return names
}
