import React, { createContext } from 'react'
import classNames from 'classnames'
import { useSyncedState } from '../../../hooks/useSyncedState'

export const CollapseContext = createContext(null)

const normalize = (val) => {
  if (val === undefined || val === null || val === '') return []
  return (Array.isArray(val) ? val : [val]).map(String)
}

const isItem = (child) =>
  React.isValidElement(child) && child.type && child.type.displayName === 'AtCollapseItem'

/**
 * `value` is the name (or array of names) of the open items. Items without a
 * `name` are named by their position ("0", "1", ...). `onChange(names)` always
 * receives an array of names.
 */
const Collapse = (props) => {
  const {
    accordion = false,
    value: valueProp,
    defaultValue,
    simple = false,
    onChange,
    className,
    children,
    ...restProps
  } = props

  const [rawValue, setRawValue] = useSyncedState(valueProp, defaultValue)

  let activeKeys = normalize(rawValue)
  if (accordion && activeKeys.length > 1) activeKeys = [activeKeys[0]]

  const toggle = (name) => {
    const isActive = activeKeys.includes(name)
    let next

    if (accordion) {
      next = isActive ? [] : [name]
    } else {
      next = isActive ? activeKeys.filter(key => key !== name) : [...activeKeys, name]
    }

    setRawValue(next)
    if (onChange) onChange(next)
  }

  let index = -1

  return (
    <div
      className={classNames('at-collapse', { 'at-collapse--simple': simple }, className)}
      {...restProps}
    >
      {React.Children.toArray(children).map((child) => {
        if (!isItem(child)) return child

        index += 1
        const name = child.props.name !== undefined ? String(child.props.name) : String(index)

        return (
          <CollapseContext.Provider
            key={child.key || index}
            value={{ name, isActive: activeKeys.includes(name), toggle }}
          >
            {child}
          </CollapseContext.Provider>
        )
      })}
    </div>
  )
}

Collapse.displayName = 'AtCollapse'

export default Collapse
