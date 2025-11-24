import React, { useState, useEffect, createContext, useRef } from 'react'
import classNames from 'classnames'
import TabPane from './TabPane'
import styles from './Tabs.module.scss'

export const TabsContext = createContext(null)

const Tabs = (props) => {
  const {
    value: valueProp,
    type = 'line',
    size = 'default',
    closable = false,
    animated = true,
    onChange,
    onTabRemove,
    className,
    extra,
    children,
    ...restProps
  } = props

  const [activeKey, setActiveKey] = useState(valueProp)
  const [navList, setNavList] = useState([])

  useEffect(() => {
    if (valueProp !== undefined) {
      setActiveKey(valueProp)
    }
  }, [valueProp])

  useEffect(() => {
    // Build nav list from children
    const childrenArray = React.Children.toArray(children)
    const navItems = childrenArray
      .filter(child => child.type?.displayName === 'AtTabPane' || child.type === TabPane)
      .map((child, index) => ({
        label: child.props.label || `Tab ${index + 1}`,
        name: child.props.name !== undefined ? String(child.props.name) : String(index),
        disabled: child.props.disabled || false,
        icon: child.props.icon,
        closable: child.props.closable !== undefined ? child.props.closable : closable
      }))
    
    setNavList(navItems)
    
    // Set default active key if not set
    if (!activeKey && navItems.length > 0) {
      setActiveKey(navItems[0].name)
    }
  }, [children, closable, activeKey])

  const tabsClasses = classNames(
    'at-tabs',
    {
      'at-tabs--small': size === 'small',
      'at-tabs--card': type === 'card'
    },
    className
  )

  const activeIndex = navList.findIndex(item => item.name === activeKey)

  const tabsBodyTranslateStyle = animated
    ? { transform: `translate3d(${-activeIndex * 100}%, 0, 0)` }
    : {}

  const setNavByIndex = (index) => {
    const item = navList[index]
    if (!item.disabled) {
      setActiveKey(item.name)
      if (onChange) {
        onChange({ index, name: item.name })
      }
    }
  }

  const removeHandle = (index) => {
    const item = navList[index]
    if (item.disabled) return

    const newNavList = navList.filter((_, i) => i !== index)
    setNavList(newNavList)

    if (onTabRemove) {
      onTabRemove({ index, name: item.name })
    }

    if (item.name === activeKey && newNavList.length > 0) {
      const nextItem = newNavList[index] || newNavList[index - 1] || newNavList[0]
      setActiveKey(nextItem.name)
    }
  }

  const contextValue = {
    activeKey,
    setActiveKey,
    closable,
    animated,
    updateNav: (navItems) => {
      setNavList(navItems)
      if (!activeKey && navItems.length > 0) {
        setActiveKey(navItems[0].name)
      }
    }
  }

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={tabsClasses} {...restProps}>
        <div className="at-tabs__header">
          {extra && (
            <div className="at-tabs__extra">{extra}</div>
          )}
          <div className="at-tabs__nav">
            <div className="at-tabs__nav-wrap">
              <div className="at-tabs-nav">
                {navList.map((item, index) => (
                  <div
                    key={index}
                    className={classNames('at-tabs-nav__item', {
                      'at-tabs-nav__item--active': index === activeIndex,
                      'at-tabs-nav__item--disabled': item.disabled,
                      'at-tabs-nav__item--closable': item.closable
                    })}
                    onClick={() => setNavByIndex(index)}
                  >
                    {item.icon && (
                      <i className={`icon at-tabs-nav__icon ${item.icon}`} />
                    )}
                    {item.label}
                    {item.closable && (
                      <span
                        className="at-tabs-nav__close"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeHandle(index)
                        }}
                      >
                        <i className="icon icon-x" />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="at-tabs__body" style={tabsBodyTranslateStyle}>
          {children}
        </div>
      </div>
    </TabsContext.Provider>
  )
}

Tabs.displayName = 'AtTabs'

export default Tabs

