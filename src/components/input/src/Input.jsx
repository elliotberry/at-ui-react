import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { useFormItem } from '../../../hooks/useFormItem'
import styles from './Input.module.scss'

const Input = React.forwardRef((props, ref) => {
  const {
    type = 'text',
    value: valueProp,
    name,
    placeholder,
    size,
    status,
    icon,
    prependButton = false,
    appendButton = false,
    readonly = false,
    disabled = false,
    autofocus = false,
    maxlength,
    minlength,
    max,
    min,
    className,
    prepend,
    append,
    onChange,
    onFocus,
    onBlur,
    ...restProps
  } = props

  const [currentValue, setCurrentValue] = useState(valueProp || '')
  const inputRef = ref || useRef(null)
  const formItem = useFormItem()

  useEffect(() => {
    if (valueProp !== currentValue) {
      setCurrentValue(valueProp || '')
    }
  }, [valueProp])

  const iconClassMap = {
    'success': 'icon-success',
    'error': 'icon-error',
    'warning': 'icon-warning',
    'info': 'icon-info'
  }

  const iconClass = icon ? `icon-${icon}` : (status ? iconClassMap[status] : '')

  const inputClasses = classNames(
    'at-input',
    {
      [`at-input--${size}`]: size,
      [`at-input--${status}`]: status,
      'at-input-group': prepend || append,
      'at-input--disabled': disabled,
      'at-input--prepend': prepend,
      'at-input--append': append,
      'at-input--icon': icon
    },
    className
  )

  const handleFocus = (evt) => {
    if (onFocus) {
      onFocus(evt)
    }
  }

  const handleBlur = (evt) => {
    if (onBlur) {
      onBlur(evt)
    }
    if (formItem && formItem.onBlur) {
      formItem.onBlur(currentValue)
    }
  }

  const handleInput = (evt) => {
    const newValue = evt.target.value
    setCurrentValue(newValue)

    if (onChange) {
      // Support both React standard (event) and custom (value) onChange signatures
      if (onChange.length === 1) {
        onChange(evt)
      } else {
        onChange(newValue, evt)
      }
    }

    if (formItem && formItem.onChange) {
      formItem.onChange(newValue)
    }
  }

  return (
    <div className={inputClasses}>
      {prepend && (
        <div className={classNames('at-input-group__prepend', {
          'at-input-group--button': prependButton
        })}>
          {prepend}
        </div>
      )}

      <input
        ref={inputRef}
        className="at-input__original"
        type={type}
        name={name}
        value={currentValue}
        placeholder={placeholder}
        min={min}
        max={max}
        minLength={minlength}
        maxLength={maxlength}
        disabled={disabled}
        readOnly={readonly}
        autoFocus={autofocus}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleInput}
        {...restProps}
      />

      {iconClass && (
        <i className={`at-input__icon icon ${iconClass}`} />
      )}

      {append && (
        <div className={classNames('at-input-group__append', {
          'at-input-group--button': appendButton
        })}>
          {append}
        </div>
      )}
    </div>
  )
})

Input.displayName = 'AtInput'

export default Input

