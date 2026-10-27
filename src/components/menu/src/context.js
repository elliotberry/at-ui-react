import React, { createContext } from 'react'

export const MenuContext = createContext(null)
// Nesting depth of <Submenu>s, 0 at the top level of the menu.
export const SubmenuLevelContext = createContext(0)

/** True when `name` is the name of any MenuItem inside `children`. */
export const containsName = (children, name) => {
  let found = false

  React.Children.forEach(children, (child) => {
    if (found || !React.isValidElement(child)) return

    if (child.type && child.type.displayName === 'AtMenuItem' && child.props.name === name) {
      found = true
    } else if (child.props && child.props.children) {
      found = containsName(child.props.children, name)
    }
  })

  return found
}
