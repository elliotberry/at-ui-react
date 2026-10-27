import React, { createContext } from 'react'

export const SelectContext = createContext(null)

const textOf = (node) => {
  if (node === null || node === undefined || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (React.isValidElement(node)) return textOf(node.props.children)
  return ''
}

export const getOptionLabel = ({ label, children, value }) => {
  if (label !== undefined && label !== null && label !== '') return String(label)
  const text = textOf(children)
  return text !== '' ? text : String(value)
}

/**
 * Walks the Select's children and returns the flat list of options, looking
 * through OptionGroups and Fragments.
 */
export const collectOptions = (children, out = []) => {
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return

    if (child.type && child.type.displayName === 'AtOption') {
      out.push({
        value: child.props.value,
        label: getOptionLabel(child.props),
        disabled: !!child.props.disabled
      })
    } else if (child.props && child.props.children) {
      collectOptions(child.props.children, out)
    }
  })
  return out
}
