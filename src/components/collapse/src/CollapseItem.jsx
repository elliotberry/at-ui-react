import React, { useContext } from 'react'
import classNames from 'classnames'
import { CollapseContext } from './Collapse'

const CollapseItem = (props) => {
  const {
    title,
    // consumed by <Collapse>
    name,
    disabled = false,
    className,
    children,
    ...restProps
  } = props

  const context = useContext(CollapseContext)

  if (!context) {
    console.warn('CollapseItem must be used within Collapse')
    return null
  }

  const { isActive } = context

  const handleToggle = () => {
    if (!disabled) context.toggle(context.name)
  }

  return (
    <div
      className={classNames(
        'at-collapse__item',
        {
          'at-collapse__item--active': isActive,
          'at-collapse__item--disabled': disabled
        },
        className
      )}
      {...restProps}
    >
      <div
        className="at-collapse__header"
        role="button"
        aria-expanded={isActive}
        aria-disabled={disabled}
        onClick={handleToggle}
      >
        <i className="icon at-collapse__icon icon-chevron-right" />
        <div>{title}</div>
      </div>
      {isActive && (
        <div className="at-collapse__body">
          <div className="at-collapse__content">{children}</div>
        </div>
      )}
    </div>
  )
}

CollapseItem.displayName = 'AtCollapseItem'

export default CollapseItem
