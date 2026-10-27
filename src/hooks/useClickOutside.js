import { useEffect, useRef } from 'react'

/**
 * Calls `handler` when a click happens outside the element holding the
 * returned ref. The latest handler is always used without re-subscribing.
 */
export const useClickOutside = (handler) => {
  const ref = useRef(null)
  const handlerRef = useRef(handler)

  useEffect(() => {
    handlerRef.current = handler
  })

  useEffect(() => {
    const handleClick = (evt) => {
      if (ref.current && !ref.current.contains(evt.target)) {
        handlerRef.current && handlerRef.current(evt)
      }
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return ref
}
