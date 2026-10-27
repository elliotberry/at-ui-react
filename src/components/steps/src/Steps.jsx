import React, { createContext } from 'react'
import classNames from 'classnames'

export const StepsContext = createContext(null)

const isStep = (child) =>
  React.isValidElement(child) && child.type && child.type.displayName === 'AtStep'

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

  const total = React.Children.toArray(children).filter(isStep).length
  let index = -1

  const stepsClasses = classNames(
    'at-steps',
    {
      'at-steps--vertical': direction === 'vertical',
      'at-steps--horizontal': direction !== 'vertical',
      'at-steps--small': size === 'small'
    },
    className
  )

  return (
    <div className={stepsClasses} {...restProps}>
      {React.Children.toArray(children).map((child) => {
        if (!isStep(child)) return child

        index += 1
        const value = {
          index,
          total,
          current,
          status,
          direction,
          nextError: status === 'error' && index === current - 1
        }

        return (
          <StepsContext.Provider key={child.key || index} value={value}>
            {child}
          </StepsContext.Provider>
        )
      })}
    </div>
  )
}

Steps.displayName = 'AtSteps'

export default Steps
