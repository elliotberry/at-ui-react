import React from 'react'
import classNames from 'classnames'

const DropdownMenu = ({ className, children, ...restProps }) => (
  <ul className={classNames('at-dropdown-menu', className)} {...restProps}>
    {children}
  </ul>
)

DropdownMenu.displayName = 'AtDropdownMenu'

export default DropdownMenu
