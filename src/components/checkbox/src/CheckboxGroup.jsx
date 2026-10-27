import React from 'react'
import classNames from 'classnames'
import { CheckboxGroupContext } from './Checkbox'
import { useFormItem } from '../../../hooks/useFormItem'
import { useSyncedState } from '../../../hooks/useSyncedState'

const CheckboxGroup = (props) => {
  const {
    value: valueProp,
    defaultValue,
    disabled = false,
    onChange,
    className,
    children,
    ...restProps
  } = props

  const [value, setValue] = useSyncedState(valueProp, defaultValue || [])
  const formItem = useFormItem()

  const handleChange = (label, checked) => {
    const current = Array.isArray(value) ? value : []
    let next

    if (checked) {
      next = current.includes(label) ? current : [...current, label]
    } else {
      next = current.filter(item => item !== label)
    }

    setValue(next)
    if (onChange) onChange(next)
    if (formItem) formItem.onChange(next)
  }

  return (
    <CheckboxGroupContext.Provider value={{ value, disabled, onChange: handleChange }}>
      <div className={classNames('at-checkbox-group', className)} {...restProps}>
        {children}
      </div>
    </CheckboxGroupContext.Provider>
  )
}

CheckboxGroup.displayName = 'AtCheckboxGroup'

export default CheckboxGroup
