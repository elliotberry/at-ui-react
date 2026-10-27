import React, { useState } from 'react'
import classNames from 'classnames'
import { MenuContext } from './context'
import { useSyncedState } from '../../../hooks/useSyncedState'

/**
 * `activeName` is the `name` of the selected MenuItem and `onSelect(name)`
 * fires when the user picks one.
 */
const Menu = (props) => {
  const {
    mode = 'inline',
    theme = 'light',
    activeName: activeNameProp,
    defaultActiveName,
    inlineCollapsed = false,
    width = '240px',
    onSelect,
    className,
    style,
    children,
    ...restProps
  } = props

  const [activeName, setActiveName] = useSyncedState(activeNameProp, defaultActiveName)
  // Bumped on every selection so open pop-up submenus can close themselves.
  const [selectCount, setSelectCount] = useState(0)

  const select = (name) => {
    setActiveName(name)
    setSelectCount(count => count + 1)
    if (onSelect) onSelect(name)
  }

  const menuStyle = mode === 'inline' || mode === 'vertical' ? { width, ...style } : style

  return (
    <MenuContext.Provider value={{ mode, theme, activeName, inlineCollapsed, select, selectCount }}>
      <ul
        className={classNames(
          'at-menu',
          {
            [`at-menu--${theme}`]: theme,
            [`at-menu--${mode}`]: mode
          },
          className
        )}
        style={menuStyle}
        role="menu"
        {...restProps}
      >
        {children}
      </ul>
    </MenuContext.Provider>
  )
}

Menu.displayName = 'AtMenu'

export default Menu
