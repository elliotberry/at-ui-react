import React, { useContext, useState, useEffect } from 'react'
import classNames from 'classnames'
import { CollapseContext } from './Collapse'
import styles from './CollapseItem.module.scss'

const CollapseItem = (props) => {
  const {
    title,
    name,
    disabled = false,
    className,
    children,
    ...restProps
  } = props

  const context = useContext(CollapseContext)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (context) {
      const itemName = name !== undefined ? String(name) : undefined
      setIsActive(context.activeKeys.includes(itemName))
    }
  }, [context?.activeKeys, name])

  const toggle = () => {
    if (disabled || !context) return

    const itemName = name !== undefined ? String(name) : undefined
    context.toggle(itemName)
  }

  const collapseItemClasses = classNames(
    'at-collapse__item',
    {
      'at-collapse__item--active': isActive,
      'at-collapse__item--disabled': disabled
    },
    className
  )

  return (
    <div className={collapseItemClasses} {...restProps}>
      <div className="at-collapse__header" onClick={toggle}>
        <i className="icon at-collapse__icon icon-chevron-right" />
        {title && <div>{title}</div>}
      </div>
      {isActive && (
        <div className="at-collapse__body">
          <div className="at-collapse__content">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

CollapseItem.displayName = 'AtCollapseItem'

export default CollapseItem

