import React, { useContext } from 'react'
import classNames from 'classnames'
import { DropdownContext } from '../../dropdown/src/Dropdown'

const DropdownItem = (props) => {
  const {
    name,
    disabled = false,
    divided = false,
    onClick,
    className,
    children,
    ...restProps
  } = props

  const context = useContext(DropdownContext)

  const handleClick = (evt) => {
    evt.stopPropagation()
    if (disabled) return
    if (onClick) onClick(evt)
    if (context) context.command(name)
  }

  return (
    <li
      role="menuitem"
      aria-disabled={disabled}
      className={classNames(
        'at-dropdown-menu__item',
        {
          'at-dropdown-menu__item--disabled': disabled,
          'at-dropdown-menu__item--divided': divided
        },
        className
      )}
      {...restProps}
      onClick={handleClick}
    >
      {children}
    </li>
  )
}

DropdownItem.displayName = 'AtDropdownItem'

export default DropdownItem
