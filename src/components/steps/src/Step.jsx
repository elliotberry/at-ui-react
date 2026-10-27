import React, { useContext } from 'react'
import classNames from 'classnames'
import { StepsContext } from './Steps'

const Step = (props) => {
  const {
    title,
    icon,
    description,
    status: statusProp,
    className,
    style,
    ...restProps
  } = props

  const context = useContext(StepsContext)

  if (!context) {
    console.warn('Step must be used within Steps')
    return null
  }

  const { index, total, current, status: stepsStatus, direction, nextError } = context

  let internalStatus
  if (index === current) {
    internalStatus = stepsStatus === 'error' ? 'error' : 'process'
  } else if (index < current) {
    internalStatus = 'finish'
  } else {
    internalStatus = 'wait'
  }

  const finalStatus = statusProp || internalStatus
  const isLastStep = index === total - 1

  const stepClasses = classNames(
    'at-step',
    {
      'at-step--process': finalStatus === 'process',
      'at-step--wait': finalStatus === 'wait',
      'at-step--finish': finalStatus === 'finish',
      'at-step--error': finalStatus === 'error',
      'at-step--next-error': nextError
    },
    className
  )

  const stepStyle = direction !== 'vertical' && total > 0
    ? { width: `${100 / total}%`, ...style }
    : style

  return (
    <div className={stepClasses} style={stepStyle} {...restProps}>
      {!isLastStep && <div className="at-step__line" />}
      <div className="at-step__head">
        <div className={classNames('at-step__label', { 'at-step__icon': icon })}>
          {icon ? (
            <div><i className={`icon ${icon}`} /></div>
          ) : (
            <>
              {['process', 'wait'].includes(finalStatus) && (
                <div className="at-step__order">{index + 1}</div>
              )}
              {finalStatus === 'finish' && <div><i className="icon icon-check" /></div>}
              {finalStatus === 'error' && <div><i className="icon icon-x" /></div>}
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
