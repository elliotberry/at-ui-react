import React, { useContext } from 'react'
import classNames from 'classnames'
import { MenuContext } from '../../menu/src/context'

/**
 * Pass `href` (or `to`, as a URL string) to render the item as a link.
 */
const MenuItem = (props) => {
  const {
    name,
    href,
    to,
    disabled = false,
    onClick,
    className,
    children,
    ...restProps
  } = props

  const menu = useContext(MenuContext)

  if (!menu) {
    console.warn('MenuItem must be used within Menu')
    return null
  }

  const link = href || (typeof to === 'string' ? to : undefined)
  const active = name !== undefined && menu.activeName === name

  const handleClick = (evt) => {
    if (disabled) {
      evt.preventDefault()
      return
    }
    if (onClick) onClick(evt)
    menu.select(name)
  }

  return (
    <li
      role="menuitem"
      aria-disabled={disabled}
      className={classNames(
        'at-menu__item',
        {
          'at-menu__item--active': active,
          'at-menu__item--disabled': disabled
        },
        className
      )}
      onClick={handleClick}
      {...restProps}
    >
      {link ? (
        <a className="at-menu__item-link" href={link}>{children}</a>
      ) : (
        <div className="at-menu__item-link">{children}</div>
      )}
    </li>
  )
}

MenuItem.displayName = 'AtMenuItem'

export default MenuItem
