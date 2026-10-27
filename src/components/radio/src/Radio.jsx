import React, { useContext, useState, createContext } from 'react'
import classNames from 'classnames'
import { useFormItem } from '../../../hooks/useFormItem'
import { useSyncedState } from '../../../hooks/useSyncedState'

export const RadioGroupContext = createContext(null)

/**
 * `label` is the option's value. Standalone, `value` is the currently
 * selected label; inside a RadioGroup the group's `value` is used.
 */
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
  const formItem = useFormItem()
  const isGroup = !!groupContext

  const [focus, setFocus] = useState(false)
  const [standaloneValue, setStandaloneValue] = useSyncedState(valueProp, undefined)

  const selected = isGroup ? groupContext.value : standaloneValue
  const isChecked = selected === label
  const isDisabled = disabled || (isGroup && groupContext.disabled)

  const handleChange = (evt) => {
    if (isDisabled) return

    if (isGroup) {
      groupContext.onChange(label)
    } else {
      setStandaloneValue(label)
      if (formItem) formItem.onChange(label)
    }
    if (onChange) onChange(label, evt)
  }

  return (
    <label className={classNames('at-radio', className)}>
      <span className="at-radio__input">
        <span
          className={classNames('at-radio__inner', {
            'at-radio--focus': focus,
            'at-radio--checked': isChecked,
            'at-radio--disabled': isDisabled
          })}
        />
        <input
          type="radio"
          className="at-radio__original"
          name={name}
          value={label}
          checked={isChecked}
          disabled={isDisabled}
          {...restProps}
          onChange={handleChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
      </span>
      <span className="at-radio__label">
        {children !== undefined ? children : label}
      </span>
    </label>
  )
}

Radio.displayName = 'AtRadio'

export default Radio
