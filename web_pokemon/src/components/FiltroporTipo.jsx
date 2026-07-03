function FiltroporTipo({ tipos, tipoSeleccionado, onSelectTipo }) {
  return (
    <div className="mb-7 w-full max-w-[420px] rounded-[24px] border border-slate-200/80 bg-white/90 p-5 shadow-lg shadow-slate-200/40 backdrop-blur-sm">
      <label htmlFor="tipo-select" className="mb-3 block text-base font-semibold text-slate-800">
        Filtrar por tipo:
      </label>
      <select
        id="tipo-select"
        value={tipoSeleccionado}
        onChange={(event) => onSelectTipo(event.target.value)}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition duration-200 ease-in-out focus:border-red-400 focus:ring-2 focus:ring-red-100"
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
