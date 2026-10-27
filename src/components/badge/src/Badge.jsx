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

  let content = null
  if (!dot) {
    content = typeof value === 'number' && typeof maxNum === 'number' && value > maxNum
      ? `${maxNum}+`
      : value
  }

  const hasChildren = children !== undefined && children !== null && children !== false

  return (
    <span
      className={classNames(
        'at-badge',
        `at-badge--${status}`,
        { 'at-badge--alone': !hasChildren },
        className
      )}
      {...restProps}
    >
      {children}
      {show && (
        <sup className={classNames('at-badge__content', { 'at-badge--corner': hasChildren, 'at-badge--dot': dot })}>
          {content}
        </sup>
      )}
    </span>
  )
}

Badge.displayName = 'AtBadge'

export default Badge
