import React, { useContext } from 'react'
import classNames from 'classnames'
import { TabsContext } from './Tabs'

/**
 * `label`, `icon`, `disabled` and `closable` are read by the parent <Tabs>
 * to build the tab nav; this component only renders the pane content.
 */
const TabPane = (props) => {
  const {
    name,
    // consumed by <Tabs>
    label, icon, disabled, closable,
    className,
    style,
    children,
    ...restProps
  } = props

  const context = useContext(TabsContext)

  if (!context) {
    console.warn('TabPane must be used within Tabs')
    return null
  }

  const isActive = context.activeKey === String(name)
  const hidden = !context.animated && !isActive

  return (
    <div
      role="tabpanel"
      className={classNames('at-tabs__pane', className, {
        'at-tabs__pane--active': isActive
      })}
      style={hidden ? { ...style, display: 'none' } : style}
      {...restProps}
    >
      {children}
    </div>
  )
}

TabPane.displayName = 'AtTabPane'

export default TabPane
