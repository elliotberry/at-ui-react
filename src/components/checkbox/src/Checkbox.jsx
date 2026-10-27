import React, { useContext, useState, createContext } from 'react'
import classNames from 'classnames'
import { useFormItem } from '../../../hooks/useFormItem'
import { useSyncedState } from '../../../hooks/useSyncedState'

export const CheckboxGroupContext = createContext(null)

/**
 * Standalone: `value` (or `checked`) is a boolean, `onChange(checked, evt)`.
 * Inside a CheckboxGroup: `label` identifies the option in the group's array.
 */
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
  const formItem = useFormItem()
  const isGroup = !!groupContext

  const [standaloneChecked, setStandaloneChecked] = useSyncedState(
    valueProp !== undefined ? valueProp : checkedProp,
    false
  )
  const [focus, setFocus] = useState(false)

  const checked = isGroup
    ? Array.isArray(groupContext.value) && groupContext.value.includes(label)
    : !!standaloneChecked

  const isDisabled = disabled || (isGroup && groupContext.disabled)

  const checkboxClasses = classNames(
    'at-checkbox',
    {
      'at-checkbox--focus': focus,
      'at-checkbox--checked': checked,
      'at-checkbox--disabled': isDisabled
    },
    className
  )

  const handleChange = (evt) => {
    if (isDisabled) return

    const nextChecked = evt.target.checked

    if (isGroup) {
      groupContext.onChange(label, nextChecked)
    } else {
      setStandaloneChecked(nextChecked)
      if (formItem) formItem.onChange(nextChecked)
    }
    if (onChange) onChange(nextChecked, evt)
  }

  return (
    <label className={checkboxClasses}>
      <span className="at-checkbox__input">
        <span className="at-checkbox__inner" />
        <input
          type="checkbox"
          className="at-checkbox__original"
          name={name}
          value={isGroup ? label : undefined}
          checked={checked}
          disabled={isDisabled}
          {...restProps}
          onChange={handleChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
      </span>
      <span className="at-checkbox__label">
        {children !== undefined ? children : label}
      </span>
    </label>
  )
}

Checkbox.displayName = 'AtCheckbox'

export default Checkbox
