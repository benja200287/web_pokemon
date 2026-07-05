import BotonPokebola from './BotonPokebola.jsx'

function SearchBar({ value, onChange, onSearch, onKeyDown }) {
  return (
    <div className="flex w-full max-w-[680px] flex-col gap-3 sm:flex-row">
      <input
        type="search"
        placeholder="Buscar Pokémon"
        aria-label="Buscar Pokémon"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        className="min-w-0 flex-1 rounded-full border border-slate-300 bg-white px-5 py-4 text-base text-slate-900 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
      />
        <BotonPokebola onClick={onSearch}>
          Buscar
        </BotonPokebola>
    </div>
  )
}

export default SearchBar
