import React, { useContext, useEffect, useState } from 'react'
import classNames from 'classnames'
import { TabsContext } from './Tabs'
import styles from './TabPane.module.scss'

const TabPane = (props) => {
  const {
    name,
    label,
    icon,
    disabled = false,
    closable: closableProp,
    className,
    children,
    ...restProps
  } = props

  const context = useContext(TabsContext)
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (context) {
      const itemName = name !== undefined ? String(name) : String(label)
      if (context.animated) {
        setShow(true)
      } else {
        setShow(context.activeKey === itemName)
      }
    }
  }, [context?.activeKey, name, label, context?.animated])

  if (!context) {
    console.warn('TabPane must be used within Tabs')
    return null
  }

  const itemName = name !== undefined ? String(name) : String(label)
  const isActive = context.activeKey === itemName

  if (!show && !context.animated) {
    return null
  }

  return (
    <div 
      className={classNames('at-tabs__pane', className, {
        'at-tabs__pane--active': isActive
      })} 
      {...restProps}
    >
      {children}
    </div>
  )
}

TabPane.displayName = 'AtTabPane'

export default TabPane

