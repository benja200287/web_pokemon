function FiltroporTipo({ tipos, tipoSeleccionado, onSelectTipo }) {
  return (
    <div className="tipo-filter">
      <label htmlFor="tipo-select">Filtrar por tipo:</label>
      <select
        id="tipo-select"
        value={tipoSeleccionado}
        onChange={(event) => onSelectTipo(event.target.value)}
      >
        <option value="">Todos los tipos</option>
        {tipos.map((tipo) => (
          <option key={tipo} value={tipo}>
            {tipo}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FiltroporTipo
