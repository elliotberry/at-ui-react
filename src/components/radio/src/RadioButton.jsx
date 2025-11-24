import React, { useContext } from 'react'
import classNames from 'classnames'
import { RadioGroupContext } from './Radio'
import './radio-button.scss'

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

  const activeStyle = isChecked ? {
    ...(fill && {
      backgroundColor: fill,
      borderColor: fill
    }),
    ...(textColor && {
      color: textColor
    })
  } : null

  const radioButtonClasses = classNames(
    'at-radio-button',
    {
      [`at-radio-button--${size}`]: size,
      'at-radio--checked': isChecked
    },
    className
  )

  const handleChange = (evt) => {
    if (disabled) return
    if (onChange) {
      onChange(label)
    }
  }

  return (
    <label className={radioButtonClasses}>
      <input
        type="radio"
        className="at-radio-button__original"
        name={name}
        value={label}
        checked={isChecked}
        disabled={disabled}
        onChange={handleChange}
        {...restProps}
      />
      <span className="at-radio-button__inner" style={activeStyle}>
        {children || label}
      </span>
    </label>
  )
}

RadioButton.displayName = 'AtRadioButton'

export default RadioButton

