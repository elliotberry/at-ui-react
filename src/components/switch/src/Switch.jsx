import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import styles from './Switch.module.scss'

const Switch = (props) => {
  const {
    value: valueProp = false,
    disabled = false,
    size,
    checkedText,
    unCheckedText,
    onChange,
    className,
    ...restProps
  } = props

  const [checkStatus, setCheckStatus] = useState(valueProp)

  useEffect(() => {
    setCheckStatus(valueProp)
  }, [valueProp])

  const switchClasses = classNames(
    'at-switch',
    {
      [`at-switch--${size}`]: size,
      'at-switch--disabled': disabled,
      'at-switch--checked': checkStatus
    },
    className
  )

  const toggleSwitch = () => {
    if (disabled) return

    const newValue = !checkStatus
    setCheckStatus(newValue)
    
    if (onChange) {
      onChange(newValue)
    }
  }

  return (
    <span className={switchClasses} onClick={toggleSwitch} {...restProps}>
      <span className="at-switch__text">
        {checkStatus ? checkedText : unCheckedText}
      </span>
    </span>
  )
}

Switch.displayName = 'AtSwitch'

export default Switch

