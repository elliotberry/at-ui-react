import React, { useContext } from 'react'
import classNames from 'classnames'
import { StepsContext } from './Steps'
import styles from './Step.module.scss'

const Step = (props) => {
  const {
    title,
    icon,
    description,
    status: statusProp,
    className,
    ...restProps
  } = props

  const context = useContext(StepsContext)
  
  if (!context) {
    console.warn('Step must be used within Steps')
    return null
  }

  const { current, status: contextStatus, direction, steps } = context
  // Index will be set by parent Steps component
  const index = 0 // Placeholder - would be set by parent

  const finalStatus = statusProp || (() => {
    if (index === current) {
      return contextStatus === 'error' ? 'error' : 'process'
    } else if (index < current) {
      return 'finish'
    }
    return 'wait'
  })()

  const isLastStep = index === steps.length - 1

  const stepClasses = classNames(
    'at-step',
    {
      'at-step--process': finalStatus === 'process',
      'at-step--wait': finalStatus === 'wait',
      'at-step--finish': finalStatus === 'finish',
      'at-step--error': finalStatus === 'error'
    },
    className
  )

  const stepStyle = direction !== 'vertical' && steps.length > 0
    ? { width: `${100 / steps.length}%` }
    : {}

  return (
    <div className={stepClasses} style={stepStyle} {...restProps}>
      {!isLastStep && <div className="at-step__line" />}
      <div className="at-step__head">
        <div className={classNames('at-step__label', { 'at-step__icon': icon })}>
          {icon ? (
            <i className={`icon ${icon}`} />
          ) : (
            <>
              {['process', 'wait'].includes(finalStatus) && (
                <div className="at-step__order">{index + 1}</div>
              )}
              {finalStatus === 'finish' && <i className="icon icon-check" />}
              {finalStatus === 'error' && <i className="icon icon-x" />}
            </>
          )}
        </div>
      </div>
      <div className="at-step__main">
        <div className="at-step__title">{title}</div>
        {description && <div className="at-step__description">{description}</div>}
      </div>
    </div>
  )
}

Step.displayName = 'AtStep'

export default Step

