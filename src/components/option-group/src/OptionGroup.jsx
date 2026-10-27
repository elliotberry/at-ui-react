import React from 'react'
import classNames from 'classnames'

const OptionGroup = (props) => {
  const { label, className, children, ...restProps } = props

  return (
    <ul className={classNames('at-option-group', className)} {...restProps}>
      <li className="at-option-group__label">{label}</li>
      <ul className="at-option-group__list">{children}</ul>
    </ul>
  )
}

OptionGroup.displayName = 'AtOptionGroup'

export default OptionGroup
