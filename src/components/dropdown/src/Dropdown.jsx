import React, { createContext } from 'react'
import classNames from 'classnames'
import { usePopover } from '../../../hooks/usePopover'
import { useClickOutside } from '../../../hooks/useClickOutside'

export const DropdownContext = createContext(null)

const isMenu = (child) =>
  React.isValidElement(child) && child.type && child.type.displayName === 'AtDropdownMenu'

/**
 * The trigger is the children (everything except a <DropdownMenu>); the menu
 * is the <DropdownMenu> child or the `menu` prop. `onCommand(name)` fires
 * when an item is clicked.
 */
const Dropdown = (props) => {
  const {
    trigger = 'hover',
    placement = 'bottom',
    menu: menuProp,
    value,
    onToggle,
    onCommand,
    className,
    children,
    ...restProps
  } = props

  const {
    show,
    position,
    triggerRef,
    popoverRef,
    triggerProps,
    hidePopover
  } = usePopover({ trigger, placement, value, onToggle })

  const parentRef = useClickOutside(() => {
    if (show && trigger === 'click') hidePopover()
  })

  const nodes = React.Children.toArray(children)
  const menu = menuProp || nodes.find(isMenu)
  const triggerContent = nodes.filter(node => !isMenu(node))

  // Hover and focus act on the whole dropdown so the pointer can travel from
  // the trigger into the menu; click acts on the trigger only.
  const rootProps = trigger === 'click' ? {} : triggerProps
  const triggerElementProps = trigger === 'click' ? triggerProps : {}

  const command = (name) => {
    hidePopover()
    if (onCommand) onCommand(name)
  }

  const setRefs = (el) => {
    triggerRef.current = el
    parentRef.current = el
  }

  return (
    <DropdownContext.Provider value={{ command }}>
      <div
        className={classNames('at-dropdown', className)}
        ref={setRefs}
        {...rootProps}
        {...restProps}
      >
        <div className="at-dropdown__trigger" {...triggerElementProps}>
          {triggerContent}
        </div>

        {show && menu && (
          <div
            className="at-dropdown__popover"
            ref={popoverRef}
            style={{ top: `${position.top}px`, left: `${position.left}px` }}
          >
            {menu}
          </div>
        )}
      </div>
    </DropdownContext.Provider>
  )
}

Dropdown.displayName = 'AtDropdown'

export default Dropdown
