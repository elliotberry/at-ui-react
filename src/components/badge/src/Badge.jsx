import React from 'react'
import classNames from 'classnames'

const Badge = (props) => {
  const {
    value = '',
    maxNum = 99,
    dot = false,
    show = true,
    status = 'error',
    className,
    children,
    ...restProps
  } = props

  const getContent = () => {
    if (dot) return null

    if (typeof value === 'number' && typeof maxNum === 'number') {
      return value > maxNum ? `${maxNum}+` : value
    }

    return value
  }

  const content = getContent()
  const hasChildren = !!children

  const contentClasses = classNames(
    'at-badge__content',
    {
      'at-badge--corner': hasChildren,
      'at-badge--dot': dot
    }
  )

  return (
    <span className={`at-badge at-badge--${status} ${hasChildren ? 'at-badge--corner' : 'at-badge--alone'} ${className}`} {...restProps}>
      {children}
      {show && (
        <sup className={contentClasses}>
          {content}
        </sup>
      )}
    </span>
  )
}

Badge.displayName = 'ATBadge'

export default Badge

