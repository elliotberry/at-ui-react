import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { CheckboxGroupContext } from './Checkbox'
import styles from './CheckboxGroup.module.scss'

const CheckboxGroup = (props) => {
  const {
    value: valueProp = [],
    onChange,
    className,
    children,
    ...restProps
  } = props

  const [value, setValue] = useState(valueProp)

  useEffect(() => {
    setValue(valueProp)
  }, [valueProp])

  const handleChange = (label, checked) => {
    let newValue = [...value]
    
    if (checked) {
      if (!newValue.includes(label)) {
        newValue.push(label)
      }
    } else {
      newValue = newValue.filter(item => item !== label)
    }

    setValue(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  const contextValue = {
    value,
    onChange: handleChange
  }

  return (
    <CheckboxGroupContext.Provider value={contextValue}>
      <div className={classNames('at-checkbox-group', className)} {...restProps}>
        {children}
      </div>
    </CheckboxGroupContext.Provider>
  )
}

CheckboxGroup.displayName = 'AtCheckboxGroup'

export default CheckboxGroup

