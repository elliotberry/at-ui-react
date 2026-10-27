import React from 'react'
import classNames from 'classnames'

const MenuItemGroup = ({ title = '', className, children, ...restProps }) => (
  <ul className={classNames('at-menu__item-group', className)} {...restProps}>
    <li className="at-menu__item-group-title">{title}</li>
    <ul className="at-menu__item-group-list">{children}</ul>
  </ul>
)

MenuItemGroup.displayName = 'AtMenuItemGroup'

export default MenuItemGroup
