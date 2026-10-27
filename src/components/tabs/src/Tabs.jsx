import React, { createContext, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { useSyncedState } from '../../../hooks/useSyncedState'

export const TabsContext = createContext(null)

const isTabPane = (child) =>
  React.isValidElement(child) && child.type && child.type.displayName === 'AtTabPane'

/**
 * `value` is the name of the active pane (panes without a `name` are named by
 * their position: "0", "1", ...). `onChange({ index, name })` fires when the
 * user selects a tab, `onTabRemove({ index, name })` when one is closed.
 */
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

  const [activeKey, setActiveKey] = useSyncedState(valueProp, undefined)
  const [removed, setRemoved] = useState([])
  const [navOffset, setNavOffset] = useState(0)
  const [scrollState, setScrollState] = useState({ prevable: false, nextable: false })
  const navScrollRef = useRef(null)
  const navRef = useRef(null)

  const allPanes = React.Children.toArray(children)
    .filter(isTabPane)
    .map((child, index) => ({
      child,
      name: child.props.name !== undefined ? String(child.props.name) : String(index)
    }))

  // Forget closed tabs once the parent has dropped them from its children.
  // (Give closable panes an explicit `name` so this bookkeeping is reliable.)
  const presentNames = allPanes.map(pane => pane.name)
  if (removed.some(name => !presentNames.includes(name))) {
    setRemoved(removed.filter(name => presentNames.includes(name)))
  }

  const panes = allPanes.filter(pane => !removed.includes(pane.name))

  const navList = panes.map(({ child, name }) => ({
    name,
    label: child.props.label,
    disabled: !!child.props.disabled,
    icon: child.props.icon,
    closable: closable && child.props.closable !== false
  }))

  const currentKey = navList.some(item => item.name === activeKey)
    ? activeKey
    : (navList.find(item => !item.disabled) || navList[0] || {}).name
  const activeIndex = Math.max(navList.findIndex(item => item.name === currentKey), 0)

  const selectIndex = (index) => {
    const item = navList[index]
    if (!item || item.disabled) return
    if (item.name !== currentKey) {
      setActiveKey(item.name)
      if (onChange) onChange({ index, name: item.name })
    }
  }

  const removeIndex = (index) => {
    const item = navList[index]
    if (!item || item.disabled) return

    setRemoved([...removed, item.name])
    if (onTabRemove) onTabRemove({ index, name: item.name })

    if (item.name === currentKey) {
      const enabled = (tab) => !tab.disabled
      const next = navList.slice(index + 1).find(enabled) ||
        navList.slice(0, index).reverse().find(enabled) ||
        navList.find((tab, i) => i !== index)
      if (next) {
        setActiveKey(next.name)
        if (onChange) onChange({ index: navList.indexOf(next), name: next.name })
      }
    }
  }

  // --- overflow scrolling of the tab nav -----------------------------------
  const updateScroll = useCallback(() => {
    const nav = navRef.current
    const container = navScrollRef.current
    if (!nav || !container) return

    const navWidth = nav.offsetWidth
    const containerWidth = container.offsetWidth

    // Only touch state when something changed, otherwise the layout effect
    // below would re-render forever.
    const next = containerWidth < navWidth
      ? { prevable: navOffset !== 0, nextable: navOffset + containerWidth < navWidth }
      : { prevable: false, nextable: false }

    setScrollState(prev =>
      prev.prevable === next.prevable && prev.nextable === next.nextable ? prev : next
    )

    if (containerWidth < navWidth) {
      if (navWidth - navOffset < containerWidth) setNavOffset(navWidth - containerWidth)
    } else if (navOffset > 0) {
      setNavOffset(0)
    }
  }, [navOffset])

  useLayoutEffect(() => {
    updateScroll()
  })

  useEffect(() => {
    window.addEventListener('resize', updateScroll)
    return () => window.removeEventListener('resize', updateScroll)
  }, [updateScroll])

  const scrollable = scrollState.prevable || scrollState.nextable

  const scrollPrev = () => {
    if (!scrollState.prevable) return
    const containerWidth = navScrollRef.current.offsetWidth
    setNavOffset(navOffset > containerWidth ? navOffset - containerWidth : 0)
  }

  const scrollNext = () => {
    if (!scrollState.nextable) return
    const containerWidth = navScrollRef.current.offsetWidth
    const navWidth = navRef.current.offsetWidth
    if (navWidth - navOffset <= containerWidth) return
    setNavOffset(navWidth - navOffset > containerWidth * 2 ? navOffset + containerWidth : navWidth - containerWidth)
  }

  // Keep the active tab inside the visible part of the nav.
  useEffect(() => {
    if (!scrollable || !navScrollRef.current) return
    const activeTab = navScrollRef.current.querySelector('.at-tabs-nav__item--active')
    if (!activeTab) return

    const tabBounds = activeTab.getBoundingClientRect()
    const scrollBounds = navScrollRef.current.getBoundingClientRect()
    if (tabBounds.left < scrollBounds.left) {
      setNavOffset(Math.max(navOffset - (scrollBounds.left - tabBounds.left), 0))
    } else if (tabBounds.right > scrollBounds.right) {
      setNavOffset(navOffset + (tabBounds.right - scrollBounds.right))
    }
    // Only re-run when the active tab changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentKey, scrollable])

  const tabsClasses = classNames(
    'at-tabs',
    {
      'at-tabs--small': size === 'small',
      'at-tabs--card': type === 'card',
      'at-tabs--scroll': scrollable
    },
    className
  )

  const bodyStyle = {
    transform: `translate3d(${animated ? `${-activeIndex * 100}%` : 0}, 0, 0)`
  }

  return (
    <TabsContext.Provider value={{ activeKey: currentKey, animated }}>
      <div className={tabsClasses} {...restProps}>
        <div className="at-tabs__header">
          {extra && <div className="at-tabs__extra">{extra}</div>}
          <div className="at-tabs__nav">
            {scrollable && (
              <>
                <span
                  className={classNames('at-tabs__prev', { 'at-tabs__prev--disabled': !scrollState.prevable })}
                  onClick={scrollPrev}
                >
                  <i className="icon icon-chevron-left" />
                </span>
                <span
                  className={classNames('at-tabs__next', { 'at-tabs__next--disabled': !scrollState.nextable })}
                  onClick={scrollNext}
                >
                  <i className="icon icon-chevron-right" />
                </span>
              </>
            )}
            <div className="at-tabs__nav-wrap">
              <div className="at-tabs__nav-scroll" ref={navScrollRef}>
                <div
                  className="at-tabs-nav"
                  ref={navRef}
                  style={{ transform: `translate3d(-${navOffset}px, 0, 0)` }}
                >
                  {navList.map((item, index) => (
                    <div
                      key={item.name}
                      role="tab"
                      aria-selected={index === activeIndex}
                      className={classNames('at-tabs-nav__item', {
                        'at-tabs-nav__item--active': index === activeIndex,
                        'at-tabs-nav__item--disabled': item.disabled,
                        'at-tabs-nav__item--closable': item.closable
                      })}
                      onClick={() => selectIndex(index)}
                    >
                      {item.icon && <i className={`icon at-tabs-nav__icon ${item.icon}`} />}
                      {item.label}
                      {item.closable && (
                        <span
                          className="at-tabs-nav__close"
                          onClick={(evt) => {
                            evt.stopPropagation()
                            removeIndex(index)
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
        </div>
        <div className="at-tabs__body" style={bodyStyle}>
          {panes.map(({ child, name }) => React.cloneElement(child, { key: name, name }))}
        </div>
      </div>
    </TabsContext.Provider>
  )
}

Tabs.displayName = 'AtTabs'

export default Tabs
