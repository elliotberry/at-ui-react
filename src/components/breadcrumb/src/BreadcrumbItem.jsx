import React, { useContext } from 'react'
import classNames from 'classnames'
import { BreadcrumbContext } from './Breadcrumb'
import styles from './BreadcrumbItem.module.scss'

const BreadcrumbItem = (props) => {
  const {
    href,
    to,
    replace = false,
    onClick,
    className,
    children,
    ...restProps
  } = props

  const { separator } = useContext(BreadcrumbContext)

  const handleClick = (evt) => {
    if (onClick) {
      onClick(evt)
    }

    if (href) {
      window.location.href = href
    } else if (to) {
      // Router navigation - would need react-router integration
      // For now, just prevent default
      evt.preventDefault()
    }
  }

  const breadcrumbItemClasses = classNames('at-breadcrumb__item', className)

  return (
    <span className={breadcrumbItemClasses} {...restProps}>
      {(href || (to && Object.keys(to).length > 0)) ? (
        <a className="at-breadcrumb__link" href={href} onClick={handleClick}>
          {children}
        </a>
      ) : (
        <span className="at-breadcrumb__text">{children}</span>
      )}
      <span className="at-breadcrumb__separator" dangerouslySetInnerHTML={{ __html: separator }} />
    </span>
  )
}

BreadcrumbItem.displayName = 'AtBreadcrumbItem'

export default BreadcrumbItem

