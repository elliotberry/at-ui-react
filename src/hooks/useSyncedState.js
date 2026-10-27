import { useRef, useState } from 'react'

/**
 * State that follows a `value` prop (like Vue's v-model) but can also be
 * changed locally. When `value` is `undefined` the component is uncontrolled
 * and starts from `defaultValue`.
 *
 * The prop is synchronised during render, so there is never a frame where the
 * UI shows a stale value.
 */
export const useSyncedState = (value, defaultValue) => {
  const [state, setState] = useState(value !== undefined ? value : defaultValue)
  const previous = useRef(value)

  if (previous.current !== value) {
    previous.current = value
    if (value !== undefined && value !== state) {
      setState(value)
    }
  }

  return [state, setState]
}

export default useSyncedState
