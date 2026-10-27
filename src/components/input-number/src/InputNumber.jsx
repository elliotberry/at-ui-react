import React, { useState } from 'react'
import classNames from 'classnames'
import { useFormItem } from '../../../hooks/useFormItem'
import { useSyncedState } from '../../../hooks/useSyncedState'

// Avoid binary floating point artefacts such as 0.1 + 0.2 = 0.30000000000000004
const decimals = (num) => {
  const part = String(num).split('.')[1]
  return part ? part.length : 0
}

const calculate = (num, step, symbol) => {
  const quantity = Math.pow(10, Math.max(decimals(num), decimals(step)))
  const a = Math.round(num * quantity)
  const b = Math.round(step * quantity)
  return (symbol === '+' ? a + b : a - b) / quantity
}

/**
 * Numeric stepper. `onChange` receives the new numeric value.
 */
const InputNumber = React.forwardRef((props, ref) => {
  const {
    value: valueProp,
    defaultValue,
    size = 'normal',
    step = 1,
    disabled = false,
    name,
    readonly = false,
    autofocus = false,
    max,
    min,
    className,
    onChange,
    onFocus,
    onBlur,
    ...restProps
  } = props

  const [currentValue, setCurrentValue] = useSyncedState(valueProp, defaultValue !== undefined ? defaultValue : 0)
  // Text shown while the user is typing (may be empty or partial like "1.")
  const [draft, setDraft] = useState(null)
  const formItem = useFormItem()

  const stepNum = Number(step) || 1
  const hasMax = max !== undefined && max !== null
  const hasMin = min !== undefined && min !== null
  const numeric = Number(currentValue) || 0
  const upDisabled = hasMax && numeric + stepNum > max
  const downDisabled = hasMin && numeric - stepNum < min

  const commit = (value) => {
    if (hasMax && value > max) return false
    if (hasMin && value < min) return false
    setCurrentValue(value)
    if (onChange) onChange(value)
    if (formItem) formItem.onChange(value)
    return true
  }

  const stepBy = (symbol) => {
    if (disabled || readonly) return
    setDraft(null)
    commit(calculate(numeric, stepNum, symbol))
  }

  const handleInput = (evt) => {
    const text = evt.target.value
    setDraft(text)

    const num = Number(text)
    if (text !== '' && !Number.isNaN(num)) {
      commit(num)
    }
  }

  const handleBlur = (evt) => {
    // Out-of-range text snaps to the nearest bound; partial text such as "1."
    // or an empty field falls back to the last valid value.
    let finalValue = currentValue
    const num = Number(draft)
    if (draft !== null && draft !== '' && !Number.isNaN(num)) {
      let clamped = num
      if (hasMax && clamped > max) clamped = Number(max)
      if (hasMin && clamped < min) clamped = Number(min)
      if (clamped !== currentValue) commit(clamped)
      finalValue = clamped
    }
    setDraft(null)
    if (onBlur) onBlur(evt)
    if (formItem) formItem.onBlur(finalValue)
  }

  const handleKeyDown = (evt) => {
    if (evt.key === 'ArrowUp') {
      evt.preventDefault()
      evt.stopPropagation()
      stepBy('+')
    } else if (evt.key === 'ArrowDown') {
      evt.preventDefault()
      evt.stopPropagation()
      stepBy('-')
    }
  }

  const classes = classNames(
    'at-input-number',
    {
      [`at-input-number--${size}`]: size,
      'at-input-number--disabled': disabled
    },
    className
  )

  return (
    <div className={classes}>
      <div className="at-input-number__input">
        <input
          ref={ref}
          type="number"
          className="at-input-number__original"
          value={draft !== null ? draft : currentValue}
          name={name}
          disabled={disabled}
          readOnly={readonly}
          max={max}
          min={min}
          step={stepNum}
          autoFocus={autofocus}
          {...restProps}
          onFocus={onFocus}
          onBlur={handleBlur}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="at-input-number__handler">
        <span
          className={classNames('at-input-number__up', {
            'at-input-number__up--disabled': upDisabled
          })}
          onClick={() => !upDisabled && stepBy('+')}
        >
          <i className="icon icon-chevron-up" />
        </span>
        <span
          className={classNames('at-input-number__down', {
            'at-input-number__down--disabled': downDisabled
          })}
          onClick={() => !downDisabled && stepBy('-')}
        >
          <i className="icon icon-chevron-down" />
        </span>
      </div>
    </div>
  )
})

InputNumber.displayName = 'AtInputNumber'

export default InputNumber
