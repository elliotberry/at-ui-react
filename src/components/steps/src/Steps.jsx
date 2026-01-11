import React, { useState, useEffect, createContext } from 'react'
import classNames from 'classnames'

export const StepsContext = createContext(null)

const Steps = (props) => {
  const {
    current = 0,
    status = 'process',
    size = 'default',
    direction = 'horizontal',
    className,
    children,
    ...restProps
  } = props

  const [steps, setSteps] = useState([])

  useEffect(() => {
    const stepArray = React.Children.toArray(children).filter(
      child => child.type?.displayName === 'AtStep'
    )
    setSteps(stepArray.map((_, index) => ({ index })))
  }, [children])

  const stepsClasses = classNames(
    'at-steps',
    {
      'at-steps--vertical': direction === 'vertical',
      'at-steps--horizontal': direction === 'horizontal',
      'at-steps--small': size === 'small'
    },
    className
  )

  const contextValue = {
    current,
    status,
    direction,
    steps
  }

  return (
    <StepsContext.Provider value={contextValue}>
      <div className={stepsClasses} {...restProps}>
        {children}
      </div>
    </StepsContext.Provider>
  )
}

Steps.displayName = 'AtSteps'

export default Steps

