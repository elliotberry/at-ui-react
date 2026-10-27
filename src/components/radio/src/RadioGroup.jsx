import React from 'react'
import classNames from 'classnames'
import { RadioGroupContext } from './Radio'
import { useFormItem } from '../../../hooks/useFormItem'
import { useSyncedState } from '../../../hooks/useSyncedState'

const RadioGroup = (props) => {
  const {
    value: valueProp,
    defaultValue,
    size,
    fill,
    textColor,
    disabled = false,
    onChange,
    className,
    children,
    ...restProps
  } = props

  const [value, setValue] = useSyncedState(valueProp, defaultValue)
  const formItem = useFormItem()

  const handleChange = (newValue) => {
    if (newValue === value) return
    setValue(newValue)
    if (onChange) onChange(newValue)
    if (formItem) formItem.onChange(newValue)
  }

  return (
    <RadioGroupContext.Provider value={{ value, size, fill, textColor, disabled, onChange: handleChange }}>
      <div className={classNames('at-radio-group', className)} {...restProps}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

RadioGroup.displayName = 'AtRadioGroup'

export default RadioGroup
