import React from 'react'
import Input from '../../input/src/Input'

// InputNumber is a specialized Input component
// This is a basic implementation - can be enhanced later
const InputNumber = (props) => {
  const {
    min,
    max,
    step = 1,
    precision,
    value,
    onChange,
    ...restProps
  } = props

  const handleChange = (evt) => {
    const inputValue = evt.target.value
    let numValue = parseFloat(inputValue)

    if (isNaN(numValue)) {
      if (onChange) onChange(evt)
      return
    }

    if (min !== undefined && numValue < min) {
      numValue = min
    }
    if (max !== undefined && numValue > max) {
      numValue = max
    }

    if (precision !== undefined) {
      numValue = parseFloat(numValue.toFixed(precision))
    }

    if (onChange) {
      const syntheticEvent = {
        ...evt,
        target: {
          ...evt.target,
          value: numValue
        }
      }
      onChange(syntheticEvent)
    }
  }

  return (
    <Input
      type="number"
      value={value}
      onChange={handleChange}
      min={min}
      max={max}
      step={step}
      {...restProps}
    />
  )
}

InputNumber.displayName = 'AtInputNumber'

export default InputNumber

