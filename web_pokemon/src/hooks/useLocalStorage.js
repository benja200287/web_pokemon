import { useEffect, useState } from 'react'

const getStoredValue = (key, initialValue) => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return typeof initialValue === 'function' ? initialValue() : initialValue
  }

  try {
    const stored = window.localStorage.getItem(key)
    return stored ? JSON.parse(stored) : typeof initialValue === 'function' ? initialValue() : initialValue
  } catch {
    return typeof initialValue === 'function' ? initialValue() : initialValue
  }
}

export function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => getStoredValue(key, initialValue))

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // ignore write failures
    }
  }, [key, state])

  return [state, setState]
}
