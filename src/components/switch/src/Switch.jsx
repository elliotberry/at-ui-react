import React from 'react'
import classNames from 'classnames'
import { useFormItem } from '../../../hooks/useFormItem'
import { useSyncedState } from '../../../hooks/useSyncedState'

const Switch = (props) => {
  const {
    value: valueProp,
    defaultValue = false,
    disabled = false,
    size,
    checkedText,
    unCheckedText,
    onChange,
    onClick,
    className,
    ...restProps
  } = props

  const [checked, setChecked] = useSyncedState(valueProp, defaultValue)
  const formItem = useFormItem()

  const switchClasses = classNames(
    'at-switch',
    {
      [`at-switch--${size}`]: size,
      'at-switch--disabled': disabled,
      'at-switch--checked': checked
    },
    className
  )

  const toggle = (evt) => {
    if (onClick) onClick(evt)
    if (disabled) return

    const next = !checked
    setChecked(next)
    if (onChange) onChange(next)
    if (formItem) formItem.onChange(next)
  }

  const handleKeyDown = (evt) => {
    if (evt.key === ' ' || evt.key === 'Enter') {
      evt.preventDefault()
      toggle(evt)
    }
  }

  return (
    <span
      role="switch"
      aria-checked={!!checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      className={switchClasses}
      {...restProps}
      onClick={toggle}
      onKeyDown={handleKeyDown}
    >
      <span className="at-switch__text">
        {checked ? checkedText : unCheckedText}
      </span>
    </span>
  )
}

Switch.displayName = 'AtSwitch'

export default Switch
