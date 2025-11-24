import React, { createContext } from 'react'
import classNames from 'classnames'
import styles from './Breadcrumb.module.scss'

export const BreadcrumbContext = createContext({})

const Breadcrumb = (props) => {
  const {
    separator = '/',
    className,
    children,
    ...restProps
  } = props

  const breadcrumbClasses = classNames('at-breadcrumb', className)

  return (
    <BreadcrumbContext.Provider value={{ separator }}>
      <div className={breadcrumbClasses} {...restProps}>
        {children}
      </div>
    </BreadcrumbContext.Provider>
  )
}

Breadcrumb.displayName = 'AtBreadcrumb'

export default Breadcrumb

