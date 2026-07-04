import { useCallback, useState } from 'react'

export function usePokemonFetch({ initialData = null } = {}) {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchData = useCallback(async (url, options = {}) => {
    if (!url) {
      setError('No se proporcionó una URL de consulta')
      return null
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }
      const json = await response.json()
      setData(json)
      return json
    } catch (err) {
      setError(err.message || 'No se pudo consultar la API')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    data,
    setData,
    loading,
    error,
    setError,
    fetchData,
  }
}
