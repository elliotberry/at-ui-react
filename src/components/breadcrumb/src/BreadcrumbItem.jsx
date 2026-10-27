import React, { useContext } from 'react'
import classNames from 'classnames'
import { BreadcrumbContext } from './Breadcrumb'

/**
 * Renders a link when `href` is given. For client-side routing pass your own
 * `onClick` (e.g. calling the router's navigate) together with `href`.
 */
const BreadcrumbItem = (props) => {
  const {
    href,
    target,
    onClick,
    className,
    children,
    ...restProps
  } = props

  const { separator = '/' } = useContext(BreadcrumbContext)

  return (
    <span className={classNames('at-breadcrumb__item', className)} {...restProps}>
      {href ? (
        <a className="at-breadcrumb__link" href={href} target={target} onClick={onClick}>
          {children}
        </a>
      ) : (
        <span className="at-breadcrumb__text" onClick={onClick}>{children}</span>
      )}
      <span className="at-breadcrumb__separator">{separator}</span>
    </span>
  )
}

BreadcrumbItem.displayName = 'AtBreadcrumbItem'

export default BreadcrumbItem
