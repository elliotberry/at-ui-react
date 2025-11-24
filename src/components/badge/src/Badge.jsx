import React from 'react'
import classNames from 'classnames'
import styles from './Badge.module.scss'

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

  const badgeClasses = classNames(
    'at-badge',
    {
      [`at-badge--${status}`]: status,
      'at-badge--alone': !hasChildren
    },
    className
  )

  const contentClasses = classNames(
    'at-badge__content',
    {
      'at-badge--corner': hasChildren,
      'at-badge--dot': dot
    }
  )

  return (
    <span className={badgeClasses} {...restProps}>
      {children}
      {show && (
        <sup className={contentClasses}>
          {content}
        </sup>
      )}
    </span>
  )
}

Badge.displayName = 'AtBadge'

export default Badge

