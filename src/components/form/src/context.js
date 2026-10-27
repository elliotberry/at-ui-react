import { createContext } from 'react'

export const FormContext = createContext(null)

/**
 * Reads `model[path]` where path may be nested ("user.name" or "list[0].id").
 * Returns undefined when any part of the path is missing.
 */
export const getPropByPath = (obj, path) => {
  if (!obj || !path) return undefined

  const keys = String(path).replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '').split('.')
  let current = obj

  for (const key of keys) {
    if (current === null || current === undefined) return undefined
    current = current[key]
  }
  return current
}
