function SearchBar({ value, onChange, onSearch, onKeyDown }) {
  return (
    <div className="search-bar">
      <input
        type="search"
        placeholder="Buscar Pokémon"
        aria-label="Buscar Pokémon"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
      />
      <button type="button" onClick={onSearch}>
        Buscar
      </button>
    </div>
  )
}

export default SearchBar
