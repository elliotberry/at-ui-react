import React, { useState, useEffect, useContext, createContext } from 'react'
import classNames from 'classnames'

export const RadioGroupContext = createContext(null)

const Radio = (props) => {
  const {
    value: valueProp,
    name,
    label,
    disabled = false,
    onChange,
    className,
    children,
    ...restProps
  } = props

  const groupContext = useContext(RadioGroupContext)
  const isGroup = !!groupContext

  const [store, setStore] = useState(valueProp)
  const [focus, setFocus] = useState(false)

  useEffect(() => {
    if (isGroup && groupContext.value !== undefined) {
      setStore(groupContext.value)
    } else if (!isGroup && valueProp !== undefined) {
      setStore(valueProp)
    }
  }, [valueProp, isGroup, groupContext?.value])

  const isChecked = store === label

  const radioClasses = classNames(
    'at-radio',
    className
  )

  const innerClasses = classNames(
    'at-radio__inner',
    {
      'at-radio--focus': focus,
      'at-radio--checked': isChecked,
      'at-radio--disabled': disabled
    }
  )

  const handleChange = (evt) => {
    if (disabled) return

    const newValue = label
    setStore(newValue)

    if (onChange) {
      onChange(newValue, evt)
    }

    if (isGroup && groupContext.onChange) {
      groupContext.onChange(newValue)
    }
  }

  const handleFocus = () => setFocus(true)
  const handleBlur = () => setFocus(false)

  return (
    <label className={radioClasses}>
      <span className="at-radio__input">
        <span className={innerClasses} />
        <input
          type="radio"
          className="at-radio__original"
          name={name}
          value={label}
          checked={isChecked}
          disabled={disabled}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...restProps}
        />
      </span>
      <span className="at-radio__label">
        {children || label}
      </span>
    </label>
  )
}

Radio.displayName = 'AtRadio'

export default Radio

