import BotonPokebola from './BotonPokebola.jsx'

function BotonVolverInicio({ children = 'Volver al inicio', setVistaActiva, setSearchActive, setActivePokemon, onClick, className = '' }) {
  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick()
      return
    }
    if (typeof setVistaActiva === 'function') setVistaActiva('inicio')
    if (typeof setSearchActive === 'function') setSearchActive(false)
    if (typeof setActivePokemon === 'function') setActivePokemon(null)
  }

  return (
    <BotonPokebola onClick={handleClick} className={className}>
      {children}
    </BotonPokebola>
  )
}

export default BotonVolverInicio
