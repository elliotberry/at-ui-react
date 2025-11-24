import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { RadioGroupContext } from './Radio'
import styles from './RadioGroup.module.scss'

const RadioGroup = (props) => {
  const {
    value: valueProp,
    size,
    fill,
    textColor,
    onChange,
    className,
    children,
    ...restProps
  } = props

  const [value, setValue] = useState(valueProp)

  useEffect(() => {
    setValue(valueProp)
  }, [valueProp])

  const handleChange = (newValue) => {
    setValue(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  const contextValue = {
    value,
    size,
    fill,
    textColor,
    onChange: handleChange
  }

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div className={classNames('at-radio-group', className)} {...restProps}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

RadioGroup.displayName = 'AtRadioGroup'

export default RadioGroup

