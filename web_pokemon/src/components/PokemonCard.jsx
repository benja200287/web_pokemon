function PokemonCard({ nombre, tipo, habilidad, evoluciones, imagen, altura, peso }) {
  return (
    <article className="pokemon-card">
      <div className="pokemon-avatar">
        {imagen ? (
          <img src={imagen} alt={nombre} />
        ) : (
          <span>{nombre?.[0]?.toUpperCase() || 'P'}</span>
        )}
      </div>
      <h3>{nombre}</h3>
      <div className="type-badges">
        {Array.isArray(tipo)
          ? tipo.map((type) => (
              <span key={type} className="type-pill">
                {type}
              </span>
            ))
          : (
            <span className="type-pill">{tipo}</span>
          )}
      </div>
      <p className="pokemon-detail">
        <strong>Habilidad:</strong> {habilidad}
      </p>
      <p className="pokemon-detail">
        <strong>Evoluciones:</strong> {evoluciones?.join(', ') || 'Ninguna'}
      </p>
      <p className="pokemon-detail">
        <strong>Altura:</strong> {altura / 10} m · <strong>Peso:</strong> {peso / 10} kg
      </p>
    </article>
  )
}

export default PokemonCard
