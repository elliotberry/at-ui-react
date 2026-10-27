import React, { useContext, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { MenuContext, SubmenuLevelContext, containsName } from '../../menu/src/context'
import { useSyncedState } from '../../../hooks/useSyncedState'

const HOVER_DELAY = 200

/**
 * `title` is the clickable heading. `opened` is the initial open state of an
 * inline submenu.
 */
const Submenu = (props) => {
  const {
    title,
    disabled = false,
    opened = false,
    className,
    children,
    ...restProps
  } = props

  const menu = useContext(MenuContext)
  const level = useContext(SubmenuLevelContext)
  const [isOpen, setIsOpen] = useSyncedState(undefined, opened)
  const timerRef = useRef(null)
  const selectCountRef = useRef(menu ? menu.selectCount : 0)

  const mode = menu ? menu.mode : 'inline'

  // Pop-up submenus close after something in the menu is selected.
  useEffect(() => {
    if (!menu) return
    if (menu.selectCount !== selectCountRef.current) {
      selectCountRef.current = menu.selectCount
      if (mode !== 'inline') setIsOpen(false)
    }
  }, [menu, mode, setIsOpen])

  // Switching to a pop-up mode starts with every submenu closed.
  useEffect(() => {
    if (mode !== 'inline') setIsOpen(false)
  }, [mode, setIsOpen])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  if (!menu) {
    console.warn('Submenu must be used within Menu')
    return null
  }

  const active = menu.activeName !== undefined && containsName(children, menu.activeName)
  const inline = mode === 'inline'

  const handleClick = (evt) => {
    evt.stopPropagation()
    if (disabled || !inline) return
    setIsOpen(!isOpen)
  }

  const delayOpen = (next) => {
    if (disabled || inline) return
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setIsOpen(next), HOVER_DELAY)
  }

  // A pop-up opens below a horizontal menu's top level, otherwise to the side.
  const popoverStyle = mode === 'horizontal' && level === 0
    ? { left: 0, top: '100%', marginTop: 2, minWidth: '100%' }
    : { left: '100%', top: 0, marginLeft: 4, minWidth: '100%' }

  return (
    <li
      className={classNames(
        'at-menu__submenu',
        {
          'at-menu__submenu--active': active,
          'at-menu__submenu--opened': isOpen,
          'at-menu__submenu--disabled': disabled
        },
        className
      )}
      onMouseEnter={() => delayOpen(true)}
      onMouseLeave={() => delayOpen(false)}
      {...restProps}
    >
      <div
        className="at-menu__submenu-title"
        role="button"
        aria-expanded={isOpen}
        aria-disabled={disabled}
        onClick={handleClick}
      >
        {title}
        <i className="icon icon-chevron-down at-menu__submenu-icon" />
      </div>

      <SubmenuLevelContext.Provider value={level + 1}>
        {inline ? (
          isOpen && <ul className="at-menu">{children}</ul>
        ) : (
          isOpen && (
            <div className="at-dropdown__popover" style={popoverStyle}>
              <ul className="at-dropdown-menu">{children}</ul>
            </div>
          )
        )}
      </SubmenuLevelContext.Provider>
    </li>
  )
}

Submenu.displayName = 'AtSubmenu'

export default Submenu
