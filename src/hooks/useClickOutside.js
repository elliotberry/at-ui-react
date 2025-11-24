import { useEffect, useRef } from 'react'

export const useClickOutside = (handler) => {
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (evt) => {
      if (ref.current && !ref.current.contains(evt.target)) {
        handler(evt)
      }
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [handler])

  return ref
}

