import React, { useContext } from 'react'
import classNames from 'classnames'
import { RadioGroupContext } from './Radio'

const RadioButton = (props) => {
  const {
    name,
    label,
    disabled = false,
    className,
    children,
    ...restProps
  } = props

  const groupContext = useContext(RadioGroupContext)

  if (!groupContext) {
    console.warn('RadioButton must be used within RadioGroup')
    return null
  }

  const { value, size, fill, textColor, onChange } = groupContext
  const isChecked = value === label
  const isDisabled = disabled || groupContext.disabled

  const activeStyle = isChecked
    ? {
        ...(fill && { backgroundColor: fill, borderColor: fill }),
        ...(textColor && { color: textColor })
      }
    : undefined

  const radioButtonClasses = classNames(
    'at-radio-button',
    {
      [`at-radio-button--${size}`]: size,
      'at-radio--checked': isChecked,
      'at-radio--disabled': isDisabled
    },
    className
  )

  return (
    <label className={radioButtonClasses}>
      <input
        type="radio"
        className="at-radio-button__original"
        name={name}
        value={label}
        checked={isChecked}
        disabled={isDisabled}
        {...restProps}
        onChange={() => !isDisabled && onChange(label)}
      />
      <span className="at-radio-button__inner" style={activeStyle}>
        {children !== undefined ? children : label}
      </span>
    </label>
  )
}

RadioButton.displayName = 'AtRadioButton'

export default RadioButton
