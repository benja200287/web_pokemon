function BotonPokebola({ children, onClick, type = 'button', className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-red-600 to-white px-5 py-3 text-sm font-extrabold text-black shadow-xl hover:scale-105 transition-transform duration-200 border-2 border-black ${className}`}
    >
      {children}
    </button>
  )
}

export default BotonPokebola
