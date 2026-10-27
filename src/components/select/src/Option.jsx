import React, { useContext } from 'react'
import classNames from 'classnames'
import { SelectContext, getOptionLabel } from './context'

const Option = (props) => {
  const {
    value,
    label,
    disabled = false,
    className,
    children,
    ...restProps
  } = props

  const ctx = useContext(SelectContext)

  if (!ctx) {
    console.warn('Option must be used within Select')
    return null
  }

  if (ctx.isHidden(value)) return null

  return (
    <li
      role="option"
      aria-selected={ctx.isSelected(value)}
      aria-disabled={disabled}
      className={classNames(
        'at-select__option',
        {
          'at-select__option--disabled': disabled,
          'at-select__option--selected': ctx.isSelected(value),
          'at-select__option--focus': ctx.focusValue === value
        },
        className
      )}
      {...restProps}
      onClick={(evt) => {
        evt.stopPropagation()
        if (!disabled) ctx.select(value)
      }}
      onMouseLeave={() => ctx.setFocusValue(undefined)}
    >
      {children !== undefined ? children : getOptionLabel({ label, value })}
    </li>
  )
}

Option.displayName = 'AtOption'

export default Option
