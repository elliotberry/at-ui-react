import React, { createContext } from 'react'
import classNames from 'classnames'

export const ButtonGroupContext = createContext({})

const ButtonGroup = (props) => {
  const {
    size,
    gap = -1,
    className,
    children,
    ...restProps
  } = props

  const buttonGroupClasses = classNames(
    'at-btn-group',
    {
      [`at-btn-group--${size}`]: size
    },
    className
  )

  const contextValue = {
    size,
    gap
  }

  return (
    <ButtonGroupContext.Provider value={contextValue}>
      <div className={buttonGroupClasses} {...restProps}>
        {children}
      </div>
    </ButtonGroupContext.Provider>
  )
}

ButtonGroup.displayName = 'AtButtonGroup'

export default ButtonGroup

