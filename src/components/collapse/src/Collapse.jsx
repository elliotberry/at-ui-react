import React, { useState, useEffect, createContext } from 'react'
import classNames from 'classnames'

export const CollapseContext = createContext(null)

const Collapse = (props) => {
  const {
    accordion = false,
    value: valueProp,
    simple = false,
    onChange,
    className,
    children,
    ...restProps
  } = props

  const [currentValue, setCurrentValue] = useState(() => {
    if (Array.isArray(valueProp)) {
      return valueProp.map(v => String(v))
    }
    return valueProp ? [String(valueProp)] : []
  })

  useEffect(() => {
    let newValue = valueProp
    if (Array.isArray(newValue)) {
      newValue = newValue.map(v => String(v))
    } else if (newValue !== undefined && newValue !== null) {
      newValue = [String(newValue)]
    } else {
      newValue = []
    }
    setCurrentValue(newValue)
  }, [valueProp])

  const getActiveKey = () => {
    let activeKey = [...currentValue]
    
    if (accordion && activeKey.length > 1) {
      activeKey = [activeKey[0]]
    }

    return activeKey
  }

  const toggle = (name) => {
    const nameStr = String(name)
    let newActiveKey = []

    if (accordion) {
      const isActive = currentValue.includes(nameStr)
      newActiveKey = isActive ? [] : [nameStr]
    } else {
      const activeKey = [...currentValue]
      const nameIndex = activeKey.indexOf(nameStr)

      if (nameIndex >= 0) {
        activeKey.splice(nameIndex, 1)
      } else {
        activeKey.push(nameStr)
      }
      newActiveKey = activeKey
    }

    setCurrentValue(newActiveKey)
    if (onChange) {
      onChange(accordion ? newActiveKey[0] : newActiveKey)
    }
  }

  const contextValue = {
    activeKeys: getActiveKey(),
    toggle,
    accordion
  }

  const collapseClasses = classNames(
    'at-collapse',
    {
      'at-collapse--simple': simple
    },
    className
  )

  return (
    <CollapseContext.Provider value={contextValue}>
      <div className={collapseClasses} {...restProps}>
        {children}
      </div>
    </CollapseContext.Provider>
  )
}

Collapse.displayName = 'AtCollapse'

export default Collapse

