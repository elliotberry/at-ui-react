import { useEffect, useState } from 'react'

/**
 * Keeps an element mounted long enough to play its leave animation.
 *
 * Returns `{ mounted, phase }` where `phase` is 'enter', 'leave' or null. Use
 * it to add `${name}-${phase}-active` classes (see the animation stylesheet).
 */
export const usePresence = (open, duration = 300) => {
  const [mounted, setMounted] = useState(!!open)
  const [phase, setPhase] = useState(open ? 'enter' : null)
  const [prevOpen, setPrevOpen] = useState(!!open)

  if (!!open !== prevOpen) {
    setPrevOpen(!!open)
    if (open) {
      setMounted(true)
      setPhase('enter')
    } else {
      setPhase('leave')
    }
  }

  useEffect(() => {
    if (phase !== 'leave') return
    const timer = setTimeout(() => {
      setMounted(false)
      setPhase(null)
    }, duration)
    return () => clearTimeout(timer)
  }, [phase, duration])

  return { mounted, phase }
}

export const transitionClass = (name, phase) => (phase ? `${name}-${phase}-active` : '')
