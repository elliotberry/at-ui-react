import React, { useState, useEffect, useContext, createContext } from 'react'
import classNames from 'classnames'
import styles from './Checkbox.module.scss'

export const CheckboxGroupContext = createContext(null)

const Checkbox = (props) => {
  const {
    value: valueProp,
    label,
    name,
    checked: checkedProp,
    disabled = false,
    onChange,
    className,
    children,
    ...restProps
  } = props

  const groupContext = useContext(CheckboxGroupContext)
  const isGroup = !!groupContext

  const [currentValue, setCurrentValue] = useState(valueProp || checkedProp || false)
  const [focus, setFocus] = useState(false)

  useEffect(() => {
    if (isGroup) {
      // In group mode, value is controlled by parent
      const isChecked = Array.isArray(groupContext.value) && groupContext.value.includes(label)
      setCurrentValue(isChecked)
    } else {
      setCurrentValue(valueProp !== undefined ? valueProp : checkedProp || false)
    }
  }, [valueProp, checkedProp, isGroup, groupContext?.value, label])

  const checkboxClasses = classNames(
    'at-checkbox',
    {
      'at-checkbox--focus': focus,
      'at-checkbox--checked': currentValue,
      'at-checkbox--disabled': disabled
    },
    className
  )

  const handleChange = (evt) => {
    if (disabled) return

    const checked = evt.target.checked
    
    if (isGroup) {
      // Group mode: let parent handle the change
      if (groupContext.onChange) {
        groupContext.onChange(label, checked)
      }
    } else {
      // Single mode
      setCurrentValue(checked)
      if (onChange) {
        onChange(checked, evt)
      }
    }
  }

  const handleFocus = () => setFocus(true)
  const handleBlur = () => setFocus(false)

  return (
    <label className={checkboxClasses}>
      <span className="at-checkbox__input">
        <span className="at-checkbox__inner" />
        <input
          type="checkbox"
          className="at-checkbox__original"
          name={name}
          value={isGroup ? label : undefined}
          checked={currentValue}
          disabled={disabled}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...restProps}
        />
      </span>
      <span className="at-checkbox__label">
        {children || label}
      </span>
    </label>
  )
}

Checkbox.displayName = 'AtCheckbox'

export default Checkbox

