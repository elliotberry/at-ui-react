import React from 'react'
import classNames from 'classnames'
import { useFormItem } from '../../../hooks/useFormItem'
import { useSyncedState } from '../../../hooks/useSyncedState'

const STATUS_ICONS = {
  success: 'icon-check-circle',
  error: 'icon-x-circle',
  warning: 'icon-alert-circle',
  info: 'icon-info'
}

/**
 * Text input. `onChange` receives the native change event, like any React
 * input (read the new value from `evt.target.value`).
 */
const Input = React.forwardRef((props, ref) => {
  const {
    type = 'text',
    value: valueProp,
    defaultValue,
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

  const [currentValue, setCurrentValue] = useSyncedState(valueProp, defaultValue !== undefined ? defaultValue : '')
  const formItem = useFormItem()

  const iconClass = icon ? `icon-${icon}` : (status ? STATUS_ICONS[status] : '')

  const inputClasses = classNames(
    'at-input',
    {
      [`at-input--${size}`]: size,
      [`at-input--${status}`]: status,
      'at-input-group': prepend || append,
      'at-input--disabled': disabled,
      'at-input--prepend': prepend,
      'at-input--append': append,
      'at-input--icon': iconClass
    },
    className
  )

  const handleBlur = (evt) => {
    if (onBlur) onBlur(evt)
    if (formItem) formItem.onBlur(currentValue)
  }

  const handleChange = (evt) => {
    const newValue = evt.target.value
    setCurrentValue(newValue)
    if (onChange) onChange(evt)
    if (formItem) formItem.onChange(newValue)
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
        ref={ref}
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
        {...restProps}
        onFocus={onFocus}
        onBlur={handleBlur}
        onChange={handleChange}
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
